import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import styles from './LandingPage.module.css'

/*
 * LandingPage — Route: /
 *
 * Sections:
 *   1. Hero        — full viewport, dark bg, headline, sample card, CTA
 *   2. Stats bar   — 3 trust numbers
 *   3. How it works — 3 step cards
 *   4. CTA banner  — dark bg, centered button
 *
 * No API calls. Pure static content.
 * Built in Step 2.
 */

const STATS = [
  { number: '12,400+', label: 'Properties valued' },
  { number: '94%',     label: 'Accuracy rate' },
  { number: '< 2 min', label: 'Average time' },
]

const HOW_STEPS = [
  {
    number: '01',
    icon: '📋',
    title: 'Enter property details',
    desc: 'Location, area, floor, rooms, building type, amenities — all the structured data our CatBoost model needs.',
  },
  {
    number: '02',
    icon: '📸',
    title: 'Upload photos',
    desc: 'Our vision AI analyses each photo — extracting condition score, flooring, kitchen type, light level, and more.',
  },
  {
    number: '03',
    icon: '📊',
    title: 'Get your report',
    desc: 'Instant price prediction with market comparison, confidence score, adjustment breakdown, and full report.',
  },
]

const SAMPLE_FACTORS = [
  { label: 'Condition — Good',      value: '+3%',  positive: true },
  { label: 'Open-plan kitchen',     value: '+2%',  positive: true },
  { label: 'South-facing',          value: '+1.5%',positive: true },
  { label: 'Kitchen needs update',  value: '−2%',  positive: false },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef  = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (el) el.classList.add(styles.heroVisible)
  }, [])

  return (
    <div className={styles.page}>

      {/* 1. HERO */}
      <section className={styles.hero}>
        <div className={styles.heroDots} aria-hidden="true" />
        <div className={styles.heroInner} ref={heroRef}>

          <div className={styles.heroText}>
            <p className={styles.heroEyebrow}>AI-powered property valuation</p>
            <h1 className={styles.heroHeadline}>
              Know what your<br />
              property is{' '}
              <em className={styles.heroAccent}>really</em>
              <br />worth
            </h1>
            <p className={styles.heroSub}>
              Enter your details, upload photos, and get an instant AI
              valuation backed by CatBoost ML and real market data.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={() => navigate('/valuate')}>
                Get your valuation
              </button>
              <a href="#how-it-works" className={styles.btnGhost}>
                See how it works ↓
              </a>
            </div>
          </div>

          <div className={styles.heroCard} aria-label="Sample valuation result">
            <p className={styles.cardEyebrow}>Sample valuation</p>
            <p className={styles.cardPrice}>521,000 PLN</p>
            <p className={styles.cardSub}>8,403 PLN/m² · 74% confidence</p>
            <div className={styles.cardBarWrap}>
              <div className={styles.cardBarLabels}>
                <span>Range</span>
                <span>490K – 555K PLN</span>
              </div>
              <div className={styles.cardBar}>
                <div className={styles.cardBarFill} style={{ width: '72%' }} />
              </div>
            </div>
            <div className={styles.cardFactors}>
              {SAMPLE_FACTORS.map((f) => (
                <div key={f.label} className={styles.cardFactor}>
                  <span className={styles.cardFactorLabel}>{f.label}</span>
                  <span className={f.positive ? styles.pos : styles.neg}>{f.value}</span>
                </div>
              ))}
              <div className={styles.cardDivider} />
              <div className={styles.cardFactor}>
                <span className={styles.cardFactorMuted}>vs district avg</span>
                <span className={styles.cardAbove}>+3.7% above market</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS */}
      <section className={styles.stats} aria-label="Key statistics">
        {STATS.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statNumber}>{s.number}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* 3. HOW IT WORKS */}
      <section className={styles.how} id="how-it-works" aria-labelledby="how-title">
        <div className={styles.howInner}>
          <p className={styles.sectionEyebrow}>Simple process</p>
          <h2 className={styles.sectionTitle} id="how-title">How PropValue AI works</h2>
          <div className={styles.stepsGrid}>
            {HOW_STEPS.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <span className={styles.stepNumber} aria-hidden="true">{step.number}</span>
                <div className={styles.stepIcon} aria-hidden="true">{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className={styles.ctaBanner} aria-labelledby="cta-title">
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle} id="cta-title">Ready to find out?</h2>
          <p className={styles.ctaSub}>
            No registration. No waiting. Just enter your details and get an
            accurate valuation in under 2 minutes.
          </p>
          <button className={styles.btnPrimary} onClick={() => navigate('/valuate')}>
            Value my property now
          </button>
        </div>
      </section>

    </div>
  )
}
