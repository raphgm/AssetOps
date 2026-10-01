import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "AssetOps — ICT Maintenance Intelligence Platform",
  description: "AssetOps centralizes ICT equipment maintenance, work orders, asset history, vendors and operational intelligence in one platform.",
  openGraph: { title: "AssetOps — ICT Maintenance Intelligence Platform", description: "Turn maintenance history into operational intelligence.", type: "website", siteName: "AssetOps" },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
