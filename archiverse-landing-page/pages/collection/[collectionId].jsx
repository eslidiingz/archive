import Mainlayout from "/components/layouts/Mainlayout";
import CardTrending from "/components/card/CardTrending";
import Loading from "/components/Loading";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { Form } from "react-bootstrap";
import { Row, Container, Col } from "react-bootstrap";

import Config, { debug } from "/configs/config";
import { useWalletContext } from "/context/wallet";
import {
  getCollection,
  createCollection,
  updateCollection,
} from "/models/Collection";
import { useCallback } from "react";
import UtilitiesListSelect from "../../components/sell/utilitiy-list";
import { getPoliciesList } from "../../models/Covest";
import { getVouchers } from "../../models/Voucher";
import { objectForParams, replaceCharacterString } from "../../utils/misc";

const imageMaxSize = 4; // MB

const CreateCollections = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const { wallet, walletAction } = useWalletContext();

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [form, setForm] = useState({
    image: "",
    imagePreview: "",
    imageBackground: "",
    imageBackgroundPreview: "",
    name: "",
    description: "",
  });

  const [fileChoosed, setFileChoosed] = useState({
    image: "",
    imageBackground: "",
  });

  const [errors, setErrors] = useState({
    image: "",
    name: "",
  });

  const [profileOwner, setProfileOwner] = useState(null);
  const [poolList, setPoolList] = useState([]);
  const [utilities, setUtilities] = useState([]);

  const fetchFactoryPolicies = async () => {
    const factory = await getPoliciesList();

    const utilities = factory.map((_f) => {
      return {
        poolId: _f.poolId,
        poolName: _f.poolName,
        premiumAmount: _f.premiumAmount,
        currency: _f.currency,
        from: "covest",
      };
    });
    const { data } = await getVouchers();

    let voucher = [];
    if (data.length > 0) {
      voucher = data.map((_i) => {
        return {
          poolId: _i.no,
          poolName: _i.name,
          premiumAmount: _i.premiumAmount,
          currency: _i.currency,
          from: "voucher",
        };
      });
    }

    const poolArr = utilities.concat(voucher);

    const poolOption = poolArr.map((_i) => {
      return {
        label: `(${_i.premiumAmount} ${_i.currency}) ${_i.poolId} : ${_i.poolName}`,
        value: _i,
      };
    });

    setPoolList(poolOption);
  };

  const fetchProfileOwner = useCallback(async () => {
    if (!router.isReady) return;
    const ownerProfile = await fetch(`/api/users?wallet=${wallet}`);
    const owner = await ownerProfile.json();

    setProfileOwner(owner);
  }, [router]);

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
        ...(keyName === "imageBackground" && { imageBackgroundPreview: url }),
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

      console.log(key);

      if (form[key].length < 1 && key != "image") {
        msg = "This field is required.";
        status = false;
      } else {
        msg = "";
      }

      console.log(msg);

      setErrors((prevErr) => ({
        ...prevErr,
        [key]: msg,
      }));
    });

    return status;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validated()) {
      Swal.fire("Error", "Please check data field is required.", "error");
      return;
    }

    setIsPageLoading(true);

    let obj = {
      name: form.name,
      description: form.description,
      coverUrl: "",
      BackgroundUrl: "",
      creatorWallet: wallet,
    };

    if (form.image) {
      let image = await uploadFileToServer(form.image);
      obj.coverUrl = `, coverUrl: "${Config.GET_FILE_URI}/${image.filename}"`;
    }

    if (form.imageBackground) {
      let imageBackground = await uploadFileToServer(form.imageBackground);
      obj.BackgroundUrl = `, backgroundUrl: "${Config.GET_FILE_URI}/${imageBackground.filename}"`;
    }

    setIsPageLoading(true);

    if (collectionId == "create") {
      let obj = {
        name: replaceCharacterString(form.name),
        description: replaceCharacterString(form.description),
        coverUrl: "",
        backgroundUrl: "",
        creatorWallet: wallet,
        isArchiverse: true
      };

      if (form.image) {
        let image = await uploadFileToServer(form.image);
        obj.coverUrl = `${Config.GET_FILE_URI}/${image.filename}`;
      }

      if (form.imageBackground) {
        let imageBackground = await uploadFileToServer(form.imageBackground);
        obj.backgroundUrl = `${Config.GET_FILE_URI}/${imageBackground.filename}`;
      }

      if (Object.keys(utilities).length > 0) {
        obj.nftUtility = utilities?.value;
      }

      let resCollection = await createCollection(obj);
      // console.log(" create resCollection", resCollection)
      router.push("/Profile#collection");
    } else {
      let collection_where = `{id: {_eq: ${collectionId}}}`;
      let collection_set = `
				name: "${form.name}",
				description: "${form.description}"
			`;

      if (form.image) {
        let image = await uploadFileToServer(form.image);
        collection_set += `, coverUrl: "${Config.GET_FILE_URI}/${image.filename}"`;
      }

      if (form.imageBackground) {
        let imageBackground = await uploadFileToServer(form.imageBackground);
        collection_set += `, backgroundUrl: "${Config.GET_FILE_URI}/${imageBackground.filename}"`;
      }

      console.log(utilities);

      if (Object.keys(utilities).length > 0) {
        collection_set += `, nftUtility: ${objectForParams(utilities.value)}`;
      }

      let resCollection = await updateCollection(
        collection_set,
        collection_where
      );
      console.log(" update resCollection", resCollection);
      // router.push("/Profile#collection");
    }

    setIsPageLoading(false);
    Swal.fire("Success", "Update collection successfully", "success");
    setTimeout(() => {
      router.push("/Profile#collection");
    }, 1000);
  };

  const handleFetch = async () => {
    setIsPageLoading(true);

    let where = `{id: {_eq: ${collectionId}}}`;
    let { status, data } = await getCollection(where);
    if (status) {
      if (data[0].creatorWallet !== wallet) {
        window.location = "/Profile";
      }
      setForm((prevForm) => ({
        ...prevForm,
        imagePreview: data[0].coverUrl,
        imageBackgroundPreview: data[0].backgroundUrl,
        name: data[0].name,
        description: data[0].description,
      }));
    }

    setIsPageLoading(false);
  };

  useEffect(() => {
    if (collectionId != "create") handleFetch();
  }, [collectionId]);

  useEffect(() => {
    fetchProfileOwner();
  }, [fetchProfileOwner]);

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   fetchFactoryPolicies();
  // }, [router]);

  return (
    <>
      {isPageLoading ? <Loading fullPage={true} /> : ""}
      <div className="section_explorecollection"></div>
      <section>
        <Container>
          <Row>
            <Col xl={6}>
              <h1 className="fw-bold">Create</h1>
            </Col>
            <Col
              xl={6}
              className="d-flex align-items-center justify-content-end"
            >
              <Link href="/Profile">
                <p className="fw-bold cursor-pointer">Profile</p>
              </Link>
            </Col>
          </Row>
          <Row className="py-4">
            <Col lg={12}>
              <h4 className="fw-bold">Create Collection</h4>
            </Col>
            <Col lg={8}>
              <div className="create-box-layout text-start mb-4">
                <Form onSubmit={(e) => handleSubmit(e)}>
                  <div>
                    <p className="fw-bold ci-black mb-2">Image</p>
                    <Form.Group
                      controlId="formFile"
                      className="mb-3 custom-file-upload "
                    >
                      <Form.Label>
                        <p className="fw-bold ci-black mb-2">Choose file </p>
                        <i className="fas fa-plus"></i>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    {fileChoosed.image && (
                      <small className="fw-bold ci-black">
                        File selected:{" "}
                        <span className="text-secondary font-light">
                          /{fileChoosed.image}
                        </span>
                      </small>
                    )}
                    <p className="ci-green">*Max file sizeis 20mb</p>
                  </div>

                  <div>
                    <p className="fw-bold ci-black mb-2">Background Image</p>
                    <Form.Group
                      controlId="formFileCover"
                      className="mb-3 custom-file-upload "
                    >
                      <Form.Label>
                        <p className="fw-bold ci-black">Choose file </p>
                        <i className="fas fa-plus"></i>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="imageBackground"
                        accept="image/*"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    {fileChoosed.imageBackground && (
                      <small className="fw-bold ci-black">
                        File selected:{" "}
                        <span className="text-secondary font-light">
                          /{fileChoosed.imageBackground}
                        </span>
                      </small>
                    )}
                    <p className="fw-bold ci-purplepink mb-3">
                      *Max file sizeis 20mb
                    </p>
                  </div>

                  <Form.Group className="mb-3" controlId="Name">
                    <Form.Label className="fw-bold ci-black">
                      Collection Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="input-search-set "
                      placeholder="Name"
                      name="name"
                      value={form.name}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>

                  <Form.Group controlId="description" className="mb-3">
                    <Form.Label className="fw-bold ci-black">
                      Description <span className="text-danger">*</span>
                      {errors.description && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-inline"
                        >
                          {errors.description}
                        </Form.Control.Feedback>
                      )}
                    </Form.Label>
                    <Form.Control
                      className="input-search-set"
                      as="textarea"
                      rows={4}
                      name="description"
                      value={form.description}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>
                  <button className="btn btn-primary w-100">Submit</button>
                </Form>
              </div>
            </Col>
            <Col lg={4}>
              <CardTrending
                ClassTitle="text-title-slidertren mb-0"
                img={
                  form.imagePreview ||
                  "/assets/image/archiverse/default_img.png"
                }
                title={form.name}
                isHiddenView={true}
              />

              {/* <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-4 ">
          <CardTrending
            ClassTitle="text-title-slidertren mb-0"
            img={
              form.imageBackgroundPreview ||
              "/assets/image/archiverse/default_img.png"
            }
            title={`Background Image`}
            isHiddenVerify={true}
            isHiddenView={true}
          />
        </div> */}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CreateCollections;
CreateCollections.layout = Mainlayout;
