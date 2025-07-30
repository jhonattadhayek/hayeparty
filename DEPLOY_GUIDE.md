# 🚀 GUIA DE DEPLOY - THE HAYEK PARTY

## 📋 Pré-requisitos
- Servidor/VPS com Node.js 18+
- Domínio configurado
- Supabase configurado

## 🔧 Deploy no Servidor

### 1. **No seu servidor/VPS:**
```bash
# Clone o projeto
git clone <seu-repositorio>
cd hayek-party

# Instale dependências
npm install

# Crie .env.production
nano .env.production
```

### 2. **Configure .env.production:**
```env
# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://ulnqrqvuipnwifdqeiol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbnFycXZ1aXBud2lmZHFlaW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MzA4NjcsImV4cCI6MjA2OTQwNjg2N30.wKk2A1x9tPJNkzF6B88TaleKh7rahJBfHjBzZV6J-bw

# QR Tiger API
QRTIGER_API_KEY=6a40c640-6cd1-11f0-809d-df5bc619327b

# IMPORTANTE: Altere para seu domínio!
NEXT_PUBLIC_SITE_URL=https://hayekparty.com
```

### 3. **Build e execução:**
```bash
# Build do projeto
npm run build

# Executar em produção
npm start

# Ou com PM2 (recomendado)
npm install -g pm2
pm2 start npm --name "hayek-party" -- start
pm2 save
pm2 startup
```

### 4. **Configure Nginx (opcional):**
```nginx
server {
    listen 80;
    server_name hayekparty.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 COMO VERIFICAR QUEM FEZ CHECK-IN

### **Opção 1: Direto no Supabase Dashboard**
1. Acesse: https://supabase.com/dashboard/projects
2. Vá em "Table Editor" → "participantes"
3. Veja coluna `checkin` (true/false) e `checkin_time`

### **Opção 2: Query SQL no Supabase**
```sql
-- Ver todos que fizeram check-in
SELECT nome, sobrenome, whatsapp, checkin_time 
FROM participantes 
WHERE checkin = true 
ORDER BY checkin_time DESC;

-- Contar total de check-ins
SELECT COUNT(*) as total_presentes 
FROM participantes 
WHERE checkin = true;

-- Ver quem ainda NÃO fez check-in
SELECT nome, sobrenome, whatsapp 
FROM participantes 
WHERE checkin = false;
```

### **Opção 3: Página Administrativa (BONUS)**
Posso criar uma página `/admin` protegida por senha para você ver:
- ✅ Lista de quem confirmou presença
- ✅ Lista de quem já fez check-in  
- ✅ Lista de quem ainda não chegou
- ✅ Estatísticas em tempo real

---

## 🎯 FLUXO REAL DA FESTA

### **Antes da festa:**
1. Pessoas acessam `https://hayekparty.com`
2. Confirmam presença pelo site
3. Recebem bilhete digital com QR Code
4. Você monitora inscrições no Supabase

### **Durante a festa:**
1. **Na entrada:** Pessoa mostra QR Code no celular
2. **Você escaneia** com qualquer app de QR Code
3. **Automaticamente abre** `https://hayekparty.com/checkin?id=joao.silva`
4. **Página confirma:** "✅ PRESENÇA CONFIRMADA PARA: JOÃO SILVA"
5. **Registro automático** no banco com data/hora

### **Verificação em tempo real:**
- Abra o Supabase no celular/tablet
- Veja quem está chegando em tempo real
- Confira dados: nome, WhatsApp, horário de chegada

---

## 🔍 TESTANDO O SISTEMA

### **Teste local:**
```bash
# 1. Confirme presença: http://localhost:3000
# 2. Vá para bilhete: http://localhost:3000/bilhete?id=seu.nome
# 3. Escaneie QR Code ou acesse: http://localhost:3000/checkin?id=seu.nome
# 4. Veja confirmação de check-in
```

### **Teste em produção:**
```bash
# Mesma coisa, mas com seu domínio:
# 1. https://hayekparty.com
# 2. https://hayekparty.com/bilhete?id=seu.nome  
# 3. https://hayekparty.com/checkin?id=seu.nome
```

---

## 📱 APPS PARA ESCANEAR QR CODE

**iOS:**
- Câmera nativa (automático)
- QR Code Reader

**Android:**  
- Google Lens
- Camera nativa (maioria)
- QR & Barcode Scanner

---

## 🛡️ SEGURANÇA

### **Proteções implementadas:**
- ✅ IDs únicos (impossível adivinhar)
- ✅ Validação no servidor
- ✅ Não permite check-in duplicado
- ✅ Log de data/hora de cada check-in
- ✅ Dados criptografados no Supabase

### **Para maior segurança:**
- Use HTTPS obrigatório
- Configure rate limiting
- Monitore logs de acesso 