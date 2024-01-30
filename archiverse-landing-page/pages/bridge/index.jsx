import { useEffect } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
// import Tab from 'react-bootstrap/Tab'
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Bridge = () => {
  const [AdvancedStep, setAdvancedStep] = useState("stepAdvanced");
  const [valuefrom, setValuefrom] = useState("BUSD");
  const [valueto, setValueto] = useState("OM");

  // setdropdownlist value
  const valuefromSelect = (e) => {
    setValuefrom(e);
  };
  const valuetoSelect = (e) => {
    setValueto(e);
  };

  return (
    <>
      <section className="section-layout-detail">
        <Container>
          <Row className="d-flex justify-content-center align-items-center text-center h-100">
            <Col lg="12" className="pt-5 mt-5">
              <h1 className="txt-h1 mt-5">Bridge SWAp</h1>
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
          <Row>
            <Col lg="12">
              <div className="box-bridge-1">
                <h1 className="text-h1-bridge pt-2">Bridge</h1>
                <hr className="hr-lin" />
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <p className="text-detail-bridge">
                      From : Binance Smart Chain
                    </p>
                  </div>
                  <div>
                    <p className="text-detail-bridge">To : OM Chain</p>
                  </div>
                </div>

                <div className=" row">
                  <div className="col-lg-5 col-12 ">
                    <div className="position-relative box-md-bg-bridge">
                      <div className="bridge-box-left">
                        <div className="d-flex justify-content-between">
                          <div className="col">From</div>
                          <div className="col-auto text-end">Balance: 1</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          {/* 1 */}

                          <div>
                            <input
                              type="number"
                              className="input-box-bridge"
                              placeholder="Please enter value"
                              defaultValue="100.5"
                              id="exampleFormControlInput1"
                            />
                          </div>
                          {/* 2 */}
                          <div className="col-auto d-flex align-items-center mt-2">
                            <p className="text-mex mb-0 mx-2">MAX</p>
                            <img className="" src="/assets/swaple/coin.svg" />
                            <Dropdown>
                              <DropdownButton
                                title={valuefrom}
                                variant="currency-select text-white btn-coin-2"
                                onSelect={valuefromSelect}
                              >
                                <Dropdown.Item eventKey="BUSD">
                                  BUSD
                                </Dropdown.Item>
                              </DropdownButton>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" col-lg-2 col-12 px-0 set-center-txt-md-Transfer">
                    {/* -----------1-------------- */}
                    <div className="position-relative mb-1 mb-md-3 mb-lg-0">
                      <div className="bridge-box-top">
                        <img
                          className="img-lock"
                          src="/assets/swaple/lock.svg"
                        />
                        <span className="text-btn-transfer "> Unlock</span>
                      </div>
                    </div>
                    {/* --------------2----------------- */}
                    <div className=" position-relative mt-1  mt-md-0 mt-lg-0 ">
                      <div className="bridge-box-down col col-md-6">
                        <div className="text-btn-transfer">Transfer</div>
                        <img className="" src="/assets/swaple/arrow.svg" />
                      </div>
                    </div>
                  </div>
                  {/* --------------------------------------- */}
                  <div className=" col-lg-5 col-12">
                    <div className="position-relative box-md-bg-bridge d-flex flex-row-reverse">
                      <div className="bridge-box-right ">
                        <div className="row">
                          <div className="col">To :</div>
                          <div className="col-auto text-end">Balance: 10</div>
                        </div>
                        <div className="row">
                          <div className="d-flex justify-content-between mt-2">
                            <input
                              type="text"
                              className="form-control input-box-bridge"
                              defaultValue="21"
                              id="exampleFormControlInput1"
                              placeholder="Please enter value"
                            />
                            <div className="d-flex">
                              <img
                                className=""
                                src="/assets/swaple/coin01.svg"
                              />
                              <Dropdown>
                                <DropdownButton
                                  title={valueto}
                                  variant="currency-select text-white btn-coin-2"
                                  onSelect={valuetoSelect}
                                >
                                  <Dropdown.Item eventKey="ETH">
                                    ETH
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="OC">
                                    OC
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="BTC">
                                    BTC
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="ETH">
                                    ETH
                                  </Dropdown.Item>
                                </DropdownButton>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ------------------------------------------- */}
                </div>
                <br />
                <div className="row d-flex justify-content-end">
                  <Col lg="4" md="12" sm="12" className="">
                    <div className="d-flex justify-content-between my-3">
                      <p className="text-detail-bridge">Slippage </p>
                      <p className="text-detail-bridge">0.5%</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <p className="text-detail-bridge">Gas on destination </p>
                      <p className="text-detail-bridge">0 BNB</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <p className="text-detail-bridge">Free</p>
                      <p className="text-detail-bridge">0.2545241541 ETH</p>
                    </div>
                  </Col>
                </div>
                <hr className="hr-lin" />
                <div className="row d-flex justify-content-end">
                  <Col lg="12" md="12" sm="12" className="">
                    <div className="d-lg-flex d-block justify-content-end align-items-center">
                      {AdvancedStep == "stepAdvanced" ? (
                        <>
                          <div
                            className="d-flex align-items-center justify-content-center"
                            onClick={() =>
                              setAdvancedStep("stepRecipientAddress")
                            }
                          >
                            <img
                              className="me-2"
                              src="/assets/swaple/settings.svg"
                            />
                            <p className=" text-green-box-footer  mb-0 cursor-pointer">
                              {" "}
                              Advanced
                            </p>
                          </div>
                          <OverlayTrigger
                            trigger="click"
                            key="bottom"
                            placement="bottom"
                            overlay={
                              <Popover
                                id={`popover-positioned-bottom`}
                                className="popover-box"
                              >
                                <Popover.Body>
                                  <div className="d-flex justify-content-between">
                                    <strong>Daily Limit </strong>
                                    <strong>1,000,000,000 CLASS</strong>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <strong>Max per Tx </strong>
                                    <strong>100,000,000 CLASS </strong>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <strong>Min per Tx </strong>
                                    <strong>300 CLASS </strong>
                                  </div>
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <div className="d-flex align-items-center justify-content-center mb-lg-0 mb-3 ms-lg-3">
                              <img
                                className="me-2"
                                src="/assets/swaple/equalizer.svg"
                              />
                              <p className=" text-green-box-footer mb-0">
                                {" "}
                                System Feedback{" "}
                              </p>
                            </div>
                          </OverlayTrigger>
                        </>
                      ) : (
                        <></>
                      )}
                      {AdvancedStep == "stepRecipientAddress" ? (
                        <>
                          <div className="layout-input_bridge mb-lg-0 mb-3">
                            <input
                              type="text"
                              placeholder="Recipient Address"
                              className="input-bridge"
                            />
                          </div>

                          <div
                            className="d-flex align-items-center justify-content-center"
                            onClick={() => setAdvancedStep("stepAdvanced")}
                          >
                            <img
                              className="me-2"
                              src="/assets/swaple/settings.svg"
                            />
                            <p className=" text-green-box-footer  mb-0 cursor-pointer">
                              {" "}
                              Clear
                            </p>
                          </div>
                          <OverlayTrigger
                            trigger="click"
                            key="bottom"
                            placement="bottom"
                            overlay={
                              <Popover
                                id={`popover-positioned-bottom`}
                                className="popover-box"
                              >
                                <Popover.Body>
                                  <div className="d-flex justify-content-between">
                                    <strong>Daily Limit </strong>
                                    <strong>1,000,000,000 CLASS</strong>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <strong>Max per Tx </strong>
                                    <strong>100,000,000 CLASS </strong>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <strong>Min per Tx </strong>
                                    <strong>300 CLASS </strong>
                                  </div>
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <div className="d-flex align-items-center justify-content-center mb-lg-0 mb-3 ms-lg-3">
                              <img
                                className="me-2"
                                src="/assets/swaple/equalizer.svg"
                              />
                              <p className=" text-green-box-footer">
                                {" "}
                                System Feedback{" "}
                              </p>
                            </div>
                          </OverlayTrigger>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Bridge;
Bridge.layout = Mainlayout;
