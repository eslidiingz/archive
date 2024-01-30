import NavbarLeft from "../components/Layouts/NavbarLeft";
import { useEffect, useState } from "react";
import StakingItemModal from "../components/Modal/StakingItem";

export default function Staking() {
  const [showStakingItemModal, setStakingItemModal] = useState(false);

  const handleCloseStakingItemModal = () => {
    setStakingItemModal(false);
  };

  {
    return (
      <div className="container">
        <h1 className="text-center text-pink font-large">STAKING</h1>
        <div className="index-layout">
          <NavbarLeft />
          <div className="content">
            <div className="row">
              <div className="col-xxl-12 display-grid">
                <div className="flex-start">
                  <img
                    src={"/assets/img/icon-1.webp"}
                    alt=""
                    className=" w-5 me-2"
                  />{" "}
                  <span className="txt-color-fa"> 14785.0125 DMS</span>
                  <div>
                    <div className=" grid-center px-2">
                      <span className="f-16">23.00</span>
                      <button className="btn btn-claim "></button>
                    </div>
                  </div>
                </div>
                <div className="bg-primary p-4 p-lg-2 container ">
                  <div className="d-flex justify-content-between">
                    <h4>POWER 595</h4>
                    <p>3/50</p>
                  </div>
                  <div className=" py-4 row">
                    <div className="col set-col-4 my-3 my-lg-0 position-relative">
                      <img
                        src={"/assets/img/card-01.webp"}
                        alt=""
                        className="w-100"
                      />
                      <div className="position-close-card">
                        <a href="#">
                          <img
                            src={"/assets/img/btn-close.webp"}
                            alt=""
                            className="w-50"
                          />
                        </a>
                      </div>

                      <div className="d-flex justify-content-between">
                        <div>
                          <img
                            src={"/assets/img/staking.webp"}
                            alt=""
                            className="w-50"
                            aria-label="Close"
                          />
                        </div>
                        <div>
                          <p className="font-sm-p">12.5 DMS</p>
                        </div>
                      </div>
                    </div>
                    <div className="col set-col-4 my-3 my-lg-0 position-relative">
                      <img
                        src={"/assets/img/card-02.webp"}
                        alt=""
                        className="w-100"
                      />
                      <div className="position-close-card">
                        <a href="#">
                          <img
                            src={"/assets/img/btn-close.webp"}
                            alt=""
                            className="w-50"
                          />
                        </a>
                      </div>

                      <div className="d-flex justify-content-between">
                        <div>
                          <img
                            src={"/assets/img/staking.webp"}
                            alt=""
                            className="w-50"
                          />
                        </div>
                        <div>
                          <p className="font-sm-p">6.25 DMS</p>
                        </div>
                      </div>
                    </div>
                    <div className="col set-col-4 my-3 my-lg-0 position-relative">
                      <img
                        src={"/assets/img/card-03.webp"}
                        alt=""
                        className="w-100"
                      />
                      <div className="position-close-card">
                        <a href="#">
                          <img
                            src={"/assets/img/btn-close.webp"}
                            alt=""
                            className="w-50"
                          />
                        </a>
                      </div>

                      <div className="d-flex justify-content-between">
                        <div>
                          <img
                            src={"/assets/img/staking.webp"}
                            alt=""
                            className="w-50"
                          />
                        </div>
                        <div>
                          <p className="font-sm-p">6.0416 DMS</p>
                        </div>
                      </div>
                    </div>
                    <div className="col set-col-4 my-3 my-lg-0 position-relative"
                      onClick={() => setStakingItemModal(true)}
                      role="button"
                    >
                      <img
                        src={"/assets/img/card-no.webp"}
                        alt=""
                        className="w-100"
                      />
                      <div className="position-center">
                        <img
                          src={"/assets/img/icon-plus.webp"}
                          alt=""
                          className="w-plus-full"
                        />
                      </div>
                    </div>
                    <div className="col set-col-4 my-3 my-lg-0 position-relative"
                      onClick={() => setStakingItemModal(true)}
                      role="button"
                    >
                      <img
                        src={"/assets/img/card-no.webp"}
                        alt=""
                        className="w-100"
                      />
                      <div className="position-center">
                        <img
                          src={"/assets/img/icon-plus.webp"}
                          alt=""
                          className="w-plus-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StakingItemModal
          onClose={handleCloseStakingItemModal}
          show={showStakingItemModal}
        />
      </div>
    );
  }
}
