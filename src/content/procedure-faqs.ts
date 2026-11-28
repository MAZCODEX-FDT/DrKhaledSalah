import type { L } from '../lib/i18n'
import { faqs1 } from './procedure-faqs-1'
import { faqs2 } from './procedure-faqs-2'
import { faqs3 } from './procedure-faqs-3'
import { faqs4 } from './procedure-faqs-4'

/** Full parent-facing answers for every procedure (drafts for the doctor's review). */
const rows = { ...faqs1, ...faqs2, ...faqs3, ...faqs4 }
export const procedureFaqs: Record<string, { q: L; a: L }[]> = Object.fromEntries(
  Object.entries(rows).map(([slug, list]) => [slug, list.map(([qa, aa, qe, ae]) => ({ q: { ar: qa, en: qe }, a: { ar: aa, en: ae } }))]),
)
