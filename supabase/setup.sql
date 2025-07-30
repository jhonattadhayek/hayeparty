-- Criação da tabela participantes
CREATE TABLE IF NOT EXISTS participantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  identificador VARCHAR(200) UNIQUE NOT NULL,
  checkin BOOLEAN DEFAULT FALSE,
  checkin_time TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_participantes_identificador ON participantes(identificador);
CREATE INDEX IF NOT EXISTS idx_participantes_checkin ON participantes(checkin);
CREATE INDEX IF NOT EXISTS idx_participantes_created_at ON participantes(created_at);

-- Política de Row Level Security (RLS)
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT de novos participantes
CREATE POLICY "Allow insert for all users" ON participantes
  FOR INSERT WITH CHECK (true);

-- Política para permitir SELECT de participantes
CREATE POLICY "Allow select for all users" ON participantes
  FOR SELECT USING (true);

-- Política para permitir UPDATE apenas do campo checkin
CREATE POLICY "Allow update checkin for all users" ON participantes
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Função para atualizar o timestamp do checkin automaticamente
CREATE OR REPLACE FUNCTION update_checkin_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.checkin = TRUE AND OLD.checkin = FALSE THEN
    NEW.checkin_time = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente o checkin_time
CREATE TRIGGER set_checkin_time
  BEFORE UPDATE ON participantes
  FOR EACH ROW EXECUTE FUNCTION update_checkin_time();

-- Comentários para documentação
COMMENT ON TABLE participantes IS 'Tabela de participantes do THE HAYEK PARTY';
COMMENT ON COLUMN participantes.id IS 'ID único do participante (UUID)';
COMMENT ON COLUMN participantes.nome IS 'Nome do participante';
COMMENT ON COLUMN participantes.sobrenome IS 'Sobrenome do participante';
COMMENT ON COLUMN participantes.whatsapp IS 'WhatsApp do participante no formato (XX) XXXXX-XXXX';
COMMENT ON COLUMN participantes.identificador IS 'Identificador único no formato nome.sobrenome';
COMMENT ON COLUMN participantes.checkin IS 'Status do check-in (true/false)';
COMMENT ON COLUMN participantes.checkin_time IS 'Timestamp do check-in';
COMMENT ON COLUMN participantes.created_at IS 'Data de criação do registro';

-- Dados de teste (remova em produção)
INSERT INTO participantes (nome, sobrenome, whatsapp, identificador) 
VALUES ('João', 'Silva', '(11) 99999-9999', 'joao.silva')
ON CONFLICT (identificador) DO NOTHING; 