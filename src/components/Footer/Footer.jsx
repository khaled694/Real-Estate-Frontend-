import { useState } from 'react'
import styles from './Footer.module.css'

/*
 * Footer
 *
 * Props: none
 *
 * Language toggle mirrors the one in Navbar — both are visual only until Step 7.
 * In Step 7 (i18n), extract shared language state to a context or i18next.
 */
export default function Footer() {
  const [activeLang, setActiveLang] = useState('EN')
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.brand}>
          PropValue <span className={styles.brandAccent}>AI</span>
        </div>

        <div className={styles.copy}>
          © {year} PropValue AI · Prototype v0.1
        </div>

        <div className={styles.langToggle} role="group" aria-label="Language selector">
          {['EN', 'PL'].map((lang) => (
            <button
              key={lang}
              className={`${styles.langBtn} ${activeLang === lang ? styles.langBtnActive : ''}`}
              onClick={() => setActiveLang(lang)}
              aria-pressed={activeLang === lang}
            >
              {lang}
            </button>
          ))}
        </div>

      </div>
    </footer>
  )
}
