"use client"

import { useAppForm } from "@/components/form/form-context"
import type { SelectOption } from "@/components/form/select-field"
import type { ImageFormValues, PhotoForm } from "@/types/photos"

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "Barn", label: "Barn" },
  { value: "Familie", label: "Familie" },
  { value: "Portrett", label: "Portrett" },
  { value: "Konfirmant", label: "Konfirmant" },
  { value: "Bryllup", label: "Bryllup" },
  { value: "Produkt", label: "Produkt" },
  { value: "Reklame", label: "Reklame" },
]

const MEDAL_OPTIONS: SelectOption[] = [
  { value: "Gull", label: "🥇 Gull" },
  { value: "Sølv", label: "🥈 Sølv" },
  { value: "Bronse", label: "🥉 Bronse" },
  { value: "Hederlig omtale", label: "Hederlig Omtale" },
]

export interface ImageUploadFormProps {
  index: number
  initialValues: PhotoForm
  onBlurUpdates: (index: number, values: ImageFormValues) => void
  /** Per-field errors from schema validation (e.g. on submit) – shown under each input with red border */
  fieldErrors?: Record<string, string>
}

export default function ImageUploadForm({
  index,
  initialValues,
  onBlurUpdates,
  fieldErrors,
}: ImageUploadFormProps) {
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }: { value: ImageFormValues }) => {
      onBlurUpdates(index, value)
    },
  })

  const syncToParent = () => {
    onBlurUpdates(index, form.state.values)
  }

  return (
    <form
      id={`image-upload-form-${index}`}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-5"
    >
      <div onBlur={syncToParent}>
        <form.AppField
          name="title"
          validators={{
            onChange: ({ value }: { value: string | null | undefined }) => {
              if (!value || !String(value).trim()) {
                return "Du må fylle inn tittel"
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <field.InputField
              label="Tittel på bildet"
              placeholder="Tittel på bildet"
              externalError={fieldErrors?.title}
            />
          )}
        </form.AppField>
      </div>

      <div onBlur={syncToParent}>
        <form.AppField
          name="alt"
          validators={{
            onChange: ({ value }: { value: string | null | undefined }) => {
              if (!value || !String(value).trim()) {
                return "Du må fylle inn beskrivelse/alt-tekst"
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <field.InputField
              label="Kort beskrivelse (alt)"
              placeholder="Kort beskrivelse"
              externalError={fieldErrors?.alt}
            />
          )}
        </form.AppField>
      </div>

      <div onBlur={syncToParent}>
        <form.AppField
          name="category"
          validators={{
            onChange: ({ value }: { value: string | null | undefined }) => {
              if (!value) {
                return "Du må velge kategori"
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <field.SelectField
              label="Kategori"
              placeholder="Velg kategori"
              options={CATEGORY_OPTIONS}
              externalError={fieldErrors?.category}
            />
          )}
        </form.AppField>
      </div>

      <div onBlur={syncToParent}>
        <form.AppField name="hasPrize">
          {(field) => (
            <field.CheckboxField
              label="Har pris?"
              externalError={fieldErrors?.hasPrize}
            />
          )}
        </form.AppField>
      </div>

      <form.Subscribe selector={(state) => state.values.hasPrize}>
        {(hasPrize) =>
          hasPrize && (
            <>
              <div onBlur={syncToParent}>
                <form.AppField
                  name="prizeTitle"
                  validators={{
                    onChange: ({
                      value,
                    }: {
                      value: string | null | undefined
                    }) => {
                      if (!value || !String(value).trim()) {
                        return "Du må legge inn pris-tittel"
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <field.InputField
                      label="Pris-tittel"
                      placeholder="Tittel på prisen"
                      externalError={fieldErrors?.prizeTitle}
                    />
                  )}
                </form.AppField>
              </div>
              <div onBlur={syncToParent}>
                <form.AppField
                  name="prizeMedal"
                  validators={{
                    onChange: ({
                      value,
                    }: {
                      value: string | null | undefined
                    }) => {
                      if (!value) {
                        return "Du må velge medalje"
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <field.SelectField
                      label="Medalje"
                      placeholder="Velg medalje"
                      options={MEDAL_OPTIONS}
                      externalError={fieldErrors?.prizeMedal}
                    />
                  )}
                </form.AppField>
              </div>
            </>
          )
        }
      </form.Subscribe>
    </form>
  )
}
