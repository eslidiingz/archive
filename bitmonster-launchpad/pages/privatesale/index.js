import {useEffect, useCallback, useReducer, useRef} from "react"
import ButtonState from "../../components/utilities/button-state"
import {
  toastDanger,
  toastSuccess,
  toastWaiting,
} from "../../components/utilities/toast"
import {formatEther} from "ethers/lib/utils"
import Config from "../../config"
import {getSaleTypeList} from "../../utils/contract/locker"
import {formatUnits, parseUnits} from "ethers/lib/utils"
import {
  packageStyle,
  monsterName,
  monsterAmount,
  landName,
  landAmount,
  itemName,
  itemAmount,
} from "../../utils/lib/package-detail"
import {
  buyPackage,
  getPackageindex,
  getPackages,
} from "../../utils/contract/launchpad"
import {
  allowanceToken,
  approveToken,
  getBalanceToken,
} from "../../utils/contract/token"

const initialState = {
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
        selectType: saleType[2].saleType,
      })
    } catch (error) {}
  }, [])

  const fetchPackage = useCallback(async () => {
    try {
      const Package = await getPackageindex()
      const packageIndexList = Package.map((item) => {
        return formatUnits(item._hex, 0)
      })

      const results = packageIndexList.map(async (item) => {
        let pack = await getPackages(parseInt(item))
        return pack
      })

      const _results = await Promise.all(results)

      console.log(_results)

      const packageList = _results.map((item, index) => {
        let obj = {
          totalSupply: formatUnits(item.totalSupply._hex, 0),
          packageName: item.name,
          DMSAmount: parseFloat(
            formatEther(formatUnits(item.DMSToken._hex, 0))
          ).toLocaleString(),
          Active: item.isActive,
          Exist: item.isExist,
          BUSDAmount: parseFloat(
            formatEther(formatUnits(item.pairToken._hex, 0))
          ).toLocaleString(),
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
        packageIndexList,
      })

      dispatch({
        type: "SET_PACKAGE_LIST",
        packageList,
      })
    } catch (error) {}
  })

  const fetchBUSDBalanceToken = useCallback(async () => {
    try {
      const _token = Config.BUSD_ADDR
      const balance = await getBalanceToken(_token)
      dispatch({
        type: "SET_BUSD_BALANCE",
        busd_balance: balance,
      })
    } catch (error) {}
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
      toastDanger(error)
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
      // toastDanger("error")
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
          Private<span>Sale</span>
        </h2>
        <div className="card-privatesale">
          <div className="tooltip-box">
            <p className="text-tooltile">
              $Dragon Moon Stone(DMS) Token Private Sale Round DMS-locked for 6
              months. Starting the day the game is launched.
            </p>
            <p className="text-tooldesc">
              The item, land, will be received immediately when the game opens.{" "}
            </p>
          </div>
          <div className="pack-list">
            <ul className="choose-pack">
              {packageIndexList.length > 0 &&
                packageList.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={item.totalSupply > 0 ? "" : "disable"}
                    >
                      <div className={`item-info ${item.style}`}>
                        <div className="item-info-totalSupply">
                          {item.totalSupply}
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
            <img className="w-100" src="logo.png" />
          </div>
          <div className="char-guild">
            <img className="w-100" src="char-guild.png" />
          </div>
        </div>
      </div>
    </main>
  )
}
export default Privatesale
