import { api } from "./axios"

export const PHOTOS_QUERY_KEY = ["photos"] as const
export const ADMIN_PHOTOS_QUERY_KEY = ["photos", "admin"] as const

/** Photo shape returned from GET /photos (includes presigned imageUrl) */
export interface PhotoWithUrl {
  id: string
  s3Key: string
  imageUrl: string
  title?: string | null
  alt?: string | null
  category?: string | null
  published?: boolean
  hasPrize?: boolean
  prizeTitle?: string | null
  prizeMedal?: "Gull" | "Sølv" | "Bronse" | "Hederlig omtale" | null
  createdAt?: string
  [key: string]: unknown
}

/** Response shape from POST /photos/upload-urls */
export interface UploadUrlItem {
  uploadUrl: string
  s3Key: string
  fileId: string
}

/** Body for POST /photos (create photo records with metadata) */
export interface CreatePhotoPayload {
  id: string
  s3Key: string
  title?: string | null
  alt?: string | null
  published?: boolean
  category?:
    | "Barn"
    | "Familie"
    | "Portrett"
    | "Konfirmant"
    | "Bryllup"
    | "Produkt"
    | "Reklame"
    | null
  hasPrize?: boolean
  prizeTitle?: string | null
  prizeMedal?: "Gull" | "Sølv" | "Bronse" | "Hederlig omtale" | null
}

export const getUploadUrls = async (
  files: { name: string; type: string }[]
): Promise<UploadUrlItem[]> => {
  const { data } = await api.post<UploadUrlItem[]>("/photos/upload-urls", {
    files,
  })
  return data
}

export const createPhotos = async (photos: CreatePhotoPayload[]) => {
  const { data } = await api.post("/photos", { photos })
  return data
}

/** Client-side: uses axios withCredentials (browser sends cookies) */
export const getGalleryPhotos = async (category?: string) => {
  const { data } = await api.get("/photos", { params: { category } })
  return data
}

/** Server-side: forwards request cookies for SSR/auth. Use in Server Components. */
export async function getPhotosServer(category?: string) {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const { data } = await api.get("/photos", {
    params: { category },
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  })
  return data
}

export interface AdminPhotosFilters {
  category?: string
  published?: boolean
  hasPrize?: boolean
}

/** Client-side: fetch admin photos with filters (uses axios withCredentials) */
export async function getAdminPhotos(filters?: AdminPhotosFilters): Promise<PhotoWithUrl[]> {
  const params: Record<string, string> = {}
  if (filters?.category?.trim()) params.category = filters.category.trim()
  if (filters?.published !== undefined) params.published = String(filters.published)
  if (filters?.hasPrize !== undefined) params.hasPrize = String(filters.hasPrize)
  const { data } = await api.get<PhotoWithUrl[]>("/photos/admin", { params })
  return data
}

/** Server-side: fetch admin photos with filters (forwards cookies, cache-friendly) */
export async function getAdminPhotosServer(
  filters?: AdminPhotosFilters
): Promise<PhotoWithUrl[]> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const params: Record<string, string> = {}
  if (filters?.category?.trim()) params.category = filters.category.trim()
  if (filters?.published !== undefined) params.published = String(filters.published)
  if (filters?.hasPrize !== undefined) params.hasPrize = String(filters.hasPrize)
  const { data } = await api.get<PhotoWithUrl[]>("/photos/admin", {
    params,
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  })
  return data
}

/** Matches backend PATCH /photos/:id body schema */
export type UpdatePhotoPayload = {
  title?: string | null
  alt?: string | null
  published?: boolean
  category?:
    | "Barn"
    | "Familie"
    | "Portrett"
    | "Konfirmant"
    | "Bryllup"
    | "Produkt"
    | "Reklame"
    | null
  hasPrize?: boolean
  prizeTitle?: string | null
  prizeMedal?: "Gull" | "Sølv" | "Bronse" | "Hederlig omtale" | null
}

function buildUpdateBody(
  payload: UpdatePhotoPayload
): Record<string, string | boolean | null> {
  const body: Record<string, string | boolean | null> = {}
  if (payload.title !== undefined)
    body.title = payload.title === "" ? null : payload.title
  if (payload.alt !== undefined) body.alt = payload.alt === "" ? null : payload.alt
  if (payload.published !== undefined) body.published = payload.published
  if (payload.category !== undefined) body.category = payload.category
  if (payload.hasPrize !== undefined) body.hasPrize = payload.hasPrize
  if (payload.prizeTitle !== undefined)
    body.prizeTitle = payload.prizeTitle === "" ? null : payload.prizeTitle
  if (payload.prizeMedal !== undefined) body.prizeMedal = payload.prizeMedal
  return body
}

export const updatePhoto = async (
  id: string,
  payload: UpdatePhotoPayload
) => {
  const body = buildUpdateBody(payload)
  const { data } = await api.patch(`/photos/${id}`, body)
  return data
}

export const deletePhoto = async (id: string) => {
  const { data } = await api.delete(`/photos/${id}`)
  return data
}

export const deleteManyPhotos = async (ids: string[]) => {
  const { data } = await api.delete("/photos", { data: { ids } })
  return data
}

/** Response from batch publish endpoint */
export interface BatchPublishResponse {
  success: boolean
  count: number
  photos: { id: string; published: boolean }[]
}

/** Batch update published status for multiple photos
 * Backend: PATCH /photos/batch-publish with body { ids: string[], published: boolean }
 */
export const batchPublish = async (
  ids: string[],
  published: boolean
): Promise<BatchPublishResponse> => {
  const { data } = await api.patch<BatchPublishResponse>(
    "/photos/batch-publish",
    { ids, published },
    { headers: { "Content-Type": "application/json" } }
  )
  return data
}
