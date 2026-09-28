import { Fraunces, Inter, Caveat, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
})

const siteUrl =
  process.env.URL || // Netlify
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "for Anjali — open when you’re ready",
  description: "a small thing I made.",
  robots: { index: false, follow: false },
  authors: [{ name: "Kesava" }],
  generator: "way too much code",
  openGraph: {
    title: "for Anjali — open when you’re ready",
    description: "a small thing I made.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#0E0C0B",
  viewportFit: "cover",
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} ${jetbrains.variable}`}
    >
      <body>
        {/* For anyone reading the source. Not executed, never shown. */}
        <script
          type="text/plain"
          id="a-note-for-whoever-reads-the-source"
          dangerouslySetInnerHTML={{
            __html: `
  hi. if you're reading this, you're looking at the source of a birthday present.
  it was made, line by line, for one person.

  return "Happy Birthday, Anjali ❤️";
`,
          }}
        />
        {children}
      </body>
    </html>
  )
}
