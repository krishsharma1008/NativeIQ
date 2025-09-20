import "@nativeiq/ui/styles/tokens.css";
import "@nativeiq/ui/styles/base.css";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NativeIQ Dashboard",
  description: "Operational intelligence and automation for modern revenue teams"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
