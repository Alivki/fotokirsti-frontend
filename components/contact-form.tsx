"use client"

import { useAppForm } from "@/components/form/form-context"
import type { SelectOption } from "@/components/form/select-field"

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "barn", label: "Barn" },
  { value: "familie", label: "Familie" },
  { value: "portrett", label: "Portrett" },
  { value: "konfirmant", label: "Konfirmant" },
  { value: "bryllup", label: "Bryllup" },
  { value: "produkt", label: "Produkt" },
  { value: "reklame", label: "Reklame" },
]

interface ContactFormValues {
  name: string
  email: string
  phone: string
  category: string
  message: string
}

export function ContactForm() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
      message: "",
    },
    onSubmit: async ({ value }: { value: ContactFormValues }) => {
      // Placeholder – wire to contact API when available
      console.log("Contact form submitted:", value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.AppField
        name="name"
        validators={{
          onChange: ({ value }: { value: string }) => {
            if (!value?.trim()) return "Navn er påkrevd"
            return undefined
          },
        }}
      >
        {(field) => (
          <field.InputField
            label="Navn"
            placeholder="Ditt navn"
          />
        )}
      </form.AppField>

      <form.AppField
        name="email"
        validators={{
          onChange: ({ value }: { value: string }) => {
            if (!value?.trim()) return "E-post er påkrevd"
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return "Ugyldig e-postadresse"
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <field.InputField
            label="E-post"
            type="email"
            placeholder="din@epost.no"
          />
        )}
      </form.AppField>

      <form.AppField name="phone">
        {(field) => (
          <field.InputField
            label="Telefon"
            type="tel"
            prefix="+47"
            placeholder="123 45 678"
          />
        )}
      </form.AppField>

      <form.AppField name="category">
        {(field) => (
          <field.SelectField
            label="Kategori"
            placeholder="Velg kategori"
            options={CATEGORY_OPTIONS}
          />
        )}
      </form.AppField>

      <form.AppField
        name="message"
        validators={{
          onChange: ({ value }: { value: string }) => {
            if (!value?.trim()) return "Melding er påkrevd"
            return undefined
          },
        }}
      >
        {(field) => (
          <field.TextareaField
            label="Melding"
            description="Skriv litt om hva slags bilder dere har lyst på, og når det passer for dere."
            placeholder="Skriv din melding her..."
            rows={4}
            showWordCount
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label="Send melding" />
      </form.AppForm>
    </form>
  )
}
