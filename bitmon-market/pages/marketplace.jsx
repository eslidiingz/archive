import { useEffect, useState } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import { Form, Spinner } from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  completeOrderToMarket,
  getMarketLists,
  cancelItemFromMarket,
  getItemInfo,
} from "../models/Market";
import { getMetaDataForMarket } from "../models/Monster";
import { BigNumber, ethers } from "ethers";
import Swal from "sweetalert2";
import { useWalletContext } from "../context/wallet";
import { allowanced, approveToken } from "../models/Token";
import Config from "../configs/config";
import MarketMonsterCard from "../components/market/monstercard";
import MarketLandCard from "../components/market/landcard";
import MarketItemCard from "../components/market/itemcard";
import MonsterFilterLeft from "../components/market/monsterFilterLeft";
import LandFilterLeft from "../components/market/landFilterLeft";
import ItemFilterLeft from "../components/market/itemFilterLeft";
import HeaderTradeInfo from "../components/market/headerTradeInfo";
import { getAllItems, getItemTypes } from "../utils/api/item-api";
import { web3Modal, web3Provider } from "/utils/providers/connector";

export default function Marketplace() {
  const MONSTER_ELEMENTS = [
    { id: "fire", name: "fire", imgSrc: "/assets/img/elements/F.webp" },
    { id: "water", name: "water", imgSrc: "/assets/img/elements/W-2.webp" },
    { id: "electric", name: "electric", imgSrc: "/assets/img/elements/E.webp" },
    { id: "dark", name: "dark", imgSrc: "/assets/img/elements/D.webp" },
    { id: "holy", name: "holy", imgSrc: "/assets/img/elements/H.webp" },
    { id: "bug", name: "bug", imgSrc: "/assets/img/elements/B.webp" },
    { id: "earth", name: "earth", imgSrc: "/assets/img/elements/E-2.webp" },
    { id: "wind", name: "wind", imgSrc: "/assets/img/elements/W.webp" },
    { id: "ice", name: "ice", imgSrc: "/assets/img/elements/I.webp" },
    { id: "steel", name: "steel", imgSrc: "/assets/img/elements/S.webp" },
  ];

  const LAND_TYPES = [
    { id: "grass", name: "Grass", imgSrc: "/assets/img/land/L1.png" },
    { id: "desert", name: "Desert", imgSrc: "/assets/img/land/L2.png" },
    { id: "snow", name: "Snow", imgSrc: "/assets/img/land/L3.png" },
    { id: "lava", name: "Lava", imgSrc: "/assets/img/land/L4.png" },
    { id: "mirror", name: "Mirror", imgSrc: "/assets/img/land/L5.png" },
  ];

  const GRADES = [
    { id: "immortal", name: "Immortal", class: "btn-Skew-yellow" },
    { id: "legendary", name: "Legendary", class: "btn-Skew-red" },
    { id: "epic", name: "Epic", class: "btn-Skew-pink" },
    { id: "rare", name: "Rare", class: "btn-Skew-blue" },
    { id: "common", name: "Common", class: "btn-Skew-green" },
    // {id:'Crystal',class:'' }
  ];

  const { wallet } = useWalletContext();

  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [allAssets, setAllAssets] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  const [isUserApprovedToken, setIsUserApprovedToken] = useState(false);
  const [activeTab, setActiveTab] = useState("monster");
  const [filter, setFilter] = useState({
    elements: [],
    landTypes: [],
    assets: [],
    ranks: [],
  });
  const [itemTypesArr, setItemTypeArr] = useState([]);

  useEffect(() => {
    let mounted = true;

    intialize(mounted);

    return () => {
      mounted = false;
    };
  }, [filter.elements, filter.landTypes, filter.assets, filter.ranks]);

  // // chat box //
  // window.fbAsyncInit = () => {
  //   FB.init({
  //     xfbml: true,
  //     version: "v14.0",
  //   });
  // };

  // (function (d, s, id) {
  //   var js,
  //     fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) return;
  //   js = d.createElement(s);
  //   js.id = id;
  //   js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
  //   fjs.parentNode.insertBefore(js, fjs);
  // })(document, "script", "facebook-jssdk");

  // var chatbox = document.getElementById('fb-customer-chat');
  //     chatbox.setAttribute("page_id", "109317624924756");
  //     chatbox.setAttribute("attribution", "biz_inbox");

  // // chat box //

  const intialize = async (mounted) => {
    if (mounted) {
      try {
        if (mounted) {
          console.log("FILTERS", filter, "active tab");
          setLoading(true);

          if (activeTab === "monster") {
            await handleFetchMonster();
          } else if (activeTab === "lands") {
            await handleFetchLands();
          } else if (activeTab === "items") {
            await handleFetchItems();
          }
        }
      } catch (err) {
        console.error(err.message);
      }
      setLoading(false);
    }
  };

  const handleFetchMonster = async () => {
    if (wallet) {
      setIsUserApprovedToken(await checkIsApprovedToken());
    }

    const items = await getMarketLists("monster");
    // console.log("SHOW ITEMS", items)
    const monsters = [];
    if (Array.isArray(items)) {
      await Promise.all(
        items.map(async (item) => {
          const tokenId = parseInt(BigNumber.from(item.tokenId)._hex, 16);
          const marketId = parseInt(BigNumber.from(item.marketId)._hex, 16);
          const itemPrice = parseInt(ethers.utils.formatEther(item.price));
          const itemDetail = await getMetaDataForMarket(tokenId, "monster");
          // console.log(itemDetail)
          let matched = true;
          if (
            filter.elements.length &&
            !filter.elements.includes(itemDetail?.type?.toLowerCase?.())
          )
            matched = false;
          if (
            filter.ranks.length &&
            !filter.ranks.includes(itemDetail?.rank?.toLowerCase?.())
          )
            matched = false;

          if (matched) {
            monsters.push({
              data: itemDetail,
              marketId,
              itemPrice,
              ownerAddress: item.ownerAddress,
            });
          }
          console.log(monsters);
        })
      );
    }
    setMarketItems(monsters);
  };

  const handleFetchLands = async () => {
    if (wallet) {
      setIsUserApprovedToken(await checkIsApprovedToken());
    }

    const items = await getMarketLists("land");
    const lands = [];
    if (Array.isArray(items)) {
      await Promise.all(
        items.map(async (item) => {
          const tokenId = parseInt(BigNumber.from(item.tokenId)._hex, 16);
          const marketId = parseInt(BigNumber.from(item.marketId)._hex, 16);
          const itemPrice = parseInt(ethers.utils.formatEther(item.price));
          const itemDetail = await getMetaDataForMarket(tokenId, "land");

          let matched = true;
          if (
            filter.landTypes.length &&
            !filter.landTypes.includes(itemDetail?.name?.toLowerCase?.())
          )
            matched = false;
          if (
            filter.ranks.length &&
            !filter.ranks.includes(itemDetail?.class?.toLowerCase?.())
          )
            matched = false;

          if (matched) {
            lands.push({
              data: itemDetail,
              marketId,
              itemPrice,
              ownerAddress: item.ownerAddress,
            });
          }
          console.log(lands);
        })
      );
    }
    setMarketItems(lands);
  };

  const handleFetchItems = async () => {
    if (wallet) {
      setIsUserApprovedToken(await checkIsApprovedToken());
    }

    const items = await getMarketLists("item");
    const itemTypes = await getItemTypes();

    var itemTypeArray = Object.keys(itemTypes).map((key) => ({
      id: key,
      title: itemTypes[key],
    }));

    setItemTypeArr(itemTypeArray);

    const itemsArr = [];
    if (Array.isArray(items)) {
      await Promise.all(
        items.map(async (item) => {
          const tokenId = parseInt(BigNumber.from(item.tokenId)._hex, 16);
          const marketId = parseInt(BigNumber.from(item.marketId)._hex, 16);
          const amount = parseInt(BigNumber.from(item.amount)._hex, 16);
          const itemPrice = parseInt(ethers.utils.formatEther(item.price));
          const itemDetail = await getMetaDataForMarket(tokenId, "item");

          let matched = true;
          // console.log(itemDetail.attributes.type)
          if (
            filter.assets.length &&
            !filter.assets.includes(
              itemDetail?.attributes?.type?.toUpperCase?.()
            )
          )
            matched = false;
          if (
            filter.ranks.length &&
            !filter.ranks.includes(itemDetail?.class?.toLowerCase?.())
          )
            matched = false;

          if (matched) {
            const marketIdBlock = [12, 27, 29];
            if (
              marketIdBlock.filter((element) => element == marketId).length <= 0
            ) {
              itemsArr.push({
                data: itemDetail,
                marketId,
                amount,
                tokenId,
                itemPrice,
                ownerAddress: item.ownerAddress,
                buyerAddress: item.buyerAddress,
                ownerAddress: item.ownerAddress,
              });
            }
          }
        })
      );
    }
    setMarketItems(itemsArr);
  };

  const handleLoading = async () => {
    Swal.fire({
      title: "Please Wait ...",
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const handleChangeActiveTab = async (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoading(true);

      if (tab === "monster") {
        await handleFetchMonster();
      } else if (tab === "lands") {
        await handleFetchLands();
      } else if (tab === "items") {
        setLoadingFilter(true);
        const masterAssets = await getAllItems();
        setAllAssets(masterAssets);
        await handleFetchItems();
      }
    }
    setLoading(false);
    setLoadingFilter(false);
  };

  const handleClickCancel = async (marketId) => {
    try {
      handleLoading();
      let result = await cancelItemFromMarket(marketId);

      if (result) {
        Swal.fire("Success", "Cancel successfully.", "success");
      } else {
        Swal.fire("Warning", "Failed to Cancel.", "warning");
      }
    } catch (err) {
      console.log(err);
    }
    intialize(true);
    return false;
  };

  const checkIsApprovedToken = async () => {
    try {
      let isApprovedToken = await allowanced(
        wallet,
        Config.MARKET_CA,
        Config.BUSD_CA,
        true
      );
      return parseInt(BigNumber.from(isApprovedToken)._hex, 16) < 1
        ? false
        : true;
    } catch {
      return false;
    }
  };

  const handleClickApproveToken = async () => {
    try {
      if (wallet) {
        handleLoading();
        const result = await approveToken(Config.MARKET_CA);
        if (result) {
          setIsUserApprovedToken(true);
          Swal.fire("Success", "Approve successfully.", "success");
        } else {
          Swal.fire("Warning", "Failed to Approve.", "warning");
        }
      } else {
        if (typeof window.ethereum === "undefined") {
          Swal.fire(
            "Warning",
            "Please, Install metamark extension to connect DApp",
            "warning"
          );
        } else {
          const _web3Modal = web3Modal();
          await _web3Modal.connect();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickBuyItem = async (marketId, amount = 1) => {
    try {
      handleLoading();
      if (activeTab === "monster" || activeTab === "lands") {
        let isApprovedToken = await allowanced(
          wallet,
          Config.MARKET_CA,
          Config.BUSD_CA,
          true
        );

        if (parseInt(BigNumber.from(isApprovedToken)._hex, 16) < 1) {
          setIsUserApprovedToken(false);
          Swal.fire("Warning", "Failed to approve token.", "warning");
          return;
        }

        const result = await completeOrderToMarket(marketId, 1);

        if (result) {
          Swal.fire("Success", "Bought successfully.", "success");
        } else {
          Swal.fire("Warning", "Failed to buy item.", "warning");
        }
      } else if (activeTab === "items") {
        console.log("WALLET", wallet);
        let isApprovedToken = await allowanced(
          wallet,
          Config.MARKET_CA,
          Config.BUSD_CA,
          true
        );

        if (parseInt(BigNumber.from(isApprovedToken)._hex, 16) < 1) {
          setIsUserApprovedToken(false);
          Swal.fire("Warning", "Failed to approve token.", "warning");
          return;
        }

        const result = await completeOrderToMarket(marketId, amount);

        if (result) {
          Swal.fire("Success", "Bought successfully.", "success");
        } else {
          Swal.fire("Warning", "Failed to buy item.", "warning");
        }
      }
    } catch (err) {
      console.error(err.message);
    }
    intialize(true);
    setLoading(false);
  };

  const handleChangeFilter = (e, selectedFilter) => {
    try {
      const checked = e.target.checked;
      const propKey = e.target.name;

      console.log(selectedFilter, propKey);

      if (checked) {
        setFilter((prevState) => ({
          ...prevState,
          [propKey]: [...prevState[propKey], selectedFilter],
        }));
      } else {
        setFilter((prevState) => ({
          ...prevState,
          [propKey]: [
            ...prevState[propKey].filter(
              (filterValue) => filterValue !== selectedFilter
            ),
          ],
        }));
      }
    } catch {}
  };

  return (
    <div className="container">
      <h1 className="text-center text-yellow font-large">marketplace</h1>
      <div className="index-layout">
        <div className="sidebar bg-primary">
          <div className="row">
            <div className="col-12">
              <div className="bg-primary p-3 mx-auto text-center ">
                <h4 className="text-start">TYPE</h4>
                <Tabs
                  defaultActiveKey="monster"
                  className="justify-content-start d-flex z-index-0"
                  onSelect={handleChangeActiveTab}
                  activeKey={activeTab}
                >
                  <Tab
                    eventKey="monster"
                    title="MONSTER"
                    tabClassName="tab-first-mar tab-opacity pe-3 ps-0"
                    disabled={loading}
                  >
                    <MonsterFilterLeft
                      elements={MONSTER_ELEMENTS}
                      grades={GRADES}
                      onChangeFilter={handleChangeFilter}
                    />
                  </Tab>
                  <Tab
                    eventKey="lands"
                    title="LAND "
                    tabClassName="tab-second-mar tab-opacity  pe-3 ps-0"
                    disabled={loading}
                  >
                    <LandFilterLeft
                      landTypes={LAND_TYPES}
                      grades={GRADES}
                      onChangeFilter={handleChangeFilter}
                    />
                  </Tab>
                  <Tab
                    eventKey="items"
                    title="ITEM"
                    tabClassName="tab-third-mar tab-opacity  pe-3 ps-0"
                    disabled={loading}
                  >
                    <ItemFilterLeft
                      itemTypes={itemTypesArr}
                      assets={allAssets}
                      grades={GRADES}
                      loading={loadingFilter}
                      onChangeFilter={handleChangeFilter}
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="row d-flex h-auto">
            <HeaderTradeInfo />
            <div className="col-xxl-12  d-flex align-self-stretch height-fix-box w-100">
              <div className="bg-primary p-2 container ">
                <div className="row fix-row">
                  {loading && (
                    <div className="text-center d-flex justify-content-center loading-screen">
                      <span className="me-2 my-auto">Loading</span>{" "}
                      <Spinner animation="border" role="status" />
                    </div>
                  )}
                  {!loading && marketItems?.length < 1 && (
                    <div className="loading-screen">
                      <h4 className="text-center my-4 text-notfound">
                        {`${activeTab.charAt(0).toUpperCase()}${activeTab.slice(
                          1
                        )}`}{" "}
                        not found
                      </h4>
                    </div>
                  )}
                  {activeTab === "monster" &&
                    !loading &&
                    Array.isArray(marketItems) &&
                    marketItems.map((monster, index) => (
                      <MarketMonsterCard
                        key={index}
                        monster={monster}
                        wallet={wallet}
                        handleClickCancel={handleClickCancel}
                        handleClickBuyItem={handleClickBuyItem}
                        handleClickApproveToken={handleClickApproveToken}
                        isUserApprovedToken={isUserApprovedToken}
                      />
                    ))}

                  {activeTab === "lands" &&
                    !loading &&
                    Array.isArray(marketItems) &&
                    marketItems.map((lands, index) => (
                      <MarketLandCard
                        key={index}
                        lands={lands}
                        wallet={wallet}
                        handleClickCancel={handleClickCancel}
                        handleClickBuyItem={handleClickBuyItem}
                        handleClickApproveToken={handleClickApproveToken}
                        isUserApprovedToken={isUserApprovedToken}
                      />
                    ))}

                  {activeTab === "items" &&
                    !loading &&
                    Array.isArray(marketItems) &&
                    marketItems.map((items, index) => (
                      <MarketItemCard
                        key={index}
                        items={items}
                        wallet={wallet}
                        handleClickCancel={handleClickCancel}
                        handleClickBuyItem={handleClickBuyItem}
                        handleClickApproveToken={handleClickApproveToken}
                        isUserApprovedToken={isUserApprovedToken}
                        itemTypesArr={itemTypesArr}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
