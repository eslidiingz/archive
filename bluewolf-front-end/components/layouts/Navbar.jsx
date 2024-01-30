import React, {useCallback, useState, useEffect, useReducer} from "react"
import Link from "next/link"
import Swal from "sweetalert2"
import {
  connectProvider,
  modalConnect,
  web3Provider,
} from "utils/connector/provider"
import {IsAdmin} from "utils/contracts/BWNFT"
import {useWalletContext} from "context/wallet"
import {connectWallet} from "utils/providers/connector"
import NavbarDesktop from "components/Navbar/NavbarDesktop"
import NavbarMobile from "components/Navbar/NavbarMobile"
import {navigations} from "utils/global-variables"
import {fetchWhitelistUser} from "utils/api/whitelist-api"
import {ethers} from "ethers"

const initialState = {
  provider: null,
  web3Provider: null,
  account: null,
  chainId: null,
  isAdmin: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        account: action.account,
        chainId: action.chainId,
        isAdmin: action.isAdmin,
      }
    case "SET_ADDRESS":
      return {
        ...state,
        account: action.account,
      }
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      }
    case "SET_ISADMIN":
      return {
        ...state,
        isAdmin: action.isAdmin,
      }
    case "RESET_WEB3_PROVIDER":
      return initialState
    default:
      throw new Error()
  }
}

function Navbar({setActiveTab, activeTab = "my-collection"}) {
  const {wallet, walletAction} = useWalletContext()
  const [show, setShow] = useState(false)
  const [toggleViewMode, setToggleViewMode] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [provider, setProvider] = useState(null)
  const [menuItems, setMenuItems] = useState([])

  const handleChangeUserActiveTab = (selectedTab) => {
    if (selectedTab === "logout") {
      disconnect()
    } else {
      if (typeof setActiveTab === "function") {
        setActiveTab(selectedTab)
      } else {
        router.push(`/profile?tab=${selectedTab}`)
      }
    }
  }

  const handleConnectWallet = async () => {
    let _provider = await connectWallet(walletAction)
    setProvider(_provider)
  }

  const menuCheck = async () => {
    let _tempMenuItems = navigations

    if (wallet) {
      let isAdmin = await IsAdmin(wallet)
      let isCreator =
        (await fetchWhitelistUser(wallet)).rows.length > 0 ? true : false

      navigations.map((obj, key) => {
        if (obj.link === "/register") {
          if (isAdmin || isCreator) _tempMenuItems[key].hidden = true
        }
      })
    }

    setMenuItems([..._tempMenuItems])
  }

  const initialize = async () => {
    await menuCheck()
  }

  useEffect(() => {
    if (wallet) {
      handleConnectWallet()
    }

    menuCheck()
  }, [wallet])

  useEffect(() => {
    if (provider?.on) {
      provider.provider.on("accountsChanged", (accounts) => location.reload())

      provider.provider.on("connect", (info) => {
        console.log(info)
      })

      provider.provider.on("chainChanged", (chainId) => {
        console.log(chainId)
      })
    }
  }, [provider])

  useEffect(() => {
    initialize()
  }, [])

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 bg-navbar d-flex align-items-center justify-content-between justify-content-lg-start narbar-fix_scoll">
            <div className="nav-logo">
              <Link href="/">
                <img src="/assets/image/logo.png" className="w-100" />
              </Link>
            </div>

            {/* navber desktop */}
            <NavbarDesktop
              navigations={menuItems}
              onConnectWallet={handleConnectWallet}
            />
            {/* end navber desktop */}

            {/* navber mobile */}
            <div className="d-md-none ">
              <a
                variant="primary"
                onClick={(e) => {
                  setShow(true)
                }}
              >
                <i className="fas fa-bars icon-bar color-blue"></i>
              </a>
            </div>
            {/* end navber mobile */}
          </div>
        </div>

        <NavbarMobile
          navigations={menuItems}
          onConnectWallet={handleConnectWallet}
          show={show}
          onClose={(e) => setShow(false)}
        />
      </div>
    </>
  )
}

export default Navbar
