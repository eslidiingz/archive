import { useCallback, useState } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";

import { useEffect } from "react";
import { getCollection } from "../../models/Collection";
import { getUsers } from "../../models/User";
import { useWalletContext } from "/context/wallet";
import { smartContact, web3Provider } from "../../utils/providers/connector";
import Config from "../../configs/config";
import { BigNumber, ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import Swal from "sweetalert2";
import ButtonState from "../../components/buttons/ButtonLoading";
import BridgeSwapCard from "../../components/launchpad/BridgeSwap";
import SwapType from "../../components/launchpad/SwapType";
import Modal from "react-bootstrap/Modal";
import OmTopUP from "../../components/form/OmTopUp";
import useSWR from "swr";

const fetcher =
  (library) =>
  (...args) => {
    const [method, ...params] = args;
    return library[method](...params);
  };

const Launchpad = () => {
  const { wallet } = useWalletContext();
  const [amountTHB, setAmountTHB] = useState(0);
  const [amountOm, setAmountOm] = useState(0); // 1 om = 1 Bath
  const [balanceOm, setBalanceOm] = useState(0);
  const [balanceContract, setBalanceContract] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrText, setQrText] = useState({ qrText: "" });
  const [isOpenModalTopUp, setIsOpenModalTopUp] = useState(false);

  const providers = web3Provider(null, true);

  const { data: balance, mutate } = useSWR(["getBalance", wallet], {
    fetcher: fetcher(providers),
  });

  const onExchange = async () => {
    if (!wallet) {
      Swal.fire("Error", "Sign in metamask first", "error");
      return;
    }
    if (!amountTHB) {
      Swal.fire("Warning", "Enter amount Thai Bath", "warning");
      return;
    }
    setLoading(true);
    const body = {
      address: wallet,
      amount: amountTHB * 100,
    };
    try {
      const getQrText = await fetch("/api/om-topup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const qrText = await getQrText.json();
      setQrText(qrText);
      setIsOpenModalTopUp(true);
      console.log("Result : ", qrText);
    } catch (e) {
      console.error("onExchange (fiat) fail : ", e.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  const [selectDropdowncoin, setselectDropdowncoin] = useState("THB");
  const DropdowncoinList = ["BUSD(OM)", "BUSD(BSC)", "FIAT"];

  return (
    <>
      <SwapType>
        <hr className="hr-lin my-4" />
        <div className="t-box">
          <div className="d-flex justify-content-between align-items-end">
            <p className="text-white">From</p>
            {/* <p className="text-white">Balance : {balanceBUSD}</p> */}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="w-100">
              <input
                type="number"
                className="form-control input-box-bridge ci-purplepink"
                placeholder="Please enter value"
                value={amountTHB}
                defaultValue="0"
                step={1}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 && value <= 1000) {
                    setAmountTHB(value ? parseInt(value) : "");
                  } else {
                    setAmountTHB(0);
                  }
                }}
              />
            </div>

            <div className="w-100" align="right">
              <div className="d-flex justify-content-end align-items-center">
                <p className="text-white">
                  {selectDropdowncoin == "FIAT" ? "BATH" : selectDropdowncoin}
                </p>
              </div>
            </div>
          </div>
          <p className="text-white">Enter value 1 to 1000</p>
        </div>
        <div className="d-flex align-items-center justify-content-center cursor-pointer">
          <img
            src="/assets/image/archiverse/icon/icon-arrowdown.svg"
            className="img-arrowdown"
          />
        </div>
        <div className="t-box">
          <div className="d-flex justify-content-between">
            <p className="text-white">To</p>
            <p className="text-white">Balance : {formatEther(balance || 0)}</p>
          </div>

          <div className="d-flex justify-content-between align-items-end mt-3">
            <div className="w-100">
              <p className="ci-purplepink input-box-bridge">
                {amountTHB ? amountTHB : 0}
              </p>
            </div>
            <div className="w-100" align="right">
              <div className="d-flex justify-content-end align-items-center">
                <img
                  src="/assets/swaple/icon-omcoin.webp"
                  className="pb-1 me-2"
                />

                <p className="text-white">OM</p>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="d-flex justify-content-between">
            <p className="">Price</p>
            <div className="d-flex justify-content-between">
              <p className="">1 THB = 1 OM</p>
              <img
                src="/assets/swaple/icon-transfer.svg"
                className="pb-1 ps-2"
              />
            </div>
          </div>
          {/* <div className="d-flex justify-content-between">
            <p className="text-white">Slippage Tolerance</p>
            <p className="text-white">2%</p>
          </div> */}
          <div className="mt-3">
            <ButtonState
              style="col-12 btn btn-primary"
              onFunction={() => onExchange()}
              text={"CONFIRM"}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </SwapType>
      <Modal
        show={isOpenModalTopUp}
        onHide={() => setIsOpenModalTopUp(!isOpenModalTopUp)}
        size="lg"
      >
        <OmTopUP
          qrText={qrText.qrText}
          amount={amountTHB}
          onCloseModalTopup={() => setIsOpenModalTopUp(false)}
        />
      </Modal>
    </>
  );
};

export default Launchpad;
Launchpad.layout = Mainlayout;
