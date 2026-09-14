'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  FileUp,
  Gauge,
  LayoutDashboard,
  Menu,
  Play,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Upload,
  UserRound,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'

const signalData = Array.from({ length: 60 }, (_, index) => {
  const t = index / 5
  return {
    time: `${index}s`,
    amplitude: Math.sin(t * 2.2) * 22 + Math.sin(t * 5.4) * 9 + Math.cos(t * 0.55) * 12 + (index % 7 === 0 ? 8 : 0),
    secondary: Math.sin(t * 1.7) * 13 + Math.cos(t * 4.3) * 5,
  }
})

const spectrumData = Array.from({ length: 24 }, (_, index) => ({
  frequency: `${index + 1}`,
  value: Math.max(5, Math.round(12 + Math.sin(index * 0.8) * 7 + (index === 8 ? 22 : 0) + (index === 13 ? 13 : 0))),
}))

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Signal Analysis', icon: Waves },
  { label: 'Patient Monitor', icon: UserRound },
  { label: 'Research Insights', icon: Sparkles },
]

function StatCard({ label, value, detail, icon: Icon, tone = 'blue' }: { label: string; value: string; detail?: string; icon: typeof Activity; tone?: 'blue' | 'green' | 'amber' | 'purple' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={18} /></div>
      <div className="stat-copy"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>
    </div>
  )
}

function PanelHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return <div className="panel-header"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action}</div>
}

export default function Page() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [isLive, setIsLive] = useState(true)
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chartData = useMemo(() => isLive ? signalData : signalData.map((point) => ({ ...point, amplitude: point.amplitude * 0.78 })), [isLive])

  const action = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className="app-shell">
      {notice && <div className="toast"><Check size={16} /> {notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={14} /></button></div>}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Brain size={21} /></div><div><strong>Neuro<span>Pulse</span></strong><small>CLINICAL ANALYTICS</small></div><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="workspace"><span>WORKSPACE</span><button><div className="workspace-dot">N</div> NeuroLab <ChevronDown size={14} /></button></div>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => { setActiveNav(item.label); setSidebarOpen(false) }}><item.icon size={17} />{item.label}{item.label === 'Research Insights' && <span className="new-pill">NEW</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings size={17} />Settings</button><button className="nav-item"><CircleHelp size={17} />Help & support</button><div className="user-card"><div className="avatar">DR</div><div><strong>Dr. Riley Chen</strong><small>Neurologist</small></div><ChevronDown size={14} /></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><div className="search-box"><Search size={16} /><input aria-label="Search" placeholder="Search records..." /></div><Button variant="outline" className="outline-button" onClick={() => action('Analysis report exported')}><FileUp data-icon="inline-start" />Export report</Button><div className="online"><i /> System online</div></div></header>
        <div className="content-wrap">
          <section className="page-heading"><div><div className="section-kicker"><span className="pulse-dot" /> LIVE SESSION · #NP-2408</div><h1>Good morning, Dr. Chen</h1><p>Real-time brain signal monitoring and analysis.</p></div><div className="heading-actions"><Button variant="outline" className="outline-button" onClick={() => action('EEG file picker ready')}><Upload data-icon="inline-start" />Upload EEG file</Button><Button className="primary-button" onClick={() => action('New signal generated')}><RefreshCw data-icon="inline-start" />Generate signal</Button></div></section>
          <div className="stats-grid"><StatCard label="EEG channels" value="16" detail="All channels active" icon={Activity} tone="blue" /><StatCard label="Signal quality" value="94%" detail="Excellent quality" icon={Gauge} tone="green" /><StatCard label="Dominant wave" value="Alpha" detail="8–13 Hz detected" icon={Waves} tone="purple" /><StatCard label="Alert status" value="Normal" detail="No critical patterns" icon={ShieldAlert} tone="green" /></div>
          <section className="panel waveform-panel"><PanelHeader eyebrow="REAL-TIME MONITORING" title="Live EEG signal" action={<div className="chart-controls"><span className="channel-key"><i /> Channel 01</span><button className={`live-toggle ${isLive ? 'on' : ''}`} onClick={() => setIsLive(!isLive)}><span />{isLive ? 'Live' : 'Paused'}</button></div>} /><div className="chart-meta"><span><strong>Amplitude</strong> µV</span><span>Window: 12 sec <ChevronDown size={14} /></span></div><div className="signal-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}><CartesianGrid stroke="rgba(148,163,184,.1)" vertical={false} /><XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={9} /><YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} domain={[-55, 55]} /><Tooltip contentStyle={{ background: '#111c2f', border: '1px solid #253554', borderRadius: 8, color: '#e2e8f0' }} /><Line type="monotone" dataKey="amplitude" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} /><Line type="monotone" dataKey="secondary" stroke="#818cf8" strokeWidth={1} strokeOpacity={0.35} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div><div className="chart-footer"><span><span className="legend-line cyan" /> Raw signal</span><span><span className="legend-line violet" /> Filtered signal</span><span className="chart-live"><i /> Receiving data</span></div></section>
          <div className="lower-grid"><section className="panel"><PanelHeader eyebrow="FREQUENCY DOMAIN" title="FFT spectrum" action={<button className="icon-button" aria-label="Filter spectrum"><SlidersHorizontal size={16} /></button>} /><div className="spectrum-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={spectrumData} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}><CartesianGrid stroke="rgba(148,163,184,.1)" vertical={false} /><XAxis dataKey="frequency" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: 'rgba(56,189,248,.06)' }} contentStyle={{ background: '#111c2f', border: '1px solid #253554', borderRadius: 8 }} /><Bar dataKey="value" fill="#38bdf8" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="axis-caption">Frequency (Hz)</div></section><section className="panel band-panel"><PanelHeader eyebrow="SIGNAL COMPOSITION" title="Band powers" action={<span className="muted-label">Last 30 sec</span>} /><div className="band-list"><div className="band-row"><div className="band-name"><i className="band-alpha" />Alpha <small>8–13 Hz</small></div><strong>35%</strong><div className="progress"><span className="alpha" style={{ width: '35%' }} /></div></div><div className="band-row"><div className="band-name"><i className="band-beta" />Beta <small>13–30 Hz</small></div><strong>20%</strong><div className="progress"><span className="beta" style={{ width: '20%' }} /></div></div><div className="band-row"><div className="band-name"><i className="band-theta" />Theta <small>4–8 Hz</small></div><strong>30%</strong><div className="progress"><span className="theta" style={{ width: '30%' }} /></div></div><div className="band-row"><div className="band-name"><i className="band-delta" />Delta <small>0.5–4 Hz</small></div><strong>15%</strong><div className="progress"><span className="delta" style={{ width: '15%' }} /></div></div></div></section></div>
          <div className="bottom-grid"><section className="panel patient-panel"><PanelHeader eyebrow="PATIENT MONITORING" title="Demo Patient" action={<span className="status-badge success"><i /> Stable</span>} /><div className="patient-condition"><div className="patient-avatar"><UserRound size={24} /></div><div><strong>Stroke recovery</strong><span>Session started 09:42 AM · Day 18</span></div><button className="more-button">View profile <ChevronDown size={14} /></button></div><div className="patient-metrics"><div><span>Attention level</span><strong>82<span>%</span></strong><div className="mini-progress"><i style={{ width: '82%' }} /></div></div><div><span>Focus score</span><strong>76<span>%</span></strong><div className="mini-progress"><i style={{ width: '76%' }} /></div></div><div><span>Fatigue score</span><strong>24<span>%</span></strong><div className="mini-progress fatigue"><i style={{ width: '24%' }} /></div></div></div></section><section className="panel warning-panel"><PanelHeader eyebrow="PATTERN DETECTION" title="Early warning system" action={<button className="icon-button"><Zap size={16} /></button>} /><div className="warning-list"><div className="warning-item normal"><div className="warning-icon"><Check size={15} /></div><div><strong>Normal brain activity</strong><span>Baseline activity within expected range</span></div><span className="status-badge success">Clear</span></div><div className="warning-item caution"><div className="warning-icon"><AlertTriangle size={15} /></div><div><strong>Elevated stress detected</strong><span>Monitor beta activity · 2 min ago</span></div><span className="status-badge warning">Review</span></div><div className="warning-item danger"><div className="warning-icon"><ShieldAlert size={15} /></div><div><strong>Abnormal pattern detected</strong><span>No active events in current window</span></div><span className="status-badge danger">Clear</span></div></div></section></div>
          <section className="insight-banner"><div className="insight-icon"><Sparkles size={20} /></div><div><span className="eyebrow">RESEARCH INSIGHTS</span><strong>Alpha dominance is trending upward</strong><p>Signal coherence improved 12% across the last 3 sessions.</p></div><Button variant="outline" className="outline-button" onClick={() => setActiveNav('Research Insights')}>View research insights <ChevronDown data-icon="inline-end" /></Button></section>
        </div>
      </main>
    </div>
  )
}
