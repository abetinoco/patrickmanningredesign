import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import styles from './AdminLayout.module.css'

const redesignUrl = import.meta.env.VITE_PUBLIC_SITE_URL

export const AdminLayout = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isAuthenticated = !!session

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>
          {redesignUrl ? (
            <a href={redesignUrl} className={styles.logoLink} target="_blank" rel="noreferrer">
              ← Redesign site
            </a>
          ) : (
            <span className={styles.logoMuted} title="Set VITE_PUBLIC_SITE_URL in .env.local">
              Redesign admin
            </span>
          )}
          <span className={styles.logoSep}>/</span>
          <strong>Supabase</strong>
        </span>
        {isAuthenticated && (
          <nav className={styles.nav}>
            <NavLink
              to="/listings"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Listings
            </NavLink>
            <NavLink
              to="/leads"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Leads
            </NavLink>
            <button type="button" onClick={handleSignOut} className={styles.signOut}>
              Sign Out
            </button>
          </nav>
        )}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
