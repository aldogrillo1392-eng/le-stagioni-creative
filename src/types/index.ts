// ─── Core Domain Types ───────────────────────────────────────────────────────

export type ProductStatus = 'available' | 'sold' | 'hidden'

export type ProductCategory =
  | 'decorazioni'
  | 'portacandele'
  | 'oggettistica'
  | 'natale'
  | 'pasqua'
  | 'autunno'
  | 'primavera'
  | 'estate'
  | 'idee-regalo'
  | 'altre'

export interface Product {
  id:          string
  slug:        string
  name:        string
  description: string
  price:       number
  category:    ProductCategory
  status:      ProductStatus
  featured:    boolean
  order:       number
  images:      ProductImage[]
  mainImage:   string        // URL of primary image
  vintedUrl:   string
  views:       number
  createdAt:   string        // ISO string
  updatedAt:   string        // ISO string
}

export interface ProductImage {
  id:       string
  url:      string
  storagePath: string
  order:    number
  alt:      string
}

// ─── Firestore document shape (raw, before transform) ────────────────────────

export interface ProductDoc {
  slug:        string
  name:        string
  description: string
  price:       number
  category:    ProductCategory
  status:      ProductStatus
  featured:    boolean
  order:       number
  images:      ProductImage[]
  mainImage:   string
  vintedUrl:   string
  views:       number
  createdAt:   { toDate: () => Date } | string
  updatedAt:   { toDate: () => Date } | string
}

// ─── Settings / Site Config ──────────────────────────────────────────────────

export interface SiteSettings {
  siteName:        string
  tagline:         string
  heroTitle:       string
  heroSubtitle:    string
  instagramHandle: string
  instagramUrl:    string
  vintedProfileUrl:string
  adminEmail:      string
  logoUrl:         string
  heroBgUrl:       string
  primaryColor:    string
  accentColor:     string
  footerText:      string
  contactEmail:    string
  contactPhone:    string
  updatedAt:       string
}

// ─── Statistics ──────────────────────────────────────────────────────────────

export interface SiteStats {
  totalProducts:     number
  availableProducts: number
  soldProducts:      number
  totalViews:        number
  topViewedProduct?: { id: string; name: string; views: number }
  recentProducts:    Array<{ id: string; name: string; createdAt: string }>
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface ProductFormData {
  name:        string
  description: string
  price:       number
  category:    ProductCategory
  status:      ProductStatus
  featured:    boolean
  vintedUrl:   string
  order:       number
}

export interface SettingsFormData extends Omit<SiteSettings, 'updatedAt' | 'logoUrl' | 'heroBgUrl'> {}

// ─── Catalog filters ─────────────────────────────────────────────────────────

export type SortOption = 'newest' | 'price-asc' | 'price-desc'
export type StatusFilter = 'all' | 'available' | 'sold'

export interface CatalogFilters {
  query:    string
  category: ProductCategory | 'all'
  status:   StatusFilter
  sort:     SortOption
}
