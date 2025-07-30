'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Participante } from '@/lib/supabase'
import { generateQRCode } from '@/lib/qr-tiger'

export default function BilhetePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [participante, setParticipante] = useState<Participante | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) {
      setError('ID do participante não encontrado')
      setLoading(false)
      return
    }

    loadParticipante()
  }, [id])

  const loadParticipante = async () => {
    try {
      console.log('🔄 Carregando participante:', id)
      
      // Busca participante no Supabase
      const { data, error: supabaseError } = await supabase
        .from('participantes')
        .select('*')
        .eq('identificador', id)
        .single()

      if (supabaseError || !data) {
        console.error('❌ Erro ao buscar participante:', supabaseError)
        setError('Participante não encontrado')
        setLoading(false)
        return
      }

      console.log('✅ Participante encontrado:', data.nome)
      setParticipante(data)

      // Gera QR Code
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const checkinUrl = `${siteUrl}/checkin?id=${id}`
      
      console.log('🔄 Gerando QR Code para URL:', checkinUrl)
      const qrUrl = await generateQRCode(checkinUrl)
      setQrCodeUrl(qrUrl)
      console.log('✅ QR Code definido:', qrUrl)

    } catch (error) {
      console.error('❌ Erro ao carregar participante:', error)
      setError('Erro ao carregar informações do bilhete')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots text-neon-purple text-2xl mb-4">
            Gerando bilhete
          </div>
          <div className="text-gray-400">
            Processando dados do operador...
          </div>
        </div>
      </div>
    )
  }

  if (error || !participante) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6 max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ ERRO</div>
          <div className="text-white mb-4">{error}</div>
          <a 
            href="/"
            className="bg-neon-purple hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-90 border border-neon-purple rounded-lg p-8 max-w-md w-full neon-border">
        {/* Header do Bilhete */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-neon-purple glitch" data-text="🎟️ BILHETE DIGITAL">
            🎟️ BILHETE DIGITAL
          </h1>
          <div className="text-sm text-gray-400 mt-2">
            THE HAYEK PARTY • 02/07 • 16H
          </div>
        </div>

        {/* Informações do Participante */}
        <div className="border border-neon-green rounded-lg p-4 mb-6 neon-border">
          <div className="text-neon-green text-sm mb-2">
            &gt; OPERADOR CONFIRMADO:
          </div>
          <div className="text-white text-lg font-bold">
            {participante.nome.toUpperCase()} {participante.sobrenome.toUpperCase()}
          </div>
          <div className="text-gray-400 text-xs mt-1">
            ID: {participante.identificador}
          </div>
        </div>

        {/* QR Code - Melhorado */}
        <div className="text-center mb-6">
          <div className="qr-container inline-block">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code de entrada"
                className="w-48 h-48 mx-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center">
                  <div className="loading-dots text-gray-500 text-sm mb-2">
                    Gerando QR Code
                  </div>
                  <div className="text-xs text-gray-400">
                    Aguarde...
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-sm text-neon-blue mt-3">
            📱 Apresente este QR Code na entrada
          </div>
        </div>

        {/* Instruções */}
        <div className="border border-yellow-500 rounded-lg p-4 mb-6">
          <div className="text-yellow-500 text-sm mb-2">
            📋 INSTRUÇÕES DE ENTRADA:
          </div>
          <div className="text-xs space-y-1 text-gray-300">
            <div>• Chegue até às 20:00h</div>
            <div>• Apresente este QR Code</div>
            <div>• Dress code: Black And White</div>
            {participante.nome.toLowerCase().includes('mulher') ? (
              <div className="text-neon-green">• Entrada GRATUITA</div>
            ) : (
              <div className="text-neon-purple">• Entrada: R$ 25,00</div>
            )}
          </div>
        </div>

        {/* Botões de Ação - Com classe no-print */}
        <div className="space-y-3 no-print">
          <button
            onClick={() => window.print()}
            className="w-full bg-neon-blue hover:bg-blue-600 text-white py-2 rounded transition-colors"
          >
            🖨️ IMPRIMIR BILHETE
          </button>
          
          <div className="flex space-x-3">
            <a
              href="/"
              className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
            >
              🏠 INÍCIO
            </a>
            <button
              onClick={() => {
                const text = `Confirmei presença no THE HAYEK PARTY! 🎉\n02/07 às 16h no Salgueiro\n\n${window.location.href}`
                navigator.share ? 
                  navigator.share({ title: 'THE HAYEK PARTY', text, url: window.location.href }) :
                  navigator.clipboard.writeText(text)
              }}
              className="flex-1 bg-neon-green hover:bg-green-600 text-white py-2 rounded transition-colors"
            >
              📤 COMPARTILHAR
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Status: {participante.checkin ? '✅ Check-in realizado' : '⏳ Aguardando entrada'}
        </div>
      </div>
    </div>
  )
} 