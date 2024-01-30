import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

function DepositGoldModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      className="deposit-set"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <h4>DEPOSIT</h4>
        <img
          src={"/assets/img/icon-2.webp"}
          alt=""
          className="m-auto wallet-w-img"
        />
        <input
          className="form-control form-control-lg input-modal my-3"
          type="text"
          placeholder=""
          aria-label=".form-control-lg example"
        />
        <p>{props.Header}</p>
        <h5>{props.Titlebnb}</h5>
        <button className="btn btn-img btn-green w-50">CONFIRM</button>
      </Modal.Body>
    </Modal>
  );
}
export default DepositGoldModal;
