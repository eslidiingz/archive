import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";


class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>                                                              
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" type="image/x-icon" href="/assets/img/logo.webp"></link>
          <title>BitmonsterNFT | Market</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
          <meta property="og:title" content="Bitmonster" key="title" />
          <meta property="og:type" content="Bitmonster" />
          <meta property="og:url" content="https://www.google.com/" />
          <meta property="og:image" content="/assets/img/logo.webp"></meta>
          <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet"/>
        </Head>
        <body className="g-sidenav-show g-sidenav-pinned">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
