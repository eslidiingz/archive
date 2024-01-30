import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button, Dropdown, Fade } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import { web3Modal, web3Provider } from "/utils/providers/connector";
import { useWalletContext } from "../../context/wallet";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import Image from "next/image";
import Config from "/configs/config";
import { numberComma } from "../../utils/misc";
import { balanceOfWallet, getTokenSymbol } from "../../models/Token";
import { formatEther, formatUnits } from "ethers/lib/utils";

const Navbar = () => {
  const { wallet, walletBalance, tokenSymbol, walletAction } =
    useWalletContext();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState(null);

  const handleWallet = async () => {
    if (wallet) {
      router.replace("/wallet");
    } else {
      await connectWallet();
    }
  };

  const connectWallet = async () => {
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

      const _wallet = await signer.getAddress();
      const _balance = await balanceOfWallet(_wallet);
      const _tokenSymbol = await getTokenSymbol();

      walletAction.store(_wallet);
      walletAction.setBalance(parseInt(formatEther(_balance)));
      walletAction.setToken(_tokenSymbol);

      await switchNetwork(Config.CHAIN_ID);
      await switchChainID();
    } catch (error) {
      console.log("error", error);
    }
  };

  const getNetworkId = async () => {
    try {
      const provider = web3Provider();
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

  const initialize = async () => {
    // await connectWallet();
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (wallet) {
      switchNetwork(Config.CHAIN_ID);
      switchChainID();
      connectWallet();
    }
  }, [wallet]);

  return (
    <>
      <nav className="navbar position-relative px-0">
        <div className="logo me-auto ps-3 mt-lg-0 pb-0">
          <Link href={`https://www.bitmonsternft.com/`}>
            <a>
              <Image
                src={`/assets/img/logo.webp`}
                alt="BitMonster Logo"
                width={`100`}
                height={`61`}
              />
            </a>
          </Link>
        </div>

        {/* Mobile version */}
        <div className="d-lg-none d-md-block w-100 z-index-1">
          <Button
            className="position-btn-close font-40-btn"
            onClick={() => setOpen(!open)}
            aria-controls="example-fade-text"
            aria-expanded={open}
          >
            <List />
          </Button>
          <Fade in={open}>
            <ul className="ul-menu">
              <li className="li-menu">
                <Link href="/">
                  <a className="text-blue">Wallet</a>
                </Link>
              </li>
              <li className="li-menu">
                <Link href="/marketplace">
                  <a className="text-yellow">Marketplace</a>
                </Link>
              </li>
              <li className="li-menu">
                <Link href="/gacha">
                  <a className="text-violet">Gacha</a>
                </Link>
              </li>
              {/*  <li className="li-menu">
                <Link href="/staking">
                    <a className="text-pink">Staking</a>
                </Link>
            </li> */}

              <li className="li-menu">
                <a className="connect-wallet text-orange">Connect Wallet</a>
              </li>
            </ul>
          </Fade>
        </div>
        {/* End Mobile version */}

        {/* Desktop version */}
        <div className="d-lg-block d-md-none d-none">
          <div className="menu ms-auto me-4 d-flex justify-content-center align-items-center ">
            {/* <Link href="/">
            <a className="text-blue">Wallet</a>
          </Link> */}
            <Link href="/marketplace">
              <a className="text-yellow">Marketplace</a>
            </Link>
            <Link href="/gacha">
              <a className="text-violet">Gacha</a>
            </Link>
            <div className="flex">
              <button
                className="btn btn-blue btn-small text-uppercase ms-3 py-1"
                onClick={(e) => handleWallet()}
              >
                {wallet ? "Wallet" : "Connect Wallet"}
              </button>
              {wallet && (
                <div
                  style={{
                    fontSize: "0.5rem",
                    textAlign: "right",
                    marginRight: "2px",
                  }}
                >
                  {`${numberComma(walletBalance)} ${tokenSymbol}`}
                </div>
              )}
            </div>
            {/* <Link href="/staking">
            <a className="text-pink">Staking</a>
          </Link> */}
            {/* <Link href="">
            <a>
              <Dropdown>
                <Dropdown.Toggle
                  className="connect-wallet text-orange"
                  id="dropdown-basic"
                >
                  Connect Wallet
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1" className="margin-left-0">
                    <Link href="/">Wallet</Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </a>
          </Link> */}
            {/* <a className="dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
            <li><a class="dropdown-item" href="#">Separated link</a></li>
          </ul> */}
          </div>
        </div>
        {/* Desktop version */}
      </nav>
    </>
  );
};
export default Navbar;
