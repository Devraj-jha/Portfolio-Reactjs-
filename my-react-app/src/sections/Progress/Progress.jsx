import { useEffect, useRef, useState } from 'react'
import './Progress.css'

const CF_HANDLE = 'DJJHA'
const CF_PROXY = 'https://corsproxy.io/?'
const CF_BASE = 'https://codeforces.com/api'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const cfFetch = async (endpoint) => {
  const url = `${CF_BASE}${endpoint}`
  const res = await fetch(`${CF_PROXY}${encodeURIComponent(url)}`)
  return res.json()
}

const Progress = () => {
  const [cfData, setCfData] = useState(null)
  const [cfUser, setCfUser] = useState(null)
  const [cfRating, setCfRating] = useState(null)
  const [cfLoading, setCfLoading] = useState(true)
  const [cfError, setCfError] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return

    Promise.all([
      cfFetch(`/user.status?handle=${CF_HANDLE}`),
      cfFetch(`/user.info?handles=${CF_HANDLE}`),
      cfFetch(`/user.rating?handle=${CF_HANDLE}`),
    ])
      .then(([statusData, infoData, ratingData]) => {
        if (statusData.status === 'OK' && infoData.status === 'OK') {
          setCfUser(infoData.result[0])

          if (ratingData.status === 'OK') {
            setCfRating(ratingData.result)
          }

          const dailyCounts = {}
          const solvedSet = new Set()

          // Build date-keyed map from all submissions
          statusData.result.forEach((sub) => {
            const d = new Date(sub.creationTimeSeconds * 1000)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            dailyCounts[key] = (dailyCounts[key] || 0) + 1
            if (sub.verdict === 'OK') {
              solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`)
            }
          })

          setCfData({ dailyCounts, solved: solvedSet.size })
        } else {
          setCfError(true)
        }
        setCfLoading(false)
      })
      .catch(() => {
        setCfError(true)
        setCfLoading(false)
      })
  }, [visible])

  // --- Rating Chart SVG ---
  const renderRatingChart = () => {
    if (!cfRating || cfRating.length < 2) return null

    const W = 600, H = 220
    const pad = { top: 16, right: 16, bottom: 36, left: 44 }
    const plotW = W - pad.left - pad.right
    const plotH = H - pad.top - pad.bottom

    const ratings = cfRating.map(r => r.newRating)
    const minR = Math.min(...ratings)
    const maxR = Math.max(...ratings)
    const range = maxR - minR || 1
    const buf = range * 0.08
    const yMin = Math.max(0, Math.floor((minR - buf) / 50) * 50)
    const yMax = Math.ceil((maxR + buf) / 50) * 50

    const x = (i) => pad.left + (i / (cfRating.length - 1)) * plotW
    const y = (v) => pad.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH

    // Line path
    const path = cfRating.map((r, i) =>
      `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(r.newRating).toFixed(1)}`
    ).join(' ')

    // Y-axis ticks
    const yStep = Math.max(200, Math.round(range / 4 / 100) * 100)
    const yTicks = []
    for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep) {
      yTicks.push(v)
    }

    return (
      <div className="cf-rating-chart">
        <h3 className="cf-chart-title">Rating History</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="cf-chart-svg">
          {/* Grid lines + Y labels */}
          {yTicks.map(v => (
            <g key={v}>
              <line
                x1={pad.left} y1={y(v)}
                x2={W - pad.right} y2={y(v)}
                stroke="var(--border-color)" strokeDasharray="3,3"
              />
              <text
                x={pad.left - 8} y={y(v) + 4}
                textAnchor="end" className="cf-chart-y"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Area under the curve */}
          <path
            d={`${path}L${x(cfRating.length - 1)},${y(yMin)}L${x(0)},${y(yMin)}Z`}
            fill="var(--text-primary)" opacity="0.08"
          />

          {/* Line */}
          <path d={path} fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Dots + value labels */}
          {cfRating.map((r, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(r.newRating)} r="4.5" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeWidth="2" />
            </g>
          ))}
        </svg>
        {/* Contest labels below chart */}
        <div className="cf-chart-x-row">
          {cfRating.map((r, i) => (
            <span key={i} className="cf-chart-x-label" style={{ left: `${(i / (cfRating.length - 1)) * 100}%` }}>
              {r.contestName.replace(/^Codeforces Round /, '').replace(/^Educational /, 'Edu ').replace(/^Codeforces /, '')}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Build heatmap weeks
  const buildCalendar = () => {
    if (!cfData) return { weeks: [], monthLabels: [] }

    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 340)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const weeks = []
    const current = new Date(startDate)

    while (current <= today) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
        week.push({
          count: cfData.dailyCounts[key] || 0,
          date: new Date(current),
        })
        current.setDate(current.getDate() + 1)
      }
      weeks.push(week)
    }

    const monthLabels = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const month = week[3]?.date?.getMonth()
      if (month !== undefined && month !== lastMonth) {
        monthLabels.push({ index: wi, label: MONTHS[month], span: 1 })
        if (lastMonth >= 0) {
          monthLabels[monthLabels.length - 2].span = wi - monthLabels[monthLabels.length - 2].index
        }
        lastMonth = month
      }
    })
    if (monthLabels.length > 0) {
      monthLabels[monthLabels.length - 1].span = weeks.length - monthLabels[monthLabels.length - 1].index
    }

    return { weeks, monthLabels }
  }

  const { weeks, monthLabels } = buildCalendar()

  return (
    <section className={`progress-section ${visible ? 'visible' : ''}`} ref={ref}>
      <div className="progress-block">
        <h2 className="progress-heading">Skills Journey</h2>

        {cfError && <p className="progress-sub">Unable to load Codeforces data.</p>}

        {cfLoading && (
          <div className="cf-profile-skeleton">
            <div className="cf-skeleton-avatar" />
            <div className="cf-skeleton-lines">
              <div className="cf-skeleton-line" style={{ width: '200px' }} />
              <div className="cf-skeleton-line" style={{ width: '140px' }} />
            </div>
          </div>
        )}

        {!cfLoading && !cfError && (
          <>
            {/* Profile Header — avatar + handle + quick stats */}
            {cfUser && (
              <div className="cf-profile-header">
                <img
                  className="cf-avatar"
                  src={cfUser.titlePhoto}
                  alt={CF_HANDLE}
                  loading="lazy"
                />
                <div className="cf-profile-info">
                  <a
                    href={`https://codeforces.com/profile/${CF_HANDLE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cf-profile-link"
                  >
                    Codeforces — {CF_HANDLE} ↗
                  </a>
                  <div className="cf-profile-meta">
                    <span>Rating: <strong>{cfUser.rating}</strong></span>
                    <span className="cf-meta-sep">·</span>
                    <span>Max: <strong>{cfUser.maxRating}</strong></span>
                    <span className="cf-meta-sep">·</span>
                    <span>Rank: <strong>{cfUser.rank}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Rating Chart */}
            {renderRatingChart()}

            {/* Heatmap */}
            {cfData && (
              <>
                <div className="cf-calendar-wrapper">
                  <div className="cf-table">
                    <div className="cf-table-row">
                      <div className="cf-labels-col" />
                      <div
                        className="cf-month-labels"
                        style={{ gridTemplateColumns: `repeat(${weeks.length}, 13px)` }}
                      >
                        {monthLabels.map((m, i) => (
                          <span
                            key={i}
                            className="cf-month-label"
                            style={{ gridColumn: `${m.index + 1} / span ${m.span}` }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="cf-table-row">
                      <div className="cf-day-labels">
                        {DAY_LABELS.map((day, i) => (
                          <span key={i} className="cf-day-label">{day}</span>
                        ))}
                      </div>
                      <div className="cf-cells">
                        {weeks.map((week, wi) => (
                          <div key={wi} className="cf-week">
                            {week.map((day, di) => {
                              const level =
                                day.count === 0 ? 0
                                : day.count <= 2 ? 1
                                : day.count <= 5 ? 2
                                : day.count <= 10 ? 3
                                : 4
                              return (
                                <div
                                  key={di}
                                  className="cf-cell"
                                  data-level={level}
                                  title={`${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} — ${day.count} ${day.count === 1 ? 'submission' : 'submissions'}`}
                                />
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="cf-legend">
                    <span className="cf-legend-label">Less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                      <div key={level} className="cf-cell" data-level={level} />
                    ))}
                    <span className="cf-legend-label">More</span>
                  </div>
                </div>

                {/* Stats */}
                {cfUser && (
                  <div className="cf-stats">
                    <span className="cf-stat">Rating: <strong>{cfUser.rating}</strong></span>
                    <span className="cf-stat">Max: <strong>{cfUser.maxRating}</strong></span>
                    <span className="cf-stat">Rank: <strong>{cfUser.rank}</strong></span>
                    <span className="cf-stat">Solved: <strong>{cfData.solved}</strong></span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Progress
