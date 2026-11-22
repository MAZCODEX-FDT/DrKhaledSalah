import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'

/** Reads the `slug: '…'` values from a seed content file. */
const slugs = (file: string, after = '') => {
  const src = readFileSync(new URL(file, import.meta.url), 'utf8')
  return [...src.slice(after ? src.indexOf(after) : 0).matchAll(/\bslug: '([a-z0-9-]+)'/g)].map(m => m[1])
}

/**
 * Writes sitemap.xml and robots.txt at build time.
 * SITE_URL sets the live domain (e.g. SITE_URL=https://drkhaledsalah.com npm run build).
 * The GitHub Pages demo (hash links) is kept out of Google so it never competes with the real site.
 * TODO (backend): build the procedure and article lists from the database instead of the seed files.
 */
export function seoFiles(): Plugin {
  const demo = process.env.VITE_HASH_ROUTER === '1'
  const site = (process.env.SITE_URL || 'https://drkhaledsalah.com').replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)
  const paths = [
    ['/', '1.0'], ['/about', '0.8'], ['/procedures', '0.9'], ['/branches', '0.8'], ['/book', '0.9'],
    ['/before-your-visit', '0.7'], ['/faq', '0.7'], ['/videos', '0.6'], ['/articles', '0.6'], ['/contact', '0.6'],
    ...[...slugs('./src/content/site.ts'), ...slugs('./src/content/surgeries-extra.ts')].map(s => [`/procedures/${s}`, '0.8']),
    ...slugs('./src/content/guide-articles.ts', 'articleSeed').map(s => [`/articles/${s}`, '0.5']),
  ]
  return {
    name: 'ks-seo-files',
    apply: 'build',
    generateBundle() {
      const robots = demo
        ? 'User-agent: *\nDisallow: /\n'
        : `User-agent: *\nAllow: /\nDisallow: /dashboard\n\nSitemap: ${site}/sitemap.xml\n`
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (demo) return
      const urls = paths.map(([p, pr]) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` })
    },
    transformIndexHtml(html) {
      return demo ? html.replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>') : html
    },
  }
}
