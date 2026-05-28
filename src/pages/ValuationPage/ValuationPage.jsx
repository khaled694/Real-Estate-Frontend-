import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictPrice } from '../../services/api' // Connected API client
import styles from './ValuationPage.module.css'
import StepIndicator from './StepIndicator'
import StepLocation from './steps/StepLocation'
import StepDetails from './steps/StepDetails'
import StepCondition from './steps/StepCondition'
import StepPhotos from './steps/StepPhotos'

const INITIAL_FORM = {
  city: 'Warsaw',
  district: 'Śródmieście',
  address: '',
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
  const [error, setError] = useState(null) // Added for API failure resilience

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Build FormData according to strict API Contract constraints
      const data = new FormData()
      data.append('city', formData.city)
      data.append('district', formData.district)
      data.append('address', formData.address)
      data.append('area', Number(formData.area) || 0)
      data.append('rooms', parseInt(formData.rooms, 10) || 0)
      data.append('floor', Number(formData.floor) || 0)
      data.append('total_floors', Number(formData.totalFloors) || 0)
      data.append('year_built', Number(formData.yearBuilt) || 0)
      data.append('building_type', formData.buildingType)
      
      // Transform readable UI options to lowercased values/booleans expected by the API
      const conditionMapping = {
        'New / developer': 'new',
        'Recently renovated': 'renovated',
        'Good': 'good',
        'Fair': 'fair',
        'Needs renovation': 'needs_renovation'
      }
      data.append('condition', conditionMapping[formData.condition] || 'good')
      data.append('balcony', formData.balcony !== 'None')
      
      const parkingMapping = {
        'Underground': 'underground',
        'Outdoor': 'outdoor',
        'None': 'none'
      }
      data.append('parking', parkingMapping[formData.parking] || 'none')
      data.append('elevator', formData.elevator === 'Yes')
      
      const heatingMapping = {
        'District heating': 'district',
        'Gas': 'gas',
        'Electric': 'electric',
        'Heat pump': 'heat_pump',
        'Coal': 'coal'
      }
      data.append('heating', heatingMapping[formData.heating] || 'district')
      
      const sunMapping = {
        'South': 'south',
        'North': 'north',
        'East': 'east',
        'West': 'west',
        'Mixed': 'mixed'
      }
      data.append('sun_orientation', sunMapping[formData.sunOrientation] || 'south')
      
      const kitchenMapping = {
        'Open-plan': 'open_plan',
        'Separate': 'separate',
        'Kitchenette': 'kitchenette'
      }
      data.append('kitchen_type', kitchenMapping[formData.kitchenType] || 'open_plan')
      data.append('flooring', formData.flooring.toLowerCase())
      
      const noiseMapping = {
        'Quiet street': 'quiet',
        'Moderate': 'moderate',
        'Busy road': 'busy'
      }
      data.append('noise_level', noiseMapping[formData.noiseLevel] || 'quiet')
      data.append('energy_class', formData.energyClass)

      // Append real file references from input dropzone
      photos.forEach((p) => {
        data.append('photos', p.file)
      })

      // Store local data in session storage for fallback summary display panels
      sessionStorage.setItem('propvalue_form', JSON.stringify(formData))

      // Trigger the backend API connection
      const response = await predictPrice(data)
      const resultData = response.data

      setLoading(false)
      // Transition instantly to the uniquely generated report identifier
      navigate(`/result/${resultData.id}`)
    } catch (err) {
      console.error('API submission failed:', err)
      setLoading(false)
      setError(
        err.response?.data?.message || 
        'Failed to process property report. Please check your network connectivity and try again.'
      )
    }
  }

  const stepProps = { formData, updateField, photos, setPhotos }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Property valuation</p>
          <h1 className={styles.title}>Tell us about your property</h1>
          <p className={styles.subtitle}>Fill in 4 quick steps — under 2 minutes.</p>
        </div>
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {/* Informative notification box shown only when an interface error occurs */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <span>⚠️ {error}</span>
              <button className={styles.errorClose} onClick={() => setError(null)}>×</button>
            </div>
          )}

          {currentStep === 1 && <StepLocation {...stepProps} onNext={goNext} />}
          {currentStep === 2 && <StepDetails {...stepProps} onNext={goNext} onBack={goBack} />}
          {currentStep === 3 && <StepCondition {...stepProps} onNext={goNext} onBack={goBack} />}
          {currentStep === 4 && <StepPhotos {...stepProps} onBack={goBack} onSubmit={handleSubmit} />}
        </div>
      </div>

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