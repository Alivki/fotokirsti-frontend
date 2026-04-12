import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/config"
import { contactRequestSchema } from "@/validation/contactSchema"

export async function POST(request: NextRequest) {
  const apiKey = process.env.CONTACT_EMAIL_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { message: "E-post-tjenesten er ikke konfigurert" },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch (err) {
    console.error("Contact route: invalid JSON", err)
    return NextResponse.json({ message: "Ugyldig JSON" }, { status: 400 })
  }

  const parsed = contactRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Manglende eller ugyldige felt" },
      { status: 400 }
    )
  }

  const res = await fetch(`${API_BASE_URL}/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(parsed.data),
  })

  const data = await res.json().catch(() => ({}))
  const status = res.status

  if (!res.ok) {
    const message = (data as { message?: string })?.message ?? res.statusText
    return NextResponse.json({ message }, { status })
  }

  return NextResponse.json(data)
}
