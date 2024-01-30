import {useEffect, useCallback, useReducer, useRef} from "react"
import ButtonState from "../../components/utilities/button-state"
import Config from "../../config"
import {buyLaunchpad, getRateLaunchpad} from "../../utils/contract/launchpad"
import {
  getLengthTokenLock,
  getTokenLockByOwner,
} from "../../utils/contract/locker"
import {getSaleTypeList} from "../../utils/contract/locker"

import {
  allowanceToken,
  approveToken,
  getBalanceToken,
} from "../../utils/contract/token"
import {
  toastDanger,
  toastSuccess,
  toastWaiting,
} from "../../components/utilities/toast"
import {formatEther} from "ethers/lib/utils"
import numeral from "numeral"

const initialState = {
  rate: 0,
  allowance: 0,
  total: 0,
  busd_balance: 0,
  deep_balance: 0,
  saleType: [],
  selectType: "Seed",
  loading: false,
  index: "",
  lockAmount: 0,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SALE_TYPE":
      return {
        ...state,
        saleType: action.saleType,
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
    case "SET_DEEP_BALANCE":
      return {
        ...state,
        deep_balance: action.deep_balance,
      }
    case "SET_RATE":
      return {
        ...state,
        rate: action.rate,
      }
    case "SET_ALLOWANCE":
      return {
        ...state,
        allowance: action.allowance,
      }
    case "SET_AMOUNT":
      return {
        ...state,
        amount: action.amount,
      }
    case "SET_TOTAL_AMOUNT":
      return {
        ...state,
        total: action.total,
      }
    case "SET_LOCK_AMOUNT":
      return {
        ...state,
        lock_amount: action.lock_amount,
      }
    case "RESET_STATE":
      return initialState
    default:
      throw new Error()
  }
}

const LaunchpadBuyPanel = () => {
  const maxBalance = useRef(0)

  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    rate,
    amount,
    busd_balance,
    deep_balance,
    total,
    saleType,
    selectType,
    loading,
    index,
    allowance,
    lock_amount,
  } = state

  const fetchSaleTypeList = useCallback(async () => {
    const saleType = await getSaleTypeList()

    dispatch({
      type: "SET_SALE_TYPE",
      saleType,
    })
  }, [])

  const fetchDEEPBalanceToken = useCallback(async () => {
    const _token = Config.TOKEN_ADDR
    const balance = await getBalanceToken(_token)
    dispatch({
      type: "SET_DEEP_BALANCE",
      deep_balance: balance,
    })
  }, [])

  const fetchBUSDBalanceToken = useCallback(async () => {
    const _token = Config.BUSD_ADDR
    const balance = await getBalanceToken(_token)
    dispatch({
      type: "SET_BUSD_BALANCE",
      busd_balance: balance,
    })
  }, [])

  const fetchRateLaunchpad = useCallback(async () => {
    const _rate = await getRateLaunchpad()
    dispatch({
      type: "SET_RATE",
      rate: _rate,
    })
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
    const allowance = await allowanceToken(
      Config.BUSD_ADDR,
      Config.LAUNCHPAD_ADDR
    )

    dispatch({
      type: "SET_ALLOWANCE",
      allowance,
    })
  }, [])

  const setTokenAmount = (value = 0) => {
    const total = value * rate

    dispatch({
      type: "SET_AMOUNT",
      amount: value,
    })
    dispatch({
      type: "SET_TOTAL_AMOUNT",
      total,
    })
  }

  const setSaleType = (value) => {
    dispatch({
      type: "SET_SELECT_SALE_TYPE",
      selectType: value,
    })
  }

  const buyTokenLaunchpad = async (index) => {
    toastWaiting()
    dispatch({
      type: "SET_LOADING",
      loading: true,
      index,
    })

    try {
      const status = await buyLaunchpad(amount, selectType)

      if (status) {
        fetchBUSDBalanceToken()
        fetchDEEPBalanceToken()
        fetchDEEPLockToken()

        toastSuccess()

        dispatch({
          type: "SET_LOADING",
          loading: false,
          index,
        })
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

  const fetchDEEPLockToken = useCallback(async () => {
    const lockId = await getLengthTokenLock()
    let tokenLockList = []
    for (let index = 0; index < lockId; index++) {
      tokenLockList[index] = await getTokenLockByOwner(index)
    }

    const tokenAmount = tokenLockList.map((item) => {
      return item.claimAmount.map((claim, index) => {
        return item.claimStatus[index] === false
          ? parseFloat(formatEther(item.claimAmount[index]))
          : parseFloat(0)
      })
    })

    const _tokenAmount = [].concat(...tokenAmount)

    const lock_amount = _tokenAmount.reduce(
      (sum, data) => sum + parseFloat(data),
      0
    )

    dispatch({
      type: "SET_LOCK_AMOUNT",
      lock_amount,
    })
  }, [])

  const setMaxBalance = () => {
    maxBalance.current.value = busd_balance
    setTokenAmount(busd_balance)
  }

  useEffect(() => {
    fetchSaleTypeList()
  }, [fetchSaleTypeList])

  useEffect(() => {
    setTokenAmount(amount)
  }, [amount])

  useEffect(() => {
    fetchDEEPBalanceToken()
    fetchDEEPLockToken()
  }, [fetchDEEPBalanceToken, fetchDEEPLockToken])

  useEffect(() => {
    fetchBUSDBalanceToken()
  }, [fetchBUSDBalanceToken])

  useEffect(() => {
    fetchRateLaunchpad()
  }, [fetchRateLaunchpad])

  useEffect(() => {
    allowanceTokenLaunchpad()
  }, [])

  return (
    <div className="col-12 mx-auto mt-3">
      <div className="mb-3">
        <div className="d-flex justify-content-between">
          <span className="font-s-14 font-w-700 color-black mb-2">Type</span>
        </div>

        <div className="input-custom mb-3">
          <select
            className="form-select"
            onChange={(e) => {
              setSaleType(e.target.value)
            }}
          >
            {/* <option value="1">option1</option>
            <option value="2">option2</option>
            <option value="3">option3</option>
            <option value="4">option4</option> */}

            {saleType.map((item) => {
              return (
                <option key={item.saleType} value={item.saleType}>
                  {item.saleType}
                </option>
              )
            })}
          </select>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <div className="d-flex">
              <img src="busd.webp" alt="busd" width={30} height={30} />
              <div className="align-self-center font-w-700 pd-l-5 color-black">
                BUSD
              </div>
            </div>
            <div className="font-secondary align-self-center">
              Balance: {busd_balance}
            </div>
          </div>
          <div className="d-flex justify-content-between input-custom">
            <input
              type="number"
              ref={maxBalance}
              className="form-control"
              defaultValue={0}
              onChange={(e) => {
                if (e.target.value < 0) {
                  e.target.value = 0
                } else {
                  setTokenAmount(e.target.value)
                }
              }}
            />
            <div
              className="align-self-center font-input"
              onClick={() => setMaxBalance()}
            >
              Max
            </div>
          </div>
          {(amount === "" || amount <= 0) && (
            <div className="fs-6 text-danger mt-1">
              Please enter amount greater than 0
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="d-block d-md-flex justify-content-between mb-1">
            <div className="d-flex">
              <img
                src="deep-coin.webp"
                alt="deep-coin.webp"
                width={25}
                height={25}
              />
              <div className="align-self-center font-w-700 pd-l-5 color-black">
                DEEP
              </div>
            </div>
            <span className="d-block d-md-flex font-secondary align-self-center">
              Lock Amount: {numeral(lock_amount).format("0,0.00")}
            </span>
            <span className="font-secondary align-self-center">
              Balance: {deep_balance}
            </span>
          </div>
          <div className="d-flex justify-content-between input-custom">
            <input
              type="number"
              className="form-control"
              readOnly
              value={total}
            />
          </div>
        </div>
        <div className="text-left">
          <span className="font-secondary">Rate: 1 BUSD = {rate} DEEP</span>
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-center">
            <ButtonState
              classStyle={`mg-r-10 btn-blue`}
              text={"APPROVE BUSD"}
              loading={index === "APPROVE" && loading === true}
              disable={parseFloat(allowance) > 0}
              onFunction={() => approveTokenLaunchpad("APPROVE")}
            />

            <ButtonState
              classStyle={`${
                parseFloat(allowance) <= 0 ? "btn-yellow" : "btn-yellow"
              }`}
              text={"BUY DEEP"}
              loading={index === "BUY" && loading === true}
              disable={parseFloat(allowance) <= 0}
              onFunction={() => buyTokenLaunchpad("BUY")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default LaunchpadBuyPanel
