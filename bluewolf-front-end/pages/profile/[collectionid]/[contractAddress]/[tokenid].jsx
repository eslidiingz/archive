import Mainlayout from "../../../../components/layouts/Mainlayout"
import {Form, InputGroup, FormControl} from "react-bootstrap"
import Link from "next/link"
import {useRouter} from "next/router"
import {
  getAssetByAddressToken,
  updateAssetList,
} from "../../../../utils/api/asset-api"
import {
  fetchAssetCollection,
  putTransactionCollection,
} from "../../../../utils/api/collection-api"
import {fetchWhitelistUser} from "../../../../utils/api/whitelist-api"
import {fetchUserData} from "../../../../utils/api/user-api"
import {getAccount} from "../../../../utils/connector/provider"
import {toastSuccess, toastDanger} from "../../../../components/toast/toast"
import {fetchImageBucket} from "../../../../utils/api/collection-api"
import {useEffect, useState} from "react"
import {formatAccount} from "../../../../utils/lib/utilities"
import {getNFTApproved, approvedForAll} from "../../../../utils/contracts/BWNFT"
import Config from "../../../../utils/config"
import Offermodal from "../../../../components/modal/offermodal"
import Ordermodal from "../../../../components/modal/ordermodal"
import Waitmodal from "../../../../components/modal/waitmodal"
import {allowanceToken, approveToken} from "../../../../utils/contracts/BWCoin"
import {getTokenEventLogs} from "../../../../utils/graphQL/event"
import {
  createOrder,
  cancelOrder,
  Buy,
  makeOffer,
  getOffer,
  getOrder,
  cancelOffer,
  acceptOffer,
} from "../../../../utils/contracts/BWNFTMarket"
import Popover from "react-bootstrap/Popover"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Swal from "sweetalert2"
import Spinner from "react-bootstrap/Spinner"
import {getImageGridFS} from "models/image"

const CollectionDetail = () => {
  const router = useRouter()
  const [isNftApprove, setIsNftApprove] = useState(false)
  const [isListed, setIsListed] = useState(false)
  const [isOwned, setIsOwned] = useState(false)
  const [asset, setAsset] = useState({})
  const [collection, setCollection] = useState({})
  const [account, setAccount] = useState("")
  const [isTokenApprove, setIsTokenApprove] = useState(false)
  const [price, setPrice] = useState(0)
  const [offerList, setOfferList] = useState([])
  const [event, setEvent] = useState([])
  const [favNft, setfavNft] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [loadingBuy, setLoadingBuy] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showWaitModal, setShowWaitModal] = useState(false)

  const fetchAccount = async () => {
    try {
      const _account = await getAccount()
      if (typeof _account === "undefined" || _account === null) {
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

  const setFavourite = async (_tokenId) => {
    const check = await fetchAccount()
    if (check === false && isConnected === false && isUser === false) {
      Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning")
    } else if (check === false && isConnected === true && isUser === false) {
      Swal.fire(
        "Warning",
        "New User, Please register to become user",
        "warning"
      ).then((e) => {
        window.location = "/profile/?tab=my-profile"
      })
    } else if (check === true && isConnected === true && isUser === true) {
      setfavNft(true)
    }
  }

  const fetchAsset = async () => {
    try {
      const _collection = await fetchAssetCollection(router.query.collectionid)

      const _tokenId = await router.query.tokenid
      const _contractAddress = await router.query.contractAddress
      const asset = await getAssetByAddressToken(_contractAddress, _tokenId)
      const _asset = await asset.rows[0]
      // console.log(_asset)
      // console.log(_collection)

      if (_asset.address === account) {
        setIsOwned(true)
      } else {
        setIsOwned(false)
      }
      if (_asset.marketStatus === "listed") {
        setIsListed(true)
      } else if (_asset.marketStatus === "avialable") {
        setIsListed(false)
      }

      let _objCollection = {
        collectionId: _collection._id,
        collectionTitle: _collection.title,
        collectionDescription: _collection.description,
        collectionCover: _collection.cover,
      }

      // console.log(_asset.Orderprice.$numberDecimal)

      // let user = await fetchUserData(_asset.address)
      // console.log(user)
      // let creatorImage = await getImageUrl(_asset.address)

      // if (user.rows.length > 0) {
      //   let _user = user.rows[0]

      //   if (_user.profileImage) {
      //     creatorImage = getImageGridFS(_user.profileImage)
      //   }
      // }

      // let userOwner = await fetchUserData(_asset.address)
      // let ownerImage = await getImageUrl(_asset.address)

      // if (userOwner.rows.length > 0) {
      //   let userOwner = user.rows[0]

      //   if (userOwner.profileImage) {
      //     ownerImage = getImageGridFS(userOwner.profileImage)
      //   }
      // }

      let _objAsset = {
        assetId: _asset._id,
        assetContractAddress: _asset.contractAddress,
        assetCreator: await getName(_asset.creator),
        assetCreatorImage: await getImageUrl(_asset.creator),
        assetOwner: await getName(_asset.address),
        assetOwnerImage: await getImageUrl(_asset.address),
        assetImage: _asset.image,
        assetMetadata: _asset.metadata,
        assetHash: _asset.hash,
        assetTokenId: _asset.token,
        assetName: await getMetadata("name", _asset.metadata),
        assetDescription: await getMetadata("description", _asset.metadata),
        assetNftPrice: parseFloat(_asset.Nftprice.$numberDecimal),
        assetOrderPrice: parseFloat(_asset.Orderprice.$numberDecimal),
      }
      // console.log(_objCollection)
      // console.log(_objAsset)
      setCollection(_objCollection)
      setAsset(_objAsset)
      return _tokenId
    } catch (error) {}
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
      const url = await getImageGridFS(id)
      return url
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

  const getApprove = async () => {
    if (
      (await fetchAccount()) === false ||
      (await fetchAccount()) === undefined ||
      account === ""
    ) {
      return
    } else {
      try {
        if (typeof account !== "undefined" || account !== "") {
          console.log("getApprove", account, Config.BWMarket_ADDR)
          const _spender = await getNFTApproved(account, Config.BWMarket_ADDR)
          // console.log(_spender)
          setIsNftApprove(_spender)
        } else {
          setIsNftApprove(false)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const getAllowance = async () => {
    if (
      (await fetchAccount()) === false ||
      (await fetchAccount()) === undefined
    ) {
      return
    } else {
      try {
        if (typeof account !== "undefined" || account !== "") {
          console.log("getAllowance", account, Config.BWMarket_ADDR)
          const _allowance = await allowanceToken(Config.BWMarket_ADDR)
          if (parseInt(_allowance) > 0) {
            setIsTokenApprove(true)
          }
        } else {
          setIsTokenApprove(false)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const ApproveForBuyer = async () => {
    const check = await fetchAccount()
    if (check === false && isConnected === false && isUser === false) {
      Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning")
    } else if (check === false && isConnected === true && isUser === false) {
      Swal.fire(
        "Warning",
        "New User, Please register to become user",
        "warning"
      ).then((e) => {
        window.location = "/profile/?tab=my-profile"
      })
    } else if (check === true && isConnected === true && isUser === true) {
      try {
        setLoading(true)
        const result = await approveToken(Config.BWMarket_ADDR)
        if (result) {
          setLoading(false)
          setIsTokenApprove(true)
          Swal.fire(
            "Approve",
            "Approve Token, Successfully Approve Token",
            "success"
          ).then((e) => {
            location.reload()
          })
        }
      } catch (error) {
        setLoading(false)
        setIsTokenApprove(false)
        console.log(error)
      }
    }
  }

  const ApproveForSeller = async (detail) => {
    const check = await fetchAccount()
    if (check === false && isConnected === false && isUser === false) {
      Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning")
    } else if (check === false && isConnected === true && isUser === false) {
      Swal.fire(
        "Warning",
        "New User, Please register to become user",
        "warning"
      ).then((e) => {
        window.location = "/profile/?tab=my-profile"
      })
    } else if (check === true && isConnected === true && isUser === true) {
      try {
        if (detail === "order") {
          setLoadingOrder(true)
        }
        const result = await approvedForAll(Config.BWMarket_ADDR)
        if (result) {
          if (detail === "order") {
            setLoadingOrder(false)
          }
          setIsNftApprove(true)
          Swal.fire(
            "Approve",
            "Approve NFT, Successfully Approve NFT",
            "success"
          ).then((e) => {
            location.reload()
          })
        }
      } catch (error) {
        if (detail === "order") {
          setLoadingOrder(false)
        }
        setIsNftApprove(false)
        console.log(error)
      }
    }
  }

  const setOrder = async (id) => {
    console.log(id)
    try {
      setLoading(true)
      const result = await createOrder(
        asset.assetTokenId,
        price,
        asset.assetContractAddress
      )
      if (result) {
        toastSuccess(
          "Create Order",
          "Create Order, Successfully Create Order",
          "success"
        )
      }
      const _result = await updateAssetList(id, {
        Orderprice: price,
        marketStatus: "listed",
      })
      if (_result.ok === true) {
        toastSuccess(
          "Success",
          "Update Asset, Successfully Update Asset",
          "success"
        )
        setLoading(false)
        setIsListed(true)
        location.reload()
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      Swal.fire("Error", "Create Order, Error order creation!!", "error")
    }
  }

  const deleteOrder = async (id) => {
    try {
      setShowWaitModal(true)
      setLoading(true)
      const result = await cancelOrder(
        asset.assetContractAddress,
        asset.assetTokenId
      )
      if (result) {
        toastSuccess(
          "Delete Order",
          "Delete Order, Successfully Delete Order",
          "success"
        )
      }
      const _result = await updateAssetList(id, {
        marketStatus: "avialable",
      })
      if (_result.ok === true) {
        toastSuccess(
          "Success",
          "Update Asset, Successfully Update Asset",
          "success"
        )
        setLoading(false)
        setIsListed(true)
        setShowWaitModal(false)
        location.reload()
      }
    } catch (error) {
      setShowWaitModal(false)
      setLoading(false)
      Swal.fire("Error", "Delete Order, Error order deletion!!", "error")
    }
  }

  const buyNFT = async () => {
    try {
      setShowWaitModal(true)
      if (await fetchAccount()) {
        setLoadingBuy(true)

        const result = await Buy(asset.assetContractAddress, asset.assetTokenId)
        if (result) {
          toastSuccess("Buy Order", "Order is bought!!")
        }
        console.log(asset.assetId, account, asset.assetOrderPrice)
        const _result1 = await updateAssetList(asset.assetId, {
          address: account,
          Nftprice: asset.assetOrderPrice,
          marketStatus: "avialable",
        })
        console.log(_result1)
        if (_result1.ok === true) {
          toastSuccess(
            "Success",
            "Update Asset, Successfully Update Asset",
            "success"
          )
        }
        const _result2 = await putTransactionCollection(
          collection.collectionId,
          {
            item: asset.assetContractAddress,
            token: asset.assetTokenId,
            user: account,
            price: asset.assetOrderPrice,
          }
        )
        console.log(_result2)
        if (_result2.ok === true) {
          toastSuccess(
            "Put Transaction (BUY)",
            "Successfully Put Transaction !!"
          )

          setLoading(false)
          setShowWaitModal(false)
          setIsListed(true)
          location.reload()
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
      setShowWaitModal(false)
      setLoadingBuy(false)
      Swal.fire("Error", "Buy NFT, Transaction Error!!", "error")
    }
  }

  const fetchOffer = async () => {
    try {
      const _tokenId = router.query.tokenid
      const _contractAddress = router.query.contractAddress
      if (typeof _tokenId === "undefined") {
        return
      }
      const result = await getOffer(_contractAddress, _tokenId)

      let _offerObj = {
        offerId: 0,
        offerOwner: "",
        offerOwnerImg: "",
        offerPrice: "",
        offerExpried: "",
        offerTokenContract: "",
        offerNftContract: "",
      }

      let _offerArr = []

      await result.map(async (item) => {
        if (
          item.isActive === true &&
          Date.now() <= item.timeOfferEnd.toNumber() * 1000
        ) {
          _offerArr.push(item)
        }
      })

      const _offer = await Promise.all(
        _offerArr.map(async (item) => {
          _offerObj = {
            offerId: item.offerId.toString(),
            offerOwner: item.buyer,
            offerOwnerImg: await getImageUrl(item.buyer),
            offerPrice: parseInt(item.price) / 10 ** 9,
            offerExpried: new Date(
              item.timeOfferEnd.toNumber() * 1000
            ).toLocaleString(),
            offerTokenContract: item.buyWithTokenContract,
            offerNftContract: item.nftContract,
          }
          return _offerObj
        })
      )
      // console.log(_offer)
      setOfferList(_offer)
    } catch (error) {
      console.log(error)
    }
  }

  const setUTC7 = (date) => {
    const result = new Date(date)
    result.setTime(date + 7 * 60 * 60 * 1000)
    return result.toLocaleString("en-US", {timeZone: "Asia/Bangkok"})
  }

  const deleteOffer = async (offerId) => {
    try {
      setShowWaitModal(true)
      const result = await cancelOffer(
        asset.assetContractAddress,
        asset.assetTokenId,
        offerId
      )
      if (result) {
        setShowWaitModal(false)
        Swal.fire(
          "Delete Offer",
          "Delete Offer, Successfully Delete Offer",
          "success"
        ).then((e) => {
          setShowWaitModal(false)
          location.reload()
        })
      }
    } catch (error) {
      setShowWaitModal(false)
      Swal.fire("Error", "Delete Offer, Transaction Error!!", "error")
    }
  }

  const endOffer = async (
    offerId,
    offerPrice,
    buyer,
    tokenContract,
    nftContract,
    assetId
  ) => {
    try {
      setShowWaitModal(true)
      const result = await acceptOffer(
        asset.assetTokenId,
        offerId,
        tokenContract,
        nftContract
      )
      if (result) {
        toastSuccess("Accept Offer", "Offer is Accepted!!")
      }
      console.log(buyer, offerPrice, assetId, asset.assetTokenId)
      const _result1 = await updateAssetList(assetId, {
        address: buyer,
        Nftprice: offerPrice,
        marketStatus: "avialable",
      })
      console.log(_result1)
      if (_result1.ok === true) {
        toastSuccess(
          "Success",
          "Update Asset, Successfully Update Asset",
          "success"
        )
      }
      const _result2 = await putTransactionCollection(collection.collectionId, {
        item: nftContract,
        token: asset.assetTokenId,
        user: buyer,
        price: offerPrice,
      })
      if (_result2.ok === true) {
        toastSuccess(
          "Put Transaction (ACCEPT OFFER)",
          "Successfully Put Transaction !!"
        )
        setShowWaitModal(false)
        location.reload()
      }
    } catch (error) {
      setShowWaitModal(false)
      Swal.fire("Error", "Accept Offer, Transaction Error!!", "error")
    }
  }

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(
        `https://bluwolfnft.com/profile/${collection.collectionId}/${asset.assetContractAddress}/${asset.assetTokenId}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const getEventName = (_eventName) => {
    let obj = {
      MintEvent: "Minted by",
      OrderCreatedEvent: "Ordered by",
      BougthEvent: "Bought by",
      AcceptOfferEvent: "Accepted by",
      OrderCanceledEvent: "Canceled by",
    }
    return obj[_eventName]
  }
  const fetchEvent = async () => {
    try {
      const eventToken = await getTokenEventLogs(router.query.tokenid)
      console.log(eventToken)
      let eventObj = {
        eventName: "",
        eventOwner: "",
        eventOwnerImg: "",
        eventTime: 0,
        bwcPriceOnEvent: "",
        dollarPriceOnEvent: "",
        eventLink: "",
      }

      const _event = await Promise.all(
        eventToken.map(async (item) => {
          let ownerName =
            item.event === "MintEvent"
              ? item.owner
              : item.event === "OrderCreatedEvent"
              ? item.seller
              : item.event === "BougthEvent"
              ? item.buyer
              : item.event === "AcceptOfferEvent"
              ? item.seller
              : item.event === "OrderCanceledEvent"
              ? item.seller
              : ""
          // console.log(ownerName)
          eventObj = {
            eventName: await getEventName(item.event),
            eventOwner: ownerName,
            eventOwnerImg: await getImageUrl(ownerName),
            eventTime: new Date(item.timestamp).getTime(),
            bwcPriceOnEvent:
              item.price !== null ? parseFloat(item.price) * 10 ** 9 : "",
            dollarPriceOnEvent:
              item.price !== null ? parseInt(item.price) / 33 : "",
            eventLink: `https://testnet.bscscan.com/tx/${item.transactionHash}`,
          }
          return eventObj
        })
      )
      console.log(_event)
      const _sortedEvent = await sortEvent(_event)
      const _limitEvent = await limitSize(_sortedEvent)
      console.log(_limitEvent)
      setEvent(_limitEvent)
    } catch (error) {}
  }

  const sortEvent = async (eventObj) => {
    try {
      const _sorted = await eventObj.sort((a, b) => {
        return b.eventTime - a.eventTime
      })
      return _sorted
    } catch (error) {}
  }

  const limitSize = async (eventList) => {
    let _event = []

    if (eventList.length <= 5) {
      return eventList
    } else {
      for (let i = 0; i < 5; i++) {
        _event.push(eventList[i])
      }
      return _event
    }
  }

  const handleCloseOrderModal = async () => {
    try {
      setShowOrderModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseOfferModal = async () => {
    try {
      setShowOfferModal(false)
    } catch (error) {
      console.error(error)
    }
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
    if (isMounted) getAllowance()

    return () => {
      isMounted = false
    }
  }, [isTokenApprove, account])

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchAsset()

    return () => {
      isMounted = false
    }
  }, [router.query.collectionid, account, isListed])

  useEffect(() => {
    let isMounted = true
    if (isMounted) getApprove()

    return () => {
      isMounted = false
    }
  }, [isNftApprove, account])

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchOffer()

    return () => {
      isMounted = false
    }
  }, [router.query.tokenid])

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchEvent()

    return () => {
      isMounted = false
    }
  }, [router.query.tokenid])

  return (
    <>
      {/* Content All*/}
      <section className="events">
        <div className="container">
          <div className="col-lg-2 pt-2 layout-margin_top" align="MIDDLE">
            <Link href={`/profile/${router.query.collectionid}`}>
              <button
                type="button"
                className="btn bg-primary bg-gradient btn-md text-white w-100 h-100"
              >
                BACK To Collection
              </button>
            </Link>
          </div>
        </div>
        <div className="container">
          {Object.values(asset).length > 0 ? (
            <div className="row mt-3-bos">
              <div className="col-lg-5" align="MIDDLE">
                {/* Content left*/}
                <img
                  src={asset.assetImage}
                  className="img-radius"
                  width="100%"
                />
              </div>
              {/* End-Content left*/}
              {/* Content right*/}
              <div className="col-lg-6" align="left">
                {/* heart + share */}
                <div
                  className="heartbox dropdown d-flex justify-content-end align-items-center"
                  align="right"
                >
                  {/* <button
                    className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setFavourite(asset.assetTokenId)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={favNft ? "red" : "#d4d4d4"}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="nonzero"
                        d="M12.0122 5.57169L10.9252 4.48469C8.77734 2.33681 5.29493 2.33681 3.14705 4.48469C0.999162 6.63258 0.999162 10.115 3.14705 12.2629L11.9859 21.1017L11.9877 21.0999L12.014 21.1262L20.8528 12.2874C23.0007 10.1395 23.0007 6.65711 20.8528 4.50923C18.705 2.36134 15.2226 2.36134 13.0747 4.50923L12.0122 5.57169ZM11.9877 18.2715L16.9239 13.3352L18.3747 11.9342L18.3762 11.9356L19.4386 10.8732C20.8055 9.50635 20.8055 7.29028 19.4386 5.92344C18.0718 4.55661 15.8557 4.55661 14.4889 5.92344L12.0133 8.39904L12.006 8.3918L12.005 8.39287L9.51101 5.89891C8.14417 4.53207 5.92809 4.53207 4.56126 5.89891C3.19442 7.26574 3.19442 9.48182 4.56126 10.8487L7.10068 13.3881L7.10248 13.3863L11.9877 18.2715Z"
                        fill="current color"
                      />
                    </svg>
                  </button> */}
                  {/* share */}

                  {/* <Dropdown>
                  <Dropdown.Toggle
                    id="dropdown-share"
                    className="btn-res btn-lg dropdown-share"
                  >
                    <i
                      className="fas fa-share-alt iconsh"
                      onClick={(e) => {
                        navigator.clipboard.writeText("555")
                      }}
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className=" p-2">
                    <Dropdown.Item>
                      <i className="fab fa-twitter"></i> Twitter
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div
                        onClick={(e) => {
                          navigator.clipboard.writeText("555")
                        }}
                      >
                        <i className="fas fa-link"></i>Copy Link
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}

                  {/* <OverlayTrigger
                    trigger="click"
                    key="bottom"
                    placement="bottom"
                    overlay={
                      <Popover id={`popover-positioned-bottom`}>
                        <Popover.Body>
                          <strong className="secondary">Copied!</strong>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      type="button"
                      onClick={() => handleShare()}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 6.12549 15.0077 6.24919 15.0227 6.37063L8.08261 9.84066C7.54305 9.32015 6.80891 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80891 15 7.54305 14.6798 8.08261 14.1593L15.0227 17.6294C15.0077 17.7508 15 17.8745 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C17.1911 15 16.457 15.3202 15.9174 15.8407L8.97733 12.3706C8.99229 12.2492 9 12.1255 9 12C9 11.8745 8.99229 11.7508 8.97733 11.6294L15.9174 8.15934C16.457 8.67985 17.1911 9 18 9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </OverlayTrigger> */}
                </div>
                {/* <div className="ml-5" align="right">
                  <p className="ui basic label " disabled>
                    11
                  </p>
                </div> */}

                {/* End-heart + share */}
                {/* Detail */}
                <div className="text-detail">
                  <p className="text02">{asset.assetName}</p>
                  <p className="textcd">{collection.collectionTitle}</p>
                  <p className="text08">{asset.assetDescription}</p>
                </div>
                {/* End-Detail */}
                {/* Profile */}
                <div className="text-detail textprofile">
                  <img
                    src={asset.assetCreatorImage}
                    className="img-radius img-ma"
                    width="45px"
                  />
                  <p valign="middle" className="text03">
                    Creator
                  </p>
                  <p valign="middle" className="text04">
                    {asset.assetCreator}
                  </p>
                </div>
                {/* End-Profile */}
                {/* Buy-Sell-Price */}
                <div className="text-detail textprofile">
                  <p valign="middle" className="text04">
                    Price
                  </p>
                  <div className="box">
                    <img
                      src="/assets/image/IMG_5592.png"
                      width="36px"
                      className="img-radius"
                    />
                    <p valign="middle" className="text05 center-text">
                      {isListed
                        ? asset.assetOrderPrice > 0
                          ? asset.assetOrderPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "-"
                        : asset.assetNftPrice > 0
                        ? asset.assetNftPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "-"}{" "}
                      BWC
                    </p>
                    {/* <p valign="middle" className="text06 center-text">
                      {isListed
                        ? (parseInt(asset.assetOrderPrice) / 33).toFixed(2)
                        : (parseInt(asset.assetNftPrice) / 33).toFixed(2)}{" "}
                      USD
                    </p> */}
                  </div>
                  {isOwned ? (
                    isListed ? (
                      <button
                        onClick={(e) => {
                          deleteOrder(asset.assetId)
                        }}
                        type="button"
                        className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                      >
                        {loading === true ? (
                          <span
                            className="spinner-border float-left"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        Cancel Order
                      </button>
                    ) : isNftApprove ? (
                      <div>
                        {/* <Form.Group
                          className="mt-4"
                          controlId="formBasicUsername"
                        >
                          <Form.Label>Price (BWC)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Price (BWC)"
                            className="input-fix"
                            onChange={(e) => {
                              if (e.target.value >= 0) {
                                setPrice(e.target.value);
                              } else {
                                e.target.value = 0;
                                setPrice(0);
                              }
                            }}
                          />
                        </Form.Group> */}
                        <button
                          // onClick={(e) => {
                          //   setOrder(asset.assetId)
                          // }}
                          onClick={(e) => {
                            setShowOrderModal(true)
                            // setOrder(asset.assetId);
                          }}
                          type="button"
                          className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                        >
                          {/* {loading === true ? (
                            <span
                              className="spinner-border float-left"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : null} */}
                          Create Order
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          ApproveForSeller("order")
                        }}
                        type="button"
                        className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                      >
                        {loadingOrder === true ? (
                          <span
                            className="spinner-border float-left"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        Approve to Sell
                      </button>
                    )
                  ) : isListed ? (
                    isTokenApprove ? (
                      <div>
                        <button
                          onClick={(e) => {
                            buyNFT(asset.assetId)
                          }}
                          type="button"
                          className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                        >
                          {loadingBuy === true ? (
                            <span
                              className="spinner-border float-left"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          Buy Now
                        </button>
                        {/* <Form.Group
                          className="mt-4"
                          controlId="formBasicUsername"
                        >
                          <Form.Label>Offer Price (BWC)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Offer Price (BWC)"
                            className="input-fix"
                            onChange={(e) => {
                              if (e.target.value >= 0) {
                                setPrice(e.target.value);
                              } else {
                                e.target.value = 0;
                                setPrice(0);
                              }
                            }}
                          />
                        </Form.Group> */}
                        <button
                          // onClick={(e) => {
                          //   createOffer()
                          // }}
                          onClick={(e) => {
                            setShowOfferModal(true)
                            // createOffer();
                          }}
                          type="button"
                          className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                        >
                          Make Offer
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          ApproveForBuyer()
                        }}
                        type="button"
                        className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                      >
                        {loading === true ? (
                          <span
                            className="spinner-border float-left"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        Approve to Buy
                      </button>
                    )
                  ) : isTokenApprove ? (
                    <div>
                      {/* <Form.Group
                        className="mt-4"
                        controlId="formBasicUsername"
                      >
                        <Form.Label>Offer Price (BWC)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Offer Price (BWC)"
                          className="input-fix"
                          onChange={(e) => {
                            if (e.target.value >= 0) {
                              setPrice(e.target.value);
                            } else {
                              e.target.value = 0;
                              setPrice(0);
                            }
                          }}
                        />
                      </Form.Group> */}
                      <button
                        onClick={(e) => {
                          setShowOfferModal(true)
                          // createOffer();
                        }}
                        type="button"
                        className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                      >
                        Make Offer
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        ApproveForBuyer()
                      }}
                      type="button"
                      className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                    >
                      {loading === true ? (
                        <span
                          className="spinner-border float-left"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      Approve to Buy
                    </button>
                  )}
                </div>
                <div className="text-detail textprofile">
                  <img
                    src={asset.assetOwnerImage}
                    className="img-radius img-ma"
                    width="40px"
                  />
                  <p valign="middle" className="text03">
                    Owner
                  </p>
                  <p valign="middle" className="text04">
                    {asset.assetOwner}
                  </p>
                </div>

                {/* Buy-Sell-Price */}
              </div>
              {/* End-Content right*/}
            </div>
          ) : (
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
          )}
          {/* Content Tag*/}
          {/* <p valign="middle" className="text07 center-text">
            Tags
          </p>
          <div className="layouttag">
            <p className="texttag">Digital</p>
            <p className="texttag">Physical</p>
            <p className="texttag">Ramírez</p>
            <p className="texttag">Illustration</p>
            <p className="texttag">Supermodel</p>
          </div> */}
          {/* End-Content Tag*/}

          {/* Content Offer */}
          <p valign="middle" className="text07 center-text">
            Offer
          </p>

          <div className="card-body layouthis">
            <div className="table-responsive">
              <table className="table" id="dataTable" cellSpacing="0">
                <tbody>
                  {offerList.length > 0 ? (
                    offerList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th width="27%">
                            <div className="text-detail">
                              <img
                                src={item.offerOwnerImg}
                                className="img-radius img-ma"
                                width="40px"
                              />
                              <p valign="middle" className="text03">
                                Offered by
                              </p>
                              <p valign="middle" className="text04">
                                {formatAccount(item.offerOwner)}
                              </p>
                            </div>
                          </th>
                          <td valign="middle" width="20%">
                            <p valign="middle" className="text03">
                              Offer Ends At
                            </p>
                            <p valign="middle" className="text04 center-text">
                              {item.offerExpried}
                            </p>
                          </td>
                          <td valign="middle">
                            <p valign="middle" className="text03">
                              Offer Price
                            </p>
                            <div className="box">
                              {/* <img src="assets/image/IMG_5592.png"width="36px" className="img-radius"/> */}
                              <p valign="middle" className="text04 center-text">
                                {item.offerPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                BWC
                              </p>
                              {/* <p valign="middle" className="text06 center-text">
                                {(parseInt(item.offerPrice) / 33).toFixed(2)}{" "}
                                USD
                              </p> */}
                            </div>
                          </td>
                          <td valign="middle">
                            {isOwned ? (
                              isNftApprove ? (
                                <button
                                  onClick={(e) => {
                                    endOffer(
                                      item.offerId,
                                      item.offerPrice,
                                      item.offerOwner,
                                      item.offerTokenContract,
                                      item.offerNftContract,
                                      asset.assetId
                                    )
                                  }}
                                  type="button"
                                  className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                                >
                                  Accept Offer
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    ApproveForSeller("offer")
                                  }}
                                  type="button"
                                  className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                                >
                                  Approve to Sell
                                </button>
                              )
                            ) : item.offerOwner === account ? (
                              <button
                                onClick={(e) => {
                                  deleteOffer(item.offerId)
                                }}
                                type="button"
                                className="btn bg-primary bg-gradient btn-lg text-white btn-mar"
                              >
                                Cancel Offer
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <h2 align="center">
                      <i>No offers</i>
                    </h2>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* End Offer */}

          {/* Content History*/}
          <p valign="middle" className="text07 center-text">
            History
          </p>
          {/* {console.log(event)} */}

          <div className="card-body layouthis">
            <div className="table-responsive">
              <table className="table" id="dataTable" cellSpacing="0">
                <tbody>
                  {event.length > 0 &&
                    event.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th width="27%">
                            <div className="text-detail">
                              <img
                                src={item.eventOwnerImg}
                                className="img-radius img-ma"
                                width="40px"
                              />
                              <p valign="middle" className="text03">
                                {item.eventName}
                              </p>
                              <p valign="middle" className="text04">
                                {formatAccount(item.eventOwner)}
                              </p>
                            </div>
                          </th>

                          <td valign="middle" width="20%">
                            <p valign="middle" className="text04 center-text">
                              {setUTC7(item.eventTime)}
                            </p>
                          </td>
                          <td valign="middle">
                            <div className="box">
                              {item.bwcPriceOnEvent === "" ? (
                                ""
                              ) : (
                                <img
                                  src="/assets/image/IMG_5592.png"
                                  width="36px"
                                  className="img-radius"
                                />
                              )}
                              <p valign="middle" className="text04 center-text">
                                {item.bwcPriceOnEvent.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}{" "}
                                {`${item.bwcPriceOnEvent && "BWC"}`}
                              </p>

                              {/* <p valign="middle" className="text06 center-text">
                                {item.dollarPriceOnEvent === ""
                                  ? ""
                                  : `(${item.dollarPriceOnEvent} USD)`}
                              </p> */}
                            </div>
                          </td>
                          <td valign="middle">
                            <a
                              href={item.eventLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="fas fa-external-link-alt co-gray"></i>
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  {event.length == 0 && (
                    <h2 align="center">
                      <i>No history</i>
                    </h2>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* End-Content History*/}
        </div>
        <Ordermodal
          showOrderModal={showOrderModal}
          tokenid={asset.assetTokenId}
          contractAddress={asset.assetContractAddress}
          assetid={asset.assetId}
          handleCloseOrderModal={handleCloseOrderModal}
          setLoading={setLoading}
          setIsListed={setIsListed}
          loading={loading}
        />
        <Offermodal
          showOfferModal={showOfferModal}
          tokenid={asset.assetTokenId}
          contractAddress={asset.assetContractAddress}
          handleCloseOfferModal={handleCloseOfferModal}
          setLoading={setLoading}
          loading={loading}
          fetchAccount={fetchAccount}
        />
        <Waitmodal
          showWaitModal={showWaitModal}
          handleCloseWaitModal={handleCloseWaitModal}
        />
      </section>
      {/* End-Content All*/}
    </>
  )
}

export default CollectionDetail
CollectionDetail.layout = Mainlayout
