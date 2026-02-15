"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {useFormContext} from "@/components/form/form-context";

interface SubmitButtonProps {
    label: string
}

export function SubmitButton({ label }: SubmitButtonProps) {
    const form = useFormContext()

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Spinner className="mr-2" />}
                    {label}
                </Button>
            )}
        </form.Subscribe>
    )
}
