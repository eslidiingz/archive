import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export const useWalletContext = () => {
  return useContext(WalletContext);
};

function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [walletBalance, setWalletBalance] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  function store(_address) {
    setWallet(_address);
  }

  const setBalance = (_balance) => {
    setWalletBalance(_balance);
  };

  const setToken = (_symbol) => {
    setTokenSymbol(_symbol);
  };

  const walletStore = {
    wallet,
    walletBalance,
    tokenSymbol,
    walletAction: {
      store,
      setBalance,
      setToken,
    },
  };

  return (
    <WalletContext.Provider value={walletStore}>
      {children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;
