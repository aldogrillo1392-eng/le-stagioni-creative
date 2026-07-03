import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from './client'

// Session expires when browser tab closes
export async function signIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth()
  await setPersistence(auth, browserSessionPersistence)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth())
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email)
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export function getCurrentUser(): User | null {
  return getFirebaseAuth().currentUser
}
