import { useState, useCallback, useReducer, useEffect } from "react";
import { useWalletContext } from "context/wallet";
import { IsAdmin } from "utils/contracts/BWNFT";
import { Dropdown } from "react-bootstrap";
import { shortWallet } from "utils/misc";
import { useRouter } from "next/router";
import { web3Modal, web3Provider } from "utils/providers/connector";

const adminMenuItems = [
  { title: "Admin Page", page: "adminpage" },
  // { title: "Logout", page: "logout" },
];

const userMenuItems = [
  { title: "My Collection", page: "/profile?tab=my-collection" },
  { title: "My NFTs", page: "/profile?tab=my-nft" },
  // { title: "Favorites", page: "profile?tab=favorites" },
  // { title: "Watchlist", page: "profile?tab=watchlist" },
  { title: "History", page: "/profile?tab=history" },
  { title: "My Profile", page: "/profile?tab=my-profile" },
  // { title: "Log out", page: "logout" },
];

const initialState = {
  provider: null,
  web3Provider: null,
  account: null,
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

function DropdownMenu(props) {
  const activeTab = "my-collection";

  const { wallet, walletAction } = useWalletContext();
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, account } = state;

  const [isAdmin, setIsAdmin] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const initialize = async () => {
    const isAdmin = await IsAdmin(wallet);

    console.log("isAdmin", isAdmin);

    setIsAdmin(isAdmin);
    setMenuItems(isAdmin ? adminMenuItems : userMenuItems);
  };

  const disconnect = useCallback(async () => {
    const _w3modal = web3Modal();
    const provider = web3Provider();

    if (_w3modal.cachedProvider) {
      // console.log("ethereum", window.ethereum, ethereum);
      // console.log("provider", provider);

      await _w3modal.clearCachedProvider();
      walletAction.store(null);
      router.push(`/`);
    }

    // let clear = await _w3modal.clearCachedProvider();
    // let disconnect = provider.disconnect();

    // console.log("_w3modal", _w3modal);
    // console.log("provider", provider);

    // await modalConnect().clearCachedProvider();
    // if (provider?.disconnect && typeof provider.disconnect === "function") {
    //   await provider.disconnect();
    // }
    // router.push(`/`);
  }, []);

  const handleChangeActiveTab = (_page) => {
    router.push(_page);
  };

  useEffect(() => {
    initialize();
  }, [wallet]);

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" className="btn-res btn-lg">
          {shortWallet(wallet)}
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100 p-2">
          {menuItems.map(({ page, title }, index) => (
            <Dropdown.Item
              className={`${activeTab === page ? "active" : ""}`}
              onClick={() => handleChangeActiveTab(page)}
              key={`${title}_${page}_${index}`}
            >
              {title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* {isAdmin ? (
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" className="btn-res btn-lg">
            {shortWallet(wallet)}
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100 p-2">
            {adminMenuItems.map(({ id, title }, index) => (
              <Dropdown.Item
                className={`${activeTab === id ? "active" : ""}`}
                onClick={() => handleChangeAdminActiveTab(id)}
                key={`${title}_${id}_${index}`}
              >
                {title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" className="btn-res btn-lg">
            {shortWallet(wallet)}
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100 p-2">
            {userMenuItems.map(({ id, title }, index) => (
              <Dropdown.Item
                className={`${activeTab === id ? "active" : ""}`}
                onClick={() => handleChangeUserActiveTab(id)}
                key={`${title}_${id}_${index}`}
              >
                {title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )} */}
    </>
  );
}

export default DropdownMenu;
