                   
const MarketItemCard = ({items={}, wallet, handleClickCancel, handleClickBuyItem, handleClickApproveToken, isUserApprovedToken}) => {


  const buttonClass = {
    immortal: "btn-Skew-yellow",
    legendary: "btn-Skew-red",
    epic: "btn-Skew-pink",
    rare: "btn-Skew-blue",
    common: "btn-Skew-green",
};

    return (
        <div className="col-12 col-md-6  col-lg-6 set-col-xl-3-mar mb-2  px-1 ">
          <div className="w-100 d-flex align-items-center  bg-primary-V1 p-2">
            <div className="w-50">
              <img
                
                src={items?.data?.image}
                alt=""
                className="width-box-img"
              />
            </div>
            <div className="w-50">
              <div>
                <buttom className={`btn ${buttonClass[items?.data?.class?.toLowerCase?.()]}`}>
                  {items?.data?.class}
                </buttom>
                <div className="d-flex  align-items-center ">
                  <p className="text-orange mb-0 f-16">
                    #{items?.data?.name}
                  </p>
                </div>
                {/* <div className="d-flex  align-items-center ">
                  <p className="text-orange mb-0 f-16">
                    #{items?.data?.description}
                  </p>
                </div> */}
              
                {wallet == items.ownerAddress ? (
                  <button
                    className="btn-Skew-red btn mt-2"
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
                      className="btn-purchase btn mt-2"
                      onClick={() =>
                        handleClickBuyItem(items.marketId)
                      }
                    ></button>
                  ) : (
                    <button
                      className="btn-primary:hover btn mt-2"
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
    )
}

export default MarketItemCard;