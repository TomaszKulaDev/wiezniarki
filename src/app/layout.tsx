import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBodyWrapper from "./ClientBodyWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Więźniarki - Program Reintegracji Społecznej",
  description:
    "Oficjalny program umożliwiający kobietom przebywającym w zakładach karnych nawiązanie relacji z osobami z zewnątrz w celu lepszej reintegracji ze społeczeństwem",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientBodyWrapper
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </ClientBodyWrapper>
      </body>
    </html>
  );
}
