import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LandingPage from './pages/LandingPage/LandingPage'
import ValuationPage from './pages/ValuationPage/ValuationPage'
import ResultPage from './pages/ResultPage/ResultPage'

/*
 * App.jsx — Route definitions
 *
 * Routes:
 *   /              → LandingPage
 *   /valuate       → ValuationPage  (4-step form wizard)
 *   /result/:id    → ResultPage     (prediction report)
 *
 * Navbar and Footer wrap all routes.
 * If a future route needs no navbar (e.g. a fullscreen embed), move
 * Navbar/Footer inside individual page components instead.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<LandingPage />} />
          <Route path="/valuate"    element={<ValuationPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          {/* Catch-all — redirect unknown routes to landing */}
          <Route path="*"           element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
