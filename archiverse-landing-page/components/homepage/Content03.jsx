import { useRouter } from "next/router";
import { Col, Container, Row, Button } from "react-bootstrap";
import { ButtonComponents } from "../stylecomponents/Button";
import CardSwap from "../card/CradSwap";

const HomepageContent03 = () => {
  const router = useRouter();

  return (
    <>
      <section id="nft-platform">
        <Container>
          <Row>
            <Col md={6}>
              <Row>
                <CardSwap />
              </Row>
            </Col>
            <Col md={6} className="d-flex align-items-center">
              <div className="d-block">
                <h1 className="ci-purple">FT PLATFORM</h1>
                <div className="my-3">
                  <span className="homepage-content-detail text-uppercase">
                    Launch BUY aND{" "}
                    <span className="ci-purple text-uppercase">sWAP</span> YOUR
                    Token
                  </span>
                </div>
                <p className="mb-4 fw-semibold">
                  Swaple is created with the conviction that it will improve
                  participation and accelerate innovation in this market,
                  ultimately making mass adoption a more tenable proposition.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomepageContent03;
