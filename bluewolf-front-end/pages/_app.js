import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import { connectProvider } from "../utils/connector/provider";
import Config from "../utils/config";
import { ethers } from "ethers";
import { useEffect } from "react";
import "../styles/custom.css";
import "../styles/custom2.css";
import "../styles/custom-gia.css";
import "../styles/style.css";
import "../styles/custom-meiji.css";
import "../styles/darkmode.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import WalletProvider from "/context/wallet";
import MetamaskProvider from "/components/MetamaskProvider";
import { Web3ReactProvider } from "@web3-react/core";

function MyApp({ Component, pageProps }) {
  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;

    return library;
  };

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

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <>
      <Head>
        {/* <link ref="stylesheet" href="node_modules/bo"></link> */}
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap"></link>
        <link
          rel="icon"
          type="image/png"
          href="../assets/image/E138F93A.png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="../assets/image/E138F93A.png" />
        <meta
          name="description"
          content="โลกเสมือน  กำลังได้รับความสนใจจากบริษัทชั้นนำหลากหลายบริษัท ไม่ว่าจะเป็นบริษัท Tech ขนาดใหญ่ที่ได้ประกาศแผนในการมุ่งสู่การเป็น Metaverse อย่างเป็นทางการ หรือประเทศอย่างเกาหลีใต้ ก็ต่างเข้ามาสนใจในการมาให้บริการการท่องเที่ยว และบริการทางภาครัฐให้กับประชาชน โดยประกาศเป็นแผนยุทธศาสตร์ของเมือง Seoul Vision 2030 "
        />
        <meta name="keywords" content="โลกเสมือน  Bluewolf NFT" />
        <meta property="og:title" content=" Bluewolf NFT" />
        <meta property="og:type" content=" Bluewolf NFT" />
        <meta property="og:url" content="https://www.Bluewolf NFT.io/" />
        <meta property="og:image" content="../assets/image/E138F93A.png" />
        <title>BluewolfNFT</title>
      </Head>
      <WalletProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <MetamaskProvider>
            <Layout>
              <Component {...pageProps} />
              <ToastContainer
                position="top-right"
                autoClose={0}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
              />
            </Layout>
          </MetamaskProvider>
        </Web3ReactProvider>
      </WalletProvider>
    </>
  );
}

export default MyApp;
