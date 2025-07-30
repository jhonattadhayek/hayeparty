import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para a tabela participantes
export interface Participante {
  id: string
  nome: string
  sobrenome: string
  whatsapp: string
  identificador: string
  checkin: boolean
  checkin_time: string | null
  created_at: string
} 