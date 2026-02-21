import { NextRequest, NextResponse } from "next/server"

const backendBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"

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
  } catch {
    return NextResponse.json(
      { message: "Ugyldig JSON" },
      { status: 400 }
    )
  }

  const payload = body as Record<string, unknown>
  const { firstName, email, phone_number, category, message } = payload

  if (
    typeof firstName !== "string" ||
    typeof email !== "string" ||
    typeof phone_number !== "string" ||
    typeof category !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json(
      { message: "Manglende eller ugyldige felt" },
      { status: 400 }
    )
  }

  const res = await fetch(`${backendBase}/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      firstName,
      email,
      phone_number,
      category,
      message,
    }),
  })

  const data = await res.json().catch(() => ({}))
  const status = res.status

  if (!res.ok) {
    const message = (data as { message?: string })?.message ?? res.statusText
    return NextResponse.json({ message }, { status })
  }

  return NextResponse.json(data)
}
