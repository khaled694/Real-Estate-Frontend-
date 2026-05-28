import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getResult } from '../../services/api' // Connected API client
import styles from './ResultPage.module.css'

const MARKET_MAX = 9000 // Upper bound for calculating dynamic width percentages

function formatPrice(n) {
  return n.toLocaleString('pl-PL')
}

function useCountUp(target, duration = 1400) {
  const ref = useRef(null)
  useEffect(() => {
    if (!target) return
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
  const navigate = useNavigate()
  const { id } = useParams()

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const savedForm = JSON.parse(sessionStorage.getItem('propvalue_form') || '{}')
  const priceRef = useCountUp(result?.price)

  const condBarRef = useRef(null)
  const bar1Ref = useRef(null)
  const bar2Ref = useRef(null)
  const bar3Ref = useRef(null)
  const confFillRef = useRef(null)

  // Fetch Report Data from Server on Mount
  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true)
        setError(null)
        const response = await getResult(id)
        const apiData = response.data

        // Safely map values into structural formats expected by visual gauges
        const lowEst = apiData.price_range?.low || Math.round(apiData.price * 0.94)
        const highEst = apiData.price_range?.high || Math.round(apiData.price * 1.06)

        // Translate multiplier decimals (0.03) into human-friendly percentages (+3.0%)
        const mappedAdjustments = (apiData.adjustments || []).map((adj) => {
          if (typeof adj.impact === 'string') return adj
          const percentValue = Math.abs(adj.impact * 100).toFixed(1)
          return {
            factor: adj.factor,
            positive: adj.direction !== 'negative',
            impact: `${adj.direction === 'negative' ? '−' : '+'}${percentValue}%`
          }
        })

        // Format and calculate relative comparison variances
        const pSqm = apiData.price_per_sqm || Math.round(apiData.price / (savedForm.area || 60))
        const dSqm = apiData.market_comparison?.district_avg_per_sqm || Math.round(pSqm * 0.96)
        const cSqm = apiData.market_comparison?.city_avg_per_sqm || Math.round(pSqm * 0.90)

        const districtVariance = ((pSqm - dSqm) / dSqm) * 100
        const cityVariance = ((pSqm - cSqm) / cSqm) * 100

        // Handle model confidence threshold ranges (convert decimals e.g., 0.74 to 74)
        let modelConfidence = apiData.confidence || 74
        if (modelConfidence <= 1) modelConfidence = Math.round(modelConfidence * 100)

        // Normalize vision object output into a clear inline string display
        let visionString = ''
        if (typeof apiData.vision_features === 'object' && apiData.vision_features !== null) {
          const vf = apiData.vision_features
          visionString = [
            vf.flooring ? `${vf.flooring.charAt(0).toUpperCase() + vf.flooring.slice(1)} flooring` : '',
            vf.kitchen_type ? `${vf.kitchen_type.replace('_', '-')} kitchen` : '',
            vf.light_level ? `${vf.light_level.charAt(0).toUpperCase() + vf.light_level.slice(1)} natural light` : '',
            vf.building_era ? `${vf.building_era.charAt(0).toUpperCase() + vf.building_era.slice(1)} architecture` : ''
          ].filter(Boolean).join(' · ')
        } else {
          visionString = apiData.vision_features || 'Visual features extracted successfully'
        }

        setResult({
          price: apiData.price,
          priceRange: { low: lowEst, high: highEst },
          pricePerSqm: pSqm,
          conditionScore: apiData.condition_score || 70,
          conditionLabel: apiData.condition_label || 'Good',
          confidence: modelConfidence,
          adjustments: mappedAdjustments,
          marketComparison: {
            yourPricePerSqm: pSqm,
            districtAvgPerSqm: dSqm,
            cityAvgPerSqm: cSqm,
            vsDistrict: `${districtVariance >= 0 ? '+' : ''}${districtVariance.toFixed(1)}%`,
            vsCity: `${cityVariance >= 0 ? '+' : ''}${cityVariance.toFixed(1)}%`,
            grossYield: apiData.market_comparison?.gross_yield || '5.2%'
          },
          visionFeatures: visionString
        })
      } catch (err) {
        console.error('Failed to load report:', err)
        setError('Unable to fetch your valuation report. The link may have expired or is invalid.')
      } finally {
        setLoading(false)
      }
    }

    if (id && id !== 'mock-id') {
      fetchReport()
    } else {
      // Automatic mock data resolution fallback option for dev-only local previews
      setResult({
        price: 521000,
        priceRange: { low: 490000, high: 555000 },
        pricePerSqm: 8403,
        conditionScore: 72,
        conditionLabel: 'Good',
        confidence: 74,
        adjustments: [
          { factor: 'Condition — Good', impact: '+3.0%', positive: true },
          { factor: 'Open-plan kitchen', impact: '+2.0%', positive: true },
          { factor: 'Underground parking', impact: '+3.0%', positive: true },
          { factor: 'South-facing', impact: '+1.5%', positive: true },
          { factor: 'High natural light', impact: '+1.0%', positive: true },
          { factor: 'Kitchen needs update', impact: '−2.0%', positive: false },
          { factor: 'Building era — 1998', impact: '−1.5%', positive: false },
        ],
        marketComparison: {
          yourPricePerSqm: 8403,
          districtAvgPerSqm: 8100,
          cityAvgPerSqm: 7600,
          vsDistrict: '+3.7%',
          vsCity: '+10.6%',
          grossYield: '5.2%',
        },
        visionFeatures: 'Parquet flooring · Open-plan kitchen · High natural light · Modern block facade',
      })
      setLoading(false)
    }
  }, [id, savedForm.area])

  // Trigger UI Chart Animations precisely when data successfully binds
  useEffect(() => {
    if (!result) return
    const mc = result.marketComparison
    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    
    const animateBars = async () => {
      await delay(300)
      if (condBarRef.current) condBarRef.current.style.width = `${result.conditionScore}%`
      if (confFillRef.current) confFillRef.current.style.width = `${result.confidence}%`
      await delay(100)
      if (bar1Ref.current) bar1Ref.current.style.width = `${(mc.yourPricePerSqm / MARKET_MAX) * 100}%`
      await delay(150)
      if (bar2Ref.current) bar2Ref.current.style.width = `${(mc.districtAvgPerSqm / MARKET_MAX) * 100}%`
      await delay(150)
      if (bar3Ref.current) bar3Ref.current.style.width = `${(mc.cityAvgPerSqm / MARKET_MAX) * 100}%`
    }
    
    animateBars()
  }, [result])

  if (loading) {
    return (
      <div className={styles.centerOverlay}>
        <div className={styles.spinner} />
        <p className={styles.centerText}>Retrieving calculation parameters…</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className={styles.centerOverlay}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.centerText}>{error || 'Report context missing.'}</p>
        <button className={styles.btnAgain} style={{ maxWidth: '280px', marginTop: 'var(--space-md)' }} onClick={() => navigate('/valuate')}>
          Back to Valuation Tool
        </button>
      </div>
    )
  }

  const mc = result.marketComparison

  return (
    <div className={styles.page}>
      {/* HERO SECTION */}
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

            <div className={styles.confWrap}>
              <div className={styles.confLabels}>
                <span>Model confidence</span>
                <span className={styles.confPct}>{result.confidence}%</span>
              </div>
              <div className={styles.confTrack}>
                <div ref={confFillRef} className={styles.confFill} style={{ width: 0, transition: 'width 1.2s ease' }} />
              </div>
            </div>
          </div>

          <div className={styles.heroSummaryCard}>
            <p className={styles.heroSummaryLabel}>Property</p>
            <p className={styles.heroSummaryCity}>{savedForm.city || 'Warsaw'}</p>
            <p className={styles.heroSummaryDetail}>
              {savedForm.district || 'Śródmieście'}
              {savedForm.area ? ` · ${savedForm.area} m²` : ''}
              {savedForm.floor && savedForm.totalFloors ? ` · Floor ${savedForm.floor}/${savedForm.totalFloors}` : ''}
            </p>
            <p className={styles.heroSummaryDate}>
              Valued on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* DASHBOARD DETAILS */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          <div className={styles.main}>
            {/* Condition Evaluation */}
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
                <div ref={condBarRef} className={styles.condFill} style={{ width: 0, transition: 'width 1.4s ease' }} />
              </div>
              <div className={styles.condTicks}>
                <span>Needs work</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Renovated</span>
                <span>New</span>
              </div>
              <div className={styles.visionNote}>AI photo analysis: {result.visionFeatures}</div>
            </div>

            {/* Market Comparison Bars */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Market comparison (PLN/m²)</h2>
              <div className={styles.mktRows}>
                <div className={styles.mktRow}>
                  <span className={styles.mktLabelYours}>Your property</span>
                  <div className={styles.mktBarWrap}>
                    <div ref={bar1Ref} className={`${styles.mktBar} ${styles.mktBarYours}`} style={{ width: 0, transition: 'width 1.2s ease' }} />
                  </div>
                  <span className={styles.mktValYours}>{formatPrice(mc.yourPricePerSqm)}</span>
                </div>
                <div className={styles.mktRow}>
                  <span className={styles.mktLabel}>{savedForm.district || 'District'} avg</span>
                  <div className={styles.mktBarWrap}>
                    <div ref={bar2Ref} className={`${styles.mktBar} ${styles.mktBarDistrict}`} style={{ width: 0, transition: 'width 1.2s ease' }} />
                  </div>
                  <span className={styles.mktVal}>{formatPrice(mc.districtAvgPerSqm)}</span>
                </div>
                <div className={styles.mktRow}>
                  <span className={styles.mktLabel}>{savedForm.city || 'City'} avg</span>
                  <div className={styles.mktBarWrap}>
                    <div ref={bar3Ref} className={`${styles.mktBar} ${styles.mktBarCity}`} style={{ width: 0, transition: 'width 1.2s ease' }} />
                  </div>
                  <span className={styles.mktVal}>{formatPrice(mc.cityAvgPerSqm)}</span>
                </div>
              </div>

              <div className={styles.mktChips}>
                <div className={styles.mktChip}>
                  <span className={styles.mktChipLabel}>vs District</span>
                  <span className={styles.mktChipVal} style={{ color: mc.vsDistrict.startsWith('−') ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {mc.vsDistrict}
                  </span>
                </div>
                <div className={styles.mktChip}>
                  <span className={styles.mktChipLabel}>vs City</span>
                  <span className={styles.mktChipVal} style={{ color: mc.vsCity.startsWith('−') ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {mc.vsCity}
                  </span>
                </div>
                <div className={styles.mktChip}>
                  <span className={styles.mktChipLabel}>Gross yield</span>
                  <span className={styles.mktChipVal}>{mc.grossYield}</span>
                </div>
              </div>
            </div>

            {/* Breakdown Adjustments */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Price adjustment factors</h2>
              <div className={styles.adjList}>
                {result.adjustments.map((a) => (
                  <div key={a.factor} className={styles.adjRow}>
                    <div className={styles.adjDot} style={{ background: a.positive ? 'var(--color-success)' : 'var(--color-danger)' }} />
                    <span className={styles.adjName}>{a.factor}</span>
                    <span className={styles.adjPct} style={{ color: a.positive ? 'var(--color-success)' : 'var(--color-danger)' }}>{a.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR COMPONENT SUMMARY */}
          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Property summary</h2>
              <div className={styles.sumList}>
                {[
                  ['City', savedForm.city || 'Warsaw'],
                  ['District', savedForm.district || 'Śródmieście'],
                  ['Area', savedForm.area ? `${savedForm.area} m²` : '—'],
                  ['Rooms', savedForm.rooms || '—'],
                  ['Floor', savedForm.floor && savedForm.totalFloors ? `${savedForm.floor} of ${savedForm.totalFloors}` : '—'],
                  ['Year built', savedForm.yearBuilt || '—'],
                  ['Building type', savedForm.buildingType || '—'],
                  ['Condition', savedForm.condition || '—'],
                  ['Balcony', savedForm.balcony || '—'],
                  ['Parking', savedForm.parking || '—'],
                  ['Elevator', savedForm.elevator || '—'],
                  ['Energy class', savedForm.energyClass || '—'],
                ].map(([k, v]) => (
                  <div key={k} className={styles.sumRow}>
                    <span className={styles.sumKey}>{k}</span>
                    <span className={styles.sumVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPdf} disabled title="Coming in Step 9 — PDF export">
                Download PDF report
              </button>
              <button className={styles.btnAgain} onClick={() => navigate('/valuate')}>
                Value another property
              </button>
              <button className={styles.btnHome} onClick={() => navigate('/')}>
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}