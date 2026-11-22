import type { L } from '../lib/i18n'
import type { ApptStatus, InquiryStage, ProcedureId, Source, BranchId } from '../lib/store'

export const tr = (ar: string, en: string): L => ({ ar, en })

/** Validated categorical palette (dataviz validator: all checks pass on white). Fixed order, never cycled. */
export const SERIES = ['#2b6fa8', '#c27c1e', '#13917f', '#7d5bc4', '#c2456a', '#8a8f8c'] // slot 1 is a chroma-safe step of Calm Blue

export const procLabel: Record<ProcedureId, L> = {
  consultation: tr('كشف واستشارة', 'Consultation'),
  circumcision: tr('طهارة', 'Circumcision'),
  'inguinal-hernia': tr('فتق إربي', 'Inguinal hernia'),
  'undescended-testis': tr('خصية معلقة', 'Undescended testis'),
  hypospadias: tr('إحليل سفلي', 'Hypospadias'),
  other: tr('أخرى', 'Other'),
}
export const procOrder: ProcedureId[] = ['circumcision', 'inguinal-hernia', 'undescended-testis', 'hypospadias', 'consultation', 'other']
export const procColor = (p: ProcedureId) => SERIES[procOrder.indexOf(p)]

export const branchLabel: Record<BranchId, L> = { tagamoa: tr('التجمع', 'Settlement'), giza: tr('الجيزة', 'Giza') }

export const statusLabel: Record<ApptStatus, L> = {
  scheduled: tr('محجوز', 'Scheduled'), confirmed: tr('متأكد', 'Confirmed'), arrived: tr('وصل', 'Arrived'),
  completed: tr('تم', 'Completed'), cancelled: tr('اتلغى', 'Cancelled'), 'no-show': tr('محضرش', 'No-show'),
}
export const statusTone: Record<ApptStatus, string> = {
  scheduled: 'bg-stone-100 text-stone-700', confirmed: 'bg-sky-50 text-sky-800', arrived: 'bg-amber-50 text-amber-800',
  completed: 'bg-emerald-50 text-emerald-800', cancelled: 'bg-zinc-100 text-zinc-500 line-through', 'no-show': 'bg-rose-50 text-rose-700',
}
export const kindLabel = { consultation: tr('كشف', 'Consultation'), surgery: tr('عملية', 'Surgery'), 'follow-up': tr('متابعة', 'Follow-up') }

export const stageLabel: Record<InquiryStage, L> = {
  new: tr('استفسار جديد', 'New'), replied: tr('اتردّ عليه', 'Replied'), 'follow-24': tr('متابعة 24 ساعة', '24h follow-up'),
  'follow-72': tr('متابعة 72 ساعة', '72h follow-up'), booked: tr('حجز', 'Booked'), lost: tr('محجزش', 'Lost'),
}
export const stageOrder: InquiryStage[] = ['new', 'replied', 'follow-24', 'follow-72', 'booked', 'lost']

export const sourceLabel: Record<Source, L> = {
  website: tr('الموقع', 'Website'), whatsapp: tr('واتساب', 'WhatsApp'), facebook: tr('فيسبوك', 'Facebook'), instagram: tr('إنستجرام', 'Instagram'),
  google: tr('جوجل', 'Google'), youtube: tr('يوتيوب', 'YouTube'), referral: tr('تحويل دكتور', 'Doctor referral'), phone: tr('تليفون', 'Phone'),
}

export const nav = {
  overview: tr('نظرة عامة', 'Overview'), appointments: tr('المواعيد', 'Appointments'), calendar: tr('الجدول', 'Schedule'),
  patients: tr('المرضى', 'Patients'), inquiries: tr('الاستفسارات', 'Inquiries'), reviews: tr('التقييمات', 'Reviews'), settings: tr('الإعدادات', 'Settings'),
}
