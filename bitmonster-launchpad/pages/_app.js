import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect } from "react";
import Header from "../components/layouts/header";
import "../assets/css/custom.css";
import Head from "next/head";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { connectProvider } from "../utils/connector/provider";
import Config from "../config";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }) {
  const getNetworkId = async () => {
    try {
      const provider = connectProvider();
      const { chainId } = await provider?.getNetwork();

      return chainId;
    } catch (error) {
      console.log(error);
    }
  };

  const switchChainID = async () => {
    try {
      await window.ethereum.on("chainChanged", (chain) => {
        if (Number(chain) !== Config.CHAIN_ID) {
          switchNetwork(Config.CHAIN_ID);
          location.reload();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async (chainId) => {
    const currentChainId = await getNetworkId();

    if (currentChainId !== chainId) {
      try {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexValue(chainId).toString() }],
          })
          .then((res) => {
            location.reload();
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (error) {
        if (error.code === 4902) {
          console.log("add chain");
        }
      }
    }
  };

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  useEffect(() => {
    switchNetwork(Config.CHAIN_ID);
    switchChainID();
  }, []);

  return (
    <main className="d-flex flex-column min-vh-100">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <title>Bitmonster | Private Sale</title>
        <meta property="og:title" content="Bitmonster" key="title" />
        <meta property="og:type" content="Bitmonster" />
        <meta property="og:url" content="https://www.google.com/" />
        <meta property="og:image" content="/favicon.png"></meta>
      </Head>
      <Header />
      <Component {...pageProps} />

      <ToastContainer
        position="top-right"
        autoClose={0}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
      />

      {/* <Footer /> */}
    </main>
  );
}

export default MyApp;
