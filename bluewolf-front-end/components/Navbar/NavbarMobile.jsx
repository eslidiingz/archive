import Link from "next/link";
import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useWalletContext } from "context/wallet";
import Search from "components/form/search";
import DropdownMenu from "components/Dropdown/DropdownMenu";

function NavbarMobile(props) {
  const { navigations, show } = props;

  const { wallet, walletAction } = useWalletContext();

  const [toggleViewMode, setToggleViewMode] = useState(false);

  const handleConnectWallet = async () => {
    props.onConnectWallet && props.onConnectWallet();
  };

  const handleCanvasClose = async () => {
    props.onClose && props.onClose();
  };

  return (
    <div className="d-lg-none">
      <Offcanvas
        className="offcanvas-set"
        placement="end"
        show={show}
        onHide={handleCanvasClose}
      >
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <div className="offcanvas-body pt-0 h-100">
            {navigations.map((nav) => {
              return (
                !nav.hidden && (
                  <Link href={nav.disabled ? "" : nav.link} key={nav.name}>
                    <div
                      className={`my-3 font-18 cursor-pointer fw-bolder ${
                        nav.disabled ? `text-muted` : ``
                      }`}
                      style={nav.disabled ? { cursor: "not-allowed" } : {}}
                    >
                      {nav.name}
                    </div>
                  </Link>
                )
              );
            })}
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
            <div className="w-100 mb-2 mt-4 ">
              <Search />
            </div> */}
            <div className="w-100">
              {wallet ? (
                <>
                  <DropdownMenu />
                </>
              ) : (
                <div className="btn-res">
                  <button
                    className="btn bg-primary bg-gradient btn-lg text-white form-control"
                    onClick={handleConnectWallet}
                  >
                    <h5 className="mb-0">Connect Wallet</h5>
                  </button>
                </div>
              )}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default NavbarMobile;
