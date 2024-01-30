import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Mainlayout from "/components/layouts/Mainlayout";
import React from "react";
import Tab from "react-bootstrap/Tab";
import { Container, Nav, Row, Col } from "react-bootstrap";
import Link from "next/link";

import Setprofile from "/components/profile/profile";
import Setvertify from "/components/profile/vertify";
import SetInventory from "/components/profile/inventory";
import SetActivity from "/components/profile/activity";
import SetFavorites from "/components/profile/favorites";
import SetHidden from "/components/profile/hidden";
import SetCollection from "/components/profile/collection";
import SetOffer from "/components/profile/offer";
import SetSetting from "/components/profile/setting";
import Setplacement from "/components/profile/placement";
import Setbiding from "/components/profile/biding";

const Profile = (props) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("#profile");

  const handleChangeTab = (selectedTab) => {
    setActiveTab(selectedTab);
  };
  useEffect(() => {
    let hash = window.location.hash ? window.location.hash : "#profile";
    setActiveTab(hash);
  }, [router.events]);

  return (
    <Mainlayout setActiveTab={setActiveTab} activeTab={activeTab}>
      <div className="section_explorecollection"></div>
      <section>
        <Container>
          <Row>
            <Col lg={6}>
              <h1 className="fw-bold">Profile</h1>
            </Col>
            <Col
              lg={6}
              className="d-flex align-items-center justify-content-end"
            >
              <Link href="/">
                <p className="fw-bold me-2 cursor-pointer">Home</p>
              </Link>{" "}
              {">"}
              <Link href="">
                <p className="fw-bold ms-2 cursor-pointer">Profile</p>
              </Link>
            </Col>
            <Col xs={12} className="mt-5">
              <Tab.Container
                id="left-tabs-example"
                className="mb-3 flex-scroll"
                defaultActiveKey={"#profile"}
                activeKey={activeTab}
                onSelect={handleChangeTab}
              >
                <div className="container d-lg-flex d-block mb-4">
                  <div className="w-300-100profile">
                    <Nav
                      variant="pills"
                      className="flex-column tab-profile nav-profile-md"
                      defaultActiveKey={"#profile"}
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="#profile" href="#profile">
                          <img
                            src="/assets/rsu-image/icons/profile.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Profile
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="#collection" href="#collection">
                          <img
                            src="/assets/rsu-image/icons/collection.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Collection
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="#inventory" href="#inventory">
                          <img
                            src="/assets/rsu-image/icons/create.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Inventory
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="#placement" href="#placement">
                          <img
                            src="/assets/rsu-image/icons/placement-list.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Placement list
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="#activity" href="#activity">
                          <img
                            src="/assets/rsu-image/icons/activity.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Activity
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="#biding" href="#biding">
                          <img
                            src="/assets/rsu-image/icons/bidding.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Biding list
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="#offer" href="#offer">
                          <img
                            src="/assets/rsu-image/icons/offer.svg"
                            className="mx-3 profile-icon-color-black"
                          />
                          Offer
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                  <div className="col bd-left ps-lg-4 ps-0">
                    <Tab.Content className="px-3 px-lg-0">
                      <Tab.Pane eventKey="#profile">
                        <Setprofile isActive={activeTab} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="#inventory">
                        <SetInventory isActive={activeTab} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="#activity">
                        <SetActivity isActive={activeTab} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="#collection">
                        <SetCollection isActive={activeTab} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="#placement">
                        <Setplacement isActive={activeTab} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="#biding">
                        <Setbiding />
                      </Tab.Pane>
                      <Tab.Pane eventKey="#offer">
                        <SetOffer />
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </div>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </section>
    </Mainlayout>
  );
};

export default Profile;
