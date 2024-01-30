import { useCallback, useState } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import CardTrending from "../../components/card/CardTrending";
import { Container, Row, Col, Nav, Button, Form } from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import SlideTrending from "../../components/Slide/SlideTrending";
import SlideCollection from "../../components/Slide/SlideCollection";

import CardCollection from "../../components/card/CardCollection";
import { getlistingMarketplace } from "../../models/Marketplace";
import { useEffect } from "react";
import { getCollection } from "../../models/Collection";
import { getUsers } from "../../models/User";
import { useWalletContext } from "/context/wallet";
import { smartContact } from "../../utils/providers/connector";
import Config from "../../configs/config";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import Swal from "sweetalert2";
import ButtonState from "../../components/buttons/ButtonLoading";
import BridgeSwapCard from "../../components/launchpad/BridgeSwap";
import SwapType from "../../components/launchpad/SwapType";
import useSWR from "swr";

const Launchpad = () => {
  const { wallet } = useWalletContext();
  const [amountBusd, setAmountBusd] = useState(0);
  const [amountOm, setAmountOm] = useState(0); // 1 om = 1 Bath
  const [balanceBUSD, setBalanceBUSD] = useState(0);
  const [balanceOm, setBalanceOm] = useState(0);
  const [isAllowance, setIsAllowance] = useState(false);
  const [balanceContract, setBalanceContract] = useState(0);
  const [loading, setLoading] = useState(false);
  let platformFee = 0.25;
  const init = useCallback(() => {
    const fetchBalance = async () => {
      if (!wallet) return;
      const launchpadContract = smartContact(
        Config.LAUNCHPAD_CA,
        Config.LAUNCHPAD_ABI
      );
      try {
        const balanceOmToken = await launchpadContract.checkContractBalance(
          wallet
        );
        const _balanceInWei = BigNumber.from(balanceOmToken).toString();
        const _balanceInEth = ethers.utils.formatEther(_balanceInWei);
        setBalanceOm(_balanceInEth);
      } catch (e) {
        console.error("Error from (fetchBalance) : ", e.message);
      }
      try {
        const balanceContract = await launchpadContract.checkContractBalance(
          Config.LAUNCHPAD_CA
        );
        const _balanceContractInWei =
          BigNumber.from(balanceContract).toString();
        const _balanceContractInEth = ethers.utils.formatEther(
          _balanceContractInWei
        );
        setBalanceContract(_balanceContractInEth);
        console.log("Balance contract in ETH : ", _balanceContractInEth);
      } catch (e) {
        console.error(
          "Error from om page (fetchBalance contract ): ",
          e.message
        );
      }
      try {
        const _feeRate = await launchpadContract.platformFee();
        const _fee = _feeRate.toNumber();
        console.log("FeeRate : ", _fee);
        if (_fee) {
          platformFee = _fee / 100;
        }
        platformFee = _feeRate / 100;
      } catch (e) {
        console.error("Error from om page ()", e.message);
      }
      // check contract balance
    };
    const fetchBUSD = async () => {
      if (!wallet) return;
      const busdContract = smartContact(Config.BUSD_CA, Config.ERC20_ABI);
      const amount = await busdContract.balanceOf(wallet);
      const allowance = await busdContract.allowance(
        wallet,
        Config.LAUNCHPAD_CA
      );
      const _allowance = BigNumber.from(allowance).toString();
      setIsAllowance(_allowance > 10000);
      const _amount = ethers.utils.formatEther(
        BigNumber.from(amount).toString()
      );
      const floatAmount = parseFloat(_amount).toFixed(3);
      setBalanceBUSD(floatAmount);
    };
    fetchBUSD();
    fetchBalance();
    const rate = onChangeBUSD();
  }, []);
  const urlFetcher = `/api/oracle`;
  const oracleFetcher = async () => {
    const data = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        busdAmount: 1,
      }),
    };
    const amount = await (await fetch("/api/oracle", data)).json();

    return amount;
  };
  const { data: oracle_amount, error } = useSWR(urlFetcher, oracleFetcher);
  const onChangeBUSD = async (_busd = 0) => {
    if (!amountBusd) {
      // non exchange
      setAmountOm(0);
    } else {
      const _finalBusd = _busd == 0 ? amountBusd : _busd;
      const init = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          busdAmount: _finalBusd,
        }),
      };
    }
    return 0;
  };
  const onExchange = async () => {
    if (!wallet) return;
    const body = {
      userWallet: wallet,
      busdAmount: amountBusd,
    };
    try {
      if (oracle_amount * amountBusd > balanceContract) {
        Swal.fire(
          "Error",
          `Om isn't enough, available ${parseFloat(balanceContract).toFixed(
            3
          )} token`,
          "error"
        );
        return;
      } else if (amountBusd > balanceBUSD) {
        Swal.fire("Error", "Your BUSD Balance isn't enough", "error");
        return;
      }
      setLoading(true);
      const getSignOracle = await fetch(`/api/sign-oracle`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      }).catch((e) => {
        console.log("Fetch oracle error : ", e.message);
        Swal.fire("Error", "Can't get price oracle", "error");
      });
      const result = await getSignOracle.json();
      const { signature, nonce, omTokenAmount, busdAmount } = result;
      console.log(signature, nonce, omTokenAmount, busdAmount);
      const launchpadContract = smartContact(
        Config.LAUNCHPAD_CA,
        Config.LAUNCHPAD_ABI
      );
      try {
        const signOracle = await launchpadContract.oracleBUSD(
          busdAmount,
          omTokenAmount,
          nonce,
          signature
        );
        const tx = await signOracle.wait();
        Swal.fire("Success", "Exchange successfully", "success");
        setLoading(false);
        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (e) {
        console.error("Error : ", e.message);
        Swal.fire("Error", "Transaction fail", "error");
      }
    } catch (e) {
      console.error("Error from onExchange : ", e.message);
    }
    setLoading(false);

    // const signer = new ethers.Wallet(process.env.)
    // const signature =
  };
  const approveBUSD = async () => {
    const busdContract = smartContact(Config.BUSD_CA, Config.ERC20_ABI);
    try {
      console.log("<-- Approve BUSD -->");
      setLoading(true);
      const tx = await busdContract.approve(
        Config.LAUNCHPAD_CA,
        Config.UNLIMIT_ALLOWANCE
      );
      await tx.wait(2);
      setLoading(false);
      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch {
      Swal.fire("Error", "Transaction fail", "error");
      setLoading(false);
    }
  };
  const addETH = async () => {
    const launchpadContract = smartContact(
      Config.LAUNCHPAD_CA,
      Config.LAUNCHPAD_ABI
    );
    const value = ethers.utils.parseEther("0.2");
    const options = { value: value };
    const sendEth = launchpadContract.sendEthToContract(value, options);
  };
  useEffect(() => {
    init();
  }, []);

  const [selectDropdowncoin, setselectDropdowncoin] = useState("BUSD");
  const DropdowncoinList = ["BUSD(OM)", "BUSD(BSC)", "FIAT"];

  return (
    <>
      <SwapType>
        <hr className="hr-lin my-4" />
        <div className="t-box">
          <div className="d-flex justify-content-between align-items-end">
            <p className="text-white">From</p>
            <p className="text-white">Balance : {balanceBUSD}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="w-100">
              <input
                type="number"
                className="form-control input-box-bridge ci-green"
                placeholder="Please enter value"
                value={amountBusd}
                defaultValue="0"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    onChangeBUSD(value);
                    setAmountBusd(value);
                  } else {
                    setAmountBusd(0);
                  }
                }}
              />
            </div>

            <div className="w-100" align="right">
              <div className="d-flex justify-content-end align-items-center">
                <p
                  className="ci-green cursor-pointer me-3"
                  onClick={() => {
                    setAmountBusd(balanceBUSD);
                  }}
                >
                  MAX{" "}
                </p>
                <img
                  src="/assets/swaple/icon-binance.png"
                  className="pb-1 me-2"
                />
                {/* <Dropdown>
                              <Dropdown.Toggle
                                variant=" btn-coin-2 currency-select text-white"
                                id="dropdown"
                              >
                                {selectDropdowncoin}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item eventKey="BUSD">                                 
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown> */}
                <p className="text-white">
                  {selectDropdowncoin == "FIAT" ? "BATH" : selectDropdowncoin}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-center cursor-pointer"
          onClick={() => {
            onChangeBUSD();
          }}
        >
          <img
            src="/assets/image/archiverse/icon/icon-arrowdown.svg"
            className="img-arrowdown"
          />
        </div>
        <div className="t-box">
          <div className="d-flex justify-content-between">
            <p className="text-white">To (estimated)</p>
            <p className="text-white">Balance : {balanceOm}</p>
          </div>

          <div className="d-flex justify-content-between align-items-end mt-3">
            <div className="w-100">
              <p className="ci-green input-box-bridge">
                {amountBusd * oracle_amount}
              </p>
              {/* <input
                            type="number"
                            className="form-control input-box-bridge ci-green"
                            placeholder="Please enter value"
                            defaultValue="0"
                            disabled="true"
                          /> */}
            </div>
            <div className="w-100" align="right">
              <div className="d-flex justify-content-end align-items-center">
                <img
                  src="/assets/swaple/icon-omcoin.webp"
                  className="pb-1 me-2"
                />
                {/* <Dropdown>
                              <Dropdown.Toggle
                                variant=" btn-coin-2 currency-select text-white"
                                id="dropdown"
                              >
                                OM TOKEN
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item eventKey="BUSD">
                                  OM TOKEN
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown> */}
                <p className="text-white">OM</p>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="d-flex justify-content-between">
            <p className="">Price</p>
            <div className="d-flex justify-content-between">
              <p className="">
                {1} {selectDropdowncoin == "FIAT" ? "BATH" : selectDropdowncoin}{" "}
                = {oracle_amount} OM
              </p>
              <img
                src="/assets/swaple/icon-transfer.svg"
                className="pb-1 ps-2"
              />
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <p className="">Platform Fee</p>
            <p className="">{platformFee}%</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="e">Estimate om</p>
            <p className="text-white">
              {amountBusd} BUSD &cong;{" "}
              {(amountBusd * oracle_amount * (100 - platformFee)) / 100}
            </p>
          </div>

          <div className="mt-3">
            {isAllowance ? (
              <ButtonState
                style="col-12 btn btn-primary"
                onFunction={() => onExchange()}
                text={"CONFIRM"}
                loading={loading}
                disabled={loading}
              />
            ) : (
              // <button
              //   type="button"
              //   className="col-12 btn btn-primary"
              //   onClick={() => {
              //     onExchange();
              //   }}
              // >
              //   CONFIRM
              // </button>
              <ButtonState
                style="col-12 btn btn-primary"
                onFunction={() => approveBUSD()}
                text={"APPROVE"}
                loading={loading}
                disabled={loading}
              />
              // <button
              //   type="button"
              //   className="col-12 btn btn-primary"
              //   disabled={!parseFloat(amountBusd)}
              //   onClick={() => {
              //     approveBUSD();
              //   }}
              // >
              //   APPROVE
              // </button>
            )}
          </div>
        </div>
      </SwapType>
    </>
  );
};

export default Launchpad;
Launchpad.layout = Mainlayout;
