"use client"

import { Clock, MapPin } from "lucide-react"

import { ContactCard } from "@/components/contact-card"

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap lg:gap-6">
      <iframe
        className="aspect-square rounded-md sm:aspect-video md:aspect-[16/7]"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d286.49194415405213!2d10.454753047766415!3d61.11522959832956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466a880424c2ee69%3A0x5076fb14a24454b!2sFotograf%20Kirsti%20Hovde!5e0!3m2!1sno!2sno!4v1739550887826!5m2!1sno!2sno"
        width="100%"
        height={400}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Kart til Fotograf Kirsti Hovde"
      />

      <div className="flex min-h-[136px] flex-col gap-6 rounded-lg border border-border bg-secondary p-6 shadow md:w-[40%] md:flex-grow lg:min-h-[156px] lg:w-[30%] xl:p-8">
        <div className="flex flex-row items-center gap-4">
          <MapPin size={32} />
          <h2 className="text-2xl font-bold">Addresse</h2>
        </div>
        <p className="text-sm text-foreground/80 lg:text-base xl:text-base">
          Storgata 123
          <br />
          2609 Lillehammer
          <br />
          Norge
        </p>
      </div>

      <div className="flex min-h-[136px] flex-col gap-6 rounded-lg border border-border bg-secondary p-6 shadow md:w-[40%] md:flex-grow lg:min-h-[156px] lg:w-[30%] xl:p-8">
        <div className="flex flex-row items-center gap-4">
          <Clock size={32} />
          <h2 className="text-2xl font-bold">Åpningstider</h2>
        </div>
        <p className="text-sm text-foreground/80 lg:text-base xl:text-base">
          Mandag - Fredag: 09:00 - 17:00
          <br />
          Lørdag: 10:00 - 15:00
          <br />
          Søndag: Etter avtale
        </p>
      </div>

      <div className="w-full md:w-full lg:w-full">
        <ContactCard />
      </div>
    </div>
  )
}
