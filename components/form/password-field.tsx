"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton, InputGroupText,
} from "@/components/ui/input-group"
import {useFieldContext} from "@/components/form/form-context";

interface PasswordFieldProps {
    label: string
    placeholder?: string
    icon?: React.ReactNode
}

export function PasswordField({ label, placeholder, icon }: PasswordFieldProps) {
    const field = useFieldContext<string>()
    const [showPassword, setShowPassword] = useState(false)

    const hasError =
        field.state.meta.isTouched &&
        field.state.meta.errors.length > 0

    return (
        <Field data-invalid={hasError || undefined}>
            <FieldLabel>{label}</FieldLabel>
            <InputGroup>
                {icon && (
                    <InputGroupAddon align="inline-start">
                        <InputGroupText>{icon}</InputGroupText>
                    </InputGroupAddon>
                )}
                <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={hasError || undefined}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOffIcon className="size-4 text-muted-foreground" />
                        ) : (
                            <EyeIcon className="size-4 text-muted-foreground" />
                        )}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            {hasError && (
                <FieldError>
                    {field.state.meta.errors.map((e) => (typeof e === "string" ? e : (e as { message?: string })?.message ?? "")).join(", ")}
                </FieldError>
            )}
        </Field>
    )
}
