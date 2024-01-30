import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { debug } from "/configs/config";
import { useWalletContext } from "/context/wallet";
import { getMyWallet, dAppChecked } from "/utils/providers/connector";
import Config from "../../configs/config";
import {
  getItemSold,
  getPricePerBoxOfItem,
  mysteryBoxReadinessCheckItem,
  openItemBox,
} from "../../models/MysteryBox";
import { approveToken, balanceOfWallet } from "../../models/Token";
import { getItemMetadata } from "../../models/Item";
import { Modal } from "react-bootstrap";
import { formatEther } from "ethers/lib/utils";
import { isWhitelistOfBox } from "/models/MysteryBoxWhitelist";

function CardGachaItem(props) {
  const { wallet, walletAction } = useWalletContext();
  const itemZoneOpened = 1;

  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({
    stage: "",
  });

  const [isWhiteList, setIsWhitelist] = useState();
  const [itemSold, setItemSold] = useState();

  const [modalReward, setModalReward] = useState(false);
  const [reward, setReward] = useState({
    item: {},
  });

  const openGachaItem = async (_openType = "TYPE_BUY") => {
    setLoading(true);

    let itemPreChecked = await mysteryBoxReadinessCheckItem(itemZoneOpened);

    /** Set action open gachapon state */
    setAction((prevAction) => ({
      ...prevAction,
      stage: itemPreChecked.stage,
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

    if (itemPreChecked.stage == "open") {
      let result = await openItemBox(itemZoneOpened, _openType);

      if (!result?.error) {
        /** Update balance to WalletContext */
        const _balance = await balanceOfWallet(wallet);
        walletAction.setBalance(parseInt(formatEther(_balance)));

        /** Retrived item metadata */
        try {
          const itemMetadata = await getItemMetadata(result.data.itemId);

          setReward((prevReward) => ({
            ...prevReward,
            item: {
              metadata: itemMetadata,
            },
          }));

          setModalReward(true);
        } catch (error) {
          console.log(`%c========== Error getItemMetadata() ==========`);
          console.log(error);
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
  const getItemSoldOnChain = async () => {
    const result = await getItemSold();
    if (result) {
      setItemSold(result);
    } else {
      setTimeout(async () => {
        await getItemSoldOnChain();
      }, 100);
    }
  };

  const initialize = async () => {
    setPageLoading(true);
    if (debug)
      console.log(`%c========== Call initialize() ==========`, "color: violet");

    if (wallet) {
      if (isWhiteList == null || isWhiteList == true) {
        const res = await isWhitelistOfBox(wallet, "ITEM", "1");

        setIsWhitelist(res.data.isWhiteList);
      }
    }

    await getItemSoldOnChain();
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
        {reward?.item?.metadata && (
          <>
            <Modal
              show={modalReward}
              onHide={handleModalClose}
              backdrop={`static`}
              className="modal-gacha"
            >
              <Modal.Header closeButton style={{ marginLeft: "7.6rem" }}>
                <Modal.Title>Item Reward</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="text-center">
                  <img
                    style={{ borderRadius: "0.2rem", maxWidth: "220px" }}
                    src={`${Config.INVENTORY_IMG_URL}/items/${reward?.item?.metadata?.no}.png`}
                  />
                </div>
                <div
                  className="text-center text-secondary mt-3"
                  style={{ fontSize: "0.75rem" }}
                >
                  <div className="row">
                    <div className="col-6">
                      [Name]{" "}
                      <span className="text-primary">
                        {reward?.item?.metadata?.name}
                      </span>
                    </div>
                    <div className="col-6">
                      [Class]{" "}
                      <span className="text-primary">
                        {reward?.item?.metadata?.class}
                      </span>
                    </div>
                    <div className="col-6">
                      [Category]{" "}
                      <span className="text-primary">
                        {reward?.item?.metadata?.category}
                      </span>
                    </div>
                    {reward?.item?.metadata?.category.toUpperCase() ===
                      "BUILD" && (
                      <>
                        <div className="col-6">
                          [Land Category]{" "}
                          <span className="text-primary">
                            {reward?.item?.metadata?.attributes
                              ?.landCategory ? (
                              <>
                                {reward?.item?.metadata?.attributes?.landCategory?.join?.(
                                  ", "
                                )}
                              </>
                            ) : null}
                          </span>
                        </div>
                        <div className="col-6">
                          [Benefit]{" "}
                          <span className="text-primary">
                            {reward?.item?.metadata?.attributes?.benefit}
                            {reward?.item?.metadata?.attributes
                              ?.incrementPerTime
                              ? `+${reward?.item?.metadata?.attributes?.incrementPerTime}`
                              : null}
                            {reward?.item?.metadata?.attributes?.time
                              ? `/${reward?.item?.metadata?.attributes?.time} Hrs`
                              : null}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
        <img src={props.src} alt={props.alt} className="w-100" />
        <div className="mt-3 d-flex align-items-center flex-column">
          {/* <button className="btn btn-img btn-green"> */}
          <div style={{ width: "100%", maxWidth: "220px" }}>
            <button
              className={props.classbtn}
              onClick={(e) =>
                isWhiteList ? openGachaItem("TYPE_WHITELIST") : openGachaItem()
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
                      {isWhiteList ? (
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
          <small>[{props.title}]</small>
          <div>
            Sold:{" "}
            {pageLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
              </>
            ) : (
              itemSold
            )}
          </div>
        </div>
      </div>
      {/* </a> */}
      {/* </Link> */}
    </>
  );
}
export default CardGachaItem;
