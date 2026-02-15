import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Tilbake
        </Link>

        <LoginForm />
      </div>
    </div>
  )
}
