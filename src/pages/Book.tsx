import { useState, type FormEvent } from 'react'
import { CheckCircle2, ClipboardList, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from './PageHero'
import { useI18n } from '../lib/i18n'
import { ui, waLink } from '../content/site'
import { useSite } from '../lib/content'
import { submitBooking, type BranchId, type ProcedureId } from '../lib/store'
import { setPreferredBranch, usePreferredBranch } from '../lib/branchPref'
import { track } from '../lib/track'

const field = 'w-full rounded-2xl border border-ink/12 bg-white/70 px-5 py-4 text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15'

export default function Book() {
  const { t, lang } = useI18n()
  const { branches, surgeries } = useSite()
  const [done, setDone] = useState(false)
  const [sent, setSent] = useState('')
  const pref = usePreferredBranch()
  const [branch, setBranchState] = useState<BranchId>((pref as BranchId) ?? 'tagamoa')
  const setBranch = (id: BranchId) => { setBranchState(id); setPreferredBranch(id) }
  const [form, setForm] = useState({ name: '', phone: '', procedure: 'consultation' as ProcedureId, message: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // 1) Recorded in the dashboard's inquiry pipeline
    // (not awaited: WhatsApp must open in the same click, or browsers block it; the message carries every detail anyway)
    submitBooking({ name: form.name, phone: form.phone, branch, procedure: form.procedure, message: form.message }).catch(() => { /* WhatsApp still has it */ })
    // 2) Sent to the branch WhatsApp with every detail filled in, so the clinic has it even before anyone opens the dashboard
    const target = branches.find(x => x.id === branch) ?? branches[0]
    const proc = form.procedure === 'consultation' ? (lang === 'ar' ? 'استشارة عامة' : 'General consultation') : t(surgeries.find(s => s.slug === form.procedure)?.name ?? { ar: form.procedure, en: form.procedure })
    const text = lang === 'ar'
      ? `طلب حجز جديد من الموقع\nالاسم: ${form.name}\nالموبايل: ${form.phone}\nالفرع: ${t(target.name)}\nالخدمة: ${proc}${form.message ? `\nرسالة: ${form.message}` : ''}`
      : `New booking request from the website\nName: ${form.name}\nPhone: ${form.phone}\nBranch: ${t(target.name)}\nService: ${proc}${form.message ? `\nMessage: ${form.message}` : ''}`
    const link = waLink(target.whatsapp, text)
    setSent(link)
    window.open(link, '_blank', 'noopener')
    track('book_submit', { branch, procedure: form.procedure })
    setDone(true)
  }
  const b = branches.find(x => x.id === branch) ?? branches[0]

  return (
    <>
      <PageHero eyebrow={t(ui.nav.book)} title={lang === 'ar' ? 'خلّينا نتكلم الأول' : 'Let\'s talk first'}>
        {lang === 'ar' ? 'سيب بياناتك ونرد على حضرتك خلال 15 دقيقة في مواعيد العمل. التكلفة والتفاصيل بتتقال في رسالة خاصة.' : 'Leave your details and we\'ll reply within 15 minutes during working hours. Costs and details are shared privately.'}
      </PageHero>
      <section className="bg-cloud py-24 text-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.4fr_1fr]">
          {done ? (
            <div className="rounded-[2rem] bg-white/70 p-12 text-center">
              <CheckCircle2 className="mx-auto size-14 text-navy" />
              <h2 className="mt-6 font-display text-3xl font-light">{lang === 'ar' ? 'وصلتنا رسالتك' : 'We have your message'}</h2>
              <p className="mt-3 text-ink/60">{lang === 'ar' ? 'اتسجّل طلبك، واتفتح واتساب الفرع والرسالة جاهزة. دوس إرسال عشان توصلنا على طول. لو الواتساب مفتحش، استخدم الزرار ده.' : 'Your request is recorded, and the branch WhatsApp opened with your message ready. Press send so it reaches us straight away. If WhatsApp did not open, use this button.'}</p>
              <a href={sent || waLink(b.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="btn-gold mt-8"><MessageCircle className="size-4" />WhatsApp</a>
              <Link to="/before-your-visit" className="mt-6 flex items-center justify-center gap-2 text-sm text-blue underline-offset-4 hover:underline"><ClipboardList className="size-4" />{lang === 'ar' ? 'جهّز نفسك: دليل قبل الزيارة' : 'Get ready: the before-your-visit guide'}</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="mb-3 block text-sm text-ink/60">{lang === 'ar' ? 'أنهي فرع أقرب لحضرتك؟' : 'Which branch is closer to you?'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {branches.map(x => (
                    <button type="button" key={x.id} onClick={() => setBranch(x.id as BranchId)}
                      className={`rounded-2xl border px-5 py-4 text-start transition ${branch === x.id ? 'border-navy bg-navy text-cloud' : 'border-ink/12 bg-white/70'}`}>
                      <span className="block font-display">{t(x.name)}</span>
                      <span className={`text-xs ${branch === x.id ? 'text-cloud/60' : 'text-ink/50'}`}>{t(x.serves)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <input required className={field} placeholder={lang === 'ar' ? 'اسم حضرتك' : 'Your name'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input required type="tel" dir="ltr" className={`${field} rtl:text-right`} placeholder="+20 1xx xxx xxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <select aria-label={lang === 'ar' ? 'نوع الخدمة' : 'Service'} className={field} value={form.procedure} onChange={e => setForm({ ...form, procedure: e.target.value as ProcedureId })}>
                <option value="consultation">{lang === 'ar' ? 'استشارة عامة' : 'General consultation'}</option>
                {surgeries.map(s => <option key={s.slug} value={s.slug}>{t(s.name)}</option>)}
              </select>
              <textarea rows={4} className={field} placeholder={lang === 'ar' ? 'سؤالك أو أي تفاصيل حابب تقولها (اختياري)' : 'Your question or any details (optional)'} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              <button className="btn-gold">{lang === 'ar' ? 'ابعت الطلب' : 'Send request'}</button>
              <p className="text-xs text-ink/45">{lang === 'ar' ? 'بياناتك بتستخدم للتواصل معاك بس.' : 'Your details are used only to contact you.'}</p>
            </form>
          )}
          <div className="h-fit rounded-[2rem] bg-navy p-8 text-cloud">
            <h2 className="font-display text-2xl font-light">{lang === 'ar' ? 'أو كلّمنا مباشرة' : 'Or reach us directly'}</h2>
            <div className="mt-8 space-y-4">
              {branches.map(x => (
                <a key={x.id} href={waLink(x.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border hairline px-5 py-4 transition hover:bg-cloud/5">
                  <span>{t(x.name)}</span><MessageCircle className="size-4 text-blue" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
