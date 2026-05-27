import styles from './ResultPage.module.css'

/*
 * ResultPage — Route: /result/:id
 *
 * STATUS: Step 1 placeholder.
 * Full report page built in Step 4.
 *
 * Step 4 sections:
 *   1. Price hero (large number, range, confidence)
 *   2. Condition score bar (animated)
 *   3. Market comparison bars
 *   4. Adjustment factors list
 *   5. Property summary card (reads sessionStorage set by ValuationPage)
 *   6. Action buttons (PDF placeholder + value another)
 *
 * Data source in Step 4: MOCK_RESULT constant (top of this file).
 * Data source in Step 5: replaced with getResult(id) API call.
 */
export default function ResultPage() {
  return (
    <div className={styles.placeholder}>
      <h1>Result & Report</h1>
      <p>Step 1 placeholder — full report page built in Step 4.</p>
    </div>
  )
}
