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
  title: "Więźniarki - Profile kobiet z więzienia",
  description:
    "Platforma umożliwiająca kobietom w więzieniu pokazanie swojego profilu w sieci",
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
