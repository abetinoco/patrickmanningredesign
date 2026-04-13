import type { Listing } from '../types/listing'

/** Full URL to listing on the site that uses `/homes/:city/:slug` routing (original TN Realtor app). */
export function listingUrlOnMainSite(l: Listing): string | null {
  const origin = import.meta.env.VITE_PUBLIC_LISTINGS_SITE_ORIGIN?.replace(/\/$/, '')
  if (!origin) return null
  const citySlug = `${l.city.toLowerCase().replace(/[\s']+/g, '-')}-${l.state.toLowerCase()}`
  return `${origin}/homes/${citySlug}/${l.slug}`
}
