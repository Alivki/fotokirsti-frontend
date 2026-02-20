import { api } from "./axios"

export const PHOTOS_QUERY_KEY = ["photos"] as const
export const ADMIN_PHOTOS_QUERY_KEY = ["photos", "admin"] as const

/** Photo shape returned from GET /photos. Backend returns: id, title, alt, category, prizeTitle, prizeMedal, width, height, aspectRatio, createdAt, updatedAt, plus imageUrl (computed). */
export interface PhotoWithUrl {
  id: string
  title?: string | null
  alt?: string | null
  category?: string | null
  prizeTitle?: string | null
  prizeMedal?: "Gull" | "Sølv" | "Bronse" | "Hederlig omtale" | null
  width?: number | null
  height?: number | null
  aspectRatio?: number | null
  createdAt?: string
  updatedAt?: string
  /** Computed by backend from id (CloudFront URL). Required for display. */
  imageUrl: string
  /** Not returned by photo select; optional for compatibility. */
  s3Key?: string
  /** Not in current select; derive from prizeTitle/prizeMedal if needed. */
  published?: boolean
  /** Not in current select; derive from prizeTitle/prizeMedal if needed. */
  hasPrize?: boolean
  [key: string]: unknown
}

/** Derive hasPrize when not returned by API */
export function getHasPrize(photo: PhotoWithUrl): boolean {
  return photo.hasPrize ?? !!(photo.prizeTitle || photo.prizeMedal)
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

/** Paginated gallery response from GET /photos */
export interface GalleryResponse {
  data: PhotoWithUrl[]
  metadata: {
    total: number
    limit: number
    page: number
    totalPages: number
    hasNext: boolean
  }
}

/** Client-side: fetch paginated gallery photos (category, hasPrize, page, limit) */
export const getGalleryPhotosPaginated = async (
  params: { category?: string; hasPrize?: boolean; page?: number; limit?: number } = {}
): Promise<GalleryResponse> => {
  const { data } = await api.get<GalleryResponse>("/photos", {
    params: {
      category: params.category || undefined,
      hasPrize: params.hasPrize === true ? "true" : undefined,
      page: params.page ?? 1,
      limit: params.limit ?? 50,
    },
  })
  return data
}

/** Client-side: uses axios withCredentials (browser sends cookies) */
export const getGalleryPhotos = async (
  category?: string
): Promise<PhotoWithUrl[]> => {
  const { data } = await api.get<PhotoWithUrl[]>("/photos", {
    params: { category },
  })
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

/** Response shape from GET /photos/admin */
export interface AdminPhotosResponse {
  photos: PhotoWithUrl[]
}

/** Client-side: fetch admin photos with filters (uses axios withCredentials) */
export async function getAdminPhotos(filters?: AdminPhotosFilters): Promise<PhotoWithUrl[]> {
  const params: Record<string, string> = {}
  if (filters?.category?.trim()) params.category = filters.category.trim()
  if (filters?.published !== undefined) params.published = String(filters.published)
  if (filters?.hasPrize !== undefined) params.hasPrize = String(filters.hasPrize)
  const { data } = await api.get<AdminPhotosResponse>("/photos/admin", { params })
  return data.photos ?? []
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
  const { data } = await api.get<AdminPhotosResponse>("/photos/admin", {
    params,
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  })
  return data.photos ?? []
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
