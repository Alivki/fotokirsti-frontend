"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFieldContext } from "@/components/form/form-context"

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  placeholder?: string
  options: SelectOption[]
  /** Error message from parent (e.g. schema validation) – shown like validator errors with red border */
  externalError?: string
}

export function SelectField({
  label,
  placeholder,
  options,
  externalError,
}: SelectFieldProps) {
  const field = useFieldContext<string | undefined | null>()
  const validatorErrors = field.state.meta.errors
    .map((e) =>
      typeof e === "string" ? e : (e as { message?: string })?.message ?? ""
    )
    .filter(Boolean)
  const hasError =
    (field.state.meta.isTouched && validatorErrors.length > 0) || !!externalError
  const errorMessage = externalError ?? validatorErrors.join(", ")
  const value = field.state.value ?? ""

  return (
    <Field data-invalid={hasError || undefined}>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(val) => field.handleChange(val)}
        onOpenChange={(open) => {
          if (!open) field.handleBlur()
        }}
      >
        <SelectTrigger aria-invalid={hasError || undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && errorMessage && (
        <FieldError>{errorMessage}</FieldError>
      )}
    </Field>
  )
}
