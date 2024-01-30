                   
const MarketLandCard = ({lands={}, wallet, handleClickCancel, handleClickBuyItem, handleClickApproveToken, isUserApprovedToken} ) => {
    
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
                src={lands?.data?.image}
                alt=""
                className="width-box-img"
              />
            </div>
            <div className="w-50">
              <div>
                <buttom className={`btn ${buttonClass[lands?.data?.class?.toLowerCase?.()]}`}>
                  {lands?.data?.class}
                </buttom>
                    <div className="d-flex align-items-center ">
                  <p className="text-white mb-0 f-16">
                    ZONE{lands?.data?.zone}
                  </p>
                </div>
                <div className="mb-0.text-center.text-uppercase  align-items-center ">
                  <p className="text-whie mb-0 f-16">
                    {lands?.data?.name}
                  </p>
                </div>
                <div className="d-flex align-items-center ">
                </div>
                {wallet == lands.ownerAddress ? (
                  <button
                    className="btn-Skew-red btn mt-2"
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
                      className="btn-purchase btn mt-2"
                      onClick={() =>
                        handleClickBuyItem(lands.marketId)
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

export default MarketLandCard;