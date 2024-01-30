import { useCallback, useState } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import { getlistingMarketplace } from "../../models/Marketplace";
import { useEffect } from "react";
import { getCollection } from "../../models/Collection";
import { getUsers } from "../../models/User";
import CardNFTcoll from "../../components/card/CardNFTcoll";
import { Col, Container, Row } from "react-bootstrap";

const ExploreCollectionIndex = () => {
  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { languages } = userinfo;

    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setUserInfo({
        languages: [...languages, value],
        response: [...languages, value],
      });
    }

    // Case 2  : The user unchecks the box
    else {
      setUserInfo({
        languages: languages.filter((e) => e !== value),
        response: languages.filter((e) => e !== value),
      });
    }
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
  const [marketData, setMarketData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [collectionList, setCollectionList] = useState([
    // { id: 1, coverUrl: "", name: "TEST" },
  ]);
  const [isDone, setIsDone] = useState(false);
  const fetching = useCallback(() => {
    const fetchingMarket = async () => {
      let markets = await getlistingMarketplace();
      let onlyActive = markets.filter((x) => x.isActive);

      setMarketData(onlyActive);
    };
    const fetchingCollections = async () => {
      const data = await getCollection();
      console.log(
        "🚀 ~ file: collection.jsx ~ line 89 ~ fetchingCollections ~ data",
        data
      );
      if (data?.status) {
        setCollectionList(data?.data);
      }
    };
    const fetchingUsers = async () => {
      let data = await getUsers();

      setUserList(data.data);
    };
    fetchingUsers();
    fetchingCollections();
    fetchingMarket();
    setIsDone(true);
  }, []);
  useEffect(() => {
    fetching();
  }, []);
  return (
    <>
      <div className="section_explorecollection"></div>
      <section>
        <Container>
          <Row>
            <Col xs={12} align="center" className="mb-5">
              <h1 className="fw-bold ci-purple">NFT Collection</h1>
            </Col>
            {collectionList.map((item, index) => (
              <Col xl={3} lg={4} md={6} sm={6} className="my-2" key={index}>
                <CardNFTcoll
                  collectionId={item.id}
                  img={item.coverUrl}
                  imguser={item.backgroundUrl}
                  detail={item.name}
                  description={item.description}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ExploreCollectionIndex;
ExploreCollectionIndex.layout = Mainlayout;
