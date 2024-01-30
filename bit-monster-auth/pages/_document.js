import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html>
      <Head>
        <title>BitmonsterNFT</title>
        <meta name="description" content={"BitmonsterNFT"} />
        <meta property="og:title" content={"BitmonsterNFT"} />
        <meta property="og:image" content={"/assets/logo.jpeg"} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
