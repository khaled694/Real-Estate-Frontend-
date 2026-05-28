import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './ResultPage.module.css'

/*
 * ResultPage — Route: /result/:id
 *
 * STATUS: Step 4 — mock data.
 * In Step 5, MOCK_RESULT and MOCK_FORM are replaced with:
 *   const { data } = await getResult(id)  from services/api.js
 *
 * Data sources:
 *   - MOCK_RESULT  → prediction output (price, condition, adjustments, market)
 *   - formData     → read from sessionStorage (set by ValuationPage on submit)
 *
 * Animations:
 *   - Condition bar fills on mount (useEffect + CSS transition)
 *   - Market bars fill on mount with staggered delay
 *   - Price counts up from 0 to final value (useEffect + setInterval)
 */

const MOCK_RESULT = {
  price:           521000,
  priceRange:      { low: 490000, high: 555000 },
  pricePerSqm:     8403,
  conditionScore:  72,
  conditionLabel:  'Good',
  confidence:      74,
  adjustments: [
    { factor: 'Condition — Good',        impact: '+3.0%', positive: true },
    { factor: 'Open-plan kitchen',       impact: '+2.0%', positive: true },
    { factor: 'Underground parking',     impact: '+3.0%', positive: true },
    { factor: 'South-facing',            impact: '+1.5%', positive: true },
    { factor: 'High natural light',      impact: '+1.0%', positive: true },
    { factor: 'Kitchen needs update',    impact: '−2.0%', positive: false },
    { factor: 'Building era — 1998',     impact: '−1.5%', positive: false },
  ],
  marketComparison: {
    yourPricePerSqm:      8403,
    districtAvgPerSqm:    8100,
    cityAvgPerSqm:        7600,
    vsDistrict:           '+3.7%',
    vsCity:               '+10.6%',
    grossYield:           '5.2%',
  },
  visionFeatures: 'Parquet flooring · Open-plan kitchen · High natural light · Modern block facade',
}

const MARKET_MAX = 9000 // used to calculate bar widths as %

function formatPrice(n) {
  return n.toLocaleString('pl-PL')
}

/* Animated number count-up hook */
function useCountUp(target, duration = 1400) {
  const ref = useRef(null)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      if (ref.current) {
        ref.current.textContent = formatPrice(start)
      }
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return ref
}

export default function ResultPage() {
  const navigate  = useNavigate()
  const { id }    = useParams()

  // Read form data saved by ValuationPage
  const savedForm = JSON.parse(sessionStorage.getItem('propvalue_form') || '{}')
  const result    = MOCK_RESULT
  const mc        = result.marketComparison

  // Count-up price
  const priceRef = useCountUp(result.price)

  // Animate bars on mount
  const condBarRef    = useRef(null)
  const bar1Ref       = useRef(null)
  const bar2Ref       = useRef(null)
  const bar3Ref       = useRef(null)
  const confFillRef   = useRef(null)

  useEffect(() => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    const animate = async () => {
      await delay(300)
      if (condBarRef.current)
        condBarRef.current.style.width = `${result.conditionScore}%`
      if (confFillRef.current)
        confFillRef.current.style.width = `${result.confidence}%`
      await delay(100)
      if (bar1Ref.current)
        bar1Ref.current.style.width = `${(mc.yourPricePerSqm / MARKET_MAX) * 100}%`
      await delay(150)
      if (bar2Ref.current)
        bar2Ref.current.style.width = `${(mc.districtAvgPerSqm / MARKET_MAX) * 100}%`
      await delay(150)
      if (bar3Ref.current)
        bar3Ref.current.style.width = `${(mc.cityAvgPerSqm / MARKET_MAX) * 100}%`
    }
    animate()
  }, [])

  return (
    <div className={styles.page}>

      {/* ── HERO — price + confidence ── */}
      <section className={styles.hero}>
        <div className={styles.heroDots} aria-hidden="true" />
        <div className={styles.heroInner}>

          <div className={styles.heroLeft}>
            <p className={styles.heroLabel}>Estimated market value</p>
            <p className={styles.heroPrice}>
              <span ref={priceRef}>0</span>
              <span className={styles.heroCurrency}> PLN</span>
            </p>
            <p className={styles.heroRange}>
              Range: {formatPrice(result.priceRange.low)} – {formatPrice(result.priceRange.high)} PLN
            </p>
            <p className={styles.heroPsqm}>
              {formatPrice(result.pricePerSqm)} PLN/m²
              {savedForm.area ? ` · ${savedForm.area} m²` : ''}
              {savedForm.district ? ` · ${savedForm.district}, ${savedForm.city}` : ''}
            </p>

            {/* Confidence bar */}
            <div className={styles.confWrap}>
              <div className={styles.confLabels}>
                <span>Model confidence</span>
                <span className={styles.confPct}>{result.confidence}%</span>
              </div>
              <div className={styles.confTrack}>
                <div
                  ref={confFillRef}
                  className={styles.confFill}
                  style={{ width: 0, transition: 'width 1.2s ease' }}
                />
              </div>
            </div>
          </div>

          {/* Property summary chip */}
          <div className={styles.heroSummaryCard}>
            <p className={styles.heroSummaryLabel}>Property</p>
            <p className={styles.heroSummaryCity}>
              {savedForm.city || 'Warsaw'}
            </p>
            <p className={styles.heroSummaryDetail}>
              {savedForm.district || 'Śródmieście'}
              {savedForm.area ? ` · ${savedForm.area} m²` : ''}
              {savedForm.floor && savedForm.totalFloors
                ? ` · Floor ${savedForm.floor}/${savedForm.totalFloors}`
                : ''}
            </p>
            <p className={styles.heroSummaryDate}>
              Valued on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

        </div>
      </section>

      {/* ── BODY ── */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>

          {/* ── LEFT COLUMN ── */}
          <div className={styles.main}>

            {/* Condition score */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Condition score</h2>
              <div className={styles.condRow}>
                <span className={styles.condNum}>
                  {result.conditionScore}
                  <span className={styles.condNumSub}> /100</span>
                </span>
                <span className={styles.condLabel}>{result.conditionLabel} condition</span>
              </div>
              <div className={styles.condTrack}>
                <div
                  ref={condBarRef}
                  className={styles.condFill}
                  style={{ width: 0, transition: 'width 1.4s ease' }}
                />
              </div>
              <div className={styles.condTicks}>
                <span>Needs work</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Renovated</span>
                <span>New</span>
              </div>
              <div className={styles.visionNote}>
                AI photo analysis: {result.visionFeatures}
              </div>
            </div>

            {/* Market comparison */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Market comparison (PLN/m²)</h2>

              <div className={styles.mktRows}>
                <div className={styles.mktRow}>
                  <span className={styles.mktLabelYours}>Your property</span>
                  <div className={styles.mktBarWrap}>
                    <div
                      ref={bar1Ref}
                      className={`${styles.mktBar} ${styles.mktBarYours}`}
                      style={{ width: 0, transition: 'width 1.2s ease' }}
                    />
                  </div>
                  <span className={styles.mktValYours}>
                    {formatPrice(mc.yourPricePerSqm)}
                  </span>
                </div>

                <div className={styles.mktRow}>
                  <span className={styles.mktLabel}>
                    {savedForm.district || 'District'} avg
                  </span>
                  <div className={styles.mktBarWrap}>
                    <div
                      ref={bar2Ref}
                      className={`${styles.mktBar} ${styles.mktBarDistrict}`}
                      style={{ width: 0, transition: 'width 1.2s ease 0.15s' }}
                    />
                  </div>
                  <span className={styles.mktVal}>
                    {formatPrice(mc.districtAvgPerSqm)}
                  </span>
                </div>

                <div className={styles.mktRow}>
                  <span className={styles.mktLabel}>
                    {savedForm.city || 'City'} avg
                  </span>
                  <div className={styles.mktBarWrap}>
                    <div
                      ref={bar3Ref}
                      className={`${styles.mktBar} ${styles.mktBarCity}`}
                      style={{ width: 0, transition: 'width 1.2s ease 0.3s' }}
                    />
                  </div>
                  <span className={styles.mktVal}>
                    {formatPrice(mc.cityAvgPerSqm)}
                  </span>
                </div>
              </div>

              {/* Summary chips */}
              <div className={styles.mktChips}>
                <div className={styles.mktChip}>
                  <span className={styles.mktChipLabel}>vs District</span>
                  <span className={styles.mktChipVal} style={{ color: 'var(--color-success)' }}>
                    {mc.vsDistrict}
                  </span>
                </div>
                <div className={styles.mktChip}>
                  <span className={styles.mktChipLabel}>vs City</span>
                  <span className={styles.mktChipVal} style={{ color: 'var(--color-success)' }}>
                    {mc.vsCity}
                  </span>
                </div>
                <div className={styles.mktChip}>
                  <span className={styles.mktChipLabel}>Gross yield</span>
                  <span className={styles.mktChipVal}>{mc.grossYield}</span>
                </div>
              </div>
            </div>

            {/* Adjustment factors */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Price adjustment factors</h2>
              <div className={styles.adjList}>
                {result.adjustments.map((a) => (
                  <div key={a.factor} className={styles.adjRow}>
                    <div
                      className={styles.adjDot}
                      style={{ background: a.positive ? 'var(--color-success)' : 'var(--color-danger)' }}
                    />
                    <span className={styles.adjName}>{a.factor}</span>
                    <span
                      className={styles.adjPct}
                      style={{ color: a.positive ? 'var(--color-success)' : 'var(--color-danger)' }}
                    >
                      {a.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className={styles.sidebar}>

            {/* Property summary */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Property summary</h2>
              <div className={styles.sumList}>
                {[
                  ['City',          savedForm.city          || 'Warsaw'],
                  ['District',      savedForm.district      || 'Śródmieście'],
                  ['Area',          savedForm.area ? `${savedForm.area} m²` : '—'],
                  ['Rooms',         savedForm.rooms         || '—'],
                  ['Floor',         savedForm.floor && savedForm.totalFloors
                                      ? `${savedForm.floor} of ${savedForm.totalFloors}` : '—'],
                  ['Year built',    savedForm.yearBuilt     || '—'],
                  ['Building type', savedForm.buildingType  || '—'],
                  ['Condition',     savedForm.condition     || '—'],
                  ['Balcony',       savedForm.balcony       || '—'],
                  ['Parking',       savedForm.parking       || '—'],
                  ['Elevator',      savedForm.elevator      || '—'],
                  ['Energy class',  savedForm.energyClass   || '—'],
                ].map(([k, v]) => (
                  <div key={k} className={styles.sumRow}>
                    <span className={styles.sumKey}>{k}</span>
                    <span className={styles.sumVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.btnPdf}
                disabled
                title="Coming in Step 9 — PDF export"
              >
                Download PDF report
              </button>
              <button
                className={styles.btnAgain}
                onClick={() => navigate('/valuate')}
              >
                Value another property
              </button>
              <button
                className={styles.btnHome}
                onClick={() => navigate('/')}
              >
                ← Back to home
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
