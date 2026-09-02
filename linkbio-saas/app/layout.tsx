import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "رابطك | LinkBio", template: "%s | رابطك" },
  description: "أنشئ صفحة واحدة تجمع روابطك ومنتجاتك وخدماتك وواتساب.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
