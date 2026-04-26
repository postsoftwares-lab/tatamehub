// Primitives.jsx — shared building blocks for TatameHub mobile app

// ---- Status bar ----
function StatusBar() {
  return (
    <>
      <div className="notch" />
      <div className="status-bar">
        <span>9:41</span>
        <span className="icons">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="2.5" height="4" rx="0.5"/><rect x="4" y="4" width="2.5" height="6" rx="0.5"/><rect x="8" y="2" width="2.5" height="8" rx="0.5"/><rect x="12" y="0" width="2.5" height="10" rx="0.5"/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="0.5" y="0.5" width="18" height="9" rx="2"/><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor"/></svg>
        </span>
      </div>
    </>
  );
}

// ---- Tab bar ----
function TabBar({ active, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Início', icon: 'home' },
    { id: 'students', label: 'Alunos', icon: 'users' },
    { id: 'add', label: '', icon: 'plus', isFab: true },
    { id: 'finance', label: 'Financeiro', icon: 'dollar' },
    { id: 'settings', label: 'Ajustes', icon: 'settings' },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => t.isFab ? (
        <button key={t.id} onClick={() => onNavigate(t.id)} style={{ position: 'relative' }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255,255,255,0.12)',
            color: 'var(--on-accent)', marginTop: -14,
          }}>
            <Icon name="plus" size={24} strokeWidth={2.4} />
          </div>
        </button>
      ) : (
        <button key={t.id} className={active === t.id ? 'active' : ''} onClick={() => onNavigate(t.id)}>
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ---- Screen header with large title ----
function ScreenHeader({ title, subtitle, action, onBack }) {
  return (
    <div style={{ padding: '12px 0 18px' }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'var(--ink-800)', border: '1px solid var(--border-subtle)',
          borderRadius: 10, width: 36, height: 36, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'var(--fg-1)', marginBottom: 14,
        }}>
          <Icon name="chevronL" size={18} />
        </button>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--fg-1)' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 4 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

// ---- Status badge ----
function StatusBadge({ kind, text }) {
  const styles = {
    active:   { bg: 'rgba(74,222,128,0.12)',  fg: '#4ADE80' },
    paid:     { bg: 'rgba(74,222,128,0.12)',  fg: '#4ADE80' },
    pending:  { bg: 'rgba(251,191,36,0.14)',  fg: '#FBBF24' },
    late:     { bg: 'rgba(248,113,113,0.16)', fg: '#F87171' },
    inactive: { bg: 'rgba(122,122,134,0.15)', fg: '#A6A6B0' },
    new:      { bg: 'rgba(255,255,255,0.10)',   fg: '#F4F5F7' },
  };
  const s = styles[kind] || styles.inactive;
  return (
    <span className="badge" style={{ background: s.bg, color: s.fg }}>
      <span className="dot" style={{ background: s.fg }} />{text}
    </span>
  );
}

// ---- Avatar (initials on dark with subtle ring) ----
function Avatar({ name, size = 40 }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg,#2C2C36,#1A1A1F)',
      color: 'var(--accent)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ---- Stat card ----
function StatCard({ label, value, sub, accent, trend }) {
  return (
    <div className="card-el" style={{ padding: 14, position: 'relative', overflow: 'hidden' }}>
      {accent && <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'var(--accent)' }} />}
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 8, color: accent ? 'var(--accent)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: trend === 'up' ? '#4ADE80' : trend === 'down' ? '#F87171' : 'var(--fg-3)', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

// ---- Field / Input ----
function Field({ label, value, onChange, placeholder, icon, type = 'text' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-1)' }}>{label}</span>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)' }}><Icon name={icon} size={18} /></div>}
        <input
          type={type} value={value || ''}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: 'var(--ink-850)',
            border: '1px solid var(--border-subtle)', borderRadius: 12,
            color: 'var(--fg-1)', fontSize: 15,
            padding: icon ? '12px 14px 12px 42px' : '12px 14px',
            outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.14)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>
    </label>
  );
}

Object.assign(window, { StatusBar, TabBar, ScreenHeader, StatusBadge, Avatar, StatCard, Field });
