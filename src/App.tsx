import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom'

const isStandalone = typeof window !== 'undefined' && (window.location.protocol === 'file:' || window.location.pathname.endsWith('.html'))
const Router = isStandalone ? HashRouter : BrowserRouter
import { useEffect } from 'react'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'
import Admin from './pages/Admin'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/immobili/:slug" element={<PropertyDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}
