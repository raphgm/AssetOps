import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        surface: "#ffffff",
        raised: "#f8fafc",
        line: "#e2e8f0",
        line2: "#cbd5e1",
        fg: "#0f172a",
        mute: "#334155",
        dim: "#64748b",
        accent: "#0891b2",
        accent2: "#0e7490",
        ok: "#059669",
        warn: "#d97706",
        bad: "#e11d48",
        info: "#2563eb",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
      },
      animation: {
        rise: "rise .35s ease-out both",
        dot: "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
