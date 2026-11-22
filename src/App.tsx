import { lazy, Suspense } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { SmoothScroll } from './lib/smooth'
import Navbar from './components/site/Navbar'
import Footer from './components/site/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ProceduresPage from './pages/ProceduresPage'
import ProcedureDetail from './pages/ProcedureDetail'
import BranchesPage from './pages/BranchesPage'
import FaqPage from './pages/FaqPage'
import Book from './pages/Book'
import Contact from './pages/Contact'

const Dashboard = lazy(() => import('./dashboard/DashboardApp'))

function SiteLayout() {
  return (
    <SmoothScroll>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </SmoothScroll>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="procedures" element={<ProceduresPage />} />
        <Route path="procedures/:slug" element={<ProcedureDetail />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="book" element={<Book />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Route>
      <Route path="dashboard/*" element={<Suspense fallback={<div className="dash min-h-screen" />}><Dashboard /></Suspense>} />
    </Routes>
  )
}
