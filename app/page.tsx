'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal } from '@/components/Terminal'
import { ConfirmationModal } from '@/components/ConfirmationModal'

const terminalLines = [
  '> Inicializando sistema de convite...',
  '> Conectando ao servidor central...',
  '> ✓ Conexão estabelecida',
  '> Carregando informações da missão...',
  '',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '         🎯 MISSÃO ESPECIAL DETECTADA 🎯         ',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '',
  '⚡ CODINOME: THE HAYEK PARTY',
  '📅 DATA: 02/07/2024',
  '🕓 HORÁRIO: 16:00 HORAS',
  '📍 LOCAL: Salgueiro - Clube',
  '🎧 ATRAÇÃO: DJ TOM',
  '',
  '💰 TAXA DE ACESSO:',
  '   ├─ HOMENS: R$ 25,00',
  '   └─ MULHERES: ENTRADA GRATUITA',
  '',
  '> Aguardando confirmação do operador...'
]

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [terminalComplete, setTerminalComplete] = useState(false)
  const router = useRouter()

  const handleConfirmationSuccess = (id: string) => {
    router.push(`/bilhete?id=${id}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Terminal Principal */}
        <Terminal 
          lines={terminalLines}
          onComplete={() => setTerminalComplete(true)}
          speed={30}
        />

        {/* Informações Adicionais */}
        {terminalComplete && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Card de Playlist */}
            <div className="bg-black bg-opacity-80 border border-neon-green rounded-lg p-6 neon-border">
              <h3 className="text-neon-green text-lg mb-4 glitch" data-text="🎵 PLAYLIST DA HAYEK
              ">
                🎵 PLAYLIST DA HAYEK PARTY
              </h3>
              <div className="rounded-lg overflow-hidden">
                <iframe 
                  style={{borderRadius: '12px'}} 
                  src="https://open.spotify.com/embed/playlist/7pCAjl28WV2we42vU5VaiS?utm_source=generator" 
                  width="100%" 
                  height="200" 
                  frameBorder="0" 
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Card de Dress Code */}
            <div className="bg-black bg-opacity-80 border border-neon-blue rounded-lg p-6 neon-border">
              <h3 className="text-neon-blue text-lg mb-4 glitch" data-text="👔 DRESS CODE">
                👔 DRESS CODE
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-neon-blue mr-2">▸</span>
                  <span>Vestimentas Pretas e Brancas</span>
                </div>
                <div className="flex items-center">
                  <span className="text-neon-blue mr-2">▸</span>
                  <span>Cores neon bem-vindas</span>
                </div>
                <div className="flex items-center">
                  <span className="text-neon-blue mr-2">▸</span>
                  <span>Smoking são A+</span>
                </div>
                <div className="flex items-center">
                  <span className="text-neon-blue mr-2">▸</span>
                  <span>Opicional: Se vista como o Barney Stinson</span>
                </div>
              </div>
            </div>

            {/* Card de Informações Extras */}
            <div className="bg-black bg-opacity-80 border border-yellow-500 rounded-lg p-6 neon-border">
              <h3 className="text-yellow-500 text-lg mb-4 glitch" data-text="⚠️ PROTOCOLOS DE SEGURANÇA">
                ⚠️ PROTOCOLOS DE SEGURANÇA
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚡</span>
                  <span>Entrada permitida até 20h</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚡</span>
                  <span>QR Code obrigatório</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚡</span>
                  <span>Proibido menores de 16 anos</span>
                </div>
              </div>
            </div>

            {/* Card do Aniversariante */}
            <div className="bg-black bg-opacity-80 border border-red-500 rounded-lg p-6 neon-border">
              <h3 className="text-red-500 text-lg mb-4 glitch" data-text="🎂 TARGET: JHON HAYEK">
                🎂 TARGET: JHON HAYEK
              </h3>
              <div className="space-y-2 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">👨‍💻</div>
                  <div className="text-neon-purple">
                    O mais gato está fazendo aniversário!
                  </div>
                  <div className="text-gray-400 mt-2">
                    Prepare-se para uma festa épica em seu código de vida!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Confirmação */}
        {terminalComplete && (
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-neon-purple hover:bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 neon-pulse"
            >
              🎟️ CONFIRMAR PRESENÇA
            </button>
            <div className="mt-4 text-gray-400 text-sm animate-pulse">
              &gt; Clique para aceitar a missão
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleConfirmationSuccess}
      />
    </div>
  )
} 