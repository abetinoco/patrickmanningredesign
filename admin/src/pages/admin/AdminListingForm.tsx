import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PhotoUploader } from '../../components/admin/PhotoUploader'
import type { Listing, ListingStatus } from '../../types/listing'
import styles from './AdminListingForm.module.css'

function generateSlug(address: string, city: string): string {
  return `${address} ${city}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const STATUSES: { value: ListingStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'coming-soon', label: 'Coming Soon' },
  { value: 'sold', label: 'Sold' },
  { value: 'off-market', label: 'Off Market' },
]

export const AdminListingForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [status, setStatus] = useState<ListingStatus>('active')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('TN')
  const [zip, setZip] = useState('')
  const [price, setPrice] = useState('')
  const [beds, setBeds] = useState('')
  const [baths, setBaths] = useState('')
  const [sqft, setSqft] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [description, setDescription] = useState('')
  const [featuresRaw, setFeaturesRaw] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (!isEdit) return
    supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data: raw }) => {
        const data = raw as Listing | null
        if (!data) {
          navigate('/listings')
          return
        }
        setStatus(data.status as ListingStatus)
        setAddress(data.address)
        setCity(data.city)
        setState(data.state)
        setZip(data.zip)
        setPrice(String(data.price))
        setBeds(String(data.beds))
        setBaths(String(data.baths))
        setSqft(data.sqft ? String(data.sqft) : '')
        setYearBuilt(data.year_built ? String(data.year_built) : '')
        setDescription(data.description ?? '')
        setFeaturesRaw((data.features ?? []).join('\n'))
        setPhotos(data.photos ?? [])
        setSlug(data.slug)
        setLoading(false)
      })
  }, [id, isEdit, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const finalSlug = slug || generateSlug(address, city)
    const features = featuresRaw
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const payload = {
      status,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      slug: finalSlug,
      price: parseFloat(price),
      beds: parseFloat(beds),
      baths: parseFloat(baths),
      sqft: sqft ? parseInt(sqft, 10) : null,
      year_built: yearBuilt ? parseInt(yearBuilt, 10) : null,
      description: description.trim() || null,
      features: features.length ? features : null,
      photos: photos.length ? photos : null,
      primary_photo: photos[0] ?? null,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('listings') as any
    const { error: dbError } = isEdit
      ? await table.update(payload).eq('id', id!)
      : await table.insert(payload)

    setSaving(false)

    if (dbError) {
      setError(dbError.message)
    } else {
      navigate('/listings')
    }
  }

  if (loading) return <div className={styles.loading}>Loading listing…</div>

  return (
    <div>
      <div className={styles.pageHeader}>
        <button type="button" onClick={() => navigate('/listings')} className={styles.backBtn}>
          ← Back to Listings
        </button>
        <h1 className={styles.title}>{isEdit ? 'Edit Listing' : 'New Listing'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Info</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as ListingStatus)}
                required
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Price ($)</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="1195000"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Address</h2>
          <div className={styles.grid1}>
            <div className={styles.field}>
              <label className={styles.label}>Street Address</label>
              <input
                className={styles.input}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="1578 S Berlin Rd"
              />
            </div>
          </div>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label}>City</label>
              <input
                className={styles.input}
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Lewisburg"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>State</label>
              <input
                className={styles.input}
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                required
                placeholder="TN"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>ZIP</label>
              <input
                className={styles.input}
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                placeholder="37091"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              URL Slug
              <span className={styles.labelHint}> (auto-generated if left blank)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={generateSlug(address || '1578-s-berlin-rd', city || 'lewisburg')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Property Details</h2>
          <div className={styles.grid4}>
            <div className={styles.field}>
              <label className={styles.label}>Bedrooms</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.5"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                required
                placeholder="4"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Bathrooms</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.5"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                required
                placeholder="3"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Sq Ft</label>
              <input
                className={styles.input}
                type="number"
                min="0"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                placeholder="3000"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year Built</label>
              <input
                className={styles.input}
                type="number"
                min="1800"
                max="2030"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                placeholder="2022"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Description & Features</h2>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the home, neighborhood, and standout features…"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Features
              <span className={styles.labelHint}> (one per line)</span>
            </label>
            <textarea
              className={styles.textarea}
              rows={6}
              value={featuresRaw}
              onChange={(e) => setFeaturesRaw(e.target.value)}
              placeholder={`Chef's kitchen\nPrimary suite on main floor\n3-car garage\nPool`}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Photos</h2>
          <p className={styles.sectionNote}>The first photo will be used as the primary listing image.</p>
          <PhotoUploader photos={photos} onChange={setPhotos} />
        </section>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <div className={styles.formActions}>
          <button type="button" onClick={() => navigate('/listings')} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
