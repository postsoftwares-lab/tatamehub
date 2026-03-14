# Tatame Hub - Estrutura do Projeto

## 📁 Estrutura de Pastas

```
src/
├── assets/           # Estilos globais e assets
│   └── main.css     # Tailwind CSS + variáveis de tema
├── components/
│   └── ui/          # Componentes shadcn-vue reutilizáveis
│       ├── Button.vue
│       ├── Input.vue
│       ├── Label.vue
│       ├── Card.vue
│       ├── CardHeader.vue
│       ├── CardTitle.vue
│       ├── CardDescription.vue
│       ├── CardContent.vue
│       ├── CardFooter.vue
│       ├── button.ts
│       └── index.ts
├── lib/
│   └── utils.ts     # Utilitários (cn helper para classes)
└── pages/           # Features organizadas por domínio
    └── auth/        # Feature de autenticação
        ├── components/  # Componentes específicos da feature
        │   ├── LoginForm.vue
        │   └── SocialLogin.vue
        └── page/       # Páginas da feature
            └── LoginPage.vue
```

## 🎨 Stack Tecnológica

- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn-vue (baseado em Radix Vue)
- **Icons**: Lucide Vue Next
- **Utilities**: @vueuse/core, clsx, tailwind-merge

## 📋 Padrão de Organização

### Features (pages/)
Cada feature segue a estrutura:
```
pages/
└── feature_name/
    ├── components/  # Componentes específicos da feature
    ├── page/       # Páginas da feature
    └── composables/ # (opcional) Lógica reutilizável
```

### Componentes UI (components/ui/)
- Componentes shadcn-vue base
- Totalmente customizáveis
- Seguem design system com variáveis CSS
- Suportam tema claro/escuro

## 🎯 Feature: Auth (Login)

### Componentes
- **LoginForm.vue**: Formulário de login com email/senha
  - Validação de campos
  - Toggle de visibilidade de senha
  - Estado de loading
  - Ícones do Lucide

- **SocialLogin.vue**: Botões de login social
  - Google OAuth
  - GitHub OAuth

### Página
- **LoginPage.vue**: Página completa de login
  - Layout responsivo
  - Gradiente de fundo
  - Card centralizado
  - Links para registro e recuperação de senha

## 🎨 Tema e Estilo

### Variáveis CSS
Definidas em `src/assets/main.css`:
- Suporte a tema claro e escuro
- Cores semânticas (primary, secondary, destructive, etc.)
- Border radius customizável
- Sistema de cores HSL

### Tailwind Config
- Plugin de animações
- Classes customizadas para componentes
- Suporte a dark mode via classe

## 🚀 Próximos Passos

Para adicionar novas features:
1. Criar pasta em `src/pages/feature_name`
2. Adicionar subpastas `components/` e `page/`
3. Usar componentes de `@/components/ui`
4. Seguir o padrão estabelecido em `auth/`

## 📦 Componentes Disponíveis

- Button (variants: default, destructive, outline, secondary, ghost, link)
- Input (com suporte a v-model)
- Label
- Card (com Header, Title, Description, Content, Footer)

Todos os componentes seguem o design system do shadcn e são totalmente customizáveis via props de classe.
