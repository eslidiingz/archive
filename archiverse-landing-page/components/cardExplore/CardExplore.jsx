import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { ButtonComponents } from "../stylecomponents/Button";

function CardExplore(props) {
  const [isActive, setActive] = useState(false);
  const toggleFav = () => {
    setActive(!isActive);
  };
  return (
    <>
      <div className="card-explore">
        <img
          className="w-100 img-fix-height"
          src={props?.img || "/assets/image/archiverse/default_img.png"}
          onError={(e) => {
            e.target.src = "/assets/image/archiverse/default_img.png";
            e.target.onError = null;
          }}
        />
        <div className="card-trending-detail">
          <h5 className="fw-bold mb-2">{props.title}</h5>
          <p className="twoline-dot2">{props.detail}</p>
          <div className="text-end">
            <Link href={`/assets/${props.nftAddress}/${props.tokenId}`}>
              <ButtonComponents color="light" size="size_140">
                <p>View</p>
              </ButtonComponents>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default CardExplore;
