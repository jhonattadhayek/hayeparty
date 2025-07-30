# 🎯 THE HAYEK PARTY

Site interativo de convite para o aniversário de **Jhon Hayek** com estética hacker/cyberpunk, experiência imersiva e sistema de check-in com QR Code.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: TailwindCSS com tema cyberpunk personalizado
- **Database**: Supabase (PostgreSQL)
- **QR Code**: QR-Tiger API
- **Deploy**: Vercel

## 📋 Funcionalidades

- ✅ **Página principal** com terminal simulado e animações cyberpunk
- ✅ **Modal de confirmação** de presença com validação
- ✅ **Bilhete digital** personalizado com QR Code
- ✅ **Sistema de check-in** automático
- ✅ **Playlist integrada** do Spotify
- ✅ **Design responsivo** mobile-first
- ✅ **Tema cyberpunk** completo com efeitos neon

## ⚙️ Configuração

### 1. Clone o projeto
```bash
git clone <repository-url>
cd hayek-party
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ulnqrqvuipnwifdqeiol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbnFycXZ1aXBud2lmZHFlaW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MzA4NjcsImV4cCI6MjA2OTQwNjg2N30.wKk2A1x9tPJNkzF6B88TaleKh7rahJBfHjBzZV6J-bw

# QR Tiger API
QRTIGER_API_KEY=6a40c640-6cd1-11f0-809d-df5bc619327b

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configure o Supabase

Acesse seu painel do Supabase e execute o SQL em `supabase/setup.sql`:

```sql
-- Executa o conteúdo do arquivo supabase/setup.sql
-- Isso criará a tabela 'participantes' com todas as configurações necessárias
```

### 5. Execute o projeto
```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 🎨 Estrutura do Projeto

```
hayek-party/
├── app/                    # App Router (Next.js 13+)
│   ├── page.tsx           # Página principal
│   ├── bilhete/page.tsx   # Página do bilhete
│   ├── checkin/page.tsx   # Página de check-in
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Terminal.tsx       # Terminal com efeito de digitação
│   └── ConfirmationModal.tsx # Modal de confirmação
├── lib/                   # Utilitários e configurações
│   ├── supabase.ts        # Cliente Supabase
│   ├── qr-tiger.ts        # Cliente QR-Tiger
│   └── utils.ts           # Funções utilitárias
├── supabase/
│   └── setup.sql          # Script de configuração do banco
└── PROJECT_DOCS.md        # Documentação técnica
```

## 🎯 Fluxo do Usuário

1. **Página Principal** (`/`)
   - Terminal simulado com informações do evento
   - Cards com playlist, dress code e informações extras
   - Botão para confirmar presença

2. **Modal de Confirmação**
   - Formulário com nome, sobrenome e WhatsApp
   - Validação em tempo real
   - Geração de ID único

3. **Página de Bilhete** (`/bilhete?id=ID`)
   - Exibe nome do participante
   - QR Code personalizado
   - Instruções de entrada
   - Botões para imprimir e compartilhar

4. **Página de Check-in** (`/checkin?id=ID`)
   - Validação automática via QR Code
   - Marca presença no banco de dados
   - Confirmação visual do check-in

## 📊 Banco de Dados

### Tabela: `participantes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID interno (auto-gerado) |
| `nome` | String | Nome do participante |
| `sobrenome` | String | Sobrenome do participante |
| `whatsapp` | String | WhatsApp formatado |
| `identificador` | String | ID único (nome.sobrenome) |
| `checkin` | Boolean | Status do check-in |
| `checkin_time` | Timestamp | Data/hora do check-in |
| `created_at` | Timestamp | Data de criação |

## 🎨 Personalização

### Cores do Tema
- **Neon Purple**: `#8B5CF6`
- **Neon Green**: `#10B981` 
- **Neon Blue**: `#3B82F6`
- **Cyber Dark**: `#0A0A0A`

### Fontes
- **Monospace**: Share Tech Mono (Google Fonts)

### Animações
- Terminal typing effect
- Glitch effects
- Neon pulse
- Fade-in transitions

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Atualize `NEXT_PUBLIC_SITE_URL` para seu domínio
4. Deploy automático

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js 14+.

## 📱 Responsividade

- **Mobile**: < 768px (otimizado para touch)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Todos os componentes são mobile-first e totalmente responsivos.

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting do código
```

## 📝 Informações do Evento

- **Nome**: THE HAYEK PARTY
- **Aniversariante**: Jhon Hayek
- **Data**: 02/07
- **Horário**: 16:00h
- **Local**: Salgueiro - Clube
- **DJ**: DJ TOM
- **Entrada**: R$ 25 (homens) / Gratuita (mulheres)

## 🛡️ Segurança

- Row Level Security (RLS) habilitado no Supabase
- Validação de dados no frontend e backend
- Sanitização de inputs
- Rate limiting nas APIs

## 📞 Suporte

Para dúvidas sobre o desenvolvimento ou configuração:
- Verifique a documentação em `PROJECT_DOCS.md`
- Analise os logs do Supabase
- Teste as APIs individualmente

---

**Desenvolvido com 💜 para THE HAYEK PARTY** 