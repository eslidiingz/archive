import { useCallback, useEffect, useState } from "react";
import React from "react";
import { Container, Row, Col, Nav, Button, Form } from "react-bootstrap";
import BridgeSwapCard from "../../components/launchpad/BridgeSwap";
import { useRouter } from "next/router";

const SwapType = ({ children }) => {
  const router = useRouter();
  const DropdowncoinList = ["BUSD by BSC Chain", "BUSD by OM Chain", "FIAT"];
  const routePath = ["bsc", "om", "fiat"];

  const [redirectRoute, setRedirectRoute] = useState("");

  const onRedirectRoute = (_routeName) => {
    const routeIndex = DropdowncoinList.indexOf(_routeName);

    router.push(`/Launchpad/${routePath[routeIndex]}`);
  };

  const checkRouter = useCallback(() => {
    if (!router.isReady) return;

    const routeName = router.pathname.split("/")[2];
    const routeIndex = routePath.indexOf(routeName);
    const routerName = DropdowncoinList[routeIndex];

    setRedirectRoute(routerName);
  }, [router]);

  useEffect(() => {
    checkRouter();
  }, [checkRouter]);

  return (
    <>
      <section className="section-layout-detail">
        <Container>
          <Row className="d-flex justify-content-center align-items-center text-center h-100">
            <Col lg="12" className="pt-5 mt-5">
              <h1 className="fw-bold mt-5">Launchpads</h1>
              <div className="d-flex justify-content-center align-items-center text-center">
                <p className="detail-p w-75">
                  Swaple is created with the conviction that it will improve
                  participation and accelerate innovation in this market,
                  ultimately making mass adoption a more tenable proposition.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="set-section-detail">
        <Container>
          <Row className="col-lg-6 mx-auto">
            <Col lg="12">
              <div className="d-flex align-items-center w-100"></div>
            </Col>
            <Col lg="12">
              <div className="box-bridge">
                <Row>
                  <Col lg="12" className="mb-lg-0 mb-5 bg_layout-launchpad">
                    <h2 className="ci-purplepink font-28 pt-2 text-center mb-5">
                      Swap {redirectRoute}
                    </h2>
                    <div className="d-flex justify-content-start align-items-center mb-4">
                      {/* <p className="text-white me-2">Pay By </p> */}
                      <Form.Select
                        value={redirectRoute}
                        className="select-type-box"
                        onChange={(event) =>
                          onRedirectRoute(event.target.value)
                        }
                      >
                        {DropdowncoinList.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </Form.Select>
                    </div>

                    <div>{children}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SwapType;
