import Link from "next/link";
import { useState } from "react";
import { useCallback, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { myNftList } from "../../models/Asset";
import { getCollection } from "../../models/Collection";
import { useWalletContext } from "/context/wallet";
import { getUsers } from "/models/User";
import { shortWallet } from "/utils/misc";

function Setprofile() {
  const { wallet } = useWalletContext();

  const [profileData, setProfileData] = useState({});
  const [assets, setAssets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isCopy, setIsCopy] = useState(false);
  const fetching = useCallback(async () => {
    const fetchingUser = async () => {
      const data = await getUsers(`{wallet: {_eq: "${wallet}"}}`);
      if (data.data.length == 1) setProfileData(data.data[0]);
    };
    const fetchingAssets = async () => {
      let where = `{
        _and: {
          owner: {_eq: "${wallet}"}
        }
      }`;
      let _asset = await myNftList(where);
      setAssets(_asset);
    };
    const fetchingCollection = async () => {
      const where = `{creatorWallet: {_eq: "${wallet}"}}`;
      const _collection = await getCollection(where);

      if (!_collection.status) return;
      setCollections(_collection.data);
    };
    if (wallet) {
      await fetchingUser();
      await fetchingAssets();
      await fetchingCollection();
    }
  }, []);

  useEffect(() => {
    fetching();
  }, []);

  return (
    <>
      <Row className="my-4">
        <Col md={6} xs={6} className="my-2 my-lg-2">
          <div className="profile-box-content4">
            <div className="d-flex align-content-center  justify-content-between px-2">
              <div className="">
                <h2 className="mb-0">{assets.length || 0}</h2>
                <p className="mb-0">NFTs</p>
              </div>
              <img
                src="/assets/rsu-image/icons/icon-add1.svg"
                className="me-2"
              />
            </div>
          </div>
        </Col>
        <Col md={6} xs={6} className="my-2 my-lg-2">
          <div className="profile-box-content4">
            <div className="d-flex align-content-center justify-content-between  px-2">
              <div className="">
                <h2 className="mb-0">{collections.length || 0}</h2>
                <p className="mb-0">Collections</p>
              </div>
              <img
                src="/assets/rsu-image/icons/icon-add2.svg"
                className="me-2"
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="">
        <Col xxl={12} xl={12} lg={12} sm={12} xs={12} className="mb-3 mb-lg-2">
          <div className="profile-box-content2 pt-3">
            <div className="d-flex justify-content-center">
              <div className="">
                <div>
                  <img
                    src={
                      profileData?.profileImage ||
                      "/assets/image/archiverse/default_img.png"
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src =
                        "/assets/image/archiverse/default_img.png";
                    }}
                    style={{
                      borderRadius: "50%",
                      border: "solid 3px #C780B6",
                      height: "100px",
                      width: "100px",
                    }}
                  />
                </div>
                <h3>
                  {profileData?.name || "Unknow User"}
                  <span>
                    {profileData?.isVerified && (
                      <img
                        className="mx-2"
                        src="/assets/rsu-image/icons/verify.svg"
                        alt="..."
                      />
                    )}
                  </span>
                </h3>
                <button
                  className="pop-over btn mb-2 btn-token align-items-center w-auto"
                  tabIndex="0"
                  onMouseDown={() => {
                    setIsCopy(true);
                    navigator.clipboard.writeText(wallet);
                    setTimeout(() => {
                      setIsCopy(false);
                    }, 2000);
                  }}
                >
                  {isCopy && <div className="pop-text">Copied!</div>}
                  {shortWallet(wallet)}
                  <img
                    className="mx-2"
                    src="/assets/rsu-image/icons/copy.svg"
                    alt="..."
                  />
                </button>

                <p>{profileData?.bio ? profileData?.bio : ""}</p>
                <Link href="/Profile/editprofile">
                  <a className="ci-green fw-bold">
                    {/* <img
                      className="ci-green"
                      alt=""
                      width="20"
                      src="/assets/rsu-image/icons/pen-to-square-solid.svg"
                    /> */}
                    <span className="ci-green">Edit</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
export default Setprofile;
