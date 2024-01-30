import { useEffect, useCallback, useReducer } from "react";
import ButtonState from "../../components/utilities/button-state";
import Config from "../../config";
import {
  getRateLaunchpad,
  sellLaunchpad,
} from "../../utils/contract/launchpad";
import {
  allowanceToken,
  approveToken,
  getBalanceToken,
} from "../../utils/contract/token";

const initialState = {
  rate: 0,
  allowance: 0,
  total: 0,
  busd_balance: 0,
  deep_balance: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BUSD_BALANCE":
      return {
        ...state,
        busd_balance: action.busd_balance,
      };
    case "SET_DEEP_BALANCE":
      return {
        ...state,
        deep_balance: action.deep_balance,
      };
    case "SET_RATE":
      return {
        ...state,
        rate: action.rate,
      };
    case "SET_ALLOWANCE":
      return {
        ...state,
        allowance: action.allowance,
      };
    case "SET_AMOUNT":
      return {
        ...state,
        amount: action.amount,
      };
    case "SET_TOTAL_AMOUNT":
      return {
        ...state,
        total: action.total,
      };
    case "RESET_STATE":
      return initialState;
    default:
      throw new Error();
  }
};

const LaunchpadSellPanel = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { rate, allowance, amount, busd_balance, deep_balance, total } = state;

  const fetchDEEPBalanceToken = useCallback(async () => {
    const _token = Config.TOKEN_ADDR;
    const balance = await getBalanceToken(_token);
    dispatch({
      type: "SET_DEEP_BALANCE",
      deep_balance: balance,
    });
  }, []);

  const fetchBUSDBalanceToken = useCallback(async () => {
    const _token = Config.BUSD_ADDR;
    const balance = await getBalanceToken(_token);
    dispatch({
      type: "SET_BUSD_BALANCE",
      busd_balance: balance,
    });
  }, []);

  const fetchRateLaunchpad = useCallback(async () => {
    const _rate = await getRateLaunchpad();
    dispatch({
      type: "SET_RATE",
      rate: _rate,
    });
  }, []);

  const approveTokenLaunchpad = useCallback(async () => {
    const _approve = await approveToken(
      Config.TOKEN_ADDR,
      Config.LAUNCHPAD_ADDR
    );
  }, []);

  const allowanceTokenLaunchpad = useCallback(async () => {
    const _allowance = await allowanceToken(
      Config.BUSD_ADDR,
      Config.LAUNCHPAD_ADDR
    );

    dispatch({
      type: "SET_ALLOWANCE",
      allowance: _allowance,
    });
  }, []);

  const setTokenAmount = (value = 0) => {
    var total = value / rate;
    if (isNaN(total)) {
      total = 0;
    }

    console.log(total);

    dispatch({
      type: "SET_AMOUNT",
      amount: value,
    });

    dispatch({
      type: "SET_TOTAL_AMOUNT",
      total,
    });
  };

  const sellTokenLaunchpad = async () => {
    const status = await sellLaunchpad(amount);

    if (status) {
      fetchBUSDBalanceToken();
      fetchDEEPBalanceToken();
    }
  };

  useEffect(() => {
    setTokenAmount(amount);
  }, [amount]);

  useEffect(() => {
    fetchDEEPBalanceToken();
  }, [fetchDEEPBalanceToken]);

  useEffect(() => {
    fetchBUSDBalanceToken();
  }, [fetchBUSDBalanceToken]);

  useEffect(() => {
    fetchRateLaunchpad();
  }, [fetchRateLaunchpad]);

  useEffect(() => {
    allowanceTokenLaunchpad();
  }, []);

  return (
    <div className="col-12 mt-3">
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <div className="d-flex">
            <img src="deep-coin.webp" alt="deep-coin.webp" width={25} height={25} />
            <div className="align-self-center font-w-700 pd-l-5 color-black">DEEP</div>
          </div>
          <span className="font-secondary align-self-center">Balance: {deep_balance}</span>
        </div>
        <div className="d-flex justify-content-between input-custom">
          <input
            type="number"
            className="form-control"
            defaultValue={0}
            onChange={(e) => {
              if (e.target.value < 0) {
                e.target.value = 0;
              } else {
                setTokenAmount(e.target.value);
              }
            }}
          />
          <div className="align-self-center pd-l-5 font-input">Max</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <div className="d-flex">
            <img src="busd.webp" alt="busd" width={30} height={30} />
            <div className="align-self-center font-w-700 pd-l-5 color-black">BUSD</div>
          </div>
          <span className="font-secondary align-self-center">Balance: {busd_balance}</span>
        </div>
        <div className="d-flex justify-content-between input-custom">
          <input type="number" className="form-control" readOnly value={total} />
        </div>
      </div>

      <div className="text-left">
        <span className="font-secondary">Rate: {rate} DEEP = 1 BUSD </span>
      </div>

      <div className="mx-auto mt-4">
        <div className="d-flex justify-content-center">
          <ButtonState
            classStyle={"btn-blue mg-r-10"}
            text={"APPROVE DEEP"}
            loading={false}
            onFunction={() => approveTokenLaunchpad()}
          />
          <ButtonState
            classStyle={"btn-red"}
            text={"SELL DEEP"}
            loading={false}
            onFunction={() => sellTokenLaunchpad()}
          />
        </div>
      </div>
    </div>
  );
};
export default LaunchpadSellPanel;
