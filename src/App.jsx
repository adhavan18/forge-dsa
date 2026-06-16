// FORGE — FAANG Prep System
// App entry point — imports data from separate files

import { useState, useEffect, useRef, useCallback } from 'react'
import { DSA_TOPICS as DSA, PHASES, TOTAL_PROBLEMS as TOTAL } from './data/dsa.js'
import { SD_TOPICS } from './data/systemdesign.js'
import { APTITUDE_SECTIONS } from './data/aptitude.js'
import { FUNDAMENTALS } from './data/fundamentals.js'

const PLACEMENT_DATE = '2026-07-01'
const todayStr = () => new Date().toISOString().split('T')[0]
const getDaysLeft = () => Math.max(0, Math.ceil((new Date(PLACEMENT_DATE) - new Date()) / 86400000))

// ── local storage helpers (Vite / Vercel use localStorage) ──────────
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

// ── SVG Ring ────────────────────────────────────────────────────────
function Ring({ pct, color, size = 40 }) {
  const r = (size - 5) / 2, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`}
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
    </svg>
  )
}

// ── Code Block with syntax highlight + copy ─────────────────────────
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const hi = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#[^\n]*)/g, '<span class="cm">$1</span>')
    .replace(/\b(def|return|for|while|if|else|elif|in|not|and|or|import|from|class|self|True|False|None|break|continue|pass|yield|lambda|with|as|try|except|raise|finally|global|nonlocal)\b/g, '<span class="kw">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, '<span class="st">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="nm">$1</span>')
  return (
    <div className="code-wrap">
      <div className="code-header">
        <span className="code-lang">Python</span>
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
      <div className="code-body" dangerouslySetInnerHTML={{ __html: hi }} />
    </div>
  )
}

// ── Problem Row ─────────────────────────────────────────────────────
function ProbRow({ p, color, solved, onToggle, review, onBookmark }) {
  return (
    <div className="prob-row">
      <input type="checkbox" className="prob-check" checked={!!solved[p.id]} onChange={() => onToggle(p.id)}
        style={{ accentColor: color }} />
      <span className={`diff-badge ${p.diff[0]}`}>{p.diff[0]}</span>
      <a href={p.url} target="_blank" rel="noopener noreferrer"
        className={`prob-link${solved[p.id] ? ' done' : ''}`}>{p.name}</a>
      <span className="prob-tag">{p.pat}</span>
      <button className={`bm-btn${review[p.id] ? ' on' : ''}`} onClick={() => onBookmark(p.id)}>
        {review[p.id] ? '★' : '☆'}
      </button>
    </div>
  )
}

// ── TODAY ───────────────────────────────────────────────────────────
function TodayView({ solved, review, onToggle, onBookmark, streak, setActiveTopic }) {
  const solvedC = Object.keys(solved).length
  const todaySolved = Object.values(solved).filter(d => d === todayStr()).length
  const pct = Math.round(solvedC / TOTAL * 100)
  const days = getDaysLeft()
  const urgClass = days <= 7 ? 'hot' : days <= 14 ? 'warning' : 'ok'
  const reviewProbs = DSA.flatMap(t => t.problems.filter(p => review[p.id]).map(p => ({ ...p, color: t.color })))
  const nextUp = []
  for (const t of DSA) {
    for (const p of t.problems) {
      if (!solved[p.id]) nextUp.push({ ...p, topicColor: t.color })
      if (nextUp.length >= 10) break
    }
    if (nextUp.length >= 10) break
  }
  return (
    <div className="page">
      <div className="mission-header">
        <div className="eyebrow">Mission status</div>
        <div className={`mission-days ${urgClass}`}>{days} days to placements</div>
        <div className="mission-sub">{solvedC} of {TOTAL} solved · {pct}% · {todaySolved} today</div>
      </div>
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { l: 'Streak', v: streak.count + 'd', s: 'best ' + streak.longest + 'd', c: 'var(--brand)' },
          { l: 'Solved', v: solvedC + '', s: `${pct}% done`, c: 'var(--ok)' },
          { l: 'Flagged', v: reviewProbs.length + '', s: 'for review', c: 'var(--err)' },
          { l: 'Remaining', v: (TOTAL - solvedC) + '', s: 'problems left', c: 'var(--t2)' },
        ].map(x => (
          <div key={x.l} className="surface stat-block">
            <div className="stat-label">{x.l}</div>
            <div className="stat-val" style={{ color: x.c }}>{x.v}</div>
            <div className="stat-sub">{x.s}</div>
          </div>
        ))}
      </div>
      <div className="section-head">Up next</div>
      <div style={{ marginBottom: 28 }}>
        {nextUp.length === 0
          ? <p style={{ color: 'var(--ok)', padding: '12px 0', fontFamily: 'var(--mono)', fontSize: 12 }}>🎉 All done. You're ready.</p>
          : nextUp.map(p => <ProbRow key={p.id} p={p} color={p.topicColor} solved={solved}
            onToggle={onToggle} review={review} onBookmark={onBookmark} />)}
      </div>
      {reviewProbs.length > 0 && <>
        <div className="section-head">Review queue ({reviewProbs.length})</div>
        {reviewProbs.slice(0, 6).map(p => <ProbRow key={p.id} p={p} color={p.color}
          solved={solved} onToggle={onToggle} review={review} onBookmark={onBookmark} />)}
      </>}
    </div>
  )
}

// ── DSA ROADMAP ─────────────────────────────────────────────────────
function RoadmapView({ solved, onSelectTopic }) {
  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow">DSA Roadmap</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)', marginBottom: 8 }}>
          Beginner → <span style={{ color: 'var(--brand)' }}>FAANG</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t2)' }}>13 topics · {TOTAL} problems · complete pattern library</p>
      </div>
      {PHASES.map(ph => {
        const topics = DSA.filter(t => t.phase === ph.id)
        const s = topics.reduce((a, t) => a + t.problems.filter(p => solved[p.id]).length, 0)
        const total = topics.reduce((a, t) => a + t.problems.length, 0)
        return (
          <div key={ph.id} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--t3)' }}>Phase {ph.id}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: ph.color }}>{ph.title}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>{ph.weeks}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t3)' }}>{s}/{total}</span>
            </div>
            <div className="topic-grid">
              {topics.map(t => {
                const ts = t.problems.filter(p => solved[p.id]).length
                const pct = ts / t.problems.length
                return (
                  <div key={t.id} className={`topic-card${pct === 1 ? ' complete' : ''}`}
                    style={{ '--tc': t.color }} onClick={() => onSelectTopic(t)}>
                    <div className="topic-card-title">{t.title}</div>
                    <div className="topic-card-meta">Wk {t.week} · {ts}/{t.problems.length}</div>
                    <div className="ring-wrap"><Ring pct={pct} color={t.color} size={36} /></div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── TOPIC LESSON ────────────────────────────────────────────────────
function TopicView({ topic, solved, onToggle, review, onBookmark, onBack }) {
  const [tab, setTab] = useState('lesson')
  const ts = topic.problems.filter(p => solved[p.id]).length
  const pct = ts / topic.problems.length
  const l = topic.lesson
  return (
    <div className="page">
      <button className="back-link" onClick={onBack}>← Back to roadmap</button>
      <div className="lesson-header">
        <div>
          <div className="eyebrow" style={{ color: topic.color }}>Phase {topic.phase} · Week {topic.week}</div>
          <h1 className="lesson-title">{topic.title}</h1>
          <div className="lesson-meta">{ts}/{topic.problems.length} solved · {Math.round(pct * 100)}% complete</div>
        </div>
        <Ring pct={pct} color={topic.color} size={60} />
      </div>
      <div className="tab-strip">
        {[['lesson', 'Lesson'], ['problems', `Problems (${topic.problems.length})`], ['template', 'Template']].map(([id, lb]) =>
          <button key={id} className={`tab-btn${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{lb}</button>)}
      </div>

      {tab === 'lesson' && (
        <div className="lesson-body">
          <p className="lesson-overview">{l.overview}</p>
          <div className="l-section">
            <div className="l-head">Patterns</div>
            {l.patterns.map((pat, i) => (
              <div key={i} className="pattern-card">
                <div className="pattern-name">{pat.name}</div>
                <div className="pattern-signal"><strong style={{ color: 'var(--t2)', fontWeight: 500 }}>When you see: </strong>{pat.signal}</div>
                <div className="pattern-approach"><strong style={{ color: 'var(--t2)', fontWeight: 500 }}>Approach: </strong>{pat.approach}</div>
                {pat.trace && <pre className="trace-block">{pat.trace}</pre>}
                <div className="complexity-pills">
                  <span className="cpill">Time: <strong>{pat.time}</strong></span>
                  <span className="cpill">Space: <strong>{pat.space}</strong></span>
                </div>
              </div>
            ))}
          </div>
          <div className="l-section">
            <div className="l-head">Pattern recognition table</div>
            <table className="decision-table">
              <thead><tr><th>When you see...</th><th>Think...</th></tr></thead>
              <tbody>{l.decisions.map((d, i) => <tr key={i}><td>{d.see}</td><td>{d.think}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="l-section">
            <div className="l-head">Common mistakes</div>
            <ul className="pitfall-list">{l.pitfalls.map((p, i) => <li key={i}><span className="pitfall-icon">⚠</span><span>{p}</span></li>)}</ul>
          </div>
        </div>
      )}

      {tab === 'problems' && (
        <div className="prob-list">
          {topic.problems.map(p => <ProbRow key={p.id} p={p} color={topic.color}
            solved={solved} onToggle={onToggle} review={review} onBookmark={onBookmark} />)}
        </div>
      )}

      {tab === 'template' && <CodeBlock code={topic.template} />}
    </div>
  )
}

// ── SYSTEM DESIGN ───────────────────────────────────────────────────
function SDView({ onSelectSD }) {
  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow">System Design</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)', marginBottom: 8 }}>
          Architecture at <span style={{ color: 'var(--p5)' }}>Scale</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t2)' }}>Core concepts + full interview walkthroughs. Click to read.</p>
      </div>
      <div className="grid-2">
        {SD_TOPICS.map(t => (
          <div key={t.id} className="sd-card" onClick={() => onSelectSD(t)}>
            <div className="sd-card-title">{t.title}</div>
            <div className="sd-card-desc">{t.desc}</div>
            <span className="sd-card-tag">{t.tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SDDetailView({ topic, onBack }) {
  const lines = topic.content.split('\n')
  const elements = []
  let inCode = false, codeLines = [], tableRows = []

  const flushTable = () => {
    if (tableRows.length) {
      elements.push(<table key={`t${elements.length}`} className="decision-table"><tbody>{tableRows}</tbody></table>)
      tableRows = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('```')) {
      if (!inCode) { inCode = true; codeLines = [] }
      else {
        elements.push(<pre key={i} style={{ fontFamily: 'var(--mono)', fontSize: 11.5, background: 'rgba(0,0,0,0.5)', padding: '14px 16px', borderRadius: 7, overflow: 'auto', color: '#86efac', lineHeight: 1.65, margin: '12px 0', whiteSpace: 'pre' }}>{codeLines.join('\n')}</pre>)
        inCode = false; codeLines = []
      }
      continue
    }
    if (inCode) { codeLines.push(line); continue }
    if (line.startsWith('# ')) { flushTable(); elements.push(<h1 key={i} style={{ fontSize: 26, fontWeight: 700, color: 'var(--t1)', marginBottom: 20 }}>{line.slice(2)}</h1>); continue }
    if (line.startsWith('## ')) { flushTable(); elements.push(<h2 key={i} style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginTop: 28, marginBottom: 10, paddingTop: 20, borderTop: '1px solid var(--rail)' }}>{line.slice(3)}</h2>); continue }
    if (line.startsWith('---')) { flushTable(); elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--rail)', margin: '20px 0' }} />); continue }
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() && !c.match(/^[-\s]+$/))
      if (!cells.length) continue
      const isH = lines[i + 1]?.includes('---')
      tableRows.push(<tr key={i}>{cells.map((c, j) => isH
        ? <th key={j} style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--t3)', padding: '7px 10px', textAlign: 'left', borderBottom: '1px solid var(--rail)' }}>{c.trim()}</th>
        : <td key={j} style={{ padding: '7px 10px', fontSize: 13, color: 'var(--t2)', borderBottom: '1px solid var(--rail)', verticalAlign: 'top' }}>{c.trim()}</td>
      )}</tr>)
      continue
    }
    flushTable()
    if (line.trim() === '') { elements.push(<br key={i} />); continue }
    const bold = line.split(/\*\*(.+?)\*\*/g)
    elements.push(<p key={i} style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 4 }}>
      {bold.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--t1)', fontWeight: 600 }}>{p}</strong> : p)}
    </p>)
  }
  flushTable()

  return (
    <div className="page-sm">
      <button className="back-link" onClick={onBack}>← Back to System Design</button>
      <div className="surface" style={{ padding: 32, borderRadius: 14 }}>{elements}</div>
    </div>
  )
}

// ── APTITUDE ────────────────────────────────────────────────────────
function AptitudeView() {
  const [sectionId, setSectionId] = useState(APTITUDE_SECTIONS[0].id)
  const [answers, setAnswers] = useState({})
  const section = APTITUDE_SECTIONS.find(s => s.id === sectionId)
  const score = section.questions.filter(q => answers[q.id] === q.answer).length
  const answered = section.questions.filter(q => answers[q.id] !== undefined).length

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow">Aptitude Practice</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)', marginBottom: 8 }}>
          Placement <span style={{ color: 'var(--p7)' }}>Prep</span>
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        {APTITUDE_SECTIONS.map(s => (
          <button key={s.id}
            style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid var(--rail)', background: sectionId === s.id ? 'var(--plate)' : 'transparent', color: sectionId === s.id ? 'var(--t1)' : 'var(--t3)', fontSize: 13, fontWeight: 500, transition: 'all 0.12s', cursor: 'pointer' }}
            onClick={() => { setSectionId(s.id); setAnswers({}) }}>{s.title}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t3)' }}>
          {answered}/{section.questions.length} · {score} correct
        </span>
      </div>
      {section.questions.map(q => {
        const sel = answers[q.id]
        const revealed = sel !== undefined
        return (
          <div key={q.id} className="apt-card">
            <div className="apt-q">{q.q}</div>
            <div className="apt-options">
              {q.options.map((opt, i) => {
                let cls = 'apt-option'
                if (revealed) {
                  if (i === q.answer) cls += ' selected-correct'
                  else if (i === sel) cls += ' selected-wrong'
                }
                return (
                  <button key={i} className={cls}
                    onClick={() => { if (!revealed) setAnswers(a => ({ ...a, [q.id]: i })) }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, marginRight: 6, color: 'var(--t3)' }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {revealed && (
              <div className="apt-explanation">
                <strong style={{ color: 'var(--t1)' }}>Explanation: </strong>{q.explanation}
                {q.formula && <><br /><strong style={{ color: 'var(--t1)' }}>Formula: </strong>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{q.formula}</span></>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── CS FUNDAMENTALS ─────────────────────────────────────────────────
function FundamentalsView() {
  const [activeModId, setActiveModId] = useState(FUNDAMENTALS[0].id)
  const [openSecs, setOpenSecs] = useState({})
  const mod = FUNDAMENTALS.find(m => m.id === activeModId)
  const toggle = key => setOpenSecs(s => ({ ...s, [key]: !s[key] }))

  const renderContent = (text) => {
    if (!text) return null
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, pi) => {
      if (part.startsWith('```')) {
        const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '')
        return <pre key={pi} style={{ fontFamily: 'var(--mono)', fontSize: 11.5, background: 'rgba(0,0,0,0.4)', padding: '12px 14px', borderRadius: 6, overflow: 'auto', color: '#86efac', margin: '10px 0', whiteSpace: 'pre' }}>{code}</pre>
      }
      return part.split('\n').map((line, li) => {
        if (line.startsWith('| ')) {
          const cells = line.split('|').filter(c => c.trim() && !c.match(/^[-\s]+$/))
          if (!cells.length) return null
          const isH = li < part.split('\n').length - 1 && part.split('\n')[li + 1]?.includes('---')
          return <tr key={`${pi}-${li}`}>{cells.map((c, ci) => isH
            ? <th key={ci}>{c.trim()}</th>
            : <td key={ci}>{c.trim()}</td>)}</tr>
        }
        if (line.startsWith('- ')) {
          const m = line.match(/^- \*\*(.+?)\*\*:? (.*)/)
          if (m) return <li key={`${pi}-${li}`}><strong>{m[1]}:</strong> {m[2]}</li>
          return <li key={`${pi}-${li}`}>{line.slice(2)}</li>
        }
        if (line.trim() === '') return <br key={`${pi}-${li}`} />
        const segs = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
        return <p key={`${pi}-${li}`}>{segs.map((s, si) => {
          if (s.startsWith('`') && s.endsWith('`')) return <code key={si}>{s.slice(1, -1)}</code>
          if (s.startsWith('**') && s.endsWith('**')) return <strong key={si}>{s.slice(2, -2)}</strong>
          return s
        })}</p>
      })
    })
  }

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow">CS Fundamentals</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)', marginBottom: 8 }}>
          Core <span style={{ color: 'var(--p6)' }}>Concepts</span>
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {FUNDAMENTALS.map(m => (
          <button key={m.id}
            style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid var(--rail)', background: activeModId === m.id ? 'var(--plate)' : 'transparent', color: activeModId === m.id ? 'var(--t1)' : 'var(--t3)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            onClick={() => { setActiveModId(m.id); setOpenSecs({}) }}>{m.title}</button>
        ))}
      </div>
      {mod.sections.map((sec, i) => {
        const key = `${mod.id}-${i}`
        const open = openSecs[key]
        return (
          <div key={i} style={{ background: 'var(--lift)', border: '1px solid var(--rail)', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}
              onClick={() => toggle(key)}>
              <span>{sec.title}</span>
              <span style={{ color: 'var(--t3)', fontSize: 18, lineHeight: 1 }}>{open ? '−' : '+'}</span>
            </div>
            {open && (
              <div style={{ padding: '0 18px 18px', fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.8 }}
                className="fund-content">
                {renderContent(sec.content)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── TIMER ───────────────────────────────────────────────────────────
function TimerView() {
  const MODES = [{ l: 'Focus', m: 25 }, { l: 'Short break', m: 5 }, { l: 'Long break', m: 15 }]
  const [mode, setMode] = useState(0)
  const [secs, setSecs] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const ref = useRef(null)

  useEffect(() => { setSecs(MODES[mode].m * 60); setRunning(false) }, [mode])
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs(s => {
        if (s <= 1) { clearInterval(ref.current); setRunning(false); if (mode === 0) setSessions(n => n + 1); return MODES[mode].m * 60 }
        return s - 1
      }), 1000)
    } else clearInterval(ref.current)
    return () => clearInterval(ref.current)
  }, [running, mode])

  const total = MODES[mode].m * 60
  const pct = (total - secs) / total
  const R = 84, C = 2 * Math.PI * R
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const colors = ['var(--brand)', 'var(--ok)', 'var(--p5)']

  return (
    <div className="page">
      <div className="timer-wrap">
        <div className="section-head">Focus Timer</div>
        <div className="timer-modes">
          {MODES.map((m, i) => <button key={i} className={`timer-mode-btn${mode === i ? ' active' : ''}`} onClick={() => setMode(i)}>{m.l} · {m.m}m</button>)}
        </div>
        <div className="timer-face">
          <div className="timer-ring-wrap">
            <svg width="200" height="200" className="timer-svg">
              <circle cx="100" cy="100" r={R} fill="none" stroke="var(--plate)" strokeWidth="10" />
              <circle cx="100" cy="100" r={R} fill="none" stroke={colors[mode]} strokeWidth="10"
                strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`}
                style={{ transition: 'stroke-dasharray 0.5s ease' }} />
            </svg>
            <div className="timer-display">
              <div className="timer-time">{mm}:{ss}</div>
              <div className="timer-mode-label">{MODES[mode].l}</div>
            </div>
          </div>
          <div className="timer-btns">
            <button className="btn-primary" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
            <button className="btn-ghost" onClick={() => { setRunning(false); setSecs(MODES[mode].m * 60) }}>Reset</button>
          </div>
          <div className="sessions-count">{sessions} focus session{sessions !== 1 ? 's' : ''} today</div>
        </div>
        <div className="section-head" style={{ marginTop: 8 }}>Ground rules</div>
        {[
          ['30-minute cold rule', 'Attempt every problem without hints for at least 30 minutes. Looking at a solution before that trains dependency, not pattern recognition.'],
          ['Pattern-first thinking', 'Before writing code, say the algorithm out loud. Name the pattern before you code it. "This is a sliding window because I need the longest subarray satisfying a condition."'],
          ['Re-solve the next day', 'Every problem you looked up the solution for: re-solve from memory the next day, cold, with the timer running. If you cannot, you do not own the pattern yet.'],
          ['Weekend contests — mandatory', 'Every Saturday: LeetCode Weekly Contest. Every Sunday: Codeforces Div.2 A+B+C. Timed pressure under unfamiliar problems is a completely different skill from casual practice.'],
        ].map(([t, d]) => <div key={t} className="rule-card"><div className="rule-title">{t}</div><div className="rule-body">{d}</div></div>)}
      </div>
    </div>
  )
}

// ── STATS ───────────────────────────────────────────────────────────
function StatsView({ solved }) {
  const all = DSA.flatMap(t => t.problems.map(p => ({ ...p, color: t.color })))
  const byD = d => { const tot = all.filter(p => p.diff === d); return { done: tot.filter(p => solved[p.id]).length, total: tot.length } }
  const e = byD('Easy'), m = byD('Medium'), h = byD('Hard')
  const solvedC = Object.keys(solved).length

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow">Progress Dashboard</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)' }}>
          Your <span style={{ color: 'var(--ok)' }}>Stats</span>
        </h1>
      </div>
      <div className="stat-row">
        {[{ d: 'Easy', s: e, c: 'var(--ok)' }, { d: 'Medium', s: m, c: 'var(--warn)' }, { d: 'Hard', s: h, c: 'var(--err)' }].map(x => (
          <div key={x.d} className="stat-card">
            <div className="lbl">{x.d}</div>
            <div className="num" style={{ color: x.c }}>{x.s.done}<span style={{ fontSize: 14, color: 'var(--t3)', marginLeft: 6 }}>/ {x.s.total}</span></div>
            <div style={{ marginTop: 10 }}>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${x.s.total ? x.s.done / x.s.total * 100 : 0}%`, background: x.c }} /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="section-head">By topic</div>
      {DSA.map(t => {
        const done = t.problems.filter(p => solved[p.id]).length
        const pct = done / t.problems.length
        return (
          <div key={t.id} className="progress-bar-wrap">
            <div className="progress-bar-header">
              <span style={{ color: 'var(--t1)' }}>{t.title}</span>
              <span>{done}/{t.problems.length} · {Math.round(pct * 100)}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${pct * 100}%`, background: t.color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── LOG ─────────────────────────────────────────────────────────────
function LogView({ logs, setLogs }) {
  const [input, setInput] = useState('')
  const add = () => {
    if (!input.trim()) return
    const nl = [{ id: Date.now(), date: todayStr(), text: input.trim() }, ...logs].slice(0, 200)
    setLogs(nl)
    store.set('forge:logs', nl)
    setInput('')
  }
  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow">Study Journal</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)' }}>Daily <span style={{ color: 'var(--brand)' }}>Log</span></h1>
      </div>
      <div className="log-compose">
        <input className="log-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="What did you learn? What's still unclear? What to revisit tomorrow?" />
        <button className="log-submit" onClick={add}>Add</button>
      </div>
      {logs.length === 0
        ? <p style={{ color: 'var(--t3)', fontFamily: 'var(--mono)', fontSize: 12 }}>No entries yet.</p>
        : logs.map((l, i) => (
          <div key={l.id} className="log-entry" style={i === 0 ? { borderLeftColor: 'var(--brand)' } : {}}>
            <div className="log-date">{l.date}</div>
            <div className="log-text">{l.text}</div>
          </div>
        ))}
    </div>
  )
}

// ── SEARCH ──────────────────────────────────────────────────────────
function SearchView({ solved, onToggle, review, onBookmark }) {
  const [q, setQ] = useState('')
  const all = DSA.flatMap(t => t.problems.map(p => ({ ...p, color: t.color, topicTitle: t.title })))
  const hits = q.length < 2 ? [] : all.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.pat.toLowerCase().includes(q.toLowerCase()) ||
    p.diff.toLowerCase().startsWith(q.toLowerCase()[0]))

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow">Search</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--t1)', marginBottom: 16 }}>
          All <span style={{ color: 'var(--brand)' }}>Problems</span>
        </h1>
      </div>
      <input className="search-input" autoFocus value={q} onChange={e => setQ(e.target.value)}
        placeholder={`Search all ${TOTAL} problems by name, pattern, or difficulty...`} />
      {q.length < 2
        ? <p style={{ color: 'var(--t3)', fontFamily: 'var(--mono)', fontSize: 12 }}>Type to search</p>
        : hits.length === 0
          ? <p style={{ color: 'var(--t3)' }}>No matches for "{q}"</p>
          : hits.map(p => (
            <div key={p.id}>
              <ProbRow p={p} color={p.color} solved={solved} onToggle={onToggle} review={review} onBookmark={onBookmark} />
              <div style={{ fontSize: 10, color: 'var(--t3)', paddingLeft: 26, paddingBottom: 2, fontFamily: 'var(--mono)' }}>{p.topicTitle}</div>
            </div>
          ))}
    </div>
  )
}

// ── APP ROOT ────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('today')
  const [activeTopic, setActiveTopic] = useState(null)
  const [activeSD, setActiveSD] = useState(null)
  const [solved, setSolved] = useState({})
  const [review, setReview] = useState({})
  const [streak, setStreak] = useState({ count: 0, last: '', longest: 0 })
  const [logs, setLogs] = useState([])

  useEffect(() => {
    setSolved(store.get('forge:solved') || {})
    setReview(store.get('forge:review') || {})
    setStreak(store.get('forge:streak') || { count: 0, last: '', longest: 0 })
    setLogs(store.get('forge:logs') || [])
  }, [])

  const toggleSolved = useCallback((pid) => {
    setSolved(prev => {
      const ns = { ...prev }
      if (ns[pid]) delete ns[pid]
      else {
        ns[pid] = todayStr()
        const t = todayStr()
        setStreak(st => {
          if (st.last === t) return st
          const y = new Date(Date.now() - 864e5).toISOString().split('T')[0]
          const cnt = st.last === y ? st.count + 1 : 1
          const ns2 = { count: cnt, last: t, longest: Math.max(cnt, st.longest) }
          store.set('forge:streak', ns2)
          return ns2
        })
      }
      store.set('forge:solved', ns)
      return ns
    })
  }, [])

  const toggleBookmark = useCallback((pid) => {
    setReview(prev => {
      const nr = { ...prev }
      if (nr[pid]) delete nr[pid]; else nr[pid] = todayStr()
      store.set('forge:review', nr)
      return nr
    })
  }, [])

  const navTo = (v) => { setView(v); setActiveTopic(null); setActiveSD(null) }

  const solvedC = Object.keys(solved).length
  const pct = Math.round(solvedC / TOTAL * 100)
  const days = getDaysLeft()

  const NAV = [
    ['today', 'Today'], ['roadmap', 'DSA'], ['sd', 'Sys Design'],
    ['apt', 'Aptitude'], ['fundamentals', 'CS Core'],
    ['timer', 'Timer'], ['stats', 'Stats'], ['log', 'Log'], ['search', 'Search'],
  ]

  const activeView = activeTopic || activeSD ? null : view

  const renderContent = () => {
    if (activeTopic) return <TopicView topic={activeTopic} solved={solved} onToggle={toggleSolved}
      review={review} onBookmark={toggleBookmark} onBack={() => setActiveTopic(null)} />
    if (activeSD) return <SDDetailView topic={activeSD} onBack={() => setActiveSD(null)} />
    switch (view) {
      case 'today': return <TodayView solved={solved} review={review} onToggle={toggleSolved}
        onBookmark={toggleBookmark} streak={streak} setActiveTopic={setActiveTopic} />
      case 'roadmap': return <RoadmapView solved={solved} onSelectTopic={t => setActiveTopic(t)} />
      case 'sd': return <SDView onSelectSD={t => setActiveSD(t)} />
      case 'apt': return <AptitudeView />
      case 'fundamentals': return <FundamentalsView />
      case 'timer': return <TimerView />
      case 'stats': return <StatsView solved={solved} />
      case 'log': return <LogView logs={logs} setLogs={setLogs} />
      case 'search': return <SearchView solved={solved} onToggle={toggleSolved} review={review} onBookmark={toggleBookmark} />
      default: return null
    }
  }

  return (
    <div>
      {/* Urgency strip */}
      <div className="urgency-bar">
        <span className="urgency-brand">FORGE</span>
        <div className="urgency-slots">
          <div className={`urgency-slot${days <= 14 ? ' hot' : ''}`}>
            <span>Placements in</span><span className="v">{days}d</span>
          </div>
          <div className="urgency-slot ok">
            <span className="v">{solvedC}</span><span>/ {TOTAL} solved</span>
          </div>
          <div className="urgency-slot">
            <div className="urgency-progress"><div className="urgency-progress-fill" style={{ width: `${pct}%` }} /></div>
            <span className="v">{pct}%</span>
          </div>
          <div className="urgency-slot">
            <span>🔥</span><span className="v">{streak.count}d</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="top-nav">
        {NAV.map(([id, lb]) => (
          <button key={id} className={`nav-pill${activeView === id ? ' active' : ''}`} onClick={() => navTo(id)}>{lb}</button>
        ))}
      </nav>

      {/* Content */}
      <div className="app-shell">{renderContent()}</div>
    </div>
  )
}
