import Document, { Html, Head, Main, NextScript } from "next/document";


class MainDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"
            rel="stylesheet"
          />
        </Head>
        
        <body>
          <Main />
          <NextScript />

          <div id="modal-root"></div>
        </body>
      </Html>
    );
  }
}

export default MainDocument;
