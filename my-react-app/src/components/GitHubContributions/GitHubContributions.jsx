import { useState, useEffect, useRef } from 'react'
import './GitHubContributions.css'

const LOCAL_API = '/contributions.json'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const GitHubContributions = ({ username = 'Devraj-jha' }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

    fetch(LOCAL_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch local contributions data')
        return res.json()
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Contribution fetch error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [visible])

  // Build weeks array from flat contributions, ending at today
  const buildCalendar = () => {
    if (!data?.contributions) return []

    const weeks = []
    let currentWeek = []
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    for (const day of data.contributions) {
      const dayDate = new Date(day.date + 'T23:59:59')
      if (dayDate > today) break // stop at today

      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    // Pad incomplete last week with real future dates (level 0)
    if (currentWeek.length > 0) {
      const lastDate = currentWeek.length > 0
        ? new Date(currentWeek[currentWeek.length - 1].date + 'T00:00:00')
        : new Date()
      while (currentWeek.length < 7) {
        lastDate.setDate(lastDate.getDate() + 1)
        const dateStr = lastDate.toISOString().split('T')[0]
        currentWeek.push({ date: dateStr, count: 0, level: 0 })
      }
      weeks.push(currentWeek)
    }

    return weeks
  }

  // Get month labels — skip the first if data starts mid-month
  const getMonthLabels = () => {
    const weeks = buildCalendar()
    if (!weeks.length) return []

    const labels = []
    let lastMonth = -1

    // Check if the graph starts on the 1st of a month
    const firstRealDay = data?.contributions?.[0]
    const startsMidMonth = firstRealDay && new Date(firstRealDay.date).getDate() !== 1

    weeks.forEach((week, weekIdx) => {
      for (const day of week) {
        if (day.date) {
          const month = new Date(day.date).getMonth()
          if (month !== lastMonth) {
            // Skip the first month label if data starts mid-month
            // (e.g. Jul 27 → don't show "Jul", start from "Aug")
            if (!(labels.length === 0 && startsMidMonth)) {
              labels.push({ index: weekIdx, label: MONTHS[month] })
            }
            lastMonth = month
          }
          break
        }
      }
    })

    return labels
  }

  const weeks = buildCalendar()
  const monthLabels = getMonthLabels()
  const totalContributions = data?.total?.lastYear || 0
  const numWeeks = weeks.length

  return (
    <div className={`gh-section ${visible ? 'visible' : ''}`} ref={ref}>
      <div className="gh-container">
        <div className="gh-header">
          <div className="gh-header-left">
            <svg className="gh-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className="gh-title">{totalContributions} contributions in the last year</span>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-profile-link"
          >
            View profile
            <svg className="gh-external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        <div className="gh-calendar-wrapper">
          {loading ? (
            <div className="gh-loading">
              <div className="gh-loading-grid">
                {Array.from({ length: 53 * 7 }).map((_, i) => (
                  <div key={i} className="gh-loading-cell" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="gh-error">
              <p>Couldn't load contribution graph</p>
              <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
                View on GitHub →
              </a>
            </div>
          ) : (
            <div className="gh-calendar">
              <div className="gh-table">
                <div className="gh-table-row">
                  <div className="gh-labels-col" />
                  <div
                    className="gh-month-labels"
                    style={{ gridTemplateColumns: `repeat(${numWeeks}, 13px)` }}
                  >
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        className="gh-month-label"
                        style={{ gridColumn: m.index + 1 }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="gh-table-row">
                  <div className="gh-day-labels">
                    {DAYS.map((day, i) => (
                      <span key={i} className="gh-day-label">{day}</span>
                    ))}
                  </div>
                  <div className="gh-cells">
                    {weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="gh-week">
                        {week.map((day, dayIdx) => (
                          <div
                            key={dayIdx}
                            className="gh-cell"
                            data-level={day.level ?? 0}
                            title={day.date ? `${day.count} contributions on ${day.date}` : ''}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="gh-footer">
                <span className="gh-legend-label">Less</span>
                <div className="gh-legend">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div key={level} className="gh-legend-cell" data-level={level} />
                  ))}
                </div>
                <span className="gh-legend-label">More</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GitHubContributions