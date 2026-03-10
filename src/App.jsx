import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// ============================================================
// SUPABASE CONFIG — Replace these with your actual values
// Find them in Supabase > Settings > API
// ============================================================
const SUPABASE_URL = 'https://uicdvvaadsrexqvbkbgp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpY2R2dmFhZHNyZXhxdmJrYmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQ1NzgsImV4cCI6MjA4ODM3MDU3OH0.kUQyZeJsgzI9bMlCXlVitdtT-yoNLz-oCEKPrUfsw2k'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================================
// BRAND COLOURS
// ============================================================
const NEON = '#CDFF00'
const NOIR = '#000000'
const WHITE = '#FFFFFF'
const GREY = '#888888'
const ERROR_RED = '#FF4444'

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
    border: `1px solid #222`,
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
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    background: '#1a1a1a',
    border: `1px solid #333`,
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
}

// ============================================================
// APP COMPONENT
// ============================================================
export default function App() {
  const [screen, setScreen] = useState('find')     // find | action | success
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [member, setMember] = useState(null)        // matched customer row
  const [openVisit, setOpenVisit] = useState(null)  // existing unclosed visit
  const [actionDone, setActionDone] = useState('')   // 'in' or 'out'

  // Auto-reset to find screen after 15 seconds on the success screen
  useEffect(() => {
    if (screen === 'success') {
      const timer = setTimeout(() => resetToStart(), 15000)
      return () => clearTimeout(timer)
    }
  }, [screen])

  function resetToStart() {
    setScreen('find')
    setSurname('')
    setPhone('')
    setError('')
    setMember(null)
    setOpenVisit(null)
    setActionDone('')
  }

  // ---- STEP 1: Find member ----
  async function handleFind() {
    setError('')
    setLoading(true)

    try {
      // Search customers table for a gym_group member matching surname + phone
      const { data: matches, error: queryError } = await supabase
        .from('customers')
        .select('*')
        .eq('gym_group', true)
        .ilike('last_name', surname.trim())
        .or(`phone.eq.${phone.trim()},mobile.eq.${phone.trim()}`)

      if (queryError) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      if (!matches || matches.length === 0) {
        setError('No matching member found. Please check your surname and phone number.')
        setLoading(false)
        return
      }

      const matched = matches[0]
      setMember(matched)

      // Check for an open visit (checked in but not out)
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
          phone: phone.trim(),
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
      const { error: updateError } = await supabase
        .from('gym_visits')
        .update({ checked_out_at: new Date().toISOString() })
        .eq('id', openVisit.id)

      if (updateError) {
        setError('Could not check out. Please try again.')
        setLoading(false)
        return
      }

      setActionDone('out')
      setScreen('success')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  // ============================================================
  // SCREEN: Find Me
  // ============================================================
  if (screen === 'find') {
    return (
      <div style={styles.app}>
        <div style={styles.logo}>NORTHSHORE</div>
        <div style={styles.subtitle}>GYM CHECK-IN</div>

        <div style={styles.card}>
          <div style={styles.heading}>Welcome</div>
          <div style={styles.accentLine} />

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

          <label style={styles.label}>PHONE NUMBER</label>
          <input
            style={styles.input}
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="off"
          />

          <button
            style={{
              ...styles.buttonPrimary,
              ...(loading || !surname.trim() || !phone.trim() ? styles.disabledButton : {}),
            }}
            onClick={handleFind}
            disabled={loading || !surname.trim() || !phone.trim()}
          >
            {loading ? 'SEARCHING...' : 'FIND ME'}
          </button>

          {error && <div style={styles.error}>{error}</div>}
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
        <div style={styles.logo}>NORTHSHORE</div>
        <div style={styles.subtitle}>GYM CHECK-IN</div>

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
        <div style={styles.logo}>NORTHSHORE</div>
        <div style={styles.subtitle}>GYM CHECK-IN</div>

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
