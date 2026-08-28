import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aabirsharma.vercel.app"),
  title: {
    default: "Aabir Sharma - AI/ML Engineer in Progress",
    template: "%s - Aabir Sharma",
  },
  description:
    "Computer engineering undergraduate at TIET working on machine learning, generative models, and the math underneath them. Research papers on GST revenue and gold-price market efficiency.",
  keywords: [
    "Aabir Sharma",
    "AI",
    "ML",
    "machine learning",
    "generative AI",
    "research",
    "TIET",
    "Thapar",
    "portfolio",
    "engineering",
  ],
  authors: [{ name: "Aabir Sharma" }],
  creator: "Aabir Sharma",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://aabirsharma.vercel.app",
    siteName: "Aabir Sharma",
    title: "Aabir Sharma - AI/ML Engineer in Progress",
    description:
      "Computer engineering undergraduate. Machine learning, generative models, and research.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aabir Sharma - AI/ML Engineer in Progress",
    description:
      "Computer engineering undergraduate. Machine learning, generative models, and research.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${inter.variable} ${newsreader.variable} ${jetbrains.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-canvas focus:mono focus:text-sm"
        >
          Skip to content
        </a>
        {children}
        <div className="paper-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
