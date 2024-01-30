import { useState } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import Slider from "react-slick";
// import { Tabs, Tab } from "react-bootstrap";
import HeaderExploreProfile from "../../components/layouts/HeaderExploreProfile";
import { Table, Tabs, Tab } from "react-bootstrap";
import Filter from "../../components/layouts/Filter";
import Search from "../../components/form/search";
import Select from "../../components/form/select";
import Dropdown from "react-bootstrap/Dropdown";
import SlideCollection from "../../components/Slide/SlideCollection";
import CardTrending from "../../components/card/CardTrending";

const ExploreCollectionProfile = () => {
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

  const [isTrading, setTrading] = useState(false);
  const Trading = () => {
    setTrading(!isTrading);
  };
  const [isTop, setTop] = useState(false);
  const Top = () => {
    setTop(!isTop);
  };
  const [isArt, setArt] = useState(false);
  const Art = () => {
    setArt(!isArt);
  };
  const [isUtifity, setUtifity] = useState(false);
  const Utifity = () => {
    setUtifity(!isUtifity);
  };
  const [isAll, setAll] = useState(false);
  const All = () => {
    setAll(!isAll);
  };

  return (
    <>
      <div>
        <section>
          <div className="container pd-top-bottom-section">
            <div className="row d-flex">
              <div className="col-xxl-4 col-lg-4 col-12 mt-5" align="center">
                <div className="layout-img-detail">
                  <img
                    className="w-100 img-detail"
                    alt=""
                    src="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                  />
                </div>
                <div className="d-flex user-ex-profile-layout">
                  <p className="text-profile_EC">dbai</p>
                  <img
                    className="ci-green"
                    alt=""
                    width={20}
                    src="/assets/rsu-image/icons/verify-black.svg"
                  />
                </div>
                <div className="d-flex user-ex-profile-layout2 mb-3">
                  <Link href="#">
                    <p className="user-ex-profile-layout-wallet">
                      <img
                        src="/assets/swaple/icon-omcoin.webp"
                        className="mx-3"
                      />
                      1f6s4f6wf4ew...459
                      <i className="far fa-clone ci-blue text-detail-di_copy_ex mx-3"></i>
                    </p>
                  </Link>
                </div>
                <hr />
                <p className="text-makeanoff-de03_ex mb-5 mt-4" align="left">
                  Dour Darcels are a collection of 10,000 moody frens from
                  Darcel Disappoints. All are individual and unique – just like
                  frens IRL
                </p>
                <p className="text-makeanoff-de03_ex mb-xxl-5" align="left">
                  Joined December 2021
                </p>
              </div>
              <div className="col-xxl-8 col-lg-8 col-12 mt-5">
                <div className="row mb-4">
                  <div className="col-12 col-lg-6 mb-2 mb-lg-0">
                    <Search />
                  </div>
                  <div className="col-12 col-lg-3 mb-2 mb-lg-0">
                    {/* <Select selected="Single Items" /> */}
                  </div>
                  <div className="col-12 col-lg-3 mb-2 mb-lg-0">
                    {/* <Select selected="Price" /> */}
                  </div>
                </div>
                <div className="user-ex-tab">
                  <Tabs
                    defaultActiveKey="Collected"
                    id="main-tab"
                    className="mb-3"
                  >
                    <Tab eventKey="Collected" title="Collected (24)">
                      <div className="row ps-lg-3 mb-3">
                        <div className="col exp-sub-tab px-0">
                          <div>
                            <div className="row">
                              <div className="col-12 col-md-6 col-lg-6 col-xxl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-6 col-xxl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-6 col-xxl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-6 col-xxl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="Items" title="Items">
                      <div className="row ps-lg-3">
                        <div className="col exp-sub-tab">
                          <div>
                            <div className="row">
                              <div className="col-12 col-md-6 col-lg-4 col-xl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-4 col-xl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="Favorite (0)" title="Favorite (0)">
                      <div className="row ps-lg-3">
                        <div className="col-12">
                          <p className="text-detail-dav_ex">
                            This user hasn&apos;t favorited any items yet
                          </p>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="Activity " title="Activity ">
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
                                        src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
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
                                      className="ci-green"
                                      src="/assets/rsu-image/icons/verify-black.svg"
                                    />
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
                                      className="ci-green"
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
                                        src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
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
                                    <img
                                      width={15}
                                      alt=""
                                      className="ci-green"
                                      src="/assets/rsu-image/icons/verify-black.svg"
                                    />
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
                                      className="ci-green"
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
                                        src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
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
                                      className="ci-green"
                                      src="/assets/rsu-image/icons/verify-black.svg"
                                    />
                                  </div>
                                </td>
                                <td className="pt-4 pb-3">
                                  <p className="mb-0">---</p>
                                </td>
                                <td className="pt-4 pb-3">
                                  <div className=" d-flex gap-2 align-items-start c-pointer ">
                                    <p className="mb-0 ci-white">6 Hours ago</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="Offer " title="Offer ">
                      <div className="row ps-lg-3">
                        <div className="col exp-sub-tab">
                          <div>
                            <div className="row">
                              <div className="col-12 col-md-6 col-lg-4 col-xl-4 mb-4 ">
                                <CardTrending
                                  ClassTitle="text-title-card_new"
                                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                                  title="Water Color"
                                  profile="Warawrp"
                                  price="122"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ExploreCollectionProfile;
ExploreCollectionProfile.layout = Mainlayout;
