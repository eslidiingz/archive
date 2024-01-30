import Link from "next/link"
import {useState, useEffect} from "react"
import {getAccount} from "../../utils/connector/provider"
import {fetchUserData} from "../../utils/api/user-api"
import Swal from "sweetalert2"

function CardCollection(props) {
  const [favNft, setfavNft] = useState(false)
  const [account, setAccount] = useState("")
  const [isConnected, setIsConnect] = useState(false)
  const [isUser, setIsUser] = useState(false)

  const fetchAccount = async () => {
    try {
      const _account = await getAccount()
      if (typeof _account === "undefined" || _account === null) {
        setAccount("")
        return false
      } else {
        const user = await fetchUserData(_account)
        setAccount(_account)
        setIsConnect(true)

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
    console.log(check, isConnected, isUser)
    if (check === false && isConnected === false && isUser === false) {
      Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning")

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
      setfavNft(true)
    }
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchAccount()
    return () => {
      isMounted = false
    }
  }, [account])

  return (
    <>
      <div className="d-flex justify-content-start align-items-center ">
        <img
          src={props.user1}
          className="width-50px rounded-circle img-thumbnail"
        />
        <div className="text-start">
          <p className="mb-0">{props.text}</p>
          <h6 className="fw-bolder">{props.name}</h6>
        </div>
      </div>
      <div className="border-1 border-8">
        <Link href={props.link}>
          <a>
            <div className="h-75 position-relative">
              <img src={props.img} className="w-100" />
              <div className={props.black}>
                <p className="f-12 mb-0">{props.listing}</p>
              </div>
            </div>
          </a>
        </Link>
        <div className="h-25 text-start p-3  bg-white-set">
          <div className=" d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{props.title}</h5>
            {/* <button
              className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => setFavourite(props.tokenId)}
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
          </div>
          <p className="color-grey twoline-dot">{props.description}</p>
          <p className="mb-0">{props.price}</p>
          <div className="d-flex align-items-center">
            <img src={props.user2} className="w-25 " />
            <div>
              <p className="mb-0">
                {props.sum1}
                <span className="color-grey">{props.sub2}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default CardCollection
