import {useState, useEffect} from "react"
import Mainlayout from "../../components/layouts/Mainlayout"
import {grantRole, IsAdmin} from "../../utils/contracts/BWNFT"
import Swal from "sweetalert2"
import Config from "../../utils/config"
import {toastSuccess} from "../../components/toast/toast"
import {fetchImageBucket} from "../../utils/api/collection-api"
import {formatAccount} from "../../utils/lib/utilities"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import {
  fetchWhitelist,
  deleteWhitelist,
  updateWhitelistUser,
} from "../../utils/api/whitelist-api"
import {getAccount} from "../../utils/connector/provider"
import {useWalletContext} from "context/wallet"
import {useRouter} from "next/router"

const Register = () => {
  const router = useRouter()
  const {wallet} = useWalletContext()

  const [whitelist, setWhitelist] = useState([])
  const [showAbout, setShowAbout] = useState(false)
  const [showPort, setShowPort] = useState(false)
  const [userAbout, setUserAbout] = useState("")
  const [portfolio, setPortfolio] = useState([])

  const getWhiteList = async () => {
    try {
      const whiteListArray = await fetchWhitelist()
      let newbieArray = []
      let whiteListobj = {
        id: "",
        address: "",
        userName: "",
        email: "",
        about: "",
        portfolio: [],
        image: "",
        registryTime: "",
      }
      await whiteListArray.rows.map((item) => {
        if (item.roles === "newbie") {
          newbieArray.push(item)
        }
      })

      const _whitelist = await Promise.all(
        newbieArray.map(async (item) => {
          whiteListobj = {
            id: item._id,
            address: item.address,
            userName: item.register.userName,
            email: item.register.email,
            about: item.register.about,
            portfolio: item.register.portfolio,
            image: await getImage(item.image),
            registryTime: `${new Date(
              item.createdAt
            ).toLocaleDateString()} ${new Date(
              item.createdAt
            ).toLocaleTimeString()}`,
          }
          return whiteListobj
        })
      )
      setWhitelist(_whitelist)
    } catch (error) {}
  }

  const getImage = async (id) => {
    if (typeof id === "undefined") {
      return "/assets/image/02.png"
    } else {
      const url = await fetchImageBucket(id)
      return url
    }
  }

  const deleteUser = async (id) => {
    const _admin = await getAccount()
    const _hasRole = await IsAdmin(_admin)
    if (_hasRole) {
      try {
        console.log(id)
        const _result = await deleteWhitelist(id)
        if (_result.ok === true) {
          Swal.fire(
            "Success",
            "Reject User, Success Reject User",
            "success"
          ).then((e) => {
            location.reload()
          })
        }
      } catch (error) {}
    } else {
      Swal.fire("Error", "Grant Role, You Don't Have Role", "error")
    }
  }

  const handleAbout = async (about) => {
    try {
      setShowAbout(true)
      setUserAbout(about)
    } catch (error) {}
  }

  const handlePortfolio = async (portfolio) => {
    try {
      setShowPort(true)
      const port = await portfolio.map((item) => {
        return item.value
      })
      console.log(port)
      setPortfolio(port)
    } catch (error) {}
  }

  const handleCloseModal = async (modal) => {
    try {
      if (modal === "about") {
        setShowAbout(false)
      } else if (modal === "port") {
        setShowPort(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const grantRoleUser = async (id) => {
    const _admin = await getAccount()
    const _hasRole = await IsAdmin(_admin)
    if (_hasRole) {
      try {
        const _result = await updateWhitelistUser(id, {
          roles: "minter",
        })
        if (_result.ok === true) {
          Swal.fire(
            "Success",
            "Approve User, Success Approve User",
            "success"
          ).then((e) => {
            location.reload()
          })
        }
      } catch (error) {
        Swal.fire("Error", "Grant Role, Error Approve User", "error")
      }
    } else {
      Swal.fire("Error", "Grant Role, You Don't Have Role", "error")
    }
  }

  const adminCheck = async () => {
    if (!(await IsAdmin(wallet))) router.push("/")
  }

  useEffect(() => {
    adminCheck()

    let isMounted = true

    if (isMounted) getWhiteList()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <div className="events">
        <div className="container my-lg-5 my-2 py-2 py-lg-5">
          <div className="row d-flex justify-content-center">
            <div className="col-12 text-center mt-5">
              <h2>Admin Page</h2>
              <p>Admin Approve to Become BlueWolf Minter.</p>
            </div>
            <div className="card-body layouthis">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User Account</th>
                      <th>Email</th>
                      <th>Registry Time</th>
                      <th>About</th>
                      <th>Portfolio</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whitelist.length > 0 &&
                      whitelist.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="user-td">
                                <div className="col-left">
                                  <img
                                    src={item.image}
                                    className="img-user-td me-2"
                                  />
                                </div>
                                <div className="col-right">
                                  <p className="user-td-name">
                                    {item.userName}
                                  </p>
                                  <p className="user-td-address">
                                    {formatAccount(item.address)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>{item.email}</td>
                            <td>{item.registryTime}</td>
                            <td>
                              <svg
                                onClick={(e) => {
                                  handleAbout(item.about)
                                }}
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z"
                                  fill="currentColor"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </td>
                            <td>
                              <svg
                                onClick={(e) => {
                                  handlePortfolio(item.portfolio)
                                }}
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z"
                                  fill="currentColor"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </td>
                            <td className="action-td">
                              <button
                                onClick={(e) => {
                                  grantRoleUser(item.id)
                                }}
                                type="button"
                                className="btn bg-primary bg-gradient btn-sm text-white mx-2"
                              >
                                APPROVE
                              </button>

                              <button
                                onClick={(e) => {
                                  deleteUser(item.id)
                                }}
                                type="button"
                                className="btn bg-black bg-gradient btn-sm text-white mx-2"
                              >
                                REJECT
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <Modal
              show={showAbout}
              onHide={(e) => {
                handleCloseModal("about")
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>About</Modal.Title>
              </Modal.Header>
              <Modal.Body>{userAbout}</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    handleCloseModal("about")
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showPort}
              onHide={(e) => {
                handleCloseModal("port")
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Portfolio</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {" "}
                <table className="table" id="dataTable" cellSpacing="0">
                  <tbody>
                    {portfolio.length > 0 &&
                      portfolio.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th width="10%">{index + 1}</th>
                            <td width="10%">{item}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    handleCloseModal("port")
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
Register.layout = Mainlayout
