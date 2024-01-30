import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import numeral from "numeral";

dayjs.extend(localizedFormat);
dayjs.extend(duration);
import { useState, useReducer, useCallback, useEffect, useRef } from "react";
import ButtonState from "../../components/utilities/button-state";

import Modal from "../../components/utilities/modal-md.js";
import {
  toastDanger,
  toastSuccess,
  toastWaiting,
} from "../../components/utilities/toast";
import Config from "../../config";
import {
  calculateReward,
  getPeriodTimeList,
  getStakeListByOwner,
  stakeTokenLaunchpad,
  unstakeTokenLaunchpad,
} from "../../utils/contract/stake";
import {
  allowanceToken,
  approveToken,
  getBalanceToken,
} from "../../utils/contract/token";

const resetState = {
  select_period: 300,
  deep_balance: 0,
  amount: 0,
  rewards: 0,
  allowance: 0,
};

const initialState = {
  select_period: 300,
  stake_list: [],
  period_time: [],
  deep_balance: 0,
  amount: 0,
  rewards: 0,
  loading: false,
  index: "",
  allowance: 0,
  loadingList: {
    status: false,
    index: 0,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PERIOD_TIME":
      return {
        ...state,
        period_time: action.period_time,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
        index: action.index,
      };
    case "SET_LOADING_LIST":
      return {
        ...state,
        loadingList: action.loadingList,
      };
    case "SET_ALLOWANCE":
      return {
        ...state,
        allowance: action.allowance,
      };
    case "SET_DEEP_BALANCE":
      return {
        ...state,
        deep_balance: action.deep_balance,
      };
    case "SET_AMOUNT":
      return {
        ...state,
        amount: action.amount,
      };
    case "SET_SELECT_PERIOD_TIME":
      return {
        ...state,
        select_period: action.select_period,
      };
    case "SET_STAKE_LIST":
      return {
        ...state,
        stake_list: action.stake_list,
      };
    case "SET_REWARD":
      return {
        ...state,
        rewards: action.rewards,
      };
    case "RESET_STATE":
      return resetState;
    default:
      throw new Error();
  }
};

const StakePage = () => {
  const maxBalance = useRef(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    period_time,
    deep_balance,
    select_period,
    amount,
    stake_list,
    rewards,
    index,
    loading,
    allowance,
    loadingList,
  } = state;

  const [showModal, setShowModal] = useState(false);

  const fetchPeriodTimeList = useCallback(async () => {
    const period_time = await getPeriodTimeList();

    dispatch({
      type: "SET_PERIOD_TIME",
      period_time,
    });
  }, []);

  const fetchDEEPBalanceToken = useCallback(async () => {
    const _token = Config.TOKEN_ADDR;
    const balance = await getBalanceToken(_token);
    dispatch({
      type: "SET_DEEP_BALANCE",
      deep_balance: balance,
    });
  }, []);

  const fetchStakeList = useCallback(async () => {
    const stakeList = await getStakeListByOwner();
    const _stake_list = stakeList.filter((item) => item.isLocked === true);

    dispatch({
      type: "SET_STAKE_LIST",
      stake_list: _stake_list,
    });
  }, []);

  const setTokenAmount = async (value = 0) => {
    dispatch({
      type: "SET_AMOUNT",
      amount: value,
    });

    const rewards = await calculateReward(value, select_period);

    dispatch({
      type: "SET_REWARD",
      rewards,
    });
  };

  const setMaxBalance = async () => {
    maxBalance.current.value = deep_balance;

    setTokenAmount(deep_balance);
  };

  const setSelectPeriod = async (item) => {
    dispatch({
      type: "SET_SELECT_PERIOD_TIME",
      select_period: item,
    });

    const rewards = await calculateReward(amount, item);

    dispatch({
      type: "SET_REWARD",
      rewards,
    });
  };

  const approveTokenLaunchpad = async (index) => {
    toastWaiting();
    dispatch({
      type: "SET_LOADING",
      loading: true,
      index,
    });

    try {
      const approve = await approveToken(Config.TOKEN_ADDR, Config.STAKE_ADDR);
      if (approve) {
        toastSuccess();
        dispatch({
          type: "SET_LOADING",
          loading: false,
          index,
        });
        allowanceTokenLaunchpad();
      }
    } catch (error) {
      toastDanger(error);
      dispatch({
        type: "SET_LOADING",
        loading: false,
        index,
      });
    }
  };

  const allowanceTokenLaunchpad = useCallback(async () => {
    const allowance = await allowanceToken(
      Config.TOKEN_ADDR,
      Config.STAKE_ADDR
    );

    dispatch({
      type: "SET_ALLOWANCE",
      allowance,
    });
  }, []);

  const stakeToken = async (index) => {
    toastWaiting();
    dispatch({
      type: "SET_LOADING",
      loading: true,
      index,
    });
    try {
      const status = await stakeTokenLaunchpad(amount, select_period);
      if (status) {
        toastSuccess();
        dispatch({
          type: "SET_LOADING",
          loading: false,
          index,
        });
        fetchDEEPBalanceToken();
        fetchStakeList();
        openStakeModal(false);
      }
    } catch (error) {
      toastDanger(error);
      dispatch({
        type: "SET_LOADING",
        loading: false,
        index,
      });
    }
  };

  const unstakeToken = async (stakeId, index) => {
    toastWaiting();
    dispatch({
      type: "SET_LOADING_LIST",
      loadingList: {
        status: true,
        index_token: index,
      },
    });
    try {
      const status = await unstakeTokenLaunchpad(stakeId);
      if (status) {
        toastSuccess();
        dispatch({
          type: "SET_LOADING_LIST",
          loadingList: {
            status: false,
            index_token: index,
          },
        });
        fetchStakeList();
      }
    } catch (error) {
      toastDanger(error);
      dispatch({
        type: "SET_LOADING_LIST",
        loadingList: {
          status: false,
          index_token: index,
        },
      });
    }
  };

  useEffect(() => {
    fetchStakeList();
  }, []);

  useEffect(() => {
    fetchPeriodTimeList();
  }, []);

  useEffect(() => {
    fetchDEEPBalanceToken();
  }, [fetchDEEPBalanceToken]);

  useEffect(() => {
    allowanceTokenLaunchpad();
  }, []);

  const openStakeModal = (state) => {
    setShowModal(state);
    dispatch({
      type: "SET_REWARD",
      rewards: 0,
    });
    dispatch({
      type: "SET_SELECT_PERIOD_TIME",
      select_period: 300,
    });
  };

  return (
    <>
      <main>
        <div className="container">
          <div className="py-5 my-5 flex-grow-1">
            <div className="mx-auto">
              <button
                className="btn btn-primary mb-3"
                onClick={() => openStakeModal(true)}
              >
                Stake DEEP
              </button>

              <div className="card-table">
                <table className="table color-white">
                  <thead>
                    <tr>
                      <th>Token Stake <br></br>(DEEP)</th>
                      <th>Est. APY</th>
                      <th>Start Date</th>
                      <th>Duration<br></br>(minutes)</th>
                      <th>End Date</th>
                      <th>Rewards<br></br>(DEEP)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stake_list.map((item, index) => {
                      return (
                        <tr className="mt-4" key={index}>
                          <td data-label="TOKEN STAKE (DEEP)">
                            {numeral(formatEther(item.amounts)).format("0,0.00")}
                          </td>
                          <td data-label="EST. APY">{formatUnits(item.roi, "wei") / 100}</td>
                          <td data-label="START DATE">
                            {dayjs(
                              formatUnits(item.startTime, "wei") * 1000
                            ).format("llll")}
                          </td>
                          <td data-label="DURATION (MINUTES)">{formatUnits(item.month, "wei") / 60}</td>
                          <td data-label="END DATE">
                            {dayjs(
                              formatUnits(item.endTime, "wei") * 1000
                            ).format("llll")}
                          </td>
                          <td data-label="Rewards (DEEP)">
                            {numeral(formatEther(item.rewards)).format("0,0.00")}
                          </td>
                          <td>
                            <ButtonState
                              classStyle={`${
                                dayjs().unix() < item.endTime
                                  ? "btn-red"
                                  : "btn-blue"
                              }`}
                              disable={dayjs().unix() < item.endTime}
                              loading={
                                loadingList.status === true &&
                                loadingList.index_token === index
                              }
                              onFunction={() =>
                                unstakeToken(
                                  formatUnits(item.stakeId, "wei"),
                                  index
                                )
                              }
                              text={"UNSTAKE"}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal
        onClose={() => openStakeModal(false)}
        show={showModal}
        title={"DEEP Staking"}
      >
        <div className="flex">
          <div className="mt-2">
            <label className="form-label font-s-14 font-w-700 color-black">
              Durations (Minutes)
            </label>
            <div className="d-flex justify-content-between mb-3 duration">
              {period_time.map((item, index) => {
                return (
                  <button
                    key={index}
                    type="submit"
                    className={`btn btn-duration ${
                      select_period === formatUnits(item, "wei") ? "active" : ""
                    }`}
                    onClick={() => setSelectPeriod(formatUnits(item, "wei"))}
                  >
                    {formatUnits(item, "wei") / 60}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <div className="d-flex">
                <img
                  src="deep-coin.webp"
                  alt="deep-coin.webp"
                  width={25}
                  height={25}
                />
                <div className="align-self-center font-w-700 pd-l-5 font-darkblue">
                  DEEP
                </div>
              </div>
              <span className="font-secondary align-self-center">
                Balance: {deep_balance}
              </span>
            </div>
            <div className="d-flex justify-content-between input-custom">
              <input
                type="number"
                ref={maxBalance}
                className="form-control "
                defaultValue={0}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    e.target.value = 0;
                  } else {
                    setTokenAmount(e.target.value);
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
          <div>
            <label className="form-label font-s-14 font-w-700 color-black">
              Summary
            </label>

            <div className="d-flex">
              <div className="d-flex flex-column mg-r-10">
                <div className="circle"></div>
                <div className="line active mx-auto"></div>
              </div>
              <div className="d-flex flex-column w-100">
                <div className="d-flex w-100 justify-content-between">
                  <div className="color-secondary">State Date</div>
                  <div className="text-end">
                    {dayjs(new Date()).format("llll")}
                  </div>
                </div>
                <div className="d-flex w-100 justify-content-between align-items-center h-100">
                  <div>Interest Period</div>
                  <div className="text-end">{select_period / 60} Minutes</div>
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="d-flex flex-column mg-r-10">
                <div className="circle"></div>
                <div className="line mx-auto"></div>
              </div>
              <div className="d-flex w-100 justify-content-between">
                <div className="color-secondary">Interest end Date</div>
                <div className="text-end">
                  {dayjs(new Date())
                    .add(dayjs.duration({ seconds: select_period }))
                    .format("llll")}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <div className="d-flex">
                  <div className="align-self-center font-w-700 pd-l-5 font-darkblue">
                    Reward
                  </div>
                </div>
                <span className="font-secondary align-self-center">
                  {formatEther(rewards)} DEEP
                </span>
              </div>
            </div>

            {/* <div class="form-check my-3">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label
                class="form-check-label font-s-14 font-w-700 color-black"
                for="flexCheckDefault"
              >
                I have read I agree to Deeplogo Staking Service Agreement
              </label>
            </div> */}
          </div>
          <div className="d-flex justify-content-center">
            <ButtonState
              classStyle={"btn-blue mg-r-10"}
              text={"APPROVE STAKE"}
              loading={index === "APPROVE" && loading === true}
              disable={parseFloat(allowance) > 0}
              onFunction={() => approveTokenLaunchpad("APPROVE")}
            />

            <ButtonState
              classStyle={`btn-red`}
              text={"STAKE"}
              loading={index === "STAKE" && loading === true}
              disable={parseFloat(allowance) <= 0}
              onFunction={() => stakeToken("STAKE")}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default StakePage;
