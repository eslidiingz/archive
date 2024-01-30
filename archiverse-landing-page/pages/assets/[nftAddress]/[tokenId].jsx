import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Mainlayout from "../../../components/layouts/Mainlayout";
import React from "react";
import { Table, Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import Select from "../../../components/form/select";
import Modal from "react-bootstrap/Modal";
import DetailBuy from "../../../components/form/DetailBuy";
import { useRouter } from "next/router";

import { getMarketplaces } from "/models/Marketplace";
import { getAssets } from "/models/Asset";
import CancelOrderDialog from "../../../components/modal/CancelOrder";
import { GetShortAddress } from "../../../utils/ethers/connect-metamask";
import { smartContact } from "../../../utils/providers/connector";
import { useWalletContext } from "../../../context/wallet";
import Config from "../../../configs/config";
import { getTransactions } from "../../../models/Transaction";
import { ButtonComponents } from "../../../components/stylecomponents/Button";

// import { txType } from "";
import { capitalize, shortWallet } from "../../../utils/misc";

import ReactTimeAgo from "react-time-ago";
import {
  getBiddingHistory,
  updateBidding,
  updateOrderMarket,
} from "../../../models/Marketplace";
import dayjs from "dayjs";
import CountDownBox from "../../../components/time/countdown";
// import Bidding from "../../../components/form/Bidding";
import BiddingModal from "../../../components/form/Bidding";
import Swal from "sweetalert2";
import { BigNumber, ethers } from "ethers";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import AcceptBiddingModal from "../../../components/form/AcceptBidding";
import MakeOffer from "../../../components/form/MakeOffer";
import { getOfferList } from "../../../models/Offer";
import GetSymbol from "../../../components/symbol/getsymbol";
import { useQueryToken } from "../../../hooks/useQueryToken";
import { useTokenListStore } from "../../../stores/tokenList";
import ButtonState from "../../../components/buttons/ButtonLoading";
// import { useCountdown } from "../../../hooks/useCountDown";
const { txType } = require("../../../constants/transaction.json");
// const { tokenList } = require("/constants/token.json");
const ExploreCollectionDetailart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBidModal, setIsOpenBidModal] = useState(false);
  const [isOpenAcceptBidModal, setIsOpenAcceptBidModal] = useState(false);
  const [isOpenOfferModal, setIsOpenOfferModal] = useState(false);
  const router = useRouter();
  const { wallet } = useWalletContext();

  const { nftAddress, tokenId } = router.query;
  const [isActive, setActive] = useState(false);
  const [asset, setAsset] = useState(null);
  const [marketPlace, setMarketPlace] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [tokenURI, setTokenURI] = useState(null);
  const [feeRate, setFeeRate] = useState(0);
  const [offerList, setOfferList] = useState([]);
  const [latestBid, setLatestBid] = useState({});
  const [tokenAddress, setTokenAddress] = useState(null);
  let initState = {
    placement: false,
    cancel: false,
    closeBid: false,
    acceptBid: false,
    bidding: false,
    showTime: false,
    buy: false,
    offer: false,
  };
  const [isShowBtn, setIsShowBtn] = useState(initState);
  const { tokenList } = useTokenListStore();
  const { token: queryToken } = useQueryToken(tokenAddress);
  const fetchAsset = useCallback(async () => {
    const resToken = await getAssets(
      `{nftAddress: {_eq: "${nftAddress}"}, tokenId: {_eq: ${tokenId}}}`
    );

    if (resToken.status === true) {
      const assetData = resToken.data[0];
      setAsset(assetData);
      await fetchMarketPlace(assetData);
      fetchOfferHistory(assetData);
    }
  }, [nftAddress, tokenId]);

  const fetchAssetHistory = useCallback(async () => {
    const where = `{assets: {nftAddress: {_eq: "${nftAddress}"}, tokenId: {_eq: ${tokenId}}}}`;
    const { data } = await getTransactions(where);
    setTransaction(data);
    // console.log(transaction);
  }, [nftAddress, tokenId]);
  const setConditionShowBtn = (
    marketData = null,
    bidHistoryData = null,
    assetData = null
  ) => {
    if (!assetData) return;
    const condition = initState;

    if (marketData && marketData.isActive) {
      const expTime = new Date(marketData.expiration).getTime();
      const currTime = new Date().getTime();
      condition.placement = false;
      if (assetData.owner == wallet) {
        // -- owner asset --
        if (marketData.orderType == 1) {
          // auction
          if (expTime >= currTime) {
            condition.closeBid = true;
          }
          condition.cancel = true;
        } else {
          // selling
          condition.cancel = true;
        }
      } else {
        //  -- not owner asset --
        if (marketData.orderType == 1) {
          // auction
          if (expTime >= currTime) {
            condition.buy = true;
            condition.bidding = true;
          } else {
            if (
              bidHistoryData[0]?.bidder == wallet &&
              new Date(marketData.acceptTime).getTime() >= currTime
            ) {
              condition.acceptBid = true;
            }
          }
        } else {
          // selling
          condition.buy = true;
        }
      }
    } else {
      // offer process
      if (assetData.owner == wallet) {
        condition.placement = true;
      } else {
        condition.offer = true;
      }
    }
    setIsShowBtn(condition);
  };
  const fetchOfferHistory = useCallback((assetData) => {
    const fetchingOffer = async () => {
      let offerWhere = `{offerTo: {_eq: "${assetData.owner}"}, nftContract : {_eq: "${assetData.nftAddress}"}, tokenId: {_eq: ${assetData.tokenId}}, ownerAppExp: {_gte: "now()"}, isActive: {_eq: true}}`;
      const result = await getOfferList(offerWhere);
      setOfferList(result.data);
    };
    fetchingOffer();
  }, []);
  const fetchMarketPlace = useCallback(
    async (assetData) => {
      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );
      console.log(
        "🚀 ~ file: [tokenId].jsx ~ line 168 ~ marketContract",
        marketContract
      );

      setFeeRate(formatUnits(await marketContract._feeRate(), "wei"));
      const resMarketPlace = await getMarketplaces(
        `{_and: {nftContract: {_eq: "${nftAddress}"}, tokenId: {_eq: ${tokenId}}, isActive: {_eq: true}}}`
      );

      if (resMarketPlace.status === true) {
        const marketData = resMarketPlace.data[0];
        setMarketPlace(marketData);
        setTokenAddress(marketData?.tokenAddress);
        if (marketData && marketData.orderType == 1) {
          const bidData = await getBiddingHistory(marketData.orderId);
          setLatestBid(bidData[bidData.length - 1]);
          setBidHistory(bidData.reverse());
          setConditionShowBtn(marketData, bidData, assetData);
        } else {
          setConditionShowBtn(marketData, null, assetData);
        }
      }
    },
    [nftAddress, tokenId]
  );

  const fetchOrderOnchain = useCallback(async () => {
    if (!router.isReady) return;
    try {
      const nftContract = smartContact(nftAddress, Config.ASSET_ABI, true);
      const ownerOf = await nftContract.ownerOf(parseInt(tokenId));
      const tokenURI = await nftContract.tokenURI(parseInt(tokenId));
    } catch (e) {
      console.error("Error from makeOffer modal fetchOrder : ", e.message);
    }
  }, [router]);
  const closeBidding = async () => {
    const orderId = marketPlace.orderId;
    const marketContract = smartContact(
      Config.MARKETPLACE_CA,
      Config.MARKETPLACE_ABI
    );
    try {
      const closeBidTx = await marketContract.closeBid(orderId);
      const result = await closeBidTx.wait();
      if (result) {
        const { args } = result.events.find(
          (event) => event.event === "CloseBidEvent"
        );
        const isAuctionClosed = args.isAuctionClosed;
        // update expiration
        const currentTime = new Date().toISOString();
        const marketWhere = `{orderId: {_eq: ${orderId}}}`;
        const marketSet = `expiration: "${currentTime}" ${
          isAuctionClosed ? `,isActive: false` : ""
        }`;
        const updateMarketTx = await updateOrderMarket(marketSet, marketWhere);
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (e) {
      console.log("Error from closeBidding : ", e.message);
    }
  };
  const cancelBidding = async (bidId, bidData) => {
    if (bidId <= 0) return;
    try {
      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );
      let cancelBidTx;
      if (queryToken.is_native) {
        const value = {
          value: parseEther(
            parseFloat((bidData.bidPrice * feeRate) / 10000).toString()
          ).toString(),
        };
        const tx = await marketContract.cancelBid(
          marketPlace.orderId,
          bidId,
          value
        );
        cancelBidTx = await tx.wait();
      } else {
        const tx = await marketContract.cancelBid(marketPlace.orderId, bidId);
        cancelBidTx = await tx.wait();
      }
      const result = cancelBidTx;
      if (result) {
        // update bidId to nonactive
        const biddingWhere = `{orderId: {_eq: ${marketPlace.orderId}}, bidId: {_eq: ${bidId}}}`;
        const biddingSet = `isActive: false`;
        const updateBidTx = await updateBidding(biddingSet, biddingWhere);
        // update current price
        const { args } = result.events.find(
          (event) => event.event === "CancelBidEvent"
        );
        const currentPriceInWei = BigNumber.from(args.currentPrice).toString();
        const currentPrice = ethers.utils.formatEther(currentPriceInWei);
        const marketWhere = `{orderId: {_eq: ${marketPlace.orderId}}}`;
        const marketSet = `currentPrice: "${currentPrice}"`;
        const updateMarket = await updateOrderMarket(marketSet, marketWhere);
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (e) {
      console.log("ERROR FROM CANCEL BIDDING : ", e.message);
    }
  };
  const expiredCallback = () => {
    checkCondition();
  };
  const checkCondition = () => {
    const marketData = marketPlace;
    if (marketData && marketData.orderType == 1) {
      setConditionShowBtn(marketData, bidHistory, asset);
    } else {
      setConditionShowBtn(marketData, null, asset);
    }
  };

  useEffect(() => {
    fetchAssetHistory();
    fetchAsset();
  }, []);

  useEffect(() => {
    fetchOrderOnchain();
  }, [fetchOrderOnchain]);

  if (!router.isReady) return;

  // return null;
  return (
    <>
      <div>
        {/* section 1  */}
        <div className="section_explorecollection"></div>
        <Container>
          <Row>
            <Col lg={6}>
              <h1 className="fw-bold">Detail</h1>
            </Col>
            <Col
              lg={6}
              className="d-flex align-items-center justify-content-end"
            >
              <Link href="/">
                <p className="token-txt-link me-2">Home</p>
              </Link>{" "}
              {">"}
              <Link href={`/Explore-collection/${asset?.collectionId}`}>
                <p className="token-txt-link mx-2">{asset?.collection?.name}</p>
              </Link>{" "}
              {">"}
              <Link href="/Explore-collection">
                <p className="token-txt-link ms-2">{asset?.metadata?.name}</p>
              </Link>
            </Col>
          </Row>
        </Container>
        <section>
          <Container>
            <Row>
              <Col lg={6}>
                <div className="token-img-layout mb-lg-0 mb-3">
                  <img
                    className="token-img-size"
                    src={
                      asset?.metadata?.image ||
                      "/assets/image/archiverse/default_img.png"
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "/assets/image/archiverse/default_img.png";
                    }}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <h1 className="fw-bold">{asset?.metadata?.name}</h1>
                <hr className="hr-detail" />
                <h3 className="fw-bold">Description</h3>
                <p className="fw-bold my-4">{asset?.metadata?.description}</p>
                <div className="my-5">
                  <img
                    src={
                      asset?.owner_address?.profileImage ||
                      "/assets/image/archiverse/default_img.png"
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "/assets/image/archiverse/default_img.png";
                    }}
                    className="token-profile-img-layout"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Link
                    href={
                      asset ? `/Explore-collection/users/${asset?.owner}` : "/"
                    }
                  >
                    <span className="ms-2 fw-bold mt-3">
                      Owned by{" "}
                      <u className="ci-purplepink cursor-pointer">
                        {asset !== null ? GetShortAddress(asset?.owner) : null}
                      </u>
                    </span>
                  </Link>
                </div>
                {marketPlace && marketPlace?.orderType == 1 && (
                  <div>
                    <p className="text-des-sub-detail my-2">
                      Sale ends{" "}
                      {marketPlace?.expiration ? (
                        `${dayjs(marketPlace.expiration).format(
                          "DD MMM YYYY"
                        )} at ${dayjs(marketPlace.expiration).format("HH:mm")}`
                      ) : (
                        <i>None</i>
                      )}
                    </p>
                    <div className="row layout-time-detail">
                      <div className="col-xxl-6 col-lg-6 col-sm-6 col-8">
                        <p className="text-time-detail my-2">
                          {marketPlace &&
                          marketPlace.expiration &&
                          new Date(marketPlace.expiration).getTime() >
                            new Date().getTime() ? (
                            <CountDownBox
                              targetDate={new Date(
                                marketPlace.expiration
                              ).getTime()}
                              expiredCallback={() => expiredCallback()}
                            />
                          ) : (
                            `Auction is Expired`
                          )}
                        </p>
                      </div>
                      <div className="col-xxl-6 col-lg-6 col-sm-6 col-4 icon-time-detail d-flex align-items-center">
                        <i className="fas fa-clock"></i>
                      </div>
                    </div>
                  </div>
                )}
                {isShowBtn.offer && (
                  <ButtonComponents
                    color="primary"
                    size="size_140"
                    className="mx-2"
                    onClick={() => setIsOpenOfferModal(!isOpenOfferModal)}
                  >
                    <p>Make offer</p>
                  </ButtonComponents>
                )}
                {
                  // Show in case : 1. auction, 2. owner asset, 3. current time is less than expiration
                  isShowBtn.acceptBid && (
                    <ButtonComponents
                      color="primary"
                      size="size_180"
                      className="mx-2"
                      onClick={() =>
                        setIsOpenAcceptBidModal(!isOpenAcceptBidModal)
                      }
                    >
                      <p>Accept Bidding</p>
                    </ButtonComponents>
                  )
                }
                {isShowBtn.closeBid && (
                  <ButtonComponents
                    color="primary"
                    size="size_140"
                    className="mx-2"
                    onClick={() => closeBidding()}
                  >
                    Close Bid
                  </ButtonComponents>
                )}
                {isShowBtn.bidding && (
                  <ButtonComponents
                    color="primary"
                    size="size_140"
                    className="mx-2"
                    onClick={() => setIsOpenBidModal(!isOpenBidModal)}
                  >
                    Bid
                  </ButtonComponents>
                )}
                {isShowBtn.buy && (
                  <ButtonComponents
                    color="primary"
                    size="size_140"
                    className="mx-2"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Buy Now{" "}
                    {marketPlace &&
                      marketPlace.orderType == 1 &&
                      `( ${marketPlace.terminatePrice.toLocaleString()} ${
                        marketPlace.symbol
                      } )`}
                  </ButtonComponents>
                )}
                {isShowBtn.cancel && (
                  <CancelOrderDialog asset={asset} market={marketPlace} />
                )}
                {isShowBtn.placement && (
                  <div className="row inline-block col-auto">
                    <Link
                      passHref={true}
                      href={`/assets/${nftAddress}/${tokenId}/sell`}
                      className="col-6 mx-2"
                    >
                      <ButtonComponents color="primary" size="size_140">
                        Sell
                      </ButtonComponents>
                    </Link>
                    <Link
                      passHref={true}
                      href={`/assets/${nftAddress}/${tokenId}/auction`}
                      className="col-6 mx-2"
                    >
                      <ButtonComponents color="primary" size="size_140">
                        Auction
                      </ButtonComponents>
                    </Link>
                  </div>
                )}
              </Col>
              <Col lg={6}>
                {marketPlace && (
                  <div className="d-flex justify-content-between mt-3">
                    <span className="text-price-detail2">
                      Current Price
                    </span>
                    <span className="text-price-detail2">
                      {`${
                        marketPlace
                          ? marketPlace.currentPrice.toLocaleString()
                          : "-"
                      } ${marketPlace?.symbol}`}
                    </span>
                  </div>
                )}
              </Col>
              <Col lg={6}>
                {typeof tokenURI?.attributes?.utilities !== "undefined" && (
                  <>
                    <div className="layout-des_sell-detailpage mt-3">
                      <p className="text-title-des">Utilities</p>
                    </div>
                    <div className="layout-des_table-sell pb-lg-3">
                      <div className="row">
                        {tokenURI?.attributes?.utilities?.map(
                          (_utils, index) => {
                            return (
                              <div className="col-xxl-6" key={index}>
                                <div
                                  className="card_new"
                                  style={{
                                    borderRadius: "15px",
                                  }}
                                >
                                  <div className="text-white">
                                    <p className="text12 twoline-dot mb-3">
                                      {_utils?.data?.attributes[1]?.value} :{" "}
                                      {_utils?.data?.attributes[0]?.value}
                                    </p>
                                    <p className="text09-2 twoline-dot2">
                                      Max Coverage :{" "}
                                      {_utils?.data?.attributes[5]?.value || 0}
                                    </p>
                                    <p className="text09-2">
                                      {_utils?.data?.value}{" "}
                                      {_utils?.data?.currency}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </>
                )}
                {typeof tokenURI?.attributes?.vouchers !== "undefined" && (
                  <>
                    <div className="layout-des_sell-detailpage mt-3">
                      <p className="text-title-des">Vouchers</p>
                    </div>
                    <div
                      className="layout-des_table-sell pb-lg-3"
                      style={{ padding: "20px 20px" }}
                    >
                      <div className="row">
                        {tokenURI?.attributes?.vouchers?.map(
                          (_voucher, index) => {
                            return (
                              <div className="col-xxl-6" key={index}>
                                <div
                                  className="card_new"
                                  style={{
                                    borderRadius: "15px",
                                    marginButtom: "0px",
                                  }}
                                >
                                  <div className="text-white">
                                    <p className="text12 twoline-dot mb-3">
                                      {_voucher?.data?.no} :{" "}
                                      {_voucher?.data?.name}
                                    </p>
                                    <p className="text09-2 twoline-dot2">
                                      {_voucher?.data?.detail}
                                    </p>
                                    <p className="text09-2">
                                      {_voucher?.data?.value}{" "}
                                      {_voucher?.data?.currency}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Col>
              <Col lg={6}>
                <div className="token-layout-detail mt-5">
                  <p className="text-title-des">
                    <i className="fas fa-list-alt mx-2"></i>Detail
                  </p>
                </div>
                <div className="token-layout-tabel-detail pb-lg-3">
                  <div className="row">
                    <div className="col-xxl-6 col-lg-6 col-sm-6 col-6">
                      <p>Contract Address</p>
                      <p>Token ID</p>
                      <p>Token Standard</p>
                      <p>Platform Fees</p>
                      <p>Loyalty Fees</p>
                    </div>
                    <div
                      className="col-xxl-6 col-lg-6 col-sm-6 col-6"
                      align="right"
                    >
                      <p>
                        {nftAddress !== null
                          ? GetShortAddress(nftAddress)
                          : null}
                      </p>
                      <p>{tokenId}</p>
                      <p>ERC-721</p>
                      <p>{feeRate / 100}%</p>
                      <p>{asset?.metadata?.loyaltyFee / 100 || 0}%</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                {!marketPlace && (
                  <div>
                    <div className="token-layout-offer mt-5">
                      <p className="text-title-des">
                        <i className="fas fa-list-ul mx-2"></i> Offer
                      </p>
                    </div>
                    <div className="token-layout-detail-offer">
                      <div className="col-12">
                        <Table borderless responsive hover>
                          <thead>
                            <tr className="bd-bottom">
                              <th className="py-3">
                                <p className="mb-0">Offer Price</p>
                              </th>
                              <th className="py-3">
                                <p className="mb-0">Expiration</p>
                              </th>
                              <th className="py-3">
                                <p className="mb-0">From</p>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {offerList.length == 0 && (
                              <tr className="text-center">
                                <td colSpan={3}>
                                  <i>No data</i>
                                </td>
                              </tr>
                            )}
                            {offerList.map((item, index) => {
                              if (index >= 3) return;
                              return (
                                <tr key={index}>
                                  <td className="pt-4 pb-3">
                                    <div className="d-flex align-items-start gap-2 ">
                                      <div>
                                        <p className="mb-0">
                                          {item.offerPrice.toLocaleString()}
                                          {"  "}
                                          <GetSymbol
                                            address={item.tokenAddress}
                                          ></GetSymbol>
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="pt-4 pb-3">
                                    <p className="mb-0">
                                      <ReactTimeAgo
                                        date={new Date(
                                          item.ownerAppExp
                                        ).getTime()}
                                        locale="en-US"
                                      />
                                    </p>
                                  </td>
                                  <td className="pt-4 pb-3">
                                    <div className=" d-flex gap-2 align-items-start ">
                                      <p className="mb-0 ci-green textprofile-table textprofile-des_link cursor-pointer">
                                        {shortWallet(item.offerer)}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
                {marketPlace && marketPlace.orderType == 1 && (
                  <div className="section-bidding ">
                    <div className="layout-des_sell-detailpage mt-5 my-3">
                      <p className="text-title-des">Latest Bids</p>
                    </div>
                    <div className="layout-des_table-sell pb-lg-3">
                      <div className="row">
                        {bidHistory.length > 0 ? (
                          (bidHistory ?? []).map((bid, index) => {
                            if (index < 5)
                              return (
                                <div
                                  className="col-xxl-12 col-lg-12 col-sm-12 col-12"
                                  key={index}
                                >
                                  <div className="row box">
                                    <div className="col-xxl-2 col-lg-2 col-2 d-flex align-items-center my-1">
                                      <img
                                        src={
                                          bid?.user?.profileImage ||
                                          "/assets/image/archiverse/default_img.png"
                                        }
                                        className="img-profile-detail"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "100%",
                                        }}
                                        onError={({ currentTarget }) => {
                                          currentTarget.onerror = null; // prevents looping
                                          currentTarget.src =
                                            "/assets/image/archiverse/default_img.png";
                                        }}
                                        // className="img-thumbnail"
                                        // style={{borderRadius: "100%", padding: 0, backgroundColor: "transparent"}}
                                      />
                                    </div>
                                    <div className="col-xxl-4 col-lg-4 col-md-4 col-4 d-flex align-items-center">
                                      <div className="d-flex flex-column">
                                      <p className="text_profile_ex">
                                        {shortWallet(bid.bidder)}
                                      </p>
                                      <p className="text_profile_ex02">{`${bid.bidPrice} ${marketPlace.symbol}`}</p>
                                      </div>
                                    </div>
                                    <div
                                      className="col-xxl-6 col-lg-6 col-md-6 col-6"
                                      align="right"
                                    >
                                      <div className="d-flex justify-content-end align-items-center h-100">
                                        {bid.bidder === wallet &&
                                          wallet !== marketPlace.sellerWallet &&
                                          new Date(
                                            marketPlace.expiration
                                          ).getTime() > new Date().getTime() && (
                                            // <button
                                            //   className="text-detailpage-cancle"
                                            //   onClick={() =>
                                            //     cancelBidding(bid.bidId, bid)
                                            //   }
                                            // >
                                            //   Cancel Bid
                                            // </button>
                                            <ButtonState
                                              style={"btn btn-danger btm-sm my-2 mx-2"}
                                              // disabled={!form?.user_agreement}
                                              // loading={loading.index === "approve" && loading.status === true}
                                              onFunction={() => cancelBidding(bid.bidId, bid)}
                                              text={"cancel bid"}
                                            />
                                          )}
                                        <p className="text-detail03_ex d-flex align-items-center">
                                          <ReactTimeAgo
                                            date={new Date(
                                              bid.createdAt
                                            ).getTime()}
                                            locale="en-US"
                                          />
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                          }).filter(item => item)
                        ) : (
                          <div className="col-xxl-4 col-lg-4 col-md-4 col-4 text-center">
                            <i>No data</i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Col>
              <Col xl={12}>
                <div className="token-layout-main-act">
                  <p className="text-title-des">Item Activity</p>
                </div>
                <div className="token-layout-detail-act">
                  <div className="col-12 mt-lg-3 exp-table">
                    <Table borderless responsive hover>
                      <thead>
                        <tr className="bd-bottom">
                          <th className="py-3">
                            <p className="mb-0">Event</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">Price</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">From</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">To</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">Date</p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction !== null &&
                          transaction.map((_i, index) => {
                            return (
                              <tr key={index}>
                                <td className="pt-4 pb-3">
                                  <div className="d-flex align-items-start gap-2 ">
                                    <i className="fas fa-shopping-cart"></i>
                                    <div>
                                      <p className="mb-0">
                                        {capitalize(txType[_i.txType])}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="pt-4 pb-3">
                                  <div className="d-flex align-items-start gap-2 ">
                                    <div>
                                      <p className="mb-0">
                                        {_i.price
                                          ? _i.price.toLocaleString()
                                          : "-"}{" "}
                                        {_i?.market_order?.symbol}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0">
                                    {_i.from !== null
                                      ? GetShortAddress(_i.from)
                                      : null}
                                  </p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0">
                                    {_i.to !== null
                                      ? GetShortAddress(_i.to)
                                      : null}
                                  </p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start cursor-pointer">
                                    <p className="mb-0 ci-green textprofile-des_link">
                                      <ReactTimeAgo
                                        date={new Date(_i.createdAt).getTime()}
                                        locale="en-US"
                                      />{" "}
                                      <Link
                                        href={`${Config.EXPLORER}/tx/${_i.txHash}`}
                                      >
                                        <a target={"_blank"}>
                                          <i className="fas fa-external-link"></i>
                                        </a>
                                      </Link>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        {/* end-section 2  */}
      </div>
      {/* Modal  */}
      <Modal
        show={isOpenOfferModal}
        onHide={() => setIsOpenOfferModal(!isOpenOfferModal)}
        size="lg"
      >
        <MakeOffer asset={asset} feeRate={feeRate} />
      </Modal>
      <Modal
        show={isOpenAcceptBidModal}
        onHide={() => setIsOpenAcceptBidModal(!isOpenAcceptBidModal)}
        size="lg"
      >
        <AcceptBiddingModal
          asset={asset}
          marketPlace={marketPlace}
          bidHistory={bidHistory}
          latestBid={latestBid}
          feeRate={feeRate}
        />
      </Modal>
      <Modal
        show={isOpenBidModal}
        onHide={() => setIsOpenBidModal(!isOpenBidModal)}
        size="lg"
      >
        <BiddingModal
          asset={asset}
          marketPlace={marketPlace}
          bidHistory={bidHistory}
          feeRate={feeRate}
          // setIsOpen={() => setIsOpenBidModal(!isOpenBidModal)}
        />
      </Modal>
      <Modal show={isOpen} onHide={() => setIsOpen(!isOpen)} size="lg">
        <DetailBuy
          asset={asset}
          marketPlace={marketPlace}
          setIsOpen={() => setIsOpen(!isOpen)}
          feeRate={feeRate}
        />
      </Modal>
    </>
  );
};

export default ExploreCollectionDetailart;
ExploreCollectionDetailart.layout = Mainlayout;
