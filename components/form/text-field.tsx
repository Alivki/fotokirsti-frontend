"use client"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon, InputGroupText,
} from "@/components/ui/input-group"
import {useFieldContext} from "@/components/form/form-context";

interface TextFieldProps {
  label: string
  placeholder?: string
  type?: string
  icon?: React.ReactNode
  /** Prefix addon (e.g. "+47" for phone) – shown in InputGroupAddon */
  prefix?: React.ReactNode
  /** Error message from parent (e.g. schema validation) – shown like validator errors with red border */
  externalError?: string
}

export function TextField({
  label,
  placeholder,
  type = "text",
  icon,
  prefix,
  externalError,
}: TextFieldProps) {
  const field = useFieldContext<string>()
  const validatorErrors = field.state.meta.errors
    .map((e) => (typeof e === "string" ? e : (e as { message?: string })?.message ?? ""))
    .filter(Boolean)
  const hasError =
    (field.state.meta.isTouched && validatorErrors.length > 0) || !!externalError
  const errorMessage = externalError ?? validatorErrors.join(", ")

  return (
    <Field data-invalid={hasError || undefined}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        {(icon || prefix) && (
          <InputGroupAddon align="inline-start">
            <InputGroupText>{icon ?? prefix}</InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupInput
          type={type}
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={hasError || undefined}
        />
      </InputGroup>
      {hasError && errorMessage && (
        <FieldError>{errorMessage}</FieldError>
      )}
    </Field>
  )
}
