import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import I18nProvider from "@/components/i18n-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MVP Cost Estimation",
  description: "Точная оценка стоимости MVP в считанные минуты",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get language from cookie or default to English
  const cookieStore = cookies();
  const lang = cookieStore.get("i18next")?.value || "en";
  const dir = lang === "ar" ? "rtl" : "ltr"; // For future RTL language support

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
        <Script id="i18n-config" strategy="beforeInteractive">
          {`window.i18nextConfig = { lng: "${lang}" };`}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
