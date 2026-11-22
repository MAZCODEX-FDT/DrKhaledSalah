import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { useSite } from '../../lib/content'
import { ui } from '../../content/site'

/**
 * Per-page title, description, canonical link and structured data (schema.org JSON-LD),
 * so Google understands the doctor, both branches, procedures, FAQs and articles.
 * Google renders JavaScript, so tags set here are read when it crawls.
 */
const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || location.origin + import.meta.env.BASE_URL.replace(/\/$/, '')

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.content = value
}
function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el) }
  el.href = href
}
function setJsonLd(data: unknown[]) {
  document.head.querySelectorAll('script[data-ks-ld]').forEach(n => n.remove())
  for (const d of data) {
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.dataset.ksLd = '1'
    s.textContent = JSON.stringify(d); document.head.appendChild(s)
  }
}

export default function Seo() {
  const { pathname } = useLocation()
  const { t, lang } = useI18n()
  const { doctor, branches, surgeries, faqs, articles, socials, img } = useSite()

  useEffect(() => {
    const name = t(doctor.name)
    const base = `${name} · ${t(doctor.title)}`
    const url = SITE + (pathname === '/' ? '/' : pathname)
    const doctorId = `${SITE}/#doctor`
    const abs = (src: string | null | undefined) => (src ? new URL(src, location.href).href : undefined)

    const physician = {
      '@context': 'https://schema.org', '@type': 'Physician', '@id': doctorId,
      name, description: t(doctor.promise), url: SITE + '/',
      medicalSpecialty: ['PediatricSurgery', 'Surgical'], image: abs(img(doctor.portrait)) ?? abs(img(doctor.heroImage)),
      sameAs: socials.filter(s => s.platform !== 'whatsapp').map(s => s.url),
      location: branches.map(b => ({ '@id': `${SITE}/#branch-${b.id}` })),
    }
    const clinics = branches.map(b => ({
      '@context': 'https://schema.org', '@type': 'MedicalClinic', '@id': `${SITE}/#branch-${b.id}`,
      name: `${name} · ${t(b.name)}`, medicalSpecialty: 'PediatricSurgery', telephone: b.phone.replace(/\s/g, ''),
      address: { '@type': 'PostalAddress', streetAddress: t(b.address), addressCountry: 'EG' },
      ...(b.lat && b.lng ? { geo: { '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lng } } : {}),
      hasMap: b.map, image: abs(img(b.image)), employee: { '@id': doctorId }, url: SITE + '/branches',
    }))
    const crumbs = (items: [string, string][]) => ({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + p })),
    })
    const faqLd = (list: { q: { ar: string; en: string }; a: { ar: string; en: string } }[]) => list.length ? [{
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: list.map(f => ({ '@type': 'Question', name: t(f.q), acceptedAnswer: { '@type': 'Answer', text: t(f.a) } })),
    }] : []

    let title = base, desc = t(doctor.promise)
    let ld: unknown[] = []
    const home = t(ui.nav.home)
    const proc = pathname.match(/^\/procedures\/([^/]+)/)
    const art = pathname.match(/^\/articles\/([^/]+)/)
    if (pathname === '/') { ld = [physician, ...clinics] }
    else if (proc) {
      const s = surgeries.find(x => x.slug === proc[1])
      if (s) {
        title = `${t(s.name)} | ${name}`; desc = t(s.short)
        ld = [{ '@context': 'https://schema.org', '@type': 'MedicalWebPage', name: t(s.name), description: desc, url, about: { '@type': 'MedicalProcedure', name: t(s.name) }, reviewedBy: { '@id': doctorId }, inLanguage: lang },
          ...faqLd(s.faqs.filter(f => f.enabled)), crumbs([[home, '/'], [t(ui.nav.surgeries), '/procedures'], [t(s.name), pathname]])]
      }
    } else if (art) {
      const a = articles.find(x => x.slug === art[1])
      if (a) {
        title = `${t(a.title)} | ${name}`; desc = t(a.excerpt)
        ld = [{ '@context': 'https://schema.org', '@type': 'Article', headline: t(a.title), description: desc, datePublished: a.date, inLanguage: lang, author: { '@id': doctorId, '@type': 'Physician', name }, image: abs(img(a.image)), mainEntityOfPage: url },
          crumbs([[home, '/'], [t(ui.nav.articles), '/articles'], [t(a.title), pathname]])]
      }
    } else {
      const pages: Record<string, [{ ar: string; en: string }, string?]> = {
        '/about': [ui.nav.about], '/procedures': [ui.nav.surgeries], '/branches': [ui.nav.branches], '/faq': [ui.nav.faq],
        '/videos': [ui.nav.videos], '/contact': [ui.nav.contact], '/book': [ui.nav.book], '/before-your-visit': [ui.nav.guide], '/articles': [ui.nav.articles],
      }
      const p = pages[pathname]
      if (p) { title = `${t(p[0])} | ${name}`; ld = [crumbs([[home, '/'], [t(p[0]), pathname]])] }
      if (pathname === '/faq') ld.push(...faqLd(faqs))
      if (pathname === '/branches' || pathname === '/contact') ld.push(...clinics)
      if (pathname === '/about') ld.push(physician)
    }
    // Article pages set their own title too; keep both in step
    document.title = title
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', art ? 'article' : 'website')
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:locale', lang === 'ar' ? 'ar_EG' : 'en_US')
    setMeta('property', 'og:image', abs(img(doctor.heroImage)) ?? `${SITE}/icon-512.png`)
    setLink('canonical', url)
    setJsonLd(ld)
  }, [pathname, lang, t, doctor, branches, surgeries, faqs, articles, socials, img])

  return null
}
