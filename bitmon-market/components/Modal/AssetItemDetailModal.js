import config from "../../configs/config";
import Modal from "react-bootstrap/Modal";

const AssetItemDetailModal = ({
  data = {},
  onShowConfirmUseModal,
  onShowSaleModal,
  onClose,
  show = false,
  disableButton = false,
}) => {
  // console.log("ASSET DETAIL", data);
  const IMG_EXTENSION = ".png";

  const ALL_LAND = ["L1", "L2", "L3", "L4", "L5"];

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="Inventory-set"
      size="lg"
      centered
    >
      <Modal.Header closeButton={!disableButton}>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5 px-4">
        <div className="display-set-flex w-100 align-items-center ">
          <div className="d-flex  justify-content-center w-50-card">
            <img
              src={`${config.INVENTORY_IMG_URL}/items/${data?.no}${IMG_EXTENSION}`}
              className="w-100 p-2"
            />
          </div>
          <div className=" px-3 text-center text-uppercase">
            <h3>ITEM - {data?.name}</h3>
            <div className="txt-shadow-item">
              <p className="mb-0">Status - {data?.attributes?.status}</p>
            </div>

            <div className="row d-flex justify-content-center ">
              <div className="col-12">
                <img
                  src={"/assets/img/stat/Layer 8 copy.webp"}
                  className="w-100 p-2"
                />
              </div>
              {Array.isArray(data?.attributes?.landCategory) &&
                data?.attributes?.landCategory.map((landCategory, index) => {
                  if (landCategory?.toLowerCase?.() !== "all") {
                    return (
                      <div
                        className="col-2 px-1 text-center"
                        key={`${landCategory}_${index}`}
                        test={landCategory?.toLowerCase?.()}
                      >
                        <img
                          src={`${config.INVENTORY_IMG_URL}/lands/${landCategory}${IMG_EXTENSION}`}
                          className="w-100"
                        />
                      </div>
                    );
                  } else {
                    return ALL_LAND.map((landType, index) => (
                      <div
                        className="col-2 px-1 text-center"
                        key={`${landType}_${index}`}
                      >
                        <img
                          src={`${config.INVENTORY_IMG_URL}/lands/${landType}${IMG_EXTENSION}`}
                          className="w-100"
                        />
                      </div>
                    ));
                  }
                })}
            </div>
            <div className="row mb-2">
              <div className="d-flex justify-content-between mt-3">
                <div className="text-zone">Class : {data?.class}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="text-zone">Type : T1</div>
                <div className="text-zone">Size : {data?.attributes?.size}</div>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <div className="text-zone">
                  Benefit : {data?.attributes?.benefit || ""}
                </div>
                {/* <div className="text-zone">Time : 24</div>
                <div className="text-zone">Num : 1</div> */}
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-6">
                <button
                  className="btn btn-green btn-img text-white"
                  disabled={disableButton}
                  onClick={() => onShowSaleModal(data || {})}
                >
                  SELL
                </button>
              </div>
              {process.env.NFT_SYNC && (
                <div className="col-6">
                  <button
                    className="btn btn-yellow text-white btn-img"
                    disabled={disableButton}
                    onClick={() => onShowConfirmUseModal(data || {})}
                  >
                    SYNC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AssetItemDetailModal;
