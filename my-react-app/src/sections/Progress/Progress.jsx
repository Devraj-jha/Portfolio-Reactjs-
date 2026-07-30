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
    ])
      .then(([statusData, infoData]) => {
        if (statusData.status === 'OK' && infoData.status === 'OK') {
          setCfUser(infoData.result[0])

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

  // Build heatmap weeks
  const buildCalendar = () => {
    if (!cfData) return { weeks: [], monthLabels: [] }

    const today = new Date()
    // Go back ~11 months, align to Sunday
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

    // Month labels
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
        <p className="progress-sub">
          <a
            href={`https://codeforces.com/profile/${CF_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cf-profile-link"
          >
            Codeforces — {CF_HANDLE} ↗
          </a>
        </p>

        {cfLoading && <p className="progress-sub">Loading heatmap...</p>}
        {cfError && <p className="progress-sub">Unable to load Codeforces data.</p>}

        {!cfLoading && !cfError && cfData && (
          <>
            {/* Heatmap */}
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
      </div>
    </section>
  )
}

export default Progress
