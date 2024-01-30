import { useState } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import { Table, Tabs, Tab, Button } from "react-bootstrap";
// import Select from "../../components/form/select";
import Modal from "react-bootstrap/Modal";
import DetailBuy from "../../components/form/DetailBuy";

const ExploreCollectionDetailart = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const showModal = () => {
    setIsOpen(true);
  };
  const hideModal = () => {
    setIsOpen(false);
  };
  const [isActive, setActive] = useState(false);
  const toggleFav = () => {
    setActive(!isActive);
  };
  const [isBuynow, setBuynow] = useState(false);
  const Buynow = () => {
    setBuynow(!isBuynow);
  };

  return (
    <>
      <div>
        {/* section 1  */}
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-5 hilight-content2-3 mt-4">
                <p className="text-title_detail_swaple">Detail</p>
                <p className="text-white">Lorem Ipsum is simply dummy</p>
              </div>
              <div className="col-lg-6 hilight-content2-3 hilight-content2-3-2 mt-4">
                <p className="text-navgation text-white">
                  <Link href="/">
                    <a className="text-navation_mr text-white">Home</a>
                  </Link>{" "}
                  {">"}
                  <Link href="/Explore-collection/item">
                    <a className="text-white text-navation_mr text-white">
                      Collections
                    </a>
                  </Link>{" "}
                  {">"}
                  <Link href="/Explore-collection">
                    <a className="text-white text-navation_mr text-white">
                      Water Color
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
            <div className="row pb-5 pt-3">
              <div className="col-xxl-6 col-lg-6 col-12 mt-4">
                <div className="layout-img-detail">
                  <img
                    className="w-100 img-fix-height-detail "
                    src="/assets/nft-image/rm324-element-baifernn-05-1.png"
                  />
                </div>
                <div className="layout-des-detailpage displaypc">
                  <p className="text-title-des">
                    <i className="fas fa-list-ul mx-2"></i> Offer
                  </p>
                </div>
                <div className="layout-des_sub-detailpage displaypc">
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
                            <Link href={"/Explore-collection/item"}>
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
                            <Link href={"/Explore-collection/item"}>
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
                </div>
              </div>
              <div className="col-xxl-6 col-lg-6 col-12 mt-4">
                <p className="text-stitle_tatus-detail">New</p>
                <p className="text-title_detail_swaple">Water Color</p>
                <hr className="hr-detail" />
                <div className="px-2 my-1">
                  <i className="fas fa-align-left ci-white"></i>
                  <span className="text-des-detail mx-2">Description</span>
                  <div className="mt-3">
                    <img
                      src="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                      className="img-profile-detail "
                      style={{ width: "50px", height: "50px" }}
                    />
                    <Link href={"/Explore-collection/item"}>
                      <span className="text-sub-detail">
                        Owned by <u className="text-link-detail">Xeroca</u>
                      </span>
                    </Link>
                  </div>
                  <p className="text-des-sub-detail mt-3 mb-4">
                    Lorem Ipsum has been the industry s standard dummy text ever
                    since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book. It has
                    survived not only five centuries,
                  </p>
                  <p className="text-des-sub-detail text-white mb-2">
                    Sale ends 04 March 2022 at 3.05am +7
                  </p>
                  <div className="row layout-time-detail-swaple mx-0">
                    <div className="col-xxl-6 col-lg-6 col-sm-6 col-8">
                      <p className="text-time-detail">11h : 23m : 45s</p>
                    </div>
                    <div className="col-xxl-6 col-lg-6 col-sm-6 col-4 icon-time-detail">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    {/* <Button variant="secondary" onClick={showModal} className="me-2 my-2" >
                      Make offer
                    </Button> */}
                    <Button
                      variant="primary"
                      onClick={showModal}
                      className="w-20 me-2 my-2"
                    >
                      Buy Now
                    </Button>
                    {/* <Button variant="secondary" onClick={showModal} className="w-20 me-2 my-2">
                      {" "}
                      Sell
                    </Button>
                    <Button variant="secondary" onClick={showModal} className="w-20 me-2 my-2">
                      {" "}
                      Bid
                    </Button>
                    <Button className="px-5 btn-delete my-1" onClick={showModal}>
                      Cancle
                    </Button> */}
                  </div>
                  <div className="row my-lg-3">
                    <div className="col-xxl-12 mt-4 layout-price_main">
                      <span className="text-price-detail">Minimum bid -- </span>
                      <img
                        className="mx-2"
                        src="../assets/rsu-image/icons/coin.svg"
                      />
                      <span className="text-price-detail2">522</span>
                      <span className="text-detail_ex">&nbsp;( 233$ )</span>
                    </div>
                  </div>
                  <Modal show={isOpen} onHide={hideModal} size="lg">
                    <DetailBuy />
                  </Modal>
                </div>

                <div className="layout-des_sell-detailpage mt-5">
                  <p className="text-title-des">
                    <i className="fas fa-list-alt mx-2"></i>Deatil
                  </p>
                </div>
                <div className="layout-des_table-sell pb-lg-3">
                  <div className="row">
                    <div className="col-xxl-6 col-lg-6 col-sm-6 col-6">
                      <p className="text-detail-acc">Contract Address</p>
                      <p className="text-detail-acc">Token ID</p>
                      <p className="text-detail-acc">Token Standard</p>
                      <p className="text-detail-acc">BlockChain</p>
                      <p className="text-detail-acc">Loyalty Fees</p>
                    </div>
                    <div
                      className="col-xxl-6 col-lg-6 col-sm-6 col-6"
                      align="right"
                    >
                      <Link href={""}>
                        <p className="text-detail-acc_link">Oxc1ad.....248</p>
                      </Link>
                      <Link href={""}>
                        <p className="text-detail-acc_link">544</p>
                      </Link>
                      <p className="text-detail-acc">ERC-721</p>
                      <p className="text-detail-acc">Ehereum</p>
                      <p className="text-detail-acc">5%</p>
                    </div>
                  </div>
                </div>
                {/* offer mobile  */}
                <div className="layout-des-detailpage displayshow-mobile">
                  <p className="text-title-des">
                    <i className="fas fa-list-ul mx-2"></i> Offer
                  </p>
                </div>
                <div className="layout-des_sub-detailpage displayshow-mobile">
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
                </div>
              </div>

              <div className="col-xxl-12 mb-5">
                <div className="layout_main-acc">
                  <p className="text-title-des">Item Activity</p>
                </div>
                <div className="layout-des_sub-detailpage">
                  {/* <Select selected="Filter" /> */}
                  <div className="d-flex mt-3">
                    <button
                      className={`btn btn-filter active`}
                      onClick={Buynow}
                    >
                      <i className="fal fa-times mgr-8 c-pointer"></i> Sales
                    </button>
                    <button
                      className={`btn btn-filter active mx-3`}
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
              </div>
            </div>
          </div>
        </section>
        {/* end-section 2  */}
      </div>
    </>
  );
};

export default ExploreCollectionDetailart;
ExploreCollectionDetailart.layout = Mainlayout;
