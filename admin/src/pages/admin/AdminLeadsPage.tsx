import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Lead } from '../../types/lead'
import styles from './AdminLeadsPage.module.css'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setLeads(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>Leads</h1>
        <span className={styles.count}>{leads.length} total</span>
      </div>

      {loading ? (
        <div className={styles.state}>Loading…</div>
      ) : leads.length === 0 ? (
        <div className={styles.state}>No leads yet. Submitted contact forms will appear here.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Interest</th>
                <th>State</th>
                <th>Source</th>
                <th>Page</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className={styles.dateCell}>{formatDate(lead.created_at)}</td>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td>
                    <a href={`mailto:${lead.email}`} className={styles.link}>
                      {lead.email}
                    </a>
                  </td>
                  <td>
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className={styles.link}>
                        {lead.phone}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {lead.interest ? (
                      <span className={`${styles.pill} ${styles[`pill_${lead.interest}`] ?? ''}`}>
                        {lead.interest}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{lead.preferred_state ?? '—'}</td>
                  <td>{lead.source ?? '—'}</td>
                  <td className={styles.pageCell}>{lead.page_path ?? '—'}</td>
                  <td className={styles.notesCell}>{lead.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
