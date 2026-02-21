import { z } from "zod"

/** Norwegian phone: 8 digits (or 11 with country code 47). Accepts spaces, dashes. */
export const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Telefon er påkrevd")
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, "")
      return digits.length === 8 || (digits.startsWith("47") && digits.length === 10)
    },
    { message: "Ugyldig telefonnummer. Bruk 8 siffer (f.eks. 123 45 678)" }
  )

export const contactCategoryEnum = z.enum([
  "barn",
  "familie",
  "portrett",
  "konfirmant",
  "bryllup",
  "produkt",
  "reklame",
])

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Navn er påkrevd"),
  email: z.string().trim().min(1, "E-post er påkrevd").email("Ugyldig e-postadresse"),
  phone: phoneNumberSchema,
  category: z
    .string()
    .min(1, "Kategori er påkrevd")
    .refine(
      (v): v is z.infer<typeof contactCategoryEnum> =>
        contactCategoryEnum.safeParse(v).success,
      { message: "Velg en gyldig kategori" }
    ),
  message: z.string().trim().min(1, "Melding er påkrevd"),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
