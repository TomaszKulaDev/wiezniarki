import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pl" style={{ backgroundColor: "#ffffff" }} className="light">
        <Head>
          <meta name="color-scheme" content="light" />
          <style>{`
            html, body {
              background-color: #ffffff !important;
              color: #1a1a1a !important;
            }
          `}</style>
        </Head>
        <body style={{ backgroundColor: "#ffffff" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
