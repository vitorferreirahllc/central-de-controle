# Central de Resultados — H Performance LLC

Sistema web que substitui a planilha `Controle_Resultados_Clientes.xlsx`: lançamento semanal de
resultados de Delivery Apps e Meta Ads por cliente, e um dashboard mensal consolidado.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Supabase (banco de dados Postgres +
autenticação).

## Configuração (passo a passo)

1. **Criar um projeto no Supabase**: acesse https://app.supabase.com, crie uma conta/organização
   e um novo projeto (escolha uma senha de banco e guarde-a).

2. **Rodar o schema**: no painel do projeto, abra **SQL Editor**, cole o conteúdo do arquivo
   [`supabase/schema.sql`](./supabase/schema.sql) e execute. Isso cria as tabelas `clients`,
   `delivery_entries`, `meta_ads_entries`, já com os 8 clientes cadastrados e as políticas de
   segurança (RLS).

3. **Criar seu usuário de login**: no painel, vá em **Authentication → Users → Add user**, crie
   seu e-mail e senha (ou dos demais membros da equipe que vão lançar dados).

4. **Pegar as credenciais do projeto**: em **Project Settings → API**, copie a **Project URL** e
   a **anon public key**.

5. **Configurar variáveis de ambiente**: copie `.env.local.example` para `.env.local` e preencha:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   ```

6. **Instalar e rodar**:

   ```bash
   npm install
   npm run dev
   ```

   Acesse http://localhost:3000 — você será redirecionado para `/login`.

## Estrutura

- `/login` — tela de login (Supabase Auth).
- `/dashboard` — consolidado mensal por cliente (Delivery Apps + Meta Ads), com seletor de mês.
- `/delivery-apps` — formulário de lançamento semanal + tabela de lançamentos.
- `/meta-ads` — formulário de lançamento semanal + tabela de lançamentos.

Todas as rotas exceto `/login` exigem sessão ativa (verificado em `middleware.ts` e no layout de
`app/(protected)`).

## Deploy

Recomendado: [Vercel](https://vercel.com/new). Configure as mesmas variáveis de ambiente
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) no painel do projeto na Vercel.
