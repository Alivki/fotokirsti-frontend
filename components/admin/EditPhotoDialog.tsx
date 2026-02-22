"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  updatePhoto,
  PHOTOS_QUERY_KEY,
  type PhotoWithUrl,
  type UpdatePhotoPayload,
} from "@/services/photos"

const CATEGORIES = [
  "Barn",
  "Familie",
  "Portrett",
  "Konfirmant",
  "Bryllup",
  "Produkt",
  "Reklame",
] as const

const MEDALS = [
  { value: "Gull", label: "🥇 Gull" },
  { value: "Sølv", label: "🥈 Sølv" },
  { value: "Bronse", label: "🥉 Bronse" },
  { value: "Hederlig omtale", label: "Hederlig Omtale" },
] as const

interface EditPhotoDialogProps {
  photo: PhotoWithUrl | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPhotoDialog({
  photo,
  open,
  onOpenChange,
}: EditPhotoDialogProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<UpdatePhotoPayload>({
    title: "",
    alt: "",
    category: null,
    published: true,
    hasPrize: false,
    prizeTitle: null,
    prizeMedal: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (photo) {
      const cat = photo.category
      const validCategory =
        cat && CATEGORIES.includes(cat as (typeof CATEGORIES)[number])
          ? (cat as (typeof CATEGORIES)[number])
          : null
      setForm({
        title: photo.title ?? "",
        alt: photo.alt ?? "",
        category: validCategory,
        published: photo.published ?? true,
        hasPrize: photo.hasPrize ?? !!(photo.prizeTitle || photo.prizeMedal),
        prizeTitle: photo.prizeTitle ?? null,
        prizeMedal: photo.prizeMedal ?? null,
      })
      setErrors({})
    }
  }, [photo])

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePhotoPayload }) =>
      updatePhoto(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_QUERY_KEY })
      toast.success("Endringene ble lagret")
      onOpenChange(false)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Kunne ikke lagre")
    },
  })

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.title?.trim()) next.title = "Du må fylle inn tittel"
    if (!form.alt?.trim()) next.alt = "Du må fylle inn beskrivelse/alt-tekst"
    if (!form.category) next.category = "Du må velge kategori"
    if (form.hasPrize) {
      if (!form.prizeTitle?.trim()) next.prizeTitle = "Du må legge inn pris-tittel"
      if (!form.prizeMedal) next.prizeMedal = "Du må velge medalje"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!photo || !validate()) return
    updateMutation.mutate({ id: photo.id, payload: form })
  }

  const dateValue = photo?.createdAt ?? (photo as { uploadedAt?: string } | null)?.uploadedAt
  const uploadDate = dateValue ?? null

  if (!photo) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-description="Dialog to edit photo information"
        className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-lg bg-white p-0 sm:w-full sm:max-w-2xl"
      >
        <DialogHeader className="flex-shrink-0 border-b px-4 py-3 sm:px-6">
          <DialogTitle>Rediger bildeinformasjon</DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-6 pt-4">
          <div className="px-4 ">
            <div className="relative w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={(photo.imageUrl ?? photo.previewUrl) ?? ""}
                alt={photo.alt ?? photo.title ?? "Bilde"}
                width={1920}
                height={1440}
                unoptimized
                className="block w-full h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
            <Field data-invalid={!!errors.title}>
              <FieldLabel>Tittel på bildet</FieldLabel>
              <Input
                value={form.title ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Tittel på bildet"
              />
              {errors.title && <FieldError>{errors.title}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.alt}>
              <FieldLabel>Kort beskrivelse (alt)</FieldLabel>
              <Input
                value={form.alt ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                placeholder="Kort beskrivelse"
              />
              {errors.alt && <FieldError>{errors.alt}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.category}>
              <FieldLabel>Kategori</FieldLabel>
              <Select
                value={form.category ?? ""}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    category: (v && CATEGORIES.includes(v as (typeof CATEGORIES)[number]))
                      ? (v as (typeof CATEGORIES)[number])
                      : null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Velg kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <FieldError>{errors.category}</FieldError>}
            </Field>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="published"
                  checked={form.published ?? false}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, published: !!c }))
                  }
                  className="mt-0.5"
                />
                <div>
                  <FieldLabel htmlFor="published" className="cursor-pointer font-medium">
                    Publisert
                  </FieldLabel>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Publiserte bilder vises i galleriet for besøkende. Avkryss for å skjule.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="hasPrize"
                  checked={form.hasPrize ?? false}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, hasPrize: !!c }))
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <FieldLabel htmlFor="hasPrize" className="cursor-pointer font-medium">
                    Har pris?
                  </FieldLabel>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Marker om bildet har vunnet en pris (f.eks. fra fotokonkurranser). Legg inn tittel og medalje under.
                  </p>
                  {form.hasPrize && (
                    <div className="mt-4 flex flex-col gap-4">
                      <Field data-invalid={!!errors.prizeTitle}>
                        <FieldLabel>Pris-tittel</FieldLabel>
                        <Input
                          value={form.prizeTitle ?? ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, prizeTitle: e.target.value }))
                          }
                          placeholder="Tittel på prisen"
                        />
                        {errors.prizeTitle && (
                          <FieldError>{errors.prizeTitle}</FieldError>
                        )}
                      </Field>
                      <Field data-invalid={!!errors.prizeMedal}>
                        <FieldLabel>Medalje</FieldLabel>
                        <Select
                          value={form.prizeMedal ?? ""}
                          onValueChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              prizeMedal: (v || null) as UpdatePhotoPayload["prizeMedal"],
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Velg medalje" />
                          </SelectTrigger>
                          <SelectContent>
                            {MEDALS.map((m) => (
                              <SelectItem key={m.value} value={m.value}>
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.prizeMedal && (
                          <FieldError>{errors.prizeMedal}</FieldError>
                        )}
                      </Field>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <DialogFooter className="flex flex-shrink-0 flex-col gap-5 border-t bg-background px-4 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
          <p className="order-2 text-sm text-muted-foreground sm:order-1">
            {uploadDate
              ? `Lastet opp: ${new Date(uploadDate as string).toLocaleDateString("nb-NO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}`
              : "Opplastingsdato ukjent"}
          </p>
          <div className="order-1 flex w-full flex-col gap-2 sm:order-2 sm:w-auto sm:flex-row">
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="xsm"
                className="min-w-auto"
              >
                Avbryt
              </Button>
            </DialogClose>
            <Button
              size="xsm"
              variant="primary"
              isLoading={updateMutation.isPending}
              onClick={handleSave}
              className="min-w-auto"
            >
              <Save className="mr-2 size-4 shrink-0" />
              Lagre endringer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
