import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"


import WhatsAppFloat from "@/components/WhatsaAppFloat"
import { ThemeProvider } from "@/components/themeProvider/theme-provider"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {

  title: "ICTSEBA",
  icons: {
     icon: "/images/favicon.ico",
  },
  description: "NID Server Copy Platform",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <WhatsAppFloat />
        </ThemeProvider>
      </body>
    </html>
  )
}
