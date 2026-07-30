import { useEffect, useRef, useState } from 'react'
import './Progress.css'

const CF_HANDLE = 'DJJHA'
const CF_API = 'https://codeforces.com/api'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const Progress = () => {
  const [cfData, setCfData] = useState(null)
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

    fetch(`${CF_API}/user.status?handle=${CF_HANDLE}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') {
          const dailyCounts = {}
          data.result.forEach((sub) => {
            const d = new Date(sub.creationTimeSeconds * 1000)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            dailyCounts[key] = (dailyCounts[key] || 0) + 1
          })
          setCfData({ dailyCounts })
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
        <h2 className="progress-heading">
          <img
            className="cf-heading-logo"
            src="https://codeforces.org/s/96343/images/codeforces-sponsored-by-ton.png"
            alt=""
          />
          Codeforces
          <a
            href={`https://codeforces.com/profile/${CF_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cf-heading-link"
          >
            {CF_HANDLE} ↗
          </a>
        </h2>

        {cfError && <p className="progress-sub">Unable to load Codeforces data.</p>}

        {cfLoading && (
          <p className="progress-sub">Loading heatmap...</p>
        )}

        {!cfLoading && !cfError && cfData && (
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
          </>
        )}
      </div>
    </section>
  )
}

export default Progress
