"use client"

import { createFormHookContexts, createFormHook } from "@tanstack/react-form"
import { CheckboxField } from "@/components/form/checkbox-field"
import { PasswordField } from "@/components/form/password-field"
import { SelectField } from "@/components/form/select-field"
import { TextField } from "@/components/form/text-field"
import { SubmitButton } from "@/components/form/submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
    createFormHookContexts()

const formHookApi = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        InputField: TextField,
        PasswordField,
        SelectField,
        CheckboxField,
    },
    formComponents: {
        SubmitButton,
    },
})

export const useAppForm = formHookApi.useAppForm
