import React, { Component } from "react";
import Slider from "react-slick";
import CardTrending from "../card/CardTrending";
import CardExplore from "../cardExplore/CardExplore";

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

export default class SlideCollection extends Component {
  render() {
    const settings = {
      className: "center",
      arrows: false,
      centerMode: true,
      infinite: true,
      dots: true,
      centerPadding: "150px",
      slidesToShow: 3,
      slidesToScroll: 4,
      speed: 400,
      focusOnSelect: true,
      //   dots: false,
      //   infinite: true,
      //   slidesToShow: 4,
      //   slidesToScroll: 1,
      //   centerMode: true,
      //   centerPadding: "200px",
      //   nextArrow: <SampleNextArrow />,
      //   prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            centerMode: false,
            centerPadding: "0px",
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            centerMode: false,
            centerPadding: "0px",
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 2,
          },
        },
      ],
    };
    return (
      <>
        <Slider {...settings} className="slick-EX">
          <div className="col-12 col-md-6 col-lg-3 px-1">
            <CardExplore
              img="/assets/swaple/img-01.png"
              title="1 Central Coin 01"
              detail="Swaple is created with the conviction that it will improve participation and accelerate innovation in this market."
              link="/Explore-collection/item"
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3 px-1">
            <CardExplore
              img="/assets/swaple/img-02.png"
              title="1 Central Coin"
              detail="Swaple is created with the conviction that it will improve participation and accelerate innovation in this market."
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3 px-1">
            <CardExplore
              img="/assets/swaple/img-03.png"
              title="1 Central Coin"
              detail="Swaple is created with the conviction that it will improve participation and accelerate innovation in this market."
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3 px-1">
            <CardExplore
              img="/assets/swaple/img-04.png"
              title="1 Central Coin"
              detail="Swaple is created with the conviction that it will improve participation and accelerate innovation in this market."
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3 px-1">
            <CardExplore
              img="/assets/swaple/img-04.png"
              title="1 Central Coin"
              detail="Swaple is created with the conviction that it will improve participation and accelerate innovation in this market."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3 px-1">
            <CardExplore
              img="/assets/swaple/img-03.png"
              title="1 Central Coin"
              detail="Swaple is created with the conviction that it will improve participation and accelerate innovation in this market."
            />
          </div>
        </Slider>
      </>
    );
  }
}
