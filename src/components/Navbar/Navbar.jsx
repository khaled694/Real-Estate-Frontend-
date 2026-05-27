import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './Navbar.module.css'

/*
 * Navbar
 *
 * Props: none
 *
 * Language toggle is visual only in Step 1.
 * It will be wired to i18next in Step 7 (i18n).
 *
 * The "Get started" CTA navigates to /valuate.
 */
export default function Navbar() {
  const navigate = useNavigate()
  const [activeLang, setActiveLang] = useState('EN')

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="PropValue AI — home">
          PropValue <span className={styles.logoAccent}>AI</span>
        </Link>

        {/* Right side */}
        <div className={styles.right}>

          {/* Nav links */}
          <div className={styles.links}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/valuate" className={styles.link}>Value my property</Link>
          </div>

          {/* Language toggle — visual only until Step 7 */}
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

          {/* CTA */}
          <button
            className={styles.ctaButton}
            onClick={() => navigate('/valuate')}
          >
            Get started
          </button>
        </div>

      </div>
    </nav>
  )
}
