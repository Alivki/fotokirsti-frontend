import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Fotograf Kirsti Hovde – Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fotokirsti-frontend-production.up.railway.app"

const GRID_IMAGES = [
  "/assets/exterior.jpg",
  "/assets/studio.png",
  "/assets/portrait.jpg",
  "/assets/landingpage.png",
]

export default function OpenGraphImage() {
  const logoUrl = `${siteUrl}/assets/logo-fotokirsti.png`
  const imageUrls = GRID_IMAGES.map((path) => `${siteUrl}${path}`)

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #262626 100%)",
        }}
      >
        {/* Header with logo and title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "40px 48px",
          }}
        >
          <img
            src={logoUrl}
            width={80}
            height={80}
            alt=""
            style={{ borderRadius: 12, objectFit: "cover" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>
              Fotograf Kirsti Hovde
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }}>
              Portfolio – Innlandet & Lillehammer
            </div>
          </div>
        </div>

        {/* Photo grid from public/assets */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: "0 48px 48px",
          }}
        >
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              width={268}
              height={268}
              alt=""
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
