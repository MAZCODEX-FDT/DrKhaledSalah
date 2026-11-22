import { useSyncExternalStore } from 'react'
import { api, BACKEND, getToken } from './api'

/**
 * Dashboard data: patients, appointments, inquiries, review requests.
 * With the Laravel backend (VITE_BACKEND=1) it lives on the server, encrypted, and only signed-in staff can read it.
 * Without it (GitHub Pages demo) it is fictional sample data kept in this browser.
 */

export type BranchId = 'tagamoa' | 'giza'
export type ProcedureId = 'consultation' | 'circumcision' | 'inguinal-hernia' | 'undescended-testis' | 'hypospadias' | 'other'
export type ApptStatus = 'scheduled' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no-show'
export type InquiryStage = 'new' | 'replied' | 'follow-24' | 'follow-72' | 'booked' | 'lost'
export type Source = 'website' | 'whatsapp' | 'facebook' | 'instagram' | 'google' | 'youtube' | 'referral' | 'phone'

export interface Patient {
  id: string
  childName: string
  guardian: string
  phone: string
  birthDate: string
  gender: 'male' | 'female'
  branch: BranchId
  procedure: ProcedureId
  notes: string
  createdAt: string
}
export interface Appointment {
  id: string
  patientId: string
  branch: BranchId
  type: ProcedureId
  kind: 'consultation' | 'surgery' | 'follow-up'
  date: string // YYYY-MM-DD
  time: string // HH:mm
  status: ApptStatus
  notes: string
}
export interface Inquiry {
  id: string
  name: string
  phone: string
  branch: BranchId
  procedure: ProcedureId
  source: Source
  stage: InquiryStage
  message: string
  createdAt: string
  lastContact: string
}
export interface ReviewRequest {
  id: string
  patientId: string
  branch: BranchId
  sentAt: string
  status: 'pending' | 'sent' | 'reviewed'
  rating?: number
}
export interface Settings {
  goalSurgeries: number
  goalReviews: number
  adBudget: number
  replyMinutes: number
}

interface DB { patients: Patient[]; appointments: Appointment[]; inquiries: Inquiry[]; reviews: ReviewRequest[]; settings: Settings }

const KEY = 'ks-dashboard-v1'
const uid = () => Math.random().toString(36).slice(2, 10)
const iso = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d }

function seed(): DB {
  // Fictional demo records only.
  const kids = ['يوسف', 'آدم', 'عمر', 'مالك', 'سليم', 'زياد', 'حمزة', 'علي', 'كريم', 'تميم', 'ياسين', 'مراد', 'فارس', 'نوح', 'ليلى', 'جنى']
  const parents = ['أ. منى', 'م. أحمد', 'د. سارة', 'أ. هبة', 'م. كريم', 'أ. ريم', 'د. محمد', 'أ. نهى', 'م. طارق', 'أ. دينا', 'م. شريف', 'أ. ياسمين', 'د. هشام', 'أ. مي', 'م. عمرو', 'أ. رنا']
  const procs: ProcedureId[] = ['circumcision', 'circumcision', 'inguinal-hernia', 'circumcision', 'undescended-testis', 'consultation', 'inguinal-hernia', 'hypospadias', 'circumcision', 'consultation', 'undescended-testis', 'circumcision', 'inguinal-hernia', 'circumcision', 'consultation', 'consultation']
  const patients: Patient[] = kids.map((c, i) => ({
    id: uid(), childName: c, guardian: parents[i], phone: `+20 10${(10000000 + i * 7919).toString().slice(0, 8)}`,
    birthDate: iso(addDays(-(30 + i * 140))), gender: i >= 14 ? 'female' : 'male',
    branch: i % 3 === 2 ? 'giza' : 'tagamoa', procedure: procs[i], notes: '', createdAt: iso(addDays(-(i * 3))),
  }))
  const times = ['10:00', '11:30', '13:00', '17:00', '18:30', '20:00']
  const appointments: Appointment[] = patients.flatMap((p, i) => {
    const off = i - 6
    const kind: Appointment['kind'] = p.procedure === 'consultation' ? 'consultation' : i % 2 ? 'surgery' : 'consultation'
    const status: ApptStatus = off < 0 ? (i % 7 === 0 ? 'no-show' : 'completed') : off === 0 ? 'arrived' : i % 3 ? 'confirmed' : 'scheduled'
    return [{ id: uid(), patientId: p.id, branch: p.branch, type: p.procedure, kind, date: iso(addDays(off)), time: times[i % times.length], status, notes: '' }]
  })
  const stages: InquiryStage[] = ['new', 'new', 'replied', 'follow-24', 'follow-72', 'booked', 'booked', 'lost', 'replied', 'new', 'follow-24', 'booked']
  const sources: Source[] = ['facebook', 'website', 'whatsapp', 'instagram', 'google', 'youtube', 'facebook', 'referral', 'facebook', 'website', 'youtube', 'google']
  const names = ['أ. نورهان', 'م. حسام', 'أ. إيمان', 'د. رامي', 'أ. شيماء', 'م. وليد', 'أ. سلمى', 'م. باسم', 'أ. هالة', 'م. مصطفى', 'أ. غادة', 'د. عادل']
  const iprocs: ProcedureId[] = ['circumcision', 'inguinal-hernia', 'circumcision', 'undescended-testis', 'hypospadias', 'circumcision', 'inguinal-hernia', 'circumcision', 'consultation', 'undescended-testis', 'circumcision', 'inguinal-hernia']
  const inquiries: Inquiry[] = names.map((n, i) => ({
    id: uid(), name: n, phone: `+20 11${(20000000 + i * 4111).toString().slice(0, 8)}`, branch: i % 4 === 3 ? 'giza' : 'tagamoa',
    procedure: iprocs[i], source: sources[i], stage: stages[i], message: '', createdAt: iso(addDays(-i)), lastContact: iso(addDays(-Math.floor(i / 2))),
  }))
  const reviews: ReviewRequest[] = patients.slice(0, 9).map((p, i) => ({
    id: uid(), patientId: p.id, branch: p.branch, sentAt: iso(addDays(-i * 2)),
    status: i < 4 ? 'reviewed' : i < 7 ? 'sent' : 'pending', rating: i < 4 ? 5 : undefined,
  }))
  return { patients, appointments, inquiries, reviews, settings: { goalSurgeries: 25, goalReviews: 40, adBudget: 30000, replyMinutes: 15 } }
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DB
  } catch { /* fall through */ }
  return seed()
}

const empty = (): DB => ({ patients: [], appointments: [], inquiries: [], reviews: [], settings: { goalSurgeries: 25, goalReviews: 40, adBudget: 0, replyMinutes: 15 } })

let db: DB = BACKEND ? empty() : load()
const subs = new Set<() => void>()
const emit = () => subs.forEach(f => f())

// ---- Server mode ----
let loadedAt = ''
let timer: ReturnType<typeof setTimeout> | undefined
let inflight: Promise<void> | null = null
async function push() {
  if (inflight) await inflight
  const sent = db
  inflight = (async () => {
    try {
      const r = await api<{ data: DB }>('/admin/dashboard', { method: 'PUT', json: { data: sent, loadedAt } })
      loadedAt = new Date().toISOString()
      // The server may add booking requests that arrived meanwhile
      if (db === sent) { db = r.data; emit() }
    } finally { inflight = null }
  })()
  return inflight
}
/** Loads the dashboard data after sign-in. */
export async function loadDashboard() {
  if (!BACKEND || !getToken()) return
  const r = await api<{ data: DB }>('/admin/dashboard')
  loadedAt = new Date().toISOString()
  db = r.data
  emit()
}
export const clearDashboard = () => { db = empty(); emit() }

/** The website's booking form. On the server it lands in Dashboard → Inquiries for every staff member. */
export async function submitBooking(i: Omit<Inquiry, 'id' | 'createdAt' | 'lastContact' | 'stage' | 'source'>) {
  if (BACKEND) await api('/inquiries', { method: 'POST', json: i })
  else actions.addInquiry({ ...i, source: 'website' })
}

function commit(next: DB) {
  db = next
  if (BACKEND) { clearTimeout(timer); timer = setTimeout(() => { push().catch(() => { /* retried on the next change */ }) }, 500) }
  else try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* ignore */ }
  emit()
}
const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f) }

export function useDB<T>(select: (d: DB) => T): T {
  return useSyncExternalStore(subscribe, () => select(db))
}

export const actions = {
  addPatient(p: Omit<Patient, 'id' | 'createdAt'>) {
    const n: Patient = { ...p, id: uid(), createdAt: iso(new Date()) }
    commit({ ...db, patients: [n, ...db.patients] }); return n
  },
  updatePatient(id: string, patch: Partial<Patient>) {
    commit({ ...db, patients: db.patients.map(p => (p.id === id ? { ...p, ...patch } : p)) })
  },
  deletePatient(id: string) {
    commit({ ...db, patients: db.patients.filter(p => p.id !== id), appointments: db.appointments.filter(a => a.patientId !== id) })
  },
  addAppointment(a: Omit<Appointment, 'id'>) {
    commit({ ...db, appointments: [...db.appointments, { ...a, id: uid() }] })
  },
  updateAppointment(id: string, patch: Partial<Appointment>) {
    commit({ ...db, appointments: db.appointments.map(a => (a.id === id ? { ...a, ...patch } : a)) })
  },
  deleteAppointment(id: string) {
    commit({ ...db, appointments: db.appointments.filter(a => a.id !== id) })
  },
  addInquiry(i: Omit<Inquiry, 'id' | 'createdAt' | 'lastContact' | 'stage'>) {
    const today = iso(new Date())
    commit({ ...db, inquiries: [{ ...i, id: uid(), stage: 'new', createdAt: today, lastContact: today }, ...db.inquiries] })
  },
  moveInquiry(id: string, stage: InquiryStage) {
    commit({ ...db, inquiries: db.inquiries.map(q => (q.id === id ? { ...q, stage, lastContact: iso(new Date()) } : q)) })
  },
  deleteInquiry(id: string) {
    commit({ ...db, inquiries: db.inquiries.filter(q => q.id !== id) })
  },
  /** Turns an inquiry into a patient + a consultation appointment. */
  convertInquiry(id: string, date: string, time: string) {
    const q = db.inquiries.find(x => x.id === id); if (!q) return
    const p: Patient = { id: uid(), childName: '—', guardian: q.name, phone: q.phone, birthDate: '', gender: 'male', branch: q.branch, procedure: q.procedure, notes: q.message, createdAt: iso(new Date()) }
    const a: Appointment = { id: uid(), patientId: p.id, branch: q.branch, type: q.procedure, kind: 'consultation', date, time, status: 'scheduled', notes: '' }
    commit({ ...db, patients: [p, ...db.patients], appointments: [...db.appointments, a], inquiries: db.inquiries.map(x => (x.id === id ? { ...x, stage: 'booked' } : x)) })
  },
  addReviewRequest(patientId: string, branch: BranchId) {
    commit({ ...db, reviews: [{ id: uid(), patientId, branch, sentAt: iso(new Date()), status: 'sent' }, ...db.reviews] })
  },
  updateReview(id: string, patch: Partial<ReviewRequest>) {
    commit({ ...db, reviews: db.reviews.map(r => (r.id === id ? { ...r, ...patch } : r)) })
  },
  updateSettings(patch: Partial<Settings>) { commit({ ...db, settings: { ...db.settings, ...patch } }) },
  reset() { commit(BACKEND ? empty() : seed()) },
}

export const todayISO = () => iso(new Date())
export { iso, addDays }
