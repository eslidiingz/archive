import numeral from "numeral"
import {formatEther, formatUnits} from "ethers/lib/utils"
import {useCallback, useEffect, useReducer} from "react"
import {
  getLengthTokenLock,
  getTokenLockByOwner,
  unlockTokenByOwner,
} from "../../utils/contract/locker"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import ButtonState from "../../components/utilities/button-state"
import {
  toastDanger,
  toastSuccess,
  toastWaiting,
} from "../../components/utilities/toast"
dayjs.extend(localizedFormat)

const initialState = {
  lockList: [],
  loading: {
    status: false,
    index: "",
  },
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCK_LIST":
      return {
        ...state,
        lockList: action.lockList,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      }
    case "RESET_STATE":
      return initialState
    default:
      throw new Error()
  }
}

const TokenLockPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {lockList, loading} = state

  const fetchTokenLockByOwner = useCallback(async () => {
    try {
      const tokenLength = await getLengthTokenLock()
      let tokenLockList = []
      for (let index = 0; index < tokenLength; index++) {
        tokenLockList[index] = await getTokenLockByOwner(index)
      }

      console.log(tokenLockList)
      dispatch({
        type: "SET_LOCK_LIST",
        lockList: tokenLockList,
      })
    } catch (error) {}
  }, [])

  const unlockToken = async (index, expiration, index_token) => {
    toastWaiting()
    dispatch({
      type: "SET_LOADING",
      loading: {
        status: true,
        index_token,
      },
    })
    try {
      const status = await unlockTokenByOwner(index, expiration)
      if (status) {
        toastSuccess()
        dispatch({
          type: "SET_LOADING",
          loading: {
            status: false,
            index_token,
          },
        })

        fetchTokenLockByOwner()
      }
    } catch (error) {
      toastDanger(error)
      dispatch({
        type: "SET_LOADING",
        loading: {
          status: false,
          index_token,
        },
      })
    }
  }

  useEffect(() => {
    fetchTokenLockByOwner()
  }, [])

  return (
    <main className="main-container">
      <div className="container">
        <h2 className="h2-title mx-auto text-center">
          Token<span className="text-green">Lock</span>
        </h2>

        <div className="mb-5 flex-grow-1">
          <div className="mx-auto">
            <div className="card-table">
              <table className="table color-white">
                <thead>
                  <tr>
                    <th>Total Locked</th>
                    <th>Round</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lockList.map((item, index) => {
                    return item.claimAmount.map((status, count) => {
                      return count === 0 ? (
                        <tr className="mt-4" key={count}>
                          <td
                            data-label="Total Locked"
                            className="topicclaim"
                            rowSpan={item.claimAmount.length}
                          >
                            {numeral(formatEther(item.totalAmount)).format(
                              "0,0.00"
                            )}
                          </td>
                          <td className="round" data-label="ROUND">
                            {dayjs(
                              formatUnits(item.expiration[count], "wei") * 1000
                            ).format("llll")}
                          </td>
                          <td className="pb-4">
                            {item.claimStatus[count] === true ? (
                              <span className="text-success">
                                Unlock Success{" "}
                                {numeral(
                                  formatEther(item.claimAmount[count])
                                ).format("0,0.00")}{" "}
                                <i className="fa-solid fa-check"></i>
                              </span>
                            ) : (
                              <ButtonState
                                classStyle={"btn btn-primary"}
                                disable={
                                  item.claimStatus[count] === true ||
                                  dayjs().unix() < item.expiration[count]
                                }
                                onFunction={() =>
                                  unlockToken(
                                    index,
                                    item.expiration[count],
                                    `${index}-${count}`
                                  )
                                }
                                loading={
                                  loading.status === true &&
                                  loading.index_token === `${index}-${count}`
                                }
                                text={`Claim ${numeral(
                                  formatEther(item.claimAmount[count])
                                ).format("0,0.00")}`}
                              />
                            )}
                          </td>
                        </tr>
                      ) : (
                        <tr key={count}>
                          <td className="round" data-label="ROUND">
                            {dayjs(
                              formatUnits(item.expiration[count], "wei") * 1000
                            ).format("llll")}
                          </td>
                          <td>
                            {item.claimStatus[count] === true ? (
                              <span className="text-success">
                                Unlock Success{" "}
                                {numeral(
                                  formatEther(item.claimAmount[count])
                                ).format("0,0.00")}{" "}
                                <i className="fa-solid fa-check"></i>
                              </span>
                            ) : (
                              <ButtonState
                                classStyle={"btn btn-primary"}
                                disable={
                                  item.claimStatus[count] === true ||
                                  dayjs().unix() < item.expiration[count]
                                }
                                onFunction={() =>
                                  unlockToken(
                                    index,
                                    item.expiration[count],
                                    `${index}-${count}`
                                  )
                                }
                                loading={
                                  loading.status === true &&
                                  loading.index_token === `${index}-${count}`
                                }
                                text={`Claim ${numeral(
                                  formatEther(item.claimAmount[count])
                                ).format("0,0.00")}`}
                              />
                            )}
                          </td>
                        </tr>
                      )
                    })
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default TokenLockPage
