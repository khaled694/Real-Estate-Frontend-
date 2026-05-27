import styles from './ValuationPage.module.css'

const STEPS = [
  { n: 1, label: 'Location' },
  { n: 2, label: 'Details' },
  { n: 3, label: 'Condition' },
  { n: 4, label: 'Photos' },
]

export default function StepIndicator({ currentStep }) {
  return (
    <div className={styles.stepIndicator} role="list" aria-label="Form steps">
      {STEPS.map((step) => {
        const done   = step.n < currentStep
        const active = step.n === currentStep
        return (
          <div
            key={step.n}
            className={`${styles.stepInd} ${done ? styles.stepDone : ''} ${active ? styles.stepActive : ''}`}
            role="listitem"
            aria-current={active ? 'step' : undefined}
          >
            <div className={styles.stepCircle}>
              {done ? '✓' : step.n}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
        )
      })}
    </div>
  )
}
