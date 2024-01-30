import { useState } from "react";
import Link from "next/link";

function CardBuyNft(props) {
  const [isActive, setActive] = useState(false);
  const toggleFav = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div className="text-white card-buy-h">
        <a className="w-full">
          <div className="position-relative example">
            <img
              className="card-img-top img-cardBuy"
              src={props.img || "/assets/image/archiverse/default_img.png"}
              alt="Card image"
              onError={(e) => {
                e.target.src = "/assets/image/archiverse/default_img.png";
                e.target.onError = null;
              }}
            />
            <div className="content">
              <div className="title">{props.title_hover}</div>
              <div className="nameprofile">{props.nameprofile_hover}</div>
              <div className="btn-buy">BUY</div>
            </div>
          </div>
        </a>
        <div className="w-full p-3 card-buy">
          <button className="btn-none">
            <div className="d-flex gap-1 align-items-center fav">
              <i
                className={`fas fa-heart icon-heart ${
                  isActive ? "icon-purple" : "icon-white"
                }`}
                onClick={toggleFav}
              ></i>
              <p
                className={`text-iconheart ${
                  isActive ? "icon-purple" : "ci-white"
                }`}
                onClick={toggleFav}
              >
                {props.fav}
              </p>
            </div>
          </button>
          <p className="text05" align="right">
            Price
          </p>
          <p className="text13" align="right">
            {props.time}
          </p>
          <div className="d-flex gap-2 align-items-center justify-content-end pt-1">
            <img alt="" width={13} src="/assets/swaple/icon-omcoin.webp" />
            <p className="text15" align="right">
              $ {props.coin}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default CardBuyNft;
