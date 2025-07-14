# Sistema de Fichas Técnicas - Instruções de Deploy

## 📋 Pré-requisitos
- Conta no Vercel (https://vercel.com)
- Projeto Supabase configurado
- Node.js 18+ instalado localmente

## 🚀 Deploy na Vercel

### Opção 1: Deploy via GitHub (Recomendado)
1. **Faça upload do código para o GitHub:**
   - Crie um novo repositório no GitHub
   - Faça upload de todos os arquivos deste ZIP
   - Commit e push para o repositório

2. **Conecte ao Vercel:**
   - Acesse https://vercel.com/dashboard
   - Clique em "New Project"
   - Importe seu repositório GitHub
   - Vercel detectará automaticamente que é um projeto Next.js

### Opção 2: Deploy Direto via CLI
```bash
# Instale a CLI do Vercel
npm i -g vercel

# Na pasta do projeto
vercel

# Siga as instruções na tela
```

## ⚙️ Configuração de Variáveis de Ambiente

No painel do Vercel, configure as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://lxbqnkgvmsartveyhguo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YnFua2d2bXNhcnR2ZXloZ3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTI3MTgsImV4cCI6MjA2ODA4ODcxOH0.X79ZQnV9KO0MpMWWZTeR25oH8kG9_x10t6RrNOssQ8M
DATABASE_URL=postgresql://postgres.lxbqnkgvmsartveyhguo:LHKglcom6Fj08kkU@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

## 🗄️ Configuração do Banco de Dados

1. **Sincronize o schema Prisma:**
```bash
npx prisma db push
```

2. **Verifique as tabelas no Supabase:**
   - Acesse o painel do Supabase
   - Vá em "Table Editor"
   - Confirme que todas as tabelas foram criadas

## 🔐 Configuração de Autenticação no Supabase

1. **Habilite registro de usuários:**
   - Painel Supabase > Authentication > Settings
   - Marque "Enable email confirmations" 
   - Desmarque "Disable new user signups" (se estiver marcado)

2. **Configure RLS (Row Level Security):**
   - As políticas RLS já estão definidas no schema
   - Verifique se estão ativas no painel do Supabase

## 📱 Funcionalidades Implementadas

✅ **Autenticação completa** (login/registro/logout)
✅ **Middleware de proteção** de rotas
✅ **Módulo Configurações** (categorias, unidades)
✅ **Módulo Fornecedores** (CRUD completo)
✅ **Módulo Insumos** (gestão de estoque)
✅ **Módulo Fichas Técnicas** (receitas com ingredientes)
✅ **Funcionalidade de impressão** (PDF/impressão direta)
✅ **Interface responsiva** com Tailwind CSS
✅ **APIs REST** para todos os módulos

## 🧪 Teste Local

Antes do deploy, teste localmente:

```bash
# Instale dependências
npm install

# Configure .env com suas credenciais Supabase
cp .env.example .env

# Sincronize banco
npx prisma db push

# Inicie desenvolvimento
npm run dev
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique as variáveis de ambiente no Vercel
2. Confirme que o Supabase está configurado corretamente
3. Verifique os logs de deploy no Vercel
4. Teste a aplicação localmente primeiro

## 🎯 URLs Importantes

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Next.js:** https://nextjs.org/docs
- **Documentação Prisma:** https://www.prisma.io/docs
