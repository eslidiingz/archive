import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { debug } from "/configs/config";
import { useWalletContext } from "/context/wallet";
import { getMyWallet, dAppChecked } from "/utils/providers/connector";
import Config from "../../configs/config";
import {
  getMonsterBalanceOfBox,
  mysteryBoxReadinessCheckMonster,
  openMonsterBox,
} from "../../models/MysteryBox";
import { approveToken, balanceOfWallet } from "../../models/Token";
import { getMonsterMetadata } from "../../models/Monster";
import { Modal } from "react-bootstrap";
import { formatEther } from "ethers/lib/utils";
import { numberComma } from "../../utils/misc";
import { isWhitelistOfBox } from "/models/MysteryBoxWhitelist";

function CardGacha(props) {
  const { wallet, walletAction } = useWalletContext();

  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({
    openingBox: "",
    stage: "",
  });

  const [isWhiteList, setIsWhitelist] = useState();
  const [monsterBalance, setMonsterBalance] = useState();

  const [modalReward, setModalReward] = useState(false);
  const [reward, setReward] = useState({
    monster: {},
  });

  const openGachaMonster = async (_boxType, _openType = "TYPE_BUY") => {
    setLoading(true);
    setAction((prevAction) => ({
      ...prevAction,
      openingBox: _boxType,
    }));

    let monsterPreChecked = await mysteryBoxReadinessCheckMonster(_boxType);

    /** Set action open gachapon state */
    setAction((prevAction) => ({
      ...prevAction,
      stage: monsterPreChecked.stage,
    }));

    /** Has [stage status is equal "approve"] action to approve */
    if (action.stage === "approve") {
      let isApproved = await approveToken(
        Config.MYSTERYBOX_CA,
        Config.BUSD_CA,
        true
      );

      /** Set action open gachapon state */
      setAction((prevAction) => ({
        ...prevAction,
        stage: Boolean(isApproved) === true ? "open" : action.stage,
      }));
    }

    if (monsterPreChecked.stage == "open") {
      let result = await openMonsterBox(_boxType, _openType);
      console.log("result", result);
      // let result = {
      //   // Mock data
      //   status: "success",
      //   error: false,
      //   stage: "opened",
      //   message: "Mystery box has been opened.",
      //   data: {
      //     boxType: "Legendary",
      //     monsterId: 7,
      //     price: 10,
      //     tokenId: 30,
      //   },
      // };

      if (!result?.error) {
        /** Update balance to WalletContext */
        const _balance = await balanceOfWallet(wallet);
        walletAction.setBalance(parseInt(formatEther(_balance)));

        /** Retrived monster metadata */
        try {
          const monsterMetadata = await getMonsterMetadata(
            result.data.monsterId
          );

          setReward((prevReward) => ({
            ...prevReward,
            monster: {
              metadata: monsterMetadata,
            },
          }));

          setModalReward(true);
        } catch (error) {
          console.log(
            `%c========== Error Call getMonsterMetadata() ==========`,
            "color: red"
          );
          console.log(error);
          setLoading(false);
        }
      }
    }

    // setTimeout(() => {
    await initialize();
    setLoading(false);
    // }, 1000);
  };

  const handleModalClose = () => {
    setModalReward(false);
  };
  const getMonsterBalanceOfBoxOnChain = async (box) => {
    const result = await getMonsterBalanceOfBox(box);
    if (result) {
      setMonsterBalance(result);
    } else {
      setTimeout(async () => {
        await getMonsterBalanceOfBoxOnChain(box);
      }, 100);
    }
  };

  const initialize = async () => {
    setPageLoading(true);
    if (debug)
      console.log(`%c========== Call initialize() ==========`, "color: violet");

    if (wallet) {
      if (isWhiteList == null || isWhiteList == true) {
        const res = await isWhitelistOfBox(wallet, "MONSTER", props.title);

        setIsWhitelist(res.data.isWhiteList);
      }
    }
    await getMonsterBalanceOfBoxOnChain(props.title);
    setPageLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </Head>

      <div>
        {reward?.monster?.metadata && (
          <>
            <Modal
              show={modalReward}
              onHide={handleModalClose}
              backdrop={`static`}
              className="modal-gacha"
            >
              <Modal.Header closeButton style={{ marginLeft: "6.25rem" }}>
                <Modal.Title>Monster Reward</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="text-center">
                  <img
                    style={{ borderRadius: "0.3rem", maxWidth: "220px" }}
                    src={`${
                      Config.INVENTORY_IMG_URL
                    }/card/MUI${reward?.monster?.metadata?.no?.slice?.(3)}.jpg`}
                  />
                </div>
                <div className="text-secondary mt-3">
                  <div className="row">
                    <div className="col-4">
                      [HP]{" "}
                      <span className="text-primary">
                        {reward?.monster?.metadata?.stat?.hp}
                      </span>
                    </div>
                    <div className="col-4">
                      [POW]{" "}
                      <span className="text-primary">
                        {reward?.monster?.metadata?.stat?.POW}
                      </span>
                    </div>
                    <div className="col-4">
                      [DEF]{" "}
                      <span className="text-primary">
                        {reward?.monster?.metadata?.stat?.DEF}
                      </span>
                    </div>
                    <div className="col-4">
                      [ACC]{" "}
                      <span className="text-primary">
                        {reward?.monster?.metadata?.stat?.ACC}
                      </span>
                    </div>
                    <div className="col-4">
                      [SPD]{" "}
                      <span className="text-primary">
                        {reward?.monster?.metadata?.stat?.SPD}
                      </span>
                    </div>
                    <div className="col-4">
                      [CRI]{" "}
                      <span className="text-primary">
                        {reward?.monster?.metadata?.stat?.CRI}
                      </span>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
        <img src={props.src} alt={props.alt} className="w-100" />
        <div className="mt-3 text-center">
          {/* <button className="btn btn-img btn-green"> */}
          <button
            className={props.classbtn}
            onClick={(e) =>
              isWhiteList
                ? openGachaMonster(props.title, "TYPE_WHITELIST")
                : openGachaMonster(props.title)
            }
            disabled={loading || pageLoading}
          >
            {(loading && action.openingBox == props.title) || pageLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <>
                {action.stage === "approve" ? (
                  <>Approve Token</>
                ) : (
                  <>
                    {isWhiteList == true ? (
                      <>Whitelist</>
                    ) : (
                      <>
                        <img
                          src={"/assets/img/icon-4.webp"}
                          alt=""
                          className="w-35 px-2"
                        />
                        {props.coin}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </button>
          <small>[{props.title}]</small>
          <div>
            Remaining:{" "}
            {pageLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
              </>
            ) : (
              numberComma(monsterBalance)
            )}
          </div>
        </div>
      </div>
      {/* </a> */}
      {/* </Link> */}
    </>
  );
}
export default CardGacha;
