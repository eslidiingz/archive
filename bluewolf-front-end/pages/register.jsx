import {useEffect, useState, useCallback, useReducer, useRef} from "react"
import Mainlayout from "../components/layouts/Mainlayout"
import {Form, InputGroup, FormControl, Button} from "react-bootstrap"
import {getAccount} from "../utils/connector/provider"
import {
  fetchWhitelistUser,
  saveWhitelistUser,
  getUsername,
  updateWhitelistUser,
} from "../utils/api/whitelist-api"
import {fetchImageBucket} from "../utils/api/collection-api"
import {toastSuccess, toastDanger} from "../components/toast/toast"
import {fetchUserData, updateuserData, saveUser} from "utils/api/user-api"
import Swal from "sweetalert2"
import {useRouter} from "next/router"
import {IsAdmin} from "utils/contracts/BWNFT"
import {useWalletContext} from "context/wallet"
import {getImageGridFS, uploadImageToGirdFS} from "../models/image"

const imageMaxSize = 2 // MB

const Register = () => {
  const router = useRouter()
  const {wallet} = useWalletContext()

  const [portfolio, setPortfolio] = useState([])
  const [userName, setUserName] = useState("")
  const [about, setAbout] = useState("")
  const [image, setImage] = useState(null)
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [email, setEmail] = useState("")
  const [preview, setPreview] = useState(null)
  const portfolioRef = useRef([])
  const [address, setAddress] = useState("")
  const [isCreator, setIsCreator] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [id, setId] = useState("")
  const [profileImgCode, setProfileImgCode] = useState("")

  const [errors, setErrors] = useState({
    image: "",
  })

  const FetchCreator = async () => {
    try {
      const userAddress = await getAccount()
      setAddress(userAddress)
      const _data = await fetchWhitelistUser(userAddress)

      if (_data.rows.length !== 0) {
        setIsCreator(true)
      }
      const user = await fetchUserData(userAddress)
      console.log(user.rows[0].profileImage)
      if (user.rows.length !== 0) {
        setIsUser(true)
        setEmail(user.rows[0].email)
        setUserName(user.rows[0].username)
        setProfileImgCode(user.rows[0].profileImage)
        setTwitter(user.rows[0].socialMedia.twitter)
        setInstagram(user.rows[0].socialMedia.instagram)
        setAbout(user.rows[0].about)
        setId(user.rows[0]._id)
      }
    } catch (error) {}
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined)
      return
    }

    setErrors((prevErr) => ({
      ...prevErr,
      image: "",
    }))

    let file = e.target.files[0]

    if (file) {
      let fileSize = file.size / 1024 / 1024 // Convert to MB
      fileSize = Math.round(fileSize * 100) / 100 // Convert to 2 decimal

      if (parseFloat(fileSize) > parseFloat(imageMaxSize)) {
        setErrors((prevErr) => ({
          ...prevErr,
          image: `Image file size is more than ${imageMaxSize} MB`,
        }))
      }
    }

    console.log(e.target.files[0])

    setImage(e.target.files[0])
  }

  const validateForm = async () => {
    if (!wallet) {
      toastDanger("Registration", "Please Connect wallet.")
      return
    }

    if (
      userName !== "" &&
      email !== "" &&
      about !== "" &&
      (image !== null || profileImgCode !== "")
    ) {
      return true
    }
  }

  const saveRegisterForm = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setSubmit(true)
      const _validate = await validateForm()
      if (isUser) {
        if (_validate === true) {
          if ((await _fetchUserName()) === false) {
            if (image !== null) {
              const _data = {
                address: address,
                roles: "newbie",
                flag: "Y",
                register: {
                  userName: userName,
                  email: email,
                  about: about,
                  portfolio: portfolio,
                },
              }

              if (image) {
                let fd = new FormData()
                fd.append("file", image)

                _data.image = (await uploadImageToGirdFS(fd)).filename
              }

              console.log("no image", _data)

              const _result1 = await saveWhitelistUser(_data)
              // const data = await _result1.json()

              let _updateUserData = {
                username: userName,
                email: email,
                about: about,
                profileImage: _data.image,
                socialMedia: {
                  twitter: twitter,
                  instagram: instagram,
                },
              }
              const _result2 = await updateuserData(id, _updateUserData)
              if (_result1.ok === true && _result2 === true) {
                setIsCreator(true)
                setLoading(false)
                Swal.fire(
                  "Success",
                  "Registration, Successful Registration!!",
                  "success"
                ).then((e) => {
                  // window.location = "/profile?tab=my-profile"
                })
              } else {
                setLoading(false)
                window.location = "/register"
              }
              setLoading(false)
            } else {
              let _image = profileImgCode
              const _data = {
                address: address,
                roles: "newbie",
                flag: "Y",
                image: _image,
                register: {
                  userName: userName,
                  email: email,
                  about: about,
                  portfolio: portfolio,
                },
              }
              console.log("have image", _data)

              const _result1 = await saveWhitelistUser(_data)
              const data = await _result1.json()
              console.log(data)

              let _updateUserData = {
                username: userName,
                email: email,
                about: about,
                profileImage: _image,
                socialMedia: {
                  twitter: twitter,
                  instagram: instagram,
                },
              }
              const _result2 = await updateuserData(id, _updateUserData)

              if (_result1.ok === true && _result2.ok === true) {
                setIsCreator(true)
                setLoading(false)
                Swal.fire(
                  "Success",
                  "Registration, Successful Registration!!",
                  "success"
                ).then((e) => {
                  // window.location = "/profile?tab=my-profile"
                })
              } else {
                setLoading(false)
                window.location = "/register"
              }
              setLoading(false)
            }
          } else {
            Swal.fire(
              "Warning",
              "Registration, This Username is Replicated",
              "warning"
            )
            setLoading(false)
          }
        } else {
          Swal.fire(
            "Warning",
            "Registration, Please fill the form completely",
            "warning"
          )
          setLoading(false)
        }
      } else {
        Swal.fire(
          "Warning",
          "Registration, Please register to become user",
          "warning"
        ).then((e) => {
          window.location = "/profile?tab=my-profile"
        })
        setLoading(false)
      }
    } catch (error) {
      toastDanger("Registration", "Registration Error")
      setLoading(false)
    }
  }

  //// Set Up portfolio///

  const handleValue = (e, index) => {
    const {name, value} = e.target
    if (value.indexOf("https://") == 0 || value.indexOf("http://") == 0) {
      value = value.replace("https://", "")
      value = value.replace("http://", "")
    }
    if (portfolio.length === 0) {
      const _list = [
        {
          value: value,
        },
      ]
      setPortfolio(_list)
    } else {
      const list = [...portfolio]
      list[index][name] = value
      setPortfolio(list)
    }
  }

  const addPortfolio = () => {
    setPortfolio((prev) => [
      ...prev,
      {
        value: "",
      },
    ])
  }

  const removeInputPortfolio = (index) => {
    const list = [...portfolio]

    list.splice(index, 1)
    setPortfolio(list)
  }

  const alertRegisterd = () => {
    if (!wallet) toastDanger("Registration", "Please Connect wallet.")
    else toastDanger("Registration", "You already have registered")
  }

  const _fetchUserName = async () => {
    try {
      const username = await getUsername(userName)

      if (username[0].register.userName === userName) {
        console.log(username[0].register.userName, true)
        return true
      } else {
        console.log(userName, false)
        return false
      }
    } catch (error) {
      console.log(userName, false)
      return false
    }
  }

  const getImage = async (id) => {
    if (typeof id === "undefined") {
      return "/assets/image/E138F93A.png"
    } else {
      const url = await fetchImageBucket(id)
      return url
    }
  }

  useEffect(() => {
    if (isCreator) {
      window.location = "/"
    }
  }, [])
  useEffect(() => {
    let isMounted = true

    if (isMounted && userName !== "") _fetchUserName()
    return () => {
      isMounted = false
    }
  }, [userName])

  useEffect(() => {
    let timerId = setTimeout(() => {
      FetchCreator()
      timerId = null
    }, 1000)

    return () => clearTimeout(timerId)
  }, [isCreator])

  useEffect(() => {
    let mount = async () => {
      if (!image && profileImgCode === "") {
        setPreview(undefined)
        console.log(11)
        return
      } else if (!image && profileImgCode !== "") {
        let url = await getImage(profileImgCode)

        setPreview(url)
        console.log(22, url)
      } else {
        const objectUrl = URL.createObjectURL(image)
        setPreview(objectUrl)
        console.log(33, objectUrl)
        console.log(33)
      }
    }
    mount()
  }, [image, profileImgCode])

  const canAccessPageCheck = async () => {
    /** Admin Check */
    if (await IsAdmin(wallet)) router.push("/adminpage")
    /** Creator Check */
    if ((await fetchWhitelistUser(wallet)).rows.length > 0)
      router.push("/profile?tab=my-profile")
  }

  const initialize = async () => {
    await canAccessPageCheck()
  }

  useEffect(() => {
    initialize()
  }, [])

  ////////////////////////////////////////////////////////////

  return (
    <>
      <div className="events">
        <div className="container my-4">
          <div className="row d-flex justify-content-center">
            <div className="col-12 text-center layout-margin_top">
              <h2 className="my-4 my-md-5">Register</h2>
              <p>Please register to become BlueWolf Creator.</p>
            </div>
            <div className="col-lg-6 col-12">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={userName || "bluewolfnft"}
                    className="input-fix"
                    required
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  {userName === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={email || "bluewolfnft@gmail.com"}
                    className="input-fix"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {email === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>About</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder={about || "My bio ..."}
                  />
                  {about === "" && submit === true ? (
                    <p className="color-red"> Please fill the form</p>
                  ) : null}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPortfolios">
                  <Form.Label>Portfolios</Form.Label>
                  {portfolio.length >= 1 ? (
                    portfolio.map((item, index) => {
                      return (
                        <InputGroup
                          key={index}
                          className="mb-3 d-flex align-items-center my-2 "
                        >
                          <InputGroup.Text id="basic-addon3">
                            https://
                          </InputGroup.Text>
                          <FormControl
                            name="value"
                            type="text"
                            aria-describedby="basic-addon3"
                            className="border-input-7 "
                            ref={(e) => {
                              portfolioRef.current[index] = e
                            }}
                            value={item.value}
                            onChange={(e) => handleValue(e, index)}
                            placeholder="www.bluewolf.com"
                          />{" "}
                          <Button
                            variant="danger"
                            onClick={() => removeInputPortfolio(index)}
                          >
                            <i className="fas fa-minus-circle cursor-pointer"></i>
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => addPortfolio()}
                          >
                            <i className="fas fa-plus-circle cursor-pointer"></i>
                          </Button>
                        </InputGroup>
                      )
                    })
                  ) : (
                    <InputGroup className="mb-3 mr-2 d-flex align-items-center my-2">
                      <InputGroup.Text id="basic-addon3">
                        https://
                      </InputGroup.Text>
                      <FormControl
                        name="value"
                        type="text"
                        aria-describedby="basic-addon3"
                        className="border-input-7 mr-2"
                        placeholder="www.bluewolf.com"
                        onChange={(e) => handleValue(e, 0)}
                      />

                      <Button variant="primary" onClick={() => addPortfolio()}>
                        <i className="fas fa-plus-circle cursor-pointer"></i>
                      </Button>
                    </InputGroup>
                  )}
                </Form.Group>

                <h5 className="mb-3">Social Network</h5>
                <Form.Group className="mb-3" controlId="formBasicTwitter">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setTwitter(e.target.value)
                    }}
                    type="text"
                    placeholder={twitter || "https://twitter.com/"}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicInstragam">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setInstagram(e.target.value)
                    }}
                    type="text"
                    placeholder={instagram || "https://www.instagram.com/"}
                  />
                </Form.Group>
                <Form.Group
                  controlId="formFile"
                  className="mb-3 custom-file-upload position-relative "
                >
                  <Form.Label>
                    {/* Cover Picture
                    <p>upload file</p> */}
                    <div className="d-block">
                      <p>
                        {/* Upload */}
                        Profile Image
                        <small className="d-block text-warning">
                          Image max file size {imageMaxSize} MB
                        </small>
                        {/* (.JPG .PNG .JPEG) (Maximum Size 2MB) */}
                      </p>

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

                    {(image !== null || profileImgCode !== "") && (
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
                  {isCreator === false ? (
                    errors.image.length == 0 && (
                      <button
                        onClick={(e) => {
                          saveRegisterForm(e)
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
                        Save
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      className="btn bg-primary bg-gradient btn-lg text-white btn-marss"
                      onClick={(e) => {
                        alertRegisterd()
                      }}
                    >
                      YOU HAVE REGISTERED
                    </button>
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

export default Register
Register.layout = Mainlayout
