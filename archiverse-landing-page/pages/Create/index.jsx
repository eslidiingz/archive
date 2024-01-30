import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Mainlayout from "/components/layouts/Mainlayout";
import React from "react";
import { Form } from "react-bootstrap";
import { Row, Container, Col } from "react-bootstrap";
import CardTrending from "/components/card/CardTrending";
import { WithContext as ReactTags } from "react-tag-input";

import { useWalletContext } from "/context/wallet";
import Swal from "sweetalert2";
import Config, { debug } from "/configs/config";
import Loading from "/components/Loading";
import { Button } from "react-bootstrap";
import { createMetadata, mintAsset, myCollection } from "/models/Asset";
import { useRouter } from "next/router";
import { constants } from "ethers";
import { createTransactions } from "../../models/Transaction";
import { gqlQuery } from "../../models/GraphQL";
import CardExplore from "../../components/cardExplore/CardExplore";
import Multiselect from "multiselect-react-dropdown";
import { replaceCharacterString } from "../../utils/misc";
const { loyaltyFee } = require("../../constants/loyalty.json");

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const imageMaxSize = 4; // MB

const Create = () => {
  const { wallet, walletAction } = useWalletContext();
  const router = useRouter();

  const inputNameRef = useRef();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [form, setForm] = useState({
    image: "",
    model_3d: "",
    // model_name: "",
    imagePreview: "",
    name: "",
    description: "",
    externalLink: "",
    tags: [],
    collectionOption: "newCollection",
    collectionName: "",
    amount: 1,
    loyaltyFee: 200,
  });

  const [fileChoosed, setFileChoosed] = useState({
    image: "",
    model_3d: "",
  });

  const [errors, setErrors] = useState({
    image: "",
    model_3d: "",
    name: "",
    description: "",
    collectionName: "",
    amount: "",
  });

  const [collectionExisting, setCollectionExisting] = useState([]);
  const loyaltyFeeExisting = loyaltyFee;
  const [assetTemp, setAssetTemp] = useState();

  const handleDelete = (i) => {
    setForm((prevForm) => ({
      ...prevForm,
      tags: form.tags.filter((tag, index) => index !== i),
    }));
  };

  const handleAddition = (tag) => {
    setForm((prevForm) => ({ ...prevForm, tags: [...form.tags, tag] }));
    console.log(tag);
  };

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    // console.log("🚀 ~ file: index.jsx:86 ~ handleFileChange ~ file", file)

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
      // console.log("🚀 ~ file: index.jsx:109 ~ handleFileChange ~ url", url)

      setForm((prevForm) => ({
        ...prevForm,
        [keyName]: file,
        ...(keyName === "image" && { imagePreview: url }),
      }));
    }
  };

  const handleInputChange = (e) => {
    // console.log("type -> ", e.target.type)
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

  const uploadFileModelToServer = async (_fileContent, name = "3dmodel") => {
    let fd = new FormData();
    let _path = `/models/${name}`;
    // fd.append("file", _fileContent);
    // fd.append("name", name);
    fd.append("bundle", _fileContent);
    fd.append("folder", "bundle");
    // let body = {
    //   fd: fd,
    //   // fileContent: _fileContent,
    // };
    let response = await fetch(Config.FILE3D_SERVER_URI, {
      method: "POST",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      body: fd
    });
    const result = await response.json();
    // console.log("🚀 ~ file: index.jsx:185 ~ uploadFileModelToServer ~ response:", response)
    return result;


    // let res = await fetch("/api/upload-3dmodel", {
    //   method: "POST",
    //   body: body,
    // });
    // console.log("🚀 ~ file: index.jsx:184 ~ uploadFileModelToServer ~ res:", res)
    // return await res.json();
  };

  const validated = () => {
    let status = true;

    Object.entries(errors).map((err) => {
      let key = err[0];
      let val = err[1];

      let msg;

      if (form[key].length < 1) {
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
    console.log("Create NFT");
    e.preventDefault();

    if (!validated()) {
      Swal.fire("Error", "Please check data field is required.", "error");
      return;
    }

    setIsPageLoading(true);
    let image = await uploadFileToServer(form.image);
    let model3DFile = await uploadFileModelToServer(form.model_3d, form.name);
    // return;

    // let image = { filename: "image.jpg" }; // Mock data

    /** Make a new metadata before store */
    let metadata = form;
    metadata.name = replaceCharacterString(form.name);
    metadata.description = replaceCharacterString(form.description);
    // console.log(metadata);
    // setIsPageLoading(false);
    // return;

    delete metadata.imagePreview;

    if (image) {
      metadata.image = `${Config.GET_FILE_URI}/${image.filename}`;
      metadata.model_3d = `${Config.GET_FILE_URI}/${model3DFile?.result ?? "none"}`;
      /** Store metadata to dabase */
      // const { status, data } = await createMetadata(metadata);

      // if (status) {

      try {
        /** Mint NFT */
        const minted = await mintAsset(metadata);
        if (debug) console.log("Minted : ", minted);

        const tokenIdIn = minted.map((obj) => {
          if (typeof obj.tokenId !== "undefined") return obj.tokenId;
        });

        const assetsQuery = (
          await gqlQuery(`
          assets(
            where: {
              nftAddress: {_eq: "${Config.ASSET_CA}"}, 
              tokenId: {_in: [${tokenIdIn}]}
            }, 
            order_by: {tokenId: asc}) {
            id
          }
        `)
        ).data;

        const assetIds = assetsQuery.map((a) => {
          if (typeof a.id !== "undefined") return a.id;
        });

        const insertTransaction = {
          txHash: minted.res.hash,
          txType: 3, // create order
          price: 0,
          collectionId: minted[0].collectionId,
          asset_ids: assetIds,
          from: constants.AddressZero,
          to: wallet,
        };

        const transaction = await createTransactions(insertTransaction);

        if (transaction && transaction.txHash) {
          router.push("/Profile#inventory");
        }
      } catch (err) {
        console.log(
          "🚀 ~ file: index.jsx ~ line 259 ~ handleCreateNft ~ err",
          err
        );
        setIsPageLoading(false);
      }

      // }
    }

    setIsPageLoading(false);
  };

  // const initialize = async () => {};

  // useEffect(() => {
  //   initialize();
  // }, []);

  useEffect(() => {
    if (wallet) getMyCollectionList();
    setIsPageLoading(false);
  }, [wallet]);

  const [option, setOption] = useState(["Picture", "Animation", "Music", "3D"]);

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
              <h4 className="fw-bold">Create file</h4>
            </Col>
            <Col lg={8}>
              <div className="create-box-layout text-start mb-4">
                <Form onSubmit={(e) => handleCreateNft(e)}>
                  <p className="fw-bold ci-black mb-2">Image File</p>
                  <Form.Group
                    controlId="formFile"
                    className="mb-3 custom-file-upload "
                  >
                    <Form.Label>
                      <span className="text-danger">*</span>
                      {errors.name && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-inline"
                        >
                          {errors.name}
                        </Form.Control.Feedback>
                      )}
                      <p>Choose file </p>
                      <i className="fas fa-plus"></i>
                    </Form.Label>
                    <Form.Control
                      className="create-detail-txt"
                      type="file"
                      name="image"
                      accept="image/*"
                      ref={inputNameRef}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>
                  {fileChoosed.image && (
                    <p className="fw-bold ci-black">
                      File selected:{" "}
                      <span className="text-secondary font-light">
                        /{fileChoosed.image}
                      </span>
                    </p>
                  )}
                  <p className="fw-bold ci-purplepink mb-3">
                    *Max file sizeis 20mb
                  </p>
                  <p className="fw-bold ci-black mb-2">3D Model File</p>
                  <Form.Group
                    controlId="formFileMultiple"
                    className="mb-3 custom-file-upload cursor-pointer"
                  >
                    <Form.Label>
                      <span className="text-danger">*</span>
                      {errors.name && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-inline"
                        >
                          {errors.name}
                        </Form.Control.Feedback>
                      )}
                      <p>Choose file </p>
                      <i className="fas fa-plus"></i>
                    </Form.Label>
                    <Form.Control
                      className="create-detail-txt"
                      type="file"
                      name="model_3d"
                      accept=".zip,.rar,.7zip"
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>
                  {fileChoosed.model_3d && (
                    <p className="fw-bold ci-black">
                      File selected:{" "}
                      <span className="text-secondary font-light">
                        /{fileChoosed.model_3d}
                      </span>
                    </p>
                  )}
                  <Form.Group className="mb-3" controlId="Name">
                    <Form.Label className="fw-bold ci-black">
                      Item Name <span className="text-danger">*</span>
                      {errors.name && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-inline"
                        >
                          {errors.name}
                        </Form.Control.Feedback>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="input-search-set "
                      placeholder="Name"
                      name="name"
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
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="externalLink">
                    <Form.Label className="fw-bold ci-black">
                      External link (URL)
                    </Form.Label>
                    <Form.Control
                      type="url"
                      className="input-search-set "
                      placeholder="https://google.com"
                      name="externalLink"
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="tags">
                    <Form.Label className="fw-bold ci-black">
                      Tags <span className="text-danger">*</span>
                    </Form.Label>
                    <Multiselect
                      className=""
                      isMulti={true}
                      isObject={false}
                      onRemove={(value) => handleDelete(value)}
                      onSelect={(value) => handleAddition(value)}
                      options={option}
                      placeholder="+ Add tags"
                    />
                  </Form.Group>
                  <div className="mb-3">
                    <div className="fw-bold ci-black mb-2">
                      Collection Name <span className="text-danger">*</span>
                      {errors.collectionName && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-inline"
                        >
                          {errors.collectionName}
                        </Form.Control.Feedback>
                      )}
                    </div>
                    {collectionExisting.length > 0 && (
                      <>
                        <div className="d-sm-flex d-block">
                          <Form.Check
                            inline
                            className="ci-black"
                            label="Add new"
                            name="collectionOption"
                            value="newCollection"
                            type="radio"
                            id={`inline-radio-1`}
                            checked={form.collectionOption == "newCollection"}
                            onChange={(e) => handleCollectionOptionChange(e)}
                          />

                          <Form.Check
                            inline
                            className="ci-black"
                            label="Collection Existing"
                            name="collectionOption"
                            value="collectionExisting"
                            type="radio"
                            id={`inline-radio-2`}
                            checked={
                              form.collectionOption == "collectionExisting"
                            }
                            onChange={(e) => handleCollectionOptionChange(e)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {form.collectionOption === "collectionExisting" ? (
                    <Form.Group className="mb-3" controlId="collectionSelect">
                      <Form.Select
                        aria-label="collectionSelect"
                        className="input-search-set "
                        onChange={(e) => {
                          setForm((prevForm) => ({
                            ...prevForm,
                            collectionName: e.target.value,
                          }));
                        }}
                      >
                        <option>- Select collection name -</option>
                        {collectionExisting.map((item) => {
                          return (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Form.Group className="mb-3" controlId="collectionName">
                      <Form.Control
                        type="text"
                        className="input-search-set "
                        name="collectionName"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3" controlId="amount">
                    <Form.Label className="fw-bold ci-black">
                      Amount <span className="text-danger">*</span>
                      {errors.amount && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-inline"
                        >
                          {errors.amount}
                        </Form.Control.Feedback>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      className="input-search-set "
                      placeholder="Enter amount of NFT"
                      name="amount"
                      min="1"
                      value={form.amount}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="loyaltyFeeSelect">
                    <Form.Label className="fw-bold ci-black">
                      Loyalty Fee
                    </Form.Label>
                    <Form.Select
                      aria-label="loyaltyFeeSelect"
                      className="input-search-set "
                      onChange={(e) => {
                        setForm((prevForm) => ({
                          ...prevForm,
                          loyaltyFee: e.target.value,
                        }));
                      }}
                    >
                      {/* <option>- Select collection name -</option> */}
                      {loyaltyFeeExisting.map((item) => {
                        return (
                          <option key={item.id} value={item.value}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                  <div className="text-center">
                    <Link href={"/Profile#inventory"}>
                      <Button variant="secondary" className="px-4 w-auto me-2">
                        Cancel
                      </Button>
                    </Link>

                    <Button
                      variant="primary"
                      type="submit"
                      className="px-5 me-2 mt-sm-0 mt-2"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
            <Col lg={4}>
                <CardExplore
                  img={form.imagePreview ?? "assets/swaple/img-01.png"}
                  title={
                    form.name && form.name.length > 0 ? form.name : "Item name"
                  }
                  detail={
                    form.description && form.description.length > 0
                      ? form.description
                      : "Description"
                  }
                />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
Create.layout = Mainlayout;
