"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

import { FaInstagram } from "react-icons/fa"
import { FiYoutube, FiTwitter } from "react-icons/fi"

import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Button } from "@/components/ui/button"
import { FadeContent } from "@/components/ui/fade-content"
import { AnimateContent } from "@/components/ui/animate-content"
import { SingleImageCarousel } from "@/components/ui/single-image-carousel"
import { ContactInfo } from "@/app/about/components/contact-info"
import { HistoryDaisy } from "@/app/about/components/history-daisy"

const STUDIO_IMAGES = ["/assets/exterior.jpg", "/assets/interior.jpg"]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Header />

      <main className="container mx-auto space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-24 xl:pt-24">
        <div className="flex flex-col gap-8 sm:flex-row">
          <AnimateContent>
            <div className="flex flex-col gap-2 lg:flex-1">
              <h1 className="mb-7 text-5xl font-extrabold sm:hidden">Om meg</h1>
              <Image
                src="/assets/portrait.jpg"
                alt="Portrait of Kirsti Hovde"
                loading="eager"
                quality={60}
                height={800}
                width={800}
                className="h-auto w-full rounded-md object-contain object-top"
              />
              <div className="hidden sm:block lg:hidden">
                <Button
                  onClick={() => {
                    containerRef.current?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="w-full"
                  size="lg"
                >
                  Ta kontakt
                </Button>
              </div>
            </div>
          </AnimateContent>

          <FadeContent>
            <div className="flex flex-col gap-6 lg:flex-1">
              <div>
                <h1 className="mb-7 hidden text-5xl font-extrabold sm:block">
                  Om meg
                </h1>
                <div className="space-y-4 text-foreground/80 sm:text-sm md:text-base">
                  <p>
                    Fotograf basert i Lillehammer med eget studio. Kåret til
                    Norges beste fotograf 2015. Jeg er her for å lagre deres
                    minner i bilder.
                  </p>
                  <p>
                    Med 30 års erfaring i bransjen og min ekspertise er jeg her
                    for å lage noe vakkert for dere og deres. Passer veldig fint
                    til gaver. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.
                  </p>
                  <p>
                    Fotograf basert i Lillehammer med eget studio. Kåret til
                    Norges beste fotograf 2015. Jeg er her for å lagre deres
                    minner i bilder.
                  </p>
                  <p>
                    Med 30 års erfaring i bransjen og min ekspertise er jeg her
                    for å lage noe vakkert for dere og deres. Passer veldig fint
                    til gaver. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-sm text-muted-foreground">Følg meg:</span>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://twitter.com"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Twitter"
                    >
                      <FiTwitter size={24} />
                    </Link>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://youtube.com"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="YouTube"
                    >
                      <FiYoutube size={24} />
                    </Link>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://instagram.com"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Instagram"
                    >
                      <FaInstagram size={24} />
                    </Link>
                  </div>
                </div>
              </div>
              <AnimateContent delay={200}>
                <div className="sm:hidden lg:block">
                  <Button
                    onClick={() => {
                      containerRef.current?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="w-full md:w-auto"
                    size="lg"
                  >
                    Ta kontakt
                  </Button>
                </div>
              </AnimateContent>
            </div>
          </FadeContent>
        </div>

        <div className="w-full space-y-6">
          <FadeContent>
            <h2 className="text-3xl font-extrabold lg:text-4xl">
              Min historie
            </h2>
            <div className="w-full">
              <HistoryDaisy />
            </div>
          </FadeContent>
        </div>
      </main>

      <section className="flex flex-col items-center bg-secondary py-16 xl:py-24">
        <div className="container mx-auto px-4 sm:px-2">
          <h2 className="mb-6 text-3xl font-extrabold lg:text-4xl">
            Mitt studio
          </h2>
          <SingleImageCarousel images={STUDIO_IMAGES} />
          <p className="mt-3 text-foreground/80 sm:mt-8">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Cursus neque
            elit curabitur rhoncus molestie. Eu eleifend place ipiscing ridiculus
            nostra elementum. Velit sodales aenean vel fermentum laoreet
            eleifend. Ullamcorper scelerisque tristique ligula condimentum
            conubia fringilla. Eget maximus himenaeos sociosqu risus nullam
            sociosqu senectus porta.
          </p>
        </div>
      </section>

      <main className="container mx-auto space-y-16 px-4 pt-12 pb-16 sm:px-2 lg:pt-14 xl:space-y-24 xl:pb-24 xl:pt-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold lg:text-4xl">
            Se hvor jeg holder til
          </h2>
          <div ref={containerRef} className="-scroll-mt-[65vh]">
            <ContactInfo />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
