import Link from "next/link";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Config from "../../configs/config";

const HomepageBanner = () => {
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
  return (
    <>
      <div id="section-banner" className="homepage-banner-layout-main">
        <div className="homepage-banner-bg-content">
          <div className="d-block">
            {/* <div align="center">
              <img
                src="/assets/image/archiverse/logo/logo-shadow.svg"
                className="homepage-banner-img-size"
              />
            </div> */}
            <p className="homepage-banner-title mt-3">ARCHIVERSE</p>
            <p className="homepage-banner-subtitle mb-4">
              BUILD YOUR ME TAVERSE
            </p>
            <p className="ci-white mb-2">
              The meraverse is not a signle app. It&apos;s a network of millions of
              virtual worlds prople visit to play games, socialize and
              collaborate. Today, most of those worlds are closed and
              disconnected walled gardens.
            </p>
            <p className="ci-white">
              Archverse is a cross-Architecture platform for metaverse
              designers, builders, and creators. We&apos;re on a mission to vreate an
              aesthetic environment, context, urbanm and architecture to build a
              more 3D digital asset.
            </p>
          </div>
          <Link href="#section-slider-platform">
            <a className="scroll-down" address="true"></a>
          </Link>
        </div>
        <div className="homepage-section-banner"></div>
      </div>
    </>
  );
};

export default HomepageBanner;
