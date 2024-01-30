import Unity, { UnityContext } from "react-unity-webgl";

import { useEffect, useState, useLayoutEffect } from "react";
import { connectProvider } from "../utils/provider";
import LoadingPage from "../components/game/loading-page";
import { Contract } from "ethers";
import axios from "axios";
import abi_game from "../public/abi/Game.json";

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
const unityContext = new UnityContext({
  loaderUrl: process.env.LOADER_URL,
  dataUrl: process.env.DATA_URL,
  frameworkUrl: process.env.FRAMEWORK_URL,
  codeUrl: process.env.CODE_URL,
});

const GamePage = ({ webGlConfig }) => {
  const [width, height] = useWindowSize();
  const [progression, setProgression] = useState(0);
  const [valueFarmId, setValueFarmId] = useState();
  const [valueUserLandId, setValueUserLandId] = useState();
  const [valueItemId, setValueItemId] = useState();
  const [valueItemAmount, setValueItemAmount] = useState();

  const fetchLoadingContext = () => {
    unityContext.setFullscreen(true);
    unityContext.on("progress", (progress) => {
      setProgression(progress * 100);
    });
  };

  useEffect(function () {
    console.log("unityContext.config", unityContext.unityConfig);
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
    return new Contract(
      process.env.CONTRACT_GAME,
      abi_game,
      connectProvider().getSigner()
    );
  };

  const getSyncMonster = async (farmId) => {
    let mintId;
    try {
      const contract = initContract();
      const { data } = await axios.post(
        process.env.BASE_API_URL + "/sig/monster",
        {
          farmId: farmId,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("bitmonster-authorize"))
                .accessToken
            }`,
          },
        }
      );
      mintId = data?.mint;
      const tx = await contract.mintMonsterWithGame(
        data.monsterId,
        data.nonce.toString(),
        data.signature
      );
      if (tx) {
        // update status
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateMonster",
          {
            id: data.mint,
            status: "wait",
            hash: tx.hash,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );

        const result = await tx.wait();

        if (result.status == 1) {
          await axios.post(
            process.env.BASE_API_URL + "/sig/confirmMonster",
            {
              id: data.mint,
            },
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("bitmonster-authorize"))
                    .accessToken
                }`,
              },
            }
          );
          confirmStatusMonster("true");
        } else {
          confirmStatusMonster("false");
        }
      }
    } catch (err) {
      if (mintId) {
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateMonster",
          {
            id: mintId,
            status: "cancel",
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );
      }
      confirmStatusMonster("false");
    }
  };

  const getSyncLand = async (userLandId) => {
    let mintId;
    try {
      const contract = initContract();
      const { data } = await axios.post(
        process.env.BASE_API_URL + "/sig/land",
        {
          userLandId: userLandId,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("bitmonster-authorize"))
                .accessToken
            }`,
          },
        }
      );
      mintId = data?.mint;
      const tx = await contract.mintLandWithGame(
        data.userLandId,
        data.nonce.toString(),
        data.signature
      );
      if (tx) {
        // update status
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateLand",
          {
            id: data.mint,
            status: "wait",
            hash: tx.hash,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );

        const result = await tx.wait();
        if (result.status == 1) {
          await axios.post(
            process.env.BASE_API_URL + "/sig/confirmLand",
            {
              id: data.mint,
            },
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("bitmonster-authorize"))
                    .accessToken
                }`,
              },
            }
          );
          confirmStatusLand("true");
        } else {
          confirmStatusToken("false");
        }
      }
    } catch (err) {
      if (mintId) {
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateLand",
          {
            id: mintId,
            status: "cancel",
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );
      }
      confirmStatusLand("false");
    }
  };

  const getSyncAsset = async (assetsId, amount) => {
    let mintId;
    try {
      const contract = initContract();
      const { data } = await axios.post(
        process.env.BASE_API_URL + "/sig/item",
        {
          itemId: assetsId,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("bitmonster-authorize"))
                .accessToken
            }`,
          },
        }
      );
      mintId = data?.mint;
      const tx = await contract.mintItemWithGame(
        data.itemId,
        data.amount,
        data.nonce.toString(),
        data.signature
      );
      if (tx) {
        // update status
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateItem",
          {
            id: data.mint,
            status: "wait",
            hash: tx.hash,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );

        const result = await tx.wait();
        if (result.status == 1) {
          await axios.post(
            process.env.BASE_API_URL + "/sig/confirmItem",
            {
              id: data.mint,
            },
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("bitmonster-authorize"))
                    .accessToken
                }`,
              },
            }
          );
          confirmStatusItem("true");
        } else {
          confirmStatusItem("false");
        }
      }
    } catch (err) {
      if (mintId) {
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateItem",
          {
            id: mintId,
            status: "cancel",
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );
      }
      confirmStatusItem("false");
    }
  };
  const getSyncToken = async (token) => {
    let mintId;
    try {
      const contract = initContract();
      const { data } = await axios.post(
        process.env.BASE_API_URL + "/sig/tokenStack",
        {
          token,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("bitmonster-authorize"))
                .accessToken
            }`,
          },
        }
      );
      if (token !== "RBS") {
        mintId = data?.mint;
        const tx =
          token == "DMS"
            ? await contract.mintTokenDMSWithGame(
                data.amountWei,
                data.nonce.toString(),
                data.signature
              )
            : await contract.mintTokenDGSWithGame(
                data.amountWei,
                data.nonce.toString(),
                data.signature
              );
        if (tx) {
          // update status
          await axios.put(
            process.env.BASE_API_URL + "/sig/updateTokenStack",
            {
              id: data.mint,
              status: "wait",
              hash: tx.hash,
            },
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("bitmonster-authorize"))
                    .accessToken
                }`,
              },
            }
          );

          const result = await tx.wait();
          if (result.status == 1) {
            await axios.post(
              process.env.BASE_API_URL + "/sig/confirmTokenStack",
              {
                id: data.mint,
              },
              {
                headers: {
                  Authorization: `Bearer ${
                    JSON.parse(localStorage.getItem("bitmonster-authorize"))
                      .accessToken
                  }`,
                },
              }
            );
            confirmStatusToken("true");
          } else {
            confirmStatusToken("false");
          }
        } else {
          confirmStatusLand("false");
        }
      } else {
        confirmStatusToken("true");
      }
    } catch (err) {
      if (mintId) {
        await axios.put(
          process.env.BASE_API_URL + "/sig/updateTokenStack",
          {
            id: mintId,
            status: "cancel",
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("bitmonster-authorize"))
                  .accessToken
              }`,
            },
          }
        );
      }
      confirmStatusToken("false");
    }
  };

  const confirmStatusMonster = (statusBool) => {
    unityContext.send("GameController", "confirmStatusMonster", statusBool);
  };

  const confirmStatusLand = (statusBool) => {
    unityContext.send("GameController", "confirmStatusLand", statusBool);
  };

  const confirmStatusItem = (statusBool) => {
    unityContext.send("GameController", "confirmStatusItem", statusBool);
  };

  const confirmStatusToken = (statusBool) => {
    unityContext.send("GameController", "confirmStatusToken", statusBool);
  };

  useEffect(() => {
    fetchLoadingContext();
  }, [fetchLoadingContext]);

  // if (config.length <= 0) {
  //   return null;
  // }

  return (
    <>
      <div>
        {process.env.ENVIRONMENT == "local" ? (
          <div style={{ display: "none" }}>
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
          <LoadingPage progression={parseInt(progression)} />
        </div>
        <div
          style={{ display: progression == 100 ? "block" : "none" }}
          id="unity-canvas-1"
        >
          <Unity
            unityContext={unityContext}
            style={{ width: `${width}px`, height: `${height}px` }}
          />
        </div>
      </div>
    </>
  );
};

export default GamePage;
