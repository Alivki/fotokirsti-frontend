import Link from "next/link"
import { FileText } from "lucide-react"

import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { FadeContent } from "@/components/ui/fade-content"
import { Button } from "@/components/ui/button"
import { getCurrentPricelistISR } from "@/services/pricelist"
import { PdfViewerClient } from "./PdfViewerClient"

export default async function PricelistPage() {
  const pricelist = await getCurrentPricelistISR()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-24">
        <FadeContent>
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-extrabold lg:text-4xl xl:text-5xl">
              Prisliste
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Her finner du min nåværende prisliste. Ta gjerne kontakt om du har
              spørsmål eller ønsker en tilpasset tilbud.
            </p>
          </div>
        </FadeContent>

        <FadeContent duration={1000}>
          {pricelist ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                <PdfViewerClient fileUrl={pricelist.fileUrl} />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-lg border border-border bg-secondary/50 px-6 py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <FileText className="size-12 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold sm:text-2xl">
                Prislisten er ikke tilgjengelig
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Prislisten er for øyeblikket ikke publisert. Ta gjerne kontakt for
                mer informasjon om priser og tjenester.
              </p>
              <Button asChild className="mt-6" size="lg">
                <Link href="/">Tilbake til forsiden</Link>
              </Button>
            </div>
          )}
        </FadeContent>
      </main>
      <Footer />
    </div>
  )
}
