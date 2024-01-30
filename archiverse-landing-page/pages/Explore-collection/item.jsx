import { useState } from "react";
import Link from "next/link";
import LayoutItem from "../../components/layouts/LayoutItem";
import React from "react";
import { Table, Tabs, Tab, Form, Row, Col, Button } from "react-bootstrap";
import HeaderItem from "../../components/layouts/HeaderItem";
import Offcanvas from "react-bootstrap/Offcanvas";

import CardTrending from "../../components/card/CardTrending";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExploreCollectionItem = () => {
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
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [
          20, 30, 15, 40, 30, 25, 40, 5, 35, 60, 40, 21, 18, 24, 75, 45, 85,
          100,
        ],
        borderColor: "#1ed159",
        backgroundColor: "#1ed159",
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

  const [selectDropdowncoin, setselectDropdowncoin] =
    useState("Price low to high");
  const DropdowncoinList = ["Price high to low", "Price low to high", "All"];

  return (
    <>
      <div>
        <section className="hilight-sections-itempage">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <img
                  className="img-profile-item"
                  alt=""
                  src="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                />
              </div>
              <div className="col-lg-12">
                <p className="text-title-item">Lorem Ipsum is simply</p>
                <p className="text-title-sub-item">
                  Created by
                  <Link href={"/Explore-collection/profile"}>
                    <a className="text-title-sub-link-item"> dbai</a>
                  </Link>{" "}
                </p>
                <button className="btn btn-secondary w-fit me-2">
                  <span className="W95FA_font pe-2">+</span> Add to watchlis
                </button>
                <button className="btn btn-primary w-fit me-2">
                  {/* <span className="W95FA_font pe-2">+</span>Add to watchlist */}
                  <span className="W95FA_font pe-2">+</span> Add to watchlist
                </button>
              </div>

              <div className="col-12 col-lg-8 col-xl-6">
                <HeaderItem item="40" owners="120" price="1222" volume="122" />
              </div>
            </div>
          </div>
        </section>
        {/* end-section 01  */}
        {/* section 02  */}
        <section className="hilight-sections-itempage02">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {/* <Filter /> */}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center w-100">
                    <i
                      className="fas fa-align-left me-4 "
                      onClick={handleShow}
                    ></i>
                    <Form.Select
                      value={selectDropdowncoin}
                      className="select-type-box"
                    >
                      {DropdowncoinList.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>

                <hr className="line-itempage-status" />
              </div>
              <div className="col-lg-12 exp-tab">
                <div>
                  <Tabs defaultActiveKey="Items" id="main-tab" className="mb-3">
                    <Tab eventKey="Items" title="Items">
                      <div className="row ps-lg-3">
                        <div className="col exp-sub-tab my-3">
                          <div>
                            <div className="row">
                              <div className="col-12 col-lg-6 mb-2 mb-lg-0 mt-2">
                                {/* <Search /> */}
                              </div>
                              <div className="col-12 col-lg-3 mb-2 mb-lg-0">
                                {/* <Select
                                  selected="Single Items"
                                  value1="value1"
                                  value2="value2"
                                  value3="value3"
                                /> */}
                              </div>
                              <div className="col-12 col-lg-3 mb-2 mb-lg-0">
                                {/* <Select
                                  selected="Price"
                                  value1="value1"
                                  value2="value2"
                                  value3="value3"
                                /> */}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-md-6 mt-lg-4 col-lg-4 col-xl-3">
                                <CardTrending
                                  ClassTitle=" text-title-slidertren mb-0"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  title="Lorem Ipsum is"
                                  profile="sala"
                                  price="153"
                                  link="/Explore-collection/detail-swaple"
                                ></CardTrending>
                              </div>
                              <div className="col-12 col-md-6 mt-lg-4 col-lg-4 col-xl-3">
                                <CardTrending
                                  ClassTitle=" text-title-slidertren mb-0"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  title="Lorem Ipsum is"
                                  profile="sala"
                                  price="153"
                                  link="/Explore-collection/detail-swaple"
                                ></CardTrending>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="Activity" title="Activity">
                      <div className="row ps-lg-3 mt-4">
                        <div className="col-sm-6 d-flex align-items-center justify-content-sm-start justify-content-center mb-sm-0 mb-4">
                          <select
                            className="form-select input-search-set  w-fit"
                            aria-label="Default select example"
                          >
                            <option selected>Last 90 Days</option>
                            <option value="1">value1</option>
                            <option value="2">value2</option>
                            <option value="3">value3</option>
                          </select>
                        </div>
                        <div className="col-sm-6 d-flex align-items-center justify-content-sm-end justify-content-center">
                          <div className="d-block">
                            <div className="d-flex mb-2 justify-content-end">
                              <h6 className="mb-0 ci-white me-2">
                                90 Day Avg. Price
                              </h6>
                              <h6 className="mb-0 ci-green fw-bold">0.5</h6>
                            </div>
                            <div className="d-flex justify-content-end">
                              <h6 className="mb-0 ci-white me-2">
                                90 Day Volume
                              </h6>
                              <h6 className="mb-0 ci-green fw-bold">3</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row ps-lg-3 my-3">
                        <div className="col-12">
                          <div className="bg-dark-card chart">
                            <div className="d-flex justify-content-between">
                              <h4 className="ci-white">Daily Views</h4>
                              {/* <div className="w-fit">
                                <select className="form-select input-search-set  w-fit" aria-label="Default select example">
                                  <option selected>Last 90 Days</option>
                                  <option value="1">value1</option>
                                  <option value="2">value2</option>
                                  <option value="3">value3</option>
                                </select>
                              </div> */}
                            </div>
                            <Line data={data} />
                          </div>
                        </div>
                      </div>
                      <div className="row ps-lg-3">
                        <div className="col-12 exp-table">
                          <Table borderless responsive hover>
                            <thead>
                              <tr className="bd-bottom">
                                <th className="py-3 ps-3 ">
                                  <p className="mb-0">Event type</p>
                                </th>
                                <th className="py-3">
                                  <p className="mb-0">Item</p>
                                </th>
                                <th className="py-3">
                                  <p className="mb-0">Price</p>
                                </th>
                                <th className="py-3">
                                  <p className="mb-0">Quantity</p>
                                </th>
                                <th className="py-3">
                                  <p className="mb-0">From</p>
                                </th>
                                <th className="py-3">
                                  <p className="mb-0">To</p>
                                </th>
                                <th className="py-3">
                                  <p className="mb-0">Time</p>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="pt-4 pb-3 ps-3">
                                  <p className="mb-0">Transfer</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start ">
                                    <div className="exp-table-img">
                                      <img
                                        alt=""
                                        src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                                      />
                                    </div>
                                    <p className="mb-0 exp-table-textdot">
                                      to ensure consistent ids are generated
                                      between the
                                    </p>
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
                                      <p className="mb-0">500</p>
                                      <div className="ci-grey f10">
                                        (1,234.65)
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0">1</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start ">
                                    <p className="mb-0 ci-green exp-table-textdot">
                                      to ensure consistent ids are generated
                                      between the
                                    </p>
                                    {/* <img
                                      width={15}
                                      alt=""
                                      src="/assets/swaple/verified-user.svg"
                                    /> */}
                                    <small className=" ci-green mb-0">
                                      Verified
                                    </small>
                                  </div>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0 ci-green ">7868SD78</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start c-pointer ">
                                    <p className="mb-0 ci-green">6 Hours ago</p>
                                    <img
                                      width={15}
                                      alt=""
                                      className="i-white"
                                      src="/assets/rsu-image/icons/report.svg"
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-4 ps-3">
                                  <p className="mb-0">Transfer</p>
                                </td>
                                <td className="py-4">
                                  <div className=" d-flex gap-2 align-items-start ">
                                    <div className="exp-table-img">
                                      <img
                                        alt=""
                                        src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                                      />
                                    </div>
                                    <p className="mb-0 exp-table-textdot">
                                      to ensure consistent ids are generated
                                      between the
                                    </p>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <div className="d-flex align-items-start gap-2 ">
                                    <img
                                      width={10}
                                      alt=""
                                      src="/assets/rsu-image/icons/coin.svg"
                                    />
                                    <div>
                                      <p className="mb-0">---</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <p className="mb-0">1</p>
                                </td>
                                <td className="py-4">
                                  <div className=" d-flex gap-2 align-items-start ">
                                    <p className="mb-0 ci-green exp-table-textdot">
                                      to ensure consistent ids are generated
                                      between the
                                    </p>
                                    {/* <img
                                      width={15}
                                      alt=""
                                      src="/assets/swaple/verified-user.svg"
                                    /> */}
                                    <small className=" ci-green mb-0">
                                      Verified
                                    </small>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <p className="mb-0 ci-green ">7868SD78</p>
                                </td>
                                <td className="py-4">
                                  <div className=" d-flex gap-2 align-items-start c-pointer ">
                                    <p className="mb-0 ci-green">6 Hours ago</p>
                                    <img
                                      width={15}
                                      alt=""
                                      className="i-white"
                                      src="/assets/rsu-image/icons/report.svg"
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="pt-4 pb-3 ps-3">
                                  <p className="mb-0">Transfer</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start ">
                                    <div className="exp-table-img">
                                      <img
                                        alt=""
                                        src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                                      />
                                    </div>
                                    <p className="mb-0 exp-table-textdot">
                                      to ensure consistent ids are generated
                                      between the
                                    </p>
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
                                      <p className="mb-0">500</p>
                                      <div className="ci-grey f10">
                                        (1,234.65)
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0">1</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start ">
                                    <p className="mb-0 ci-green exp-table-textdot">
                                      to ensure consistent ids are generated
                                      between the
                                    </p>
                                    <img
                                      width={15}
                                      alt=""
                                      src="/assets/swaple/verified-user.svg"
                                    />
                                    <small className=" ci-green mb-0">
                                      Verified
                                    </small>
                                  </div>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0 ci-green">---</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start c-pointer ">
                                    <p className="mb-0 ci-green">6 Hours ago</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* end-section 02  */}
      </div>

      {/* Offcanvas */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <h3 className=" text-white ">Status</h3>
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
            <h3 className=" text-white ">Price</h3>
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
                  <Col lg={12} className="text-center">
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
