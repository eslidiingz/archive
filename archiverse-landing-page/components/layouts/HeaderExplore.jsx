import Link from "next/link";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";

function HeaderExplore(props) {
  return (
    <>
      <section className="bg-black">
        <div className="container-fluid section-gradient">
          <div className="container pdt-80 h-full">
            <div className="row h-full">
              <div className="col-12 col-md-9 col-lg-8 col-xl-9 ms-auto mt-auto">
                <div className="d-flex justify-content-xl-between align-items-xl-end flex-xl-row flex-column">
                  <div>
                    <h4 className="ci-white">{props.title}</h4>
                    <p className="ci-white">
                      Created by{" "}
                      <span className="text-purple">{props.name}</span>
                    </p>
                  </div>
                  <div className="d-flex flex-button align-self-xl-center gap-2 mb-2 mb-xl-0 ">
                    <button className="d-flex gap-2 btn-white px-3 justify-content-center">
                      <i className="fal fa-plus"></i>
                      <h6 className="mb-0">Add to watchlist</h6>
                    </button>
                    <button className="d-flex gap-2 btn-white-outline px-5 justify-content-center">
                      <i className="far fa-file-chart-line"></i>
                      <h6 className="mb-0">Report</h6>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid bd-bottom layoutpadding-iltem">
          <div className="container position-relative ">
            <div className="row">
              <div className="header-show">
                <div className="col-12 col-lg-8 col-xl-9 ms-auto mt-auto">
                  <div className="row px-3 px-md-0">
                    <div className="col-12 bg-round my-2">
                      <div className="d-flex align-items-center justify-content-between px-4 py-2 header-sub flex-nowrap">
                        <div className="w-fit">
                          <div className="f32 ci-white w-80-dot text-center">
                            {props.item}
                          </div>
                          <h6 className="fw-500 text-purple text-center">
                            Item
                          </h6>
                        </div>
                        <hr className="line-h" />
                        <div className="w-fit">
                          <div className="f32 ci-white w-80-dot text-center">
                            {props.owners}
                          </div>
                          <h6 className="fw-500 text-purple text-center">
                            Owners
                          </h6>
                        </div>
                        <hr className="line-h" />
                        <div className="w-fit">
                          <div className="d-flex">
                            <img
                              alt=""
                              src="/assets/rsu-image/icons/coin.svg"
                              width={16}
                            />
                            <div
                              className="f32 ci-white w-80-dot text-center"
                              title="4,612"
                            >
                              {props.price}
                            </div>
                          </div>
                          <h6 className="fw-500 text-purple text-center">
                            floor price
                          </h6>
                        </div>
                        <hr className="line-h" />
                        <div className="w-fit">
                          <div className="d-flex mx-auto">
                            <img
                              alt=""
                              src="/assets/rsu-image/icons/coin.svg"
                              width={16}
                            />
                            <div className="f32 ci-white w-80-dot text-center">
                              {props.volume}
                            </div>
                          </div>
                          <h6 className="fw-500 text-purple text-center">
                            volume traded
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="header-hide">
                <div className="row d-flex my-2 ">
                  <div className="col-custom-header ">
                    <div className="mx-auto bg-round2 pb-2 pt-1">
                      <div className="f32 ci-white w-80-dot text-center mx-auto">
                        {props.item}
                      </div>
                      <h6 className="fw-500 text-purple text-center">Item</h6>
                    </div>
                  </div>
                  <div className="col-custom-header">
                    <div className="mx-auto bg-round2 pb-2 pt-1">
                      <div className="f32 ci-white w-80-dot text-center mx-auto">
                        {props.owners}
                      </div>
                      <h6 className="fw-500 text-purple text-center">Owners</h6>
                    </div>
                  </div>
                  <div className="col-custom-header">
                    <div className="mx-auto bg-round2 pb-2 pt-1">
                      <div className="d-flex justify-content-center">
                        <img
                          alt=""
                          src="/assets/rsu-image/icons/coin.svg"
                          width={16}
                        />
                        <div
                          className="f32 ci-white w-80-dot text-center"
                          title="4,612"
                        >
                          {props.price}
                        </div>
                      </div>
                      <h6 className="fw-500 text-purple text-center">
                        floor price
                      </h6>
                    </div>
                  </div>
                  <div className="col-custom-header">
                    <div className="mx-auto bg-round2 pb-2 pt-1">
                      <div className="d-flex justify-content-center">
                        <img
                          alt=""
                          src="/assets/rsu-image/icons/coin.svg"
                          width={16}
                        />
                        <div className="f32 ci-white w-80-dot text-center">
                          {props.volume}
                        </div>
                      </div>
                      <h6 className="fw-500 text-purple text-center">
                        volume traded
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="header-img-user position-absolute">
              <img
                alt=""
                src={props.img || "/assets/image/archiverse/default_img.png"}
                onError={(e) => {
                  e.target.src = "/assets/image/archiverse/default_img.png";
                  e.target.onError = null;
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default HeaderExplore;
