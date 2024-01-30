import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Mainlayout from "/components/layouts/Mainlayout";
import React from "react";
import { Form } from "react-bootstrap";
import { Row, Container, Col } from "react-bootstrap";
// import CardTrending from "/components/card/CardTrending";
import { WithContext as ReactTags } from "react-tag-input";

import { useWalletContext } from "/context/wallet";
import Swal from "sweetalert2";
import Config, { debug } from "/configs/config";
import Loading from "/components/Loading";
import { createMetadata, mintAsset, myCollection } from "/models/Asset";
import { useRouter } from "next/router";
import CardTrending from "../../components/card/CardTrending";
import { getUsers, insertUser, updateUsers } from "../../models/User";
import { replaceCharacterString } from "../../utils/misc";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const imageMaxSize = 4; // MB

const Profile = () => {
  const { wallet, walletAction } = useWalletContext();
  const router = useRouter();

  const inputNameRef = useRef();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [form, setForm] = useState({
    image: "",
    imagePreview: "",
    name: "",
    bio: "",
    // externalLink: "",
    // tags: [],
    // collectionOption: "newCollection",
    // collectionName: "",
  });

  const [fileChoosed, setFileChoosed] = useState({
    image: "",
  });

  const [errors, setErrors] = useState({
    image: "",
    name: "",
    bio: "",
    // collectionName: "",
  });

  const [collectionExisting, setCollectionExisting] = useState([]);

  const handleDelete = (i) => {
    setForm((prevForm) => ({
      ...prevForm,
      tags: form.tags.filter((tag, index) => index !== i),
    }));
  };

  const handleAddition = (tag) => {
    setForm((prevForm) => ({ ...prevForm, tags: [...form.tags, tag] }));
  };

  const handleFileChange = (e) => {
    let file = e.target.files[0];

    let keyName = e.target.name;

    if (file) {
      let fileSize = file.size / 1024 / 1024; // Convert to MB
      fileSize = Math.round(fileSize * 100) / 100; // Convert to 2 decimal

      if (
        keyName === "image" &&
        parseFloat(fileSize) > parseFloat(imageMaxSize)
      ) {
        setErrors((prevErr) => ({
          ...prevErr,
          [keyName]: `Image file size is more than ${imageMaxSize} MB`,
        }));
      }

      setFileChoosed((prevChoose) => ({
        ...prevChoose,
        [keyName]: file.name,
      }));

      let url = URL.createObjectURL(file);

      setForm((prevForm) => ({
        ...prevForm,
        [keyName]: file,
        ...(keyName === "image" && { imagePreview: url }),
      }));
    }
  };

  const handleInputChange = (e) => {
    switch (e.target.type) {
      case "file":
        handleFileChange(e);
        break;

      default:
        setForm((prevForm) => ({
          ...prevForm,
          [e.target.name]: e.target.value,
        }));
        break;
    }
  };

  const handleCollectionOptionChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      collectionOption: e.target.value,
      collectionName: "",
    }));
  };

  const getMyCollectionList = async () => {
    inputNameRef.current.focus();

    let collectionList = await myCollection(wallet);

    console.log("collectionList", collectionList);

    setCollectionExisting(collectionList.data);
  };

  const uploadFileToServer = async (_fileContent) => {
    let fd = new FormData();

    fd.append("file", _fileContent);

    let res = await fetch(Config.FILE_SERVER_URI, {
      method: "POST",
      body: fd,
    });

    return await res.json();
  };

  const validated = () => {
    let status = true;

    Object.entries(errors).map((err) => {
      let key = err[0];
      let val = err[1];

      let msg;
      console.log(form, key);
      if (form[key].length < 1) {
        console.log();
        msg = "This field is required.";
        status = false;
      } else {
        msg = "";
      }

      setErrors((prevErr) => ({
        ...prevErr,
        [key]: msg,
      }));
    });

    return status;
  };

  const handleCreateNft = async (e) => {
    if (!wallet) return;
    e.preventDefault();

    if (!validated()) {
      Swal.fire("Error", "Please check data field is required.", "error");
      return;
    }

    setIsPageLoading(true);
    let image = await uploadFileToServer(form.image);
    if (image) {
      let imagePath = `${Config.GET_FILE_URI}/${image.filename}`;

      // let userId = 2;
      console.log("UserID : ", userId);
      if (userId !== null && userId >= 0) {
        // update user
        // console.log(replaceCharacterString(form.bio));
        // return;
        let _set = `_set: {
          bio: "${replaceCharacterString(form.bio)}",
          name: "${replaceCharacterString(form.name)}",
          profileImage: "${imagePath}"
        }`;

        console.log(_set);

        // return;
        const res = await updateUsers(userId, _set);
        console.log(res);
        if (res.status) {
          Swal.fire("Success", "Update user success", "success");
          setTimeout(() => {
            router.push("/Profile");
          }, []);
        }
      } else {
        // insert new user
        let _object = `{
          bio: "${form.bio}",
          isActive: true,
          isBanned: false,
          isVerified: false,
          name: "${form.name}",
          profileImage: "${imagePath}",
          wallet: "${wallet}"
        }`;
        let res = await insertUser(_object);
        console.log(res);
        if (res.status) {
          setTimeout(() => {
            Swal.fire("Success", "Update user success", "success");
            router.push("/Profile");
          }, 1000);
        }
      }
    } else {
      Swal.fire("Error", "Not found image", "error");
    }
    /** Upload file to file server */

    // let image = { filename: "image.jpg" }; // Mock data

    /** Make a new metadata before store */
    // let metadata = form;

    // delete metadata.imagePreview;

    setIsPageLoading(false);
  };

  // const initialize = async () => {};

  // useEffect(() => {
  //   initialize();
  // }, []);
  const [userId, setUserId] = useState(null);
  const fetchingUser = async () => {
    if (!wallet) return;
    let userData = await getUsers(`{wallet: {_eq: "${wallet}"}}`);
    // console.log("UserData : ", userData.data);
    if (userData.data.length == 1) {
      let _userId = userData.data[0].id;
      console.log(_userId);
      setUserId(_userId);
    }
  };
  useEffect(() => {
    // if (wallet) getMyCollectionList();
    fetchingUser();
    setIsPageLoading(false);
  }, [wallet]);

  return (
    <>
      {isPageLoading ? <Loading fullPage={true} /> : ""}

      <section className="">
        <div className="container pd-top-bottom-section">
          <div className="row d-flex align-items-center">
            <div className="col-xl-6 col-12">
              <h1 className="ci-white">Edit</h1>
            </div>
            <div className="col-xl-6 col-12 text-end">
              <p className="text-navgation text-white">
                <Link href="/Profile">
                  <a className="text-white text-navation_mr">Profile</a>
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="">
        <div>
          <Container>
            <Row className="py-4">
              <Col lg={12}>
                <h4 className=" text-white">Edit Profile</h4>
              </Col>
              <Col lg={8}>
                <div className="create-box-layout text-white text-start mb-4">
                  <Form onSubmit={(e) => handleCreateNft(e)}>
                    <p>Profile Image</p>
                    <Form.Group
                      controlId="formFile"
                      className="mb-3 custom-file-upload "
                    >
                      <Form.Label>
                        <p>Choose file </p>
                        <i className="fas fa-plus"></i>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        ref={inputNameRef}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    {fileChoosed.image && (
                      <small>
                        File selected:{" "}
                        <span className="text-secondary font-light">
                          /{fileChoosed.image}
                        </span>
                      </small>
                    )}
                    <p className="ci-green">*Max file sizeis 20mb</p>
                    <Form.Group className="mb-3" controlId="Name">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        className="input-search-set "
                        placeholder="Name"
                        name="name"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    <Form.Group controlId="description" className="mb-3">
                      <Form.Label>
                        Bio <span className="text-danger">*</span>
                        {errors.bio && (
                          <Form.Control.Feedback
                            type="invalid"
                            className="d-inline"
                          >
                            {errors.bio}
                          </Form.Control.Feedback>
                        )}
                      </Form.Label>
                      <Form.Control
                        className="input-search-set"
                        as="textarea"
                        rows={4}
                        name="bio"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    <div className="mx-auto text-center">
                      <button className="btn btn-primary">Submit</button>
                    </div>
                  </Form>
                </div>
              </Col>
              <Col lg={4}>
                <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-4 ">
                  <CardTrending
                    ClassTitle="text-title-slidertren mb-0"
                    // img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                    img={form.imagePreview}
                    title={form.name}
                    description={form.bio}
                    isHiddenView={true}
                    isHiddenVerify={true}
                    // collectionName={form.collectionName}
                    // tags={form.tags}
                    // profile="sala"
                    // price="153"
                    // link="/Explore-collection/detail-music"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};

export default Profile;
Profile.layout = Mainlayout;
