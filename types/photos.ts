import { z } from "zod"
import { photoUploadSchema } from "@/validation/photoSchemas"

/** Single schema for image/photo upload – use everywhere (forms, validation, API). */
export const imageFormSchema = photoUploadSchema

/** Inferred form values type for image upload (title, alt, category, prize, etc.). */
export type ImageFormValues = z.infer<typeof imageFormSchema>

/** UI state for one photo (form values + file, preview, optional id/s3Key). */
export interface PhotoForm extends ImageFormValues {
  id?: string
  s3Key?: string
}