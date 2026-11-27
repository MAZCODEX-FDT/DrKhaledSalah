import { Mark } from './Logo'
import { useI18n } from '../../lib/i18n'
import { useSite } from '../../lib/content'

/** Circle portrait with a two-colour ring (brand book v2). Uses the portrait chosen in Dashboard → Website → Doctor. */
export default function DoctorPortrait({ className = '' }: { className?: string }) {
  const { t, lang } = useI18n()
  const { doctor, img } = useSite()
  const src = img(doctor.portrait)
  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#2f6fd1" strokeWidth="2.2" strokeDasharray="190 400" strokeLinecap="round" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="#ffc83d" strokeWidth="2.2" strokeDasharray="88 400" strokeDashoffset="-205" strokeLinecap="round" />
      </svg>
      <div className="calm-night brand-pattern absolute inset-[6%] flex flex-col items-center justify-center gap-4 overflow-hidden rounded-full text-center text-cloud/60">
        {src ? (
          <img src={src} alt={t(doctor.name)} className="absolute inset-0 size-full bg-white object-cover object-top" />
        ) : (
          <>
            <Mark className="relative h-24 w-28" />
            <span className="relative text-sm">{lang === 'ar' ? 'صورة الدكتور من يوم التصوير' : 'Doctor\'s portrait from the shoot'}</span>
          </>
        )}
      </div>
    </div>
  )
}
