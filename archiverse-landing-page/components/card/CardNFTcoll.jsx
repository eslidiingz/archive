import { useState } from "react";
import Link from "next/link";

function CardNFTcoll(props) {
  console.log(
    "🚀 ~ file: CardNFTcoll.jsx ~ line 5 ~ CardNFTcoll ~ props",
    props
  );
  const [isActive, setActive] = useState(false);
  const toggleFav = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div className="card-collection-layout">
        <Link href={`/Explore-collection/${props?.collectionId}`}>
          <div>
            <img
              className="w-100 card-collection-img"
              src={props?.img || "/assets/image/archiverse/default_img.png"}
              onError={(e) => {
                e.target.src = "/assets/image/archiverse/default_img.png";
                e.target.onError = null;
              }}
            />
            <div className="card-collection-detail">
              <div className="d-flex justify-content-between align-items-center">
                <img
                  className="user-NFT-Coll"
                  src={
                    props?.imguser || "/assets/image/archiverse/default_img.png"
                  }
                  onError={(e) => {
                    e.target.src = "/assets/image/archiverse/default_img.png";
                    e.target.onError = null;
                  }}
                  alt="Card image"
                />
                <h5 className="fw-bold fixed-text twoline-dot" align="right">
                  {props.detail}
                </h5>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
export default CardNFTcoll;
