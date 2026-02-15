"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { useFieldContext } from "@/components/form/form-context"

interface CheckboxFieldProps {
  label: string
  description?: string
  /** Error message from parent (e.g. schema validation) – shown like validator errors */
  externalError?: string
}

export function CheckboxField({
  label,
  description,
  externalError,
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const validatorErrors = field.state.meta.errors
    .map((e) =>
      typeof e === "string" ? e : (e as { message?: string })?.message ?? ""
    )
    .filter(Boolean)
  const hasError =
    (field.state.meta.isTouched && validatorErrors.length > 0) || !!externalError
  const errorMessage = externalError ?? validatorErrors.join(", ")

  return (
    <Field data-invalid={hasError || undefined} orientation="horizontal">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.name}
            checked={field.state.value}
            onCheckedChange={(checked) =>
              field.handleChange(checked === true)}
            onBlur={field.handleBlur}
            aria-invalid={hasError || undefined}
          />
          <FieldLabel htmlFor={field.name} className="!mb-0 cursor-pointer">
            {label}
          </FieldLabel>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        {hasError && errorMessage && (
          <FieldError>{errorMessage}</FieldError>
        )}
      </div>
    </Field>
  )
}
