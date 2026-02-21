"use client"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useFieldContext } from "@/components/form/form-context"

function countWords(text: string): number {
  if (!text?.trim()) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

interface TextareaFieldProps {
  label: string
  placeholder?: string
  rows?: number
  description?: string
  showWordCount?: boolean
  maxWords?: number
  /** Error message from parent (e.g. schema validation) */
  externalError?: string
}

export function TextareaField({
  label,
  placeholder,
  rows = 4,
  description,
  showWordCount = false,
  maxWords = 50,
  externalError,
}: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const validatorErrors = field.state.meta.errors
    .map((e) =>
      typeof e === "string" ? e : (e as { message?: string })?.message ?? ""
    )
    .filter(Boolean)
  const hasError =
    (field.state.meta.isTouched && validatorErrors.length > 0) || !!externalError
  const errorMessage = externalError ?? validatorErrors.join(", ")
  const wordCount = countWords(field.state.value)

  return (
    <Field data-invalid={hasError || undefined}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup className="min-h-0 has-[>textarea]:h-auto">
        <InputGroupTextarea
          placeholder={placeholder}
          rows={rows}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={hasError || undefined}
        />
        {showWordCount && (
          <InputGroupAddon align="block-end">
            <InputGroupText className="tabular-nums">
              {wordCount} / {maxWords} ord
            </InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && (
        <FieldDescription className="mt-1.5">{description}</FieldDescription>
      )}
      {hasError && errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  )
}
