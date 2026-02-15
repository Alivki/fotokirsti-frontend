import { api } from "./axios"

export const PRICELIST_QUERY_KEY = ["pricelist"] as const
export const PRICELIST_HISTORY_QUERY_KEY = ["pricelist", "history"] as const

/** Pricelist shape from backend (includes presigned fileUrl) */
export interface PricelistWithUrl {
  id: string
  s3Key: string
  originalName: string
  fileSize?: number | null
  isActive: boolean
  createdAt: string
  fileUrl: string
}

/** Response from POST /pricelist (create and activate) */
export interface CreatePricelistResponse extends PricelistWithUrl {
  uploadUrl: string
}

export const getCurrentPricelist = async (): Promise<PricelistWithUrl> => {
  const { data } = await api.get<PricelistWithUrl>("/pricelist")
  return data
}

export const createPricelist = async (file: File): Promise<CreatePricelistResponse> => {
  const { data } = await api.post<CreatePricelistResponse>("/pricelist", {
    name: file.name,
    type: "application/pdf" as const,
    fileSize: file.size,
  })

  const uploadRes = await fetch(data.uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  })
  if (!uploadRes.ok) {
    const text = await uploadRes.text()
    throw new Error(text || "Opplasting til lagring feilet")
  }

  return data
}

export const deletePricelist = async (id: string) => {
  const { data } = await api.delete(`/pricelist/${id}`)
  return data
}

export const getPricelistHistory = async (): Promise<PricelistWithUrl[]> => {
  const { data } = await api.get<PricelistWithUrl[]>("/pricelist/history")
  return data
}

export const deleteManyPricelists = async (ids: string[]) => {
  const { data } = await api.delete("/pricelist", { data: { ids } })
  return data
}
