import { useState } from "react";
import Link from "next/link";
import { shortWallet } from "../../utils/misc";
import { Button } from "react-bootstrap";
import { ButtonComponents } from "../stylecomponents/Button";
import { useRouter } from "next/router";

function CardTrending(props) {
  const [isActive, setActive] = useState(false);
  const router = useRouter();
  const toggleFav = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div className="card-trending">
        <img
          className="w-100 img-fix-height"
          src={props?.img || "/assets/image/archiverse/default_img.png"}
          onError={(e) => {
            e.target.src = "/assets/image/archiverse/default_img.png";
            e.target.onError = null;
          }}
        />
        <div className="card-trending-detail">
          <div className="d-flex justify-content-between ">
            <h3 className="ci-purplepink fw-bold twoline-dot me-2">{props.title}</h3>

            {!props.isHiddenVerify && (
              <>
                {props?.userData?.isVerified && (
                  <div className="d-flex align-items-center">
                    <img src="/assets/swaple/verified-user.svg" />
                    <small className=" ci-green mb-0 ms-1 fw-bold">
                      Verified
                    </small>
                  </div>
                )}
              </>
            )}
          </div>
          {props?.userData?.wallet && (
            <h6 className="fw-bold">{shortWallet(props?.userData?.wallet)}</h6>
          )}
          {typeof props.tokenId !== "undefined" && (
            <>
              <p className="text-title-sub-menu">Token Id : {props.tokenId}</p>
            </>
          )}
          <div
            className="col-6 col-sm-6 col-mb-6 mb-2 layout-btn_card"
            align="left"
          >
            <div className="d-flex gap-2">
              {props.price && (
                <>
                  <p className="text-price-card_new" align="right">
                    {" "}
                    {props.price}{" "}
                  </p>
                </>
              )}
            </div>
          </div>
          {!props.isHiddenView && (
            <div className="text-end">
              <Link href={props.link || "#"}>
                <ButtonComponents color="light" size="size_140" onClick={() => router.push(props.link ?? "/")}>
                  <p>View</p>
                </ButtonComponents>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default CardTrending;
