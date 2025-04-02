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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAAAulBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx0AAAAAAADSEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx3SEx0AAABvMRjWAAAAPHRSTlOAAICAQECAYFCg4MDgcND/0PCAMMAwEBDwsLCQsJBwkHBAQCDg0GAQEPDw4KBgMCAQwLCQcFBQQDAgELAzSEygAAABJklEQVR4Xu3Y1Y3EMBBF0Ye3hRkqMwUZ5v9nWvUm6zxr1L7rrPSlbwAAAAAAAAAAwA86t7VY0BWhBy0WdEboQYsFnRF60GJB5+Lc1vzuCfqivyLsXZqLT7q0FS89bWteetrWvPS0rXnpaVvz0tO25qWnbc1LT9ualzYF3QfvvWu2NQA/b2teetbWvPSsrXnpgbaWl561NS89a2teeqCtPWzrF9OlDwb+YFvz0gNtzUs/bGteulzbFnQdvPeidNsa4NMLLS897Yte24aXXtvGX9qVtvGXdqVtvPTaNl561jZe2pW28dLTtvHSrrSNl561jZdmpQ8G/qxtaWlb28ZLu9o2Xnpv23jpD23jpXnbxkvvbRsvzdrGSx9sm3jpvW3jpf9r261tzUsfbWsAAAAAAAAAAPizb5PQGD6FILEmAAAAAElFTkSuQmCC"
        />
      </head>
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
