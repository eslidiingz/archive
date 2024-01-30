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
import { web3Provider } from "../../utils/providers/connector";

function AcceptBiddingModal(props) {
  const router = useRouter();

  const { wallet } = useWalletContext();

  const [form, setForm] = useState({
    user_agreement: false,
  });
  //   const [bidPrice, setBidPrice] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [refundData, setRefundData] = useState({
    isBid: false,
    isRefund: false,
  });
  const { toggle, loading } = useLoading();
  const { token: queryToken } = useQueryToken(props?.marketPlace?.tokenAddress);

  const checkAllowance = useCallback(async () => {
    const tokenContract = smartContact(
      props?.marketPlace?.tokenAddress,
      Config.ERC20_ABI,
      true
    );
    const allowance = await tokenContract.allowance(
      wallet,
      Config.MARKETPLACE_CA
    );
    if (formatEther(allowance) > 0) {
      setAllowance(true);
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
      const tx = await transaction.wait(5);
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

  const handleSubmit = async (index) => {
    // const currentBidPrice = props.bidHistory[0].bidPrice;
    toggle(index, true);
    try {
      // winner accept bidding
      const orderId = props.marketPlace.orderId;
      const tokenId = props.marketPlace.tokenId;

      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );

      let result;

      if (queryToken.is_native) {
        const _amount = {
          value: parseEther(props?.latestBid?.bidPrice + ""),
        };

        const acceptBiddingTx = await marketContract.winnerAcceptBid(
          orderId,
          _amount
        );
        result = await acceptBiddingTx.wait();
      } else {
        const acceptBiddingTx = await marketContract.winnerAcceptBid(orderId);
        result = await acceptBiddingTx.wait();
      }

      if (result) {
        const { args } = result.events.find(
          (event) => event.event === "WinnerAcceptBidEvent"
        );
        const bidId = BigNumber.from(args.bidId).toNumber();
        // update asset
        const assetWhere = `{tokenId: {_eq: ${tokenId}}}`;
        const assetSet = `owner: "${wallet}"`;
        const updateAssetTx = await updateAsset(assetSet, assetWhere);
        console.log(updateAsset);
        // add transaction
        const txObj = {
          txHash: result.transactionHash,
          txType: 4,
          price: props.marketPlace.currentPrice,
          collectionId: props.asset.collectionId,
          assetId: props.asset.id,
          from: wallet,
          to: props.marketPlace.sellerWallet,
          marketOrderId: orderId,
          asset_ids: [props.asset.id],
        };
        console.log("Transaction : ", txObj);
        const rexTx = await createTransactions(txObj);
        // update market
        const marketWhere = `{orderId: {_eq: ${orderId}}}`;
        const marketSet = `isActive: false, buyerWallet: "${wallet}", note: "Winner accept bidding"`;
        const updateMarketTx = await updateOrderMarket(marketSet, marketWhere);
        // update isAccept at bidding
        const bidWhere = `{bidId: {_eq: ${bidId}}}`;
        const bidSet = `isAccept: true`;
        const updateBidTx = await updateBidding(bidSet, bidWhere);
        Swal.fire("Success", "Accept bidding successfully", "success");
        toggle(index, false);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        Swal.fire("Error", "Transaction fail", "error");
        toggle(index, false);
      }
      // }
    } catch (err) {
      console.log(" === ERROR === ");
      console.log(err);
      toggle(index, false);
    }

    // props.setIsOpen()
  };

  useEffect(() => {
    prepareUser();
    checkAllowance();
    // checkIsDepositForBidding();
  }, [checkAllowance]);
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
            Accept Bidding
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
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                  // src="/assets/rsu-image/music/demo.png"
                  className="img-deatilpage-modal img-fluid"
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
                <p className="modal-txt-detail2">
                  Token id : {props?.asset?.tokenId}
                </p>
              </div>
              <div className="col-xl-6 layout-token" align="right">
                <div className="d-flex layout-diamonds">
                  <img
                    height={24}
                    width={24}
                    src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
                  />
                  <p className="layout-token-deatilpage ">
                    {props.latestBid.bidPrice} {props.marketPlace.symbol}
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
                height={24}
                width={24}
                src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
              />
              <p className="layout-token-deatilpage">
                {`${props.latestBid.bidPrice} ${props.marketPlace.symbol}`}
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
          <ButtonState
            style={"btn btn-primary mb-4"}
            disabled={!form?.user_agreement}
            loading={loading.index === "accept" && loading.status === true}
            onFunction={() => handleSubmit("accept")}
            text={"Accept bidding"}
          />
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
export default AcceptBiddingModal;
