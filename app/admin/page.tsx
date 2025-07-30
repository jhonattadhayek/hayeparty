'use client'

import React, { useState, useEffect } from 'react'
import { supabase, Participante } from '@/lib/supabase'

export default function AdminPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [loading, setLoading] = useState(true)
  const [senha, setSenha] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    pendentes: 0
  })

  // Senha simples para acesso (mude para algo mais seguro)
  const SENHA_ADMIN = 'hayek2024'

  useEffect(() => {
    if (autenticado) {
      loadParticipantes()
      // Atualiza a cada 30 segundos
      const interval = setInterval(loadParticipantes, 30000)
      return () => clearInterval(interval)
    }
  }, [autenticado])

  const loadParticipantes = async () => {
    try {
      const { data, error } = await supabase
        .from('participantes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setParticipantes(data || [])
      
      // Calcula estatísticas
      const total = data?.length || 0
      const checkedIn = data?.filter(p => p.checkin).length || 0
      const pendentes = total - checkedIn

      setStats({ total, checkedIn, pendentes })
    } catch (error) {
      console.error('Erro ao carregar participantes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (senha === SENHA_ADMIN) {
      setAutenticado(true)
    } else {
      alert('Senha incorreta!')
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Tela de login
  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-90 border border-neon-purple rounded-lg p-8 max-w-md w-full neon-border">
          <h1 className="text-2xl font-bold text-neon-purple mb-6 text-center glitch" data-text="🔐 ADMIN ACCESS">
            🔐 ADMIN ACCESS
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-neon-green mb-2">
                &gt; SENHA_ADMIN:
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-black border border-neon-purple rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                placeholder="Digite a senha de admin"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-neon-purple hover:bg-purple-600 text-white py-2 rounded transition-colors neon-pulse"
            >
              🚀 ACESSAR SISTEMA
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <a href="/" className="text-gray-400 hover:text-white text-sm">
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Painel administrativo
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black bg-opacity-90 border border-neon-purple rounded-lg p-6 mb-6 neon-border">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-neon-purple glitch" data-text="🎯 THE HAYEK PARTY - ADMIN">
              🎯 THE HAYEK PARTY - ADMIN
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={loadParticipantes}
                className="bg-neon-green hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                🔄 Atualizar
              </button>
              <button
                onClick={() => setAutenticado(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                🚪 Sair
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mt-2">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-black bg-opacity-90 border border-neon-blue rounded-lg p-6 neon-border text-center">
            <div className="text-3xl font-bold text-neon-blue">{stats.total}</div>
            <div className="text-gray-400">Total Confirmados</div>
          </div>
          
          <div className="bg-black bg-opacity-90 border border-neon-green rounded-lg p-6 neon-border text-center">
            <div className="text-3xl font-bold text-neon-green">{stats.checkedIn}</div>
            <div className="text-gray-400">Já Chegaram</div>
          </div>
          
          <div className="bg-black bg-opacity-90 border border-yellow-500 rounded-lg p-6 neon-border text-center">
            <div className="text-3xl font-bold text-yellow-500">{stats.pendentes}</div>
            <div className="text-gray-400">Ainda não chegaram</div>
          </div>
        </div>

        {/* Lista de Participantes */}
        <div className="bg-black bg-opacity-90 border border-neon-purple rounded-lg neon-border">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-neon-purple">
              📋 Lista de Participantes
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="loading-dots text-neon-purple text-xl">
                Carregando dados
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-neon-green">Status</th>
                    <th className="text-left p-4 text-neon-green">Nome</th>
                    <th className="text-left p-4 text-neon-green">WhatsApp</th>
                    <th className="text-left p-4 text-neon-green">Confirmação</th>
                    <th className="text-left p-4 text-neon-green">Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {participantes.map((participante) => (
                    <tr key={participante.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-4">
                        {participante.checkin ? (
                          <span className="text-neon-green text-xl">✅</span>
                        ) : (
                          <span className="text-yellow-500 text-xl">⏳</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-white font-bold">
                          {participante.nome} {participante.sobrenome}
                        </div>
                        <div className="text-gray-400 text-sm">
                          ID: {participante.identificador}
                        </div>
                      </td>
                      <td className="p-4 text-neon-blue">
                        {participante.whatsapp}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {formatDateTime(participante.created_at)}
                      </td>
                      <td className="p-4">
                        {participante.checkin_time ? (
                          <div className="text-neon-green text-sm">
                            {formatDateTime(participante.checkin_time)}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            Aguardando...
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {participantes.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            Nenhum participante confirmado ainda.
          </div>
        )}
      </div>
    </div>
  )
} 