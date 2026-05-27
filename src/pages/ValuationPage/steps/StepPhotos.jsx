import { useRef, useState } from 'react'
import styles from '../ValuationPage.module.css'

/*
 * StepPhotos — Step 4
 *
 * Native HTML drag-and-drop + file input.
 * No external library needed.
 *
 * Photos are stored as { file: File, preview: string (object URL) }.
 * Object URLs are revoked on remove to prevent memory leaks.
 *
 * In Step 5, the photos array is sent as part of FormData to the API.
 * The AI row is a mock — it will show real vision model output in Step 5.
 */

const MAX_PHOTOS = 10
const ACCEPTED   = ['image/jpeg', 'image/png', 'image/webp']

export default function StepPhotos({ photos, setPhotos, onBack, onSubmit }) {
  const inputRef  = useRef(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (files) => {
    const valid = Array.from(files)
      .filter((f) => ACCEPTED.includes(f.type))
      .slice(0, MAX_PHOTOS - photos.length)

    const newPhotos = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPhotos((prev) => [...prev, ...newPhotos])
  }

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const canSubmit = photos.length >= 1

  return (
    <div>
      <h2 className={styles.stepHeading}>Upload property photos</h2>
      <p className={styles.stepSubheading}>
        Our vision AI will extract condition features from your photos.
        Upload 1–10 images (JPG, PNG, WebP · max 20 MB each).
      </p>

      {/* Drop zone */}
      <div
        className={`${styles.uploadArea} ${dragging ? styles.uploadAreaDragging : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload photos — click or drag and drop"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <span className={styles.uploadIcon}>📁</span>
        <p className={styles.uploadTitle}>
          {photos.length === 0 ? 'Drag & drop or click to browse' : `${photos.length} photo${photos.length > 1 ? 's' : ''} uploaded — add more`}
        </p>
        <p className={styles.uploadHint}>
          {photos.length < MAX_PHOTOS
            ? `Up to ${MAX_PHOTOS - photos.length} more photo${MAX_PHOTOS - photos.length > 1 ? 's' : ''} accepted`
            : 'Maximum photos reached'}
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className={styles.photoGrid}>
          {photos.map((p, i) => (
            <div key={p.preview} className={styles.photoThumb}>
              <img src={p.preview} alt={`Property photo ${i + 1}`} />
              <button
                className={styles.photoRemove}
                onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                aria-label={`Remove photo ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mock AI analysis row — shown when photos uploaded */}
      {photos.length > 0 && (
        <div className={styles.aiRow}>
          <span className={styles.aiBadge}>✦ AI analysed</span>
          <p className={styles.aiText}>
            {photos.length} photo{photos.length > 1 ? 's' : ''} processed ·
            Condition detected: <strong>Good</strong> ·
            Flooring: Parquet · Kitchen: Open-plan · Light: High
            <br />
            <span style={{ fontSize: '11px', color: 'var(--color-warm-gray)' }}>
              Mock result — real vision model connected in Step 5
            </span>
          </p>
          <div>
            <span className={styles.aiScore}>72</span>
            <span className={styles.aiScoreSub}> /100</span>
          </div>
        </div>
      )}

      <div className={styles.formNav}>
        <button className={styles.btnBack} onClick={onBack}>← Condition</button>
        <button
          className={styles.btnSubmit}
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
        >
          Get my valuation ✦
        </button>
      </div>
    </div>
  )
}
