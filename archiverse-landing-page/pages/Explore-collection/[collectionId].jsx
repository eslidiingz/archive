import { useCallback, useState } from "react";
import Link from "next/link";
import LayoutItem from "/components/layouts/LayoutItem";
import React from "react";
import {
  Table,
  Tabs,
  Tab,
  Form,
  Offcanvas,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import HeaderItem from "/components/layouts/HeaderItem";
import Search from "/components/form/search";

const { orderByPrice } = require("/constants/filter.json");

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
import { shortWallet } from "../../utils/misc";
import CardExplore from "../../components/cardExplore/CardExplore";
import TableCollection from "../../components/table/Collection";

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

  const router = useRouter();
  const { collectionId } = router.query;
  const [assets, setAssets] = useState([]);
  const [collectionData, setCollectionData] = useState({});
  const [ownerCounter, setOwnerCounter] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [volumeTrade, setVolumeTrade] = useState(0);

  const [showFilter, setShowFilter] = useState(false);

  const fetching = useCallback(async () => {
    const fetchOwnerList = async () => {
      let data = await getAssetsDistinct(
        "owner",
        `{collectionId: {_eq: ${collectionId}}}`
      );
      setOwnerCounter(data.data.length);
    };

    const fetchingAssets = async () => {
      let data = await getAssets(
        `{collectionId: {_eq: ${collectionId}}, isArchiverse: {_eq: true}}`
      );
      // console.log(data.data);
      setAssets(data.data);
    };

    const fetchingCollection = async () => {
      let data = await getCollection(`{id: {_eq: ${collectionId}}}`);
      // console.log(res);
      if (data.status) {
        let res = data.data;
        setCollectionData(res[0]);
      }
    };

    const fetchingTransactions = async () => {
      // should get only buy or acceptOffer transaction
      let data = await getTransactions(
        `{collectionId: {_eq: ${collectionId}}}`
      );
      setVolumeTrade(data.data.length);
    };

    const fetchingFloorPrice = async () => {
      let where = `{collectionId: {_eq: ${collectionId}}}`;
      let res = await aggTransactions(where);
      console.log("%c === fetchingFloorPrice", "color: yellow", res);
      console.log(
        "%c === res.data.aggregate.min",
        "color: yellow",
        res.data.aggregate.min.price
      );
      setFloorPrice(res.data.aggregate.min.price);
    };

    await fetchingTransactions();
    await fetchingAssets();
    await fetchOwnerList();
    await fetchingCollection();
    await fetchingFloorPrice();
  }, [collectionId]);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return (
    <>
      <div>
        {/* section 01  */}
        <section
          className="hilight-sections-itempage"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212 212 212 / 6%),
              rgba(155 155 155 / 80%) 91.18%,
              rgb(255 255 255)),
              url("${
                collectionData.backgroundUrl ||
                "/assets/image/archiverse/default_img.png"
              }")`,
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <img
                  className="img-profile-item"
                  alt=""
                  src={
                    collectionData.coverUrl ||
                    "/assets/image/archiverse/default_img.png"
                  }
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                />
              </div>
              <div className="col-lg-12">
                <p className="text-title-item">{collectionData.name}</p>
                <p className="text-title-sub-item">
                  Created by
                  <Link
                    href={`/Explore-collection/users/${collectionData.creatorWallet}`}
                  >
                    <a className="text-title-sub-link-item">
                      {" "}
                      {shortWallet(collectionData.creatorWallet)}
                    </a>
                  </Link>{" "}
                </p>
              </div>
              <div className="col-12 col-lg-8 col-xl-6">
                <HeaderItem
                  item={assets.length || 0}
                  owners={ownerCounter || 0}
                  price={floorPrice || 0}
                  volume={volumeTrade || 0}
                />
              </div>
            </div>
          </div>
        </section>
        {/* end-section 01  */}

        {/* section 02  */}
        <section className="hilight-sections-itempage02">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 exp-tab">
                <div>
                  <Tabs defaultActiveKey="Items" id="main-tab" className="mb-3">
                    <Tab eventKey="Items" title="Items">
                      <div className="row ps-lg-3">
                        <div className="col exp-sub-tab my-3">
                          <div>
                            <div className="row">
                              <div className="col-12 col-lg-12 mb-2 mb-lg-0 mt-2">
                                {/* <Search /> */}
                                {/* <div className="col-lg-12">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center w-100">
                                      <i
                                        className="fas fa-align-left me-4"
                                        onClick={() =>
                                          setShowFilter(!showFilter)
                                        }
                                      ></i>
                                      <Form.Select
                                        value={1}
                                        className="select-type-box"
                                      >
                                        {orderByPrice.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={index}
                                          >
                                            {item.name}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </div>
                                  </div>
                                  <hr className="line-itempage-status" />
                                </div> */}
                              </div>
                            </div>
                            <div className="row">
                              {assets.map((item, index) => {
                                return (
                                  <div
                                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                    key={index}
                                  >
                                    <CardExplore
                                      img={item.metadata.image}
                                      title={item.metadata.name}
                                      detail={item.metadata.description}
                                      nftAddress={item.nftAddress}
                                      tokenId={item.tokenId}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    {/* <Tab eventKey="Activity" title="Activity">
                      <TableCollection />
                    </Tab> */}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* end-section 02  */}
      </div>

      {/* Offcanvas */}
      <Offcanvas show={showFilter} onHide={() => setShowFilter(!showFilter)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <h3 className="fw-bold">Status</h3>
            <Form>
              {["checkbox"].map((type) => (
                <div key={`inline-${type}`} className="mb-3 filter">
                  <Form.Check
                    className="my-1"
                    inline
                    label="Buy Now"
                    name="group1"
                    type={type}
                    id={`inline-${type}-1`}
                  />
                  <Form.Check
                    className="my-1"
                    inline
                    label="On Auction"
                    name="group1"
                    type={type}
                    id={`inline-${type}-2`}
                  />
                  <Form.Check
                    className="my-1"
                    inline
                    label="Buy with Card"
                    name="group1"
                    type={type}
                    id={`inline-${type}-3`}
                  />
                </div>
              ))}
            </Form>
          </div>
          <hr className="my-5" />
          <div>
            <h3 className="fw-bold">Price</h3>
            <div>
              <Form>
                <Row className="my-3">
                  <Col>
                    <Form.Control placeholder="Min" />
                  </Col>
                  <Col>
                    <h3 className="fw-500 ci-green text-center mb-0">to</h3>
                  </Col>
                  <Col>
                    <Form.Control placeholder="Max" />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} className="text-center mt-4">
                    <Button variant="primary" className="w-100">
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ExploreCollectionItem;
ExploreCollectionItem.layout = LayoutItem;
