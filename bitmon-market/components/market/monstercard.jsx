import DetailCard from "../../components/Modal/DetailCard";
import { useEffect, useState } from "react";
import Config from "../../configs/config"


const MarketMonsterCard = ({ monster = {}, wallet, handleClickCancel, handleClickBuyItem, handleClickApproveToken, isUserApprovedToken }) => {
  const [showDetailCard, setShowDetailCard] = useState(false);

  const MONTER_ELEMENTS = {
    fire: '/assets/img/elements/F.webp',
    water: '/assets/img/elements/W-2.webp',
    electric: '/assets/img/elements/E.webp',
    dark: '/assets/img/elements/D.webp',
    holy: '/assets/img/elements/H.webp',
    bug: '/assets/img/elements/B.webp',
    earth: '/assets/img/elements/E-2.webp',
    wind: '/assets/img/elements/W.webp',
    ice: '/assets/img/elements/I.webp',
    steel: '/assets/img/elements/S.webp'
  };

  const handleCloseDetailCard = () => {
    setShowDetailCard(false);
  };

  console.log(monster, 'MON')

  return (
    <>
      <div className="col-12 col-sm-6 col-xxl-4 mb-2 px-1 ">
        <div className="card-monster">
          <div className="col-left">
            <img
              src={`${Config.INVENTORY_IMG_URL}/card/MUI${monster?.data?.no?.slice?.(3)}.jpg`}
              alt=""
              className="card-monster-img"
              onClick={() => setShowDetailCard(true)}
            />
          </div>
          <div className="col-right">
            <div className="card-monster-header">
              <div className="btn-monster-type">
                {monster?.data?.class}
              </div>
              <div className="card-monster-status">
                <img
                  className="card-monster-status-icon"
                  src={MONTER_ELEMENTS[monster?.data?.type?.toLowerCase?.()]}
                  alt=""
                />
                <p className="card-monster-status-text">
                  #{monster?.data?.power}
                </p>
              </div>
            </div>
            <div className="card-monster-footer">
              <div className="card-monster-price">
                <div className="card-monster-price-title">PRICE</div>
                <div className="card-monster-price-value">${monster?.itemPrice}</div>
              </div>
              {wallet == monster.ownerAddress ? (
                <button
                  className="btn-monster-cancel"
                  onClick={() =>
                    handleClickCancel(monster.marketId)
                  }
                >
                  Cancel
                </button>
              ) : (
                wallet !== monster.ownerAddress &&
                (isUserApprovedToken ? (
                  <button
                    className="btn-monster-purchase"
                    onClick={() =>
                      handleClickBuyItem(monster.marketId)
                    }
                  >BUY</button>
                ) : (
                  <button
                    className="btn-monster-approve"
                    onClick={() => handleClickApproveToken()}
                  >
                    Approve
                  </button>
                ))
              )}
            </div>

          </div>
        </div>
        <DetailCard onClose={handleCloseDetailCard} show={showDetailCard} monsterId={monster?.data} />
      </div>

    </>


  )
}


export default MarketMonsterCard;