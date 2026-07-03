import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getFirebaseStorage } from './client'
import imageCompression from 'browser-image-compression'
import type { ProductImage } from '@/types'

const COMPRESSION_OPTIONS = {
  maxSizeMB:           1,
  maxWidthOrHeight:    1200,
  useWebWorker:        true,
  fileType:            'image/webp' as const,
  initialQuality:      0.85,
}

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, COMPRESSION_OPTIONS)
}

export async function uploadProductImage(
  productId: string,
  file: File,
  imageId: string
): Promise<ProductImage> {
  const compressed = await compressImage(file)
  const storage    = getFirebaseStorage()
  const path       = `products/${productId}/${imageId}.webp`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, compressed, { contentType: 'image/webp' })
  const url = await getDownloadURL(storageRef)

  return {
    id:          imageId,
    url,
    storagePath: path,
    order:       0,
    alt:         file.name.replace(/\.[^.]+$/, ''),
  }
}

export async function uploadSiteAsset(file: File, assetName: string): Promise<string> {
  const compressed = await compressImage(file)
  const storage    = getFirebaseStorage()
  const path       = `assets/${assetName}.webp`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, compressed, { contentType: 'image/webp' })
  return getDownloadURL(storageRef)
}

export async function deleteStorageFile(storagePath: string): Promise<void> {
  try {
    const storage    = getFirebaseStorage()
    const storageRef = ref(storage, storagePath)
    await deleteObject(storageRef)
  } catch {
    // Silently ignore missing files
  }
}
