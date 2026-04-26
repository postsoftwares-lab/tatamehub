---
trigger: always_on
---
# Design System Guidelines — TatameHub

## Stack
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **Vue 3** `<script setup>` + TypeScript
- CSS variables para cores, fontes e tokens de design

---

## 1. Configuração CSS (`src/style.css`) — CRÍTICO

```css
/* 1. Fontes externas */
@import url('https://fonts.googleapis.com/css2?...');

/* 2. Tailwind v4 — coloca utilities em @layer utilities */
@import "tailwindcss";

/* 3. CSS variables — ficam fora de @layer (correto) */
:root {
  --bg-app: var(--ink-900);
  /* ... */
}

/* 4. Reset global — OBRIGATÓRIO dentro de @layer base */
@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #app { width: 100%; height: 100%; }
  body { background: var(--bg-app); font-family: var(--font-sans); }
}
```

### ⚠️ REGRA CRÍTICA — CSS Cascade Layers no Tailwind v4

No Tailwind v4, **todas as utilities** (`.mt-3`, `.px-4`, `.flex`, etc.) são geradas dentro de `@layer utilities`.

A ordem de prioridade no CSS é:
```
@layer base  <  @layer utilities  <  CSS sem @layer (unlayered)
```

**Consequência:** qualquer CSS escrito fora de `@layer` tem prioridade ABSOLUTA sobre utilities, ignorando especificidade.

```css
/* ❌ DESTRÓI todos os mt-*, px-*, py-* do Tailwind */
* { margin: 0; padding: 0; }  /* unlayered > @layer utilities */

/* ✅ CORRETO — dentro de @layer base, utilities podem sobrescrever */
@layer base {
  * { margin: 0; padding: 0; }
}
```

Isso vale para QUALQUER regra global. Se precisar de CSS custom, coloque em `@layer base` ou `@layer utilities` — nunca solto fora.

---

## 2. Layout — use apenas Tailwind utilities

### ✅ CORRETO — grid, flex, spacing via classes
```vue
<div class="grid grid-cols-1 min-[960px]:grid-cols-2 h-screen">
  <section class="hidden min-[960px]:flex flex-col">...</section>
  <section class="flex flex-col items-center justify-center px-8 py-10">...</section>
</div>
```

### ❌ PROIBIDO — `<style scoped>` para layout
```vue
<!-- Nunca use scoped CSS para grid/flex/spacing -->
<style scoped>
.container { grid-template-columns: 1fr 1fr; }  /* ← ERRADO */
</style>
```

**Por quê?** Quando `<style scoped>` falha no HMR ou build, o layout inteiro quebra. Tailwind utilities são processadas como CSS estático, nunca falham.

---

## 3. Backgrounds complexos — use `:style` binding

Para backgrounds multi-valor (gradient + fallback), o Tailwind **não consegue** parsear vírgulas externas dentro de `bg-[...]`:

### ❌ QUEBRA — vírgula fora dos parênteses
```vue
<!-- Tailwind misparsei este valor e não gera o CSS -->
<div class="bg-[radial-gradient(circle,rgba(0,0,0,0.1),transparent),var(--bg-inset)]">
```

### ✅ CORRETO — `:style` para backgrounds complexos
```vue
<section
  class="bg-[var(--bg-inset)]"
  :style="{ background: 'radial-gradient(circle at 40% 60%, rgba(244,245,247,0.07), transparent 65%), var(--bg-inset)' }"
>
```

**Regra:** Se o valor de background tiver vírgulas **fora** de `()`, use `:style`. Para backgrounds simples (`bg-[var(--cor)]`), use classe Tailwind normalmente.

---

## 4. Espaçamento — classes Tailwind padrão

```
Padding:  px-4  py-8  pt-12  pl-2
Margin:   mt-4  mb-6  mx-auto
Gap:      gap-3  gap-4
```

### `gap` vs `margin` — ambos funcionam juntos

`gap` e `margin` são **aditivos** em flexbox — não se cancelam:

```vue
<!-- gap-4 = 16px entre todos os filhos -->
<!-- mt-8 no segundo item = 16px (gap) + 32px (margin) = 48px total acima dele -->
<form class="flex flex-col gap-4">
  <BaseInput />          <!-- gap-4 acima -->
  <BaseInput class="mt-8" />  <!-- gap-4 + mt-8 acima — funciona! -->
</form>
```

Use `gap` para espaçamento uniforme e `margin` para exceções pontuais.

---

## 5. Componentes base — `inheritAttrs: false` + `v-bind="$attrs"`

Todo componente base **deve** usar este padrão para aceitar classes externas:

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <!-- v-bind="$attrs" no elemento raiz garante que class, style,
       data-attrs, aria-attrs e event listeners chegam ao DOM correto -->
  <div v-bind="$attrs" class="estilos-base-do-componente">
    <!-- conteúdo -->
  </div>
</template>
```

**Uso:**
```vue
<BaseInput class="mt-6" />      <!-- mt-6 chega no <div> raiz -->
<BaseButton class="w-full" />   <!-- w-full chega no <button> -->
```

### ❌ ERRADO — `:class="[$attrs.class]"` (incompleto)
```vue
<!-- Perde event listeners, aria-*, data-*, id, etc -->
<div :class="[$attrs.class]" class="base">
```

### ✅ CORRETO — `v-bind="$attrs"` (completo)
```vue
<!-- Repassa TUDO: class, style, listeners, aria, data -->
<div v-bind="$attrs" class="base">
```

---

## 6. Cores — sempre via CSS variables

```vue
<!-- ✅ Correto -->
<div class="bg-[var(--bg-elevated)] text-[var(--fg-1)] border border-[var(--border-subtle)]">

<!-- ❌ Evitar — hardcode de hex -->
<div class="bg-[#1C1D21] text-[#E6E7EA]">
```

Tokens disponíveis: `--bg-app`, `--bg-elevated`, `--bg-high`, `--bg-inset`, `--fg-1..4`, `--border-subtle`, `--border`, `--accent`, `--status-*`.

---

## 7. Breakpoints responsivos

Use `min-[valor]:` para breakpoints exatos ou os padrões Tailwind:

```vue
<!-- Breakpoint exato -->
<div class="grid-cols-1 min-[960px]:grid-cols-2">

<!-- Breakpoints padrão Tailwind (sm/md/lg/xl) -->
<div class="grid-cols-1 lg:grid-cols-2">   <!-- 1024px -->
<div class="hidden lg:flex">               <!-- oculto até 1024px -->
```

---

## Resumo rápido

| Regra | ✅ Fazer | ❌ Evitar |
|---|---|---|
| Layout | Tailwind utilities | `<style scoped>` |
| Background complexo | `:style` binding | `bg-[gradient,var]` |
| Spacing | `gap`, `mt-`, `px-` | `style="margin:..."` |
| Componentes base | `v-bind="$attrs"` | `:class="[$attrs.class]"` |
| Cores | `var(--token)` | hex hardcoded |
| Breakpoints | `min-[960px]:` | media queries em `<style>` |
