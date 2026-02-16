import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Fotograf Kirsti Hovde – Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #262626 100%)",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
          }}
        >
          Fotograf Kirsti Hovde
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Portfolio – Innlandet & Lillehammer
        </div>
      </div>
    ),
    { ...size }
  )
}
