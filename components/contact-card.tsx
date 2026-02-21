"use client"

import { Mail, Phone } from "lucide-react"

import { ContactForm } from "@/components/contact-form"

export function ContactCard() {
  return (
    <div className="flex flex-col gap-6 rounded-md border border-border bg-secondary p-6 shadow md:flex-row lg:p-10 pb-7">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="mb-2 text-3xl font-bold lg:text-4xl">
            Klar for å bestille?
          </h2>
          <p className="text-sm text-foreground/80 lg:text-base">
            Fotograf basert i Lillehammer med eget studio. Kåret til Norges beste
            fotograf 2015. Jeg er her for å lagre deres minner i bilder.
            <br />
            <br />
            Med 30 års erfaring i bransjen og min ekspertise er jeg her for å
            lage noe vakkert for dere og deres. Passer veldig fint til gaver.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-4">
            <Mail size={32} />
            <p className="font-semibold">hjem@fotokirsti.no</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Phone size={32} />
            <p className="font-semibold">+47 988 71 612</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 sm:gap-4 [&_[data-slot=input-group]]:bg-white [&_[data-slot=select-trigger]]:bg-white">
        <ContactForm />
      </div>
    </div>
  )
}
