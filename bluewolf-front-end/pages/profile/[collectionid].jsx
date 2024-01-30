import {useEffect, useState} from "react"
import CardCollection from "../../components/card/CardCollection"
import Mainlayout from "../../components/layouts/Mainlayout"
import Dropdown from "react-bootstrap/Dropdown"
import Link from "next/link"
import {useRouter} from "next/router"
import {fetchWhitelistUser} from "../../utils/api/whitelist-api"
import {
  fetchImageBucket,
  fetchAssetCollection,
} from "../../utils/api/collection-api"
import {getAssetById} from "../../utils/api/asset-api"
import {fetchUserData} from "../../utils/api/user-api"
import {getAccount} from "../../utils/connector/provider"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Swal from "sweetalert2"
import Spinner from "react-bootstrap/Spinner"
import {getImageGridFS} from "models/image"
import {isCreatorCheck} from "models/creator"
import {useWalletContext} from "context/wallet"

const Collections = () => {
  const {wallet} = useWalletContext()
  const router = useRouter()

  const [asset, setAsset] = useState([])
  const [collection, setCollection] = useState({})
  const [filter, setFilter] = useState(0)
  const [link, setLink] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isUser, setIsUser] = useState(false)
  const [modalDetail, setModalDetail] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [isOwned, setIsOwned] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  const fetchColletion = async () => {
    try {
      if (typeof router.query.collectionid === "undefined") {
        return
      }
      const _collection = await fetchAssetCollection(router.query.collectionid)
      const _coverImage = await fetchImageBucket(_collection.cover)
      const _name = await getName(_collection.owner)
      const imageUrl = await getImageUrl(_collection.owner)
      const _price = []
      if (typeof _collection.transaction !== "undefined") {
        _price = await _collection.transaction.map((item) => {
          return parseFloat(item.price.$numberDecimal)
        })
      }

      if (typeof account === "undefined") {
        return
      } else {
        if (_collection.owner === account) {
          setIsOwned(true)
        }
      }

      const latest =
        (await _price.length) === 0
          ? "0"
          : _price[_price.length - 1].toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })

      const sum = await _price.reduce((a, b) => a + b, 0)

      const floor =
        (await Math.min(..._price)) === Infinity
          ? "0"
          : Math.min(..._price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })

      let _collectionObj = {
        creatorName: _name,
        creatorImage: imageUrl,
        collectionId: _collection._id,
        collectionTitle: _collection.title,
        collectionDescription: _collection.description,
        coverImage: _coverImage,
        assets: _collection.assets,
        totalAsset:
          _collection.assets === "undefied"
            ? 0
            : _collection.assets.length.toLocaleString("en-US"),
        collectionLatestPrice: latest,
        collectionFloorPrice: floor,
        collectionVolumeTrade: sum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      }
      let _linkObj = {
        collectionOwnerWebsite: await getWebsite(_collection.owner),
        collectionOwnerTwitter: await getUserInfo(_collection.owner, "twitter"),
        collectionOwnerInstagram: await getUserInfo(
          _collection.owner,
          "instagram"
        ),
        collectionOwnerReport: await getUserInfo(_collection.owner, "report"),
      }

      let user = await fetchUserData(_collection.owner)

      if (user.rows.length > 0) {
        let _user = user.rows[0]

        if (_user.profileImage) {
          _collectionObj.creatorImage = getImageGridFS(_user.profileImage)
        } else {
          _collectionObj.creatorImage = await getImageUrl(_collection.owner)
        }
      }

      setCollection(_collectionObj)
      setLink(_linkObj)
      return _collection.assets
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAssetList = async (assets) => {
    try {
      if (typeof assets === "undefined") {
        return
      }
      let _assetObj = {
        assetId: "",
        assetContractAddress: "",
        assetImage: "",
        assetCreatorImage: "",
        assetMetadata: "",
        assetHash: "",
        assetTokenId: "",
        assetName: "",
        assetDescription: "",
        assetPrice: "",
        assetListed: false,
      }

      const assetList = await Promise.all(
        assets.map(async (item) => {
          const _asset = await getAssetById(item)

          let user = await fetchUserData(_asset.creator)

          let creatorImage = await getImageUrl(_asset.creator)

          if (user.rows.length > 0) {
            let _user = user.rows[0]

            if (_user.profileImage) {
              creatorImage = getImageGridFS(_user.profileImage)
            }
          }

          _assetObj = {
            assetId: _asset._id,
            assetContractAddress: _asset.contractAddress,
            assetImage: _asset.image,
            assetCreatorImage: creatorImage,
            assetMetadata: _asset.metadata,
            assetHash: _asset.hash,
            assetTokenId: _asset.token,
            assetName: await getMetadata("name", _asset.metadata),
            assetDescription: await getMetadata("description", _asset.metadata),
            assetPrice:
              _asset.marketStatus === "avialable"
                ? parseFloat(_asset.Nftprice.$numberDecimal)
                : parseFloat(_asset.Orderprice.$numberDecimal),
            assetListed: _asset.marketStatus === "listed" ? true : false,
          }
          return _assetObj
        })
      )

      if (parseInt(filter) === 0) {
        setAsset(assetList)
      } else if (parseInt(filter) === 1) {
        const _sortedList = await sortAssetLowtoHigh(assetList)
        setAsset(_sortedList)
      } else if (parseInt(filter) === 2) {
        const _sortedList = await sortAssetHightoLow(assetList)
        setAsset(_sortedList)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const sortAssetLowtoHigh = async (assetList) => {
    try {
      console.log(assetList)
      const _sorted = await assetList.sort((a, b) => {
        return a.assetPrice - b.assetPrice
      })
      return _sorted
    } catch (error) {}
  }

  const sortAssetHightoLow = async (assetList) => {
    try {
      const _sorted = await assetList.sort((a, b) => {
        return b.assetPrice - a.assetPrice
      })
      return _sorted
    } catch (error) {}
  }

  const getImageUrl = async (owner) => {
    if (typeof owner === "undefined") {
      return "/assets/image/E138F93A.png"
    } else {
      const userData = await fetchWhitelistUser(owner)
      if (userData.rows.length === 0) {
        return "/assets/image/E138F93A.png"
      } else {
        const url = await getImage(userData.rows[0].image)
        return url
      }
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

  const getWebsite = async (owner) => {
    if (typeof owner === "undefined") {
      return "none"
    } else {
      const userData = await fetchWhitelistUser(owner)
      if (userData.rows[0].register.portfolio.length === 0) {
        return ""
      } else {
        return `https://${userData.rows[0].register.portfolio[0].value}`
      }
    }
  }

  const getUserInfo = async (owner, detail) => {
    const userInfo = await fetchUserData(owner)
    if (detail === "twitter") {
      return userInfo.rows[0].socialMedia.twitter
    } else if (detail === "instagram") {
      return userInfo.rows[0].socialMedia.instagram
    } else if (detail === "report") {
      return userInfo.rows[0].about
    }
  }

  const getMetadata = async (value, metadata) => {
    try {
      const _res = await fetch(metadata)
      const json = await _res.json()
      if (value === "name") {
        return json.name
      } else if (value === "description") {
        return json.description
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getName = async (owner) => {
    if (typeof owner === "undefined") {
      return "none"
    } else {
      const userData = await fetchWhitelistUser(owner)

      if (userData.rows.length === 0) {
        return "Guest"
      }
      const _name = userData.rows[0].register.userName
      if (typeof _name === "undefined") {
        return "Guest"
      } else {
        return _name
      }
    }
  }

  const handleReport = async (report) => {
    try {
      setShowModal(true)
      setModalDetail(report)
    } catch (error) {
      console.error(error)
    }
  }
  const handleCloseModal = async () => {
    try {
      setShowModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleWebsite = async (website) => {
    try {
      if (website === "") {
        setShowModal(true)
        setModalDetail("Portfolio Not Found")
      } else {
        window.location = `${website}`
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleTwitter = async (twitter) => {
    try {
      if (twitter === "") {
        setShowModal(true)
        setModalDetail("Twitter Not Found")
      } else {
        window.location = `${twitter}`
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleInstagram = async (instagram) => {
    try {
      if (instagram === "") {
        setShowModal(true)
        setModalDetail("Intagram Not Found")
      } else {
        window.location = `${instagram}`
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAccount = async () => {
    try {
      const _account = await getAccount()
      if (typeof _account === "undefined" || _account === null) {
        setAccount("")
        return false
      } else {
        const user = await fetchUserData(_account)
        setAccount(_account)
        setIsConnected(true)
        if (user.rows.length === 0) {
          return false
        } else {
          setIsUser(true)
          return true
        }
      }
    } catch (error) {}
  }

  const handleWatchList = async () => {
    try {
      const check = await fetchAccount()
      console.log(check, isConnected, isUser)
      if (check === false && isConnected === false && isUser === false) {
        Swal.fire("Warning", "Connect metamark to the DApp", "warning")

        return
      } else if (check === false && isConnected === true && isUser === false) {
        Swal.fire(
          "Warning",
          "New User, Please register to become user",
          "warning"
        ).then((e) => {
          window.location = "/profile/?tab=my-profile"
        })
      } else if (check === true && isConnected === true && isUser === true) {
        window.location = "/profile/?tab=watchlist"
      }
    } catch (error) {
      console.error(error)
    }
  }

  const _fetchCollection = async () => {
    const _asset = await fetchColletion()
    fetchAssetList(_asset)
  }

  const initialize = async () => {
    let _isCreator = await isCreatorCheck(wallet)
    setIsCreator(_isCreator)
  }

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchAccount()
    return () => {
      isMounted = false
    }
  }, [account, isConnected, isUser])

  useEffect(() => {
    let isMounted = true

    if (isMounted) _fetchCollection()
    return () => {
      isMounted = false
    }
  }, [router.query.collectionid, filter, account])

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }, [loading])

  return (
    <>
      <section className="events ">
        <div className="container-fluid ">
          <div className="row position-relative ">
            <div
              className="col-md-12 px-0  banner-collection "
              style={{
                backgroundImage: `URL(${collection.coverImage})`,
              }}
            ></div>

            <div className="position-img-radius user-detail-coll w-height-coll ">
              <img
                src={collection.creatorImage}
                className="w-100 h-100 rounded-circle img-thumbnail "
              />
            </div>
          </div>
        </div>

        <div className="container text-center mt-5 pt-5 position-relative">
          <div className="row ">
            <div className="col-md-12 position-dropdown-social">
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="btn-md dropdown-social"
                >
                  <i className="fas fa-ellipsis-v"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu className=" p-2">
                  {/* <Dropdown.Item
                    onClick={() => {
                      handleWatchList()
                    }}
                    className="f-14"
                  >
                    <i className="fas fa-plus px-2"></i>Add to watchlist
                  </Dropdown.Item> */}

                  <Dropdown.Item
                    // onClick={() => {
                    //   handleWebsite(link.collectionOwnerWebsite)
                    // }}
                    href={link.collectionOwnerWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="f-14"
                  >
                    <a>
                      <i className="fas fa-window-maximize px-2"></i>Website
                    </a>
                  </Dropdown.Item>

                  <Dropdown.Item
                    href={link.collectionOwnerTwitter}
                    target="_blank"
                    rel="noreferrer"
                    className="f-14"
                  >
                    <i className="fab fa-twitter px-2"></i> Twitter
                  </Dropdown.Item>

                  {/* <a href={link.collectionOwnerInstagram} target="_blank" rel="noreferrer"> */}
                  <Dropdown.Item
                    // onClick={() => {
                    //   handleInstagram(link.collectionOwnerInstagram)
                    // }}
                    href={link.collectionOwnerInstagram}
                    target="_blank"
                    rel="noreferrer"
                    className="f-14"
                  >
                    <i className="fab fa-instagram  px-2"></i>Instagram
                  </Dropdown.Item>
                  {/* </a> */}
                  {/* <Dropdown.Item
                    onClick={() => {
                      handleReport(link.collectionOwnerReport);
                    }}
                    className="f-14"
                  >
                    <i className="fas fa-exclamation-circle px-2"></i>Report
                  </Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="col-md-12">
              <h3>{collection.collectionTitle}</h3>
              <p className="color-blue">@{collection.creatorName}</p>
              <p className="mb-0">{collection.collectionDescription}</p>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <h2>{collection.totalAsset}</h2>
              <p>NFTs</p>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <h2>{collection.collectionLatestPrice} BWC</h2>
              <p>Latest Price</p>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <h2>{collection.collectionFloorPrice} BWC</h2>
              <p>Floor Price</p>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <h2>{collection.collectionVolumeTrade} BWC</h2>
              <p>Volume Trade</p>
            </div>
          </div>
          <div className="row d-flex justify-content-end  my-5">
            {/* <div className="col-md-6 col-lg-2 col-6">
              <div>
                <Link href="/insertnft">
                  <button
                    type="button"
                    className="btn bg-primary bg-gradient btn-md text-white w-100 h-100"
                  >
                    Insert NFTs
                  </button>
                </Link>
              </div>
            </div> */}
            <div className="col-md-6 col-lg-2 col-6">
              {isOwned & isCreator ? (
                <div>
                  <Link href="/createnft">
                    <button
                      type="button"
                      className="btn bg-primary bg-gradient btn-md text-white w-100 h-100"
                    >
                      Create NFTs
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>
            <div className="col-md-6 col-lg-2 col-6">
              <select
                className="form-select input-prict"
                aria-label="Default select example"
                onChange={(e) => {
                  setFilter(e.target.value)
                }}
              >
                <option value={0}>Price Filter</option>
                <option value={1}>Price: Low to High</option>
                <option value={2}>Price: Hign to Low</option>
              </select>
            </div>
          </div>

          <div className="row mb-5">
            {loading === true ? (
              <>
                <div className="d-flex justify-content-center">
                  <Spinner
                    animation="border"
                    variant="primary"
                    role="status"
                    style={{width: "2rem", height: "2rem"}}
                  >
                    <span className="visually-hidden ">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : asset.length > 0 ? (
              asset.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="col-lg-3 col-md-6 col-12 my-2 collection"
                  >
                    <CardCollection
                      link={`/profile/${collection.collectionId}/${item.assetContractAddress}/${item.assetTokenId}`}
                      user1={item.assetCreatorImage}
                      black={item.assetListed ? "position-black" : ""}
                      listing={item.assetListed ? "Listing" : ""}
                      text="Creator"
                      name={item.creatorName || collection.creatorName}
                      img={item.assetImage}
                      title={item.assetName}
                      description={item.description}
                      tokenId={item.assetTokenId}
                      price="Price"
                      user2="/assets/image/IMG_5592.png"
                      sum1={`${
                        item.assetPrice > 0
                          ? item.assetPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "-"
                      } BWC`}
                      sum2="(329.90 USD)"
                    />
                  </div>
                )
              })
            ) : (
              <p>No Data</p>
            )}
          </div>
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalDetail}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  )
}

export default Collections
Collections.layout = Mainlayout
