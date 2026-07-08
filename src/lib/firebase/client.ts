import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Singleton pattern – avoid re-initializing on hot reload
let app:       FirebaseApp
let auth:      Auth
let db:        Firestore
let storage:   FirebaseStorage
let analytics: Analytics | null = null

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp())
  return auth
}

export function getFirebaseDb(): Firestore {
  // experimentalAutoDetectLongPolling: falls back to HTTP long-polling when
  // WebChannel streaming is blocked by restrictive networks/proxies, which
  // otherwise causes reads/writes to hang indefinitely with no error.
  if (!db) db = initializeFirestore(getFirebaseApp(), { experimentalAutoDetectLongPolling: true })
  return db
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) storage = getStorage(getFirebaseApp())
  return storage
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null
  if (!analytics) {
    const { getAnalytics: initAnalytics } = await import('firebase/analytics')
    analytics = initAnalytics(getFirebaseApp())
  }
  return analytics
}

// Named exports for convenience
export { getFirebaseApp as firebaseApp }
