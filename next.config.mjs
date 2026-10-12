import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self)" },
];

export default {
  poweredByHeader: false,
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  devIndicators: false,
  outputFileTracingRoot: __dirname,
  async headers() { return [{ source: "/(.*)", headers: securityHeaders }]; },
};
