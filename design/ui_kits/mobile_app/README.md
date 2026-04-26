# TatameHub — Mobile app UI kit

Professor-facing app. Gestão de alunos, financeiro simples, dashboard, link de cadastro.

## Componentes
- `Icon.jsx` — set de ~30 ícones em stroke (estilo Lucide), 24×24, weight 1.75.
- `Primitives.jsx` — `StatusBar`, `TabBar`, `ScreenHeader`, `StatusBadge`, `Avatar`, `StatCard`, `Field`.
- `Screens.jsx` — 9 telas: Login, Home, Students, StudentDetail, AddStudent, Link, Finance, Reports, Settings.
- `app.css` — phone shell + shared styles.

## Telas (em ordem de importância)
1. **Home / Dashboard** — saudação, 5 stats (alunos / ativos / receita / aberto / atraso), ações rápidas, atividade recente
2. **Alunos** — lista filtrável, busca, status por linha
3. **Detalhe do aluno** — histórico de pagamentos, contato, ações (WhatsApp / marcar pago)
4. **Cadastrar aluno** — manual ou via link; modalidade como chip
5. **Link** — link único compartilhável + "como funciona"
6. **Financeiro** — receita do mês, inadimplentes com ação WhatsApp
7. **Relatórios** — lista exportável (CSV)
8. **Ajustes** — perfil, assinatura, sair
9. **Login** — email + senha, link para criar conta

## Interatividade
O `index.html` renderiza as 9 telas lado-a-lado como showcase. Para um fluxo clicável real, envolva num `<App>` stateful — as telas já recebem callbacks (`onNavigate`, `onOpenStudent`, `onBack`).
