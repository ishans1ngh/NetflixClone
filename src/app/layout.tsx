import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { WatchlistProvider } from "@/context/WatchlistContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CINEVERSE - Watch Movies & TV Shows Online",
  description: "Stream top trending movies, binge-worthy TV series, trailers, and public-domain cinematic classics on CINEVERSE.",
  keywords: ["movies", "streaming", "tv shows", "cineverse", "cinema", "watch online"],
  authors: [{ name: "CINEVERSE Team" }],
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} bg-[#080808] text-white min-h-screen flex flex-col selection:bg-[#e50914] selection:text-white antialiased font-sans`}>
        <AuthProvider>
          <WatchlistProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
