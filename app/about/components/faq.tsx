"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const FAQ_ITEMS = [
  {
    question: "Hvor holder dere til?",
    answer:
      "Studioet ligger sentralt i Lillehammer. Adressen er [adresse]. Du finner oss lett ved å følge GPS.",
  },
  {
    question: "Hvor lang tid tar en fotosession?",
    answer:
      "Det varierer etter type shoot. En portrettsession tar vanligvis 1–2 timer, mens bryllup og større arrangementer kan ta en hel dag.",
  },
  {
    question: "Får jeg alle bildene?",
    answer:
      "Du får redigerte high-resolution bilder levert digitalt. Antall bilder avhenger av pakken du velger. Jeg tar ut et utvalg av de beste bildene fra sessionen.",
  },
  {
    question: "Hva koster en fotosession?",
    answer:
      "Prisene varierer avhengig av type session og varighet. Ta gjerne kontakt for en uforpliktende prisoversikt tilpasset ditt ønske.",
  },
  {
    question: "Hvordan bestiller jeg?",
    answer:
      "Send meg en melding via kontaktskjemaet eller ring meg direkte. Vi finner en tid som passer begge parter.",
  },
]

export function FAQ() {
  return (
    <>
        <h1 className="text-3xl font-extrabold lg:text-4xl mb-6">
          Ofte stilte spørsmål
        </h1>
        <Accordion
          type="single"
          collapsible
          className="w-full rounded-lg border border-border bg-white"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b px-4 last:border-b-0"
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
    </>
  )
}
