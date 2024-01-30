import Link from "next/link";
import { useState } from "react";
import { useCallback, useEffect } from "react";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { useWalletContext } from "/context/wallet";
import { getUsers } from "/models/User";
import { shortWallet } from "/utils/misc";
import image from "/public/blank-profile.png";

function Setprofile() {
  const { wallet } = useWalletContext();

  const [profileData, setProfileData] = useState({});

  const fetching = useCallback(async () => {
    const fetchingUser = async () => {
      const data = await getUsers(`{wallet: {_eq: "${wallet}"}}`);
      console.log("Profile Data : ", data.data);
      if (data.data.length == 1) setProfileData(data.data[0]);
    };
    if (wallet) {
      await fetchingUser();
    }
  }, []);

  useEffect(() => {
    fetching();
  }, []);

  return (
    <>
      {/* <Row className="my-4">
				<Col md={3} xs={6} className="my-2 my-lg-2">
				<div className="profile-box-content4"> 
					<div className="d-flex align-content-center justify-content-center">
					<img src="/assets/rsu-image/icons/icon-add1.svg"  className="me-2" alt="..." />
					<div className="">
						<h2 className="mb-0">24k</h2>
						<p className="mb-0">Collected</p>
					</div>
					</div>
				</div>
				</Col>
				<Col md={3} xs={6} className="my-2 my-lg-2">
				<div className="profile-box-content4"> 
					<div className="d-flex align-content-center justify-content-center">
					<img src="/assets/rsu-image/icons/icon-add2.svg"  className="me-2" alt="..." />
					<div className="">
						<h2 className="mb-0">82K</h2>
						<p className="mb-0">Auction</p>
					</div>
					</div>
				</div>
				</Col>
				<Col md={3} xs={6} className="my-2 my-lg-2">
				<div className="profile-box-content4"> 
					<div className="d-flex align-content-center justify-content-center">
					<img src="/assets/rsu-image/icons/icon-add3.svg"  className="me-2" alt="..." />
					<div className="">
						<h2 className="mb-0">200</h2>
						<p className="mb-0">Creators</p>
					</div>
					</div>
				</div>
				</Col>
				<Col md={3} xs={6} className="my-2 my-lg-2">
				<div className="profile-box-content4"> 
					<div className="d-flex align-content-center justify-content-center">
					<img src="/assets/rsu-image/icons/icon-add4.svg"  className="me-2" alt="..." />
					<div className="">
						<h2 className="mb-0">200</h2>
						<p className="mb-0">Creators</p>
					</div>
					</div>
				</div>
				</Col>
			</Row> */}
      <Row className="">
        <Col xxl={12} xl={7} lg={6} xs={12} className="mb-3 mb-lg-2">
          <div className="profile-box-content2 pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <Row className="layout_profile-btn w-100">
                <div className="col-xxl-7 col-xl-6 col-lg-12 ">
                  <div
                    className="m-3"
                    style={{
                      width: "100%",
                      borderRadius: "100%",
                      paddingTop: "100%",
                      position: "relative",
                      boxShadow: "0px 0px 0px 15px #222b40",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      className="img-fluid"
                      src={
                        profileData?.profileImage
                          ? profileData?.profileImage
                          : image
                      }
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                </div>
                <div className="text-start col-xxl-5 col-xl-5 col-lg-12 layout-padding-profile">
                  <h3>
                    {profileData?.name ? profileData?.name : "Undefined"}
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
                    className="pop-over btn d-flex mb-2 btn-token align-items-center"
                    tabIndex="0"
                    onMouseDown={() => {
                      navigator.clipboard.writeText(wallet);
                    }}
                  >
                    <div className="pop-text">Copied!</div>
                    {/* <img className="mx-2" src="/assets/rsu-image/icons/token.svg" alt="..." /> */}
                    {shortWallet(wallet)}
                    <img
                      className="mx-2"
                      src="/assets/rsu-image/icons/copy.svg"
                      alt="..."
                    />
                  </button>
                  {/* <div className="btn-group my-2" role="group" aria-label="Basic example ">
								<button type="button" className="btn btn-social-profile-right mx-1">
									<span><img className="mx-2" src="/assets/rsu-image/icons/twitter.svg" alt="..." /></span>dbai
								</button>
								<button type="button" className="btn btn-social-profile-left mx-1">
									<span><img className="mx-2" src="/assets/rsu-image/icons/camera.svg" alt="..." /></span>dbai
								</button>
							</div> */}
                  <p>{profileData?.bio ? profileData?.bio : ""}</p>
                  {/* <p>Joined December 2021</p> */}
                  {/* <Link href="/Profile/editprofile">
								<a className="ci-green fw-bold">Edit</a>
							</Link> */}
                  <Link href="/Profile/editprofile">
                    <a className="ci-green fw-bold d-flex">
                      <img
                        className="ci-green"
                        alt=""
                        width="20"
                        src="/assets/rsu-image/icons/pen-to-square-solid.svg"
                      />
                      <span className="text-purple">&nbsp;&nbsp;Edit</span>
                    </a>
                  </Link>
                </div>
              </Row>
            </div>
            {profileData?.isVerified && (
              <div className="text-start">
                <div className="my-4" />
                <h3 className="ci-green">
                  <span>
                    <img
                      className="mx-2"
                      src="/assets/rsu-image/icons/correct.svg"
                      alt="..."
                    />
                  </span>
                  Verified Account
                </h3>
              </div>
            )}
            {/* <div className="text-start">
						<div className="my-4"/>
						<h3 className="ci-green">
							<span><img className="mx-2" src="/assets/rsu-image/icons/factor.svg" alt="..." /></span>Two-factor authentication (2FA)
						</h3>
					</div> */}
          </div>
        </Col>
        {/* <Col xxl={4} xl={5} lg={6} xs={12} className="d-flex align-items-stretch mb-0 mb-lg-2">
				<div className="profile-box-content2 pt-3">
					<div className=" text-white">
					<h5>Connect Social</h5>
					</div>
					<div className="row">
					<Col sm={6} className="text-start d-flex align-items-center my-3 col-6">
					<img className="mx-2" src="/assets/rsu-image/icons/facebook.svg" alt="..." />
					<p className="mb-0">
						Facebook
					</p>
					</Col>
					<Col sm={6} className="text-end px-4 my-2 d-flex align-items-center justify-content-end col-6">
						<p  className="ci-green mb-0">Connected</p>
					</Col>
					<Col sm={6} className="text-start d-flex align-items-center my-3 col-6">
					<img className="mx-2" src="/assets/rsu-image/icons/Twitter-R.svg" alt="..." />
					<p className="mb-0">
						Twitter
					</p>
					</Col>
					<Col sm={6} className="text-end px-4 my-2 d-flex align-items-center justify-content-end col-6">
						<p  className="text-white mb-0">Connect</p>
					</Col>
					<Col sm={6} className="text-start d-flex align-items-center my-3 col-6">
					<img className="mx-2" src="/assets/rsu-image/icons/Instagram.svg" alt="..." />
					<p className="mb-0">
					Instagram
					</p>
					</Col>
					<Col sm={6} className="text-end px-4 my-2 d-flex align-items-center justify-content-end col-6">
						<p  className="text-white mb-0">Connect</p>
					</Col>
					<Col sm={6} className="text-start d-flex align-items-center my-3 col-6">
					<img className="mx-2" src="/assets/rsu-image/icons/discord2.svg" alt="..." />
					<p className="mb-0">
					Discord
					</p>
					</Col>
					<Col sm={6} className="text-end px-4 my-2 d-flex align-items-center justify-content-end col-6">
						<p  className="text-white mb-0">Connect</p>
					</Col>
					<Col sm={6} className="text-start d-flex align-items-center my-3 col-6">
					<img className="mx-2" src="/assets/rsu-image/icons/youtube.svg" alt="..." />
					<p className="mb-0">
					Youtube
					</p>
					</Col>
					<Col sm={6} className="text-end px-4 my-2 d-flex align-items-center justify-content-end col-6">
						<p  className="text-white mb-0">Connect</p>
					</Col>
					</div>
				</div>
				</Col> */}
      </Row>
      {/* <Row className="">
				<Col sm={12}>
				<h4 className=" text-white  my-4">Information</h4>
				</Col>
				<Col sm={12} className="mb-5">
				<div className="profile-box-content2 ">
					<Row>
					<Col sm={3} className="text-start my-2">
						<p className="cci-green mb-0">User ID</p>
						<p className=" text-white  mb-0">879334</p>
					</Col>
					<Col sm={3} className="text-start  my-2">
						<p className="cci-green  mb-0">Joined Since</p>
						<p className=" text-white  mb-0">20/09/2020</p>
					</Col>
					<Col sm={3} className="text-start  my-2">
						<p className="cci-green  mb-0">Country of Residence</p>
						<p className=" text-white  mb-0">Thailand</p>
					</Col>
					</Row>
					<Row>
					<Col sm={3} className="text-start  my-2">
						<p className="cci-green  mb-0">Email address</p>
						<p className=" text-white  mb-0">Email@gmail.com</p>
					</Col>
					<Col sm={3} className="text-start  my-2">
						<p className="cci-green  mb-0">Type</p>
						<p className=" text-white  mb-0">Personal</p>
					</Col>
					</Row>
				</div>
				</Col>

			</Row> */}
    </>
  );
}
export default Setprofile;
