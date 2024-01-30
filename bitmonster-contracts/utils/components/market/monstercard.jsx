                   
const MarketMonsterCard = ({monster={}, wallet, handleClickCancel, handleClickBuyItem, handleClickApproveToken, isUserApprovedToken}) => {

    return (
        <div className="col-12 col-md-6  col-lg-6 set-col-xl-3-mar mb-2  px-1 ">
          <div className="w-100 d-flex align-items-center  bg-primary-V1 p-2">
            <div className="w-50">
              <img
                src={monster?.data?.card}
                alt=""
                className="width-box-img"
              />
            </div>
            <div className="w-50">
              <div>
                <buttom className="btn btn-Skew-yellow btn-Skew-yellow2 ">
                  {monster?.data?.class}
                </buttom>
                <div className="d-flex  align-items-center ">
                  <img
                    src={"/assets/img/H.png"}
                    alt=""
                    width={30}
                  />
                  <p className="text-orange mb-0 f-16">
                    #{monster?.data?.power}
                  </p>
                </div>
                <div className="d-flex  align-items-center ">
                  <img
                    src={"/assets/img/icon-1.png"}
                    alt=""
                    width={25}
                  />
                  <p className=" mb-0 text-blue f-16">65478</p>
                </div>
                {wallet == monster.ownerAddress ? (
                  <button
                    className="btn-Skew-red btn mt-2"
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
                      className="btn-purchase btn mt-2"
                      onClick={() =>
                        handleClickBuyItem(monster.marketId)
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


export default MarketMonsterCard;