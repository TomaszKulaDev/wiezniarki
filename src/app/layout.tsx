import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBodyWrapper from "./ClientBodyWrapper";
import StoreProvider from "@/frontend/providers/StoreProvider";

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
    apple: { url: "/apple-touch-icon.svg" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <link
          rel="icon"
          href="data:image/x-icon;base64,AAABAAEAICAQAAEABADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARERAAREAAAAAAAABEREQAREQAAAAAAAEREBEAERAAAAAAABERAREBEQAAAAAAAREBEBERAAAAAAABERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAREREREQAAAAAAAAAAABERERERAAAAAAAAAAAEREREREQAAAAAAAAAARERERERAAAAAAAAAAAEREREQAAAAAAAAAAAAABERERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQAAAAAAAAAAAAAAREQAAAAAAAAAAAAABEREAAAAAAAAAAAAAERERAAAAAAAAAAAAABEREQAAAAAAAAAAAAABEREAAAAAAAAAAAAAERERAAAAAAAAAAAAABEREQAAAAAAAAAAAAABEREAAAAAAAAAAAAAERERAAAAAAAAAAAAAERERAAAAAAAAAAAAAAAAAAAAAAAAAD/4AAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAHwAAAP8AAA=="
        />

        <link
          rel="apple-touch-icon"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAu1YAUAAAAgVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx0AAADBGyTDHCXDHCXDHCXDHCXDHCXDHCXDHCXDHCXDHCXDHCXDHCXDHCXBGyQAAADSEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx0AAABy0PoMAAAAKnRSTlOAAICAgIBAQGBggHCA8KDAwPCQkDAwEBDw4NBwYFBAMDDg0LCQgGBAIBDQXwU/AAABfElEQVR4Xu3YQW6DMBBA0RHFpsBA3G0gEJLdF737X7CRWql04f6Ri/dW38ozo2EkkXTStdmkm2Vq2jY1WZm17fTe6S+/Y0NSuvV0rttUpn+R6jSVUZd2rlkV9uS6WTnXxK65W9Eo68lVv6MxaWhC9zLqh33VeRl13+3T5DLqefVxPepyHfVA7dD9ttT9NtL94xvpQZHuP77RGOkbUg/LqHsZhz3VPVK/IkXqt+2hLmXUxaR1f/JRNKlpijRNe2f/qNzEz/fh0pCEJjShCU1oQhOa0IQmNKEJTWhCE5rQhCY0oQlNaEITmtCEJjShCU1oQhOa0IQmNKEJTWhCE5rQhCY0oQlNaEITmtCEJjShCU1oQhOa0IQmNKEJTWhCE5rQhCY0oQlNaEITmtCEJjShCU1oQhOa0IQmNKEJTWhCE5rQhCY0oQlNaEITmtCEJjShCU1oQhOa0IQmNKEJTWhCE5rQhCY0oQlNaEITmtCEJjShCU1oQhOa0IQmNKEJTei/jX7+9o7UhCY0oQlNaEITmtCEJjSh/zv6AwEHJK8DG73KAAAAAElFTkSuQmCC"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <ClientBodyWrapper
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </ClientBodyWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
