import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { useConfig } from "../../contexts/config";
import { filterData } from "../../utils/data";
import { useReducer, useCallback, useEffect } from "react";
import { connectProvider, modalConnect } from "../../utils/provider";

const initialState = {
  provider: null,
  web3Provider: null,
  accountLogin: null,
  chainId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        accountLogin: action.accountLogin,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        accountLogin: action.account,
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

const LoginWithMetamask = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, accountLogin } = state;
  const { config } = useConfig();
  const handleSignupMetamask = async (account) => {
    const result = await axios.post(
      `${process.env.BASE_API_URL}/users/login`,
      JSON.stringify({
        walletAddress: account,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const { rows } = result.data;

    return rows;
  };

  const connect = useCallback(async () => {
    const provider = await modalConnect().connect();

    const web3Provider = connectProvider();

    const signer = web3Provider?.getSigner();
    const account = await signer?.getAddress();
    const network = await web3Provider?.getNetwork();

    if (accountLogin) {
      await handleLoginMetamask(account);
    }

    dispatch({
      type: "SET_WEB3_PROVIDER",
      provider,
      web3Provider,
      accountLogin: account,
      chainId: network.chainId,
    });
  }, [accountLogin]);

  const disconnect = useCallback(
    async function () {
      await modalConnect().clearCachedProvider();
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

  const handleLoginMetamask = async (account) => {
    const result = await axios.get(`${process.env.BASE_API_URL}/users?address=${account}`);
    const { rows } = result.data;

    let users;

    if (rows.length > 0) {
      users = rows;
    } else {
      users = await handleSignupMetamask(account);
    }
    if (users[0]) {
      const signature = await handleSignMessage(users[0]);
      if (signature?.walletAddress) {
        const signAuth = await handleSignAuth(signature?.walletAddress);

        const { accessToken } = signAuth.data;

        const data = {
          accessToken,
        };

        if (accessToken !== "") {
          localStorage.setItem("bitmonster-authorize", JSON.stringify(data));
          router.reload();
        }
      }
    }
  };
  const handleSignMessage = async ({ walletAddress }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    try {
      const signature = await signer.signMessage(`Welcome to bit monster with address ${walletAddress}`);
      return { walletAddress };
    } catch (error) {
      console.log("You need to sign the message to be able to log in.");
    }
  };
  const handleSignAuth = async (address) => {
    return await axios.post(
      `${process.env.BASE_API_URL}/users/login`,
      JSON.stringify({
        walletAddress: address,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  };

  return (
    <>
      <a onClick={() => connect()}>
        <Image src={"/assets/connect_metamask.png"} width={"340"} height={"72"} />
      </a>
    </>
  );
};

export default LoginWithMetamask;
