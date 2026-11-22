import { createContext, useContext, useState, type FormEvent } from 'react'
import { NavLink, Navigate, Route, Routes, Link } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, CalendarClock, Users, Inbox, Star, Settings as Cog, LogOut, Globe, Menu, X, ExternalLink, Stethoscope, MessagesSquare, MapPin, UserRound, Images, Phone, SquarePlay, ClipboardList, Newspaper } from 'lucide-react'
import { FullLogo, Mark } from '../components/site/Logo'
import { useI18n } from '../lib/i18n'
import type { BranchId } from '../lib/store'
import { nav, tr } from './labels'
import Overview from './pages/Overview'
import Appointments from './pages/Appointments'
import Schedule from './pages/Schedule'
import Patients from './pages/Patients'
import Inquiries from './pages/Inquiries'
import Reviews from './pages/Reviews'
import Settings from './pages/Settings'
import ContentProcedures from './cms/ContentProcedures'
import ContentFaqs from './cms/ContentFaqs'
import ContentBranches from './cms/ContentBranches'
import ContentDoctor from './cms/ContentDoctor'
import ContentMedia from './cms/ContentMedia'
import ContentContact from './cms/ContentContact'
import ContentVideos from './cms/ContentVideos'
import { ContentArticles, ContentGuide } from './cms/ContentGuide'

type BranchFilter = 'all' | BranchId
const BranchCtx = createContext<{ branch: BranchFilter; setBranch: (b: BranchFilter) => void }>({ branch: 'all', setBranch: () => {} })
export const useBranch = () => useContext(BranchCtx)

const items = [
  { to: '/dashboard', icon: LayoutDashboard, k: 'overview' },
  { to: '/dashboard/appointments', icon: CalendarClock, k: 'appointments' },
  { to: '/dashboard/schedule', icon: CalendarDays, k: 'calendar' },
  { to: '/dashboard/patients', icon: Users, k: 'patients' },
  { to: '/dashboard/inquiries', icon: Inbox, k: 'inquiries' },
  { to: '/dashboard/reviews', icon: Star, k: 'reviews' },
  { to: '/dashboard/settings', icon: Cog, k: 'settings' },
] as const

const webItems = [
  { to: '/dashboard/website/procedures', icon: Stethoscope, k: 'wProcedures' },
  { to: '/dashboard/website/faqs', icon: MessagesSquare, k: 'wFaqs' },
  { to: '/dashboard/website/branches', icon: MapPin, k: 'wBranches' },
  { to: '/dashboard/website/doctor', icon: UserRound, k: 'wDoctor' },
  { to: '/dashboard/website/contact', icon: Phone, k: 'wContact' },
  { to: '/dashboard/website/videos', icon: SquarePlay, k: 'wVideos' },
  { to: '/dashboard/website/guide', icon: ClipboardList, k: 'wGuide' },
  { to: '/dashboard/website/articles', icon: Newspaper, k: 'wArticles' },
  { to: '/dashboard/website/media', icon: Images, k: 'wMedia' },
] as const

const AUTH_KEY = 'ks-dash-auth'

function Login({ onIn }: { onIn: () => void }) {
  const { t, toggle, lang } = useI18n()
  const [email, setEmail] = useState('admin@drkhaledsalah.com')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    // DEMO ONLY: client-side check. Replace with real authentication (e.g. Supabase Auth) before launch.
    if (pass === 'demo2026') { try { sessionStorage.setItem(AUTH_KEY, '1') } catch { /* ignore */ } onIn() } else setErr(true)
  }
  return (
    <div className="grid min-h-screen bg-night lg:grid-cols-2">
      <div className="calm-night brand-pattern relative hidden overflow-hidden p-14 text-cloud lg:flex lg:flex-col lg:justify-between">
        <FullLogo className="relative h-24" />
        <div className="relative">
          <p className="eyebrow mb-4 text-mist">{lang === 'ar' ? 'لوحة تحكم العيادة' : 'Clinic dashboard'}</p>
          <h1 className="max-w-md font-display text-5xl font-light leading-tight">{lang === 'ar' ? 'كل استفسار متسجّل، لحد الحجز والتقييم' : 'Every inquiry tracked, all the way to booking and review'}</h1>
        </div>
      </div>
      <div className="dash flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="flex items-center justify-between">
            <Mark tone="navy" className="h-10 w-12 lg:hidden" />
            <button type="button" onClick={toggle} className="ms-auto flex items-center gap-1.5 text-sm text-[#5e6a7a]"><Globe className="size-4" />{lang === 'ar' ? 'English' : 'عربي'}</button>
          </div>
          <h2 className="font-display text-3xl font-light">{t(tr('تسجيل الدخول', 'Sign in'))}</h2>
          <input type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" dir="ltr" placeholder="••••••••" value={pass} onChange={e => { setPass(e.target.value); setErr(false) }} />
          {err && <p className="text-sm text-rose-700">{t(tr('كلمة السر غلط', 'Wrong password'))}</p>}
          <button className="w-full rounded-xl bg-[#163e7a] py-3 font-medium text-cloud hover:bg-[#2f6fd1]">{t(tr('دخول', 'Sign in'))}</button>
          <p className="rounded-xl bg-[#e9eef2] p-3 text-xs leading-relaxed text-[#5e6a7a]">
            {t(tr('نسخة عرض: كلمة السر demo2026. الدخول الحقيقي هيتربط بنظام مصادقة قبل الإطلاق.', 'Demo build: password is demo2026. Real authentication will be wired in before launch.'))}
          </p>
          <Link to="/" className="block text-center text-sm text-[#5e6a7a] hover:text-[#1a2433]">{t(tr('رجوع للموقع', 'Back to website'))}</Link>
        </form>
      </div>
    </div>
  )
}

export default function DashboardApp() {
  const { t, toggle, lang } = useI18n()
  const [authed, setAuthed] = useState(() => { try { return sessionStorage.getItem(AUTH_KEY) === '1' } catch { return false } })
  const [branch, setBranch] = useState<BranchFilter>('all')
  const [open, setOpen] = useState(false)

  if (!authed) return <Login onIn={() => setAuthed(true)} />

  const logout = () => { try { sessionStorage.removeItem(AUTH_KEY) } catch { /* ignore */ } setAuthed(false) }

  const Side = (
    <aside className="flex h-full flex-col bg-[#163e7a] p-5 text-cloud">
      <div className="mb-8 flex items-center gap-3 px-2">
        <Mark className="h-10 w-12" />
        <div className="leading-tight">
          <div className="font-display">{lang === 'ar' ? 'د. خالد صلاح' : 'Dr. Khaled Salah'}</div>
          <div className="text-[.7rem] text-mist">{t(tr('لوحة التحكم', 'Dashboard'))}</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {items.map(i => (
          <NavLink key={i.k} to={i.to} end={i.to === '/dashboard'} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${isActive ? 'bg-blue text-white' : 'text-cloud/70 hover:bg-white/5 hover:text-cloud'}`}>
            <i.icon className="size-[1.1rem]" />{t(nav[i.k])}
          </NavLink>
        ))}
        <p className="px-3.5 pb-1 pt-5 text-[.7rem] font-semibold uppercase tracking-wider text-sky">{t(tr('محتوى الموقع', 'Website content'))}</p>
        {webItems.map(i => (
          <NavLink key={i.k} to={i.to} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${isActive ? 'bg-blue text-white' : 'text-cloud/70 hover:bg-white/5 hover:text-cloud'}`}>
            <i.icon className="size-[1.1rem]" />{t(nav[i.k])}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cloud/60 hover:text-cloud"><ExternalLink className="size-4" />{t(tr('الموقع', 'Website'))}</Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cloud/60 hover:text-cloud"><LogOut className="size-4" />{t(tr('خروج', 'Sign out'))}</button>
      </div>
    </aside>
  )

  return (
    <BranchCtx.Provider value={{ branch, setBranch }}>
      <div className="dash min-h-screen lg:grid lg:grid-cols-[15.5rem_1fr]">
        <div className="sticky top-0 hidden h-screen lg:block">{Side}</div>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-y-0 start-0 w-64" onClick={e => e.stopPropagation()}>{Side}</div>
          </div>
        )}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e1e7ec] bg-[#f5f8fc]/85 px-4 py-3 backdrop-blur sm:px-8">
            <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">{open ? <X /> : <Menu className="size-5" />}</button>
            <div className="flex rounded-xl border border-[#dbe2e8] bg-white p-1 text-sm">
              {(['all', 'tagamoa', 'giza'] as const).map(b => (
                <button key={b} onClick={() => setBranch(b)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition ${branch === b ? 'bg-[#163e7a] text-cloud' : 'text-[#5e6a7a] hover:text-[#1a2433]'}`}>
                  {t(b === 'all' ? tr('كل الفروع', 'All branches') : b === 'tagamoa' ? tr('التجمع', 'Settlement') : tr('الجيزة', 'Giza'))}
                </button>
              ))}
            </div>
            <div className="ms-auto flex items-center gap-2">
              <button onClick={toggle} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[#5e6a7a] hover:bg-white"><Globe className="size-4" />{lang === 'ar' ? 'EN' : 'ع'}</button>
              <div className="flex size-9 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white">{lang === 'ar' ? 'خ' : 'KS'}</div>
            </div>
          </header>
          <main className="mx-auto max-w-[90rem] p-4 sm:p-8">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="patients" element={<Patients />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
              <Route path="website/procedures" element={<ContentProcedures />} />
              <Route path="website/faqs" element={<ContentFaqs />} />
              <Route path="website/branches" element={<ContentBranches />} />
              <Route path="website/doctor" element={<ContentDoctor />} />
              <Route path="website/videos" element={<ContentVideos />} />
              <Route path="website/guide" element={<ContentGuide />} />
              <Route path="website/articles" element={<ContentArticles />} />
              <Route path="website/media" element={<ContentMedia />} />
              <Route path="website/contact" element={<ContentContact />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BranchCtx.Provider>
  )
}
