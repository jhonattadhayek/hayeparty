'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { generateIdentifier, validateName, formatWhatsApp, validateWhatsApp } from '@/lib/utils'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function ConfirmationModal({ isOpen, onClose, onSuccess }: ConfirmationModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    whatsapp: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!validateName(formData.nome)) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!validateName(formData.sobrenome)) {
      newErrors.sobrenome = 'Sobrenome deve ter pelo menos 2 caracteres'
    }

    if (!validateWhatsApp(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp deve estar no formato (11) 99999-9999'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const identificador = generateIdentifier(formData.nome, formData.sobrenome)
      
      // Verifica se identificador já existe
      const { data: existing } = await supabase
        .from('participantes')
        .select('id')
        .eq('identificador', identificador)
        .single()

      if (existing) {
        setErrors({ nome: 'Essa combinação de nome já foi cadastrada' })
        setLoading(false)
        return
      }

      // Insere novo participante
      const { error } = await supabase
        .from('participantes')
        .insert({
          nome: formData.nome.trim(),
          sobrenome: formData.sobrenome.trim(),
          whatsapp: formData.whatsapp,
          identificador,
          checkin: false
        })

      if (error) throw error

      onSuccess(identificador)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar participante:', error)
      setErrors({ submit: 'Erro ao confirmar presença. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsApp(value)
    setFormData(prev => ({ ...prev, whatsapp: formatted }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-cyber-dark border border-neon-purple rounded-lg p-6 w-full max-w-md neon-border animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neon-purple glitch" data-text="CONFIRMAR PRESENÇA">
            CONFIRMAR PRESENÇA
          </h2>
          <button 
            onClick={onClose}
            className="text-red-500 hover:text-red-400 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neon-green mb-2">
              &gt; NOME_OPERADOR:
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full bg-black border border-neon-purple rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
              placeholder="Digite seu nome"
              disabled={loading}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm text-neon-green mb-2">
              &gt; SOBRENOME_OPERADOR:
            </label>
            <input
              type="text"
              value={formData.sobrenome}
              onChange={(e) => setFormData(prev => ({ ...prev, sobrenome: e.target.value }))}
              className="w-full bg-black border border-neon-purple rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
              placeholder="Digite seu sobrenome"
              disabled={loading}
            />
            {errors.sobrenome && <p className="text-red-500 text-xs mt-1">{errors.sobrenome}</p>}
          </div>

          <div>
            <label className="block text-sm text-neon-green mb-2">
              &gt; CANAL_COMUNICACAO:
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => handleWhatsAppChange(e.target.value)}
              className="w-full bg-black border border-neon-purple rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
              placeholder="(11) 99999-9999"
              disabled={loading}
            />
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-neon-purple text-white rounded hover:bg-purple-600 transition-colors neon-pulse disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-dots">PROCESSANDO</span>
              ) : (
                'CONFIRMAR'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 