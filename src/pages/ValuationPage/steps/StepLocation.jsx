import styles from '../ValuationPage.module.css'

const CITIES = ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Gdańsk', 'Poznań', 'Katowice', 'Lublin']

const DISTRICTS = {
  Warsaw:  ['Śródmieście', 'Mokotów', 'Praga-Południe', 'Wola', 'Żoliborz', 'Ursynów', 'Bielany', 'Bemowo'],
  Kraków:  ['Stare Miasto', 'Kazimierz', 'Podgórze', 'Nowa Huta', 'Krowodrza', 'Bronowice'],
  Łódź:    ['Śródmieście', 'Bałuty', 'Widzew', 'Górna', 'Polesie'],
  Wrocław: ['Stare Miasto', 'Śródmieście', 'Krzyki', 'Fabryczna', 'Psie Pole'],
  Gdańsk:  ['Śródmieście', 'Wrzeszcz', 'Oliwa', 'Przymorze', 'Chełm'],
  Poznań:  ['Stare Miasto', 'Grunwald', 'Jeżyce', 'Nowe Miasto', 'Wilda'],
  Katowice:['Śródmieście', 'Brynów', 'Ligota', 'Piotrowice', 'Załęże'],
  Lublin:  ['Śródmieście', 'Czechów', 'Czuby', 'LSM', 'Bronowice'],
}

export default function StepLocation({ formData, updateField, onNext }) {
  const districts = DISTRICTS[formData.city] || []

  return (
    <div>
      <h2 className={styles.stepHeading}>Where is your property?</h2>
      <p className={styles.stepSubheading}>
        Location is the single biggest factor in market value.
      </p>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="city">City</label>
          <select
            id="city"
            value={formData.city}
            onChange={(e) => {
              updateField('city', e.target.value)
              updateField('district', DISTRICTS[e.target.value]?.[0] || '')
            }}
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="district">District</label>
          <select
            id="district"
            value={formData.district}
            onChange={(e) => updateField('district', e.target.value)}
          >
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className={`${styles.formField} ${styles.full}`}>
          <label htmlFor="address">
            Street address{' '}
            <span style={{ fontSize: '10px', color: 'var(--color-brown-light)', textTransform: 'none', letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="e.g. ul. Marszałkowska 40"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formNav}>
        <span />
        <button className={styles.btnNext} onClick={onNext}>
          Continue → <span style={{ opacity: 0.6, fontSize: '12px' }}>Details</span>
        </button>
      </div>
    </div>
  )
}
