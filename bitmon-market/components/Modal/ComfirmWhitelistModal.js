import { Modal, Spinner, Table } from "react-bootstrap";

const ConfirmWhitelistModal = ({activeTab, data, onWallet, setWhitelists, onClose, show}) => {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" className="profile-set" size="lg" centered>
      <Modal.Header closeButton={!show.disableButton}>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <h4 className="text-uppercase">Confirm whitelist</h4>
      {console.log(data)}
        <div className="d-flex align-items-center justify-content-center">
          <p className="mb-0">TYPE: {activeTab}</p>
          {/* <img src={"/assets/img/land/L1.webp"} alt="" className="w-25 p-2"/> */}
        </div>
        <img src={"/assets/img/stat/Layer 8 copy.webp"} className="w-75 my-4"/> 

        <div className="fix-Table-modal-scroll">
            <Table hover responsive bordered className="">
                <thead>
                      <tr className="text-white">
                          <th className="background-td">Wallet </th>
                          <th className="background-td">Box</th>
                          <th className="background-td">Amount</th>
                      </tr>
                  </thead>
                  <tbody className="border-none">
                      {Array.isArray(data) &&
                       data.map(({address, amount, boxType})=> {
                        return(
                            <tr>
                            <td>
                                <div className="text-white">
                                {onWallet(address)}
                                </div>
                            </td>
                            <td>
                                <div className="text-white">
                                  
                                  {activeTab === "MONSTER" && boxType}
                                  {activeTab === "LAND" && "LAND"}
                                  {activeTab === "ITEM" && "ITEM"}
                                  
                                </div>
                            </td>
                            <td>
                                <div className="text-white">
                                  {amount}
                                </div>
                            </td>
                        </tr>
                          )
                        })
                      }
                      
                  </tbody>
            </Table>
        </div>
       
        <div>
          <button 
          className="btn btn-img btn-green px-4 mt-3 text-uppercase" 
          type="button" 
          disabled={show.disableButton} 
          onClick={() => setWhitelists()}
          >
            {show.disableButton ? (
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

export default ConfirmWhitelistModal;
