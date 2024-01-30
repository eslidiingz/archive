import {useEffect, useState} from "react"
import Mainlayout from "../components/layouts/Mainlayout"
import {Form} from "react-bootstrap"
import {fetchWhitelistUser} from "../utils/api/whitelist-api"
import {createAssetList} from "../utils/api/asset-api"
import {
  putAssetCollection,
  fetchCollectionList,
} from "../utils/api/collection-api"
import {getAccount} from "../utils/connector/provider"
import {toastSuccess, toastDanger} from "../components/toast/toast"
import Waitmodal from "../components/modal/waitmodal"
import {safeMint, getLatestTokenId} from "../utils/contracts/BWNFT"
import Config from "../utils/config"
import {fetchUserData} from "../utils/api/user-api"
import Link from "next/link"
import Swal from "sweetalert2"
import {isCreatorCheck} from "models/creator"
import {useWalletContext} from "context/wallet"
import {useRouter} from "next/router"

const imageMaxSize = 2 // MB

const Createnft = () => {
  const {wallet} = useWalletContext()
  const router = useRouter()

  const [id, setId] = useState("")
  const [role, setRole] = useState("")
  const [account, setAccount] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [collection, setCollection] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [collectionList, setCollectionlist] = useState([])
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [isMinter, setIsMinter] = useState(false)
  const [showWaitModal, setShowWaitModal] = useState(false)

  const [errors, setErrors] = useState({
    image: "",
  })

  const fetchUser = async () => {
    try {
      const _account = await getAccount()
      if (typeof _account !== "undefined") {
        const _data = await fetchWhitelistUser(_account)
        setAccount(_account)
        setRole(_data.rows[0].roles)
        setId(_data.rows[0]._id)

        if (_data.rows.length !== 0 && _data.rows[0].roles !== "minter") {
          setIsCreator(true)
        }
        if (_data.rows.length !== 0 && _data.rows[0].roles === "minter") {
          setIsMinter(true)
        }
        const user = await fetchUserData(_account)
        if (user.rows.length !== 0) {
          setIsUser(true)
        }
      }
    } catch (error) {}
  }

  const fetchCollection = async () => {
    try {
      const _collectionList = await fetchCollectionList(account)
      const list = _collectionList.rows.map((item) => {
        return {id: item._id, title: item.title}
      })
      setCollectionlist(list)
    } catch (error) {}
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined)
      return
    }

    setErrors((prevErr) => ({
      ...prevErr,
      image: ``,
    }))

    let file = e.target.files[0]

    if (file) {
      let fileSize = file.size / 1024 / 1024 // Convert to MB
      fileSize = Math.round(fileSize * 100) / 100 // Convert to 2 decimal
    }

    if (parseFloat(fileSize) > parseFloat(imageMaxSize)) {
      setErrors((prevErr) => ({
        ...prevErr,
        image: `Image file size is more than ${imageMaxSize} MB`,
      }))
    }

    setImage(e.target.files[0])
  }

  const validateForm = async () => {
    if (
      name !== "" &&
      description !== "" &&
      collection !== "" &&
      image !== null
    ) {
      return true
    }
  }

  const createNFT = async () => {
    const _metadata = {
      name: name,
      description: description,
      external_url: collection,
      attributes: {
        size_x: "none",
        size_y: "none",
        asset_model: "none",
      },
    }
    try {
      if (isUser) {
        setShowWaitModal(true)
        setSubmit(true)
        setLoading(true)
        const _validate = await validateForm()
        if (_validate === true) {
          //1. submit file to ipfs
          const fd = new FormData()
          fd.append("file", image)
          fd.append("metadata", JSON.stringify(_metadata))
          const _result1 = await fetch(Config.UPLOAD_NFT_API, {
            method: "post",
            body: fd,
          })
          let result1 = await _result1.json()

          if (_result1.ok === true) {
            toastSuccess(
              "Upload NFT",
              "Upload NFT, Your NFT has been uploaded!!"
            )
          }
          console.log(result1)
          // 2. submit hash to contract
          const _result2 = await safeMint(result1.Hash)
          const _tokenId = await getLatestTokenId(account)
          if (_result2) {
            toastSuccess("Mint NFT", "Your NFT has been minted!!")
          }
          let obj = {
            address: account,
            creator: account,
            contractAddress: Config.BWNFT_ADDR,
            token: _tokenId.toString(),
            hash: result1.Hash,
            metadata: result1.metadata_hash_cdn,
            image: result1.image_cdn,
          }
          console.log(obj)
          //3. submit token id to database
          const _result3 = await createAssetList(obj)

          if (_result3.ok === true) {
            toastSuccess("Create Asset", "Successfully Create Asset !!")
          }
          let result3 = await _result3.json()
          console.log(result3)
          const _result4 = await putAssetCollection(collection, {
            asset: [result3._id],
          })
          if (_result4.ok === true) {
            toastSuccess("Put Asset", "Successfully Put Asset !!")
          }
          setShowWaitModal(false)
          setLoading(false)
          window.location = `/profile/${collection}`
        } else {
          setShowWaitModal(false)
          setLoading(false)
          Swal.fire(
            "Warning",
            "Invalid Form, Please fill the form completely",
            "warning"
          )
        }
      } else {
        setShowWaitModal(false)
        Swal.fire(
          "Warning",
          "New User, Please register to become user",
          "warning"
        ).then((e) => {
          window.location = "/profile/?tab=my-profile"
        })
        return
      }
    } catch (error) {
      setShowWaitModal(false)
      setLoading(false)
      toastDanger("Create NFTs", "Error NFT creation")
      console.log(error)
    }
  }

  const initialize = async () => {
    let _isCreator = await isCreatorCheck(wallet)

    if (!_isCreator) router.push("/profile?tab=my-profile")

    setIsCreator(_isCreator)
  }

  const handleCloseWaitModal = async () => {
    try {
      setShowWaitModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!image) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  useEffect(() => {
    initialize()

    let isMounted = true

    if (isMounted) fetchUser()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (isMounted) fetchCollection()
    return () => {
      isMounted = false
    }
  }, [account])

  return (
    <>
      <div className="events">
        <div className="container my-lg-5 my-2 py-2 py-lg-5">
          <div className="row d-flex justify-content-center">
            <div className="col-12 text-center">
              <h2>Create NFT</h2>
              <p>
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            <div className="col-lg-5 col-12">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                    type="text"
                    placeholder="Name"
                    className="input-fix"
                  />
                  {name === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                    as="textarea"
                    placeholder="Description"
                    rows={3}
                  />
                  {description === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>
                <Form.Label>Collection</Form.Label>

                <Form.Select
                  className="mb-3"
                  onChange={(e) => {
                    setCollection(e.target.value)
                  }}
                  aria-label="Default select example"
                >
                  <option>Select Collection</option>
                  {collectionList.length > 0 &&
                    collectionList.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.title}
                        </option>
                      )
                    })}
                </Form.Select>
                {collection === "" && submit === true ? (
                  <p className="color-red"> Please fill the form</p>
                ) : null}
                <Form.Group
                  controlId="formFile"
                  className="mb-3 custom-file-upload position-relative  "
                >
                  <Form.Label>
                    {/* Cover Picture
                    <p>upload file</p> */}
                    <div className="d-block">
                      <small
                        className={
                          errors.image
                            ? `d-block text-danger`
                            : `d-block text-warning`
                        }
                      >
                        max file size {imageMaxSize} MB
                      </small>
                      <i className="fas fa-camera-retro f-4rem color-grey"></i>
                    </div>
                  </Form.Label>
                  <div>
                    {
                      <Form.Control
                        onChange={onSelectFile}
                        type="file"
                        accept="image/*"
                      />
                    }

                    {image && (
                      <img
                        className=" position-absolute set-upload"
                        src={preview}
                      />
                    )}
                  </div>
                </Form.Group>
                {errors.image && (
                  <small className="d-block text-danger">{errors.image}</small>
                )}
              </Form>
              <div className="text-center">
                {isMinter === true ? (
                  errors.image.length == 0 && (
                    <button
                      onClick={(e) => {
                        createNFT()
                      }}
                      type="button"
                      className="align-items-center bg-gradient bg-primary btn btn-lg btn-marss d-flex mx-auto text-white"
                    >
                      {loading === true ? (
                        <span
                          className="spinner-border float-left"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      Create NFTs
                    </button>
                  )
                ) : isCreator === true ? (
                  <button
                    onClick={(e) => {
                      Swal.fire(
                        "Warning",
                        "Create NFTs, Please wait for Approval",
                        "warning"
                      )
                    }}
                    type="button"
                    className="btn bg-primary bg-gradient btn-lg text-white btn-marss"
                  >
                    Please Wait...
                  </button>
                ) : (
                  <Link href="/register">
                    <button
                      type="button"
                      className="btn bg-primary bg-gradient btn-lg text-white btn-marss"
                    >
                      Please Register
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Waitmodal
        showWaitModal={showWaitModal}
        handleCloseWaitModal={handleCloseWaitModal}
      />
    </>
  )
}

export default Createnft
Createnft.layout = Mainlayout
