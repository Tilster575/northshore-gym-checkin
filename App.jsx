import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// ============================================================
// SUPABASE CONFIG
// ============================================================
const SUPABASE_URL = 'https://uicdvvaadsrexqvbkbgp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpY2R2dmFhZHNyZXhxdmJrYmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQ1NzgsImV4cCI6MjA4ODM3MDU3OH0.kUQyZeJsgzI9bMlCXlVitdtT-yoNLz-oCEKPrUfsw2k'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================================
// ADMIN PASSWORD (change this to your own password)
// ============================================================
const ADMIN_PASSWORD = 'Northshore2024'

// ============================================================
// BRAND COLOURS
// ============================================================
const NEON = '#CDFF00'
const NOIR = '#000000'
const WHITE = '#FFFFFF'
const GREY = '#888888'
const ERROR_RED = '#FF4444'

// ============================================================
// PHONE NUMBER MATCHING
// ============================================================
function getDigits(input) {
  return (input || '').replace(/\D/g, '')
}

function phonesMatch(a, b) {
  const digitsA = getDigits(a)
  const digitsB = getDigits(b)
  if (digitsA.length === 0 || digitsB.length === 0) return false

  // Use the shorter number's length for comparison
  // This handles cases where stored number is "7841678043"
  // and user types "07841678043" or "+447841678043"
  const minLen = Math.min(digitsA.length, digitsB.length)
  const tailA = digitsA.slice(-minLen)
  const tailB = digitsB.slice(-minLen)
  return tailA === tailB
}

// ============================================================
// CSV HELPER
// ============================================================
function downloadCSV(rows, filename) {
  if (!rows || rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = row[h] == null ? '' : String(row[h])
        // Escape commas and quotes
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`
        }
        return val
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  app: {
    minHeight: '100vh',
    background: NOIR,
    color: WHITE,
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '3px',
    marginBottom: '8px',
    color: WHITE,
  },
  subtitle: {
    fontSize: '14px',
    color: GREY,
    marginBottom: '40px',
    letterSpacing: '1px',
  },
  card: {
    background: '#111111',
    borderRadius: '12px',
    padding: '32px 24px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #222',
  },
  cardWide: {
    background: '#111111',
    borderRadius: '12px',
    padding: '32px 24px',
    width: '100%',
    maxWidth: '900px',
    border: '1px solid #222',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: WHITE,
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: GREY,
    marginBottom: '6px',
    letterSpacing: '0.5px',
  },
  hint: {
    display: 'block',
    fontSize: '11px',
    color: '#555',
    marginTop: '-12px',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: WHITE,
    marginBottom: '16px',
    outline: 'none',
    WebkitAppearance: 'none',
  },
  buttonPrimary: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    background: NEON,
    color: NOIR,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginTop: '8px',
  },
  buttonSecondary: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    background: 'transparent',
    color: NEON,
    border: `2px solid ${NEON}`,
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginTop: '12px',
  },
  buttonCheckOut: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    background: WHITE,
    color: NOIR,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginTop: '8px',
  },
  buttonSmall: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    background: NEON,
    color: NOIR,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  buttonSmallOutline: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    background: 'transparent',
    color: NEON,
    border: `1px solid ${NEON}`,
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  toggleRow: {
    display: 'flex',
    marginBottom: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
  },
  toggleButton: {
    flex: 1,
    padding: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    textAlign: 'center',
  },
  error: {
    color: ERROR_RED,
    fontSize: '14px',
    marginTop: '12px',
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  successText: {
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
  },
  successSub: {
    fontSize: '14px',
    color: GREY,
    textAlign: 'center',
    marginBottom: '32px',
  },
  memberName: {
    fontSize: '18px',
    color: NEON,
    textAlign: 'center',
    marginBottom: '24px',
    fontWeight: 'bold',
  },
  accentLine: {
    width: '60px',
    height: '3px',
    background: NEON,
    margin: '0 auto 24px auto',
    borderRadius: '2px',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  occupancyBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px 20px',
    marginBottom: '24px',
  },
  occupancyDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: NEON,
    animation: 'pulse 2s infinite',
  },
  occupancyNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: NEON,
  },
  occupancyLabel: {
    fontSize: '13px',
    color: GREY,
    letterSpacing: '0.5px',
  },
  // Admin styles
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    marginTop: '16px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: `2px solid ${NEON}`,
    color: NEON,
    fontSize: '12px',
    letterSpacing: '0.5px',
    fontWeight: 'bold',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #222',
    color: WHITE,
    fontSize: '13px',
  },
  tabRow: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
  },
  tab: {
    flex: 1,
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    textAlign: 'center',
  },
  adminLink: {
    fontSize: '11px',
    color: '#333',
    textAlign: 'center',
    marginTop: '24px',
    cursor: 'pointer',
  },
}

// Pulse animation for the occupancy dot
const pulseKeyframes = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
`

// ============================================================
// APP COMPONENT
// ============================================================
export default function App() {
  // Member-facing state
  const [screen, setScreen] = useState('find')
  const [surname, setSurname] = useState('')
  const [contact, setContact] = useState('')
  const [contactMethod, setContactMethod] = useState('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [member, setMember] = useState(null)
  const [openVisit, setOpenVisit] = useState(null)
  const [actionDone, setActionDone] = useState('')
  const [feedback, setFeedback] = useState('')

  // Occupancy counter
  const [occupancy, setOccupancy] = useState(0)

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminTab, setAdminTab] = useState('current') // current | history | flagged
  const [currentVisitors, setCurrentVisitors] = useState([])
  const [visitHistory, setVisitHistory] = useState([])
  const [flaggedVisits, setFlaggedVisits] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)

  // Inject pulse animation
  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.textContent = pulseKeyframes
    document.head.appendChild(styleEl)
    return () => document.head.removeChild(styleEl)
  }, [])

  // Fetch occupancy count (runs on mount + every 30s)
  const fetchOccupancy = useCallback(async () => {
    try {
      const { count } = await supabase
        .from('gym_visits')
        .select('*', { count: 'exact', head: true })
        .is('checked_out_at', null)
      setOccupancy(count || 0)
    } catch (err) {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchOccupancy()
    const interval = setInterval(fetchOccupancy, 30000)
    return () => clearInterval(interval)
  }, [fetchOccupancy])

  // Auto-reset to find screen after 15 seconds on success
  useEffect(() => {
    if (screen === 'success') {
      const timer = setTimeout(() => resetToStart(), 15000)
      return () => clearTimeout(timer)
    }
  }, [screen])

  // Check URL for admin mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setScreen('admin-login')
    }
  }, [])

  function resetToStart() {
    setScreen('find')
    setSurname('')
    setContact('')
    setError('')
    setMember(null)
    setOpenVisit(null)
    setActionDone('')
    setFeedback('')
    fetchOccupancy()
  }

  // ---- ADMIN: Login ----
  function handleAdminLogin() {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setAdminError('')
      setScreen('admin')
      loadAdminData('current')
    } else {
      setAdminError('Incorrect password. Please try again.')
    }
  }

  // ---- ADMIN: Load data ----
  async function loadAdminData(tab) {
    setAdminTab(tab)
    setAdminLoading(true)

    try {
      if (tab === 'current') {
        const { data } = await supabase
          .from('gym_visits')
          .select('*')
          .is('checked_out_at', null)
          .order('checked_in_at', { ascending: false })
        setCurrentVisitors(data || [])
      } else if (tab === 'history') {
        const { data } = await supabase
          .from('gym_visits')
          .select('*')
          .order('checked_in_at', { ascending: false })
          .limit(200)
        setVisitHistory(data || [])
      } else if (tab === 'flagged') {
        const { data } = await supabase
          .from('gym_visits')
          .select('*')
          .eq('auto_checkout', true)
          .order('checked_in_at', { ascending: false })
          .limit(100)
        setFlaggedVisits(data || [])
      }
    } catch (err) {
      // silently fail
    }

    setAdminLoading(false)
  }

  // ---- ADMIN: Export CSV ----
  function handleExportCSV() {
    let data = []
    let filename = 'gym_visits.csv'

    if (adminTab === 'current') {
      data = currentVisitors.map((v) => ({
        Surname: v.surname || '',
        Phone: v.phone || '',
        'Checked In': v.checked_in_at ? new Date(v.checked_in_at).toLocaleString() : '',
        'Checked Out': '',
        'Auto Checkout': v.auto_checkout ? 'Yes' : 'No',
      }))
      filename = 'gym_current_visitors.csv'
    } else if (adminTab === 'history') {
      data = visitHistory.map((v) => ({
        Surname: v.surname || '',
        Phone: v.phone || '',
        'Checked In': v.checked_in_at ? new Date(v.checked_in_at).toLocaleString() : '',
        'Checked Out': v.checked_out_at ? new Date(v.checked_out_at).toLocaleString() : 'Still in',
        'Auto Checkout': v.auto_checkout ? 'Yes' : 'No',
        'Feedback': v.feedback || '',
      }))
      filename = `gym_visit_history_${new Date().toISOString().slice(0, 10)}.csv`
    } else if (adminTab === 'flagged') {
      data = flaggedVisits.map((v) => ({
        Surname: v.surname || '',
        Phone: v.phone || '',
        'Checked In': v.checked_in_at ? new Date(v.checked_in_at).toLocaleString() : '',
        'Auto Checked Out': v.checked_out_at ? new Date(v.checked_out_at).toLocaleString() : '',
      }))
      filename = `gym_auto_checkouts_${new Date().toISOString().slice(0, 10)}.csv`
    }

    downloadCSV(data, filename)
  }

  // ---- STEP 1: Find member ----
  async function handleFind() {
    setError('')
    setLoading(true)

    try {
      const surnameClean = surname.trim()

      const { data: matches, error: queryError } = await supabase
        .from('customers')
        .select('*')
        .eq('gym_group', true)
        .or(`last_name.ilike.${surnameClean},name.ilike.%${surnameClean}%`)

      if (queryError) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      if (!matches || matches.length === 0) {
        setError('No matching member found. Please check your details and try again.')
        setLoading(false)
        return
      }

      let matched = null
      const contactClean = contact.trim()

      if (contactMethod === 'email') {
        matched = matches.find(
          (m) => m.email && m.email.toLowerCase() === contactClean.toLowerCase()
        )
      } else {
        matched = matches.find((m) => {
          return phonesMatch(m.phone, contactClean) || phonesMatch(m.mobile, contactClean)
        })
      }

      if (!matched) {
        if (contactMethod === 'email') {
          setError('Surname and email don\u2019t match. Please check and try again.')
        } else {
          setError('Surname and phone number don\u2019t match. You can enter your number in any format (e.g. 07841678043 or +44 7841678043).')
        }
        setLoading(false)
        return
      }

      setMember(matched)

      const { data: visits } = await supabase
        .from('gym_visits')
        .select('*')
        .eq('contact_id', matched.id)
        .is('checked_out_at', null)
        .order('checked_in_at', { ascending: false })
        .limit(1)

      if (visits && visits.length > 0) {
        setOpenVisit(visits[0])
      } else {
        setOpenVisit(null)
      }

      setScreen('action')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  // ---- STEP 2a: Check in ----
  async function handleCheckIn() {
    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('gym_visits')
        .insert({
          contact_id: member.id,
          surname: member.last_name || member.name,
          phone: member.phone || member.mobile || contact.trim(),
          checked_in_at: new Date().toISOString(),
          auto_checkout: false,
        })

      if (insertError) {
        setError('Could not check in. Please try again.')
        setLoading(false)
        return
      }

      setActionDone('in')
      setScreen('success')
      fetchOccupancy()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  // ---- STEP 2b: Check out ----
  async function handleCheckOut() {
    setLoading(true)
    setError('')

    try {
      const updateData = { checked_out_at: new Date().toISOString() }
      if (feedback.trim()) {
        updateData.feedback = feedback.trim()
      }

      const { error: updateError } = await supabase
        .from('gym_visits')
        .update(updateData)
        .eq('id', openVisit.id)

      if (updateError) {
        setError('Could not check out. Please try again.')
        setLoading(false)
        return
      }

      setActionDone('out')
      setScreen('success')
      fetchOccupancy()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  // ============================================================
  // HEADER (shared across member screens)
  // ============================================================
  function Header() {
    return (
      <>
        <div style={styles.logo}>NORTHSHORE</div>
        <div style={styles.subtitle}>STUDIO CHECK IN AND CHECK OUT</div>
      </>
    )
  }

  // ============================================================
  // OCCUPANCY BADGE
  // ============================================================
  function OccupancyBadge() {
    return (
      <div style={styles.occupancyBadge}>
        <div style={styles.occupancyDot} />
        <span style={styles.occupancyNumber}>{occupancy}</span>
        <span style={styles.occupancyLabel}>
          {occupancy === 1 ? 'person in the studio' : 'people in the studio'}
        </span>
      </div>
    )
  }

  // ============================================================
  // SCREEN: Admin Login
  // ============================================================
  if (screen === 'admin-login') {
    return (
      <div style={styles.app}>
        <Header />
        <div style={styles.card}>
          <div style={styles.heading}>Admin Login</div>
          <div style={styles.accentLine} />

          <label style={styles.label}>PASSWORD</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            autoComplete="off"
          />

          <button
            style={{
              ...styles.buttonPrimary,
              ...(!adminPassword.trim() ? styles.disabledButton : {}),
            }}
            onClick={handleAdminLogin}
            disabled={!adminPassword.trim()}
          >
            LOG IN
          </button>

          {adminError && <div style={styles.error}>{adminError}</div>}

          <button
            style={{ ...styles.buttonSecondary, marginTop: '16px' }}
            onClick={() => {
              setScreen('find')
              setAdminPassword('')
              setAdminError('')
              window.history.replaceState({}, '', window.location.pathname)
            }}
          >
            BACK TO CHECK-IN
          </button>
        </div>
      </div>
    )
  }

  // ============================================================
  // SCREEN: Admin Dashboard
  // ============================================================
  if (screen === 'admin' && isAdmin) {
    const tabData = adminTab === 'current'
      ? currentVisitors
      : adminTab === 'history'
        ? visitHistory
        : flaggedVisits

    return (
      <div style={styles.app}>
        <Header />

        <div style={styles.cardWide}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={styles.heading}>Admin Dashboard</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={styles.buttonSmall} onClick={handleExportCSV}>
                EXPORT CSV
              </button>
              <button style={styles.buttonSmallOutline} onClick={() => loadAdminData(adminTab)}>
                REFRESH
              </button>
            </div>
          </div>
          <div style={styles.accentLine} />

          {/* Occupancy summary */}
          <OccupancyBadge />

          {/* Tabs */}
          <div style={styles.tabRow}>
            {[
              { key: 'current', label: 'CURRENTLY IN' },
              { key: 'history', label: 'VISIT HISTORY' },
              { key: 'flagged', label: 'AUTO-CHECKOUTS' },
            ].map((t) => (
              <button
                key={t.key}
                style={{
                  ...styles.tab,
                  background: adminTab === t.key ? NEON : '#1a1a1a',
                  color: adminTab === t.key ? NOIR : GREY,
                }}
                onClick={() => loadAdminData(t.key)}
              >
                {t.label}
                {t.key === 'current' && ` (${currentVisitors.length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          {adminLoading ? (
            <div style={{ textAlign: 'center', color: GREY, padding: '40px' }}>Loading...</div>
          ) : tabData.length === 0 ? (
            <div style={{ textAlign: 'center', color: GREY, padding: '40px' }}>
              {adminTab === 'current'
                ? 'No one is currently in the studio.'
                : adminTab === 'history'
                  ? 'No visit history found.'
                  : 'No auto-checkouts found.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Surname</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Checked In</th>
                    {adminTab !== 'current' && <th style={styles.th}>Checked Out</th>}
                    {adminTab === 'history' && <th style={styles.th}>Auto?</th>}
                    {adminTab === 'history' && <th style={styles.th}>Feedback</th>}
                  </tr>
                </thead>
                <tbody>
                  {tabData.map((v) => (
                    <tr key={v.id}>
                      <td style={styles.td}>{v.surname || '—'}</td>
                      <td style={styles.td}>{v.phone || '—'}</td>
                      <td style={styles.td}>
                        {v.checked_in_at
                          ? new Date(v.checked_in_at).toLocaleString([], {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </td>
                      {adminTab !== 'current' && (
                        <td style={styles.td}>
                          {v.checked_out_at
                            ? new Date(v.checked_out_at).toLocaleString([], {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Still in'}
                        </td>
                      )}
                      {adminTab === 'history' && (
                        <td style={{ ...styles.td, color: v.auto_checkout ? '#FF9900' : '#555' }}>
                          {v.auto_checkout ? 'Yes' : 'No'}
                        </td>
                      )}
                      {adminTab === 'history' && (
                        <td style={{ ...styles.td, color: v.feedback ? WHITE : '#333', maxWidth: '200px' }}>
                          {v.feedback || '—'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            style={{ ...styles.buttonSecondary, marginTop: '24px' }}
            onClick={() => {
              setIsAdmin(false)
              setAdminPassword('')
              setScreen('find')
              window.history.replaceState({}, '', window.location.pathname)
            }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    )
  }

  // ============================================================
  // SCREEN: Find Me
  // ============================================================
  if (screen === 'find') {
    const isPhone = contactMethod === 'phone'

    return (
      <div style={styles.app}>
        <Header />

        <div style={styles.card}>
          <div style={styles.heading}>Welcome</div>
          <div style={styles.accentLine} />

          {/* Live occupancy counter */}
          <OccupancyBadge />

          <label style={styles.label}>SURNAME</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            autoComplete="off"
            autoCapitalize="words"
          />

          {/* Toggle between phone and email */}
          <div style={styles.toggleRow}>
            <button
              style={{
                ...styles.toggleButton,
                background: isPhone ? NEON : '#1a1a1a',
                color: isPhone ? NOIR : GREY,
              }}
              onClick={() => { setContactMethod('phone'); setContact(''); setError(''); }}
            >
              PHONE
            </button>
            <button
              style={{
                ...styles.toggleButton,
                background: !isPhone ? NEON : '#1a1a1a',
                color: !isPhone ? NOIR : GREY,
              }}
              onClick={() => { setContactMethod('email'); setContact(''); setError(''); }}
            >
              EMAIL
            </button>
          </div>

          {isPhone ? (
            <>
              <label style={styles.label}>PHONE NUMBER</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="e.g. 07841678043 or +44 7841678043"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoComplete="off"
              />
              <div style={styles.hint}>Any format works — we'll match it automatically</div>
            </>
          ) : (
            <>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input
                style={styles.input}
                type="email"
                placeholder="e.g. yourname@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoComplete="off"
                autoCapitalize="none"
              />
            </>
          )}

          <button
            style={{
              ...styles.buttonPrimary,
              ...(loading || !surname.trim() || !contact.trim() ? styles.disabledButton : {}),
            }}
            onClick={handleFind}
            disabled={loading || !surname.trim() || !contact.trim()}
          >
            {loading ? 'SEARCHING...' : 'FIND ME'}
          </button>

          {error && <div style={styles.error}>{error}</div>}

          {/* Hidden admin link */}
          <div
            style={styles.adminLink}
            onClick={() => setScreen('admin-login')}
          >
            Admin
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // SCREEN: Check In / Check Out
  // ============================================================
  if (screen === 'action') {
    const displayName = member.first_name
      ? `${member.first_name} ${member.last_name || ''}`
      : member.name

    return (
      <div style={styles.app}>
        <Header />

        <div style={styles.card}>
          <div style={styles.heading}>
            {openVisit ? 'Ready to leave?' : 'Ready to train?'}
          </div>
          <div style={styles.accentLine} />

          <div style={styles.memberName}>{displayName}</div>

          {openVisit ? (
            <>
              <div style={{ fontSize: '14px', color: GREY, textAlign: 'center', marginBottom: '24px' }}>
                You checked in at{' '}
                {new Date(openVisit.checked_in_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              <label style={styles.label}>HOW WAS YOUR SESSION? (OPTIONAL)</label>
              <textarea
                style={{
                  ...styles.input,
                  minHeight: '80px',
                  resize: 'vertical',
                  lineHeight: '1.4',
                }}
                placeholder="Any feedback? We'd love to hear how it went..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={500}
              />

              <button
                style={{
                  ...styles.buttonCheckOut,
                  ...(loading ? styles.disabledButton : {}),
                }}
                onClick={handleCheckOut}
                disabled={loading}
              >
                {loading ? 'CHECKING OUT...' : 'CHECK OUT'}
              </button>
            </>
          ) : (
            <button
              style={{
                ...styles.buttonPrimary,
                ...(loading ? styles.disabledButton : {}),
              }}
              onClick={handleCheckIn}
              disabled={loading}
            >
              {loading ? 'CHECKING IN...' : 'CHECK IN'}
            </button>
          )}

          <button style={styles.buttonSecondary} onClick={resetToStart}>
            NOT ME — GO BACK
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </div>
      </div>
    )
  }

  // ============================================================
  // SCREEN: Confirmation
  // ============================================================
  if (screen === 'success') {
    return (
      <div style={styles.app}>
        <Header />

        <div style={styles.card}>
          <div style={styles.successIcon}>
            {actionDone === 'in' ? '\u2705' : '\u{1F44B}'}
          </div>
          <div style={styles.successText}>
            {actionDone === 'in' ? "You're checked in!" : 'See you next time!'}
          </div>
          <div style={styles.accentLine} />
          <div style={styles.successSub}>
            {actionDone === 'in'
              ? 'Enjoy your session. Remember to check out when you leave.'
              : 'Thanks for checking out. Have a great day!'}
          </div>

          <button style={styles.buttonSecondary} onClick={resetToStart}>
            DONE
          </button>

          <div style={{ fontSize: '12px', color: '#444', textAlign: 'center', marginTop: '16px' }}>
            This screen will reset automatically in 15 seconds
          </div>
        </div>
      </div>
    )
  }

  return null
}
