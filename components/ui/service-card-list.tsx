"use client"

import {
  Baby,
  Box,
  Camera,
  Heart,
  Sparkles,
  Users,
} from "lucide-react"

import { AnimateContent } from "@/components/ui/animate-content"
import { ServiceCard } from "@/components/ui/service-card"

export function ServiceCardList() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      <AnimateContent
        delay={100}
        duration={500}
        distance={75}
        stagger
        staggerOffset={150}
      >
        <ServiceCard
          title="Familiefotografering"
          text="Vakre familieportretter som fanger kjærligheten og samholdet i familien deres."
          icon={<Users size={32} />}
        />
        <ServiceCard
          title="Bryllupsfotografering"
          text="Fang de magiske øyeblikkene på deres store dag med profesjonell bryllupsfotografering."
          icon={<Heart size={32} />}
        />
        <ServiceCard
          title="Barnefotografering"
          text="Naturlige og lekne bilder av barna deres i deres eget miljø eller i studio."
          icon={<Baby size={32} />}
        />
        <ServiceCard
          title="Produktfotografering"
          text="Høykvalitets produktbilder som fremhever deres varer på best måte."
          icon={<Box size={32} />}
        />
        <ServiceCard
          title="Portrettfotografering"
          text="Profesjonelle portretter for både private og forretningsmessige formål."
          icon={<Camera size={32} />}
        />
        <ServiceCard
          title="Konfirmantfoto"
          text="Elegante og tidløse konfirmantbilder som markerer denne viktige milepælen."
          icon={<Sparkles size={32} />}
        />
      </AnimateContent>
    </div>
  )
}
