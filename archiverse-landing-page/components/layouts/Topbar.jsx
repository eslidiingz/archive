import Link from "next/link";
import {
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import Search from "../form/search";
import { useEffect, useState } from "react";

import { useWalletContext } from "/context/wallet";
import ConnectProfile from "../connectProfile/connectProfile";
import Config, { debug } from "/configs/config";
import { web3Modal, web3Provider } from "/utils/providers/connector";
import Swal from "sweetalert2";
import { shortWallet } from "/utils/misc";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { ButtonComponents } from "../stylecomponents/Button";

import DropdownStyleComponents from "../stylecomponents/Dropdown";
import { ContentTopbarDropdown } from "../data/Topbar";

function Topbar({ setActiveTab, activeTab = "profile" }) {
  const router = useRouter();
  const [navbar, setNavbar] = useState(false);

  const { wallet, walletAction } = useWalletContext();

  const [isActive, setActive] = useState(false);
  const [isSign, setIsSign] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const toggleMode = () => {
    setActive(!isActive);
  };

  const changeBackground = () => {
    if (window.scrollY >= 30) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  const getNetworkId = async () => {
    try {
      const provider = web3Provider();
      const { chainId } = await provider?.getNetwork();
      return chainId;
    } catch (error) {
      console.log(error);
    }
  };

  const addCustomChain = async () => {
    await window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ethers.utils.hexValue(Config.CHAIN_ID).toString(),
            chainName: "OM Chain",
            nativeCurrency: {
              name: "OM",
              symbol: "OM",
              decimals: 18,
            },
            rpcUrls: [Config.RPC],
            blockExplorerUrls: [Config.EXPLORER],
          },
        ],
      })
      .catch((error) => {
        console.log(error);
      });
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

  const switchChainID = async (chainId = Config.CHAIN_ID) => {
    try {
      await window.ethereum.on("chainChanged", (chain) => {
        if (Number(chain) !== chainId) {
          switchNetwork(chainId);
          location.reload();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    if (debug)
      console.log(
        `%c========== Topbar Connect wallet ==========`,
        "color: orange"
      );

    if (typeof window.ethereum === "undefined") {
      Swal.fire(
        "Warning",
        "Please, Install metamark extension to connect DApp",
        "warning"
      );
      return;
    }

    const _web3Modal = web3Modal();

    try {
      const _wInstance = await _web3Modal.connect();
      const _wProvider = web3Provider(_wInstance);
      const signer = _wProvider.getSigner();

      walletAction.store(await signer.getAddress());

      // window.ethereum.on("accountsChanged", function (accounts) {
      //   console.log("Accounts : ", accounts[0]);
      //   walletAction.store(accounts[0]);
      // });

      if (
        getNetworkId() !== Config.CHAIN_ID &&
        router.pathname !== "/Launchpad/bsc"
      ) {
        addCustomChain();
      }

      if (router.pathname !== "/Launchpad/bsc") {
        await switchNetwork(Config.CHAIN_ID);
        await switchChainID(Config.CHAIN_ID);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: Topbar.jsx ~ line 159 ~ connectWal ~ error",
        error
      );
      Swal.fire("Error", error.toString().replace("Error: ", ""), "error");
    }
  };

  useEffect(() => {
    if (wallet) {
      window.ethereum.on("accountsChanged", function (accounts) {
        connectWallet();
        location.reload();
      });
    }
  }, [wallet]);

  useEffect(() => {
    connectWallet();
  }, [router]);

  const [bgblack, setBgtop] = useState(false);

  const addclassactive = () => {
    if (bgblack) {
      setBgtop(false);
    } else {
      setBgtop(true);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        bg="navbar-bg"
        className={navbar || bgblack ? "navbar active" : ""}
      >
        <Container>
          <Navbar.Brand>
            <Link href="/">
              <div className="navbar-layout-logo">
                <img
                  alt=""
                  src="/Logo-ArchiVerse-v-w.svg"
                  className="navbar-logo-size"
                />
              </div>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {wallet ? (
              <>
                <Link href="/#section-slider-platform">
                  <ButtonComponents
                    color="secondary"
                    size="size_220"
                    className="me-3"
                  >
                    <p className="fw-semibold">Non Fungible Token (NFTs)</p>
                  </ButtonComponents>
                </Link>

                <DropdownStyleComponents
                  items={ContentTopbarDropdown}
                  title={shortWallet(wallet)}
                />
              </>
            ) : (
              <>
                <Link href="/#section-slider-platform">
                  <ButtonComponents
                    color="secondary"
                    size="size_220"
                    className="me-3"
                  >
                    <p className="fw-semibold">Non Fungible Token (NFTs)</p>
                  </ButtonComponents>
                </Link>

                <ButtonComponents
                  color="primary"
                  size="size_180"
                  onClick={() => connectWallet()}
                >
                  <p className="fw-semibold">Connect Wallet</p>
                </ButtonComponents>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
export default Topbar;
