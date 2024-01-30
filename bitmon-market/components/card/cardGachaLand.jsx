import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { debug } from "/configs/config";
import { useWalletContext } from "/context/wallet";
import { getMyWallet, dAppChecked } from "/utils/providers/connector";
import Config from "../../configs/config";
import {
  getLandBalance,
  getPricePerBoxOfLand,
  mysteryBoxReadinessCheckLand,
  openLandBox,
} from "../../models/MysteryBox";
import { approveToken, balanceOfWallet } from "../../models/Token";
import { getLandMetadata } from "../../models/Land";
import { Modal } from "react-bootstrap";
import { formatEther } from "ethers/lib/utils";
import { numberComma } from "../../utils/misc";
import { isWhitelistOfBox } from "/models/MysteryBoxWhitelist";

function CardGachaLand(props) {
  const { wallet, walletAction } = useWalletContext();
  const landZoneOpened = 1;

  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({
    stage: "",
  });

  const [isWhiteList, setIsWhitelist] = useState();
  const [landBalance, setLandBalance] = useState();

  const [modalReward, setModalReward] = useState(false);
  const [reward, setReward] = useState({
    land: {},
  });

  const openGachaLand = async (_openType = "TYPE_BUY") => {
    setLoading(true);

    let landPreChecked = await mysteryBoxReadinessCheckLand(landZoneOpened);

    /** Set action open gachapon state */
    setAction((prevAction) => ({
      ...prevAction,
      stage: landPreChecked.stage,
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

    if (landPreChecked.stage == "open") {
      let result = await openLandBox(_openType);

      // let result = {
      //   status: "success",
      //   error: false,
      //   stage: "opened",
      //   message: "Mystery land box has been opened.",
      //   data: {
      //     zone: {
      //       type: "BigNumber",
      //       hex: "0x01",
      //     },
      //     landId: "1107",
      //     price: "25000000000000000000",
      //     tokenId: "1",
      //   },
      // };

      if (!result?.error) {
        /** Update balance to WalletContext */
        const _balance = await balanceOfWallet(wallet);
        walletAction.setBalance(parseInt(formatEther(_balance)));

        /** Retrived land metadata */
        try {
          const landMetadata = await getLandMetadata(result.data.landId);

          setReward((prevReward) => ({
            ...prevReward,
            land: {
              metadata: landMetadata,
            },
          }));

          setModalReward(true);
        } catch (error) {
          console.log(`%c========== Error getLandMetadata() ==========`);
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

  const getLandBalanceOnChain = async () => {
    const result = await getLandBalance();
    if (result) {
      setLandBalance(result);
    } else {
      setTimeout(async () => {
        await getLandBalanceOnChain();
      }, 100);
    }
  };

  const initialize = async () => {
    setPageLoading(true);
    if (debug)
      console.log(`%c========== Call initialize() ==========`, "color: violet");

    if (wallet) {
      if (isWhiteList == null || isWhiteList == true) {
        const res = await isWhitelistOfBox(wallet, "LAND", "0");

        setIsWhitelist(res.data.isWhiteList);
      }
    }

    await getLandBalanceOnChain();
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

      <div className="text-center">
        {reward?.land?.metadata && (
          <>
            <Modal
              show={modalReward}
              onHide={handleModalClose}
              backdrop={`static`}
              className="modal-gacha"
            >
              <Modal.Header closeButton style={{ marginLeft: "8rem" }}>
                <Modal.Title>Land Reward</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="text-center">
                  <img
                    style={{ borderRadius: "0.2rem", maxWidth: "220px" }}
                    src={`${Config.INVENTORY_IMG_URL}/lands/${reward?.land?.metadata?.category}.png`}
                  />
                </div>
                <div className="text-secondary mt-2">
                  <div className="row">
                    <div className="col-6">
                      [Name]{" "}
                      <span className="text-primary">
                        {reward?.land?.metadata?.name}
                      </span>
                    </div>
                    <div className="col-6">
                      [Class]{" "}
                      <span className="text-primary">
                        {reward?.land?.metadata?.class}
                      </span>
                    </div>
                    <div className="col-6">
                      [Category]{" "}
                      <span className="text-primary">
                        {reward?.land?.metadata?.category}
                      </span>
                    </div>
                    <div className="col-6">
                      [Zone]{" "}
                      <span className="text-primary">
                        {reward?.land?.metadata?.zone}
                      </span>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
        <img
          src={props.src}
          alt={props.alt}
          className="w-100"
          style={{ maxWidth: "360px" }}
        />
        <div className="mt-3 d-flex align-items-center flex-column">
          {/* <button className="btn btn-img btn-green"> */}
          <div style={{ width: "100%", maxWidth: "220px" }}>
            <button
              className={props.classbtn}
              onClick={(e) =>
                isWhiteList ? openGachaLand("TYPE_WHITELIST") : openGachaLand()
              }
              disabled={loading || pageLoading}
            >
              {loading || pageLoading ? (
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
          </div>
          <div>
            <small>[{props.title}]</small>
          </div>
          <div>
            Remaining:{" "}
            {pageLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
              </>
            ) : (
              numberComma(landBalance)
            )}
          </div>
        </div>
      </div>
      {/* </a> */}
      {/* </Link> */}
    </>
  );
}
export default CardGachaLand;
