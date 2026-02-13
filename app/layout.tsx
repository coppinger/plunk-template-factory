import type { Metadata } from "next";
import { DM_Sans, Fira_Code } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plunktemplates.com"),
  title: "Plunk Template Factory",
  description:
    "Visual editor for Supabase Auth email templates. Design, preview, and export production-ready HTML emails.",
  keywords: [
    "supabase",
    "email templates",
    "html email",
    "email editor",
    "supabase auth",
  ],
  authors: [{ name: "Plunk Template Factory" }],
  openGraph: {
    title: "Plunk Template Factory",
    description:
      "Visual editor for Supabase Auth email templates. Design, preview, and export production-ready HTML emails.",
    url: "https://plunktemplates.com",
    siteName: "Plunk Template Factory",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plunk Template Factory",
    description:
      "Visual editor for Supabase Auth email templates. Design, preview, and export production-ready HTML emails.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.className} ${dmSans.variable} ${firaCode.variable} antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
