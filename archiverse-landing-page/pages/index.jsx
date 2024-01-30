import { useEffect } from "react";
import Link from "next/link";
import Mainlayout from "../components/layouts/Mainlayout";
import React from "react";
import Slider from "react-slick";
// import Tab from 'react-bootstrap/Tab'
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useCallback } from "react";
import { getlistingMarketplace } from "../models/Marketplace";
import { useState } from "react";
import SlideExplore from "../components/slideExplore/SlideExplore";
import SlideBanner from "../components/Slide/SlideBanner";
import { getAssets } from "../models/Asset";
import { useRouter } from "next/router";
import { getUsers } from "../models/User";
import CardTrending from "../components/card/CardTrending";

import HomepageBanner from "../components/homepage/Banner";
import HomepageContent01 from "../components/homepage/Content01";
import HomepageContent02Slider from "../components/homepage/Content02Slider";
import HomepageContent03 from "../components/homepage/Content03";
import SliderPlatform from "../components/slideExplore/SlidePlatform";
import HomepageMembersPartners from "../components/homepage/MembersPartners";
import { ButtonComponents } from "../components/stylecomponents/Button";
import { getCreatorWhitelists } from "../models/CreatorWhitelist";
import { getCollection } from "../models/Collection";

const HomePage = () => {
  const router = useRouter();
  const [assetList, setAssetList] = useState([]);
  const [collections, setCollections] = useState([]);
  const fetchAsset = useCallback(async () => {
    let assets = await getAssets();
    console.log("🚀 ~ file: index.jsx ~ line 19 ~ fetchAsset ~ assets", assets?.data);

    if (assets?.status) {
      setAssetList(assets?.data);
    }
  }, []);
  const fetchCollections = useCallback(async () => {
    const result = await getCollection();
    if(result?.data){
      console.log("%c collections => ", "color: cyan;", result?.data)
      setCollections(result?.data);
    }
  }, []);

  const fetchCreator = useCallback(async () => {
    const _where = `{ isVerified: { _eq: true } }`;
    const _whitelistFilter = `{ isOfficial: { _eq: true } }`;
    let assets = await getUsers(_where);
    let _whitelist = await getCreatorWhitelists(_whitelistFilter);
    if (assets?.status && _whitelist?.status) {
      assets = assets.data;
      _whitelist = _whitelist.data;
      assets = assets.filter((usr) => {
        let wallet = usr.wallet;
        return _whitelist.find((acc) => acc.creatorWallet === wallet);
      });
      setAssetList(assets);
    }
  }, []);

  useEffect(() => {
    fetchCreator();
  }, [fetchCreator]);
  // useEffect(() => {
  //   fetchAsset();
  // }, [fetchAsset]);
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  return (
    <>
      <HomepageBanner />
      <SliderPlatform />
      {/* <HomepageContent01 /> */}
      {/* <HomepageContent02Slider  /> */}
      {/* Slider Official Creators  */}
      <section className="my-4 homepage-slider-paltform" id="Official-Creators">
        <Container>
          <Row>
            <Col xs={12} align="center" className="mb-5">
              <h1 className="fw-bold ci-purple">Collections</h1>
            </Col>
            {
              (collections ?? []).map((item, index) => {
                return (
                  <Col xl={3} lg={4} md={6} sm={6} className="my-2" key={index}>
                    <CardTrending
                      ClassTitle="text-title-slidertren mb-0"
                      img={item.coverUrl}
                      title={item.name ?? "Unknown"}
                      userData={item}
                      link={`Explore-collection/${item.id}`}
                    />
                  </Col>
                )
              })
            }
          </Row>
        </Container>
        {/* <div className="container">
          <div className="row mb-3">
            <div className="col-sm-6 col-12">
              <h1 className="ci-purple">Official Creators</h1>
            </div>
            <div className="col-sm-6 col-12" align="right">
              <ButtonComponents
                color="secondary"
                size="size_180"
                className="mx-2"
                onClick={() => router.push("/Explore-collection")}
              >
                <p className="fw-bold">OFFICIAL CREATORS</p>
              </ButtonComponents>
            </div>
          </div>
        </div>
        {assetList.length > 4 ? (
          <SlideExplore assetList={assetList} />
        ) : (
          <>
            <Container>
              <div className="row">
                {assetList.map((_item, index) => {
                  console.log("🚀 ~ file: index.jsx:93 ~ {assetList.map ~ _item:", _item)
                  return (
                    <div className="col-12 col-md-6 col-lg-4 px-1 mb-lg-0 mb-3" key={index}>
                      <CardTrending
                        ClassTitle="text-title-slidertren mb-0"
                        img={_item.profileImage}
                        title={_item.name ?? "Unknown"}
                        userData={_item}
                        link={`Explore-collection/users/${_item.wallet}`}
                      />
                    </div>
                  )
                })}
              </div>
            </Container>
          </>
        )}
        <Link href="#member-partner">
          <a className="scroll-down" address="true"></a>
        </Link> */}
      </section>
      {/* Slider Official Creators  */}
      <HomepageMembersPartners />
      {/* <HomepageContent03 /> */}
    </>
  );
};

export default HomePage;
HomePage.layout = Mainlayout;
