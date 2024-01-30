import Link from "next/link";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";

function HeaderExploreProfile(props) {
  return (
    <>
      <section className="bg-black">
        <div className="container-fluid section-gradient">
          <div className="container pdt-80 h-full">
            <div className="row h-full">
              <div className="col-12 col-md-9 col-lg-8 col-xl-9 ms-auto mt-auto">
                <div className="d-flex justify-content-xl-between align-items-xl-end flex-xl-row flex-column">
                  <div className="d-flex">
                    <h4 className="ci-white">{props.title}</h4>
                    <img
                      className="ci-green"
                      alt=""
                      width={20}
                      src="/assets/rsu-image/icons/verify-black.svg"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <Link href="#">
                    <p className="text-detail-di_ex">
                      <img src="/assets/swaple/icon-omcoin.webp" />
                      &nbsp;&nbsp;{props.codeDiamond}&nbsp;&nbsp;
                      <i className="far fa-clone ci-green text-detail-di_copy_ex"></i>
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid bd-bottom pb-5">
          <div className="container position-relative ">
            <div className="row">
              <div className="header-show">
                <div className="col-12 col-lg-8 col-xl-9 ms-auto mt-auto">
                  <div className="row px-3 px-md-0">
                    <div className="d-flex">
                      <Link href={props.LinkTwitter}>
                        <p className="text-detail-so_ex layout-soical-pro_ex">
                          <i className="fab fa-twitter ci-white"></i>{" "}
                          {props.nameTwitter}
                        </p>
                      </Link>
                      <Link href={props.LinkIg}>
                        <p className="text-detail-so_ex layout-soical-pro_ex">
                          <i className="fab fa-instagram ci-white"></i>{" "}
                          {props.nameIg}
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-8 col-xl-9 ms-auto mt-auto">
                  <div className="row px-3 px-md-0">
                    <div className="col-7 my-2">
                      <div className="d-flex align-items-center justify-content-between px-1 py-2 header-sub flex-nowrap">
                        <div className="w-fit">
                          <p className="text-makeanoff-de03_ex">
                            {props.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-7 my-2">
                      <div className="d-flex align-items-center justify-content-between px-1 py-2 header-sub flex-nowrap">
                        <div className="w-fit">
                          <p className="text-makeanoff-de03_ex">
                            {props.descriptionDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="header-hide">
                <div className="row d-flex my-2 ">
                  <div className="layoutdetail-soical_ex col-custom-headers">
                    <div className="d-flex">
                      <Link href={props.LinkTwitter}>
                        <p className="text-detail-so_ex layout-soical-pro_ex">
                          <i className="fab fa-twitter ci-white"></i>
                          {props.nameTwitter}
                        </p>
                      </Link>
                      <Link href={props.LinkIg}>
                        <p className="text-detail-so_ex layout-soical-pro_ex">
                          <i className="fab fa-instagram ci-white"></i>
                          {props.nameIg}
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="layoutdetail_ex col-custom-headers">
                    <div className="w-fit">
                      <p className="text-makeanoff-de03_ex">
                        {props.description}
                      </p>
                    </div>
                  </div>
                  <div className="col-custom-headers">
                    <div className="w-fit">
                      <p className="text-makeanoff-de03_ex">
                        {props.descriptionDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="header-img-user  position-absolute"
              style={{ top: "-80%" }}
            >
              <img
                alt=""
                src={
                  props.imgProfile || "/assets/image/archiverse/default_img.png"
                }
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
export default HeaderExploreProfile;
