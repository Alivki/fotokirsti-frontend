import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <footer className="border-t border-border bg-white">
            <div className="mx-auto max-w-5xl px-6 py-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-foreground">Platform</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Building tools for the modern web.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            Navigation
                        </h3>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Hjem
                            </Link>
                            <Link
                                href="/gallery"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Galleri
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Login
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-foreground">Contact</h3>
                        <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                hello@platform.com
              </span>
                        </nav>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        {'© 2026 Platform. All rights reserved.'}
                    </p>
                    <Link
                        href="/admin"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    )
}
