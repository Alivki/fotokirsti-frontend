"use client"

import { Separator } from "@/components/ui/separator"
import FileUpload from "@/components/admin/FileUpload"
import ImageUploadForm from "@/components/admin/ImageUploadForm"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import { useState } from "react"
import {
    imageFormSchema,
    type ImageFormValues,
    type PhotoForm,
} from "@/types/photos"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { getUploadUrls, deletePhoto, createPhotos } from "@/services/photos"
import { useUploadPhotos, toPresignedUrl } from "@/hooks/useUploadPhotos"

export default function Page() {
    const [photos, setPhotos] = useState<PhotoForm[]>([])
    const [fieldErrorsByIndex, setFieldErrorsByIndex] = useState<
        Record<number, Record<string, string>>
    >({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { progress, isUploading, uploadFiles } = useUploadPhotos()

    const handleFileSelect = async (files: File[]) => {
        if (files.length === 0) return
        let urls: Awaited<ReturnType<typeof getUploadUrls>>
        try {
            urls = await getUploadUrls(
                files.map((f) => ({ name: f.name, type: f.type }))
            )
        } catch (err) {
            console.error("Get upload URLs failed", err)
            toast.error(
                err instanceof Error ? err.message : "Kunne ikke forberede opplasting. Sjekk tilkoblingen og prøv igjen."
            )
            return
        }
        const presignedUrls = urls.map(toPresignedUrl)
        const newPhotos = files.map((file, i) =>
            ({
                file,
                preview: URL.createObjectURL(file),
                id: urls[i].fileId,
                s3Key: urls[i].s3Key,
                title: "",
                alt: "",
                published: true,
                category: undefined,
                hasPrize: false,
                prizeTitle: "",
                prizeMedal: undefined,
            }) as unknown as PhotoForm
        )
        setPhotos((prev) => [...prev, ...newPhotos])
        try {
            await uploadFiles(files, presignedUrls)
            toast.success(
                files.length === 1
                    ? "Bilde lastet opp til S3"
                    : `${files.length} bilder lastet opp til S3`
            )
        } catch (err) {
            console.error("Upload to S3 failed", err)
            toast.error(
                err instanceof Error ? err.message : "Kunne ikke laste opp filer til S3. Prøv igjen."
            )
        }
    }

    const removePhoto = async (index: number) => {
        const photo = photos[index]
        setPhotos((prev) => {
            const updated = [...prev]
            URL.revokeObjectURL(updated[index].preview)
            updated.splice(index, 1)
            return updated
        })
        setFieldErrorsByIndex((prev) => {
            const next: Record<number, Record<string, string>> = {}
            Object.entries(prev).forEach(([key, value]) => {
                const i = Number(key)
                if (i < index) next[i] = value
                if (i > index) next[i - 1] = value
            })
            return next
        })
        if (photo.id) {
            try {
                await deletePhoto(photo.id)
                toast.success("Bilde slettet")
            } catch (err) {
                console.error("Delete photo failed", err)
                toast.error(
                    "Kunne ikke slette bildet fra server. Det må fjernes manuelt.",
                    { duration: 6000 }
                )
            }
        }
    }

    const handleBlurUpdates = (index: number, values: ImageFormValues) => {
        setPhotos((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], ...values }
            return updated
        })
        setFieldErrorsByIndex((prev) => {
            const next = { ...prev }
            delete next[index]
            return next
        })
    }

    const handleSubmit = async () => {
        const newFieldErrors: Record<number, Record<string, string>> = {}
        photos.forEach((photo, i) => {
            const result = imageFormSchema.safeParse(photo)
            if (!result.success) {
                const byField: Record<string, string> = {}
                result.error.issues.forEach((issue) => {
                    const path = issue.path[0]
                    if (typeof path === "string") {
                        byField[path] = issue.message
                    }
                })
                newFieldErrors[i] = byField
            }
        })

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrorsByIndex(newFieldErrors)
            return
        }

        const count = photos.length
        setIsSubmitting(true)
        try {
            await createPhotos(
                photos.map((p) => ({
                    id: p.id!,
                    s3Key: p.s3Key!,
                    title: p.title ?? null,
                    alt: p.alt ?? null,
                    published: p.published,
                    category: p.category ?? null,
                    hasPrize: p.hasPrize,
                    prizeTitle: p.prizeTitle ?? null,
                    prizeMedal: p.prizeMedal ?? null,
                }))
            )
            setPhotos([])
            setFieldErrorsByIndex({})
            toast.success("Opplasting vellykket", {
                description: `${count} ${count === 1 ? "bildet" : "bilder"} ble lagret`,
            })
        } catch (err: unknown) {
            console.error("Create photos failed", err)
            const ax = err && typeof err === "object" && "response" in err
                ? (err as { response?: { data?: unknown }; message?: string })
                : null
            const data = ax?.response?.data
            const dataStr =
                typeof data === "string"
                    ? data
                    : typeof data === "object" && data !== null
                        ? [data as Record<string, unknown>].flatMap((o) =>
                            ["message", "error", "detail"].map((k) => (o[k] != null ? String(o[k]) : ""))
                        ).join(" ")
                        : ""
            const message = dataStr || (err instanceof Error ? err.message : "")
            const isDuplicate =
                /duplicate|23505|already exists/i.test(message) ||
                (err instanceof Error && /duplicate|23505|already exists/i.test(err.message))
            if (isDuplicate) {
                setPhotos([])
                setFieldErrorsByIndex({})
                toast.warning("Bildene var allerede lagret", {
                    description: "Listen er tømt. Du kan laste opp nye bilder.",
                })
            } else {
                toast.error(
                    message && message.length < 200 ? message : "Kunne ikke lagre bildene. Prøv igjen."
                )
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <div className="font-medium text-sidebar-primary">Legg til bilder</div>
                </div>
            </header>


            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <FileUpload type={"dropzone"} onFiles={handleFileSelect} variant={"image"}/>


                {photos.length > 0 && (
                    <div className="space-y-0">
                        <div className={cn("grid gap-2 md:gap-4", photos.length === 1 ? "md:grid-cols-1" : "lg:grid-cols-2")}>
                            {photos.map((photo, index) => (
                                <div key={photo.id ?? index} className="w-full bg-tertiary flex flex-col border-border border rounded-lg shadow overflow-hidden">
                                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-3 p-8 pb-6">
                                        <div className="h-auto w-full sm:h-32 sm:w-32 aspect-square rounded-lg shrink-0">
                                            <Image
                                                src={photo.preview}
                                                alt={photo.alt || "images from fotokirsti"}
                                                height={520}
                                                width={520}
                                                className="object-cover aspect-square rounded-lg"
                                            />
                                        </div>
                                        <div className="w-full flex flex-col gap-4 min-w-0">
                                            <div className="flex flex-row items-center justify-between w-full">
                                                <p className="text-lg font-medium text-foreground">Legg inn bildeinfo</p>
                                                <Button
                                                    onClick={() => removePhoto(index)}
                                                    variant="ghostIcon"
                                                    size="icon-sm-square"
                                                    disabled={isUploading}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                            <ImageUploadForm
                                                index={index}
                                                initialValues={photo}
                                                onBlurUpdates={handleBlurUpdates}
                                                fieldErrors={fieldErrorsByIndex[index]}
                                            />
                                        </div>
                                    </div>
                                    {photo.id && progress[photo.id] != null && (
                                        <div className="w-full">
                                            <p className="text-base font-medium text-foreground pl-8 pt-0 pb-1">
                                                {Math.round(progress[photo.id])}%
                                            </p>
                                            <div className="w-full h-3 overflow-hidden bg-muted rounded-b-lg">
                                                <div
                                                    className="h-full bg-green-500 transition-[width] duration-300 rounded-bl-lg"
                                                    style={{
                                                        width: `${progress[photo.id]}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {photos.length > 0 && (
                    <Button
                        isLoading={isSubmitting}
                        disabled={isUploading || isSubmitting}
                        onClick={handleSubmit}
                        size="xsm"
                        variant="primary"
                        className="w-full"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Last opp {photos.length} {photos.length === 1 ? "bildet" : "bilder"}
                    </Button>
                )}
            </div>
        </div>
    )
}