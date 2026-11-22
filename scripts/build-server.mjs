// Builds the React site for the Laravel backend on Bluehost:
//   assets, icons, brand files → backend/public/
//   index.html               → backend/resources/spa/index.html (served by Laravel for every page)
// robots.txt and sitemap.xml are skipped: Laravel builds them live from the current content.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const out = 'dist-server'
const pub = 'backend/public'
execSync(`npx vite build --outDir ${out} --emptyOutDir`, { stdio: 'inherit', env: { ...process.env, VITE_BACKEND: '1' } })

mkdirSync('backend/resources/spa', { recursive: true })
renameSync(join(out, 'index.html'), 'backend/resources/spa/index.html')
// Old hashed bundles are replaced, uploads and Laravel's own files are left alone
if (existsSync(join(pub, 'assets'))) rmSync(join(pub, 'assets'), { recursive: true })
const skip = new Set(['robots.txt', 'sitemap.xml', '_redirects'])
for (const f of readdirSync(out)) if (!skip.has(f)) cpSync(join(out, f), join(pub, f), { recursive: true })
rmSync(out, { recursive: true })
console.log('\nServer build ready in backend/ (upload it to Bluehost, see backend/DEPLOY.md)')
