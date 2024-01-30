import {useEffect, useState, useRef} from "react"
import Mainlayout from "../../components/layouts/Mainlayout"
import CardProfile from "../../components/card/CardProfile"
import Card from "../../components/card/CardGashapon"
import {Form, Table, Tabs, Tab} from "react-bootstrap"
import Link from "next/link"
import {useRouter} from "next/router"
import {
  fetchWhitelistUser,
  updateWhitelistUser,
} from "../../utils/api/whitelist-api"
import {toastSuccess} from "../../components/toast/toast"
import {getAccount} from "../../utils/connector/provider"
import {
  fetchCollectionList,
  fetchImageBucket,
  fetchCollectionByAssetId,
} from "../../utils/api/collection-api"
import {
  getAssetByAddress,
  getAssetByAddressToken,
  updateAssetList,
} from "../../utils/api/asset-api"
import {
  saveUser,
  fetchUserData,
  getUsername,
  updateuserData,
} from "../../utils/api/user-api"
import {
  NFTsLock,
  getOrder,
  cancelOrder,
} from "../../utils/contracts/BWNFTMarket"
import {
  getLatestOrderEvent,
  getPurchaseEventByOwner,
  getSaleEventByOwner,
} from "../../utils/graphQL/event"
import Swal from "sweetalert2"
import Spinner from "react-bootstrap/Spinner"
import {useWalletContext} from "context/wallet"
import {getImageGridFS, uploadImageToGirdFS} from "models/image"
import {isCreatorCheck} from "models/creator"
import Waitmodal from "../../components/modal/waitmodal"

const profileMaxSize = 2 // MB
const coverMaxSize = 4 // MB

const Profile = () => {
  const router = useRouter()
  const {wallet} = useWalletContext()

  const [activeTab, setActiveTab] = useState("my-collection")
  const [activeSubTab, setActiveSubTab] = useState("")
  const [account, setAccount] = useState("")
  const [name, setName] = useState("")
  const [collection, setCollection] = useState([])
  const [asset, setAsset] = useState([])
  const [order, setOrder] = useState([])
  const [purchaseEvent, setPurchaseEvent] = useState([])
  const [saleEvent, setSaleEvent] = useState([])
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [about, setAbout] = useState("")
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [validEmail, setValidEmail] = useState(true)
  const [isUser, setIsUser] = useState(false)
  const [loadData, setLoadData] = useState(false)
  const [id, setId] = useState("")
  const [showWaitModal, setShowWaitModal] = useState(false)
  const [profileImage, setProfileImage] = useState()
  const [coverImage, setCoverImage] = useState()
  const [profileImageContent, setProfileImageContent] = useState()
  const [coverImageContent, setCoverImageContent] = useState()

  const [isCreator, setIsCreator] = useState(false)

  const [errors, setErrors] = useState({
    profileImage: "",
    coverImage: "",
  })

  const fetchAccount = async () => {
    try {
      const _account = await getAccount()
      if (typeof _account === "undefined" || _account === null) {
        setAccount("0x00000.....")
        setName("Guest")
        setProfileImage("/assets/image/E138F93A.png")
        return false
      } else {
        const user = await fetchUserData(_account)
        const imageUrl = await getImageUrl(_account)
        const _name = await getName(_account)

        setAccount(_account)
        // setProfileImage(imageUrl)
        setName(_name)
        if (user.rows.length === 0) {
          return _account
        } else {
          setIsUser(true)
          return _account
        }
      }

      await fetchUserInfo()
    } catch (error) {}
  }

  const fetchCollection = async (address) => {
    if (address === false) {
      return
    } else {
      try {
        const _collection = await fetchCollectionList(address)
        let _obj = {
          collectionId: "",
          image: "",
          title: "",
          description: "",
          creatorName: "",
        }

        const obj = await Promise.all(
          _collection.rows.map(async (item) => {
            _obj = {
              collectionId: item._id,
              image: await fetchImageBucket(item.cover),
              title: item.title,
              description: item.description,
              creatorName: await getName(item.owner),
            }
            return _obj
          })
        )
        setCollection(obj)
        return obj
      } catch (error) {}
    }
  }

  const getName = async (owner) => {
    if (typeof owner === "undefined") {
      return "Guest"
    } else {
      const userData = await fetchUserData(owner)

      if (userData.rows.length === 0) {
        return "Guest"
      }
      const _name = userData.rows[0].username
      if (typeof _name === "undefined") {
        return "Guest"
      } else {
        return _name
      }
    }
  }

  const getImageUrl = async (owner) => {
    if (typeof owner === "undefined") {
      return "/assets/image/E138F93A.png"
    } else {
      const userData = await fetchUserData(owner)
      if (userData.rows.length === 0) {
        return "/assets/image/E138F93A.png"
      } else {
        const url = await getImage(userData.rows[0].profileImage)
        return url
      }
    }
  }

  const getImage = async (id) => {
    if (typeof id === "undefined") {
      return "/assets/image/E138F93A.png"
    } else if (id === "") {
      return "/assets/image/E138F93A.png"
    } else {
      const url = await fetchImageBucket(id)
      return url
    }
  }

  const fetchAsset = async (address) => {
    if (address === false) {
      return
    } else {
      try {
        const asset = await getAssetByAddress(address)

        let _obj = {
          assetId: "",
          assetCollectionId: "",
          assetImage: "",
          assetMetadata: "",
          assetHash: "",
          assetContractAddress: "",
          assetTokenId: "",
          assetName: "",
          assetDescription: "",
          assetCreator: "",
          assetListed: false,
        }

        const obj = await Promise.all(
          asset.rows.map(async (item) => {
            _obj = {
              assetId: item._id,
              assetCollectionId: await fetchCollectionAsset(item._id, "id"),
              assetImage: item.image,
              assetMetadata: item.metadata,
              assetHash: item.hash,
              assetContractAddress: item.contractAddress,
              assetTokenId: item.token,
              assetName: await getMetadata("name", item.metadata),
              assetDescription: await getMetadata("description", item.metadata),
              assetCreator: await getName(item.creator),
              assetListed: item.marketStatus === "listed" ? true : false,
            }
            return _obj
          })
        )
        setAsset(obj)
        return obj
      } catch (error) {
        console.error(error)
      }
    }
  }

  const fetchCollectionAsset = async (assetId, details) => {
    try {
      const listed = await fetchCollectionByAssetId(assetId)

      if (details === "id") {
        return listed[0]._id
      } else if (details === "title") {
        const data = listed[0].title === "undefied" ? "" : listed[0].title
        return data
      }
    } catch (error) {
      console.error(error)
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

  const fetchOrder = async (address) => {
    if (address === false) {
      return
    } else {
      try {
        const tokenId = await getAssetByAddress(address)

        let _orderList = []
        await Promise.all(
          tokenId.rows.map(async (item) => {
            if (item.marketStatus === "listed") {
              _orderList.push(item)
            }
          })
        )

        const orderList = await setEventOrderData(_orderList)
        setOrder(orderList)
        return orderList
      } catch (error) {
        console.error(error)
      }
    }
  }
  const setEventOrderData = async (dataList) => {
    try {
      let _orderObj = {
        assetId: "",
        assetCollectionTitle: "",
        assetContractAddress: "",
        assetCreator: "",
        assetCreatorImage: "",
        assetImage: "",
        assetMetadata: "",
        assetTokenId: "",
        assetName: "",
        assetDescription: "",
        assetNFTPrice: "",
        assetDollarPrice: "",
        assetOrderDate: 0,
        assetLink: "",
      }

      const obj = await Promise.all(
        dataList.map(async (item) => {
          const _event = await getLatestOrderEvent(item.token)
          console.log(_event)
          _orderObj = {
            assetId: item._id,
            assetCollectionTitle: await fetchCollectionAsset(item._id, "title"),
            assetContractAddress: item.contractAddress,
            assetCreator: await getName(item.creator),
            assetCreatorImage: await getImageUrl(item.creator),
            assetImage: item.image,
            assetMetadata: item.metadata,
            assetTokenId: item.token.toString(),
            assetName: await getMetadata("name", item.metadata),
            assetDescription: await getMetadata("description", item.metadata),
            assetNFTPrice: parseFloat(item.Orderprice.$numberDecimal).toFixed(
              2
            ),
            assetDollarPrice: (
              parseInt(item.Orderprice.$numberDecimal) / 33
            ).toFixed(2),
            assetOrderDate: new Date(_event?.timestamp).getTime(),
            assetLink: `https://testnet.bscscan.com/tx/${_event?.transactionHash}`,
          }
          return _orderObj
        })
      )

      return obj
    } catch (error) {
      console.log(error)
    }
  }

  const deleteOrder = async (contractAddress, tokenId, assetid) => {
    try {
      setShowWaitModal(true)
      const _result1 = await cancelOrder(contractAddress, tokenId)
      if (_result1) {
        toastSuccess(
          "Success",
          "Delete Order, Successfully Delete Order",
          "success"
        )
      }
      console.log(assetid)
      const _result2 = await updateAssetList(assetid, {
        marketStatus: "avialable",
      })
      console.log(_result2.ok)
      if (_result2.ok === true) {
        toastSuccess(
          "Success",
          "Update Asset, Successfully Update Asset",
          "success"
        )
        setShowWaitModal(false)
        location.reload()
      }
    } catch (error) {
      setShowWaitModal(false)
      Swal.fire("Error", "Delete Order, Error order deletion!!", "error")
    }
  }

  const fetchPurchaseItem = async (address) => {
    try {
      const _purchaseList = await getPurchaseEventByOwner(address)
      const purchaseList = await setEventData(_purchaseList)
      const sortedList = await sortEvent(purchaseList)
      console.log("_purchaseList", _purchaseList)
      console.log("purchaseList", purchaseList)
      setPurchaseEvent(sortedList)
      return sortedList
    } catch (error) {
      console.error(error)
    }
  }

  const fetchSaleItem = async (address) => {
    try {
      const _saleList = await getSaleEventByOwner(address)
      console.log(_saleList)
      const saleList = await setEventData(_saleList)
      const sortedList = await sortEvent(saleList)
      setSaleEvent(sortedList)
      return sortedList
    } catch (error) {
      console.error(error)
    }
  }

  const setEventData = async (dataList) => {
    try {
      let _orderObj = {
        assetId: "",
        assetCollectionTitle: "",
        assetContractAddress: "",
        assetCreator: "",
        assetCreatorImage: "",
        assetImage: "",
        assetMetadata: "",
        assetTokenId: "",
        assetName: "",
        assetDescription: "",
        assetNFTPrice: "",
        assetDollarPrice: "",
        assetOrderDate: 0,
        assetLink: "",
      }

      const obj = await Promise.all(
        dataList.map(async (item) => {
          const asset = await getAssetByAddressToken(
            item.nftContract,
            item.tokenId.toString()
          )

          _orderObj = {
            assetId: asset.rows[0]._id,
            assetCollectionTitle: await fetchCollectionAsset(
              asset.rows[0]._id,
              "title"
            ),
            assetContractAddress: item.nftContract,
            assetCreator: await getName(asset.rows[0].creator),
            assetCreatorImage: await getImageUrl(asset.rows[0].creator),
            assetImage: asset.rows[0].image,
            assetMetadata: asset.rows[0].metadata,
            assetTokenId: item.tokenId.toString(),
            assetName: await getMetadata("name", asset.rows[0].metadata),
            assetDescription: await getMetadata(
              "description",
              asset.rows[0].metadata
            ),
            assetNFTPrice:
              parseFloat(item.price.toString()) > 0
                ? item.price * 10 ** 9
                : item.price * 10 ** 9,
            assetDollarPrice:
              parseInt(item.price.toString()) > 10 ** 12
                ? ((parseInt(item.price.toString()) / 33) * 10 ** 9).toFixed(2)
                : (parseInt(item.price.toString()) / 33).toFixed(2),
            assetOrderDate: new Date(item.timestamp).getTime(),
            assetLink: `https://testnet.bscscan.com/tx/${item.transactionHash}`,
          }
          return _orderObj
        })
      )

      return obj
    } catch (error) {
      console.log(error)
    }
  }

  const sortEvent = async (eventList) => {
    try {
      const _sorted = await eventList.sort((a, b) => {
        return b.assetOrderDate - a.assetOrderDate
      })
      return _sorted
    } catch (error) {}
  }

  const validateForm = async () => {
    if (userName !== "" && email !== "" && validateEmail()) {
      return true
    }
  }

  const validateAccount = async () => {
    if (
      account === "0x00000....." ||
      account === null ||
      typeof account === "undefined"
    ) {
      return false
    } else {
      return true
    }
  }

  const validateEmail = () => {
    if (
      email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setValidEmail(true)
      return true
    } else {
      setValidEmail(false)
      return false
    }
  }

  const fetchUserInfo = async () => {
    try {
      let user = await fetchUserData(wallet)

      if (user.rows.length > 0) {
        let _user = user.rows[0]
        console.log(_user)

        let _profileImage = null
        if (_user.profileImage) {
          _profileImage = getImageGridFS(_user.profileImage)
        } else {
          _profileImage = await getImageUrl(wallet)
        }

        setProfileImage(_profileImage)

        if (_user.coverImage) setCoverImage(getImageGridFS(_user.coverImage))

        setIsUser(true)
        setEmail(_user.email)
        setUserName(_user.username)

        setTwitter(_user.socialMedia.twitter)
        setInstagram(_user.socialMedia.instagram)
        setAbout(_user.about)
        setId(_user._id)
      } else {
        setProfileImage("/assets/image/E138F93A.png")
      }

      setIsCreator(await isCreatorCheck(wallet))
    } catch (error) {}
  }

  const updateUserInfo = async () => {
    try {
      setLoading(true)
      setSubmit(true)

      const whitelistId = await fetchWhitelistUser(wallet)

      let _updateUserData = {
        // username: userName,
        email: email,
        about: about,
        socialMedia: {
          twitter: twitter,
          instagram: instagram,
        },
      }

      if (profileImageContent) {
        let fd = new FormData()
        fd.append("file", profileImageContent)

        _updateUserData.profileImage = (await uploadImageToGirdFS(fd)).filename
      }

      if (coverImageContent) {
        let fd = new FormData()
        fd.append("file", coverImageContent)

        _updateUserData.coverImage = (await uploadImageToGirdFS(fd)).filename
      }

      console.log(_updateUserData.profileImage)

      const _updateWhitelistData = {
        image: _updateUserData.profileImage,
        register: {
          // userName: userName,
          email: email,
          about: about,
        },
      }

      const _validate = await validateForm()

      if ((await validateAccount()) === true) {
        if (_validate === true) {
          console.log(id, _updateUserData)
          const _result2 = await updateuserData(id, _updateUserData)
          console.log(_result2)

          if (whitelistId.rows.length > 0) {
            console.log("inin")
            await updateWhitelistUser(
              whitelistId.rows[0]._id,
              _updateWhitelistData
            )
          }

          if (_result2.ok === true) {
            setLoading(false)
            Swal.fire(
              "Success",
              "My Profile, Successfully Update Info!!",
              "success"
            ).then((e) => {
              location.reload()
            })
          }
        } else {
          setLoading(false)
          Swal.fire(
            "Error",
            "My Profile, Please fill the form completely",
            "error"
          )
        }
      } else {
        setLoading(false)
        Swal.fire("Error", "My Profile, Please Connect Metamask", "error")
      }
    } catch (error) {
      Swal.fire("Error", "My Profile, Error Update data", "error")
    }
  }

  const handleFileChanged = (e) => {
    let file = e.target.files[0]
    let keyName = e.target.name

    if (file) {
      let fileSize = file.size / 1024 / 1024 // Convert to MB
      fileSize = Math.round(fileSize * 100) / 100 // Convert to 2 decimal
    }

    if (keyName === "profileImage") {
      if (parseFloat(fileSize) > parseFloat(profileMaxSize)) {
        setErrors((prevErr) => ({
          ...prevErr,
          profileImage: `Image file size is more than ${profileMaxSize} MB`,
        }))
      }

      setProfileImageContent(file)
    }

    if (keyName === "coverImage") {
      if (parseFloat(fileSize) > parseFloat(coverMaxSize)) {
        setErrors((prevErr) => ({
          ...prevErr,
          coverImage: `Image file size is more than ${coverMaxSize} MB`,
        }))
      }

      setCoverImageContent(file)
    }
  }

  const submitUserInfo = async () => {
    try {
      let _data = {
        address: account,
        username: userName,
        email: email,
        about: about,
        socialMedia: {
          twitter: twitter,
          instagram: instagram,
        },
        favorites: [],
        watchlists: [],
      }

      setLoading(true)
      setSubmit(true)

      if (profileImageContent) {
        let fd = new FormData()
        fd.append("file", profileImageContent)
        _data.profileImage = (await uploadImageToGirdFS(fd)).filename
      }
      if (coverImageContent) {
        let fd = new FormData()
        fd.append("file", coverImageContent)
        _data.coverImage = (await uploadImageToGirdFS(fd)).filename
      }

      const _validate = await validateForm()
      if ((await validateAccount()) === true) {
        if (_validate === true) {
          if ((await _fetchUserName()) === false) {
            const _result = await saveUser(_data)
            if (_result.ok === true) {
              setIsUser(true)
              setLoading(false)
              Swal.fire(
                "Success",
                "My Profile, Successfully Submit Info!!",
                "success"
              ).then((e) => {
                location.reload()
              })
            } else {
              setLoading(false)
              Swal.fire("Error", "My Profile, Submit Info Error!!", "error")
            }
          } else {
            setLoading(false)
            Swal.fire(
              "Warning",
              "My Profile, This Username is Replicated",
              "warning"
            )
          }
        } else {
          setLoading(false)
          Swal.fire(
            "Error",
            "My Profile, Please fill the form completely",
            "error"
          )
        }
      } else {
        setLoading(false)
        Swal.fire("Error", "My Profile, Please Connect Metamask", "error")
      }
    } catch (error) {
      Swal.fire("Error", "My Profile, Submit Info Error!!", "error")
      setLoading(false)
      console.log(error)
    }
  }

  const handleChangeSubTab = (tab) => {
    setActiveSubTab(tab)
  }

  const setUTC7 = (date) => {
    const result = new Date(date)
    result.setTime(date + 7 * 60 * 60 * 1000)
    return result.toLocaleString("en-US", {timeZone: "Asia/Bangkok"})
  }

  useEffect(() => {
    let isMounted = true

    fetchUserInfo()

    if (router.isReady && isMounted) {
      const {tab} = router.query
      setActiveTab(tab)
    }

    return () => {
      isMounted = false
    }
  }, [router.isReady])

  const handleChangeTab = (selectedTab) => {
    setActiveTab(selectedTab)
  }

  const _fetchAsset = async (address) => {
    const _asset = await fetchAsset(address)
    // if (_asset.length !== 0) {
    //   setLoadData(false)
    // }
    // if (typeof _asset[0] === "undefined") {
    //   setLoadData(false)
    // }
  }

  const _fetchCollection = async (address) => {
    const _collection = await fetchCollection(address)
    // if (_collection.length !== 0) {
    //   setLoadData(false)
    // }
    // if (typeof _collection[0] === "undefined") {
    //   setLoadData(false)
    // }
  }

  const _fetchPurchase = async () => {
    const address = await fetchAccount()
    if (address === false) {
      setLoadData(false)
      return
    }
    const item = await fetchPurchaseItem(address)
    if (typeof item === "undefined") {
      setLoadData(false)
      return
    }
    if (item.length !== 0) {
      setLoadData(false)
    }
  }

  const _fetchSale = async () => {
    const address = await fetchAccount()
    if (address === false) {
      setLoadData(false)
      return
    }
    const item = await fetchSaleItem(address)
    if (typeof item === "undefined") {
      setLoadData(false)
      return
    }
    if (item.length !== 0) {
      setLoadData(false)
    }
  }

  const _fetchOrder = async () => {
    const address = await fetchAccount()
    if (address === false) {
      setLoadData(false)
      return
    }
    const item = await fetchOrder(address)
    console.log(111)
    console.log(item)
    if (typeof item === "undefined") {
      setLoadData(false)
      return
    }
    if (item.length === 0) {
      setLoadData(false)
    }
  }

  const _fetchUserName = async () => {
    try {
      const username = await getUsername(userName)
      if (username.username === userName) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  const fetchMainTabContent = async () => {
    console.log(activeTab)
    setLoadData(true)
    const walletAddress = await fetchAccount()
    if (!walletAddress) {
      setLoadData(false)
      return
    }
    if (activeTab === "my-collection") {
      await _fetchCollection(walletAddress)
    } else if (activeTab === "my-nft") {
      await _fetchAsset(walletAddress)
    } else if (activeTab === "history") {
      setActiveSubTab("Purchase")
    }
    setLoadData(false)
  }

  const fetchSubTabContent = async () => {
    setLoadData(true)
    if (activeSubTab === "Purchase") {
      await _fetchPurchase()
    } else if (activeSubTab === "Sale") {
      await _fetchSale()
    } else if (activeSubTab === "Listings") {
      await _fetchOrder()
    }
    setLoadData(false)
  }

  const handleCloseWaitModal = async () => {
    try {
      setShowWaitModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let isMounted = true

    if (isMounted && activeTab === "my-profile") _fetchUserName()
    return () => {
      isMounted = false
    }
  }, [activeTab, userName])

  useEffect(() => {
    let isMounted = true
    setLoadData(true)

    if (isMounted) fetchMainTabContent()
    return () => {
      isMounted = false
    }
  }, [activeTab])

  useEffect(() => {
    let isMounted = true

    if (isMounted) fetchSubTabContent()

    return () => {
      isMounted = false
    }
  }, [activeSubTab])

  return (
    <Mainlayout setActiveTab={setActiveTab} activeTab={activeTab}>
      <section className="events ">
        <div className="container-fluid position-relative">
          <div className="row ">
            <div className="col-12 px-0 ">
              <img
                src={coverImage || `assets/image/Group-150.png`}
                className="w-100 object-h"
              />
            </div>
          </div>
          <div className="row position-bg-profile row-fix">
            <div className=" d-flex align-items-center">
              <div className="col-3 px-0 w-height-user">
                <img
                  src={profileImage}
                  className="img_profile rounded-circle"
                  onError={(e) => {
                    e.target.src =
                      "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
                    e.target.onError = null
                  }}
                />
              </div>
              <div className="col-md-9 col-5 text-white px-3 mx-2">
                <p className="mb-0">{name}</p>
                <p className="mb-0 text-break p">{account}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-12 position-relative ">
              {isCreator && (
                <div className="position-btn">
                  <Link href="/collection/create">
                    <a
                      type="button"
                      className="btn bg-primary bg-gradient btn-md text-white mx-2"
                    >
                      Create Collection
                    </a>
                  </Link>
                </div>
              )}

              <Tabs
                defaultActiveKey={activeTab}
                id="uncontrolled-tab-example"
                className="mb-3 flex-scroll"
                activeKey={activeTab}
                onSelect={handleChangeTab}
              >
                {/* My Collection */}
                <Tab
                  eventKey="my-collection"
                  title="My Collection"
                  tabClassName="w-170-tab"
                >
                  <div className="row">
                    {loadData === true ? (
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
                    ) : collection.length > 0 ? (
                      collection.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="col-lg-3 col-md-6 col-12 my-2"
                          >
                            <a href={`/profile/${item.collectionId}`}>
                              <CardProfile
                                img={item.image}
                                title={item.title}
                                description={item.description}
                                imguser={profileImage}
                                creator="Creator"
                                name={item.creatorName}
                                onError={(e) => {
                                  e.target.src =
                                    "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
                                  e.target.onError = null
                                }}
                              />
                            </a>
                          </div>
                        )
                      })
                    ) : (
                      <h5 align="center" className="m-4">
                        <i>No Data</i>
                      </h5>
                    )}
                  </div>
                </Tab>
                {/* My NFTs */}
                <Tab
                  eventKey="my-nft"
                  title="My NFTs"
                  tabClassName="w-170-tab "
                >
                  <div className="row">
                    {loadData === true ? (
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
                    ) : asset.length > 0 ? (
                      asset.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="col-lg-3 col-md-6 col-12 my-2"
                          >
                            <a
                              href={`/profile/${item.assetCollectionId}/${item.assetContractAddress}/${item.assetTokenId}`}
                            >
                              <CardProfile
                                img={item.assetImage}
                                black={item.assetListed ? "position-black" : ""}
                                listing={item.assetListed ? "Listing" : ""}
                                title={item.assetTitle}
                                description={item.assetDescription}
                                imguser="assets/image/IMG_5592.png"
                                creator="Creator"
                                name={item.assetCreator}
                                onError={(e) => {
                                  e.target.src =
                                    "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
                                  e.target.onError = null
                                }}
                              />
                            </a>
                          </div>
                        )
                      })
                    ) : (
                      <h5 align="center" className="m-4">
                        <i>No Data</i>
                      </h5>
                    )}
                  </div>
                </Tab>

                {/* Favorite */}
                {/* <Tab eventKey="favorites" title="Favorites">
                  <div className="row">
                    <h2>Coming Soon !! </h2>
                    <div className="col-lg-3 col-md-6 col-12 my-2">
                      <CardProfile
                        img="assets/image/bfd11e2b87c75b6b9b447efaa42262c0.png"
                        title="Breast Cancer #98"
                        description="Try.Out.Illustration"
                        imguser="assets/image/asset-3.png"
                        creator="Creator"
                        name="Cristhian Ramírez"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 col-12 my-2">
                      <CardProfile
                        img="assets/image/5559e7659e2255635d7e68ff52bd7bd2.png"
                        title="The Cordoba #21"
                        description="La mulata de Cordoba"
                        imguser="assets/image/asset-3.png"
                        creator="Creator"
                        name="Teresa Mtz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 col-12 my-2">
                      <CardProfile
                        img="assets/image/03c4b5724a54b9e52b0e34752a0e5b56.png"
                        title="The Cordoba #21"
                        description="La mulata de Cordoba"
                        imguser="assets/image/asset-3.png"
                        creator="Creator"
                        name="Teresa Mtz"
                      />
                    </div>
                  </div>
                </Tab> */}

                {/* Watchlist */}
                {/* <Tab eventKey="watchlist" title="Watchlist">
                  <div className="row">
                    <div className="col-lg-3 col-md-6 col-12 my-2">
                      <Card
                        title="Try.Out.Illustration."
                        creator="@Cristhian Ramírez"
                        description="This is an exploration in Procreate. With a comun point in the pieces, the metaphor."
                        cover="assets/image/asset-2.png"
                        profile="assets/image/asset-3.png"
                      />
                    </div>
                    <h2>Coming Soon !! </h2>
                  </div>
                </Tab> */}

                {/* History */}
                <Tab eventKey="history" title="History">
                  <Tabs
                    defaultActiveKey={activeSubTab}
                    activeKey={activeSubTab}
                    id="uncontrolled-tab-example"
                    className="my-5 flex-scroll nav-history"
                    onSelect={handleChangeSubTab}
                  >
                    {/* History-Purchase */}
                    <Tab
                      eventKey="Purchase"
                      title="Purchase"
                      tabClassName="tab-history"
                    >
                      <Table
                        bordered
                        hover
                        responsive="md"
                        size="sm"
                        className="table-fix w-100 "
                      >
                        <thead>
                          <tr>
                            <th className="w-25 color-grey-V2">NFT</th>
                            <th className="w-25 color-grey-V2">Price</th>
                            <th className="w-25 color-grey-V2">Date</th>
                            <th className="w-25"></th>
                          </tr>
                        </thead>

                        <tbody>
                          {purchaseEvent !== undefined &&
                          purchaseEvent.length > 0 ? (
                            purchaseEvent.map((item, index) => {
                              return (
                                <tr key={index} className="">
                                  <td>
                                    <div className="row d-flex align-items-center width-300px">
                                      <div className="col-md-4 col-6">
                                        <img
                                          src={item.assetImage}
                                          className="w-100 border-radius-5V1"
                                        />
                                      </div>
                                      <div className="col-md-8 col-6 px-1">
                                        <h5>{item.assetName}</h5>
                                        <p className="f-12">
                                          {item.assetCollectionTitle}
                                        </p>
                                        <div className="d-flex">
                                          <img
                                            src={item.assetCreatorImage}
                                            className="width-35px border-radius_profile"
                                          />
                                          <div>
                                            <p className="f-14 mb-0">Creator</p>
                                            <p className="f-14 mb-0">
                                              {item.assetCreator}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center ">
                                      <img
                                        src="assets/image/IMG_5592.png"
                                        className="w-img-50 "
                                      />
                                      <p className="mb-0">
                                        {parseFloat(
                                          item.assetNFTPrice
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}{" "}
                                        BWC
                                      </p>
                                    </div>
                                    {/* <p className="color-grey-V2">
                                      ({item.assetDollarPrice} USD)
                                    </p> */}
                                  </td>
                                  <td>
                                    <h6>{setUTC7(item.assetOrderDate)}</h6>
                                  </td>
                                  <td align="center">
                                    <a
                                      href={item.assetLink}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <i className="fas fa-external-link-alt icon-bar color-grey"></i>
                                    </a>
                                  </td>
                                </tr>
                              )
                            })
                          ) : loadData === true ? (
                            <tr>
                              <td colSpan={4} align="center">
                                <div className="d-flex justify-content-center">
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    role="status"
                                    style={{width: "2rem", height: "2rem"}}
                                  >
                                    <span className="visually-hidden ">
                                      Loading...
                                    </span>
                                  </Spinner>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={4}>
                                <h5 align="center">
                                  <i>No Data</i>
                                </h5>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Tab>
                    {/* History-Sale */}
                    <Tab
                      eventKey="Sale"
                      title="Sale"
                      tabClassName="tab-history"
                    >
                      <Table
                        bordered
                        hover
                        responsive="md"
                        size="sm"
                        className="table-fix w-100 "
                      >
                        <thead>
                          <tr>
                            <th className="w-25 color-grey-V2">NFT</th>
                            <th className="w-25 color-grey-V2">Price</th>
                            <th className="w-25 color-grey-V2">Date</th>
                            <th className="w-25"></th>
                          </tr>
                        </thead>

                        <tbody>
                          {saleEvent !== undefined && saleEvent.length > 0 ? (
                            saleEvent.map((item, index) => {
                              return (
                                <tr key={index} className="">
                                  <td>
                                    <div className="row d-flex align-items-center width-300px">
                                      <div className="col-md-4 col-6">
                                        <img
                                          src={item.assetImage}
                                          className="w-100 border-radius-5V1"
                                        />
                                      </div>
                                      <div className="col-md-8 col-6 px-1">
                                        <h5>{item.assetName}</h5>
                                        <p className="f-12">
                                          {item.assetCollectionTitle}
                                        </p>
                                        <div className="d-flex">
                                          <img
                                            src={item.assetCreatorImage}
                                            className="width-35px round border-radius_profile"
                                          />
                                          <div>
                                            <p className="f-14 mb-0">Creator</p>
                                            <p className="f-14 mb-0">
                                              {item.assetCreator}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center ">
                                      <img
                                        src="assets/image/IMG_5592.png"
                                        className="w-img-50 "
                                      />
                                      <p className="mb-0">
                                        {parseFloat(
                                          item.assetNFTPrice
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}{" "}
                                        BWC
                                      </p>
                                    </div>
                                    {/* <p className="color-grey-V2">
                                      ({item.assetDollarPrice} USD)
                                    </p> */}
                                  </td>
                                  <td>
                                    <h6>{setUTC7(item.assetOrderDate)}</h6>
                                  </td>
                                  <td align="center">
                                    <a
                                      href={item.assetLink}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <i className="fas fa-external-link-alt icon-bar color-grey"></i>
                                    </a>
                                  </td>
                                </tr>
                              )
                            })
                          ) : loadData === true ? (
                            <tr>
                              <td colSpan={4} align="center">
                                <div className="d-flex justify-content-center">
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    role="status"
                                    style={{width: "2rem", height: "2rem"}}
                                  >
                                    <span className="visually-hidden ">
                                      Loading...
                                    </span>
                                  </Spinner>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={4}>
                                <h5 align="center">
                                  <i>No Data</i>
                                </h5>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Tab>

                    {/* History-Listings */}
                    <Tab
                      eventKey="Listings"
                      title="Listings"
                      tabClassName="tab-history"
                    >
                      <Table
                        bordered
                        hover
                        size="sm"
                        responsive="md"
                        className="table-fix w-100 "
                      >
                        <thead>
                          <tr>
                            <th className="w-25 color-grey-V2">NFT</th>
                            <th className="w-25 color-grey-V2">Price</th>
                            <th className="w-25 color-grey-V2">Date</th>
                            <th className="w-25"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {order !== undefined && order.length > 0 ? (
                            order.map((item, index) => {
                              return (
                                <tr key={index} className="">
                                  <td>
                                    <div className="row d-flex align-items-center width-300px">
                                      <div className="col-md-4 col-6 ">
                                        <img
                                          src={item.assetImage}
                                          className="w-100 border-radius-5V1"
                                        />
                                      </div>
                                      <div className="col-md-8 col-6 px-1">
                                        <h5>{item.assetName}</h5>
                                        <p className="f-12">
                                          {item.assetCollectionTitle}
                                        </p>
                                        <div className="d-flex">
                                          <img
                                            src={item.assetCreatorImage}
                                            className="width-35px border-radius_profile"
                                          />
                                          <div>
                                            <p className="f-14 mb-0">Creator</p>
                                            <p className="f-14 mb-0">
                                              {item.assetCreator}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center ">
                                      <img
                                        src="assets/image/IMG_5592.png"
                                        className="w-img-50 "
                                      />
                                      <p className="mb-0">
                                        {parseFloat(
                                          item.assetNFTPrice
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}{" "}
                                        BWC
                                      </p>
                                    </div>
                                    {/* <p className="color-grey-V2">
                                      ({item.assetDollarPrice} USD)
                                    </p> */}
                                    <button
                                      onClick={(e) => {
                                        deleteOrder(
                                          item.assetContractAddress,
                                          item.assetTokenId,
                                          item.assetId
                                        )
                                      }}
                                      className="btn btn-red"
                                    >
                                      Cancel Listing
                                    </button>
                                  </td>
                                  <td>
                                    <h6>{setUTC7(item.assetOrderDate)}</h6>
                                  </td>
                                  <td align="center">
                                    <a
                                      href={item.assetLink}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <i className="fas fa-external-link-alt icon-bar color-grey"></i>
                                    </a>
                                  </td>
                                </tr>
                              )
                            })
                          ) : loadData === true ? (
                            <tr>
                              <td colSpan={4} align="center">
                                <div className="d-flex justify-content-center">
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    role="status"
                                    style={{width: "2rem", height: "2rem"}}
                                  >
                                    <span className="visually-hidden ">
                                      Loading...
                                    </span>
                                  </Spinner>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={4}>
                                <h5 align="center">
                                  <i>No Data</i>
                                </h5>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Tab>
                  </Tabs>
                </Tab>

                {/* User Information */}

                <Tab
                  eventKey="my-profile"
                  title="My Profile"
                  tabClassName="w-200-tab"
                >
                  <div className="row mb-5">
                    <div className="col-md-5 col-12">
                      <h3>My Profile</h3>
                      <Form>
                        {isUser === false ? (
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicUsername"
                          >
                            <Form.Label>Username</Form.Label>

                            <Form.Control
                              type="text"
                              placeholder={userName || "bluewolfnft"}
                              value={userName}
                              onChange={(e) => {
                                setUserName(e.target.value)
                              }}
                            />
                            {userName === "" && submit === true ? (
                              <p className="color-red"> Please fill the form</p>
                            ) : null}
                          </Form.Group>
                        ) : (
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicUsername"
                          >
                            <Form.Label>Username</Form.Label>

                            <Form.Control
                              type="text"
                              placeholder={userName || "bluewolfnft"}
                              disabled
                              // onChange={(e) => {
                              //   setUserName(e.target.value)
                              // }}
                            />
                            {userName === "" && submit === true ? (
                              <p className="color-red"> Please fill the form</p>
                            ) : null}
                          </Form.Group>
                        )}

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            onChange={(e) => {
                              setEmail(e.target.value)
                            }}
                            type="email"
                            placeholder={email || "bluewolfnft@gmail.com"}
                            value={email}
                          />
                          {email === "" && submit === true ? (
                            <p className="color-red"> Please fill the form</p>
                          ) : validEmail === true ? null : (
                            <p className="color-red">Invalid Email</p>
                          )}
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label>About</Form.Label>
                          <Form.Control
                            onChange={(e) => {
                              setAbout(e.target.value)
                            }}
                            as="textarea"
                            rows={3}
                            placeholder={about || "My bio ..."}
                            value={about}
                          />
                        </Form.Group>
                        <h5 className="mb-3">Social Network</h5>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicTwitter"
                        >
                          <Form.Label>Twitter</Form.Label>
                          <Form.Control
                            onChange={(e) => {
                              setTwitter(e.target.value)
                            }}
                            type="text"
                            placeholder={twitter || "https://twitter.com/"}
                            value={twitter}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicInstagram"
                        >
                          <Form.Label>Instagram</Form.Label>
                          <Form.Control
                            onChange={(e) => {
                              setInstagram(e.target.value)
                            }}
                            type="text"
                            placeholder={
                              instagram || "https://www.instagram.com/"
                            }
                            value={instagram}
                          />
                        </Form.Group>

                        <div className="mb-3">
                          <label htmlFor="profileImage">
                            Profile Image{" "}
                            <small
                              className={
                                errors.profileImage
                                  ? `text-danger`
                                  : `text-warning`
                              }
                            >
                              max file size {profileMaxSize} MB
                            </small>
                          </label>
                          <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            className="form-control"
                            style={{display: "block"}}
                            onChange={(e) => handleFileChanged(e)}
                            accept="image/*"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="coverImage">
                            Cover Image{" "}
                            <small
                              className={
                                errors.coverImage
                                  ? `text-danger`
                                  : `text-warning`
                              }
                            >
                              max file size {coverMaxSize} MB
                            </small>
                          </label>
                          <input
                            type="file"
                            name="coverImage"
                            id="coverImage"
                            className="form-control"
                            style={{display: "block"}}
                            onChange={(e) => handleFileChanged(e)}
                            accept="image/*"
                          />
                        </div>

                        <div className="text-end">
                          {isUser === false ? (
                            (errors.profileImage.length == 0) &
                              (errors.coverImage.length == 0) && (
                              <button
                                onClick={(e) => {
                                  submitUserInfo()
                                }}
                                type="button"
                                className="btn bg-primary bg-gradient btn-md text-white"
                              >
                                {loading === true ? (
                                  <span
                                    className="spinner-border float-left"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : null}
                                SUBMIT
                              </button>
                            )
                          ) : (
                            <button
                              onClick={(e) => {
                                updateUserInfo()
                              }}
                              type="button"
                              className="btn bg-primary bg-gradient btn-md text-white"
                            >
                              SAVE
                            </button>
                          )}
                        </div>
                      </Form>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <Waitmodal
          showWaitModal={showWaitModal}
          handleCloseWaitModal={handleCloseWaitModal}
        />
      </section>
    </Mainlayout>
  )
}

export default Profile
