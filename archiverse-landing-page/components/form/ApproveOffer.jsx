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
import { BigNumber, ContractFactory } from "ethers";
import { createBidding, updateBidding } from "../../models/Marketplace";
import { createUser, isUserCreated } from "../../models/User";
import { getAssets } from "../../models/Asset";
import { updateOffer } from "../../models/Offer";
import GetSymbol from "../symbol/getsymbol";

function ApproveOfferModal({ offerData }) {
  const router = useRouter();

  const { wallet } = useWalletContext();

  const [form, setForm] = useState({
    user_agreement: false,
  });
  //   const [bidPrice, setBidPrice] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [isApproval, setIsApproval] = useState(false);
  const [assetData, setAssetData] = useState({});
  const { toggle, loading } = useLoading();
  const [feeRate, setFeeRate] = useState(2); // loyalty fee rate
  const [marketFee, setMarketFee] = useState(2); // marketplace fee rate

  const checkAllowance = useCallback(async () => {
    const tokenAddress = offerData.tokenAddress;
    if (!tokenAddress) return;
    const tokenContract = smartContact(tokenAddress, Config.ERC20_ABI, true);
    const allowance = await tokenContract.allowance(
      wallet,
      Config.MARKETPLACE_CA
    );
    if (formatEther(allowance) > 0) {
      setAllowance(true);
    }
  }, []);

  const allowanceToken = async (index) => {
    toggle(index, true);
    try {
      const tokenContract = smartContact(
        offerData.tokenAddress,
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
  const handleSubmit = async (index) => {
    // const currentBidPrice = props.bidHistory[0].bidPrice;
    toggle(index, true);
    try {
      // winner accept bidding
      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );
      const approveOfferTx = await marketContract.ownerApproveOffer(
        offerData.offerId
      );
      const result = await approveOfferTx.wait();
      if (result) {
        const offerWhere = `{
                offerer: {_eq: "${offerData.offerer}"},
                offerTo: {_eq: "${wallet}"},
                isActive: {_eq: true},
                nftContract: {_eq: "${offerData.nftContract}"},
                tokenId: {_eq: ${offerData.tokenId}},
                offerId: {_eq: ${offerData.offerId}}
            }`;
        const day = 60 * 60 * 24;
        const offerAccExp = new Date().getTime() + day * 3 * 1000;
        const offerSet = `isOwnerApprove: true, offerAccExp: "${new Date(
          offerAccExp
        ).toISOString()}"`;
        const updateOfferTx = await updateOffer(offerSet, offerWhere);
        Swal.fire("Success", "Confirm offer successfully", "success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        Swal.fire("Error", "Transaction fail", "error");
      }
      // }
    } catch (err) {
      console.log(" === ERROR === ");
      console.log(err);
    }
    toggle(index, false);

    // props.setIsOpen()
  };
  const setApproval = async (index) => {
    toggle(index, true);
    const assetContract = smartContact(offerData.nftContract, Config.ASSET_ABI);
    try {
      const setApprovalTx = await assetContract.setApprovalForAll(
        Config.MARKETPLACE_CA,
        true
      );
      const result = await setApprovalTx.wait();
      if (result) {
        setIsApproval(true);
      }
    } catch {}
    toggle(index, false);
    // setTimeout(() => {
    //     location.reload()
    // }, 1000)
  };
  const init = useCallback(() => {
    const fetchAssetData = async () => {
      const assetWhere = `{nftAddress: {_eq: "${offerData.nftContract}"}, tokenId: {_eq: ${offerData.tokenId}}}`;
      const assets = await getAssets(assetWhere);
      if (assets.data.length == 1) {
        let _assetData = assets.data[0];
        const _feeRate = _assetData.metadata.loyaltyFee;
        setFeeRate(_feeRate / 100);
        setAssetData(_assetData);
      }
    };
    const checkApproval = async () => {
      console.log("OfferData : ", offerData);
      const assetContract = smartContact(
        offerData.nftContract,
        Config.ASSET_ABI
      );
      const isApprovalVal = await assetContract.isApprovedForAll(
        wallet,
        Config.MARKETPLACE_CA
      );
      setIsApproval(isApprovalVal);
    };
    const getMarketFeeRate = async () => {
      try {
        const contract = smartContact(
          Config.MARKETPLACE_CA,
          Config.MARKETPLACE_ABI
        );
        const tx = await contract._feeRate();
        setMarketFee(tx.toNumber());
      } catch (e) {
        console.log(
          "ERROR FROM (getMarketFee) approve offer modal : ",
          e.message
        );
      }
    };
    // checkAllowance();
    getMarketFeeRate();
    checkApproval();
    fetchAssetData();
  }, []);
  useEffect(() => {
    init();
    // checkIsDepositForBidding();
  }, []);
  return (
    <div>
      <Modal.Header className="modal-headers" closeButton>
        <Modal.Title>
          <p align="center" className="text-makeanoff-h_ex">
            Approve Offer
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
                    assetData?.metadata?.image ||
                    "/assets/image/archiverse/default_img.png"
                  }
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                  className="img-deatilpage-modal img-fluid"
                  alt="..."
                />
              </div>
              <div className="col-xl-4 modal-content-layout">
                <p className="modal-txt-detail">{assetData?.metadata?.name}</p>
                <p className="modal-txt-detail2">
                  Loyalty Fees: {feeRate ?? 0}%
                </p>
              </div>
              <div className="col-xl-6 layout-token" align="right">
                <div className="d-flex layout-diamonds">
                  {/* <img
                        src="/assets/swaple/icon-omcoin.webp"
                        className="img-token"
                    /> */}
                  <p className="layout-token-deatilpage ">
                    {offerData?.offerPrice.toLocaleString()}{" "}
                    <GetSymbol address={offerData?.tokenAddress}></GetSymbol>
                  </p>
                </div>
              </div>
              <hr />
            </div>
          </div>
          <div className="col-xl-6 modal-detail-layout">
            <p className="text-deatilpage-modal">Loyalty Fees ({feeRate}%)</p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            <p className="layout-token-deatilpage">
              {(offerData?.offerPrice * feeRate) / 100}{" "}
              <GetSymbol address={offerData?.tokenAddress}></GetSymbol>
            </p>
          </div>
          <div className="col-xl-6 modal-detail-layout">
            <p className="text-deatilpage-modal">
              Platform Fees ({marketFee}%)
            </p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            <p className="layout-token-deatilpage">
              {(offerData?.offerPrice * marketFee) / 100}{" "}
              <GetSymbol address={offerData?.tokenAddress}></GetSymbol>
            </p>
          </div>
          <div className="col-xl-6 modal-detail-layout">
            <p className="text-deatilpage-modal">Total</p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            {/* <div className="d-flex layout-diamonds"> */}
              {/* <img
                    src="/assets/swaple/icon-omcoin.webp"
                    className="img-token"
                /> */}
              <p className="layout-token-deatilpage">
                {`${(
                  offerData?.offerPrice
                  // offerData?.offerPrice -
                  // (offerData?.offerPrice * feeRate) / 100 -
                  // (offerData?.offerPrice * marketFee) / 100
                ).toLocaleString()}`}{" "}
                <GetSymbol address={offerData?.tokenAddress}></GetSymbol>
                {/* {`${props?.marketPlace?.orderType == 1 ? props?.marketPlace?.terminatePrice : props?.marketPlace?.price} ${props?.marketPlace?.symbol}`} */}
              </p>
            {/* </div> */}
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
        {isApproval ? (
          <ButtonState
            style={"btn btn-primary mb-4"}
            disabled={!form?.user_agreement}
            loading={loading.index === "accept" && loading.status === true}
            onFunction={() => handleSubmit("accept")}
            text={"Confirm offer"}
          />
        ) : (
          <ButtonState
            style={"btn btn-primary mb-4"}
            disabled={!form?.user_agreement}
            loading={loading.index === "approve" && loading.status === true}
            onFunction={() => setApproval("approve")}
            text={"Approve"}
          />
        )}
      </Modal.Footer>
    </div>
  );
}
export default ApproveOfferModal;
