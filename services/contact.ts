export interface SendContactEmailPayload {
  firstName: string
  email: string
  phone_number: string
  category: string
  message: string
}

export async function sendContactEmail(
  payload: SendContactEmailPayload
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const message =
        (data as { message?: string })?.message ?? res.statusText ?? "Kunne ikke sende melding"
      return { success: false, error: message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Nettverksfeil"
    return { success: false, error: message }
  }
}
