"use client"

import { useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Trophy } from "lucide-react"

import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Button } from "@/components/ui/button"
import { StyledLink } from "@/components/ui/styled-link"
import { FadeContent } from "@/components/ui/fade-content"
import { AnimateContent } from "@/components/ui/animate-content"
import { ServiceCardList } from "@/components/ui/service-card-list"
import { SingleImageCarousel } from "@/components/ui/single-image-carousel"
import { MultiImageCarousel } from "@/components/ui/multi-image-carousel"
import { ContactCard } from "@/components/contact-card"
import { FAQ } from "@/app/about/components/faq"

const CAROUSEL_IMAGES = [
  "/assets/exterior.jpg",
  "/assets/studio.png",
  "/assets/interior.jpg",
  "/assets/landing-page.png",
]

export default function Page() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Header />

      <main className="container mx-auto space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-32">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FadeContent duration={1500}>
            <div className="flex flex-1 flex-col gap-6">
              <h1 className="text-5xl font-extrabold lg:text-4xl xl:text-5xl">
                Fotograf{" "}
                <span className="sm:hidden lg:hidden 2xl:hidden">
                  <br />
                </span>{" "}
                Kirsti Hovde
              </h1>
              <div className="space-y-4 text-foreground/80 lg:text-sm xl:text-base">
                <p>
                  Fotograf basert i Lillehammer med eget studio. Kåret til Norges
                  beste fotograf 2015. Jeg er her for å lagre deres minner i
                  bilder.
                </p>
                <p>
                  Med 30 års erfaring i bransjen og min ekspertise er jeg her for
                  å lage noe vakkert for dere og deres. Passer veldig fint til
                  gaver.
                </p>
                <p>
                  <StyledLink href="/gallery" query={{ hasPrize: "true" }}>
                    Premierte bilder
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "barn" }}>
                    Barn
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "familie" }}>
                    Familie
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "portrett" }}>
                    Portrett
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "konfirmant" }}>
                    Konfirmant
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "bryllup" }}>
                    Bryllup
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "produkt" }}>
                    Produkt
                  </StyledLink>{" "}
                  |{" "}
                  <StyledLink href="/gallery" query={{ category: "reklame" }}>
                    Reklame
                  </StyledLink>
                </p>

                <div className="flex flex-row flex-nowrap gap-2 sm:gap-4">
                  <Button
                    onClick={() => {
                      containerRef.current?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="flex-1 min-w-0 shrink-0 md:min-w-52 md:flex-none md:w-auto"
                    size="lg"
                  >
                    Ta kontakt
                  </Button>
                  <Button
                    onClick={() => router.push("/gallery")}
                    className="flex-1 min-w-0 shrink-0 bg-white md:min-w-52 md:flex-none md:w-auto"
                    variant="secondary"
                    size="lg"
                  >
                    Se alle bilder
                  </Button>
                </div>
              </div>
            </div>
          </FadeContent>

          <AnimateContent distance={35}>
            <div className="lg:flex-1">
              <Image
                src="/assets/landing-page.png"
                alt="Landing page"
                loading="eager"
                quality={60}
                height={432}
                width={601}
                className="h-auto w-full rounded-md object-contain object-top"
              />
            </div>
          </AnimateContent>
        </div>

        <div className="space-y-6">
          <AnimateContent delay={100} duration={500} distance={75}>
            <h2 className="text-3xl font-extrabold lg:text-4xl">
              Mine tjenester
            </h2>
          </AnimateContent>
          <ServiceCardList />
        </div>
      </main>

      <section className="flex flex-col items-center bg-secondary py-16 xl:py-24">
        <FadeContent duration={2000}>
          <div className="mb-6 flex flex-col items-center">
            <h2 className="mb-8 text-3xl font-extrabold lg:text-4xl">
              Noen av mine bilder
            </h2>
            <div className="mb-1 flex flex-row">
              <div className="mt-1 h-[4px] w-[10px] rotate-45 rounded-full bg-primary" />
              <div className="ml-1 h-[4px] w-[10px] rotate-90 rounded-full bg-primary" />
              <div className="ml-1 mt-1 h-[4px] w-[10px] -rotate-[35deg] rounded-full bg-primary" />
            </div>
            <Trophy size={42} />
            <p className="my-1 flex flex-row gap-1">
              Kåret til årets fotograf{" "}
              <StyledLink
                className="flex flex-row hover:text-primary"
                target="_blank"
                href="https://fotografforbundet.no/"
              >
                NFF{" "}
                <ArrowUpRight
                  className="ml-[2px] mt-[3px]"
                  strokeWidth={3}
                  size={13}
                />
              </StyledLink>{" "}
              2015
            </p>
            <p className="text-foreground/80 text-sm">Se bildene som var med i kåringen</p>
          </div>

          <div className="container mx-auto px-4 sm:px-2">
            <SingleImageCarousel images={CAROUSEL_IMAGES} />
          </div>
        </FadeContent>

        <div className="container mx-auto mt-6 flex w-full items-center justify-center px-4">
          <Button
            onClick={() => router.push("/gallery?hasPrize=true")}
            className="mt-4 w-full sm:w-64 md:w-auto"
            size="lg"
          >
            Se alle mine premierte bilder
          </Button>
        </div>

        <div className="container mx-auto mt-24 flex flex-col gap-6">
          <h2 className="w-full px-4 text-center text-3xl font-extrabold sm:px-2 lg:text-4xl">
            Flere bilder
          </h2>
          <MultiImageCarousel images={CAROUSEL_IMAGES} />
          <div className="flex w-full items-center justify-center px-4 sm:px-2">
            <Button
              onClick={() => router.push("/gallery")}
              size="lg"
              className="w-full md:w-auto"
            >
              Se alle bilder
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-32">
        <div ref={containerRef} className="scroll-mt-16 space-y-12">
          <FAQ />
          <ContactCard />
        </div>
      </main>

      <Footer />
    </>
  )
}
