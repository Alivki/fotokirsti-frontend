"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient } from "@/services/query-client"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {children}
                <Toaster richColors closeButton position="bottom-right" />
            </TooltipProvider>
        </QueryClientProvider>
    )
}
