// Screens.jsx — all app screens for TatameHub

// ============ LOGIN ============
function LoginScreen({ onLogin }) {
  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', paddingTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30, marginBottom: 28 }}>
        <img src="../../assets/logo-lockup.svg" height="54" alt="TatameHub" />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Bem-vindo de volta</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 6 }}>Entre para gerenciar seus alunos</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email" icon="mail" placeholder="professor@academia.com" />
        <Field label="Senha" icon="lock" type="password" placeholder="••••••••" />
        <a href="#" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, marginTop: 2 }}>Esqueci minha senha</a>
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={onLogin}>Entrar</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 6px', color: 'var(--fg-4)', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} /> ou <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>
        <button className="btn btn-secondary">Criar conta grátis</button>
      </div>
    </div>
  );
}

// ============ HOME / DASHBOARD ============
function HomeScreen({ onNavigate }) {
  return (
    <div className="screen">
      {/* Header */}
      <div style={{ paddingTop: 16, paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>Bom dia,</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Prof. Carlos</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--ink-800)', border: '1px solid var(--border-subtle)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <Icon name="bell" size={18} />
            <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 2px var(--ink-800)' }} />
          </button>
        </div>
      </div>

      {/* Belt stripe brand accent */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        <div style={{ height: 3, width: 50, background: 'var(--accent)', borderRadius: 2 }} />
        <div style={{ height: 3, width: 8, background: 'var(--accent)', opacity: 0.55, borderRadius: 2 }} />
      </div>

      {/* Primary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <StatCard label="Alunos" value="128" sub="116 ativos" />
        <StatCard label="Receita out/25" value="R$ 21.840" accent sub="↗ +R$ 720" trend="up" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
        <StatCard label="Pagos" value="109" sub="" />
        <StatCard label="Em aberto" value="12" sub="R$ 2.160" />
        <StatCard label="Atrasado" value="7" sub="R$ 1.260" trend="down" />
      </div>

      {/* Quick actions */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>Ações rápidas</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <button className="card-el" onClick={() => onNavigate('add')} style={{ padding: 14, textAlign: 'left', cursor: 'pointer', color: 'var(--fg-1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={18} /></div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Cadastrar aluno</div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Manual ou via link</div>
        </button>
        <button className="card-el" onClick={() => onNavigate('link')} style={{ padding: 14, textAlign: 'left', cursor: 'pointer', color: 'var(--fg-1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="link" size={18} /></div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Link de cadastro</div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Compartilhar</div>
        </button>
      </div>

      {/* Recent events */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Atividade recente</div>
        <a href="#" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>Ver tudo</a>
      </div>
      <div className="card-el" style={{ overflow: 'hidden' }}>
        {[
          { name: 'Maria Costa', action: 'pagamento recebido', time: 'há 2h', sum: '+ R$ 160', type: 'paid' },
          { name: 'Pedro Alves', action: 'novo aluno', time: 'há 5h', sum: 'Muay Thai', type: 'new' },
          { name: 'Ana Ribeiro', action: 'atrasou 3 dias', time: 'ontem', sum: 'R$ 180', type: 'late' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
            <Avatar name={e.name} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{e.action} · {e.time}</div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: e.type === 'paid' ? '#4ADE80' : e.type === 'late' ? '#F87171' : 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{e.sum}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ STUDENTS LIST ============
function StudentsScreen({ onOpenStudent }) {
  const [filter, setFilter] = React.useState('todos');
  const students = [
    { name: 'João Silva', art: 'BJJ · Azul', price: 180, status: 'paid', active: true },
    { name: 'Maria Costa', art: 'Muay Thai', price: 160, status: 'paid', active: true },
    { name: 'Pedro Alves', art: 'Muay Thai', price: 160, status: 'new', active: true, isNew: true },
    { name: 'Ana Ribeiro', art: 'BJJ · Branca', price: 180, status: 'late', active: true, lateDays: 3 },
    { name: 'Carlos Dias', art: 'Judô', price: 150, status: 'late', active: true, lateDays: 12 },
    { name: 'Rafael Lima', art: 'Boxe', price: 140, status: 'pending', active: true },
    { name: 'Sofia Mendes', art: 'BJJ · Roxa', price: 200, status: 'paid', active: true },
    { name: 'Lucas Ferreira', art: 'Karatê', price: 150, status: 'inactive', active: false },
  ];
  const filtered = filter === 'atraso' ? students.filter(s => s.status === 'late')
                 : filter === 'inativo' ? students.filter(s => !s.active)
                 : students;
  return (
    <div className="screen">
      <ScreenHeader title="Alunos" subtitle="128 no total · 116 ativos" />
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)' }}><Icon name="search" size={18} /></div>
        <input placeholder="Buscar aluno..." style={{ width: '100%', background: 'var(--ink-850)', border: '1px solid var(--border-subtle)', borderRadius: 12, color: 'var(--fg-1)', fontSize: 14, padding: '11px 14px 11px 42px', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {[{ id: 'todos', label: 'Todos' }, { id: 'atraso', label: 'Em atraso' }, { id: 'aberto', label: 'Em aberto' }, { id: 'inativo', label: 'Inativos' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
            border: '1px solid ' + (filter === f.id ? 'var(--accent)' : 'var(--border-subtle)'),
            background: filter === f.id ? 'var(--accent-soft)' : 'transparent',
            color: filter === f.id ? 'var(--accent)' : 'var(--fg-2)',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((s, i) => (
          <button key={i} onClick={() => onOpenStudent && onOpenStudent(s)} className="card-el" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, cursor: 'pointer', textAlign: 'left', color: 'var(--fg-1)' }}>
            <Avatar name={s.name} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{s.art}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {s.price}</span>
              <StatusBadge
                kind={s.status}
                text={s.status === 'paid' ? 'Pago' : s.status === 'pending' ? 'Em aberto' : s.status === 'late' ? `Atrasado ${s.lateDays}d` : s.status === 'new' ? 'Novo' : 'Inativo'}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ STUDENT DETAIL ============
function StudentDetailScreen({ student, onBack }) {
  return (
    <div className="screen">
      <ScreenHeader title={student.name} subtitle={student.art} onBack={onBack}
        action={<button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ink-800)', border: '1px solid var(--border-subtle)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="dots" size={18} /></button>}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 20px' }}>
        <Avatar name={student.name} size={80} />
        <div style={{ marginTop: 10 }}>
          <StatusBadge kind={student.status} text={student.status === 'late' ? `Atrasado ${student.lateDays} dias` : 'Ativo'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <StatCard label="Mensalidade" value={`R$ ${student.price}`} accent />
        <StatCard label="Vence dia" value="10" sub="próximo em 3 dias" />
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>Contato</div>
      <div className="card-el" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Icon name="phone" size={18} color="var(--fg-3)" />
          <span style={{ flex: 1, fontSize: 14 }}>(11) 98765-4321</span>
          <button style={{ color: '#4ADE80', background: 'rgba(74,222,128,0.12)', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><Icon name="whatsapp" size={13} /> WhatsApp</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
          <Icon name="calendar" size={18} color="var(--fg-3)" />
          <span style={{ flex: 1, fontSize: 14 }}>Matriculado em março de 2024</span>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>Histórico de pagamentos</div>
      <div className="card-el">
        {['Outubro', 'Setembro', 'Agosto'].map((m, i) => (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m}/25</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Venceu 10/{10 - i}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>R$ {student.price}</span>
            <StatusBadge kind={i === 0 && student.status === 'late' ? 'late' : 'paid'} text={i === 0 && student.status === 'late' ? 'Atraso' : 'Pago'} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }}><Icon name="whatsapp" size={16} />Lembrar</button>
        <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="check" size={16} />Marcar pago</button>
      </div>
    </div>
  );
}

// ============ ADD STUDENT ============
function AddStudentScreen({ onBack, onGoToLink }) {
  const [mode, setMode] = React.useState('manual');
  return (
    <div className="screen">
      <ScreenHeader title="Novo aluno" onBack={onBack} />
      <div style={{ display: 'flex', gap: 8, padding: 4, background: 'var(--ink-850)', borderRadius: 12, marginBottom: 20 }}>
        <button onClick={() => setMode('manual')} style={{
          flex: 1, padding: '10px', borderRadius: 9, border: 'none',
          background: mode === 'manual' ? 'var(--ink-750)' : 'transparent',
          color: mode === 'manual' ? 'var(--fg-1)' : 'var(--fg-3)',
          fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}>Manual</button>
        <button onClick={onGoToLink} style={{
          flex: 1, padding: '10px', borderRadius: 9, border: 'none',
          background: 'transparent', color: 'var(--fg-3)',
          fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}>Via link</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Nome completo" placeholder="Ex: João Silva" />
        <Field label="Telefone" placeholder="(11) 98765-4321" icon="phone" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Valor mensal" placeholder="R$ 180" />
          <Field label="Vence dia" placeholder="10" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Modalidade</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['BJJ', 'Judô', 'Karatê', 'Muay Thai', 'Boxe', 'Taekwondo', 'MMA'].map(m => (
              <span key={m} style={{ padding: '7px 12px', borderRadius: 999, border: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', cursor: 'pointer' }}>{m}</span>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 8 }}>Cadastrar aluno</button>
      </div>
    </div>
  );
}

// ============ LINK SCREEN ============
function LinkScreen({ onBack }) {
  const [copied, setCopied] = React.useState(false);
  const link = 'tatamehub.app/cadastro/carlosbjj';
  return (
    <div className="screen">
      <ScreenHeader title="Link de cadastro" subtitle="Compartilhe para que alunos se cadastrem sozinhos" onBack={onBack} />
      <div className="card-el" style={{ padding: 20, textAlign: 'center', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'var(--accent)' }} />
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px auto 14px' }}>
          <Icon name="link" size={28} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 4 }}>Seu link único</div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: 'var(--accent)', marginBottom: 16, wordBreak: 'break-all' }}>{link}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />{copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="share" size={16} />Compartilhar</button>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>Como funciona</div>
      <div className="card-el" style={{ padding: 16 }}>
        {['Envie o link no grupo da academia ou WhatsApp', 'O aluno preenche nome + telefone em 30s', 'Ele aparece direto na sua lista como "Novo"'].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.45 }}>{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ FINANCE ============
function FinanceScreen() {
  return (
    <div className="screen">
      <ScreenHeader title="Financeiro" subtitle="Outubro de 2025" />
      <div className="card-el" style={{ padding: 18, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'var(--accent)' }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Receita do mês</div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>R$ 21.840</div>
        <div style={{ fontSize: 12.5, color: '#4ADE80', fontWeight: 500, marginTop: 4 }}>↗ +R$ 720 vs. setembro</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
        <StatCard label="Pagos" value="109" sub="R$ 18.420" />
        <StatCard label="Em aberto" value="12" sub="R$ 2.160" />
        <StatCard label="Atraso" value="7" sub="R$ 1.260" trend="down" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Inadimplentes</div>
        <a href="#" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>Enviar lembrete em massa</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Ana Ribeiro', days: 3, price: 180 },
          { name: 'Carlos Dias', days: 12, price: 150 },
          { name: 'Bruno Santos', days: 5, price: 160 },
        ].map((s, i) => (
          <div key={i} className="card-el" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
            <Avatar name={s.name} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: '#F87171', fontWeight: 500, marginTop: 2 }}>Atrasado {s.days} dias</div>
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>R$ {s.price}</span>
            <button style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(74,222,128,0.12)', color: '#4ADE80', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="whatsapp" size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ REPORTS ============
function ReportsScreen() {
  return (
    <div className="screen">
      <ScreenHeader title="Relatórios" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: 'users', title: 'Alunos ativos', sub: '116 alunos · atualizado agora' },
          { icon: 'users', title: 'Alunos inativos', sub: '12 alunos' },
          { icon: 'alert', title: 'Inadimplentes', sub: '7 alunos · R$ 1.260' },
          { icon: 'trending', title: 'Receita por mês', sub: 'Últimos 6 meses' },
          { icon: 'chart', title: 'Matrículas', sub: 'Novos alunos por período' },
        ].map((r, i) => (
          <div key={i} className="card-el" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={r.icon} size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{r.sub}</div>
            </div>
            <Icon name="download" size={18} color="var(--fg-3)" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SETTINGS ============
function SettingsScreen() {
  const Group = ({ title, children }) => (
    <>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: '18px 0 10px' }}>{title}</div>
      <div className="card-el" style={{ overflow: 'hidden' }}>{children}</div>
    </>
  );
  const Row = ({ icon, label, value, danger, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderBottom: last ? 'none' : '1px solid var(--border-subtle)', cursor: 'pointer' }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: danger ? 'rgba(248,113,113,0.1)' : 'var(--ink-750)', color: danger ? '#F87171' : 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={16} />
      </div>
      <span style={{ flex: 1, fontSize: 14, color: danger ? '#F87171' : 'var(--fg-1)' }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{value}</span>}
      {!danger && <Icon name="chevron" size={16} color="var(--fg-4)" />}
    </div>
  );
  return (
    <div className="screen">
      <ScreenHeader title="Ajustes" />
      <div className="card-el" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar name="Carlos Mendes" size={54} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Carlos Mendes</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 2 }}>Academia Tigre · Plano ativo</div>
        </div>
        <Icon name="edit" size={18} color="var(--fg-3)" />
      </div>
      <Group title="Conta">
        <Row icon="user" label="Perfil" />
        <Row icon="bell" label="Notificações" value="Ativas" />
        <Row icon="lock" label="Senha e segurança" last />
      </Group>
      <Group title="Assinatura">
        <Row icon="dollar" label="Plano" value="R$ 19,99/mês" />
        <Row icon="mail" label="Suporte" last />
      </Group>
      <Group title="Conta">
        <Row icon="logout" label="Sair" danger last />
      </Group>
    </div>
  );
}

Object.assign(window, {
  LoginScreen, HomeScreen, StudentsScreen, StudentDetailScreen,
  AddStudentScreen, LinkScreen, FinanceScreen, ReportsScreen, SettingsScreen,
});
