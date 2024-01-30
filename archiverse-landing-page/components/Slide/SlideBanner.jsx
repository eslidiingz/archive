import { useEffect, useState } from "react";
import { useCallback } from "react";
import Slider from "react-slick";
import Config from "../../configs/config";

const SlideBanner = () => {
  const [bannerList, setBannerList] = useState([]);
  const fetchHighlightBanner = useCallback(async () => {
    const response = await fetch(
      `${Config.CMS_API}/highlight-contents?populate=*`
    );
    if (response.status === 200) {
      const { data } = await response.json();
      setBannerList(data);
    }
  }, []);

  useEffect(() => {
    fetchHighlightBanner();
  }, [fetchHighlightBanner]);

  const settings = {
    // autoplay: true,
    // autoplaySpeed: 2000,
    className: "center",
    arrows: false,
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
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
        {bannerList.map((item, index) => {
          return (
            <div
              key={index}
              className="bg"
              style={{
                backgroundImage: `url("${"/assets/image/archiverse/default_img.png"}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="container">
                <div className="row hilight-content-home text-start justify-content-start d-flex">
                  <div className="col-lg-6 hilight-content2-2 order-1 order-lg-0">
                    <p className="small-title mb-4">
                      {item?.attributes?.Title}
                    </p>
                    <p className="txt-banner-green mb-2">
                      {item?.attributes?.Subtitle}
                    </p>
                    <p className="txt-banner-detail mb-5">
                      {item?.attributes?.Description}
                    </p>
                  </div>
                  <div className="col-lg-6 text-center order-0 order-lg-1">
                    <img
                      src={
                        typeof item?.attributes?.Image?.data?.attributes
                          ?.url !== "undefined"
                          ? `${Config.CMS_FILE_API}/${item?.attributes?.Image?.data?.attributes?.url}`
                          : "/assets/image/archiverse/default_img.png"
                      }
                      onError={(e) => {
                        e.target.src =
                          "/assets/image/archiverse/default_img.png";
                        e.target.onError = null;
                      }}
                      className="w-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </>
  );
};

export default SlideBanner;
