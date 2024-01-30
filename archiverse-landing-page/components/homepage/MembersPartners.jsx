import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Config from "../../configs/config";
import Link from "next/link";

const HomepageMembersPartners = () => {
  return (
    <>
      <section className="homepage-mp-main-bg" id="member-partner">
        <Container>
          <Row>
            <Col sm={12}>
              <h1 className="homepage-mp-title-gradient">MEMBERS</h1>
              <div className="d-flex align-items-center justify-content-center my-4">
                <img
                  src="/assets/image/archiverse/members.png"
                  className="w-100"
                />
              </div>
            </Col>
            <Col sm={12}>
              <hr style={{ borderTop: "2px solid" }} />
            </Col>
            <Col sm={12} className="mt-5">
              <h1 className="homepage-mp-title-gradient">OUR PARTNERS</h1>
              <h6>
                Who are helping us pave way towards a brand new Digital Economy.
              </h6>
              <div className="d-flex align-items-center justify-content-center my-4">
                <img
                  src="/assets/image/archiverse/partners.png"
                  className="w-100"
                />
              </div>
            </Col>
          </Row>
        </Container>
        <Link href="#section-banner">
          <a className="scroll-down" address="true"></a>
        </Link>
      </section>
    </>
  );
};

export default HomepageMembersPartners;
