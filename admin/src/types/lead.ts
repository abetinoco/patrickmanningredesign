export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  interest: string | null
  preferred_state: string | null
  notes: string | null
  source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  listing_id: string | null
  page_path: string | null
  created_at: string
}
