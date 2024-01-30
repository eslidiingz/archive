import React, {useState} from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import {Form} from "react-bootstrap"
import Swal from "sweetalert2"
import {makeOffer} from "../../utils/contracts/BWNFTMarket"
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker"

function Offermodal({
  showOfferModal,
  tokenid,
  contractAddress,
  handleCloseOfferModal,
  setLoading,
  loading,
  fetchAccount,
}) {
  const [price, setPrice] = useState(0)
  const [endDate, setEndDate] = useState(0)

  const createOffer = async () => {
    try {
      if (await fetchAccount()) {
        if (endDate > new Date() && price > 0) {
          setLoading(true)
          const result = await makeOffer(
            tokenid,
            price.toString(),
            contractAddress,
            Math.floor(endDate.getTime() / 1000).toString()
          )
          if (result) {
            setLoading(false)
            handleCloseOfferModal()
            Swal.fire(
              "Create Offer",
              "Create Offer, Successfully Offer!!",
              "success"
            ).then((e) => {
              location.reload()
            })
          }
        } else {
          Swal.fire("Warning", "Make Offer, Invalid Input", "warning")
          return
        }
      } else {
        Swal.fire(
          "Warning",
          "New User, Please register to become user",
          "warning"
        ).then((e) => {
          window.location = "/profile/?tab=my-profile"
        })
        return
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      Swal.fire("Error", "Offer NFT, Transaction Error!!", "error")
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

  const handleEndDate = async (e) => {
    console.log(new Date(e.target.value))
    if (new Date() < new Date(e.target.value)) {
      setEndDate(new Date(e.target.value))
    } else {
      setEndDate(new Date())
    }
  }

  return (
    <>
      <Modal
        show={showOfferModal}
        onHide={handleCloseOfferModal}
        className="layout_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Offer</Modal.Title>
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
            <Form.Group className="mt-3" controlId="formBasicUsername">
              <Form.Label className="topic_modal">Price (BWC)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Price (BWC)"
                className="input-fix"
                onChange={(e) => {
                  handlePrice(e)
                }}
              />
              <label
                htmlFor="date"
                className="col-10 col-form-label topic_modal"
              >
                Offer Ends At
                <p>(Please Enter Future Date and Time)</p>
              </label>
              <div>
                {/* <DateTimePicker
                  onChange={(e) => {
                    handleEndDate(e)
                  }}
                  value={endDate}
                /> */}
                <input
                  onChange={(e) => {
                    handleEndDate(e)
                  }}
                  type="datetime-local"
                ></input>
              </div>
            </Form.Group>
          )}
        </Modal.Body>
        {loading === false ? (
          <Modal.Footer className="mb-3">
            <Button
              variant="primary"
              onClick={(e) => {
                createOffer()
              }}
              className="btn bg-primary bg-gradient text-white btn_submit-modal"
            >
              Submit
            </Button>
            <Button variant="danger" onClick={handleCloseOfferModal}>
              Close
            </Button>
          </Modal.Footer>
        ) : null}
      </Modal>
    </>
  )
}

export default Offermodal
