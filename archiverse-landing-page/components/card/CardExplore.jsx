import Link from "next/link";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { getAssets } from "../../models/Asset";
import { getCollection } from "../../models/Collection";
const CardExplore = (props) => {
  // console.log("Props : ", props)

  const [collectionData, setCollectionData] = useState({});

  const fetching = useCallback(async () => {
    const fetchingData = async () => {
      let data = await getAssets(`{collectionId: {_eq: ${props.data.id}}}`);
      // let data = await getCollection(`{id: {_eq: ${props.data.id}}}`);
      console.log("Asset list with collectionId : ", data.data);
      setCollectionData(data.data);
    };
    await fetchingData();
  }, []);

  useEffect(() => {
    // fetching()
  }, []);

  return (
    <>
      <div className="card-trending cursor-pointer">
        {/* <Link href={`/collection/${props.data.id}`}>
          <div className="p-2 cursor-pointer">
            <img
              className="ci-green"
              alt=""
              width="20"
              src="/assets/rsu-image/icons/pen-to-square-solid.svg"
            />
          </div>
        </Link> */}
        <Link href={`/Explore-collection/${props.data.id}`}>
          <div>
            <img
              className="w-100 img-fix-height"
              src={props.cover || "/assets/image/archiverse/default_img.png"}
              onError={(e) => {
                e.target.src = "/assets/image/archiverse/default_img.png";
                e.target.onError = null;
              }}
            />
            <div className="card-trending-detail">
              <div className="p-3">
                <div className="d-flex align-items-center">
                  <div className="">
                    <img
                      style={{
                        width: "75px",
                        height: "75px",
                        borderRadius: "10%",
                      }}
                      src={
                        props.image ||
                        "/assets/image/archiverse/default_img.png"
                      }
                      onError={(e) => {
                        e.target.src =
                          "/assets/image/archiverse/default_img.png";
                        e.target.onError = null;
                      }}
                    />
                  </div>
                  <h6 className="fw-bold ms-3 mb-0">{props.name}</h6>
                </div>
                <div className="d-flex">
                  <div className="d-flex align-items-end p-2"></div>
                </div>
              </div>
              <div>
                <p className="twoline-dot3">
                  {props.des}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
export default CardExplore;
