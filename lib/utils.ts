// Gera identificador único baseado no nome
export function generateIdentifier(nome: string, sobrenome: string): string {
  const normalize = (str: string) => 
    str.toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '') // Remove acentos
       .replace(/[^a-z0-9]/g, '') // Remove caracteres especiais

  return `${normalize(nome)}.${normalize(sobrenome)}`
}

// Valida formato de telefone brasileiro
export function validateWhatsApp(phone: string): boolean {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
  const numbersOnly = phone.replace(/\D/g, '')
  return numbersOnly.length >= 10 && numbersOnly.length <= 11
}

// Formata telefone brasileiro
export function formatWhatsApp(phone: string): string {
  const numbers = phone.replace(/\D/g, '')
  
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  } else if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }
  
  return phone
}

// Valida se nome tem pelo menos 2 caracteres
export function validateName(name: string): boolean {
  return name.trim().length >= 2
}

// Efeito de digitação para terminal
export function typeWriter(
  element: HTMLElement, 
  text: string, 
  speed: number = 50
): Promise<void> {
  return new Promise((resolve) => {
    let i = 0
    element.innerHTML = ''
    
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i)
        i++
      } else {
        clearInterval(timer)
        resolve()
      }
    }, speed)
  })
} 