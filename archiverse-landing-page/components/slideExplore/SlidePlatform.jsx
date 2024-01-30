import React from "react";
import Slider from "react-slick";
import Link from "next/link";

const defaultItemShow = 1;

const SliderPlatform = ({ assetList }) => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    className: "center",
    arrows: false,
    infinite: true,
    // dots: true,
    slidesToShow: defaultItemShow,
    slidesToScroll: defaultItemShow,
    speed: 400,
    focusOnSelect: true,
    // responsive: [
    //   {
    //     breakpoint: 1400,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //       infinite: true,
    //     },
    //   },
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       centerMode: false,
    //       centerPadding: "0px",
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //       initialSlide: 3,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       centerMode: false,
    //       centerPadding: "0px",
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       initialSlide: 2,
    //     },
    //   },
    // ],
  };
  return (
    <>
      <div id="section-slider-platform">
        <Slider {...settings}>
          <div className="slider-platform-bg">
            <img
              src="/assets/image/archiverse/slider/NFT.png"
              className="slider-platform-img-size"
            />
          </div>
          <div className="slider-platform-bg">
            <img
              src="/assets/image/archiverse/slider/MarketPlace.png"
              className="slider-platform-img-size"
            />
          </div>
          <div className="slider-platform-bg">
            <img
              src="/assets/image/archiverse/slider/ABPlace.png"
              className="slider-platform-img-size"
            />
          </div>
        </Slider>
        <Link href="#Official-Creators">
          <a className="scroll-down" address="true"></a>
        </Link>
      </div>
    </>
  );
};

export default SliderPlatform;
