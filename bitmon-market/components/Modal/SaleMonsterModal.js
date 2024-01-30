import config from "../../configs/config";
import Modal from "react-bootstrap/Modal";
import { Spinner } from "react-bootstrap";

const SaleMonsterModal = ({
  onClose,
  show = false,
  onChangeSalePrice,
  salePrice = "",
  onConfirm,
  isApprovedMonster = false,
  onApprove,
  loading = false,
  data = {},
}) => {
  const IMG_EXTENSION = ".jpg";

  return (
    <Modal show={show} onHide={onClose} className="deposit-set" size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>
            <img src={`${config.MONSTER_IMG_URL}/MUI${data?.no}${IMG_EXTENSION}`} alt="L1" className="m-auto wallet-w-img p-3" />
            {isApprovedMonster ? (
              <>
                <div className="p-2 box-card w-50">
                  <input type="text" className="form-control form-control-lg input-modal" value={salePrice} onChange={onChangeSalePrice} />
                </div>
                <button className="btn btn-img btn-green w-50 mt-3" onClick={onConfirm}>
                  CONFIRM
                </button>
              </>
            ) : (
              <button className="btn btn-img btn-green w-50 mt-3" onClick={onApprove}>
                APPROVE
              </button>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SaleMonsterModal;
