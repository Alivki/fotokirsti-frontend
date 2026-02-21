"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAppForm } from "@/components/form/form-context"
import type { SelectOption } from "@/components/form/select-field"
import { sendContactEmail } from "@/services/contact"
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/validation/contactSchema"

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "barn", label: "Barn" },
  { value: "familie", label: "Familie" },
  { value: "portrett", label: "Portrett" },
  { value: "konfirmant", label: "Konfirmant" },
  { value: "bryllup", label: "Bryllup" },
  { value: "produkt", label: "Produkt" },
  { value: "reklame", label: "Reklame" },
]

function mapZodErrors(
  issues: { path: (string | number)[]; message: string }[]
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const i of issues) {
    const key = String(i.path[0])
    if (key && !out[key]) out[key] = i.message
  }
  return out
}

export function ContactForm() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
      message: "",
    },
    onSubmit: async ({
      value,
    }: {
      value: Record<string, string>
    }) => {
      setFieldErrors({})
      const parsed = contactFormSchema.safeParse({
        name: value.name,
        email: value.email,
        phone: value.phone,
        category: value.category,
        message: value.message,
      })
      if (!parsed.success) {
        setFieldErrors(mapZodErrors(parsed.error.issues))
        return
      }
      const data = parsed.data
      const result = await sendContactEmail({
        firstName: data.name,
        email: data.email,
        phone_number: data.phone.trim(),
        category: data.category,
        message: data.message,
      })
      if (result.success) {
        toast.success("Meldingen din er sendt. Takk!")
        setFieldErrors({})
        form.reset()
      } else {
        toast.error(result.error)
      }
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
            externalError={fieldErrors.name}
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
            externalError={fieldErrors.email}
          />
        )}
      </form.AppField>

      <form.AppField
        name="phone"
        validators={{
          onChange: ({ value }: { value: string }) => {
            const digits = value?.replace(/\D/g, "") ?? ""
            if (!value?.trim()) return "Telefon er påkrevd"
            if (
              digits.length !== 8 &&
              !(digits.startsWith("47") && digits.length === 10)
            ) {
              return "Ugyldig telefonnummer. Bruk 8 siffer (f.eks. 123 45 678)"
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <field.InputField
            label="Telefon"
            type="tel"
            prefix="+47"
            placeholder="123 45 678"
            externalError={fieldErrors.phone}
          />
        )}
      </form.AppField>

      <form.AppField
        name="category"
        validators={{
          onChange: ({ value }: { value: string }) => {
            if (!value?.trim()) return "Kategori er påkrevd"
            return undefined
          },
        }}
      >
        {(field) => (
          <field.SelectField
            label="Kategori"
            placeholder="Velg kategori"
            options={CATEGORY_OPTIONS}
            externalError={fieldErrors.category}
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
            externalError={fieldErrors.message}
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
