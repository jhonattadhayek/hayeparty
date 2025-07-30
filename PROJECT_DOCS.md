# 📝 THE HAYEK PARTY - Documentação do Projeto

## 🎯 Visão Geral

Site interativo de convite para o aniversário de **JHON HAYEK** com estética hacker/cyberpunk, experiência imersiva e sistema de check-in com QR Code.

---

## 🔐 Informações do Evento

| Item | Detalhes |
|------|----------|
| **Nome da Festa** | THE HAYEK PARTY |
| **Aniversariante** | Jhon Hayek |
| **Data** | 02/07 |
| **Horário** | 16h |
| **Local** | Salgueiro - Clube (a definir) |
| **Atração** | DJ TOM |
| **Entrada (Homens)** | R$25 |
| **Entrada (Mulheres)** | Gratuita |

---

## 🎨 Diretrizes de Design

### Tema Visual
- **Estilo**: Hacker / Cyberpunk / Estética terminal
- **Cores principais**: Preto, roxo neon, branco
- **Fonte**: Monospace (ex: "Share Tech Mono")
- **Animações**: 
  - Efeitos de digitação
  - Glitch effects
  - Terminal simulado
- **Responsividade**: Mobile-first

---

## 🏗️ Arquitetura do Site

### 1. Página Principal (`/`)
**Funcionalidades:**
- Efeito de terminal simulado com digitação automática
- Apresentação estilo "missão secreta"

**Seções:**
- 🎯 Introdução com tema hacker
- 📅 Informações do evento (data, local, atração, valores)
- 🎵 Playlist integrada (embed Spotify)
- 👔 Dresscode sugerido
- ℹ️ Informações extras (horários de entrada)
- 🎟️ Botão "Confirmar Presença"

### 2. Modal de Confirmação
**Trigger:** Clique no botão "Confirmar Presença"

**Formulário:**
- Nome (obrigatório)
- Sobrenome (obrigatório)
- WhatsApp (obrigatório, com DDD)

**Fluxo:**
1. Validação dos dados
2. Geração de ID único (formato: `nome.sobrenome`)
3. Salvamento no Supabase
4. Redirecionamento para `/bilhete?id=ID_GERADO`

### 3. Página de Bilhete (`/bilhete?id=ID`)
**Conteúdo:**
- Nome do participante personalizado
- Instruções para entrada no evento
- QR Code gerado via API QR-Tiger
- Link do QR Code: `https://site.com/checkin?id=ID`

### 4. Página de Check-in (`/checkin?id=ID`)
**Funcionalidade:**
- Validação do ID no banco de dados
- Marcação de presença (`checkin = true`)
- Registro de data/hora do check-in
- Exibição de confirmação:

```
✅ PRESENÇA CONFIRMADA PARA: [NOME DO PARTICIPANTE]
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: HTML + TailwindCSS + JavaScript (ou React)
- **Deploy**: Vercel
- **Styling**: TailwindCSS para responsividade e tema cyberpunk

### Backend
- **Banco de Dados**: Supabase
- **Autenticação**: Supabase Auth (se necessário)
- **API Externa**: QR-Tiger para geração de QR Codes

---

## 📊 Estrutura do Banco de Dados

### Tabela: `participantes`

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | UUID | ID interno (auto-gerado) | Primary Key |
| `nome` | String | Nome do participante | Obrigatório |
| `sobrenome` | String | Sobrenome do participante | Obrigatório |
| `whatsapp` | String | Telefone com DDD | Obrigatório, formato brasileiro |
| `identificador` | String | ID único (nome.sobrenome) | Único, lowercase, sem espaços |
| `checkin` | Boolean | Status do check-in | Default: false |
| `checkin_time` | Timestamp | Data/hora do check-in | Nullable |
| `created_at` | Timestamp | Data de criação do registro | Auto-gerado |

---

## ⚙️ Regras de Negócio

### Geração de Identificador
- Formato: `nome.sobrenome` (lowercase)
- Remoção de espaços e caracteres especiais
- Garantia de unicidade no sistema

### Validações
- **Formulário**: Nome, sobrenome e WhatsApp obrigatórios
- **WhatsApp**: Formato brasileiro com DDD
- **ID único**: Verificação antes de inserção no banco

### Check-in
- Link `/checkin?id=ID` deve validar existência do ID
- Marcar `checkin = true` apenas uma vez por ID
- Registrar timestamp do check-in
- Prevenir múltiplos check-ins para o mesmo participante

### QR Code
- Todos os QR Codes apontam para: `https://site.com/checkin?id=ID`
- Geração via API QR-Tiger
- Exibição na página de bilhete

---

## 🎯 Fluxo do Usuário

```mermaid
flowchart TD
    A[Página Principal] --> B[Clica "Confirmar Presença"]
    B --> C[Modal de Formulário]
    C --> D[Preenche Dados]
    D --> E[Validação]
    E -->|Sucesso| F[Salva no Supabase]
    E -->|Erro| C
    F --> G[Gera ID único]
    G --> H[Redireciona para /bilhete]
    H --> I[Exibe QR Code]
    I --> J[Usuário escaneia QR]
    J --> K[Acessa /checkin?id=ID]
    K --> L[Marca presença no banco]
    L --> M[Confirma check-in]
```

---

## 🔗 Integrações

### Supabase
- **Setup**: Projeto Supabase com tabela `participantes`
- **API**: RESTful endpoints para CRUD
- **Security**: Row Level Security (RLS) se necessário

### QR-Tiger API
- **Endpoint**: Geração de QR Code
- **Configuração**: URL dinâmica por participante
- **Formato**: PNG/SVG para exibição no bilhete

### Spotify (Opcional)
- **Embed**: Player de playlist para a festa
- **Integração**: Via iframe ou Spotify Web API

---

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px (prioridade)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Componentes Críticos
- Modal de confirmação adaptável
- QR Code legível em todos os dispositivos
- Terminal simulado otimizado para mobile
- Formulário com inputs touch-friendly

---

## 🎨 Elementos Visuais

### Animações
- **Terminal typing**: Efeito máquina de escrever
- **Glitch effects**: Pequenos glitches visuais
- **Hover states**: Efeitos neon nos botões
- **Loading states**: Spinners com tema cyberpunk

### Tipografia
- **Font Family**: "Share Tech Mono" ou similar monospace
- **Hierarquia**: Diferentes tamanhos mantendo estética terminal
- **Cores**: Verde/roxo neon para destaque, branco para texto

### Layout
- **Background**: Preto com elementos de grid/matrix
- **Cards**: Bordas neon com transparência
- **Buttons**: Estilo terminal com hover effects
- **Forms**: Inputs com bordas neon e placeholders estilizados 