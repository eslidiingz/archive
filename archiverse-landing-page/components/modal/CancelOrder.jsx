import { formatUnits } from "ethers/lib/utils";
import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Config from "../../configs/config";
import useLoading from "../../hooks/useLoading";
import { useQueryToken } from "../../hooks/useQueryToken";
import { updateOrderMarket } from "../../models/Marketplace";
import { createTransactions } from "../../models/Transaction";
import { useTokenListStore } from "../../stores/tokenList";
import { smartContact } from "../../utils/providers/connector";
import ButtonState from "../buttons/ButtonLoading";
import DetailBuy from "../form/DetailBuy";

const CancelOrderDialog = ({ asset, market }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggle, loading } = useLoading();
  const [tokenAddress, setTokenAddress] = useState(null);
  const { tokenList } = useTokenListStore();
  const { token: queryToken } = useQueryToken(
    tokenAddress || tokenList[0].attributes.address
  );
  useEffect(() => {
    setTokenAddress(market?.tokenAddress);
  }, []);

  const cancelOrderMarket = async (index) => {
    toggle(index, true);
    try {
      console.log(market?.orderId);
      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );

      const tx = await marketContract.cancelOrder(market?.orderId);
      const status = await tx.wait();
      if (status) {
        const currentTime = new Date().toISOString();
        const set = `isActive: false,note: "Cancel Order", expiration: "${currentTime}"`;
        const where = `{orderId: {_eq: ${market?.orderId}}}`;
        const updateOrder = await updateOrderMarket(set, where);
        if (updateOrder) {
          const insertTransaction = {
            txHash: status?.transactionHash,
            txType: 2, // cancel order
            collectionId: asset?.collectionId,
            assetId: asset?.id,
            from: status?.from,
            to: status?.to,
            asset_ids: [asset?.id],
          };

          console.log(insertTransaction);

          const transaction = await createTransactions(insertTransaction);
          if (transaction) {
            toggle(index, false);
            location.reload();
          }
        }
      }
    } catch (error) {
      toggle(index, false);
    }
  };
  return (
    <>
      <button
        className="btn w-full btn-secondary btn-group-detail"
        onClick={() => setIsOpen(!isOpen)}
      >
        Cancel {market.orderType == 0 ? "Sell" : "Auction"}
      </button>
      <Modal show={isOpen} onHide={() => setIsOpen(!isOpen)} size="lg">
        <Modal.Header className="modal-headers" closeButton>
          <Modal.Title>
            <p align="center" className="text-makeanoff-h_ex">
              Cancel {market.orderType == 0 ? "Sell" : "Auction"} Order
            </p>
          </Modal.Title>
        </Modal.Header>
        <hr className="hr-detailpage" />
        <Modal.Body>
          <div className="row">
            <div className="col-xl-12">
              <div className="layout-deatilpage-modal">
                <p className="text-deatilpage-modal">Item</p>
                <hr />
              </div>
              <div className="row modal-detail-layout">
                <div className="col-xl-2">
                  <img
                    src={
                      asset?.metadata?.image ||
                      "/assets/image/archiverse/default_img.png"
                    }
                    onError={(e) => {
                      e.target.src = "/assets/image/archiverse/default_img.png";
                      e.target.onError = null;
                    }}
                    className="img-deatilpage-modal img-fluid"
                  />
                </div>
                <div className="col-xl-4 modal-content-layout">
                  <p className="modal-txt-detail">{asset?.metadata?.name}</p>
                  <p className="modal-txt-detail2">
                    Token Id : {asset?.tokenId}
                  </p>
                </div>
                <div className="col-xl-6 layout-token" align="right">
                  <div className="d-flex layout-diamonds">
                    {/* <img
                      src="/assets/swaple/icon-omcoin.webp"
                      // className="img-token"
                    /> */}
                    <img
                      height={24}
                      width={24}
                      src={`${Config.CMS_FILE_API}/${queryToken?.icon?.data?.attributes?.url}`}
                    />{" "}
                    <p className="layout-token-deatilpage ">
                      {market?.price ? market?.price.toLocaleString() : ""}
                    </p>
                  </div>
                  {/* <div className="d-flex layout-diamonds">
                    <p className="modal-txt-detail2">
                      {market?.price - (market?.price * feeRate) / 100}
                    </p>
                  </div> */}
                </div>
                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer align="center" style={{ display: "block" }}>
          <ButtonState
            style={"btn btn-primary mb-4"}
            loading={loading.index === "confirm" && loading.status === true}
            onFunction={() => cancelOrderMarket("confirm")}
            text={"Confirm Transaction"}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelOrderDialog;
