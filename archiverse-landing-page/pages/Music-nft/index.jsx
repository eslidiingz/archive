import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import Slider from "react-slick";
import CardTrending from "../../components/card/CardTrending";
import { Tabs, Tab } from "react-bootstrap";

const Musicnft = () => {
  const settings_s = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div>
        {/* section 01  */}
        <section className="hilight-sections">
          <div className="container">
            {/* end-left  */}
            <div className="row hilight-content2-1">
              <div className="col-lg-5 hilight-content2-2">
                <p className="small-title mb-4">Music NFT Marketplace</p>
                <p className="text02 mb-5">
                  Lorem Ipsum has been the industry s standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type
                  and scrambled it to make a type specimen book. It has survived
                  not only five centuries,
                </p>
                <div>
                  <button className="btn btn01 btn-primary me-2">
                    <a href="#" className="text-white">
                      Earn With Your Music Now
                    </a>
                  </button>
                  <div className="row mt-4">
                    <div className="col-3 layout-m01" align="left">
                      <p className="text01">
                        240k+
                        <p className="text01-2">Artists NFTs</p>
                      </p>
                    </div>
                    <div className="col-2">
                      <p className="text01" align="center">
                        12k+
                        <p className="text01-2">Artists</p>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* end-left  */}
              {/* right  */}
              <Slider className="col-lg-6 layout-slider_mf01">
                <div>
                  <div className="row">
                    <div className="col-lg-6 hilight-content2-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>
                    <div className="col-lg-6 layout-bot">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row">
                    <div className="col-lg-6 hilight-content2-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>
                    <div className="col-lg-6 layout-bot">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>
                  </div>
                </div>
              </Slider>
              {/* end-right  */}
            </div>
          </div>
        </section>
        {/* end-sction 01  */}
        {/* section 02  */}
        <section className="hilight-section02 pt-3">
          <div className="container">
            <div className="row">
              {/* Top Artists  */}
              {/* header  */}
              <div className="col-12 mt-5 mb-4" align="left">
                <p className="text03">Top Artists</p>
              </div>
              {/* end-header  */}
              {/* content  */}
              <div className="row mb-5">
                <div className="col-sm-3s">
                  <div className="row box">
                    <div className="col-1">
                      <p className="text09" align="center">
                        1
                      </p>
                    </div>
                    <div className="col-3">
                      <img
                        src="/assets/rsu-image/user/Ellipse_3.svg"
                        className="img01-1"
                      />
                    </div>
                    <div className="col-6">
                      <p className="text09 twoline-dot">Lorem Ipsum</p>
                      <p className="text09-2">
                        <img src="/assets/swaple/icon-omcoin.webp" />
                        &nbsp;<span className="text10">$ 522,456</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-sm-3s">
                  <div className="row box">
                    <div className="col-1">
                      <p className="text09" align="center">
                        2
                      </p>
                    </div>
                    <div className="col-3">
                      <img
                        src="/assets/rsu-image/user/Ellipse_3-1.svg"
                        className="img01-1"
                      />
                    </div>
                    <div className="col-6">
                      <p className="text09 twoline-dot">Lorem Ipsum</p>
                      <p className="text09-2">
                        <img src="/assets/swaple/icon-omcoin.webp" />
                        &nbsp;<span className="text10">$ 522,456</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3s">
                  <div className="row box">
                    <div className="col-1">
                      <p className="text09" align="center">
                        3
                      </p>
                    </div>
                    <div className="col-3">
                      <img
                        src="/assets/rsu-image/user/Ellipse_3-2.svg"
                        className="img01-1"
                      />
                    </div>
                    <div className="col-6">
                      <p className="text09 twoline-dot">Lorem Ipsum</p>
                      <p className="text09-2">
                        <img src="/assets/swaple/icon-omcoin.webp" />
                        &nbsp;<span className="text10">$ 522,456</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3s">
                  <div className="row box">
                    <div className="col-1">
                      <p className="text09" align="center">
                        4
                      </p>
                    </div>
                    <div className="col-3">
                      <img
                        src="/assets/rsu-image/user/Ellipse_3-3.svg"
                        className="img01-1"
                      />
                    </div>
                    <div className="col-6">
                      <p className="text09 twoline-dot">Lorem Ipsum</p>
                      <p className="text09-2">
                        <img src="/assets/swaple/icon-omcoin.webp" />
                        &nbsp;<span className="text10">$ 522,456</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3s">
                  <div className="row box">
                    <div className="col-1">
                      <p className="text09" align="center">
                        5
                      </p>
                    </div>
                    <div className="col-3">
                      <img
                        src="/assets/rsu-image/user/Ellipse_3-4.svg"
                        className="img01-1"
                      />
                    </div>
                    <div className="col-6">
                      <p className="text09 twoline-dot">Lorem Ipsum</p>
                      <p className="text09-2">
                        <img src="/assets/swaple/icon-omcoin.webp" />
                        &nbsp;<span className="text10">$ 522,456</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* content  */}
              {/* end-Top Artists  */}
              {/* Trending in all categories  */}
              {/* header 02 */}
              <div className="col-6 col-6-1 mt-5 mb-4" align="left">
                <div className="dropdown">
                  <p className="text03">
                    Trending in{" "}
                    <a className="text07">
                      all categories <i className="fas fa-angle-down"></i>
                    </a>
                  </p>
                  <div className="dropdown-content">
                    <a href="#" className="text08">
                      Trending in{" "}
                    </a>
                    <a href="#" className="text08">
                      Trending in{" "}
                    </a>
                    <a href="#" className="text08">
                      Trending in{" "}
                    </a>
                  </div>
                </div>
              </div>
              {/* end-header 02  */}
              {/* card 02  */}
              {/* Slider homepage 02  */}
              <div className="row">
                <div>
                  <Slider {...settings_s} className="layout-slider_hp02  mt-2">
                    <div className="col-lg-3 layout-slider_hp02-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>

                    <div className="col-lg-3 layout-slider_hp02-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>

                    <div className="col-lg-3 layout-slider_hp02-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>

                    <div className="col-lg-3 layout-slider_hp02-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>

                    <div className="col-lg-3 layout-slider_hp02-2">
                      <CardTrending
                        img="/assets/rsu-image/Group_3.webp"
                        title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                        day="5 days left"
                        number_heart="12"
                        price="$12"
                      ></CardTrending>
                    </div>
                  </Slider>
                </div>
                {/* end-Slider homepage 02 */}
              </div>
              {/* card  */}
            </div>
          </div>
          {/* End-Trending in all categories  */}
          {/* Create and sell your NFTs  */}
          <div className="container">
            <div className="row">
              {/* header  */}
              <div className="col-12 layout03 mb-4" align="left">
                <p className="text03">Create and sell your NFTs</p>
              </div>
              {/* end-header  */}
              {/* card  */}
              <div className="row mb-3">
                <div className="col-lg-6 ">
                  <div className="layout02 ps-4">
                    <img
                      src="/assets/rsu-image/icons/wallet.svg"
                      className="img02"
                    />
                    <p className="text12 twoline-dot mb-3">
                      Set up your wallet
                    </p>
                    <p className="text09-2 twoline-dot2">
                      Once you’ve set up your wallet of choice, connect it to
                      OpenSea by clicking the wallet icon in the top right
                      corner. Learn about the{" "}
                      <a href="#" className="text10">
                        wallets we support.
                      </a>
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="layout02 ps-4">
                    <img
                      src="/assets/rsu-image/icons/collection2.svg"
                      className="img02"
                    />
                    <p className="text12 twoline-dot mb-3">
                      Create your collection
                    </p>
                    <p className="text09-2 twoline-dot2">
                      Click{" "}
                      <a href="#" className="text10">
                        My Collections
                      </a>{" "}
                      and set up your collection. Add social links, a
                      description, profile & banner images, and set a secondary
                      sales fee.
                    </p>
                  </div>
                </div>

                <div className="col-lg-6 ">
                  <div className="layout02 ps-4">
                    <img
                      src="/assets/rsu-image/icons/img-nft.svg"
                      className="img02"
                    />
                    <p className="text12 twoline-dot mb-3">Add your NFTs</p>
                    <p className="text09-2 twoline-dot2">
                      Upload your work (image, video, audio, or 3D art), add a
                      title and description, and customize your NFTs with
                      properties, stats, and unlockable content.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="layout02 ps-4">
                    <img
                      src="/assets/rsu-image/icons/sale.svg"
                      className="img02"
                    />
                    <p className="text12 twoline-dot mb-3">
                      Set up your wallet
                    </p>
                    <p className="text09-2 twoline-dot2">
                      Choose between auctions, fixed-price listings, and
                      declining-price listings. You choose how you want to sell
                      your NFTs, and we help you sell them!
                    </p>
                  </div>
                </div>
              </div>
              {/* card  */}
            </div>
          </div>
          {/* end-Create and sell your NFTs  */}
          {/* Explore  */}
          <div className="container">
            <div className="row">
              {/* header  */}
              <div className="col-12 layout03 mb-4" align="left">
                <p className="text03">Explore</p>
              </div>
              {/* end-header  */}
              <div className="layout-tab01">
                <Tabs
                  defaultActiveKey="New"
                  id="uncontrolled-tab-example"
                  className="layout-tab02 flex-scroll"
                >
                  <Tab eventKey="New" title="New" tabClassName="w-170-tab">
                    <div className="row">
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="Hot" title="Hot">
                    <div className="row">
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/card_ex.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="See More" title="See More">
                    <div className="row">
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/Group_3.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                      <div className="col-lg-3">
                        <CardTrending
                          img="/assets/rsu-image/card_ex.webp"
                          title="Lorem Ipsum is Lorem Ipsum Ipsum isLorem Ipsum is"
                          day="5 days left"
                          number_heart="12"
                          price="$12"
                        ></CardTrending>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
          {/* end-Explore */}
        </section>
        {/* end-section 02  */}
      </div>
    </>
  );
};

Musicnft.layout = Mainlayout;
export default Musicnft;
