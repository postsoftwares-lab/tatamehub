# 🔐 Configuração do Supabase

## Credenciais de Teste

```
Email: postsoftwares@gmail.com
Senha: 92665401
```

## Configuração das Variáveis de Ambiente

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **API**
3. Copie as seguintes informações:
   - **Project URL** (URL do projeto)
   - **anon/public key** (Chave pública)

4. Edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## Estrutura Criada

### 📁 Arquivos

- **`src/lib/supabase.ts`** - Cliente Supabase configurado
- **`src/services/auth.service.ts`** - Service de autenticação
- **`.env`** - Variáveis de ambiente (não commitado)
- **`.env.example`** - Template das variáveis

### 🔧 Service de Autenticação

O `authService` fornece os seguintes métodos:

```typescript
// Login
await authService.login({ email, password })

// Logout
await authService.logout()

// Obter usuário atual
await authService.getCurrentUser()

// Obter sessão
await authService.getSession()

// Observar mudanças de autenticação
authService.onAuthStateChange((user) => {
  console.log('User changed:', user)
})
```

### 🎯 Integração no LoginPage

A página de login agora:
- ✅ Conecta com Supabase
- ✅ Valida credenciais
- ✅ Exibe mensagens de erro
- ✅ Mostra loading state
- ✅ Pronta para redirecionar após login

## Próximos Passos

1. Configure as variáveis no `.env`
2. Crie o usuário de teste no Supabase (se ainda não existir)
3. Teste o login na aplicação
4. Crie a rota/página de dashboard para redirecionar após login

## 🔒 Segurança

- O arquivo `.env` está no `.gitignore`
- Use `.env.example` como template
- Nunca commite credenciais reais
