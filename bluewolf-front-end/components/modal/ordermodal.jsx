import React, {useState} from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import {Form} from "react-bootstrap"
import Swal from "sweetalert2"
import {createOrder} from "../../utils/contracts/BWNFTMarket"
import {updateAssetList} from "../../utils/api/asset-api"
import {toastSuccess, toastDanger} from "../toast/toast"

function Ordermodal({
  showOrderModal,
  tokenid,
  contractAddress,
  assetid,
  handleCloseOrderModal,
  setLoading,
  setIsListed,
  loading,
}) {
  const [price, setPrice] = useState(0)

  const setOrder = async () => {
    try {
      setLoading(true)
      const result = await createOrder(tokenid, price, contractAddress)
      if (result) {
        toastSuccess(
          "Create Order",
          "Create Order, Successfully Create Order",
          "success"
        )
      }
      console.log(assetid)
      const _result = await updateAssetList(assetid, {
        Orderprice: price,
        marketStatus: "listed",
      })
      if (_result.ok === true) {
        toastSuccess(
          "Success",
          "Update Asset, Successfully Update Asset",
          "success"
        )
        setLoading(false)
        setIsListed(true)
        location.reload()
      }
    } catch (error) {
      setLoading(false)
      handleCloseOrderModal()
      console.log(error)
      Swal.fire("Error", "Create Order, Error order creation!!", "error")
    }
  }

  const handlePrice = async (e) => {
    if (e.target.value >= 0) {
      setPrice(e.target.value)
    } else {
      e.target.value = 0
      setPrice(0)
    }
  }

  return (
    <>
      <Modal
        show={showOrderModal}
        onHide={handleCloseOrderModal}
        className="layout_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading === true ? (
            <div className="d-flex justify-content-center layout_spinner">
              <h2 className="text_wait">Please Wait ...</h2>
              <span
                className="spinner-border float-right mt-3"
                role="status"
                aria-hidden="true"
              ></span>
            </div>
          ) : (
            <Form.Group className="py-4" controlId="formBasicUsername">
              <Form.Label className="topic_modal">Price (BWC)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Price (BWC)"
                className="input-fix"
                onChange={(e) => {
                  handlePrice(e)
                }}
              />
            </Form.Group>
          )}
        </Modal.Body>
        {loading === false ? (
          <Modal.Footer className="my-3">
            <Button
              variant="primary"
              onClick={(e) => {
                setOrder()
              }}
              className="btn bg-primary bg-gradient text-white btn_submit-modal"
            >
              Submit
            </Button>
            <Button variant="danger" onClick={handleCloseOrderModal}>
              Close
            </Button>
          </Modal.Footer>
        ) : null}
      </Modal>
    </>
  )
}

export default Ordermodal
