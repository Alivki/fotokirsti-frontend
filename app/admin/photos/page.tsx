import { AdminPhotosClient } from "./AdminPhotosClient"
import {
  getAdminPhotosServer,
  ADMIN_PHOTOS_QUERY_KEY,
} from "@/services/photos"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const categoryParam =
    typeof params.category === "string"
      ? params.category
      : Array.isArray(params.category)
        ? params.category[0]
        : undefined
  const publishedParam =
    typeof params.published === "string"
      ? params.published
      : Array.isArray(params.published)
        ? params.published[0]
        : undefined
  const hasPrizeParam =
    typeof params.hasPrize === "string"
      ? params.hasPrize
      : Array.isArray(params.hasPrize)
        ? params.hasPrize[0]
        : undefined

  const filters: { category?: string; published?: boolean; hasPrize?: boolean } =
    {}
  if (categoryParam && categoryParam !== "alle") filters.category = categoryParam
  if (publishedParam === "true") filters.published = true
  if (publishedParam === "false") filters.published = false
  if (hasPrizeParam === "true") filters.hasPrize = true
  if (hasPrizeParam === "false") filters.hasPrize = false

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: 0, staleTime: 0 }, // Server: no cache retention between requests
    },
  });
  try {
    await queryClient.prefetchQuery({
      queryKey: [...ADMIN_PHOTOS_QUERY_KEY, filters],
      queryFn: () => getAdminPhotosServer(filters),
    })
  } catch {
    // Prefetch failed (e.g. 404) – page still renders; Edit button shows disabled
  }

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminPhotosClient />
      </HydrationBoundary>
    </div>
  )
}