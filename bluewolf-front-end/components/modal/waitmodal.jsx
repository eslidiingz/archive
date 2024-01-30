import React, {useState} from "react"
import Modal from "react-bootstrap/Modal"

function Waitmodal({showWaitModal, handleCloseWaitModal, title}) {
  return (
    <>
      <Modal
        show={showWaitModal}
        onHide={handleCloseWaitModal}
        className="layout_modal"
      >
        {/* <Modal.Header closeButton> */}
        <Modal.Header>
          <Modal.Title>Please Wait ...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <span
              className="spinner-border float-right my-5"
              role="status"
              aria-hidden="true"
            ></span>
            {/* <h2>Please wait ...</h2> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Waitmodal
