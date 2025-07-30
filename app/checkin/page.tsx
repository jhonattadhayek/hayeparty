'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Participante } from '@/lib/supabase'

export default function CheckinPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [participante, setParticipante] = useState<Participante | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkinStatus, setCheckinStatus] = useState<'loading' | 'success' | 'already_checked' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) {
      setError('ID do participante não encontrado')
      setCheckinStatus('error')
      setLoading(false)
      return
    }

    performCheckin()
  }, [id])

  const performCheckin = async () => {
    try {
      // 1. Busca participante
      const { data: participanteData, error: fetchError } = await supabase
        .from('participantes')
        .select('*')
        .eq('identificador', id)
        .single()

      if (fetchError || !participanteData) {
        setError('Participante não encontrado no sistema')
        setCheckinStatus('error')
        setLoading(false)
        return
      }

      setParticipante(participanteData)

      // 2. Verifica se já fez check-in
      if (participanteData.checkin) {
        setCheckinStatus('already_checked')
        setLoading(false)
        return
      }

      // 3. Realiza o check-in
      const { error: updateError } = await supabase
        .from('participantes')
        .update({ 
          checkin: true,
          checkin_time: new Date().toISOString()
        })
        .eq('identificador', id)

      if (updateError) {
        throw updateError
      }

      // 4. Atualiza o estado local
      setParticipante(prev => prev ? { ...prev, checkin: true, checkin_time: new Date().toISOString() } : null)
      setCheckinStatus('success')

    } catch (error) {
      console.error('Erro no check-in:', error)
      setError('Erro ao realizar check-in. Tente novamente.')
      setCheckinStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots text-neon-purple text-2xl mb-4">
            Processando check-in
          </div>
          <div className="text-gray-400">
            Validando entrada do operador...
          </div>
        </div>
      </div>
    )
  }

  // Tela de sucesso do check-in
  if (checkinStatus === 'success' && participante) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-green-900 bg-opacity-50 border border-neon-green rounded-lg p-8 max-w-md w-full neon-border text-center">
          <div className="text-6xl mb-4">✅</div>
          
          <h1 className="text-2xl font-bold text-neon-green mb-4 glitch" data-text="CHECK-IN CONFIRMADO">
            CHECK-IN CONFIRMADO
          </h1>
          
          <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
            <div className="text-neon-green text-sm mb-2">
              &gt; OPERADOR VALIDADO:
            </div>
            <div className="text-white text-xl font-bold">
              {participante.nome.toUpperCase()} {participante.sobrenome.toUpperCase()}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Check-in realizado em: {formatDateTime(participante.checkin_time || new Date().toISOString())}
            </div>
          </div>

          <div className="border border-neon-blue rounded-lg p-4 mb-6">
            <div className="text-neon-blue text-sm mb-2">
              🎯 MISSÃO ATIVA:
            </div>
            <div className="text-sm space-y-1">
              <div>THE HAYEK PARTY</div>
              <div>02/08 • 16:00h • Salgueiro</div>
              <div>DJ TOM comandando a pista</div>
            </div>
          </div>

          <div className="text-neon-purple text-sm mb-4">
            Bem-vindo à festa! 🎉
          </div>

          <a 
            href="/"
            className="bg-neon-purple hover:bg-purple-600 text-white px-6 py-2 rounded transition-colors"
          >
            🏠 VOLTAR AO INÍCIO
          </a>
        </div>
      </div>
    )
  }

  // Tela de já fez check-in
  if (checkinStatus === 'already_checked' && participante) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-8 max-w-md w-full neon-border text-center">
          <div className="text-6xl mb-4">⚠️</div>
          
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">
            CHECK-IN JÁ REALIZADO
          </h1>
          
          <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
            <div className="text-yellow-500 text-sm mb-2">
              &gt; OPERADOR:
            </div>
            <div className="text-white text-xl font-bold">
              {participante.nome.toUpperCase()} {participante.sobrenome.toUpperCase()}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Check-in anterior: {participante.checkin_time ? formatDateTime(participante.checkin_time) : 'Não registrado'}
            </div>
          </div>

          <div className="text-gray-400 text-sm mb-4">
            Este QR Code já foi utilizado para entrada.
          </div>

          <a 
            href="/"
            className="bg-neon-purple hover:bg-purple-600 text-white px-6 py-2 rounded transition-colors"
          >
            🏠 VOLTAR AO INÍCIO
          </a>
        </div>
      </div>
    )
  }

  // Tela de erro
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-8 max-w-md w-full neon-border text-center">
        <div className="text-6xl mb-4">❌</div>
        
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          ERRO NO CHECK-IN
        </h1>
        
        <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
          <div className="text-red-500 text-sm mb-2">
            &gt; ERRO DETECTADO:
          </div>
          <div className="text-white text-sm">
            {error}
          </div>
        </div>

        <div className="text-gray-400 text-sm mb-4">
          Verifique o QR Code ou entre em contato com a organização.
        </div>

        <div className="flex space-x-3">
          <a 
            href="/"
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            🏠 INÍCIO
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-neon-purple hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
          >
            🔄 TENTAR NOVAMENTE
          </button>
        </div>
      </div>
    </div>
  )
} 