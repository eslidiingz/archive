import React from "react";
import Slider from "react-slick";
import CardExplore from "../cardExplore/CardExplore";
import CardTrending from "../../components/card/CardTrending";

const defaultItemShow = 4;

const SlideExplore = ({ assetList }) => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    className: "center",
    arrows: false,
    centerMode: true,
    infinite: true,
    dots: true,
    // centerPadding: "30px",
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 400,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          centerMode: false,
          focusOnSelect: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          centerMode: false,
          focusOnSelect: false,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Slider {...settings} className="slick-EX">
        {assetList.map((_item, index) => (
          <div className="col-12 col-md-6 col-lg-3 px-1" key={index}>
            <CardTrending
              ClassTitle="text-title-slidertren mb-0"
              img={_item.profileImage}
              title={_item.name ?? "Unknown"}
              userData={_item}
              link={`Explore-collection/users/${_item.wallet}`}
            />
            {/* <CardExplore
              img={_item.metadata.image}
              title={_item.metadata.name}
              detail={_item.metadata.description}
              nftAddress={_item.nftAddress}
              tokenId={_item.tokenId}
            /> */}
          </div>
        ))}
      </Slider>
    </>
  );
};

export default SlideExplore;
