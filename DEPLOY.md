# Deploy na Vercel - Smiley Code

## Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Repositório GitHub conectado
3. Chave da API do Google Gemini

## Passos para Deploy

### 1. Conectar Repositório
- Acesse https://vercel.com/dashboard
- Clique em "New Project"
- Conecte seu repositório GitHub: `invictsquad/Smiley-Code`

### 2. Configurar Variáveis de Ambiente
Na seção "Environment Variables" da Vercel, adicione:

```
GEMINI_API_KEY=sua_chave_aqui
VITE_SUPABASE_URL=https://butgqnfowqjqubqfxjkx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dGdxbmZvd3FqcXVicWZ4amt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk4NjMsImV4cCI6MjA3NjE1NTg2M30.Cwhb6mb8uwmMdHJYQhi-2wHn5LfwJJj48VtYPk9F8r8
```

### 3. Configurações de Build
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 4. Deploy
- Clique em "Deploy"
- Aguarde o processo de build e deploy

## Configurações Automáticas

O arquivo `vercel.json` já está configurado com:
- Redirecionamento SPA para index.html
- Configurações de build otimizadas
- Variáveis de ambiente de produção

## Domínio Personalizado

Após o deploy, você pode configurar um domínio personalizado:
1. Vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel

## Monitoramento

- Analytics: Habilitado automaticamente
- Logs: Disponíveis no dashboard da Vercel
- Performance: Métricas Web Vitals incluídas