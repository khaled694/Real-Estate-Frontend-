import styles from '../ValuationPage.module.css'

const CONDITION_OPTS = [
  'New / developer',
  'Recently renovated',
  'Good',
  'Fair',
  'Needs renovation',
]

const KITCHEN_OPTS  = ['Open-plan', 'Separate', 'Kitchenette']
const FLOORING_OPTS = ['Parquet', 'Laminate', 'Tiles', 'Carpet', 'Concrete']
const NOISE_OPTS    = ['Quiet street', 'Moderate', 'Busy road']
const ENERGY_OPTS   = ['A+', 'A', 'B', 'C', 'D', 'Unknown']
const OWNERSHIP_OPTS= ['Full ownership', 'Co-operative', 'Co-ownership']
const STORAGE_OPTS  = ['Yes — cellar', 'Yes — storage room', 'No']

export default function StepCondition({ formData, updateField, onNext, onBack }) {
  return (
    <div>
      <h2 className={styles.stepHeading}>Property condition</h2>
      <p className={styles.stepSubheading}>
        These details fine-tune the valuation alongside the photo analysis.
      </p>

      {/* Condition toggle */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <span className={styles.toggleGroupLabel}>Overall condition</span>
        <div className={styles.toggleGroup}>
          {CONDITION_OPTS.map((opt) => (
            <button
              key={opt}
              className={`${styles.toggleOpt} ${formData.condition === opt ? styles.toggleOptSelected : ''}`}
              onClick={() => updateField('condition', opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="kitchenType">Kitchen type</label>
          <select
            id="kitchenType"
            value={formData.kitchenType}
            onChange={(e) => updateField('kitchenType', e.target.value)}
          >
            {KITCHEN_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="flooring">Flooring</label>
          <select
            id="flooring"
            value={formData.flooring}
            onChange={(e) => updateField('flooring', e.target.value)}
          >
            {FLOORING_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="noiseLevel">Noise level</label>
          <select
            id="noiseLevel"
            value={formData.noiseLevel}
            onChange={(e) => updateField('noiseLevel', e.target.value)}
          >
            {NOISE_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="energyClass">Energy class</label>
          <select
            id="energyClass"
            value={formData.energyClass}
            onChange={(e) => updateField('energyClass', e.target.value)}
          >
            {ENERGY_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="ownership">Ownership type</label>
          <select
            id="ownership"
            value={formData.ownership}
            onChange={(e) => updateField('ownership', e.target.value)}
          >
            {OWNERSHIP_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="storage">Storage / cellar</label>
          <select
            id="storage"
            value={formData.storage}
            onChange={(e) => updateField('storage', e.target.value)}
          >
            {STORAGE_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.formNav}>
        <button className={styles.btnBack} onClick={onBack}>← Details</button>
        <button className={styles.btnNext} onClick={onNext}>
          Continue → <span style={{ opacity: 0.6, fontSize: '12px' }}>Photos</span>
        </button>
      </div>
    </div>
  )
}
