/** Sends an event to Google Analytics and Meta Pixel when they are loaded (see Analytics.tsx). Safe to call anytime. */
type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void }
export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as W
  try { w.gtag?.('event', event, params) } catch { /* ignore */ }
  const fb: Record<string, string> = { generate_lead: 'Lead', contact_whatsapp: 'Contact', contact_call: 'Contact', book_submit: 'Lead' }
  try { if (fb[event]) w.fbq?.('track', fb[event], params); else w.fbq?.('trackCustom', event, params) } catch { /* ignore */ }
}
