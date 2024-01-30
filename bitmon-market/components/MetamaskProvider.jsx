import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Injected } from "/utils/providers/metamaskInjectConnectors";
import { useWalletContext } from "/context/wallet";
import { web3Modal, web3Provider } from "/utils/providers/connector";

function MetamaskProvider({ children }) {
  const { wallet, walletAction } = useWalletContext();
  const [loaded, setLoaded] = useState(false);

  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();

  useEffect(() => {
    Injected.isAuthorized()
      .then(async (isAuthorized) => {
        // console.log("isAuthorized", isAuthorized);
        // console.log("networkActive", networkActive);
        // console.log("networkError", networkError);

        if (isAuthorized) {
          const _web3Modal = web3Modal();
          try {
            const _wInstance = await _web3Modal.connect();
            const _wProvider = web3Provider(_wInstance);
            const signer = _wProvider.getSigner();

            walletAction.store(await signer.getAddress());
          } catch (error) {
            console.log("error", error);
          }
        }

        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(Injected);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);

  if (loaded) {
    return children;
  }
  return <></>;
  // return <>Loading</>;
}

export default MetamaskProvider;
