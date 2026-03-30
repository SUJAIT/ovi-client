import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import WhatsAppFloat from "@/components/WhatsaAppFloat"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Workstation",
  description: "NID Server Copy Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
<body
  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  suppressHydrationWarning={true}
>
  {children}

  {/* WhatsApp Floating Button */}
  <WhatsAppFloat />
</body>
    </html>
  )
}
