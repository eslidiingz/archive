import {useEffect, useState} from "react"
import Mainlayout from "../components/layouts/Mainlayout"
import {Form, InputGroup, FormControl} from "react-bootstrap"
import {fetchWhitelistUser} from "../utils/api/whitelist-api"
import {createAssetList} from "../utils/api/asset-api"
import {
  putAssetCollection,
  fetchCollectionList,
} from "../utils/api/collection-api"
import {getAccount} from "../utils/connector/provider"
import {toastSuccess, toastDanger} from "../components/toast/toast"
import {safeMint, getLatestTokenId} from "../utils/contracts/BWNFT"
import Config from "../utils/config"
import {fetchUserData} from "../utils/api/user-api"
import Link from "next/link"
import Swal from "sweetalert2"

const Createnft = () => {
  const [id, setId] = useState("")
  const [role, setRole] = useState("")
  const [account, setAccount] = useState("")
  const [name, setName] = useState("")

  const [collection, setCollection] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [collectionList, setCollectionlist] = useState([])
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [isMinter, setIsMinter] = useState(false)

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
    console.log(collection)

    try {
      if (isUser) {
        setSubmit(true)
        setLoading(true)
        const _validate = await validateForm()
        if (_validate === true) {
          let obj = {
            address: account,
            creator: "",
            contractAddress: "",
            token: "",
            metadata: "",
            image: "",
          }
          console.log(obj)
          //1. submit token id to database
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
          setLoading(false)
          window.location = "/profile/?tab=my-nft"
        } else {
          setLoading(false)
          Swal.fire(
            "Warning",
            "Invalid Form, Please fill the form completely",
            "warning"
          )
        }
      } else {
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
      setLoading(false)
      toastDanger("Create NFTs", "Error NFT creation")
      console.log(error)
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
              <h2>Insert NFT</h2>
              <p>
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            <div className="col-lg-5 col-12">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Owner</Form.Label>
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
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Creator</Form.Label>
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
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Contract Address</Form.Label>
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
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Metadata</Form.Label>
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
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>ImageUrl</Form.Label>
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
              </Form>
              <div className="text-center">
                {isMinter === true ? (
                  <button
                    onClick={(e) => {
                      createNFT()
                    }}
                    type="button"
                    className="btn bg-primary bg-gradient btn-lg text-white btn-marss"
                  >
                    {loading === true ? (
                      <span
                        className="spinner-border float-left"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Insert NFTs
                  </button>
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
    </>
  )
}

export default Createnft
Createnft.layout = Mainlayout
