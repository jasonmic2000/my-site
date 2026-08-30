import { ImageResponse } from "next/og";
import { DEFAULT_METADATA } from "@/lib/consts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = DEFAULT_METADATA.title;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#18181B",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 800,
            color: "#D4D4D8",
          }}
        >
          <span>Jason&nbsp;</span>
          <span style={{ color: "#fb7185" }}>Michael</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            color: "#A1A1AA",
          }}
        >
          {DEFAULT_METADATA.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
