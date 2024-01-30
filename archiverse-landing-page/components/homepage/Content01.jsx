import { useRouter } from "next/router";
import { Col, Container, Row, Button } from "react-bootstrap";
import { ButtonComponents } from "../stylecomponents/Button";
import CardHomepageContent01 from "../card/CradHomepageContent01";

const HomepageContent01 = () => {
  const router = useRouter();

  return (
    <>
      <section id="nft-platform">
        <Container>
          <Row>
            <Col md={6} className="d-flex align-items-center">
              <div className="d-block">
                <h1 className="ci-purple">NFT PLATFORM</h1>
                <div className="my-3">
                  <span className="homepage-content-detail text-uppercase">
                    Create sell buy and{" "}
                    <span className="ci-purple text-uppercase">sWAP</span> your
                    NFT
                  </span>
                </div>
                <p className="mb-4 fw-semibold">
                  This marketplace was created with the intention of ushering in
                  a new era for the cryptoasset market in which safe, cheap,
                  easy, limitless and direct peer-to-peer swapping of
                  any-and-all cryptoassets is a reality. Its accompanying
                  community forum will help ensure a such transactions are
                  conducted by users in a sensible and informed manner.
                  Archiverse is created with the conviction that it will improve
                  participation and accelerate innovation in this market,
                  ultimately making mass adoption a more tenable proposition.
                </p>
                <div className="d-flex align-items-center">
                  <ButtonComponents
                    color="secondary"
                    size="size_180"
                    onClick={() =>
                      router.push("/Explore-collection/collection")
                    }
                  >
                    <p>Explore Collections</p>
                  </ButtonComponents>
                  <ButtonComponents
                    color="secondary"
                    size="size_140"
                    className="mx-2"
                    onClick={() => router.push("/Explore-collection")}
                  >
                    <p>Official Creators</p>
                  </ButtonComponents>
                  <ButtonComponents
                    color="primary"
                    size="size_140"
                    onClick={() => router.push("/Create")}
                  >
                    <p>Create</p>
                  </ButtonComponents>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <Row>
                <CardHomepageContent01 />
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomepageContent01;
