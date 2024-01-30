import {useEffect, useCallback, useReducer, useRef, useState} from "react"
import ButtonState from "../components/utilities/button-state"
import {
  toastDanger,
  toastSuccess,
  toastWaiting,
} from "../components/utilities/toast"
import {formatEther, getAddress} from "ethers/lib/utils"
import Config from "../config"
import {getSaleTypeList} from "../utils/contract/locker"
import {modalConnect, connectProvider} from "../utils/connector/provider"
import {formatUnits, parseUnits} from "ethers/lib/utils"
import {
  packageIndex,
  totalSupply,
  DMSAmount,
  BUSDAmount,
  packageName,
  packageStyle,
  monsterName,
  monsterAmount,
  landName,
  landAmount,
  itemName,
  itemAmount,
} from "../utils/lib/package-detail"
import {
  buyPackage,
  getPackageindex,
  getPackages,
} from "../utils/contract/launchpad"
import {
  allowanceToken,
  approveToken,
  getBalanceToken,
} from "../utils/contract/token"

const initialState = {
  _totalSupply: [],
  allowance: 0,
  busd_balance: 0,
  saleType: [],
  packageIndexList: [],
  packageList: [],
  selectType: "Seed",
  loading: false,
  index: "",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOTAL_SUPPLY":
      return {
        ...state,
        _totalSupply: action._totalSupply,
      }
    case "SET_SALE_TYPE":
      return {
        ...state,
        saleType: action.saleType,
      }
    case "SET_PACKAGEINDEX_LIST":
      return {
        ...state,
        packageIndexList: action.packageIndexList,
      }
    case "SET_PACKAGE_LIST":
      return {
        ...state,
        packageList: action.packageList,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
        index: action.index,
      }
    case "SET_SELECT_SALE_TYPE":
      return {
        ...state,
        selectType: action.selectType,
      }
    case "SET_BUSD_BALANCE":
      return {
        ...state,
        busd_balance: action.busd_balance,
      }
    case "SET_ALLOWANCE":
      return {
        ...state,
        allowance: action.allowance,
      }
    case "SET_AMOUNT":
      return {
        ...state,
        packgageSelected: action.packgageSelected,
      }
    case "RESET_STATE":
      return initialState
    default:
      throw new Error()
  }
}

const Privatesale = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    _totalSupply,
    packgageSelected,
    busd_balance,
    saleType,
    packageIndexList,
    packageList,
    selectType,
    loading,
    index,
    allowance,
  } = state

  const fetchSaleTypeList = useCallback(async () => {
    try {
      const saleType = await getSaleTypeList()
      dispatch({
        type: "SET_SALE_TYPE",
        saleType,
      })
      dispatch({
        type: "SET_SELECT_SALE_TYPE",
        selectType: saleType[0].saleType,
      })
    } catch (error) {
      console.log("selltype")
    }
  }, [])

  const getTotalSupply = async () => {
    try {
      const _package = packageIndex.map(async (item) => {
        let _package = await getPackages(item)
        return parseInt(_package.totalSupply._hex, 16)
      })
      let total = await Promise.all(_package)
      console.log("in", total)

      dispatch({
        type: "SET_TOTAL_SUPPLY",
        _totalSupply: total,
      })
    } catch (error) {
      console.log("totalsupply")
    }
  }

  const fetchPackage = useCallback(async () => {
    try {
      let packageList = packageIndex.map((index) => {
        let obj = {
          totalSupply: totalSupply[index],
          packageName: packageName[index],
          DMSAmount: DMSAmount[index],
          BUSDAmount: BUSDAmount[index],
          style: packageStyle[index],
          monsterName: monsterName[index],
          monsterAmount: monsterAmount[index],
          landName: landName[index],
          landAmount: landAmount[index],
          itemName: itemName[index],
          itemAmount: itemAmount[index],
        }
        return obj
      })
      dispatch({
        type: "SET_PACKAGEINDEX_LIST",
        packageIndexList: packageIndex,
      })

      dispatch({
        type: "SET_PACKAGE_LIST",
        packageList,
      })
    } catch (error) {}
  }, [])

  const fetchBUSDBalanceToken = useCallback(async () => {
    try {
      const _token = Config.BUSD_ADDR
      const balance = await getBalanceToken(_token)
      dispatch({
        type: "SET_BUSD_BALANCE",
        busd_balance: balance,
      })
    } catch (error) {
      console.log("BUSD")
    }
  }, [])

  const approveTokenLaunchpad = async (index) => {
    toastWaiting()
    dispatch({
      type: "SET_LOADING",
      loading: true,
      index,
    })

    try {
      const approve = await approveToken(
        Config.BUSD_ADDR,
        Config.LAUNCHPAD_ADDR
      )

      if (approve) {
        toastSuccess()
        dispatch({
          type: "SET_LOADING",
          loading: false,
          index,
        })
        allowanceTokenLaunchpad()
      }
    } catch (error) {
      dispatch({
        type: "SET_LOADING",
        loading: false,
        index,
      })
    }
  }

  const allowanceTokenLaunchpad = useCallback(async () => {
    try {
      const allowance = await allowanceToken(
        Config.BUSD_ADDR,
        Config.LAUNCHPAD_ADDR
      )

      dispatch({
        type: "SET_ALLOWANCE",
        allowance,
      })
    } catch (error) {
      console.log("allowance")
    }
  }, [])

  const selectPackage = (value) => {
    dispatch({
      type: "SET_AMOUNT",
      packgageSelected: value,
    })
  }

  const buyPackages = async (index) => {
    toastWaiting()
    dispatch({
      type: "SET_LOADING",
      loading: true,
      index,
    })

    try {
      const status = await buyPackage(selectType, packgageSelected)
      if (status) {
        toastSuccess()

        dispatch({
          type: "SET_LOADING",
          loading: false,
          index,
        })
      }
    } catch (error) {
      console.log(error)
      toastDanger(error)
      dispatch({
        type: "SET_LOADING",
        loading: false,
        index,
      })
    }
    location.href = `/token-lock`
  }

  useEffect(() => {
    fetchSaleTypeList()
  }, [fetchSaleTypeList])

  useEffect(() => {
    console.log(_totalSupply.length)
    if (_totalSupply.length <= 0) {
      getTotalSupply()
      console.log("text:", _totalSupply)
    }
  })

  useEffect(() => {
    fetchPackage()
  }, [])

  useEffect(() => {
    fetchBUSDBalanceToken()
  }, [fetchBUSDBalanceToken])

  useEffect(() => {
    allowanceTokenLaunchpad()
  }, [])

  return (
    <main className="main-container">
      <div className="container">
        <h2 className="h2-title mx-auto text-center">
        Seed<span>Round</span>
        </h2>
        <div className="card-privatesale">
          <div className="tooltip-box">
            <p className="text-tooltile">
              $Dragon Moon Stone(DMS) Seed Round DMS-locked for 6
              months. Starting the day the game is launched.
            </p>
            <p className="text-tooldesc">
              The item, land, will be received immediately when the game opens.{" "}
            </p>
          </div>

          <div className="pack-list">
            <ul className="choose-pack">
              {packageList.length > 0 &&
                packageList.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={_totalSupply[index] > 0 ? "" : "disable"}
                    >
                      <div className={`item-info ${item.style}`}>
                        <div className="item-info-totalSupply">
                          {_totalSupply.length !== 0
                            ? _totalSupply[index]
                            : item.totalSupply}{" "}
                          <span className="ml-2">pcs</span>
                        </div>
                        <div className="item-info-name">{item.packageName}</div>
                        <div className="item-info-desc">
                          {item.DMSAmount} DMS Monster {item.monsterName} x{" "}
                          {item.monsterAmount} Land {item.landName} x{" "}
                          {item.landAmount} Item {item.itemName} x{" "}
                          {item.itemAmount}
                        </div>
                      </div>
                      <div className="item-radio">
                        <input
                          id={item.style}
                          value={item.style}
                          name="pack"
                          type="radio"
                          onChange={(e) => {
                            selectPackage(index)
                          }}
                        />
                        <label htmlFor={item.style}>
                          {item.BUSDAmount} BUSD
                        </label>
                      </div>
                    </li>
                  )
                })}
              <li className="cf-buy">
                <div className="item-info confirm-order">
                  {parseFloat(allowance) <= 0 ? (
                    <ButtonState
                      classStyle={`btn-confirm-buy`}
                      text={"APPROVE BUSD"}
                      loading={index === "APPROVE" && loading === true}
                      disable={parseFloat(allowance) > 0}
                      onFunction={() => approveTokenLaunchpad("APPROVE")}
                    />
                  ) : (
                    <ButtonState
                      classStyle={`btn-confirm-buy`}
                      text={"BUY PACKAGE"}
                      loading={index === "BUY" && loading === true}
                      disable={typeof packgageSelected === "undefined"}
                      onFunction={() => buyPackages("BUY")}
                    />
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className="logo-ps">
            <img className="w-100" src="logo.webp" />
          </div>
          <div className="char-guild">
            <img className="w-100" src="char-guild.webp" />
          </div>
        </div>
      </div>
    </main>
  )
}
export default Privatesale
