import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import NavbarLeft from "../components/Layouts/NavbarLeft";
import DepositModal from "../components/Modal/DepositModal";
import DepositGoldModal from "../components/Modal/DepositGoldModal";
import DepositUSDTModal from "../components/Modal/DepositUSDTModal";
import DepositBNBModal from "../components/Modal/DepositBNBModal";

export default function Wallet() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showDepositGoldModal, setShowDepositGoldModal] = useState(false);
  const [showDepositUSDTModal, setShowDepositUSDTModal] = useState(false);
  const [showDepositBNBModal, setShowDepositBNBModal] = useState(false);

  const handleCloseDepositModal = () => {
    setShowDepositModal(false);
  };

  const handleCloseDepositGoldModal = () => {
    setShowDepositGoldModal(false);
  };
  const handleCloseDepositUSDTModal = () => {
    setShowDepositUSDTModal(false);
  };
  const handleCloseDepositBNBModal = () => {
    setShowDepositBNBModal(false);
  };
  return (
    <div className="container">
      <h1 className="text-center text-blue font-large">Wallet</h1>
      <div className="index-layout">
        <NavbarLeft />
        <div className="content">
          <div className="row">
            <div className="col-xxl-12 display-grid">
              <div className="bg-primary p-2 set-mb-index ">
                <div className="text-center">
                  {/* <h6>Total Balance</h6>
                  <small>-------------------------</small> */}
                  <table width="100%" className="balance-table">
                    <tr className="">
                      <td align="left">
                        <div className="d-flex">
                          <img
                            src={"/assets/img/icon-1.webp"}
                            alt=""
                            className="me-2 w-10"
                          />
                          <div>
                            <p className="mb-1">Dragon Moon Stone</p>
                            <p className="text-blue mb-0">- USD</p>
                          </div>
                        </div>
                      </td>
                      <td align="right">0.00</td>
                    </tr>
                    <tr>
                      <td align="left">
                        <div className="d-flex">
                          <img
                            src={"/assets/img/icon-2.webp"}
                            alt=""
                            className="me-2 w-10"
                          />
                          <div>
                            <p className="mb-1">Dragon Gold Stone</p>
                            <p className="text-blue mb-0">- USD</p>
                          </div>
                        </div>
                      </td>
                      <td align="right">0.00</td>
                    </tr>
                    {/* <tr>
                      <td align="left">
                        <div className="d-flex">
                          <img
                            src={"/assets/img/icon-3.webp"}
                            alt=""
                            className="me-2 w-10"
                          />
                          <div>
                            <p className="mb-1"> BUSD</p>
                            <p className="text-blue mb-0">0 USD</p>
                          </div>
                        </div>
                      </td>
                      <td align="right">0.000</td>
                    </tr> */}
                    <tr>
                      <td align="left">
                        <div className="d-flex">
                          <img
                            src={"/assets/img/icon-4.webp"}
                            alt=""
                            className="me-2 w-10"
                          />
                          <div>
                            <p className="mb-1"> BUSD</p>
                            <p className="text-red mb-0">- USD</p>
                          </div>
                        </div>
                      </td>
                      <td align="right">0.00</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            {/* <div className="col-xxl-6 px-4">
              <div className="row h-100">
                <div className="col-sm-6 display-grid p-0">
                  <div className="bg-blue p-2 me-sm-1 me-0  mb-sm-1 mt-sm-1  mt-xl-0  text-center ">
                    <img
                      src={"/assets/img/icon-1.webp"}
                      alt=""
                      className="m-auto wallet-w-img"
                    />
                    <p className="mt-1 mb-1">Dragon Moon Stone</p>
                    <button
                      className="btn btn-img btn-blue"
                      onClick={() => setShowDepositModal(true)}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
                <div className="col-sm-6 display-grid p-0">
                  <div className="bg-yellow p-2 ms-sm-1 ms-0 mt-2 mb-sm-1 mt-sm-1  mt-xl-0 text-center ">
                    <img
                      src={"/assets/img/icon-2.webp"}
                      alt=""
                      className="m-auto wallet-w-img"
                    />
                    <p className="mt-1 mb-1">Dragon Gold Stone</p>
                    <button
                      className="btn btn-img btn-yellow"
                      onClick={() => setShowDepositGoldModal(true)}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
                <div className="col-sm-6 display-grid p-0">
                  <div className="bg-green p-2 mt-2 me-0 me-sm-1 mt-sm-1 text-center">
                    <img
                      src={"/assets/img/icon-3.webp"}
                      alt=""
                      className="m-auto wallet-w-img"
                    />
                    <p className="mt-1 mb-1">USDT</p>
                    <button
                      className="btn btn-img btn-green"
                      onClick={() => setShowDepositUSDTModal(true)}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
                <div className="col-sm-6 display-grid p-0">
                  <div className="bg-red p-2 ms-0 mt-2  ms-sm-1 mt-sm-1 text-center">
                    <img
                      src={"/assets/img/icon-4.webp"}
                      alt=""
                      className="m-auto wallet-w-img"
                    />
                    <p className="mt-1 mb-1">BNB</p>
                    <button
                      className="btn btn-img btn-red"
                      onClick={() => setShowDepositBNBModal(true)}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* <DepositModal
        Header="Dragon Moon Stone"
        Titlebnb="FEE 5% (Min 0.01 BNB)"
        onClose={handleCloseDepositModal}
        show={showDepositModal}
      />
      <DepositGoldModal
       Header="Dragon Gold Stone"
      Titlebnb="FEE 5% (Min 0.01 DGS)"
      onClose={handleCloseDepositGoldModal}
      show={showDepositGoldModal}
      />
      <DepositUSDTModal
       Header="USDT"
       Titlebnb="FEE 5% (Min 10 USDT)"
       onClose={handleCloseDepositUSDTModal}
       show={showDepositUSDTModal}
       />
       <DepositBNBModal
        Header="BNB"
        Titlebnb="FEE 5% (Min 0.01 BNB)"
        onClose={handleCloseDepositBNBModal}
        show={showDepositBNBModal}
  /> */}
    </div>
  );
}
