"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircleIcon, UserIcon, KeyRound } from "lucide-react"
import { useAppForm } from "@/components/form/form-context"
import { useLogin } from "@/services/auth"

interface LoginFormValues {
  username: string
  password: string
}

export function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? undefined
  const login = useLogin(from)

  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }: { value: LoginFormValues }) => {
      setLoginError(null)
      const { error } = await login(value.username, value.password)
      if (error) setLoginError(error)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Log in</CardTitle>
        <CardDescription>
          Skriv inn brukernavn og passord for å komme til admin siden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-5"
        >
          <form.AppField
            name="username"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.trim().length === 0) {
                  return "Må fylle inn brukernavn"
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <field.InputField
                label="Brukernavn"
                placeholder="Skriv in brukernavn"
                icon={<UserIcon className="size-4" />}
              />
            )}
          </form.AppField>

          <form.AppField
            name="password"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.length === 0) {
                  return "Må fylle inn passord"
                }
                if (value.length < 6) {
                  return "Passord må være minst 6 karakter langt"
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <field.PasswordField
                label="Passord"
                placeholder="Fyll inn passord"
                icon={<KeyRound className="size-4" />}
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton label="Log in" />
          </form.AppForm>
        </form>

        {loginError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Log in feilet</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
