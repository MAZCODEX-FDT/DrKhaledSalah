import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { useDB, iso, todayISO, type Appointment } from '../../lib/store'
import { useBranch } from '../DashboardApp'
import { Btn, Card, PageTitle, Dot } from '../ui'
import { kindLabel, procColor, procLabel, procOrder, tr } from '../labels'
import AppointmentForm from './AppointmentForm'

const HOURS = Array.from({ length: 13 }, (_, i) => 10 + i) // 10:00 → 22:00

/** Week starts Saturday, as clinics in Egypt do. */
function weekStart(offset: number) {
  const d = new Date()
  const diff = (d.getDay() + 1) % 7 // Sat=0
  d.setDate(d.getDate() - diff + offset * 7)
  return d
}

export default function Schedule() {
  const { t, lang } = useI18n()
  const { branch } = useBranch()
  const appts = useDB(d => d.appointments)
  const patients = useDB(d => d.patients)
  const [week, setWeek] = useState(0)
  const [slot, setSlot] = useState<Partial<Appointment> | null>(null)
  const today = todayISO()

  const days = useMemo(() => {
    const s = weekStart(week)
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return iso(d) })
  }, [week])
  const pmap = useMemo(() => new Map(patients.map(p => [p.id, p])), [patients])
  const byCell = useMemo(() => {
    const m = new Map<string, Appointment[]>()
    appts.filter(a => (branch === 'all' || a.branch === branch) && a.status !== 'cancelled' && days.includes(a.date)).forEach(a => {
      const k = `${a.date}-${parseInt(a.time)}`
      m.set(k, [...(m.get(k) ?? []), a])
    })
    return m
  }, [appts, branch, days])

  const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', o)
  const Prev = lang === 'ar' ? ChevronRight : ChevronLeft
  const Next = lang === 'ar' ? ChevronLeft : ChevronRight

  return (
    <>
      <PageTitle title={t(tr('الجدول', 'Schedule'))} sub={`${fmt(days[0], { day: 'numeric', month: 'long' })} – ${fmt(days[6], { day: 'numeric', month: 'long' })}`}
        action={
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={() => setWeek(w => w - 1)} aria-label="Previous"><Prev className="size-4" /></Btn>
            <Btn variant="ghost" onClick={() => setWeek(0)}>{t(tr('الأسبوع ده', 'This week'))}</Btn>
            <Btn variant="ghost" onClick={() => setWeek(w => w + 1)} aria-label="Next"><Next className="size-4" /></Btn>
          </div>
        } />

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid min-w-[900px]" style={{ gridTemplateColumns: '4.5rem repeat(7, 1fr)' }}>
            <div className="border-b border-[#efe9dc]" />
            {days.map(d => (
              <div key={d} className={`border-b border-s border-[#efe9dc] px-3 py-3 text-center ${d === today ? 'bg-[#f7f1e3]' : ''}`}>
                <div className="text-xs text-[#5d6865]">{fmt(d, { weekday: 'short' })}</div>
                <div className={`mx-auto mt-1 flex size-8 items-center justify-center rounded-full font-latin text-sm ${d === today ? 'bg-[#14302f] text-ivory' : ''}`}>{fmt(d, { day: 'numeric' })}</div>
              </div>
            ))}
            {HOURS.map(h => (
              <div key={h} className="contents">
                <div className="border-b border-[#f4f0e8] px-2 py-2 text-end font-latin text-[.7rem] text-[#9aa29f]">{`${h}:00`}</div>
                {days.map(d => {
                  const list = byCell.get(`${d}-${h}`) ?? []
                  return (
                    <div key={d + h} onClick={() => !list.length && setSlot({ date: d, time: `${String(h).padStart(2, '0')}:00`, branch: branch === 'all' ? 'tagamoa' : branch })}
                      className={`min-h-[3.6rem] cursor-pointer border-b border-s border-[#f4f0e8] p-1 transition hover:bg-[#faf8f3] ${d === today ? 'bg-[#fcf9f2]' : ''}`}>
                      {list.map(a => {
                        const c = procColor(a.type)
                        return (
                          <div key={a.id} className="mb-1 rounded-lg px-2 py-1.5 text-[.72rem] leading-tight" style={{ background: `${c}14`, borderInlineStart: `3px solid ${c}` }}>
                            <div className="truncate font-medium text-[#14211f]">{pmap.get(a.patientId)?.childName}</div>
                            <div className="truncate text-[#5d6865]">{a.time} · {t(kindLabel[a.kind])}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#5d6865]">
        {procOrder.slice(0, 5).map(p => <span key={p} className="flex items-center gap-2"><Dot color={procColor(p)} />{t(procLabel[p])}</span>)}
        <span className="ms-auto">{t(tr('دوس على أي خانة فاضية عشان تضيف ميعاد', 'Click any empty slot to add an appointment'))}</span>
      </div>
      {slot && <AppointmentForm open initial={slot} onClose={() => setSlot(null)} />}
    </>
  )
}
