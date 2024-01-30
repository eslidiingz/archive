import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/custom.css";
import "../styles/gacha.css";
import "../styles/custom-aon.css";
import Layout from "../components/Layouts/Layout";

import { useEffect } from "react";
import { ethers } from "ethers";
import WalletProvider from "/context/wallet";
import MetamaskProvider from "/components/MetamaskProvider";
import { Web3ReactProvider } from "@web3-react/core";

function MyApp({ Component, pageProps }) {
  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };

  const initialize = async () => {};

  useEffect(() => {
    initialize();
  }, []);

  return (
    <WalletProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetamaskProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MetamaskProvider>
      </Web3ReactProvider>
    </WalletProvider>

    
  );
}

export default MyApp;
