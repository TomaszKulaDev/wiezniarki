import { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
        <style>{`
          html, body {
            background-color: #ffffff !important;
            color: #1a1a1a !important;
          }
          @media (prefers-color-scheme: dark) {
            html, body {
              background-color: #ffffff !important;
              color: #1a1a1a !important;
            }
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
