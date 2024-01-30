import { useCallback, useEffect, useReducer, useState } from "react";
import Link from "next/link";
import Mainlayout from "../../../../components/layouts/Mainlayout";
import React from "react";
import { Table, Tabs, Tab, Form, Spinner, Row, Col } from "react-bootstrap";

import { smartContact } from "../../../../utils/providers/connector";
import Config from "../../../../configs/config";
import UtilitiesListSelect from "../../../../components/sell/utilitiy-list";
import TokenListSelect from "../../../../components/sell/token-list";
import { useRouter } from "next/router";
import { GetShortAddress } from "../../../../utils/ethers/connect-metamask";
import ButtonState from "../../../../components/buttons/ButtonLoading";
import useLoading from "../../../../hooks/useLoading";
import { BigNumber, constants, Contract, providers, Wallet } from "ethers";
import { formatUnits, id, parseEther, parseUnits } from "ethers/lib/utils";
import Swal from "sweetalert2";
import {
  createBidding,
  createOrderMarket,
  setUtilityMetadata,
} from "../../../../models/Marketplace";
import { useWalletContext } from "../../../../context/wallet";
import { createTransactions } from "../../../../models/Transaction";
import { getAssets } from "../../../../models/Asset";

import RangeSlider from "react-bootstrap-range-slider";
// import { getPoliciesList } from "../../../../models/Covest";
import { getVouchers } from "../../../../models/Voucher";
import { updateOffer } from "../../../../models/Offer";

const AssetsSellPage = () => {
  const { toggle, loading } = useLoading();
  const router = useRouter();
  const { nftAddress, tokenId, type } = router.query;
  const { wallet } = useWalletContext();

  const [percentUtilities, setPercentUtilities] = useState(10);

  const [startPrice, setStartPrice] = useState(null);
  const [expiration, setExpiration] = useState(null);
  const [isApprove, setIsApprove] = useState(false);
  // const [metadata, setMetadata] = useState(null);
  const [asset, setAsset] = useState(null);
  const [nftOwner, setNftOwner] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [utilities, setUtilities] = useState([]);
  const [profileOwner, setProfileOwner] = useState(null);
  const [poolList, setPoolList] = useState([]);
  const [terminatePrice, setTerminatePrice] = useState(0);
  const [feeRate, setFeeRate] = useState(0);

  // const fetchFactoryPolicies = async () => {
  //   const factory = await getPoliciesList();
  //   console.log("Factory : ", factory);

  //   const utilities = factory.map((_f) => {
  //     return {
  //       poolId: _f.poolId,
  //       poolName: _f.poolName,
  //       premiumAmount: _f.premiumAmount,
  //       currency: _f.currency,
  //       from: "covest",
  //     };
  //   });
  //   const { data } = await getVouchers();

  //   let voucher = [];
  //   if (data.length > 0) {
  //     voucher = data.map((_i) => {
  //       return {
  //         poolId: _i.no,
  //         poolName: _i.name,
  //         premiumAmount: _i.premiumAmount,
  //         currency: _i.currency,
  //         from: "voucher",
  //       };
  //     });
  //   }

  //   // const poolArr = utilities.concat(voucher);
  //   const poolArr = voucher;

  //   const poolOption = poolArr.map((_i) => {
  //     return {
  //       label: `(${_i.premiumAmount} ${_i.currency}) ${_i.poolId} : ${_i.poolName}`,
  //       value: _i,
  //     };
  //   });

  //   setPoolList(poolOption);
  // };

  const fetchProfileOwner = useCallback(async () => {
    if (!router.isReady) return;
    const ownerProfile = await fetch(`/api/users?wallet=${wallet}`);
    const owner = await ownerProfile.json();

    setProfileOwner(owner);
  }, [router]);

  const fetchNFTList = useCallback(async () => {
    console.log("try to fetch nft list");
    if (!router.isReady) return;

    const instanceContract = smartContact(nftAddress, Config.ASSET_ABI);
    // const tokenURI = await instanceContract.tokenURI(tokenId);
    // const tokenURI = await fetch(`/api/metadata?tokenId=${tokenId}`);
    const ownerOf = await instanceContract.ownerOf(tokenId);
    // console.log(tokenURI);
    // const response = await fetch(tokenURI);
    // const json = await response.json();

    const nftApproved = await instanceContract.getApproved(tokenId);
    if (nftApproved == Config.MARKETPLACE_CA) {
      setIsApprove(true);
    }

    const assets = await getAssets(
      `{nftAddress: {_eq: "${nftAddress}"}, tokenId: {_eq: ${tokenId}}}`
    );
    if (assets.data.length > 0) {
      setAsset(assets.data[0]);
    }

    const marketContract = smartContact(
      Config.MARKETPLACE_CA,
      Config.MARKETPLACE_ABI
    );
    setFeeRate(formatUnits(await marketContract._feeRate(), "wei") / 100 || 0);

    // setMetadata(json);
    setNftOwner(ownerOf);
  }, [router]);

  const approveContract = async (index) => {
    toggle(index, true);
    try {
      const instanceContract = smartContact(nftAddress, Config.ASSET_ABI);
      const transaction = await instanceContract.approve(
        Config.MARKETPLACE_CA,
        tokenId
      );
      const tx = await transaction.wait();
      setIsApprove(tx);
      toggle(index, false);
    } catch (error) {
      toggle(index, false);
    }
  };

  const createOrder = async (index, type = 0) => {
    // ** type: (0 market) (1 auction)
    // only auction process
    if (!startPrice) {
      // alert("INVALID INPUT");
      Swal.fire("Error", "Enter Start Price", "warning");
      return;
    }

    let startPriceInWei = BigNumber.from(parseEther(startPrice)).toString();
    let terminatePriceInEth =
      type == 1
        ? BigNumber.from(parseEther(terminatePrice.toString())).toString()
        : 0;
    if (type >= 2) return;

    let _expiration = expiration ? expiration : 0;
    if (expiration < Math.floor(new Date().getTime() / 1000) && type == 1) {
      Swal.fire("Warning", "expiration isn't valid", "warning");
      return;
    }
    try {
      toggle(index, true);

      const _tokenAddress = tokenAddress.split(":")[1].replace(/\s/g, "");
      const _tokenSymbol = tokenAddress.split(":")[0].replace(/\s/g, "");

      // if (profileOwner?.isVerified === false) {
      const marketplaceContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );
      const transaction = await marketplaceContract.createOrder(
        nftAddress,
        _tokenAddress,
        parseInt(tokenId),
        startPriceInWei,
        _expiration,
        terminatePriceInEth,
        type
      );
      const marketTx = await transaction.wait();
      console.log("MarketTx : ", marketTx);
      if (marketTx) {
        let { args } = marketTx.events.find(
          (event) => event.event === "CreateOrderEvent"
        );
        const day = 60 * 60 * 24;
        const insertMarketOrder = {
          currentPrice: startPrice, //same price with ether units
          terminatePrice: terminatePrice,
          nftContract: nftAddress,
          orderId: BigNumber.from(args.orderId).toNumber(),
          note: "Create Order",
          orderType: type,
          price: startPrice, //same price with ether units
          sellerWallet: wallet, //
          symbol: _tokenSymbol,
          tokenAddress: _tokenAddress,
          expiration: new Date(expiration * 1000),
          acceptTime: new Date((expiration + day) * 1000),
          tokenId: parseInt(tokenId),
        };
        console.log("Market Insert : ", insertMarketOrder);

        const orderMarket = await createOrderMarket(insertMarketOrder);
        if (orderMarket) {
          if (type == 1) {
            // auction type
            const { args } = marketTx.events.find(
              (event) => event.event === "BiddingEvent"
            );
            const _insertBidding = {
              bidder: wallet,
              bidPrice: startPrice,
              isActive: true,
              bidId: BigNumber.from(args.bidId).toNumber(),
              orderId: parseInt(formatUnits(args.orderId, "wei")),
            };
            console.log("Insert Bidding : ", _insertBidding);
            const biddingTransaction = await createBidding(_insertBidding);
          }
          const insertTransaction = {
            marketOrderId: orderMarket.orderId,
            txHash: marketTx?.transactionHash,
            txType: 0, //create order
            price: startPrice,
            collectionId: asset?.collectionId,
            assetId: asset?.id,
            from: marketTx?.from,
            to: marketTx?.to,
            asset_ids: [asset?.id],
          };
          console.log(
            "🚀 ~ file: [type].jsx ~ line 245 ~ createOrder ~ insertTransaction",
            insertTransaction
          );
          const offerWhere = `{
              offerTo: {_eq: "${wallet}"},
              isActive: {_eq: true},
              tokenId: {_eq: ${tokenId}},
              nftContract: {_eq: "${nftAddress}"}
            }`;
          const offerSet = `isActive: false`;
          const updateOfferTx = await updateOffer(offerSet, offerWhere);
          const transaction = await createTransactions(insertTransaction);
          if (transaction) {
            toggle(index, false);
            router.push(`/assets/${nftAddress}/${tokenId}`);
          }
        }
      }
      // } else {
      //   let attributes;

      //   if (Object.keys(utilities).length > 0) {
      //     attributes = await setUtilityMetadata([utilities]);
      //   } else {
      //     const attributeVal = asset?.collection?.nftUtility;
      //     if (attributeVal) {
      //       attributes = await setUtilityMetadata([{ value: attributeVal }]);
      //     }
      //   }

      //   const groupAttributes = attributes.reduce((r, a) => {
      //     r[a.type] = r[a.type] || [];
      //     r[a.type].push(a);
      //     return r;
      //   }, Object.create(null));
      //   const metadata = asset.metadata;
      //   const newMetadata = { ...metadata };
      //   newMetadata.attributes = groupAttributes;

      //   const body = {
      //     tokenId: parseInt(tokenId),
      //     json: newMetadata,
      //   };
      //   const response = await fetch(`/api/upload`, {
      //     method: "post",
      //     body: JSON.stringify(body),
      //   });

      //   const { result } = await response.json();
      //   if (response.status === 200) {
      //     const marketplaceContract = smartContact(
      //       Config.MARKETPLACE_CA,
      //       Config.MARKETPLACE_ABI
      //     );

      //     const transaction = await marketplaceContract.createOrder(
      //       nftAddress,
      //       _tokenAddress,
      //       parseInt(tokenId),
      //       startPriceInWei,
      //       _expiration,
      //       terminatePriceInEth,
      //       parseInt(percentUtilities),
      //       true,
      //       type
      //     );
      //     const marketTx = await transaction.wait();

      //     if (marketTx) {
      //       console.log("marketTx", marketTx);

      //       let { args } = marketTx.events.find(
      //         (event) => event.event === "CreateOrderEvent"
      //       );

      //       const insertMarketOrder = {
      //         currentPrice: startPrice, //same price with ether units
      //         terminatePrice: terminatePrice,
      //         nftContract: nftAddress,
      //         orderId: formatUnits(args.orderId, "wei"),
      //         note: "Create Order",
      //         orderType: type,
      //         price: startPrice, //same price with ether units
      //         sellerWallet: wallet, //
      //         symbol: _tokenSymbol,
      //         tokenAddress: _tokenAddress,
      //         expiration: new Date(expiration * 1000),
      //         tokenId: parseInt(tokenId),
      //       };

      //       const orderMarket = await createOrderMarket(insertMarketOrder);
      //       if (orderMarket) {
      //         // insert bidding
      //         let { args } = marketTx.events.find(
      //           (event) => event.event === "BiddingEvent"
      //         );
      //         if (type == 1) {
      //           // type auction
      //           const _insertBidding = {
      //             bidder: wallet,
      //             bidPrice: startPrice,
      //             isActive: true,
      //             bidId: BigNumber.from(args.bidId).toNumber(),
      //             orderId: parseInt(formatUnits(args.orderId, "wei")),
      //           };
      //           console.log("Insert Bidding : ", _insertBidding);
      //           const biddingTransaction = await createBidding(_insertBidding);
      //         }
      //         // insert transaction
      //         console.log("marketTx", marketTx);
      //         const insertTransaction = {
      //           txHash: marketTx?.transactionHash,
      //           txType: 0, //create order
      //           price: startPrice,
      //           collectionId: asset?.collectionId,
      //           assetId: asset?.id,
      //           from: marketTx?.from,
      //           to: marketTx?.to,
      //           asset_ids: [asset?.id],
      //         };
      //         const offerWhere = `{
      //           offerTo: {_eq: "${wallet}"},
      //           isActive: {_eq: true},
      //           tokenId: {_eq: ${tokenId}},
      //           nftContract: {_eq: "${nftAddress}"}
      //         }`;
      //         const offerSet = `isActive: false`;
      //         const updateOfferTx = await updateOffer(offerSet, offerWhere);
      //         const transaction = await createTransactions(insertTransaction);
      //         if (transaction) {
      //           toggle(index, false);
      //           router.push(`/assets/${nftAddress}/${tokenId}`);
      //         }
      //       }
      //     }
      //   }
      //   // console.log(marketTx);
      // }
    } catch (error) {
      console.log(error);
      toggle(index, false);

      Swal.fire("Error", error.message, "error");
      return;
    }
  };

  useEffect(() => {
    fetchProfileOwner();
  }, [fetchProfileOwner]);

  useEffect(() => {
    fetchNFTList();
  }, [fetchNFTList]);

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   // fetchFactoryPolicies();
  // }, [router]);

  return (
    <>
      <div>
        {/* section 1  */}
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-5 hilight-content2-3 mt-4">
                <p className="text-title_ex">List item for sale</p>
                {/* <p className="text-white">Lorem Ipsum is simply dummy</p> */}
              </div>
              <div className="col-lg-6 hilight-content2-3 hilight-content2-3-2 mt-4">
                <p className="text-navgation text-secondary">
                  <Link href="/">
                    <a className="text-navation_mr text-secondary">Home</a>
                  </Link>{" "}
                  {">"}
                  <Link href={`/Explore-collection/${asset?.collectionId}`}>
                    <a className="text-navation_mr text-secondary">
                      {asset?.collection?.name}
                    </a>
                  </Link>{" "}
                  {">"}
                  <Link href="/Explore-collection">
                    <a className="text-navation_mr text-secondary">
                      {asset?.metadata?.name}
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* end-section 1  */}
        {/* section 2  */}
        <section>
          <div className="container">
            <div className="row pb-4 pt-3">
              <div className="col-xxl-6 col-lg-6 col-12 mt-4">
                <div className="layout-img-detail py-4">
                  {/* <div className="row" style={{ padding: "15px 20px" }}>
                    <div className="col-6">
                      <i className="fas fa-eye ci-white"></i>
                      <span className="text-view-detail mx-2"> 1209 VIEW</span>
                    </div>
                    <div className="col-6" align="right">
                      <span className="text-view-detail mx-2"> 350 </span>{" "}
                      <i
                        className={`fas fa-heart layout04 layout-icon_hearth-detail icon-purple`}
                      ></i>
                    </div>
                  </div> */}
                  <div className="d-flex w-100 align-items-center justify-content-center">
                    <img
                      className="w-50 img-detail"
                      src={
                        asset?.metadata?.image ||
                        "/assets/image/archiverse/default_img.png"
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                          "/assets/image/archiverse/default_img.png";
                      }}
                    />
                  </div>
                </div>
                <div className="layout-des_sell-detailpage mt-5">
                  <p className="text-title-des">
                    <i className="fas fa-list-alt mx-2"></i>Detail
                  </p>
                </div>
                <div className="layout-des_table-sell pb-lg-3">
                  <div className="row">
                    <div className="col-xxl-6 col-lg-6 col-sm-6 col-6">
                      <p className="text-detail-acc">Contract Address</p>
                      <p className="text-detail-acc">Token ID</p>
                      <p className="text-detail-acc">Token Standard</p>
                      <p className="text-detail-acc">Platform Fees</p>
                      <p className="text-detail-acc">Loyalty Fees</p>
                    </div>
                    <div
                      className="col-xxl-6 col-lg-6 col-sm-6 col-6"
                      align="right"
                    >
                      {/* <Link href={"/"}> */}
                      <p className="text-detail-acc">
                        {nftAddress !== null
                          ? GetShortAddress(nftAddress)
                          : null}
                      </p>
                      {/* </Link> */}
                      {/* <Link href={""}> */}
                      <p className="text-detail-acc">{tokenId}</p>
                      {/* </Link> */}
                      <p className="text-detail-acc">ERC-721</p>
                      <p className="text-detail-acc">{feeRate || 0}%</p>
                      <p className="text-detail-acc">
                        {asset?.metadata?.loyaltyFee / 100 || 0}%
                      </p>
                    </div>
                    {/* <div
                      className="col-xxl-6 col-lg-6 col-sm-6 col-6"
                      align="right"
                    >
                      <Link href={""}>
                        <p className="text-detail-acc_link">
                          {GetShortAddress(nftAddress)}
                        </p>
                      </Link>
                      <Link href={""}>
                        <p className="text-detail-acc_link">{tokenId}</p>
                      </Link>
                      <p className="text-detail-acc">ERC-721</p>
                      <p className="text-detail-acc">2%</p>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 col-lg-6 col-12 mt-4">
                <p className="text-title-detail">{asset?.metadata?.name}</p>
                {/* <p className="text-title-detail">{asset?.name}</p> */}
                <hr className="hr-detail" />
                <div className="px-2 my-1">
                  <div className="py-2">
                    <div className="text-white">
                      <Form>
                        <Form.Group className="mb-3" controlId="utilities">
                          <Form.Label className="text-header-detail mb-2 text-secondary">
                            Sell With Token
                          </Form.Label>
                          <TokenListSelect
                            onSelect={(e) => setTokenAddress(e)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Price">
                          <Form.Label className="text-header-detail mb-2 text-secondary">
                            Price
                          </Form.Label>
                          <Form.Control
                            type="number"
                            className="input-search-set input-price"
                            placeholder="Price"
                            defaultValue={0}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value < 0) {
                                e.target.value = 0;
                              } else {
                                setStartPrice(value);
                              }
                            }}
                          />
                        </Form.Group>
                        {type !== "sell" && (
                          <Form.Group
                            className="mb-3"
                            controlId="terminatePrice"
                          >
                            <Form.Label className="text-header-detail mb-2 text-secondary">
                              Terminate Price
                            </Form.Label>
                            <Form.Control
                              type="number"
                              className="input-search-set  input-price"
                              placeholder="Terminate Price"
                              defaultValue={0}
                              onChange={(e) => {
                                let value = e.target.value;
                                if (value < 0) {
                                  e.target.value = 0;
                                } else {
                                  setTerminatePrice(value);
                                }
                              }}
                            />
                          </Form.Group>
                        )}
                        {type !== "sell" && (
                          <Form.Group
                            className="mb-3"
                            controlId="datetime-input"
                          >
                            <Form.Label className="text-header-detail mb-2 text-secondary">
                              Expiration Date
                            </Form.Label>
                            <Form.Control
                              type="datetime-local"
                              className="input-search-set  input-price"
                              onChange={(e) => {
                                let timeMs = new Date(e.target.value).getTime();
                                let finalTime = Math.floor(timeMs / 1000);
                                setExpiration(finalTime);
                              }}
                            />
                          </Form.Group>
                        )}

                        {/* {profileOwner?.isVerified && (
                          <>
                            <Form.Group
                              className="mb-3"
                              controlId="Percent"
                              as={Row}
                            >
                              <Form.Label className="text-header-detail mb-2">
                                Utilities and Voucher Percent
                              </Form.Label>
                              <Col xs="8" className="d-flex align-items-center">
                                <div className="w-100">
                                  <RangeSlider
                                    min={10}
                                    max={90}
                                    defaultValue={10}
                                    value={percentUtilities}
                                    tooltipLabel={(currentValue) =>
                                      `${currentValue}%`
                                    }
                                    tooltip="auto"
                                    onChange={(changeEvent) =>
                                      setPercentUtilities(
                                        changeEvent.target.value
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                              <Col xs="4">
                                <Form.Control
                                  type="number"
                                  className="input-search-set  input-price"
                                  placeholder="Start Price"
                                  value={percentUtilities}
                                  min={10}
                                  max={90}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else {
                                      setPercentUtilities(value);
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="utilities">
                              <Form.Label className="text-header-detail mb-2">
                                Utilities/Vouchers
                              </Form.Label>

                              <UtilitiesListSelect
                                selectList={asset?.collection?.nftUtility || []}
                                price={startPrice}
                                percent={percentUtilities}
                                poolList={poolList}
                                onSelect={(e) => setUtilities(e)}
                              />
                            </Form.Group>
                          </>
                        )} */}
                      </Form>
                    </div>
                  </div>
                  <div className="layout-des_sell-detailpage mt-2">
                    <p className="text-title-des">
                      <i className="fas fa-list-alt mx-2"></i>Summary
                    </p>
                  </div>
                  <div className="layout-des_table-sell pb-lg-3">
                    {/* {profileOwner?.isVerified ? (
                      <div className="row">
                        <div className="col-xxl-6 col-lg-6 col-sm-6 col-6">
                          <p className="text-detail-acc">Currency</p>
                          <p className="text-detail-acc">Price</p>
                          <p className="text-detail-acc">Pool / Received</p>
                          <p className="text-detail-acc">Pool Details</p>
                        </div>
                        <div
                          className="col-xxl-6 col-lg-6 col-sm-6 col-6"
                          align="right"
                        >
                          <p className="text-detail-acc_link">
                            {tokenAddress?.split(":")[0].replace(/\s/g, "") ||
                              "-"}
                          </p>
                          <p className="text-detail-acc_link">{startPrice} </p>
                          <p className="text-detail-acc_link">
                            {startPrice * (percentUtilities / 100) || 0} /{" "}
                            {startPrice -
                              startPrice * (percentUtilities / 100) || 0}
                          </p>
                          <p className="text-detail-acc_link">
                            {utilities?.label || ""}
                          </p>
                        </div>
                      </div>
                    ) : ( */}
                    <div className="row">
                      <div className="col-xxl-6 col-lg-6 col-sm-6 col-6">
                        <p className="text-detail-acc">Currency</p>
                        <p className="text-detail-acc">Price</p>
                      </div>
                      <div
                        className="col-xxl-6 col-lg-6 col-sm-6 col-6"
                        align="right"
                      >
                        <p className="text-detail-acc_link">
                          {tokenAddress?.split(":")[0].replace(/\s/g, "") ||
                            "-"}
                        </p>
                        <p className="text-detail-acc_link">
                          {startPrice || 0}{" "}
                        </p>
                      </div>
                    </div>
                    {/* )} */}
                  </div>

                  {/* <div className="exp-tab py-4">
                    <Tabs
                      defaultActiveKey="sell"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="sell" title="sell">
                        
                      </Tab>
                    </Tabs>
                  </div> */}
                </div>

                {/* offer mobile  */}
                {/* <div className="layout-des-detailpage displayshow-mobile">
                  <p className="text-title-des">
                    <i className="fas fa-list-ul mx-2"></i> Offer
                  </p>
                </div> */}
                {/* <div className="layout-des_sub-detailpage displayshow-mobile">
                  <div className="col-12 exp-table">
                    <Table borderless responsive hover>
                      <thead>
                        <tr className="bd-bottom">
                          <th className="py-3">
                            <p className="mb-0">Price</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">USD Price</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">Floor Difference</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">Expirtion</p>
                          </th>
                          <th className="py-3">
                            <p className="mb-0">From</p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-4 pb-3">
                            <div className="d-flex align-items-start gap-2 ">
                              <img
                                width={10}
                                alt=""
                                src="/assets/rsu-image/icons/coin.svg"
                              />
                              <div>
                                <p className="mb-0">500</p>
                              </div>
                            </div>
                          </td>

                          <td className="pt-4 pb-3">
                            <div className=" d-flex gap-2 align-items-start ">
                              <p className="mb-0">$ 25,000.77</p>
                            </div>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">42% below</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">about 10 hours</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <Link href={""}>
                              <div className=" d-flex gap-2 align-items-start ">
                                <p className="mb-0 ci-green textprofile-table textprofile-des_link cursor-pointer">
                                  Xeroca
                                </p>
                              </div>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="pt-4 pb-3">
                            <div className="d-flex align-items-start gap-2 ">
                              <img
                                width={10}
                                alt=""
                                src="/assets/rsu-image/icons/coin.svg"
                              />
                              <div>
                                <p className="mb-0">500</p>
                              </div>
                            </div>
                          </td>

                          <td className="pt-4 pb-3">
                            <div className=" d-flex gap-2 align-items-start ">
                              <p className="mb-0">$ 25,000.77</p>
                            </div>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">42% below</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">about 10 hours</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <Link href={""}>
                              <div className=" d-flex gap-2 align-items-start ">
                                <p className="mb-0 ci-green textprofile-table textprofile-des_link cursor-pointer">
                                  Xeroca
                                </p>
                              </div>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div> */}
              </div>

              {/* <div className="col-xxl-12 mb-5">
                <div className="layout_main-acc">
                  <p className="text-title-des">Item Activity</p>
                </div>
                <div className="layout-des_sub-detailpage">
                  <Select selected="Filter" />
                  <div className="d-flex mt-3">
                    <button
                      className={`btn btn-filter active`}
                      onClick={Buynow}
                    >
                      <i className="fal fa-times mgr-8 c-pointer"></i> Sales
                    </button>
                    <button
                      className={`btn btn-filter active mx-lg-3`}
                      onClick={Buynow}
                    >
                      <i className="fal fa-times mgr-8 c-pointer"></i> Buy now
                    </button>
                  </div>
                  <div className="col-12 mt-lg-3 exp-table">
                    <Table borderless responsive hover>
                      <thead>
                        <tr className="bd-bottom">
                          <th className="py-3">
                            <p className="mb-0">Eent</p>
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
                        <tr>
                          <td className="pt-4 pb-3">
                            <div className="d-flex align-items-start gap-2 ">
                              <i className="fas fa-shopping-cart"></i>
                              <div>
                                <p className="mb-0">Sale</p>
                              </div>
                            </div>
                          </td>

                          <td className="pt-4 pb-3">
                            <div className="d-flex align-items-start gap-2 ">
                              <img
                                width={10}
                                alt=""
                                src="/assets/rsu-image/icons/coin.svg"
                              />
                              <div>
                                <p className="mb-0">0.64</p>
                              </div>
                            </div>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">478BC478BC478BC478BC</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">417777417777417777417777</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <Link href={""}>
                              <div className=" d-flex gap-2 align-items-start cursor-pointer">
                                <p className="mb-0 ci-green textprofile-des_link">
                                  3 day ago{" "}
                                  <i className="fas fa-external-link"></i>
                                </p>
                              </div>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="pt-4 pb-3">
                            <div className="d-flex align-items-start gap-2 ">
                              <i className="fas fa-exchange-alt"></i>
                              <div>
                                <p className="mb-0">Transfer</p>
                              </div>
                            </div>
                          </td>

                          <td className="pt-4 pb-3">
                            <div className="d-flex align-items-start gap-2 ">
                              <img
                                width={10}
                                alt=""
                                src="/assets/rsu-image/icons/coin.svg"
                              />
                              <div>
                                <p className="mb-0">0.64</p>
                              </div>
                            </div>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">478BC</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0">417777</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <Link href={""}>
                              <div className=" d-flex gap-2 align-items-start cursor-pointer">
                                <p className="mb-0 ci-green textprofile-des_link">
                                  3 day ago{" "}
                                  <i className="fas fa-external-link"></i>
                                </p>
                              </div>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="row">
              <div className="col-12">
                {!isApprove && (
                  <ButtonState
                    style={"btn btn-primary mb-2 color-1 w-100"}
                    text={"Approve"}
                    loading={
                      loading.index === "approve" && loading.status === true
                    }
                    onFunction={() => approveContract("approve")}
                  />
                )}
                {isApprove &&
                  (type === "sell" ? (
                    <ButtonState
                      style={"btn btn-primary w-100 mb-2"}
                      text={"List Sell"}
                      loading={
                        loading.index === "sell" && loading.status === true
                      }
                      onFunction={() => createOrder("sell", 0)}
                    />
                  ) : (
                    <ButtonState
                      style={"btn btn-primary w-100 mb-2"}
                      text={"List Auction"}
                      loading={
                        loading.index === "auction" && loading.status === true
                      }
                      onFunction={() => createOrder("auction", 1)}
                    />
                  ))}

                {/* <button
                          className=""
                          onClick={() => {
                            isApprove ? createOrder(0) : approveContract();
                          }}
                        >
                          {isApprove ? "List sell" : ""}
                        </button> */}
              </div>
            </div>
          </div>
        </section>
        {/* end-section 2  */}
      </div>
    </>
  );
};

export default AssetsSellPage;
AssetsSellPage.layout = Mainlayout;
