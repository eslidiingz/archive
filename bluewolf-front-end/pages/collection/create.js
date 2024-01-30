import {useEffect, useState} from "react"
import Mainlayout from "../../components/layouts/Mainlayout"
import {Form} from "react-bootstrap"
import {fetchWhitelistUser} from "../../utils/api/whitelist-api"
import {fetchCollectionByTitle} from "../../utils/api/collection-api"
import {getAccount} from "../../utils/connector/provider"
import {fetchUserData} from "utils/api/user-api"
import Link from "next/link"
import Swal from "sweetalert2"
import {isCreatorCheck} from "models/creator"
import {useWalletContext} from "context/wallet"
import {useRouter} from "next/router"

const imageMaxSize = 2 // MB

const CreateCollection = () => {
  const {wallet} = useWalletContext()
  const router = useRouter()

  const [id, setId] = useState("")
  const [role, setRole] = useState("")
  const [isCreator, setIsCreator] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState(null)
  const [account, setAccount] = useState("")
  const [preview, setPreview] = useState(null)
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUser, setIsUser] = useState(false)

  const [errors, setErrors] = useState({
    image: "",
  })

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPicture(undefined)
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

    setPicture(e.target.files[0])
  }

  const fetchUser = async () => {
    try {
      const _account = await getAccount()
      if (typeof _account !== "undefined") {
        const _data = await fetchWhitelistUser(_account)
        setAccount(_account)
        setRole(_data.rows[0].roles)
        setId(_data.rows[0]._id)

        // if (_data.rows.length !== 0) {
        //   setIsCreator(true);
        // }
        const user = await fetchUserData(_account)
        if (user.rows.length !== 0) {
          setIsUser(true)
        }
      }
    } catch (error) {}
  }

  const validateForm = async () => {
    if (title !== "" && description !== "" && picture !== null) {
      return true
    }
  }

  const createCollection = async () => {
    try {
      if (isUser) {
        setSubmit(true)
        setLoading(true)
        const _validate = await validateForm()
        if (_validate === true) {
          if ((await _fetchTitle()) === false) {
            const fd = new FormData()
            fd.append("title", title)
            fd.append("description", description)
            fd.append("cover", picture)
            fd.append("owner", account)

            const _result = await fetch(
              "https://api.bluewolfnft.com/api/v1/collections",
              {
                method: "post",
                body: fd,
              }
            )
            if (_result.ok === true) {
              Swal.fire(
                "Success",
                "Create Collection, Your Collection has been created!!",
                "success"
              ).then((e) => {
                window.location = "/profile?tab=my-collection"
              })
              setLoading(false)
            }
          } else {
            Swal.fire(
              "Warning",
              "Create Collection, This Title is Replicated ",
              "warning"
            )
            setLoading(false)
          }
        } else {
          Swal.fire(
            "Error",
            "Create Collection, Please fill the form completely",
            "error"
          )
          setLoading(false)
        }
      } else {
        Swal.fire(
          "Error",
          "New User, Please register to become user",
          "error"
        ).then((e) => {
          window.location = "/profile/?tab=my-profile"
        })
        return
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Create Collection, The collection creation is error!!",
        "error"
      )
      setLoading(false)
    }
  }

  const _fetchTitle = async () => {
    try {
      const _title = await fetchCollectionByTitle(title)

      if (_title.title === title) {
        console.log(_title.title, true)
        return true
      } else {
        console.log(title, false)
        return false
      }
    } catch (error) {
      console.log(title, false)
      return false
    }
  }

  const initialize = async () => {
    let _isCreator = await isCreatorCheck(wallet)

    if (!_isCreator) router.push("/profile?tab=my-profile")

    setIsCreator(_isCreator)
  }

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    let isMounted = true

    if (isMounted && title !== "") _fetchTitle()
    return () => {
      isMounted = false
    }
  }, [title])

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchUser()
    return () => {
      isMounted = false
    }
  }, [picture])

  useEffect(() => {
    if (!picture) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(picture)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [picture])

  return (
    <>
      <div className="events">
        <div className="container my-lg-5 my-2 py-2 py-lg-5">
          <div className="row d-flex justify-content-center">
            <div className="col-12 text-center">
              <h2>Create Collection</h2>
              <p>
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            <div className="col-lg-5 col-12">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                    type="text"
                    placeholder="My Collection"
                    className="input-fix"
                  />
                  {title === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label> Description</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                    as="textarea"
                    rows={3}
                  />
                  {description === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>
                <Form.Group
                  controlId="formFile"
                  className="mb-3 custom-file-upload position-relative "
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
                  <div className="layout-update-img">
                    {
                      <Form.Control
                        onChange={onSelectFile}
                        type="file"
                        accept="image/*"
                      />
                    }

                    {picture && (
                      <img
                        className="position-absolute set-upload"
                        src={preview}
                      />
                    )}
                  </div>
                </Form.Group>
                {errors.image && (
                  <small className="d-block text-danger">{errors.image}</small>
                )}

                <div align="center">
                  {isCreator ? (
                    errors.image.length == 0 && (
                      <button
                        onClick={(e) => {
                          createCollection()
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
                        Create Collection
                      </button>
                    )
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
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateCollection
CreateCollection.layout = Mainlayout
