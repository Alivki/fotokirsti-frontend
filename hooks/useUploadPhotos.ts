import { useState } from "react"
import type { UploadUrlItem } from "@/services/photos"

/** Shape expected by uploadFiles: id (for progress key), url, s3Key */
export interface PresignedUrl {
  id: string
  url: string
  s3Key: string
}

/** Map backend UploadUrlItem to PresignedUrl (fileId → id, uploadUrl → url) */
export function toPresignedUrl(item: UploadUrlItem): PresignedUrl {
  return { id: item.fileId, url: item.uploadUrl, s3Key: item.s3Key }
}

export const useUploadPhotos = () => {
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = useState(false)

  const uploadFiles = async (
    files: File[],
    presignedUrls: PresignedUrl[]
  ) => {
    if (files.length !== presignedUrls.length) {
      throw new Error("Files and presigned URLs length mismatch")
    }

    setIsUploading(true)
    setProgress({})

    try {
      const uploadPromises = files.map((file, index) => {
        const { url, id } = presignedUrls[index]

        return new Promise<{ id: string; s3Key: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open("PUT", url)
          xhr.setRequestHeader("Content-Type", file.type)

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = (event.loaded / event.total) * 100
              setProgress((prev) => ({ ...prev, [id]: percent }))
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ id, s3Key: presignedUrls[index].s3Key })
            } else {
              reject(new Error(`Upload failed for ${file.name}: ${xhr.status}`))
            }
          }

          xhr.onerror = () => reject(new Error(`Upload error for ${file.name}`))
          xhr.send(file)
        })
      })

      const uploaded = await Promise.all(uploadPromises)
      return uploaded
    } finally {
      setIsUploading(false)
    }
  }

  return {
    progress,
    isUploading,
    uploadFiles,
  }
}
