import { Modal, Spinner } from "react-bootstrap";

const ConfirmModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      backdrop="static"
      className="profile-set"
      size="md"
      centered
    >
      <Modal.Header closeButton={!props.disableButton}>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <h4 className="text-uppercase">Confirm to Use</h4>
        {props.balanceInputInfo?.show && (
          <div className="p-2 box-card w-50">
            <input
              type="text"
              className={`form-control form-control-lg input-modal ${
                props.formInvalid.amount ? "is-invalid" : ""
              }`}
              placeholder="Amount"
              value={props.balanceInputInfo?.value}
              onChange={props.onChangeBalance}
              disabled={props.disableButton}
            />
          </div>
        )}
        <div>
          <button
            className="btn btn-img btn-green px-4 mt-3 text-uppercase"
            type="button"
            disabled={props.disableButton}
            onClick={props.onConfirm}
          >
            {props.disableButton ? (
              <div className="text-center">
                <Spinner animation="border" role="status" />
              </div>
            ) : (
              "CONFIRM"
            )}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
