import React, { Component } from "react";
import Slider from "react-slick";
import CardTrending from "../card/CardTrending";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={"arrow-next-customs layout-arrow-silder next-trend-position"}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={"arrow-prev-customs layout-arrow-silder prev-trend-position"}
      onClick={onClick}
    />
  );
}

export default class SlideTrending extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: "30px",
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            centerMode: false,
            centerPadding: "0px",
            slidesToShow: 1,
            slidesToScroll: 1,
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
        <div className="row  d-flex align-items-center Silder_main">
          <div className="col-lg-4  col-12 set-pd-txt-home">
            <h1>What is Merx Studio?</h1>
            <p>
              We are laying the groundwork for web3 — the next generation of the
              internet full of limitless possibilities. In web3, your creativity
              is valued and your digital objects belong to you.
            </p>
          </div>
          <div className="col-lg-8 col-12">
            <Slider {...settings}>
              <div className="col-12 col-md-6 col-lg-3 px-1">
                <CardTrending
                  ClassTitle=" text-title-slidertren mb-0"
                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                  title="Lorem Ipsum is"
                  profile="sala"
                  price="153"
                  link="/Explore-collection/detail-music"
                ></CardTrending>
              </div>

              <div className="col-12 col-md-6 col-lg-3 px-1">
                <CardTrending
                  ClassTitle=" text-title-slidertren mb-0"
                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                  title="Lorem Ipsum is"
                  profile="sala"
                  price="153"
                  link="/Explore-collection/detail-music"
                ></CardTrending>
              </div>
              <div className="col-12 col-md-6 col-lg-3 px-1">
                <CardTrending
                  ClassTitle=" text-title-slidertren mb-0"
                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                  title="Lorem Ipsum is"
                  profile="sala"
                  price="153"
                  link="/Explore-collection/detail-music"
                ></CardTrending>
              </div>

              <div className="col-12 col-md-6 col-lg-3 px-1">
                <CardTrending
                  ClassTitle=" text-title-slidertren mb-0"
                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                  title="Lorem Ipsum is"
                  profile="sala"
                  price="153"
                  link="/Explore-collection/detail-music"
                ></CardTrending>
              </div>

              <div className="col-12 col-md-6 col-lg-3 px-1">
                <CardTrending
                  ClassTitle=" text-title-slidertren mb-0"
                  img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                  img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                  title="Lorem Ipsum is"
                  profile="sala"
                  price="153"
                  link="/Explore-collection/detail-music"
                ></CardTrending>
              </div>
            </Slider>
          </div>
        </div>
      </>
    );
  }
}
