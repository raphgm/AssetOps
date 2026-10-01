import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0b0d", surface: "#101216", raised: "#15181d", line: "#22262d", line2: "#2e333c",
        fg: "#e8eaed", mute: "#9aa1ab", dim: "#6b7280",
        accent: "#5eead4", accent2: "#2dd4bf",
        ok: "#4ade80", warn: "#fbbf24", bad: "#f87171", info: "#7aa2ff",
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"] },
      keyframes: { rise: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } }, pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } } },
      animation: { rise: "rise .35s ease-out both", dot: "pulseDot 2s ease-in-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
