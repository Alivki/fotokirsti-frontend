import { Contact } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="font-medium text-sidebar-primary">Kontakter</div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/40 via-muted/20 to-background p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_70%)] opacity-50" />
          <div className="relative flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/5">
              <Contact
                className="size-10 text-primary/70"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                Kommer snart
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Kontaktadministrasjon er under utvikling. Her vil du snart kunne
                administrere kontakter og henvendelser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}