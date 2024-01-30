import Modal from "react-bootstrap/Modal";
import config from "../../configs/config";

const LandDetailModal = ({
  data = {},
  onShowConfirmUseModal,
  onShowSaleModal,
  onClose,
  show = false,
  disableButton = false,
}) => {
  // console.log("LAND DETAIL", data);
  const IMG_EXTENSION = ".png";

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
        <div className="display-set-flex w-100 align-items-center">
          <div className="d-flex  justify-content-center w-50-card">
            <img
              src={`${config.INVENTORY_IMG_URL}/lands/${data?.category}${IMG_EXTENSION}`}
              className="w-100 p-2"
            />
          </div>
          <div className="px-3 text-center text-uppercase">
            <h3>LAND - {data?.name}</h3>
            <img
              src={"/assets/img/stat/Layer 8 copy.webp"}
              className="w-100 p-2"
            />
            <div className="d-flex justify-content-between mt-3">
              <div className="text-zone">class : {data?.class}</div>
              <div className="text-zone">zone : {data?.zone}</div>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="text-zone">code : {data?.code}</div>
              <div className="text-zone">index : {data?.index}</div>
            </div>
            <div className="row d-flex justify-content-center my-3">
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

export default LandDetailModal;
