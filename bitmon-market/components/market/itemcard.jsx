import Config from "../../configs/config"


const MarketItemCard = ({ items = {}, wallet, handleClickCancel, handleClickBuyItem, handleClickApproveToken, isUserApprovedToken, itemTypesArr }) => {


  const buttonClass = {
    immortal: "btn-Skew-yellow",
    legendary: "btn-Skew-red",
    epic: "btn-Skew-pink",
    rare: "btn-Skew-blue",
    common: "btn-Skew-green",
  };
console.log(items)
  return (
    <>
      <div className="col-12 col-sm-6 col-xxl-4 mb-2 px-1 ">
        <div className="card-monster">
          <div className="col-left">
            <img
              src={`${Config.INVENTORY_IMG_URL}/items/${items?.data?.no}.png`}
              alt=""
              className="card-monster-img"
            />
            {console.log(itemTypesArr[0].title,"ITEMMMMM DAAAYARAA")}
          </div>
          <div className="col-right">
            <div className="card-monster-header">
              <buttom className={`btn-item-type ${buttonClass[items?.data?.class?.toLowerCase?.()]}`}>
              {items?.data?.class}
              </buttom>
              <p className="card-item-status-text mt-2">
                {items?.data?.name}
              </p>
              <p className="card-item-status-text">
                EA: {items?.amount}
              </p>
              <p className="card-item-status-text">
                TYPE: { itemTypesArr.find((itemType) => itemType.id === items?.data?.attributes?.type)?.title || '' }
              </p>
            </div>
            <div className="card-monster-footer">
              <div className="card-monster-price">
                <div className="card-monster-price-title">PRICE</div>
                <div className="card-monster-price-value">${items?.itemPrice}</div>
              </div>
              {wallet == items.ownerAddress ? (
                <button
                  className="btn-monster-cancel"
                  onClick={() =>
                    handleClickCancel(items.marketId)
                  }
                >
                  Cancel
                </button>
              ) : (
                wallet !== items.ownerAddress &&
                (isUserApprovedToken ? (
                  <button
                    className="btn-monster-purchase"
                    onClick={() =>
                      handleClickBuyItem(items.marketId, items.amount)
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
      </div>
    </>
  );
};

export default MarketItemCard;