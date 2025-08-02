import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Jaloliddin & Sevinch - To'y Taklifnomasi | 03.09.2025",
  description: "Jaloliddin va Sevinch nikoh to'yiga taklifnoma - 03 Sentyabr 2025, Al Amin to'yxonasi",
  keywords: "taklifnoma, toy taklifnomasi, nikoh, wedding invitation, Jaloliddin, Sevinch, 03092025",
  authors: [{ name: "Wedding Invitation" }],
  creator: "Wedding Team",
  publisher: "Wedding Invitation",
  robots: "index, follow",
  openGraph: {
    title: "Jaloliddin & Sevinch - To'y Taklifnomasi",
    description: "Bizning baxtli kunimizga taklif qilamiz - 03.09.2025",
    url: "https://taklifnoma03092025.com",
    siteName: "Taklifnoma 03.09.2025",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jaloliddin & Sevinch Wedding Invitation",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaloliddin & Sevinch - To'y Taklifnomasi",
    description: "Bizning baxtli kunimizga taklif qilamiz - 03.09.2025",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f472b6",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" className={`${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="your-verification-code" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
