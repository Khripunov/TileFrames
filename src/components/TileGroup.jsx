import './TileGroup.css'

const themeMap = {
  blue: ['#1d4ed8', '#3b82f6'],
  indigo: ['#4338ca', '#6366f1'],
  purple: ['#6b21a8', '#a855f7'],
  emerald: ['#047857', '#34d399'],
  amber: ['#b45309', '#f59e0b'],
  teal: ['#0f766e', '#2dd4bf'],
  cyan: ['#0ea5e9', '#22d3ee'],
  slate: ['#1f2937', '#9ca3af'],
  lime: ['#3f6212', '#a3e635'],
  pink: ['#be185d', '#fb7185'],
  fuchsia: ['#a21caf', '#e879f9'],
  rose: ['#b91c1c', '#f87171'],
  violet: ['#6d28d9', '#c4b5fd'],
}

const getTheme = (key) => themeMap[key] ?? ['#0f172a', '#475569']

function Tile({ item, onActivate, isActive }) {
  const [from, to] = getTheme(item.theme)
  return (
    <button
      className={`tile tile-${item.size}${isActive ? ' tile-active' : ''}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      type="button"
      onClick={() => onActivate(item.id)}
    >
      <div className="tile-meta">
        {item.badge ? <span className="badge">{item.badge}</span> : null}
        {item.metric ? <span className="metric">{item.metric}</span> : null}
      </div>
      <div className="tile-body">
        <p className="tile-title">{item.title}</p>
        <p className="tile-subtitle">{item.subtitle}</p>
      </div>
    </button>
  )
}

function TileGroup({ group, collapsed, onToggleCollapse, outlined, activeTile, onActivate }) {
  return (
    <section className={`group ${outlined ? 'group-outlined' : ''}`}>
      <header className="group-header">
        <div>
          <p className="group-eyebrow" style={{ color: group.accent }}>
            {group.title}
          </p>
          <p className="group-description">{group.description}</p>
        </div>
        <button className="group-toggle" onClick={onToggleCollapse} type="button">
          {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </header>

      {!collapsed && (
        <div className="tile-grid">
          {group.items.map((item) => (
            <Tile key={item.id} item={item} onActivate={onActivate} isActive={activeTile === item.id} />
          ))}
        </div>
      )}
    </section>
  )
}

export default TileGroup
