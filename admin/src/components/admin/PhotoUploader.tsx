import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './PhotoUploader.module.css'

interface PhotoUploaderProps {
  photos: string[]
  onChange: (urls: string[]) => void
}

export const PhotoUploader = ({ photos, onChange }: PhotoUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('listing-photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('listing-photos').getPublicUrl(path)

      newUrls.push(publicUrl)
    }

    onChange([...photos, ...newUrls])
    setUploading(false)
  }

  const handleRemove = (url: string) => {
    onChange(photos.filter((p) => p !== url))
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload listing photos"
      >
        {uploading ? (
          <span>Uploading…</span>
        ) : (
          <>
            <span className={styles.icon}>⬆</span>
            <span>Click or drag photos to upload</span>
            <span className={styles.hint}>JPEG, PNG, WebP accepted</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className={styles.error}>{error}</p>}

      {photos.length > 0 && (
        <div className={styles.grid}>
          {photos.map((url, i) => (
            <div key={url} className={styles.thumb}>
              <img src={url} alt={`Photo ${i + 1}`} className={styles.thumbImg} />
              {i === 0 && <span className={styles.primaryLabel}>Primary</span>}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(url)}
                aria-label={`Remove photo ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
