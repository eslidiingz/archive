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
import { createCollection } from "/models/Collection";

const imageMaxSize = 4; // MB

const CreateCollections = () => {
  const router = useRouter();

  const { wallet, walletAction } = useWalletContext();

  const inputNameRef = useRef();

  const [isPageLoading, setIsPageLoading] = useState(true);

  const [form, setForm] = useState({
    image: "",
    imagePreview: "",
    name: "",
  });

  const [fileChoosed, setFileChoosed] = useState({
    image: "",
  });

  const [errors, setErrors] = useState({
    image: "",
    name: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validated()) {
      Swal.fire("Error", "Please check data field is required.", "error");
      return;
    }

    setIsPageLoading(true);

    let image = await uploadFileToServer(form.image);

    let obj = {
      name: form.name,
      coverUrl: `${Config.GET_FILE_URI}/${image.filename}`,
      creatorWallet: wallet,
    };
    let { status, data } = await createCollection(obj);
    if (status) {
      console.log(" === createCollection ", data);
      router.push("/Profile?tab=collection");
    }

    setIsPageLoading(false);
  };

  useEffect(() => {
    // if (wallet) getMyCollectionList();
    setIsPageLoading(false);
  }, [wallet]);

  return (
    <>
      {isPageLoading ? <Loading fullPage={true} /> : ""}

      <section className="">
        <div className="container pd-top-bottom-section">
          <div className="row d-flex align-items-center">
            <div className="col-xl-6 col-12">
              <h1 className="ci-white">Create</h1>
            </div>
            <div className="col-xl-6 col-12 text-end">
              <p className="text-navgation text-white">
                <Link href="/">
                  <a className="text-white text-navation_mr">Home</a>
                </Link>{" "}
                {">"}
                <Link href="/Explore-collection/item">
                  <a className="text-white text-navation_mr">Collections</a>
                </Link>{" "}
                {">"}
                <Link href="">
                  <a className="text-white text-navation_mr">Create</a>
                </Link>
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
                <h4 className=" text-white">Create Collection</h4>
              </Col>
              <Col lg={8}>
                <div className="create-box-layout text-white text-start mb-4">
                  <Form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                      <p>Image</p>
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
                    </div>

                    <Form.Group className="mb-3" controlId="Name">
                      <Form.Label>Collection Name</Form.Label>
                      <Form.Control
                        type="text"
                        className="input-search-set "
                        placeholder="Name"
                        name="name"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>

                    <button className="btn btn03 btn-hover color-1 w-100">
                      Submit
                    </button>
                  </Form>
                </div>
              </Col>
              <Col lg={4}>
                <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-4 ">
                  <CardTrending
                    ClassTitle="text-title-slidertren mb-0"
                    img={form.imagePreview}
                    title={form.name}
                  ></CardTrending>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};

export default CreateCollections;
CreateCollections.layout = Mainlayout;
