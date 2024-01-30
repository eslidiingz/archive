import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

function DepositModal(props) {
  return (
    <Modal show={props.show} onHide={props.onClose} className="deposit-set" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <img src={"/assets/img/land/L1.webp"} alt="L1" className="m-auto wallet-w-img p-3" />

        <div className="p-2 box-card w-50">
          <p className="mb-0 text-center text-uppercase">mirror</p>
          <hr />
          <div className="d-flex justify-content-between">
            <small className="text-zone">ZONE1</small>
            <small className="text-zone">c01</small>
          </div>
          <input className="form-control form-control-lg input-modal my-3" type="text" />
          <p className="text-center">{props.Header}</p>
          <h5 className="text-center">{props.Titlebnb}</h5>
        </div>
        <button className="btn btn-img btn-green w-50 mt-3">CONFIRM</button>
      </Modal.Body>
    </Modal>
  );
}
export default DepositModal;
