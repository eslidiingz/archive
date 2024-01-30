import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

function CardHidden(props) {
  const [isActive, setActive] = useState(false);

  // const [metadata, setMetadata] = useState({});

  const toggleFav = () => {
    setActive(!isActive);
  };

  // const _metadata = useCallback(async () => {
  // 	const fetchingMetadata = async () => {
  // 		if(props.tokenId === undefined) return;
  // 		const response = await fetch(`/api/assets?tokenId=${props.tokenId}`);
  // 		const metadata = await response.json();
  // 		console.log(metadata);
  // 		setMetadata(metadata);
  // 	}
  // 	await fetchingMetadata();
  // }, [])

  useEffect(() => {
    // _metadata();
  }, []);

  if (Object.keys(props.data).length <= 0) return;

  return (
    <>
      <Link href={`/assets/${props?.data?.nftAddress}/${props?.data?.tokenId}`}>
        <div className="card_new">
          <div className="img-card_new">
            <img
              src={
                props.data.metadata.image ||
                "/assets/image/archiverse/default_img.png"
              }
              alt="Card image"
              onError={(e) => {
                e.target.src = "/assets/image/archiverse/default_img.png";
                e.target.onError = null;
              }}
            />
          </div>

          {/* <div className="d-flex gap-2 layout-main-icon_hearth" align="right">
						<i className={`fas fa-heart layout04 layout-icon_hearth ${isActive ? "icon-purple" : ""}`} onClick={toggleFav}></i>
					</div> */}

          <div className="card_new-body">
            <div className="row">
              {/* <div className="col-lg-4">
								<img
									className="img-profile-card_new"
									alt=""
									src={props.img_profile}
									onError={(e) => {
										e.target.src = "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg";
										e.target.onError = null;
									}}
								/>
							</div> */}
              <div className="col-sm-12 mt-2 mb-2 px-0">
                <div>
                  <div className="d-flex">
                    <div
                      className={props.ClassTitle}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {props.data.metadata.name}
                    </div>
                    &nbsp;
                    <img
                      className="ci-green"
                      alt=""
                      width={20}
                      src="/assets/rsu-image/icons/verify-black.svg"
                    />
                  </div>
                  {/* <p className="text-title-sub-menu">By. {props.profile}</p> */}
                </div>
                {/* <div>
									<div className="d-flex">
										<div
											className={`text-white-50`}
											style={{
												whiteSpace: "nowrap",
												overflow: "hidden"
											}}
										>
											{props.data.metadata.description}
										</div>
									</div>
								</div> */}
                <div>
                  <div className="d-flex">
                    <div
                      className={`text-white-50`}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {props.data.collection.name}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 mb-2 layout-btn_card"
                align="left"
              >
                {/* {(props.price || props.price != 0) && (
									<div className="d-flex gap-2">
										<img alt="" width={15} src="/assets/swaple/icon-omcoin.webp" />
										<p className="text-price-card_new" align="right"> {props.price} </p>
									</div>
								)}
								<p className="text-price2-card_new" align="right"> {props.stock} </p> */}
              </div>
              <div className="col-12 col-sm-6 mb-2 layout-btn_card">
                <Link href={props.link}>
                  <button className="btn-sub_cardnew w-full h-36">VIEW</button>
                </Link>
              </div>
              {/* <div className="col-12 col-sm-6 mb-2">
								<button className="btn-hover_cradnew color-1 w-full h-36">BUY</button>
							</div> */}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default CardHidden;
