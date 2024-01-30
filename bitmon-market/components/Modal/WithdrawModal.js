import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

function WithdrawModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      className="WITHDRAW-set"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <h4>WITHDRAW</h4>
        <img
          src={"/assets/img/icon-1.webp"}
          alt=""
          className="m-auto wallet-w-img"
        />
        <input
          className="form-control form-control-lg input-modal my-3"
          type="text"
          placeholder=""
          aria-label=".form-control-lg example"
        />
        <p>Dragon Moon Stone</p>
        <h5>FEE 5% (Min 10 DMS)</h5>
        <button className="btn btn-img btn-green w-50">CONFIRM</button>
      </Modal.Body>
    </Modal>
  );
}
export default WithdrawModal;
