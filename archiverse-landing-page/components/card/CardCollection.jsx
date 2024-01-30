import { useState } from "react";
import Link from "next/link";

function CardCollection(props) {
  const [isActive, setActive] = useState(false);
  const toggleFav = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div className="card_collection">
        <img
          className="img-card_collection"
          src={props.img || "/assets/image/archiverse/default_img.png"}
          alt="Card image"
          onError={(e) => {
            e.target.src = "/assets/image/archiverse/default_img.png";
            e.target.onError = null;
          }}
        />
        {/* <div className="d-flex gap-2 layout-main-icon_hearth" align="right">
            <i className={`fas fa-heart layout04 layout-icon_hearth ${isActive ? "icon-purple" : ""}`} onClick={toggleFav}></i>
          </div> */}
        <div className="row">
          <div className="col-xxl-12">
            <p className="text-main-card_collection">Water Color</p>
          </div>
        </div>

        <div className="card_new-body">
          <div className="row">
            <div className="col-lg-4">
              <img
                className="img-profile-card_new"
                alt=""
                src={
                  props.img_profile ||
                  "/assets/image/archiverse/default_img.png"
                }
                onError={(e) => {
                  e.target.src = "/assets/image/archiverse/default_img.png";
                  e.target.onError = null;
                }}
              />
            </div>
            <div className="col-lg-8 col-sm-12 mt-2 mb-4">
              <div className="w-fit">
                <div className="d-flex">
                  <p className={props.ClassTitle}>{props.title}</p>
                  <img
                    className="ci-green"
                    alt=""
                    width={20}
                    src="/assets/rsu-image/icons/verify-black.svg"
                  />
                </div>
                <p className="text-title-sub-menu">By. {props.profile}</p>
              </div>
            </div>

            <div className="col-12 col-sm-6 mb-2 layout-btn_card" align="left">
              <div className="d-flex gap-2">
                <img alt="" width={15} src="/assets/swaple/icon-omcoin.webp" />
                <p className="text-price-card_new" align="right">
                  {" "}
                  {props.price}{" "}
                </p>
              </div>
              <p className="text-price2-card_new" align="right">
                {" "}
                {props.stock}{" "}
              </p>
            </div>
            <div className="col-12 col-sm-6 mb-2 layout-btn_card">
              <Link href="/Explore-collection/detail-art">
                <button className="btn-sub_cardnew w-full h-36">VIEW</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CardCollection;
