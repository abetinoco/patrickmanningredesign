export type ListingStatus = 'active' | 'coming-soon' | 'sold' | 'off-market'

export interface Listing {
  id: string
  status: ListingStatus
  address: string
  city: string
  state: string
  zip: string
  slug: string
  price: number
  beds: number
  baths: number
  sqft: number | null
  description: string | null
  features: string[] | null
  photos: string[] | null
  primary_photo: string | null
  year_built: number | null
  created_at: string
  updated_at: string
}
