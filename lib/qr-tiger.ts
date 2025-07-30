import QRCode from 'qrcode'

export async function generateQRCode(url: string): Promise<string> {
  try {
    console.log('🔄 Gerando QR Code para:', url)
    
    // Gera QR code como data URL (base64) com configurações melhoradas
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',    // Preto puro para melhor contraste
        light: '#FFFFFF'    // Branco puro
      },
      errorCorrectionLevel: 'H' // Nível mais alto de correção de erro
    })
    
    console.log('✅ QR Code gerado com sucesso')
    return qrCodeDataURL
    
  } catch (error) {
    console.error('❌ Erro ao gerar QR Code:', error)
    
    // Fallback para API gratuita online se a geração local falhar
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&ecc=H&margin=1&data=${encodeURIComponent(url)}`
    console.log('🔄 Usando fallback online:', fallbackUrl)
    return fallbackUrl
  }
} 