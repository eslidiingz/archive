import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

function StakingItemModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      className="staking-set"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal">
        <div className=" container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-6">
                <img src={"/assets/img/card-04.webp"} alt="" className="w-100 shadow-yellow"/>
            </div>
            <div className="col-lg-4 col-6">
                <img src={"/assets/img/card-05.webp"}  alt="" className="w-100 shadow-yellow"/>
            </div>
          </div>
        </div>
        <button type="button" className="btn-select btn btn-img mt-4" aria-label="Close"></button>
      </Modal.Body>
    </Modal>
  );
}
export default StakingItemModal;
