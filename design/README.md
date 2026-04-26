# TatameHub Design System

> Sistema de design para o **TatameHub** — app de gestão de alunos para professores de artes marciais (BJJ, Judô, Karatê, Muay Thai, Boxe, Taekwondo, MMA).

## Sobre o produto
App mobile enxuto, R$19,99/mês, que resolve três dores do professor: saber quem está ativo/inativo, controlar quem pagou, e cadastrar alunos rápido (manual ou via link público). Diferencial: simples, rápido, direto.

### Superfícies
- App mobile (professor) — núcleo
- Página de cadastro do aluno (link público) — _próxima iteração_
- Landing de marketing — _próxima iteração_

---

## Direção visual

- **Vibe**: Clean & profissional. Interface monocromática gray dark + white, sem ornamento.
- **Paleta**: Cinzas frios (`#0F0F11` a `#F4F5F7`), sem cores de marca. Cores semânticas apenas para status (verde/âmbar/vermelho/azul).
- **Acento**: branco puro (`#F4F5F7`) sobre escuro. CTAs primários, stripes, focus rings.
- **Tipografia**: **DM Sans** (humanista, calorosa) — pesos 400/500/600/700. DM Mono para links/códigos.
- **Motivo**: **stripe** — linha branca horizontal como detalhe discreto em headers e cards de destaque.

## Content fundamentals

- **Idioma**: pt-BR
- **Voz**: Direta, prática, do professor pro professor. Sem jargão, sem marketing-ês.
- **Tom**: Próximo mas respeitoso. Trata por "você". Evita gírias de tatame para não excluir outras artes marciais.
- **Casing**: Sentence case em títulos ("Novo aluno", não "Novo Aluno"). UPPERCASE só em overlines com `letter-spacing: 0.08em`.
- **Números**: Sempre `tabular-nums` em listas e dashboards. R$ 21.840 (ponto como separador de milhar).
- **Datas**: "mar/24", "há 2h", "Outubro de 2025" — formato curto e humano.
- **Emoji**: Evitar. Use ícones de stroke (Lucide-style) ou unicode seco.
- **Exemplos reais**:
  - Saudação: "Bom dia, Prof. Carlos"
  - Vazio: "Nenhum aluno em atraso 👌" → "Nenhum aluno em atraso"
  - Confirmação: "Marcar pago", não "Confirmar pagamento agora"
  - Erro: "Email inválido" (não "Ops, parece que...")

## Visual foundations

- **Colors**: 14 tons de cinza (`ink-950` → `ink-0`), 4 famílias semânticas (verde/âmbar/vermelho/azul) usadas apenas para status.
- **Type**: escala 12→80px. Headings 600/700, body 400, labels 500. `letter-spacing: -0.02em` em títulos.
- **Spacing**: base 4px. Scale `space-1` (4) → `space-24` (96).
- **Radii**: xs (4), sm (6), **md (10)** padrão, lg (14) cards, xl (20) containers grandes, full pill.
- **Shadows**: sutis (rgba preto 30-45%). Em dark mode, hierarquia vem principalmente de superfícies (ink-900 → 850 → 800 → 750), não de sombras.
- **Backgrounds**: chapados. Sem gradientes de marca (único gradiente permitido: "shine" branco→cinza em logos/destaques raros).
- **Animations**: `cubic-bezier(0.22, 1, 0.36, 1)`, durações 120/180/280ms. Fades e scale sutis — sem bounce.
- **Hover**: `filter: brightness(1.05)` em primário; cor mais clara em secundário/ghost.
- **Press**: `transform: scale(0.97-0.98)` + `filter: brightness(0.92)`.
- **Focus**: ring branco `0 0 0 3px rgba(255,255,255,0.14)` + border `var(--accent)`.
- **Borders**: 1px, `--border-subtle` (#2E3036) em cards; `--border` (#3B3E45) em divisões mais fortes.
- **Cards**: `bg-elevated` + border subtle + `inset 0 1px 0 rgba(255,255,255,0.04)` para o highlight superior premium. Radius `lg` (14).
- **Transparência e blur**: tab bar usa `backdrop-filter: blur(20px) saturate(180%)` sobre `rgba(20,20,24,0.82)`. Usar só em overlays flutuantes.
- **Stripe accent**: barra branca de 2-3px no topo de cards "destaque" + tick curto (8px, 55% opacidade) à direita.
- **Corner radii por contexto**: botões `10`, inputs `10-12`, cards `14`, modais `20`, phone chrome `44`.
- **Status pattern**: badge pill com `bg: rgba(cor, 0.12-0.16)` + `color: cor`. Nunca cor chapada.

## Iconography

- **Set**: ícones de stroke estilo Lucide — 24×24, weight 1.75, linecap/linejoin round. Implementado em `ui_kits/mobile_app/Icon.jsx` (~30 ícones: home, users, dollar, chart, settings, plus, link, search, bell, chevron, check, copy, whatsapp, download, filter, calendar, logout, eye, phone, mail, lock, user, arrow, edit, trash, trending, alert, dots, share).
- **Estilo**: `currentColor`, sem fills. Stroke weight 1.75 (um pouco mais quente que o padrão 2 do Lucide).
- **Emoji**: não usar.
- **Unicode**: apenas setas/traços (→ ↗ ×) quando o contexto pede algo extremamente inline.
- **Substituição**: se precisar de um ícone não listado, preferir adicionar ao `Icon.jsx` copiando o SVG do Lucide (MIT) mantendo weight 1.75.

## Index

```
README.md                     ← este arquivo
SKILL.md                      ← skill file
colors_and_type.css           ← tokens CSS (cores + tipo + espaçamento + motion)
assets/
  logo-mark.svg               ← símbolo quadrado (stripes)
  logo-wordmark.svg           ← "tatamehub" sobre escuro
  logo-wordmark-light.svg     ← versão para fundos claros
  logo-lockup.svg             ← mark + wordmark horizontal
preview/                      ← cards do Design System tab
  colors-*.html               ← accent, neutrals, semantic, surfaces
  type-*.html                 ← headings, body, numeric
  spacing-*.html              ← scale, radius, shadows
  components-*.html           ← buttons, inputs, badges, student card, stat cards
  brand-*.html                ← logo, stripe motif
ui_kits/
  mobile_app/                 ← app do professor (9 telas)
    README.md
    index.html                ← showcase de todas as telas
    app.css
    Icon.jsx                  ← set de ícones stroke
    Primitives.jsx            ← StatusBar, TabBar, ScreenHeader, StatusBadge, Avatar, StatCard, Field
    Screens.jsx               ← Login, Home, Students, StudentDetail, AddStudent, Link, Finance, Reports, Settings
```

> **Substituições flagadas**: DM Sans é carregada direto do Google Fonts. Se precisar de fallback offline, baixe os TTFs em fonts/. Logos são SVGs originais — se você tiver um logo oficial, substitua os 4 arquivos em `assets/`.
