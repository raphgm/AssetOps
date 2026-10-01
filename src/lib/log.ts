type Level = "info" | "warn" | "error";
const emit = (level: Level, event: string, ctx?: Record<string, unknown>) => {
  // Structured JSON logs; never include secrets or request bodies.
  const line = JSON.stringify({ t: new Date().toISOString(), level, event, ...ctx });
  (level === "error" ? console.error : console.log)(line);
};
export const log = { info: (e: string, c?: Record<string, unknown>) => emit("info", e, c), warn: (e: string, c?: Record<string, unknown>) => emit("warn", e, c), error: (e: string, c?: Record<string, unknown>) => emit("error", e, c) };
