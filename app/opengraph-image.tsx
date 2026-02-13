import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Plunk Template Factory — Visual editor for Supabase Auth email templates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const dmSansBold = await fetch(
    new URL(
      "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-700-normal.ttf"
    )
  ).then((res) => res.arrayBuffer());

  const dmSansRegular = await fetch(
    new URL(
      "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-400-normal.ttf"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0c0f",
          fontFamily: "DM Sans",
          padding: 80,
        }}
      >
        {/* Top decorative border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #0c0c0f, #d4943c, #0c0c0f)",
          }}
        />

        {/* Envelope icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg
            width="64"
            height="56"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="3"
              width="22"
              height="16"
              rx="2"
              stroke="#d4943c"
              strokeWidth="2"
            />
            <path
              d="M3 5 L12 13 L21 5"
              stroke="#d4943c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="3"
              y1="17"
              x2="9"
              y2="12"
              stroke="#d4943c"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="17"
              x2="15"
              y2="12"
              stroke="#d4943c"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#e8e8ec",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Plunk Template Factory
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#8c8c94",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Visual editor for Supabase Auth email templates
        </div>

        {/* Decorative template shapes */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 160,
                height: 100,
                borderRadius: 8,
                border: "1px solid #2a2a2f",
                backgroundColor: "#161619",
                display: "flex",
                flexDirection: "column",
                padding: 12,
                gap: 8,
              }}
            >
              <div
                style={{
                  width: "60%",
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 2 ? "#d4943c" : "#2a2a2f",
                }}
              />
              <div
                style={{
                  width: "80%",
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#2a2a2f",
                }}
              />
              <div
                style={{
                  width: "40%",
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#2a2a2f",
                }}
              />
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#d4943c",
            fontWeight: 400,
          }}
        >
          plunktemplates.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "DM Sans",
          data: dmSansRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "DM Sans",
          data: dmSansBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
