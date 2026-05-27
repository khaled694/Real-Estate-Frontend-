import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ValuationPage.module.css'
import StepIndicator from './StepIndicator'
import StepLocation from './steps/StepLocation'
import StepDetails from './steps/StepDetails'
import StepCondition from './steps/StepCondition'
import StepPhotos from './steps/StepPhotos'

/*
 * ValuationPage — Route: /valuate
 *
 * Manages:
 *   - currentStep (1–4)
 *   - formData (all field values)
 *   - photos (File array)
 *   - loading state (spinner on submit)
 *
 * On submit: saves formData to sessionStorage so ResultPage can read it,
 * then shows a 2s mock delay before navigating to /result/mock-id.
 * In Step 5 this mock is replaced with a real API call.
 */

const INITIAL_FORM = {
  // Step 1 — Location
  city: 'Warsaw',
  district: 'Śródmieście',
  address: '',

  // Step 2 — Details
  area: '',
  rooms: '3',
  floor: '',
  totalFloors: '',
  yearBuilt: '',
  buildingType: 'modern_block',
  sunOrientation: 'South',
  balcony: 'Loggia',
  parking: 'Underground',
  elevator: 'Yes',
  heating: 'District heating',

  // Step 3 — Condition
  condition: 'Good',
  kitchenType: 'Open-plan',
  flooring: 'Parquet',
  noiseLevel: 'Quiet street',
  energyClass: 'B',
  ownership: 'Full ownership',
  storage: 'Yes — cellar',
}

export default function ValuationPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = () => {
    setLoading(true)
    // Save form data so ResultPage can read it
    sessionStorage.setItem('propvalue_form', JSON.stringify(formData))
    // Mock 2s delay — replaced with real API call in Step 5
    setTimeout(() => {
      setLoading(false)
      navigate('/result/mock-id')
    }, 2000)
  }

  const stepProps = { formData, updateField, photos, setPhotos }

  return (
    <div className={styles.page}>

      {/* Dark header with title + step indicator */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Property valuation</p>
          <h1 className={styles.title}>Tell us about your property</h1>
          <p className={styles.subtitle}>Fill in 4 quick steps — under 2 minutes.</p>
        </div>
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Form body */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>

          {currentStep === 1 && (
            <StepLocation {...stepProps} onNext={goNext} />
          )}
          {currentStep === 2 && (
            <StepDetails {...stepProps} onNext={goNext} onBack={goBack} />
          )}
          {currentStep === 3 && (
            <StepCondition {...stepProps} onNext={goNext} onBack={goBack} />
          )}
          {currentStep === 4 && (
            <StepPhotos {...stepProps} onBack={goBack} onSubmit={handleSubmit} />
          )}

        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className={styles.loadingOverlay} role="status" aria-live="polite">
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Analysing your property…</p>
          <p className={styles.loadingSub}>Running CatBoost model + vision AI</p>
        </div>
      )}

    </div>
  )
}
