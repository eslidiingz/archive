import { useCallback, useReducer, useEffect } from "react";
import { toastDanger } from "../../components/utilities/toast";

import { connectProvider, modalConnect } from "../../utils/connector/provider";
import { formatAccount } from "../../utils/lib/utilities";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Modal from "../utilities/modal-md.js";

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        account: action.account,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        account: action.account,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    default:
      throw new Error();
  }
};

const Header = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, account, chainId } = state;
  const [loadMetamask, setLoadMetamask] = useState(false);

  const fetchMetamask = () => {
    if (typeof window.ethereum !== "undefined") {
      setLoadMetamask(true);
    }
  };

  useEffect(() => {
    fetchMetamask();
  }, []);

  const connect = useCallback(async () => {
    try {
      const provider = await modalConnect().connect();
      const web3Provider = connectProvider();
      const signer = web3Provider.getSigner();
      const account = await signer.getAddress();
      const network = await web3Provider?.getNetwork();

      dispatch({
        type: "SET_WEB3_PROVIDER",
        provider,
        web3Provider,
        account,
        chainId: network.chainId,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const disconnect = useCallback(
    async function () {
      modalConnect()?.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
      window.location.reload();
    },
    [provider]
  );

  useEffect(() => {
    if (modalConnect().cachedProvider) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        dispatch({
          type: "SET_ADDRESS",
          account: accounts[0],
        });
        window.location.reload();
      };

      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = () => {
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const [showMe, setShowMe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  function toggle() {
    setShowMe(!showMe);
    setShowMenu(false);
  }

  const [showMenu, setShowMenu] = useState(false);
  function toggleMenu() {
    setShowMenu(!showMenu);
    setShowMe(false);
  }

  function toggleHideMenu() {
    setShowMenu(false);
  }

  const downloadMetamask = () => {
    const win = window.open("https://metamask.io/download/", "_blank");
    win.focus();
  };

  return (
    <>
      <header id="navbar">
        <nav className="bg-navbar">
          <ul className="navbar-nav d-flex flex-row w-100">
            <div className="d-lg-none">
              <div>
                <img
                  onClick={toggleMenu}
                  className="icon-m"
                  alt="menu.svg"
                  src="icon/menu.svg"
                />
              </div>
            </div>
            <div className="mx-auto">
              <li className="nav-item">
                <Link href={"/"}>
                  <a
                    className={`nav-link font-w-500 ${
                      router.pathname == "/" ? "active" : ""
                    }`}
                  >
                    <img className="logo-app" src="logo.png" />
                  </a>
                </Link>
              </li>
            </div>
            <div className="d-lg-none">
              <div>
                <img
                  onClick={toggle}
                  className="icon-m"
                  alt="monster.svg"
                  src="icon/monster.svg"
                />
              </div>
            </div>
            <div className="d-none d-lg-block">
              <div className="d-flex">
                <li className="nav-item">
                  <Link href={"https://bitmonsternft.gitbook.io/whitepaper/"}>
                    <a
                      className={`btn-nav btn-nav-white ${
                        router.pathname == "/" ? "active" : ""
                      }`}
                    >
                      White Paper
                    </a>
                  </Link>
                </li>
                <li className="nav-item ms-4">
                  <Link href={"/"}>
                    <a
                      className={`btn-nav btn-nav-blue ${
                        router.pathname == "/" ? "active" : ""
                      }`}
                    >
                      Private Sale
                    </a>
                  </Link>
                </li>
                <li className="nav-item ms-4">
                  <Link href={"/token-lock"}>
                    <a
                      className={`btn-nav btn-nav-green ${
                        router.pathname == "/token-lock" ? "active" : ""
                      }`}
                    >
                      Token Locked
                    </a>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link href={"/stake"}>
                    <a
                      className={`nav-link font-w-500 mg-l-30  ${
                        router.pathname == "/stake" ? "active" : ""
                      }`}
                    >
                      Stake
                    </a>
                  </Link>
                </li> */}

                <div>
                  {console.log(loadMetamask)}
                  {loadMetamask === true ? (
                    <>
                      {web3Provider ? (
                        <div className="flex align-items-center ms-4">
                          <button
                            className="btn-nav btn-nav-yellow w-auto px-2"
                            onClick={toggle}
                          >
                            <div className="btn-connect-desc">
                              <span className="small">Your Wallet :</span>
                              <p>{formatAccount(account)}</p>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex align-items-center ms-4">
                          <button
                            className="btn-nav btn-nav-yellow"
                            type="button"
                            onClick={() => connect()}
                          >
                            Connect
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex align-items-center ms-4">
                        <button
                          style={{ fontSize: "16px" }}
                          className="btn-nav btn-nav-yellow"
                          onClick={() => downloadMetamask()}
                        >
                          Install Metamask
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ul>

          {/* modal profile */}
          <div>
            <div className={showMe ? "showModal" : "hideModal"}>
              <div className="d-lg-none modal-wallet">
                <div className="">
                  {loadMetamask === true ? (
                    <>
                      {web3Provider ? (
                        <button className="btn-wallet" onClick={toggle}>
                          <span>Your Wallet : {formatAccount(account)}</span>
                        </button>
                      ) : (
                        <button
                          className="btn-wallet"
                          type="button"
                          onClick={() => connect()}
                        >
                          Connect
                        </button>
                      )}
                      <div
                        className="font-disconnect"
                        onClick={() => disconnect()}
                      >
                        Disconnect
                      </div>
                    </>
                  ) : (
                    <button
                      className="btn-wallet"
                      style={{ fontSize: "16px", marginBottom: "0px" }}
                      type="button"
                      onClick={() => downloadMetamask()}
                    >
                      Install Metamask
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* menu mobile */}
          <div className="d-lg-none">
            <div className={showMenu ? "showModal" : "hideModal"}>
              <div className="modal-menu">
                <Link href={"https://bitmonsternft.gitbook.io/whitepaper/"}>
                  <a
                    className={`menu-link ${
                      router.pathname == "/" ? "active" : ""
                    }`}
                    onClick={toggleHideMenu}
                  >
                    White Paper
                  </a>
                </Link>
                <Link href={"/"}>
                  <a
                    className={`menu-link ${
                      router.pathname == "/" ? "active" : ""
                    }`}
                    onClick={toggleHideMenu}
                  >
                    Private Sale
                  </a>
                </Link>
                <Link href={"/token-lock"}>
                  <a
                    className={`menu-link ${
                      router.pathname == "/token-lock" ? "active" : ""
                    }`}
                    onClick={toggleHideMenu}
                  >
                    Token Locked
                  </a>
                </Link>
                {/* <Link href={"/stake"}>
                  <a
                    className={`nav-link font-w-500 mg-l-30  ${
                      router.pathname == "/stake" ? "active" : ""
                    }`}
                    onClick={toggleHideMenu}
                  >
                    Stake
                  </a>
                </Link> */}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Wallet"
      >
        Hello from the modal!
      </Modal>
    </>
  );
};

export default Header;
