// import 'bootstrap/dist/css/bootstrap.min.css'
import Head from "next/head";
import "../public/assets/font-awesome/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

// import "../public/assets/css/custom.css";
// import "../public/assets/css/style.css";
// import "../public/assets/css/custom-meiji.css";
// import "../public/assets/css/custom-rsu-meiji.css";
// import "../public/assets/css/custom-rsu-gia.css";
// import "../public/assets/css/custom-rsu-phorn.css";
// import "../public/assets/css/custom-jo.css";

// css Document
import "../public/assets/css/Document.ci.css";
// new css
import "../public/assets/css/globals.css";
import "../public/assets/css/button.globals.css";
import "../public/assets/css/navbar.globals.css";
import "../public/assets/css/homepage.globals.css";
import "../public/assets/css/card.globals.css";
import "../public/assets/css/slider-globals.css";
import "../public/assets/css/footer.globals.css";
import "../public/assets/css/collection.page.css";
import "../public/assets/css/table.globals.css";
import "../public/assets/css/modal.globals.css";
import "../public/assets/css/create.page.css";
import "../public/assets/css/profile.page.css";
import "../public/assets/css/swap.page.css";

import { SSRProvider } from "react-bootstrap";

import WalletProvider from "/context/wallet";
import MetamaskProvider from "/components/MetamaskProvider";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import { useTokenListStore } from "../stores/tokenList";
import { useEffect } from "react";
import { useCallback } from "react";
import Config from "../configs/config";
TimeAgo.addLocale(en);

const App = ({ Component, pageProps }) => {
  const { setTokenList } = useTokenListStore();
  const fetchTokenList = useCallback(async () => {
    const fetchTokenList = async () => {
      const response = await fetch(
        `${Config.CMS_API}/token-addresses?populate=*`
      );

      if (response.status === 200) {
        const { data } = await response.json();
        setTokenList(data);
      }
    };

    await fetchTokenList();
  }, []);

  useEffect(() => {
    fetchTokenList();
  }, [fetchTokenList]);

  const Layout = Component.layout || (({ children }) => <>{children}</>);

  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;

    return library;
  };

  return (
    <>
      <Head>
        {/* <link rel="icon" type="image/png" href="../favicon-32.png" sizes="32x32"></link> */}
        <link
          rel="icon"
          className="width-icon-20"
          type="image/png"
          href="../Logo-ArchiVerse.png"
        ></link>
        <meta
          name="description"
          content="We've got a great list of investors including HTC, Palmdrive Capital, Cherubic Ventures from the traditional side, Mechanism, Jump Trading, and NGC from crypto. Our most recent investment round is led by a combination of top tier brands and exchanges, allowing us to build interoperability between games natively in our metaverse."
        />
        <meta name="keywords" content="Archiverse Marketplace" />
        <meta property="og:title" content="Archiverse Marketplace" />
        <meta property="og:type" content="Archiverse Marketplace" />
        <title>Archiverse</title>
        {/* New font  */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {/* New font  */}

        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        ></link>

        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        {/* font Rubik */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <SSRProvider>
        <WalletProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <MetamaskProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </MetamaskProvider>
          </Web3ReactProvider>
        </WalletProvider>
      </SSRProvider>
    </>
  );
};

export default App;
