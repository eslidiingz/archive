import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

function DetailCard(props) {
  console.log("props", props);
  const name = props.monsterId.no;
  const monsterId = name.slice();
  console.log("monsterId", monsterId);
  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      size="lg"
      className="Detail-set"
      //   style={{
      //     backgroundImage: 'url("/assets/img/Bitmon/Monbook001.webp")',
      //     backgroundRepeat: 'no-repeat',
      //     backgroundPosition: 'center'
      //     }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <img
          src={`/assets/img/Bitmon/Monbook${monsterId}.webp`}
          className="w-100"
        />
      </Modal.Body>
    </Modal>
  );
}
export default DetailCard;
