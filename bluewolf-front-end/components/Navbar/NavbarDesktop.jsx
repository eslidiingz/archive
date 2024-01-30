import React, { useEffect, useState } from "react";
import Link from "next/link";
import Search from "components/form/search";
import { useWalletContext } from "context/wallet";
import DropdownMenu from "components/Dropdown/DropdownMenu";

function NavbarDesktop(props) {
  const { navigations } = props;

  const { wallet, walletAction } = useWalletContext();

  const [toggleViewMode, setToggleViewMode] = useState(false);

  const handleConnectWallet = async () => {
    props.onConnectWallet && props.onConnectWallet();
  };

  const initialize = async () => {};

  useEffect(() => {
    initialize();
  }, [props]);

  return (
    <div className="d-none d-md-block w-100">
      <div className="d-flex justify-content-between align-items-center ms-md-4 ">
        <div className="d-flex">
          {navigations.map((nav) => {
            {
              return (
                !nav.hidden && (
                  <Link href={nav.disabled ? "" : nav.link} key={nav.name}>
                    <a
                      className={`mx-4 nav-item ${
                        nav.disabled ? `text-muted` : ``
                      }`}
                      style={nav.disabled ? { cursor: "not-allowed" } : {}}
                    >
                      {nav.name}
                    </a>
                  </Link>
                )
              );
            }
          })}
        </div>
        <div className="d-flex align-items-center">
          {/* <button
            onClick={() => setToggleViewMode(!toggleViewMode)}
            className={`btn-viewmode view-${
              toggleViewMode ? "darkmode" : "lightmode"
            }`}
          >
            <div className="view-icon">
              {toggleViewMode ? (
                <i className="fas fa-moon"></i>
              ) : (
                <i className="fas fa-sun"></i>
              )}
            </div>
          </button>

          <div className="d-none d-lg-block">
            <Search className="p-r-10" />
          </div> */}

          <div>
            {wallet ? (
              <DropdownMenu />
            ) : (
              <button
                onClick={(e) => {
                  handleConnectWallet();
                }}
                type="button"
                className="btn bg-primary bg-gradient btn-lg text-white form-control "
              >
                <h5 className="mb-0">Connnect Wallet</h5>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarDesktop;
