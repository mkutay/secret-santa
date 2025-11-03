import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "next-themes";
import { type Metadata } from "next";
import "katex/dist/katex.min.css";

import {
  BookInsanity,
  IBMPlexMono,
  LibreBaskerville,
  Lora,
  MrEaves,
  NodestoCapsCondensed,
  ScalySans,
  ScalySansCaps,
  SolberaImitation,
  ZatannaMisdirection,
} from "@/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/utils/styling";
import { env } from "@/env";
import "@/app/globals.css";
import { NavBar } from "@/components/nav-bar/nav-bar";

const defaultUrl = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Secret Santa",
    default: "Secret Santa",
  },
  description: "Ortaokul bilgisayar ogrnc🇹🇷🍎👽",
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: {
      template: "%s | Secret Santa",
      default: "Secret Santa",
    },
    description: "Ortaokul bilgisayar ogrnc🇹🇷🍎👽",
    url: new URL(defaultUrl),
    siteName: "Secret Santa",
    locale: "en_UK",
    type: "website",
    images: [`${defaultUrl}/logo-light.png`],
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        LibreBaskerville.variable,
        Lora.variable,
        IBMPlexMono.variable,
        BookInsanity.variable,
        MrEaves.variable,
        NodestoCapsCondensed.variable,
        ScalySans.variable,
        ScalySansCaps.variable,
        SolberaImitation.variable,
        ZatannaMisdirection.variable,
        "font-body",
      )}
      suppressHydrationWarning
    >
      <head>
        <PlausibleProvider
          domain="ss.mkutay.dev"
          customDomain="https://pl.mkutay.dev"
          selfHosted={true}
          trackOutboundLinks={true}
          trackFileDownloads={true}
          taggedEvents={true}
        />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex-1">{children}</div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
