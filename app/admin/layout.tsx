import { AdminGuard } from "./AdminGuard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminGuard>{children}</AdminGuard>
      </SidebarInset>
    </SidebarProvider>
  )
}
