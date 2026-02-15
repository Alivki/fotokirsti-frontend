import { QueryClient } from "@tanstack/react-query"

let queryClient: QueryClient | null = null

export function getQueryClient() {
    if (!queryClient) {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 1,
                    staleTime: 5 * 60 * 1000,
                    refetchOnWindowFocus: false,
                },
            },
        })
    }
    return queryClient
}
