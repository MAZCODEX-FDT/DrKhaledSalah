import { useState, type FormEvent } from 'react'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import PageHero from './PageHero'
import { useI18n } from '../lib/i18n'
import { branches, surgeries, ui, waLink } from '../content/site'
import { actions, type BranchId, type ProcedureId } from '../lib/store'

const field = 'w-full rounded-2xl border border-ink/12 bg-white/70 px-5 py-4 text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15'

export default function Book() {
  const { t, lang } = useI18n()
  const [done, setDone] = useState(false)
  const [branch, setBranch] = useState<BranchId>('tagamoa')
  const [form, setForm] = useState({ name: '', phone: '', procedure: 'consultation' as ProcedureId, message: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // Demo: lands in the dashboard's inquiry pipeline. Wire to the real backend/WhatsApp API before launch.
    actions.addInquiry({ name: form.name, phone: form.phone, branch, procedure: form.procedure, source: 'website', message: form.message })
    setDone(true)
  }
  const b = branches.find(x => x.id === branch)!

  return (
    <>
      <PageHero eyebrow={t(ui.nav.book)} title={lang === 'ar' ? 'خلّينا نتكلم الأول' : 'Let\'s talk first'}>
        {lang === 'ar' ? 'سيب بياناتك ونرد على حضرتك خلال 15 دقيقة في مواعيد العمل. التكلفة والتفاصيل بتتقال في رسالة خاصة.' : 'Leave your details and we\'ll reply within 15 minutes during working hours. Costs and details are shared privately.'}
      </PageHero>
      <section className="bg-ivory py-24 text-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.4fr_1fr]">
          {done ? (
            <div className="rounded-[2rem] bg-white/70 p-12 text-center">
              <CheckCircle2 className="mx-auto size-14 text-pine" />
              <h2 className="mt-6 font-display text-3xl font-light">{lang === 'ar' ? 'وصلتنا رسالتك' : 'We have your message'}</h2>
              <p className="mt-3 text-ink/60">{lang === 'ar' ? 'هنكلم حضرتك قريب. لو حابب أسرع، كلّمنا على واتساب.' : 'We will be in touch shortly. For a faster reply, message us on WhatsApp.'}</p>
              <a href={waLink(b.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="btn-gold mt-8"><MessageCircle className="size-4" />WhatsApp</a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="mb-3 block text-sm text-ink/60">{lang === 'ar' ? 'أنهي فرع أقرب لحضرتك؟' : 'Which branch is closer to you?'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {branches.map(x => (
                    <button type="button" key={x.id} onClick={() => setBranch(x.id as BranchId)}
                      className={`rounded-2xl border px-5 py-4 text-start transition ${branch === x.id ? 'border-pine bg-pine text-ivory' : 'border-ink/12 bg-white/70'}`}>
                      <span className="block font-display">{t(x.name)}</span>
                      <span className={`text-xs ${branch === x.id ? 'text-ivory/60' : 'text-ink/50'}`}>{t(x.serves)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <input required className={field} placeholder={lang === 'ar' ? 'اسم حضرتك' : 'Your name'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input required type="tel" dir="ltr" className={`${field} rtl:text-right`} placeholder="+20 1xx xxx xxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <select className={field} value={form.procedure} onChange={e => setForm({ ...form, procedure: e.target.value as ProcedureId })}>
                <option value="consultation">{lang === 'ar' ? 'استشارة عامة' : 'General consultation'}</option>
                {surgeries.map(s => <option key={s.slug} value={s.slug}>{t(s.name)}</option>)}
              </select>
              <textarea rows={4} className={field} placeholder={lang === 'ar' ? 'سؤالك أو أي تفاصيل حابب تقولها (اختياري)' : 'Your question or any details (optional)'} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              <button className="btn-gold">{lang === 'ar' ? 'ابعت الطلب' : 'Send request'}</button>
              <p className="text-xs text-ink/45">{lang === 'ar' ? 'بياناتك بتستخدم للتواصل معاك بس.' : 'Your details are used only to contact you.'}</p>
            </form>
          )}
          <aside className="h-fit rounded-[2rem] bg-pine p-8 text-ivory">
            <h3 className="font-display text-2xl font-light">{lang === 'ar' ? 'أو كلّمنا مباشرة' : 'Or reach us directly'}</h3>
            <div className="mt-8 space-y-4">
              {branches.map(x => (
                <a key={x.id} href={waLink(x.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border hairline px-5 py-4 transition hover:bg-ivory/5">
                  <span>{t(x.name)}</span><MessageCircle className="size-4 text-gold" />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
