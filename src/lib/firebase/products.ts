import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, increment,
  type QueryConstraint, Timestamp,
} from 'firebase/firestore'
import { getFirebaseDb } from './client'
import type { Product, ProductDoc, ProductFormData, ProductImage, CatalogFilters } from '@/types'

const COLLECTION = 'products'

// ─── Transform Firestore doc → Product ───────────────────────────────────────

function docToProduct(id: string, data: ProductDoc): Product {
  const toISO = (v: { toDate: () => Date } | string) =>
    v instanceof Timestamp ? v.toDate().toISOString() : String(v)

  return {
    id,
    slug:        data.slug,
    name:        data.name,
    description: data.description,
    price:       data.price,
    category:    data.category,
    status:      data.status,
    featured:    data.featured ?? false,
    order:       data.order ?? 0,
    images:      data.images ?? [],
    mainImage:   data.mainImage ?? '',
    vintedUrl:   data.vintedUrl ?? '',
    views:       data.views ?? 0,
    createdAt:   toISO(data.createdAt),
    updatedAt:   toISO(data.updatedAt),
  }
}

// ─── Read operations ──────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const db = getFirebaseDb()
  const q  = query(collection(db, COLLECTION), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => docToProduct(d.id, d.data() as ProductDoc))
}

export async function getPublicProducts(filters: Partial<CatalogFilters> = {}): Promise<Product[]> {
  const db = getFirebaseDb()
  const constraints: QueryConstraint[] = []

  // Only show non-hidden products publicly
  if (filters.status === 'available') {
    constraints.push(where('status', '==', 'available'))
  } else if (filters.status === 'sold') {
    constraints.push(where('status', '==', 'sold'))
  } else {
    // all = available + sold, not hidden
    constraints.push(where('status', 'in', ['available', 'sold']))
  }

  if (filters.category && filters.category !== 'all') {
    constraints.push(where('category', '==', filters.category))
  }

  // Ordering
  if (filters.sort === 'price-asc') {
    constraints.push(orderBy('price', 'asc'))
  } else if (filters.sort === 'price-desc') {
    constraints.push(orderBy('price', 'desc'))
  } else {
    constraints.push(orderBy('createdAt', 'desc'))
  }

  const q    = query(collection(db, COLLECTION), ...constraints)
  const snap = await getDocs(q)
  let products = snap.docs.map(d => docToProduct(d.id, d.data() as ProductDoc))

  // Client-side text search (Firestore free tier doesn't support full-text)
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase()
    products = products.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }

  return products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db   = getFirebaseDb()
  const q    = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return docToProduct(d.id, d.data() as ProductDoc)
}

export async function getProductById(id: string): Promise<Product | null> {
  const db   = getFirebaseDb()
  const ref  = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return docToProduct(snap.id, snap.data() as ProductDoc)
}

export async function getFeaturedProducts(maxItems = 6): Promise<Product[]> {
  const db = getFirebaseDb()
  const q  = query(
    collection(db, COLLECTION),
    where('featured', '==', true),
    where('status', '==', 'available'),
    orderBy('order', 'asc'),
    limit(maxItems)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => docToProduct(d.id, d.data() as ProductDoc))
}

export async function getNewestProducts(maxItems = 4): Promise<Product[]> {
  const db = getFirebaseDb()
  const q  = query(
    collection(db, COLLECTION),
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => docToProduct(d.id, d.data() as ProductDoc))
}

// ─── Write operations (admin only) ───────────────────────────────────────────

export async function createProduct(
  data: ProductFormData,
  images: ProductImage[],
  slug: string
): Promise<string> {
  const db  = getFirebaseDb()
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    slug,
    images,
    mainImage:  images[0]?.url ?? '',
    views:      0,
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormData & { images: ProductImage[]; mainImage: string }>
): Promise<void> {
  const db  = getFirebaseDb()
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteProduct(id: string): Promise<void> {
  const db  = getFirebaseDb()
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function duplicateProduct(product: Product): Promise<string> {
  const { id: _id, slug, name, createdAt: _c, updatedAt: _u, views: _v, ...rest } = product
  const db = getFirebaseDb()
  const ref = await addDoc(collection(db, COLLECTION), {
    ...rest,
    name:      `${name} (copia)`,
    slug:      `${slug}-copia-${Date.now()}`,
    status:    'hidden' as const,
    views:     0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function incrementProductViews(id: string): Promise<void> {
  try {
    const db  = getFirebaseDb()
    const ref = doc(db, COLLECTION, id)
    await updateDoc(ref, { views: increment(1) })
  } catch {
    // Silently ignore – view tracking is best-effort
  }
}
