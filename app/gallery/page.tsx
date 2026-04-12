import { ImageIcon } from "lucide-react"
import { PublicCategoryFilter } from "@/components/PublicCategoryFilter"
import { PublicGallery } from "@/components/PublicGallery"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { FadeContent } from "@/components/ui/fade-content"
import { getGalleryPhotosPaginatedISR } from "@/services/photos"
import { GalleryPagination } from "./GalleryPagination"

function capitalizeCategory(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const GALLERY_DESCRIPTIONS: Record<string, string> = {
  alle:
    "Se gjennom bildene mine. Bruk filteret under for å velge kategori eller se premierte bilder.",
  barn: "Bilde av barn – naturlige portretter og øyeblikk som varer.",
  familie: "Familiebilder – portretter og minner med de nærmeste.",
  portrett: "Portrettfotografering – fra headshots til kunstneriske portretter.",
  konfirmant: "Konfirmasjonsbilder – spesielle bilder fra store dag.",
  bryllup: "Bryllupsfotografering – dokumenterer den store dagen deres.",
  produkt: "Produktfotografering – profesjonelle bilder for varepresentasjon.",
  reklame: "Reklamer og kampanjer – visuelt innhold for markedføring.",
  premierte:
    "Premierte bilder – nominerte og prisbelønte fotografier fra NFF.",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const categoryParam =
    typeof params.category === "string" ? params.category : undefined
  const hasPrize = params.hasPrize === "true"
  const pageNum = Number(params.page) || 1
  const pageSize = 10

  const category =
    categoryParam && categoryParam !== "alle"
      ? capitalizeCategory(categoryParam)
      : undefined

  const filterKey = hasPrize ? "premierte" : (categoryParam || "alle")
  const description =
    GALLERY_DESCRIPTIONS[filterKey] ?? GALLERY_DESCRIPTIONS.alle

  let photos: Awaited<ReturnType<typeof getGalleryPhotosPaginatedISR>>["data"] = []
  let totalPages = 1
  let hasNext = false
  try {
    const data = await getGalleryPhotosPaginatedISR({
      category,
      hasPrize,
      page: pageNum,
      pageSize,
    })
    photos = data.data ?? []
    totalPages = data.pages ?? 1
    hasNext = data.nextPage != null
  } catch {
    // Render empty state on fetch failure
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-24">
        <div className="flex flex-col gap-8">
          <FadeContent>
            <div className="flex flex-col gap-8">
              <h1 className="text-5xl font-extrabold lg:text-4xl xl:text-5xl">
                Galleri
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </FadeContent>
          <FadeContent duration={1000}>
            {photos.length === 0 ? (
              <div className="flex w-full flex-col gap-6">
                <PublicCategoryFilter />
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-secondary/50 py-16 px-6 text-center sm:py-24">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <ImageIcon
                      className="size-12 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    Ingen bilder i denne kategorien
                  </h2>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    Det er ingen bilder å vise for dette valget. Prøv en annen
                    kategori eller se alle bilder.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <PublicCategoryFilter />
                  <PublicGallery photos={photos} />
                </div>
                <GalleryPagination
                  page={pageNum}
                  totalPages={totalPages}
                  hasNext={hasNext}
                />
              </div>
            )}
          </FadeContent>
        </div>
      </main>
      <Footer />
    </div>
  )
}
