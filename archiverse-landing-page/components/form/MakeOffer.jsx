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
import { insertOffer } from "../../models/Offer";
import TokenListSelect from "../sell/token-list";
import { useQueryToken } from "../../hooks/useQueryToken";
import { useTokenListStore } from "../../stores/tokenList";
const { tokenList } = require("/constants/token.json");
function MakeOffer(props) {
  const router = useRouter();

  const { wallet } = useWalletContext();

  const [form, setForm] = useState({
    user_agreement: false,
  });
  const [offerPrice, setOfferPrice] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);
  const { toggle, loading } = useLoading();
  const { tokenList } = useTokenListStore();
  // const [iconToken, setIconToken] = useState("");
  const { token: queryToken } = useQueryToken(
    tokenAddress || tokenList[0].attributes.address
  );
  const checkAllowance = useCallback(async () => {
    if (!tokenAddress) return;
    toggle("approve", true);
    toggle("offer", true);
    const tokenContract = smartContact(tokenAddress, Config.ERC20_ABI, true);
    try {
      setOfferPrice(0);
      document.getElementById("input-offer").value = 0;
      const allowance = await tokenContract.allowance(
        wallet,
        Config.MARKETPLACE_CA
      );
      if (formatEther(allowance) > 0) {
        setAllowance(true);
      } else {
        setAllowance(false);
      }
    } catch (e) {
      console.error("Error from makeOffer modal : ", e.message);
    }
    toggle("approve", false);
    toggle("offer", false);
  }, [tokenAddress, wallet]);

  const allowanceToken = async (index) => {
    toggle(index, true);
    if (!tokenAddress) return;
    try {
      const tokenContract = smartContact(tokenAddress, Config.ERC20_ABI);
      const transaction = await tokenContract.approve(
        Config.MARKETPLACE_CA,
        Config.UNLIMIT_ALLOWANCE
      );
      const tx = await transaction.wait(5);
      setAllowance(true);
      toggle(index, false);
    } catch (error) {
      Swal.fire("Error", "Transaction fail", "error");
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

  const countDecimals = (value) => {
    if (Math.floor(value) === value || isNaN(value)) return 0;
    return value.toString().split(".")[1].length || 0;
  };

  const handleSubmit = async (index) => {
    if (offerPrice <= 0 || !tokenAddress) {
      Swal.fire("Error", "Enter offer price", "error");
      setOfferPrice(0);
      return;
    }
    toggle(index, true);
    try {
      const makeOfferPriceInWei = BigNumber.from(
        parseEther(offerPrice.toString())
      ).toString();
      // const bidPriceInWei = BigNumber.from(parseEther(bidPrice.toString())).toString()
      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );
      const { nftAddress, owner, tokenId } = props.asset;
      // const tokenAddress = tokenList[0].address;
      const makeOfferTx = await marketContract.makeOffer(
        makeOfferPriceInWei,
        tokenAddress,
        owner,
        tokenId,
        nftAddress
      );
      const result = await makeOfferTx.wait();
      if (result) {
        const { args } = result.events.find(
          (event) => event.event === "CreateOfferEvent"
        );
        const offerId = parseInt(formatUnits(args.offerId, "wei"));
        // insert offer table
        const day = 60 * 60 * 24;
        const ownerAppExp = new Date().getTime() + day * 3 * 1000;
        const offerAccExp = new Date().getTime() + day * 6 * 1000;
        const insertOfferObj = {
          offerer: wallet,
          tokenAddress: tokenAddress.toString(),
          nftContract: nftAddress.toString(),
          offerPrice: offerPrice,
          tokenId: tokenId,
          offerId: offerId,
          offerTo: owner,
          ownerAppExp: new Date(ownerAppExp).toISOString(),
          offerAccExp: new Date(offerAccExp).toISOString(),
        };
        const insertOfferTx = await insertOffer(insertOfferObj);
        Swal.fire("Success", "Make offer successfully", "success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        Swal.fire("Error", "Transaction fail", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Transaction fail", "error");
      console.log(" === ERROR === ");
      console.log(err);
    }
    toggle(index, false);
  };

  useEffect(() => {
    checkAllowance();
  }, [tokenAddress, checkAllowance]);
  return (
    <>
      <Modal.Header className="modal-headers" closeButton>
        <Modal.Title>
          <h2 align="center" className="fw-bold">
            Make Offer
          </h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-xl-12">
            <div className="layout-deatilpage-modal">
              <h5 className="fw-semibold">Item</h5>
            </div>
            <div className="row my-4">
              <div className="col-xl-2">
                <div className="modal-offer-layout-img">
                  <img
                    src={
                      props?.asset?.metadata?.image ||
                      "/assets/image/archiverse/default_img.png"
                    }
                    onError={(e) => {
                      e.target.src = "/assets/image/archiverse/default_img.png";
                      e.target.onError = null;
                    }}
                    className="modal-offer-img-size"
                  />
                </div>
              </div>
              <div className="col-xl-4 modal-content-layout">
                <p className="modal-txt-detail">
                  {props?.asset?.metadata?.name}
                </p>
              </div>
            </div>
            <div className="row modal-detail-layout">
              <div className="form-group my-2">
                <label htmlFor="formGroupExampleInput">
                  <h6 className="fw-semibold mb-3">Offer with token</h6>
                </label>
                <TokenListSelect
                  onSelect={(e) =>
                    setTokenAddress(e.split(":")[1].replace(/\s/g, ""))
                  }
                />
              </div>
              <div className="form-group my-2">
                <label htmlFor="">
                  <p className="create-detail-txt form-label">Offer Price</p>
                </label>
                <input
                  type="number"
                  disabled={!allowance}
                  placeholder="Offer Price"
                  id="input-offer"
                  className="input-search-set form-control"
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);
                    if (value >= 0) {
                      if (countDecimals(value) >= 3) {
                        e.target.value = value.toFixed(2);
                      }
                      setOfferPrice(value.toFixed(2));
                    } else {
                      setOfferPrice(null);
                      e.target.value = null;
                    }
                  }}
                />
              </div>

              <div className="row">
                <div className="col-xl-6 col-md-6 col-sm-6 modal-content-layout">
                  <p className="modal-txt-detail">Total</p>
                </div>
                <div className="col-xl-6 col-md-6 col-sm-6 modal-content-layout">
                  <p className="layout-token-deatilpage text-end">
                    <img
                      height={24}
                      width={24}
                      src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
                    />{" "}
                    {offerPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer align="center" style={{ display: "block" }}>
        {allowance ? (
          <ButtonState
            style={"btn btn-primary mb-4 px-4"}
            disabled={!form?.user_agreement}
            loading={loading.index === "offer" && loading.status === true}
            onFunction={() => handleSubmit("offer")}
            text={"Make offer"}
          />
        ) : (
          <ButtonState
            style={"btn btn-primary mb-4 px-4"}
            disabled={tokenAddress}
            loading={loading.index === "approve" && loading.status === true}
            onFunction={() => allowanceToken("approve")}
            text={"Approve"}
          />
        )}
      </Modal.Footer>
    </>
  );
}
export default MakeOffer;
