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
import { formatEther, parseEther } from "ethers/lib/utils";
import ButtonState from "../buttons/ButtonLoading";
import useLoading from "../../hooks/useLoading";
import Swal from "sweetalert2";
import { useQueryToken } from "../../hooks/useQueryToken";
import GetSymbol from "../symbol/getsymbol";

function DetailBuy(props) {
  console.log("🚀 ~ file: DetailBuy.jsx ~ line 19 ~ DetailBuy ~ props", props);
  const router = useRouter();
  const loyaltyFee = props?.asset?.metadata?.loyaltyFee / 100 ?? 0;
  const { wallet } = useWalletContext();
  const [marketFee, setMarketFee] = useState(2);
  const price =
    props?.marketPlace?.orderType == 1
      ? props?.marketPlace?.terminatePrice
      : props?.marketPlace?.price;
  const [form, setForm] = useState({
    user_agreement: false,
  });

  const [allowance, setAllowance] = useState(false);
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
  }, [wallet]);

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
      const tx = await transaction.wait();
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
    toggle(index, true);

    try {
      const sm = smartContact(Config.MARKETPLACE_CA, Config.MARKETPLACE_ABI);
      let res;
      if (queryToken.is_native) {
        const value = {
          value: parseEther(price + "").toString(),
        };
        const tx = await sm.buyOrder(
          parseInt(props.marketPlace.orderId),
          value
        );
        res = await tx.wait();
      } else {
        const tx = await sm.buyOrder(parseInt(props.marketPlace.orderId));
        res = await tx.wait();
      }

      if (res) {
        // console.log(" === UPDATE ASSET=== ")
        const asset_where = `{tokenId: {_eq: ${props?.asset?.tokenId}},nftAddress: {_eq: "${props?.asset?.nftAddress}"}}`;
        const asset_set = `owner: "${wallet}"`;
        const updateAssetReturn = await updateAsset(asset_set, asset_where);

        if (updateAssetReturn) {
          // console.log(" === UPDATE MARKETPLACE === ")
          const marketorder_where = `{id: {_eq: ${props.marketPlace.id}}}`;
          const marketorder_set = `buyerWallet: "${wallet}", isActive: false, note: "Buy Order"`;
          const updateOrderMarketReturn = await updateOrderMarket(
            marketorder_set,
            marketorder_where
          );

          if (updateOrderMarketReturn) {
            const obj = {
              txHash: res.transactionHash,
              txType: 1,
              price: price,
              collectionId: props.asset.collectionId,
              assetId: props.asset.id,
              from: props.asset.owner,
              to: wallet,
              marketOrderId: props.marketPlace.id,
              asset_ids: [props.asset.id],
            };
            const resTransactions = await createTransactions(obj);

            if (resTransactions) {
              props.setIsOpen();
              toggle(index, false);
              Swal.fire("Success", "Buy order successfully", "success");
              setTimeout(() => {
                router.push("/Profile?tab=inventory");
              }, 1000);
            }
          }
        }
      }
    } catch (err) {
      console.log(" === ERROR === ");
      console.log(err?.message);
      Swal.fire("", "Payment failed", "error");
      toggle(index, false);
    }

    // props.setIsOpen()
  };
  const init = useCallback(() => {
    const getMarketFee = async () => {
      const contract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );
      const tx = await contract._feeRate();
      setMarketFee(tx.toNumber() / 100);
    };
    getMarketFee();
  }, []);
  useEffect(() => {
    checkAllowance();
    init();
  }, [checkAllowance]);

  return (
    <>
      <Modal.Header className="modal-headers" closeButton>
        <Modal.Title>
          <p align="center" className="text-makeanoff-h_ex">
            Buy Asset
          </p>
        </Modal.Title>
      </Modal.Header>
      <hr className="hr-detailpage" />
      <Modal.Body>
        <div className="row">
          <div className="col-xl-12">
            <div className="layout-deatilpage-modal ">
              <p className="text-deatilpage-modal px-3">Item</p>
              <hr />
            </div>
            <div className="row modal-detail-layout">
              <div className="col-xl-2 fit-content">
                <img
                  src={
                    props?.asset?.metadata?.image ||
                    "/assets/image/archiverse/default_img.png"
                  }
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                  className="img-deatilpage-modal img-fluid"
                />
              </div>
              <div className="col-xl-4 modal-content-layout">
                <p className="modal-txt-detail">
                  {props?.asset?.metadata?.name}
                </p>
                <p className="modal-txt-detail2">
                  Token Id : {props?.asset?.tokenId}
                </p>
              </div>
              {/* <div className="col-xl-6 layout-token" align="right">
                <div className="d-flex layout-diamonds">
                </div>
              </div> */}
              <hr />
            </div>
          </div>

          {/* <div className="col-xl-6 modal-detail-layout">
            <p className="text-deatilpage-modal mx-3">Loyalty fee ({loyaltyFee}%)</p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            <div className="d-flex layout-diamonds mx-2">
              <img
                src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
              />
              <p className="layout-token-deatilpage">
                {price * marketFee / 100} <GetSymbol address={props?.marketPlace?.tokenAddress}></GetSymbol>
              </p>
            </div>
          </div>

          <div className="col-xl-6 modal-detail-layout">
            <p className="text-deatilpage-modal mx-3">Platform Fees ({marketFee}%)</p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            <div className="d-flex layout-diamonds mx-2">
              <img
                src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
              />
              <p className="layout-token-deatilpage">
                {price * marketFee / 100} <GetSymbol address={props?.marketPlace?.tokenAddress}></GetSymbol>
              </p>
            </div>
          </div> */}

          <div className="col-xl-6 modal-detail-layout ">
            <p className="text-deatilpage-modal mx-3">Total</p>
          </div>
          <div className="col-xl-6 modal-detail-layout" align="right">
            <div className="d-flex layout-diamonds mx-2">
              <img
                src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
              />
              <p className="layout-token-deatilpage">
                {`${parseFloat(price).toFixed(2)} ${
                  props?.marketPlace?.symbol
                }`}
              </p>
            </div>
          </div>

          {/* <div className="col-xl-12 layout-deatilpage-modal mx-4">
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
            style={"btn-primary px-5 py-2"}
            disabled={!form?.user_agreement}
            loading={loading.index === "buy" && loading.status === true}
            onFunction={() => handleSubmit("buy")}
            text={"Buy Now"}
          />
        ) : (
          <ButtonState
            style={"btn-primary  px-5 py-2"}
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
export default DetailBuy;
