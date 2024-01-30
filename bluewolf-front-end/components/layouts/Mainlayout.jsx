import Footer from "./Footer";
import { useState, useCallback, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import { connectProvider, modalConnect } from "../../utils/connector/provider";
import { formatAccount } from "../../utils/lib/utilities";
import { IsAdmin } from "../../utils/contracts/BWNFT";
import Navbar from "./Navbar";

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  isAdmin: false,
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
        isAdmin: action.isAdmin,
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
    case "SET_ISADMIN":
      return {
        ...state,
        isAdmin: action.isAdmin,
      };
    case "RESET_WEB3_PROVIDER":
      return initialState;
    default:
      throw new Error();
  }
};

function Mainlayout({ children, setActiveTab, activeTab = "my-collection" }) {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [toggleViewMode, setToggleViewMode] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, account, isAdmin } = state;

  const disconnect = useCallback(
    async function () {
      await modalConnect().clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
      router.push(`/`);
    },
    [provider]
  );

  const handleChangeUserActiveTab = (selectedTab) => {
    if (selectedTab === "logout") {
      disconnect();
    } else {
      if (typeof setActiveTab === "function") {
        setActiveTab(selectedTab);
      } else {
        router.push(`/profile?tab=${selectedTab}`);
      }
    }
  };

  const handleChangeAdminActiveTab = (selectedTab) => {
    if (selectedTab === "logout") {
      disconnect();
    } else {
      if (typeof setActiveTab === "function") {
        setActiveTab(selectedTab);
      } else {
        router.push(`/adminpage`);
      }
    }
  };

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

  return (
    <>
      <div
        className={`main-layout view-${
          toggleViewMode ? "darkmode" : "lightmode"
        }`}
      >
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}

export default Mainlayout;
