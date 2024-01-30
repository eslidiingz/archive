import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import { useWalletContext } from "/context/wallet";
import { updateAsset } from "/models/Asset";
import { updateOrderMarket } from "/models/Marketplace";
import { createTransactions } from "/models/Transaction";

import Config, { debug } from "/configs/config";

import { smartContact } from "/utils/providers/connector";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import ButtonState from "../buttons/ButtonLoading";
import useLoading from "../../hooks/useLoading";
import Swal from "sweetalert2";
import { BigNumber } from "ethers";
import { createBidding, updateBidding } from "../../models/Marketplace";
import { createUser, isUserCreated } from "../../models/User";
import { useQueryToken } from "../../hooks/useQueryToken";

function BiddingModal(props) {
  const router = useRouter();

  const { wallet } = useWalletContext();

  const [form, setForm] = useState({
    user_agreement: false,
  });
  const [bidPrice, setBidPrice] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [refundData, setRefundData] = useState({
    isBid: false,
    isRefund: false,
  });
  const [depositAmount, setDepositAmount] = useState(0);
  const { toggle, loading } = useLoading();
  const { token: queryToken } = useQueryToken(props?.marketPlace?.tokenAddress);

  const checkAllowance = useCallback(async () => {
    const tokenContract = smartContact(
      props?.marketPlace?.tokenAddress,
      Config.ERC20_ABI,
      true
    );
    try {
      const allowance = await tokenContract.allowance(
        wallet,
        Config.MARKETPLACE_CA
      );
      if (formatEther(allowance) > 0) {
        setAllowance(true);
      }
    } catch (e) {
      console.log("Error from checkAllowance bidding modal : ", e.message);
    }
  }, [props]);

  const allowanceToken = async (index) => {
    toggle(index, true);
    try {
      const tokenContract = smartContact(
        props?.marketPlace?.tokenAddress,
        Config.ERC20_ABI
      );
      const transaction = await tokenContract.approve(
        Config.MARKETPLACE_CA,
        Config.UNLIMIT_ALLOWANCE
      );
      //   const tx = await transaction.wait(5);
      setAllowance(true);
      toggle(index, false);
    } catch (error) {
      toggle(index, false);
    }
  };

  const handleFormChange = (event) => {
    if (event.target.type == "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.checked,
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const checkIsDepositForBidding = async () => {
    const marketplaceContract = smartContact(
      Config.MARKETPLACE_CA,
      Config.MARKETPLACE_ABI
    );
    const orderId = props.marketPlace.orderId;
    try {
      const refundData = await marketplaceContract.refunds(orderId, wallet);
      console.log("Refund Data : ", refundData);
      setRefundData(refundData);
    } catch (e) {
      console.log("Error from check is deposit : ", e.message);
    }
  };

  const fetchDepositAmount = useCallback(async () => {
    const { price } = props.marketPlace;
    const fetching = async () => {
      const marketplaceContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );

      const _refundRate = formatUnits(
        await marketplaceContract._refundRate(),
        "wei"
      );

      const depositAmount = price * (_refundRate / 10000);
      setDepositAmount(depositAmount);
    };

    await fetching();
  }, []);

  const depositForBidding = async (index, depositAmount) => {
    const marketplaceContract = smartContact(
      Config.MARKETPLACE_CA,
      Config.MARKETPLACE_ABI
    );
    const orderId = props.marketPlace.orderId;
    toggle(index, true);
    try {
      let result;

      if (queryToken.is_native) {
        const value = {
          value: parseEther(depositAmount + ""),
        };
        const tx = await marketplaceContract.depositCashForBid(orderId, value);
        result = await tx.wait();
      } else {
        const depositTx = await marketplaceContract.depositCashForBid(orderId);
        result = await depositTx.wait();
      }

      if (result) {
        const biddingWhere = `{orderId: {_eq: ${orderId}}, bidder: {_eq: ${wallet}}`;
        const biddingSet = `isBid: true`;
        const updateBidTx = await updateBidding(biddingSet, biddingWhere);
        setRefundData({
          isBid: true,
          isRefund: false,
        });
        // setTimeout(() => {
        //     location.reload();
        // }, 1000)
        toggle(index, false);
      }
    } catch (error) {
      console.log(error);
      toggle(index, false);
    }
  };

  const handleSubmit = async (index) => {
    const currentBidPrice = props.bidHistory[0].bidPrice;
    if (bidPrice <= 0 || currentBidPrice >= bidPrice) {
      Swal.fire(
        "Error",
        `Bid price must greater than ${currentBidPrice} ${props.marketPlace.symbol}`,
        "error"
      );
      return;
    }
    toggle(index, true);
    try {
      const bidPriceInWei = BigNumber.from(
        parseEther(bidPrice.toString())
      ).toString();
      const sm = smartContact(Config.MARKETPLACE_CA, Config.MARKETPLACE_ABI);
      const tx = await sm.bidAuction(
        parseInt(props.marketPlace.orderId),
        bidPriceInWei
      );

      const res = await tx.wait();
      if (res) {
        const { args } = res.events.find(
          (event) => event.event === "BiddingEvent"
        );
        const orderId = parseInt(formatUnits(args.orderId, "wei"));
        const insertBidding = {
          bidder: wallet,
          bidPrice: bidPrice,
          isActive: true,
          bidId: BigNumber.from(args.bidId).toNumber(),
          orderId: orderId,
        };
        const biddingTransaction = await createBidding(insertBidding);
        const marketWhere = `{orderId: {_eq: ${orderId}}}`;
        const marketSet = `currentPrice: "${bidPrice}"`;
        const updateMarketTx = await updateOrderMarket(marketSet, marketWhere);
        Swal.fire("Success", "Bidding successfully", "success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        Swal.fire("Error", "Transaction fail", "error");
      }
    } catch (err) {
      console.log(" === ERROR === ");
      console.log(err);
    }
    toggle(index, false);

    // props.setIsOpen()
  };

  useEffect(() => {
    prepareUser();
    checkAllowance();
    checkIsDepositForBidding();
  }, []);

  useEffect(() => {
    fetchDepositAmount();
  }, [fetchDepositAmount]);

  const prepareUser = async () => {
    let isValid = await isUserCreated(wallet);
    if (!isValid && wallet) {
      console.log("Create user");
      await createUser(wallet);
    }
  };
  return (
    <>
      <Modal.Header className="modal-headers" closeButton>
        <Modal.Title>
          <p align="center" className="text-makeanoff-h_ex">
            Bidding Asset
          </p>
        </Modal.Title>
      </Modal.Header>
      <hr className="hr-detailpage" />
      <Modal.Body>
        <div className="row">
          <div className="col-xl-12">
            <div className="layout-deatilpage-modal">
              <p className="text-deatilpage-modal">Item</p>
              <hr />
            </div>
            <div className="row modal-detail-layout">
              <div className="col-xl-2">
                <img
                  src={
                    props?.asset?.metadata?.image ||
                    "/assets/image/archiverse/default_img.png"
                  }
                  // src="/assets/rsu-image/music/demo.png"
                  className="img-deatilpage-modal img-fluid my-2"
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                />
              </div>
              <div className="col-xl-4 modal-content-layout">
                {/* <div className="d-flex">
									<h4 className="text-title-deatilpage-modal">
										Xeroca
									</h4>
									<img
										className="ci-green"
										alt=""
										width={20}
										src="/assets/rsu-image/icons/verify-black.svg"
									/>
								</div> */}
                <p className="modal-txt-detail">
                  {props?.asset?.metadata?.name}
                </p>
                {/* <p className="modal-txt-detail2">Loyalty Fees: 2%</p> */}
              </div>
              <div className="col-xl-6 layout-token" align="right">
                <div className="d-flex layout-diamonds">
                  <img
                    height={24}
                    width={24}
                    className="my-2"
                    src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
                  />
                  <p className="layout-token-deatilpage ">
                    <input
                      type="number"
                      disabled={!refundData.isBid}
                      className="form-control search input-search-set height-20"
                      placeholder={props?.marketPlace?.symbol}
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setBidPrice(parseFloat(e.target.value));
                        } else {
                          e.target.value = 0;
                          setBidPrice(0);
                        }
                      }}
                    />
                    {/* {`${bidPrice} ${props.marketPlace.symbol}`} */}
                    {/* {`${props?.marketPlace?.orderType == 1 ? props?.marketPlace?.terminatePrice : props?.marketPlace?.price} ${props?.marketPlace?.symbol}`} */}
                  </p>
                </div>
                {/* <p className="layout-token-deatilpage text-token">
									$53,200.90
								</p> */}
              </div>
              <hr />
            </div>
          </div>
          <div className="col-xl-6 modal-detail-layout">
            <p className="text-deatilpage-modal">Total</p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            <div className="d-flex layout-diamonds">
              <img
                src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
              />
              <p className="layout-token-deatilpage">
                {`${bidPrice || 0} ${props.marketPlace.symbol}`}
                {/* {`${props?.marketPlace?.orderType == 1 ? props?.marketPlace?.terminatePrice : props?.marketPlace?.price} ${props?.marketPlace?.symbol}`} */}
              </p>
            </div>
            {/* <p className="layout-token-deatilpage text-token">
							$53,200.90
						</p> */}
          </div>
          {/* <div className="col-xl-12 modal-detail-layout">
            <input
              type="checkbox"
              id="html"
              checked={form?.user_agreement}
              name="user_agreement"
              value={form?.user_agreement}
              onChange={(e) => {
                handleFormChange(e);
              }}
            />
            <label htmlFor="html" className="text-deatilpage-modal2">
              ข้อตกลงในการใช้งาน{" "}
              <Link href="">
                <u className="text-modal">อ่านข้อตกลง</u>
              </Link>
            </label>
          </div> */}
        </div>
      </Modal.Body>
      <Modal.Footer align="center" style={{ display: "block" }}>
        {allowance ? (
          refundData.isBid ? (
            <ButtonState
              style={"btn btn-primary mb-4"}
              disabled={!form?.user_agreement}
              loading={loading.index === "bid" && loading.status === true}
              onFunction={() => handleSubmit("bid")}
              text={"Bid Now"}
            />
          ) : (
            <ButtonState
              style={"btn btn-primary mb-4"}
              disabled={!form?.user_agreement}
              loading={loading.index === "deposit" && loading.status === true}
              onFunction={() => depositForBidding("deposit", depositAmount)}
              text={`Deposit for bidding (${depositAmount} ${props.marketPlace.symbol})`}
            />
          )
        ) : (
          <ButtonState
            style={"btn btn-primary mb-4"}
            disabled={!form?.user_agreement}
            loading={loading.index === "approve" && loading.status === true}
            onFunction={() => allowanceToken("approve")}
            text={"Approve"}
          />
        )}
      </Modal.Footer>
    </>
  );
}
export default BiddingModal;
