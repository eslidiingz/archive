import config from "../../configs/config";

import { Modal, Spinner } from "react-bootstrap";
import { numberComma } from "../../utils/misc";

const SaleModal = ({
  onClose,
  show = false,
  onChangeSalePrice,
  salePrice = "",
  onConfirm,
  isApprovedInventoryItem = { token: false, item: false },
  onApproveToken,
  onApproveItem,
  disableApproveButton = false,
  loading = false,
  activeTab = "monster",
  data = {},
  balanceInputInfo = {
    show: false,
    value: "",
  },
  onChangeBalance,
  formInvalid = { price: false, amount: false },
  disableButton = false,
}) => {
  const ApproveTokenButton = ({ disableButton = false }) => {
    if (!isApprovedInventoryItem.token) {
      return (
        <button className="btn btn-img btn-green w-60 text-uppercase mt-3" onClick={onApproveToken} disabled={disableButton}>
          {disableButton ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            `approve token`
          )}
        </button>
      );
    }
    return "";
  };

  const ApproveItemButton = ({ disableButton = false }) => {
    console.log(disableButton, "54656868787");
    if (!isApprovedInventoryItem.item) {
      return (
        <button className="btn btn-img btn-green w-60 text-uppercase mt-3" onClick={onApproveItem} disabled={disableButton}>
          {disableButton ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            `approve ${activeTab}`
          )}
        </button>
      );
    }
    return "";
  };

  return (
    <Modal show={show} onHide={onClose} className="Inventory-set" size="md" centered>
      <Modal.Header closeButton={!disableButton}>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>
            <div className="text-center">
              <h4>
                <img src={"/assets/img/btn_icon_tag.webp"} alt="teg" className="mb-0 pe-2" />
                Sell {activeTab === "item" ? "Item" : activeTab === "land" ? "Land" : activeTab === "monster" ? "Monster Card" : ""} NFT
              </h4>
              <h4>Fixed Price</h4>
            </div>
            {isApprovedInventoryItem.item && isApprovedInventoryItem.token && activeTab === "item" && (
              <div className="p-2 box-card w-50 mt-2 mb-2">
                <input
                  type="text"
                  className={`form-control form-control-lg input-modal ${formInvalid.amount ? "is-invalid" : ""}`}
                  placeholder="Amount"
                  value={balanceInputInfo?.value}
                  onChange={onChangeBalance}
                  disabled={disableButton}
                />
              </div>
            )}
            {isApprovedInventoryItem.token && isApprovedInventoryItem.item ? (
              <>
                <div className="form-row d-md-flex align-items-start">
                  <div className="col-md-2 col-12 pe-0 text-center text-md-end ps-lg-0 ps-0 d-flex">
                    <img src={"/assets/img/icon-4.webp"} alt="teg" className="mb-0 w-75-modal mx-auto" />
                  </div>
                  <div className="col-md-8 col-12">
                    <div className="text-center">
                      <input
                        className={`form-control form-control-lg input-set-profile w-100 ${formInvalid.price ? "is-invalid" : ""}`}
                        placeholder="Price"
                        value={salePrice}
                        onChange={onChangeSalePrice}
                        disabled={disableButton}
                      />
                      <span> Fee 5% </span>
                    </div>
                  </div>
                  <div className="col-md-2 col-12 ps-0 text-center text-md-start d-flex">
                    <h4 className="mb-0 pt-2 mx-auto">BUSD</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12 px-1">
                    <button className="btn btn-img btn-red mt-3" onClick={onClose} disabled={disableButton}>
                      CANCEL
                    </button>
                  </div>
                  {isApprovedInventoryItem.token && isApprovedInventoryItem.item && (
                    <div className="col-md-6 col-12 px-1">
                      <button className="btn btn-img btn-green mt-3" onClick={onConfirm} disabled={disableButton}>
                        {disableButton ? (
                          <div className="text-center">
                            <Spinner animation="border" role="status" />
                          </div>
                        ) : (
                          "SELL"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <ApproveTokenButton disableButton={disableApproveButton} />
                <ApproveItemButton disableButton={disableApproveButton} />
                <div className="col-md-6 col-12 px-1">
                  <button className="btn btn-img btn-red mt-3" onClick={onClose} disabled={disableApproveButton}>
                    CANCEL
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SaleModal;
