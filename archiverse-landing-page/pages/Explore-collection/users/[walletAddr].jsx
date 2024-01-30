import { useCallback, useState } from "react";
import Link from "next/link";
import LayoutItem from "/components/layouts/LayoutItem";
import React from "react";
import { Table, Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import HeaderItem from "/components/layouts/HeaderItem";
import Filter from "/components/layouts/Filter";
import Search from "/components/form/search";
import Select from "/components/form/select";
import CardTrending from "/components/card/CardTrending";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAssets, getAssetsDistinct } from "/models/Asset";
import { getCollection } from "/models/Collection";
import { getTransactions, aggTransactions } from "/models/Transaction";
import { getUsers } from "/models/User";
import { shortWallet } from "../../../utils/misc";
import CardExplore from "../../../components/cardExplore/CardExplore";
import ReactTimeAgo from "react-time-ago";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExploreCollectionItem = (props) => {
  const labels = [
    "3/12",
    "3/13",
    "3/14",
    "3/15",
    "3/16",
    "3/17",
    "3/18",
    "3/19",
    "3/20",
    "3/21",
    "3/22",
    "3/23",
    "3/24",
    "3/25",
    "3/26",
    "3/27",
    "3/28",
    "3/29",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [
          20, 30, 15, 40, 30, 25, 40, 5, 35, 60, 40, 21, 18, 24, 75, 45, 85,
          100,
        ],
        borderColor: "rgb(124, 75, 247, 100)",
        backgroundColor: "rgb(124, 75, 247, 100)",
      },
    ],
  };

  const [isActive, setActive] = useState(false);
  const toggleFav = () => {
    setActive(!isActive);
  };

  const [isBuynow, setBuynow] = useState(false);
  const Buynow = () => {
    setBuynow(!isBuynow);
  };

  const [isAuction, setAuction] = useState(false);
  const Auction = () => {
    setAuction(!isAuction);
  };

  const [isNew, setNew] = useState(false);
  const New = () => {
    setNew(!isNew);
  };

  const [isOffer, setOffer] = useState(false);
  const Offer = () => {
    setOffer(!isOffer);
  };

  const [isRinkeby, setRinkeby] = useState(false);
  const Rinkeby = () => {
    setRinkeby(!isRinkeby);
  };

  const [isMumbai, setMumbai] = useState(false);
  const Mumbai = () => {
    setMumbai(!isMumbai);
  };

  const [isBaobab, setBaobab] = useState(false);
  const Baobab = () => {
    setBaobab(!isBaobab);
  };

  const [isBCS, setBCS] = useState(false);
  const BCS = () => {
    setBCS(!isBCS);
  };

  const [isGoerli, setGoerli] = useState(false);
  const Goerli = () => {
    setGoerli(!isGoerli);
  };

  const [isETH, setETH] = useState(false);
  const ETH = () => {
    setETH(!isETH);
  };

  const [isWETH, setWETH] = useState(false);
  const WETH = () => {
    setWETH(!isWETH);
  };

  const router = useRouter();
  const { walletAddr } = router.query;
  const [assets, setAssets] = useState([]);
  const [collectionData, setCollectionData] = useState({});
  const [ownerCounter, setOwnerCounter] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [volumeTrade, setVolumeTrade] = useState(0);
  const [userData, setUserData] = useState({});

  const fetching = useCallback(() => {
    const fetchAssetList = async () => {
      let data = await getUsers(`{wallet: {_eq: "${walletAddr}"}}`);
      let result = data.data;
      console.log("User Data : ", result);
      if (result.length == 1) {
        // found user
        let user = result[0];
        let assetsData = await getAssets(
          `{owner: {_eq: "${walletAddr}"}, isArchiverse: {_eq: true}}`
        );
        console.log("Asset Data : ", assetsData.data);
        setAssets(assetsData.data);

        setUserData(user);
      }
    };
    fetchAssetList();
  }, []);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return (
    <>
      <div className="section_explorecollection"></div>
      <div className="user-ex-spac-top">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="user-ex-layout-img">
                <img
                  className="user-ex-img-size"
                  alt=""
                  src={
                    userData?.profileImage ||
                    "/assets/image/archiverse/default_img.png"
                  }
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                />
              </div>

              <div className="d-flex user-ex-profile-layout">
                {userData.name && (
                  <h6 className="fw-bold">{userData.name ?? "Unknown"}</h6>
                )}
              </div>
              {userData.wallet && (
                <div className="d-flex user-ex-profile-layout mb-3">
                  <p className="user-ex-profile-layout-wallet">
                    {shortWallet(userData.wallet)}
                  </p>
                </div>
              )}

              <hr />
              <p className=" mb-5 mt-4" align="left">
                {userData.bio}
              </p>
            </Col>
            {/* <div className="col-12 col-lg-6 mb-2 mb-lg-0">
              <Search />
            </div> */}
            <Col lg={8}>
              <div className="user-ex-tab">
                <Tabs
                  defaultActiveKey="Collected"
                  id="main-tab"
                  className="mb-3"
                >
                  <Tab
                    eventKey="Collected"
                    title={`Collected (${assets.length})`}
                  >
                    <div className="row ps-lg-3 mb-3">
                      <div className="col exp-sub-tab px-0">
                        <div>
                          <div className="row">
                            {assets.length == 0 && (
                              <div className="text-center">
                                <i>
                                  <h5>No data</h5>
                                </i>
                              </div>
                            )}
                            {assets.map((_item, index) => {
                              return (
                                <div
                                  className="col-12 col-md-6 col-xl-4 mb-3"
                                  key={index}
                                >
                                  <CardExplore
                                    img={_item.metadata.image}
                                    title={_item.metadata.name}
                                    detail={_item.metadata.description}
                                    nftAddress={_item.nftAddress}
                                    tokenId={_item.tokenId}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ExploreCollectionItem;
ExploreCollectionItem.layout = LayoutItem;
