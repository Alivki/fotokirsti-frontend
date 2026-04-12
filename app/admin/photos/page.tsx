import { Suspense } from "react"
import { AdminPhotosClient } from "./AdminPhotosClient"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminPhotosClient />
    </Suspense>
  )
}
