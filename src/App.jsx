import { useMemo, useState } from 'react'
import TileGroup from './components/TileGroup'
import './App.css'

const sizeMap = {
  compact: 120,
  standard: 150,
  roomy: 180,
}

const groups = [
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Dashboards and KPIs you open several times a day.',
    accent: '#2563eb',
    items: [
      {
        id: 'sales-dash',
        title: 'Sales overview',
        subtitle: 'Charts, grids, pivots',
        size: 'wide',
        theme: 'blue',
        badge: 'Live',
        metric: '+12%',
      },
      {
        id: 'inventory',
        title: 'Inventory',
        subtitle: 'Warehouse + stores',
        size: 'medium',
        theme: 'indigo',
        metric: '4 alerts',
      },
      {
        id: 'customers',
        title: 'Customers',
        subtitle: 'Segments and churn',
        size: 'tall',
        theme: 'purple',
        metric: '97% happy',
      },
      {
        id: 'finance',
        title: 'Finance',
        subtitle: 'Cash flow + AR',
        size: 'medium',
        theme: 'emerald',
        metric: '$1.2M',
      },
      {
        id: 'teams',
        title: 'Team velocity',
        subtitle: 'Burndown + throughput',
        size: 'wide',
        theme: 'amber',
        metric: 'Sprint 24',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Pinned processes and maintenance shortcuts.',
    accent: '#0f766e',
    items: [
      {
        id: 'routes',
        title: 'Transport routes',
        subtitle: 'Load + ETA monitoring',
        size: 'medium',
        theme: 'teal',
        metric: '7 trucks',
      },
      {
        id: 'service',
        title: 'Service queue',
        subtitle: 'On-site teams',
        size: 'wide',
        theme: 'cyan',
        badge: 'Now',
        metric: '3 visits',
      },
      {
        id: 'tickets',
        title: 'Tickets',
        subtitle: 'Helpdesk and escalations',
        size: 'medium',
        theme: 'slate',
        metric: '18 open',
      },
      {
        id: 'templates',
        title: 'Quick templates',
        subtitle: 'Repairs + inspections',
        size: 'small',
        theme: 'lime',
        metric: '6 drafts',
      },
      {
        id: 'approvals',
        title: 'Approvals',
        subtitle: 'Contracts and vacation',
        size: 'tall',
        theme: 'emerald',
        metric: '5 waiting',
      },
    ],
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Experiments, prototypes and playgrounds.',
    accent: '#c026d3',
    items: [
      {
        id: 'ai-lab',
        title: 'AI lab',
        subtitle: 'Notebooks + metrics',
        size: 'wide',
        theme: 'pink',
        badge: 'Beta',
        metric: '9 runs',
      },
      {
        id: 'design-kit',
        title: 'Design kit',
        subtitle: 'Tokens + Figma links',
        size: 'medium',
        theme: 'fuchsia',
        metric: 'Updated',
      },
      {
        id: 'features',
        title: 'Feature flags',
        subtitle: 'Rollouts + killswitch',
        size: 'medium',
        theme: 'rose',
        metric: '12 toggles',
      },
      {
        id: 'playground',
        title: 'Tile playground',
        subtitle: 'Custom layout tests',
        size: 'large',
        theme: 'violet',
        metric: 'Freeform',
      },
    ],
  },
]

function App() {
  const [compactness, setCompactness] = useState('standard')
  const [activeTile, setActiveTile] = useState('sales-dash')
  const [outlined, setOutlined] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState([])

  const cssVars = useMemo(
    () => ({
      '--tile-base': `${sizeMap[compactness]}px`,
      '--tile-gap': compactness === 'compact' ? '12px' : compactness === 'roomy' ? '18px' : '14px',
    }),
    [compactness]
  )

  const toggleCollapse = (groupId) => {
    setCollapsedGroups((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]
    )
  }

  return (
    <div className="page" style={cssVars}>
      <header className="hero">
        <div>
          <p className="eyebrow">Tile groups</p>
          <h1>Arrange tiles into groups just like the DevExpress Tile Control</h1>
          <p className="lede">
            Organize shortcuts into visual groups, resize tiles, and collapse sections while keeping a consistent
            grid. Everything below is pure React without third-party layout helpers.
          </p>
          <div className="controls">
            <label className="control">
              <span>Tile density</span>
              <div className="chip-row">
                {Object.keys(sizeMap).map((key) => (
                  <button
                    key={key}
                    className={compactness === key ? 'chip active' : 'chip'}
                    onClick={() => setCompactness(key)}
                    type="button"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </label>
            <label className="control inline">
              <input type="checkbox" checked={outlined} onChange={(e) => setOutlined(e.target.checked)} />
              <span>Show group outlines</span>
            </label>
          </div>
        </div>
      </header>

      <main className="board">
        {groups.map((group) => (
          <TileGroup
            key={group.id}
            group={group}
            outlined={outlined}
            collapsed={collapsedGroups.includes(group.id)}
            onToggleCollapse={() => toggleCollapse(group.id)}
            activeTile={activeTile}
            onActivate={setActiveTile}
          />
        ))}
      </main>
    </div>
  )
}

export default App
