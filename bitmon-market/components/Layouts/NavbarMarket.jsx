import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import ProfileModal from "../Modal/ProfileModal";
import WithdrawModal from "../Modal/WithdrawModal";

export default function NavbarMarket() {
  const [modalShow, setModalShow] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleCloseWithdrawModal = () => {
    setModalShow(false);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="sidebar">
      <div className="row">
        <div className="col-12">
          <div className="bg-primary p-2 mx-auto text-center ">
            <img
              src={"/assets/img/PicM031.webp"}
              alt=""
              className="m-auto user-wallet "
              onClick={() => setShowProfileModal(true)}
            />
            <div className="my-2">
              <h6>ZENZEN55</h6>
              <p>
                189KL09...LAW1092l{" "}
                <span className="px-2">
                  {" "}
                  <img
                    src={"/assets/img/copy-code.webp"}
                    alt=""
                    className="m-auto"
                  />
                </span>
              </p>
            </div>
            <div className="py-1">
              <ul className="wallet-set-ul">
                <li>
                  <div className="my-3 mx-lg-0 mx-3">
                    <span>
                      <img
                        src={"/assets/img/wallet.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="/">Wallet</Link>
                  </div>
                </li>
                <li>
                  <div className="my-3 mx-lg-0 mx-3">
                    <span>
                      <img
                        src={"/assets/img/inven.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="/inventory">Inventory</Link>
                  </div>
                </li>
                <li>
                  <div className="my-3 mx-lg-0 mx-3">
                    <span>
                      <img
                        src={"/assets/img/staking.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="/staking">Staking</Link>
                  </div>
                </li>
              </ul>
              <button
                className="btn btn-img btn-violet  mx-auto"
                onClick={() => setModalShow(true)}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      <WithdrawModal onClose={handleCloseWithdrawModal} show={modalShow} />
      <ProfileModal onClose={handleCloseProfileModal} show={showProfileModal} />
    </div>
  );
}
