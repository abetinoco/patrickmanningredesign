import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatCurrency } from '../../utils/format'
import { listingUrlOnMainSite } from '../../utils/publicUrls'
import type { Listing } from '../../types/listing'
import styles from './AdminListingsPage.module.css'

export const AdminListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchListings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
    setListings(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async (id: string, address: string) => {
    if (!confirm(`Delete listing "${address}"? This cannot be undone.`)) return
    setDeleting(id)
    await supabase.from('listings').delete().eq('id', id)
    setDeleting(null)
    fetchListings()
  }

  const statusColors: Record<string, string> = {
    active: '#16a34a',
    'coming-soon': '#d97706',
    sold: '#6b7280',
    'off-market': '#dc2626',
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>Listings</h1>
        <button type="button" onClick={() => navigate('/listings/new')} className={styles.addButton}>
          + Add Listing
        </button>
      </div>

      {loading ? (
        <div className={styles.state}>Loading…</div>
      ) : listings.length === 0 ? (
        <div className={styles.state}>
          No listings yet.{' '}
          <Link to="/listings/new" className={styles.link}>
            Add your first listing →
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Address</th>
                <th>City</th>
                <th>Status</th>
                <th>Price</th>
                <th>Beds</th>
                <th>Baths</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => {
                const publicUrl = listingUrlOnMainSite(l)
                return (
                  <tr key={l.id}>
                    <td className={styles.addressCell}>
                      {publicUrl ? (
                        <a href={publicUrl} target="_blank" rel="noreferrer" className={styles.link}>
                          {l.address}
                        </a>
                      ) : (
                        <span title="Set VITE_PUBLIC_LISTINGS_SITE_ORIGIN in .env.local for a public link">
                          {l.address}
                        </span>
                      )}
                    </td>
                    <td>
                      {l.city}, {l.state}
                    </td>
                    <td>
                      <span
                        className={styles.statusPill}
                        style={{ background: `${statusColors[l.status]}22`, color: statusColors[l.status] }}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td>{formatCurrency(l.price)}</td>
                    <td>{l.beds}</td>
                    <td>{l.baths}</td>
                    <td className={styles.actions}>
                      <button
                        type="button"
                        onClick={() => navigate(`/listings/${l.id}`)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(l.id, l.address)}
                        className={styles.deleteBtn}
                        disabled={deleting === l.id}
                      >
                        {deleting === l.id ? '…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
