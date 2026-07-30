import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GITHUB_USER = process.env.GITHUB_USER || 'Devraj-jha'
const GITHUB_URL = `https://github.com/users/${GITHUB_USER}/contributions`
const OUTPUT = path.resolve(__dirname, '..', 'public', 'contributions.json')

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Portfolio-Build' } }, (res) => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

async function main() {
  try {
    console.log(`Fetching contributions for ${GITHUB_USER}...`)
    const html = await fetch(GITHUB_URL)

    // Extract total contributions from h2 text
    const totalMatch = html.match(/([\d,]+)\s+contributions\s+in the last year/)
    const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : 0

    // Extract tooltip text that contains the contribution count for each cell
    // Format: <tool-tip ... for="cell-id" ...>No contributions on ...</tool-tip>
    // Format: <tool-tip ... for="cell-id" ...>3 contributions on ...</tool-tip>
    const countMap = {}
    const tooltipRegex = /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]+)<\/tool-tip>/g
    let ttMatch
    while ((ttMatch = tooltipRegex.exec(html)) !== null) {
      const cellId = ttMatch[1]
      const text = ttMatch[2].trim()
      const numMatch = text.match(/(\d+)/)
      // If text starts with "No" or no number found, count is 0; otherwise use the matched number
      countMap[cellId] = /^no/i.test(text) ? 0 : numMatch ? parseInt(numMatch[1], 10) : 0
    }

    // Extract contribution cells: <td ... data-date="..." data-level="..." id="..." ...>
    // Attributes can appear in any order, so match each one separately
    const cellRegex = /<td[^>]*data-date="([^"]+)"[^>]*id="(contribution-day-component-\d+-\d+)"[^>]*>/g
    // Extract data-level separately since it may not be adjacent
    const levelRegex = /data-level="(\d+)"/
    const contributions = []
    let match
    while ((match = cellRegex.exec(html)) !== null) {
      const date = match[1]
      const id = match[2]

      // Find data-level in the surrounding td tag
      // Get the td tag content (from the start of the match we just found)
      const tdStart = match.index
      const tdEnd = html.indexOf('>', tdStart) + 1
      const tdTag = html.substring(tdStart, tdEnd)

      const levelMatch = tdTag.match(levelRegex)
      const level = levelMatch ? parseInt(levelMatch[1], 10) : 0
      const count = countMap[id] !== undefined ? countMap[id] : level > 0 ? Math.max(1, level * 3) : 0

      contributions.push({ date, count, level })
    }

    if (contributions.length === 0) {
      throw new Error('No contribution data found in the response')
    }

    // Sort by date ascending
    contributions.sort((a, b) => new Date(a.date) - new Date(b.date))

    const output = { total: { lastYear: total }, contributions }

    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
    fs.writeFileSync(OUTPUT, JSON.stringify(output))
    console.log(
      `✓ Saved ${contributions.length} contributions (total: ${total}) to public/contributions.json`
    )
  } catch (err) {
    console.error('Error fetching contributions:', err.message)
    process.exit(1)
  }
}

main()
