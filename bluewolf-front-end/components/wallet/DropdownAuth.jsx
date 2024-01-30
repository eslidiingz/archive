import React, { useCallback, useState, useEffect, useReducer } from "react";
import { Dropdown } from "react-bootstrap";
import { shortWallet } from "utils/misc";
import { useWalletContext } from "context/wallet";

const dropdownUserItems = [
  {
    title: "My Collection",
    id: "my-collection",
  },
  {
    title: "My NFTs",
    id: "my-nft",
  },
  {
    title: "Favorites",
    id: "favorites",
  },
  {
    title: "Watchlist",
    id: "watchlist",
  },
  {
    title: "History",
    id: "history",
  },
  {
    title: "My Profile",
    id: "my-profile",
  },
  {
    title: "Log out",
    id: "logout",
  },
];

function DropdownAuth() {
  const { wallet, walletAction } = useWalletContext();

  useEffect(() => {}, []);

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic" className="btn-res btn-lg">
        {shortWallet(wallet)}
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100 p-2">
        {dropdownUserItems.map(({ id, title }, index) => (
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
  );
}

export default DropdownAuth;
