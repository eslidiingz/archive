import { useCallback, useState } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import CardTrending from "../../components/card/CardTrending";
import { Col, Container, Row } from "react-bootstrap";


import Dropdown from "react-bootstrap/Dropdown";
import SlideTrending from "../../components/Slide/SlideTrending";
import SlideCollection from "../../components/Slide/SlideCollection";

import CardCollection from "../../components/card/CardCollection";
import { getlistingMarketplace } from "../../models/Marketplace";
import { useEffect } from "react";
import { getCollection } from "../../models/Collection";
import { getUsers } from "../../models/User";
import { getCreatorWhitelists } from "../../models/CreatorWhitelist";

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
      console.log("Market Data : ", onlyActive);
      setMarketData(onlyActive);
    };
    const fetchingCollections = async () => {
      let data = await getCollection();
      console.log(data.data);
      setCollectionList(data.data);
    };
    const fetchingUsers = async () => {
      const filter = `{ isOfficial: { _eq: true } }`;
      const userFilter = `{ isVerified: { _eq: true } }`;
      let _whitelist = await getCreatorWhitelists(filter);
      let _users = await getUsers(userFilter);
      _whitelist = _whitelist.data;
      _users = _users.data;
      _users = _users.filter(usr => {
        let wallet = usr.wallet;
        return _whitelist.find(acc => acc.creatorWallet === wallet);
      })
      // console.log("User Data : ", _users);
      setUserList(_users);
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
              <h1 className="fw-bold ci-purple">Official Creators</h1>
            </Col>
            {userList.map((item, index) => {
              return (
                <Col xl={3} lg={4} md={6} sm={6} className="my-2" key={index}>
                  <CardTrending
                    ClassTitle="text-title-slidertren mb-0"
                    img={item.profileImage}
                    title={item.name ?? "Unknown"}
                    userData={item}
                    link={`Explore-collection/users/${item.wallet}`}
                  />
                </Col>
              );
            })}
            {
              (userList ?? []).length == 0 &&  (
                <h3 className="text-center">No data</h3>
              )
            }
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ExploreCollectionIndex;
ExploreCollectionIndex.layout = Mainlayout;
