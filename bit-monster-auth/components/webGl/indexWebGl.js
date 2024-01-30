import Unity from "react-unity-webgl";
import { useEffect, useState, useLayoutEffect } from "react";
import { useConfig } from "../../contexts/config";
// import { filterData } from "../utils/data";
import { connectProvider } from "../../utils/provider";
import LoadingPage from "../game/loading-page";
import { Contract } from "ethers";
import axios from "axios";
import { webGlContext } from "../../contexts/WebGlContext";

const contract_game = "0xc98146f1747098c2C8205247AbAa8d70bc7988E9";
import abi_game from "../../public/abi/game_0xc98146f1747098c2C8205247AbAa8d70bc7988E9.json";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

    window.addEventListener("resize", updateSize);

    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

const IndexWebGl = () => {
  const [width, height] = useWindowSize();
  const [progression, setProgression] = useState(0);
  const [valueFarmId, setValueFarmId] = useState();
  const [valueUserLandId, setValueUserLandId] = useState();
  const [valueItemId, setValueItemId] = useState();
  const [valueItemAmount, setValueItemAmount] = useState();

  const { config } = useConfig();

  const { unityContext } = webGlContext();

  const fetchLoadingContext = () => {
    unityContext.setFullscreen(true);
    unityContext.on("progress", (progress) => {
      setProgression(progress * 100);
    });
  };

  useEffect(function () {
    unityContext.on("canvas", (canvas) => {
      canvas.width = width;
      canvas.height = height;
    });

    unityContext.on("Logout", (status) => {
      if (status === false) return null;
      localStorage.removeItem("bitmonster-authorize");
      window.location.reload();
    });

    unityContext.on("syncMonster", async (farmId) => {
      console.log("FARM ID", farmId);
      getSyncMonster(farmId);
    });
    unityContext.on("syncLand", async (userLandId) => {
      getSyncLand(userLandId);
    });
    unityContext.on("syncAsset", async (assetsId, amount) => {
      getSyncAsset(assetsId, amount);
    });
    unityContext.on("syncToken", async (token) => {
      getSyncToken(token);
    });
  }, []);

  const initContract = () => {
    console.log("contract_game", contract_game);
    console.log("abi_game", abi_game);
    return new Contract(contract_game, abi_game, connectProvider().getSigner());
  };

  const getSyncMonster = async (farmId) => {
    const contract = initContract();
    const { data } = await axios.post(
      process.env.BASE_API_URL + "/sig/monster",
      {
        farmId: farmId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("bitmonster-authorize")).accessToken}`,
        },
      }
    );
    const tx = await contract.mintMonsterWithGame(data.monsterId, data.nonce.toString(), data.signature);
    const result = await tx.wait();
    confirmStatusMonster(result.status == 1 ? true : false);
  };

  const getSyncLand = async (userLandId) => {
    const contract = initContract();
    const { data } = await axios.post(
      process.env.BASE_API_URL + "/sig/land",
      {
        userLandId: userLandId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("bitmonster-authorize")).accessToken}`,
        },
      }
    );
    const tx = await contract.mintLandWithGame(data.userLandId, data.nonce.toString(), data.signature);
    const result = await tx.wait();
    confirmStatusLand(result.status == 1 ? true : false);
  };

  const getSyncAsset = async (assetsId, amount) => {
    const contract = initContract();
    const { data } = await axios.post(
      process.env.BASE_API_URL + "/sig/item",
      {
        itemId: assetsId,
        amount: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("bitmonster-authorize")).accessToken}`,
        },
      }
    );
    const tx = await contract.mintItemWithGame(data.itemId, data.amount, data.nonce.toString(), data.signature);
    const result = await tx.wait();
    confirmStatusItem(result.status == 1 ? true : false);
  };

  // const Logout = (text) => {
  //   unityContext.send("__WebCallback", "EventTest", text);
  // };
  const confirmStatusMonster = (statusBool) => {
    unityContext.send("GameController", "confirmStatusMonster");
  };

  const confirmStatusLand = (statusBool) => {
    unityContext.send("GameController", "confirmStatusLand");
  };

  const confirmStatusItem = (statusBool) => {
    unityContext.send("GameController", "confirmStatusItem");
  };

  const confirmStatusToken = (statusBool) => {
    unityContext.send("GameController", "confirmStatusToken");
  };

  useEffect(() => {
    fetchLoadingContext();
  }, [fetchLoadingContext]);

  if (config.length <= 0) {
    return null;
  }

  const testClick = () => {
    console.log("HGSFGDHKDSGFJHSKDHLFJKDJGFHKSDJH");
    unityContext.send("GameController", "confirmStatusMonster", "true");
  };

  return (
    <>
      <div>
        {process.env.ENVIRONMENT == "local" ? (
          <div>
            <div>
              Monster :
              <input
                type="text"
                placeholder="monsterId"
                onChange={(e) => {
                  setValueFarmId(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  getSyncMonster(valueFarmId);
                }}
              >
                Call
              </button>
            </div>
            <div>
              Land :
              <input
                type="text"
                placeholder="userLandId"
                onChange={(e) => {
                  setValueUserLandId(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  getSyncLand(valueUserLandId);
                }}
              >
                Call
              </button>
            </div>
            <div>
              Item :
              <input
                type="text"
                placeholder="itemId"
                onChange={(e) => {
                  setValueItemId(e.target.value);
                }}
              />
              <input
                type="text"
                placeholder="amount"
                onChange={(e) => {
                  setValueItemAmount(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  getSyncAsset(valueItemId, valueItemAmount);
                }}
              >
                Call
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div style={{ display: progression < 100 ? "block" : "none" }}>
          <LoadingPage progression={progression} />
        </div>
        <div style={{ display: progression == 100 ? "block" : "none" }}>
          <button type="button" className="my-5" onClick={testClick}>
            CLICK TEST
          </button>
          <Unity unityContext={unityContext} style={{ width: `${width}px`, height: `${height}px` }} />
        </div>
      </div>
    </>
  );
};

export default IndexWebGl;
