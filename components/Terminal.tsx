'use client'

import React, { useState, useEffect } from 'react'

interface TerminalProps {
  lines: string[]
  onComplete?: () => void
  speed?: number
}

export function Terminal({ lines, onComplete, speed = 50 }: TerminalProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true)
      onComplete?.()
      return
    }

    const line = lines[currentLineIndex]
    let charIndex = 0

    const timer = setInterval(() => {
      if (charIndex < line.length) {
        setCurrentText(prev => prev + line[charIndex])
        charIndex++
      } else {
        clearInterval(timer)
        setTimeout(() => {
          setCurrentText(prev => prev + '\n')
          setCurrentLineIndex(prev => prev + 1)
        }, 500)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [currentLineIndex, lines, speed, onComplete])

  return (
    <div className="bg-black bg-opacity-80 backdrop-blur-sm border border-neon-purple p-6 rounded-lg neon-border">
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 text-sm text-gray-400">terminal_hayek.exe</div>
      </div>
      
      <div className="font-mono text-sm">
        <div className="text-neon-green mb-2">
          root@hayek-party:~$ ./convite.sh
        </div>
        
        <div className="text-white min-h-[200px]">
          <pre className="whitespace-pre-wrap">
            {currentText}
            {!isComplete && <span className="terminal-cursor"></span>}
          </pre>
        </div>
      </div>
    </div>
  )
} 