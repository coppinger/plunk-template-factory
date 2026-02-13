import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0c0f",
          borderRadius: 32,
        }}
      >
        <svg
          width="120"
          height="120"
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
    ),
    { ...size }
  );
}
