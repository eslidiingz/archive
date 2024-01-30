import { AES } from "crypto-js";
import { utils, BigNumber, ethers } from "ethers";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { useCallback } from "react";
import { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import useSWR from "swr";
import Config from "../../configs/config";
import { useWalletContext } from "../../context/wallet";
import { encrypt } from "../../utils/cryptography";
import { numberFormat } from "../../utils/misc";
import { smartContact, web3Provider } from "../../utils/providers/connector";
import ButtonState from "../buttons/ButtonLoading";

const initialState = {
  platform_fee: 0,
  is_allowance: false,
  current_network: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PLATFORM_FEE":
      return {
        ...state,
        platform_fee: action.platform_fee,
      };
    case "SET_IS_ALLOWANCE":
      return {
        ...state,
        is_allowance: action.is_allowance,
      };
    case "SET_CURRENT_NETWORK":
      return {
        ...state,
        current_network: action.current_network,
      };
    case "RESET_STATE":
      return initialState;
    default:
      throw new Error();
  }
};

const BridgeSwapCard = () => {
  const { wallet } = useWalletContext();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { is_allowance, current_network, platform_fee } = state;
  const [amountBusd, setAmountBusd] = useState(0);
  const [amountOm, setAmountOm] = useState(0);
  const [loadingState, setLoadingState] = useState({
    index: "",
    loading: false,
  });

  const [poolBalance, setPoolBalance] = useState(0);
  const [busd_balance, setBusdBalance] = useState(0);
  const [om_balance, setOmBalance] = useState(0);

  const urlFetcher = `/api/oracle`;
  const oracleFetcher = async () => {
    const data = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        busdAmount: 1,
      }),
    };
    const amount = await (await fetch("/api/oracle", data)).json();

    return amount;
  };
  const { data: oracle_amount, error } = useSWR(urlFetcher, oracleFetcher);

  if (error) {
    console.log(
      "🚀 ~ file: BridgeSwap.jsx ~ line 65 ~ BridgeSwapCard ~ error",
      error
    );
  }

  const fetchPoolBalance = async () => {
    try {
      const providers = web3Provider(null, true);
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 88 ~ fetchPoolBalance ~ providers",
        providers
      );
      const poolBalance = formatEther(
        await providers.getBalance(Config.BRIDGE_OM_CA)
      );

      setPoolBalance(poolBalance);
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 97 ~ fetchPoolBalance ~ error",
        error
      );
    }
  };

  const fetchTokenAmount = async () => {
    if (!wallet) return;
    try {
      const busdContract = smartContact(
        Config.BSC_BUSD_CA,
        Config.ERC20_ABI,
        true,
        undefined,
        Config.BSC_RPC
      );

      const busdBalance = formatEther(await busdContract.balanceOf(wallet));

      const providers = web3Provider(null, true);

      const omBalance = formatEther(await providers.getBalance(wallet));

      setBusdBalance(busdBalance);
      setOmBalance(omBalance);
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 33 ~ fetchTokenAmount ~ error",
        error
      );
    }
  };

  const fetchAmountToken = async (value) => {
    try {
      const _amount = value - (value * platform_fee) / 100;
      setAmountOm(oracle_amount * _amount);
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 147 ~ fetchAmountToken ~ _amount",
        _amount
      );
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 147 ~ fetchAmountToken ~ oracle_amount",
        oracle_amount
      );
      setAmountBusd(value);
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 82 ~ fetchAmountToken ~ error",
        error
      );
    }
  };

  const fetchAllowance = async () => {
    try {
      const busdContract = smartContact(
        Config.BSC_BUSD_CA,
        Config.ERC20_ABI,
        true,
        undefined,
        Config.BSC_RPC
      );
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 131 ~ fetchAllowance ~ busdContract",
        busdContract
      );

      const allowance = await busdContract.allowance(
        wallet,
        Config.BRIDGE_BSC_CA
      );

      const isAllowance = BigNumber.from(allowance).gt(BigNumber.from(0));

      dispatch({
        type: "SET_IS_ALLOWANCE",
        is_allowance: isAllowance,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 134 ~ fetchAllowance ~ error",
        error
      );
    }
  };

  const approveBridge = async () => {
    try {
      setLoadingState({
        index: "APPROVE",
        loading: true,
      });
      const busdContract = smartContact(
        Config.BSC_BUSD_CA,
        Config.ERC20_ABI,
        false,
        undefined,
        Config.BSC_RPC
      );

      const transaction = await busdContract.approve(
        Config.BRIDGE_BSC_CA,
        Config.UNLIMIT_ALLOWANCE
      );

      const tx = await transaction.wait(5);
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 165 ~ approveBridge ~ tx",
        tx
      );
      setLoadingState({
        index: "APPROVE",
        loading: false,
      });

      fetchAllowance();
    } catch (error) {
      setLoadingState({
        index: "APPROVE",
        loading: false,
      });
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 152 ~ approveBridge ~ error",
        error
      );
    }
  };

  const fetchChain = async () => {
    try {
      const providers = web3Provider();

      const current_network = (await providers.getNetwork()).chainId;

      dispatch({
        type: "SET_CURRENT_NETWORK",
        current_network,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 201 ~ fetchChain ~ error",
        error
      );
    }
  };

  const triggerSwitchChain = async () => {
    setLoadingState({
      index: "CHIAN",
      loading: true,
    });
    try {
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: utils.hexValue(Config.BSC_CHAIN_ID).toString() }],
        })

        .then((res) => {
          location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ethers.utils.hexValue(Config.BSC_CHAIN_ID).toString(),
                chainName: "Binance Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: [Config.BSC_RPC],
                blockExplorerUrls: [Config.BSC_EXPLORER],
              },
            ],
          })

          .then((res) => {
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const confirmBridge = async () => {
    setLoadingState({
      index: "CONFIRM",
      loading: true,
    });
    try {
      const bridgeContract = smartContact(
        Config.BRIDGE_BSC_CA,
        Config.BRIDGE_ABI,
        false,
        undefined,
        Config.BSC_RPC
      );

      const transaction = await bridgeContract.bridge_lock(
        parseEther(amountBusd.toString()),
        parseEther(amountOm.toString()),
        Config.BSC_BUSD_CA
      );

      const tx = await transaction.wait(5);

      const { args } = tx.events.find((event) => event.event === "BridgeEvent");

      const data = { ...args };
      data.type = args._type;
      data.owner = args._owner;
      data.transactionHash = tx.transactionHash;
      data.amountIn = formatEther(args._amountIn);
      data.amountOut = formatEther(args._amountOut);

      delete data[0];
      delete data[1];
      delete data[2];
      delete data[3];

      delete data["_amountIn"];
      delete data["_amountOut"];
      delete data["_owner"];
      delete data["_type"];

      const message = encrypt(JSON.stringify(data));
      const body = {
        chain: "bsc",
        message,
      };

      const result = await fetch(`/api/bridge`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (result.status === 200) {
        const _result = await result.json();

        Swal.fire("Success", "Swap successfully", "success");

        await fetchPoolBalance();
        await fetchTokenAmount();

        setLoadingState({
          index: "CONFIRM",
          loading: false,
        });
      } else {
        Swal.fire("Error", "Transaction Fail", "error");
        setLoadingState({
          index: "CONFIRM",
          loading: false,
        });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 302 ~ confirmBridge ~ error",
        error
      );

      Swal.fire("Error", error.toString().replace("Error: ", ""), "error");
      setLoadingState({
        index: "CONFIRM",
        loading: false,
      });
    }
  };

  const fetchPlatformFee = async () => {
    try {
      const bridgeContract = smartContact(
        Config.BRIDGE_BSC_CA,
        Config.BRIDGE_ABI,
        false,
        undefined,
        Config.BSC_RPC
      );

      const platformFee = formatUnits(
        await bridgeContract.platformFee(),
        "wei"
      );
      dispatch({
        type: "SET_PLATFORM_FEE",
        platform_fee: platformFee / 100,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: BridgeSwap.jsx ~ line 399 ~ fetchPlatformFee ~ error",
        error
      );
    }
  };

  useEffect(() => {
    fetchAmountToken(amountBusd);
  }, [oracle_amount]);

  useEffect(() => {
    fetchTokenAmount();
  }, [fetchTokenAmount]);

  useEffect(() => {
    fetchPlatformFee();
    fetchPoolBalance();
    fetchChain();
    fetchAllowance();
  }, []);

  return (
    <>
      <hr className="hr-lin my-4" />
      <div className="t-box">
        <div className="d-flex justify-content-between align-items-end">
          <p className="text-white">From</p>
          <p className="text-white">Balance : {busd_balance}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="w-100">
            <input
              type="number"
              className="form-control input-box-bridge ci-purplepink"
              placeholder="Please enter value"
              value={amountBusd}
              defaultValue={0}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0) {
                  fetchAmountToken(value);
                } else {
                  fetchAmountToken(0);
                }
              }}
            />
          </div>

          <div className="w-100" align="right">
            <div className="d-flex justify-content-end align-items-center">
              <p
                className="ci-purplepink cursor-pointer me-3"
                onClick={() => {
                  fetchAmountToken(busd_balance);
                }}
              >
                MAX{" "}
              </p>
              <img
                src="/assets/swaple/icon-binance.png"
                className="pb-1 me-2"
              />
              <p className="text-white">BUSD</p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center cursor-pointer">
        <img
          src="/assets/image/archiverse/icon/icon-arrowdown.svg"
          className="img-arrowdown"
        />
      </div>
      <div className="t-box">
        <div className="d-flex justify-content-between">
          <p className="text-white">To (estimated)</p>
          <p className="text-white">Balance : {om_balance}</p>
        </div>

        <div className="d-flex justify-content-between align-items-end mt-3">
          <div className="w-100">
            <p className="ci-purplepink input-box-bridge">{amountOm}</p>
          </div>
          <div className="w-100" align="right">
            <div className="d-flex justify-content-end align-items-center">
              <img
                src="/assets/swaple/icon-omcoin.webp"
                className="pb-1 me-2"
              />
              <p className="text-white">OM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="d-flex justify-content-between">
          <p className="">Price</p>
          <div className="d-flex justify-content-between">
            <p className="">1 BUSD &cong; {oracle_amount} OM</p>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <p className="">Fee Amount ({platform_fee}%)</p>
          <p className="">{(amountBusd * platform_fee) / 100} BUSD</p>
        </div>

        <div className="mt-3">
          {parseFloat(poolBalance) <= parseFloat(amountOm) ? (
            <>
              <ButtonState
                style="col-12 btn btn-secondary"
                text={"POOL NOT ENOUGH"}
                loading={false}
                disabled={false}
              />
            </>
          ) : (
            <>
              {current_network !== Config.BSC_CHAIN_ID ? (
                <ButtonState
                  style="col-12 btn btn-primary"
                  onFunction={() => triggerSwitchChain()}
                  text={"SWITCH TO BINANCE SMART CHAIN"}
                  loading={false}
                  disabled={false}
                />
              ) : (
                <>
                  {is_allowance ? (
                    <ButtonState
                      style="col-12 btn btn-primary"
                      onFunction={() => confirmBridge()}
                      text={"CONFIRM"}
                      loading={
                        loadingState.loading && loadingState.index === "CONFIRM"
                      }
                      disabled={
                        loadingState.loading && loadingState.index === "CONFIRM"
                      }
                    />
                  ) : (
                    <ButtonState
                      style="col-12 btn btn-primary"
                      onFunction={() => approveBridge()}
                      text={"APPROVE"}
                      loading={
                        loadingState.loading && loadingState.index === "APPROVE"
                      }
                      disabled={
                        loadingState.loading && loadingState.index === "APPROVE"
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BridgeSwapCard;
