import Link from "next/link"

export function Header() {
    return (
        <header className="top-0 z-50 w-full border-b border-border bg-white backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-sm font-semibold tracking-tight text-foreground"
                >
                    fotokirsti
                </Link>
            </div>
        </header>
    )
}