import Config from "../../configs/config";

const MarketLandCard = ({ lands = {}, wallet, handleClickCancel, handleClickBuyItem, handleClickApproveToken, isUserApprovedToken }) => {

  const buttonClass = {
    immortal: "btn-Skew-yellow-box",
    legendary: "btn-Skew-red-box",
    epic: "btn-Skew-pink-box",
    rare: "btn-Skew-blue-box",
    common: "btn-Skew-green-box",
  };

  return (
    <>
      <div className="col-12 col-sm-6 col-xxl-4 mb-2 px-1 ">
        <div className="card-monster">
          <div className="col-left">
            <img
              src={`${Config.INVENTORY_IMG_URL}/lands/${lands?.data?.category}.png`}
              alt=""
              className="card-monster-img"
            />
          </div>
          <div className="col-right">
            <div className="card-monster-header">
              <buttom className={`btn-item-type ${buttonClass[lands?.data?.class?.toLowerCase?.()]}`}>
              {lands?.data?.class}
              </buttom>
              <p className="card-item-status-text mt-2">
                ZONE {lands?.data?.zone}
              </p>
              <p className="card-item-status-text">
                {lands?.data?.name}
              </p>
            </div>
            <div className="card-monster-footer">
              <div className="card-monster-price">
                <div className="card-monster-price-title">PRICE</div>
                <div className="card-monster-price-value">${lands?.itemPrice}</div>
              </div>
              {wallet == lands.ownerAddress ? (
                <button
                  className="btn-monster-cancel"
                  onClick={() =>
                    handleClickCancel(lands.marketId)
                  }
                >
                  Cancel
                </button>
              ) : (
                wallet !== lands.ownerAddress &&
                (isUserApprovedToken ? (
                  <button
                    className="btn-monster-purchase"
                    onClick={() =>
                      handleClickBuyItem(lands.marketId)
                    }
                  >BUY</button>
                ) : (
                  <button
                    className="btn-Skew-blue-box  mt-2"
                    onClick={() => handleClickApproveToken()}
                  >
                    Approve
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default MarketLandCard;