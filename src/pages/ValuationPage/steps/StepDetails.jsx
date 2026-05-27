import styles from '../ValuationPage.module.css'

const BUILDING_TYPES = [
  { value: 'modern_block', label: 'Modern block' },
  { value: 'prewar',       label: 'Pre-war tenement' },
  { value: 'panel',        label: 'Soviet-era panel' },
  { value: 'house',        label: 'Detached house' },
  { value: 'villa',        label: 'Villa' },
]

const SUN_OPTIONS   = ['South', 'North', 'East', 'West', 'Mixed']
const BALCONY_OPTS  = ['Loggia', 'Balcony', 'Terrace', 'None']
const PARKING_OPTS  = ['Underground', 'Outdoor', 'None']
const ELEVATOR_OPTS = ['Yes', 'No']
const HEATING_OPTS  = ['District heating', 'Gas', 'Electric', 'Heat pump', 'Coal']

export default function StepDetails({ formData, updateField, onNext, onBack }) {
  return (
    <div>
      <h2 className={styles.stepHeading}>Property details</h2>
      <p className={styles.stepSubheading}>
        These structural features are the core inputs to the CatBoost model.
      </p>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="area">Total area (m²)</label>
          <input
            id="area"
            type="number"
            min="10"
            max="1000"
            placeholder="e.g. 62"
            value={formData.area}
            onChange={(e) => updateField('area', e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="rooms">Number of rooms</label>
          <select
            id="rooms"
            value={formData.rooms}
            onChange={(e) => updateField('rooms', e.target.value)}
          >
            {['1','2','3','4','5','6+'].map((r) => (
              <option key={r} value={r}>{r} {r === '1' ? 'room' : 'rooms'}</option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="floor">Floor number</label>
          <input
            id="floor"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 4"
            value={formData.floor}
            onChange={(e) => updateField('floor', e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="totalFloors">Total floors in building</label>
          <input
            id="totalFloors"
            type="number"
            min="1"
            max="100"
            placeholder="e.g. 9"
            value={formData.totalFloors}
            onChange={(e) => updateField('totalFloors', e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="yearBuilt">Year built</label>
          <input
            id="yearBuilt"
            type="number"
            min="1800"
            max="2026"
            placeholder="e.g. 1998"
            value={formData.yearBuilt}
            onChange={(e) => updateField('yearBuilt', e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="buildingType">Building type</label>
          <select
            id="buildingType"
            value={formData.buildingType}
            onChange={(e) => updateField('buildingType', e.target.value)}
          >
            {BUILDING_TYPES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sun orientation toggle */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <span className={styles.toggleGroupLabel}>Sun orientation</span>
        <div className={styles.toggleGroup}>
          {SUN_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`${styles.toggleOpt} ${formData.sunOrientation === opt ? styles.toggleOptSelected : ''}`}
              onClick={() => updateField('sunOrientation', opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="balcony">Balcony / terrace</label>
          <select
            id="balcony"
            value={formData.balcony}
            onChange={(e) => updateField('balcony', e.target.value)}
          >
            {BALCONY_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="parking">Parking</label>
          <select
            id="parking"
            value={formData.parking}
            onChange={(e) => updateField('parking', e.target.value)}
          >
            {PARKING_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="elevator">Elevator</label>
          <select
            id="elevator"
            value={formData.elevator}
            onChange={(e) => updateField('elevator', e.target.value)}
          >
            {ELEVATOR_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="heating">Heating type</label>
          <select
            id="heating"
            value={formData.heating}
            onChange={(e) => updateField('heating', e.target.value)}
          >
            {HEATING_OPTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.formNav}>
        <button className={styles.btnBack} onClick={onBack}>← Location</button>
        <button className={styles.btnNext} onClick={onNext}>
          Continue → <span style={{ opacity: 0.6, fontSize: '12px' }}>Condition</span>
        </button>
      </div>
    </div>
  )
}
