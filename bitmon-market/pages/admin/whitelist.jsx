import { useEffect, useState, useRef } from "react";
import {
  setWhiteListForUsers,
  hasCreateWhitelistRole,
} from "../../models/MysteryBoxWhitelist";
import ConfirmWhitelistModal from "../../components/Modal/ComfirmWhitelistModal";
import { formatAccount } from "../../utils/lib/utilities";
import Swal from "sweetalert2";
import { useWalletContext } from "../../context/wallet";
import Router from "next/router";
import { web3Modal, web3Provider } from "/utils/providers/connector";
import Config from "../../configs/config";

const Whitelist = () => {
  const { wallet } = useWalletContext();
  const [showConfirmWhitelistModal, setConfirmWhitelistModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [activeTab, setActiveTab] = useState("MONSTER");
  const [isAdmin, setAdminStat] = useState(false);

  const handleCloseConfirmWhitelistModal = () => {
    setConfirmWhitelistModal(false);
  };

  const initialize = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts) => {
          Router.reload();
          console.log('change account to', accounts);
        });
        checkAdminRole();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAdminRole = async () => {
    // console.log("aasdadasXXXX");
    try {
      let result = false;
      if (wallet) {
        result = await hasCreateWhitelistRole(wallet);
      } else {
        const _web3Modal = web3Modal();
        await _web3Modal.connect();
      }
      
      if (result === true) {
        setAdminStat(true);
      } else {
        window.location = "/";
      }
    } catch (err) {}
  };

  const setWhitelists = async () => {
    try {
      handleLoading();
      let addressArr = [],
        typesArr = [],
        boxTypeArr = [],
        amountArr = [];

      for (const item of rows) {
        addressArr.push(item.address);
        typesArr.push(item.types);
        boxTypeArr.push(item.boxType);
        amountArr.push(parseInt(item.amount));
      }

        // console.log(addressArr)
        // console.log(typesArr)
        // console.log(boxTypeArr)
        // console.log(amountArr)

      const result = await setWhiteListForUsers(
        addressArr,
        typesArr,
        boxTypeArr,
        amountArr
      );

      if (result) {
        Swal.fire("Success", "Whitelist has been granted.", "success");
        refreshInventoryItem();
      } else {
        Swal.fire("Warning", "Failed to grant whitelist.", "warning");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoading = async () => {
    Swal.fire({
      title: "Please Wait ...",
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const handleChangeActiveTab = async (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setRows([]);
    }
    console.log(wallet);
  };

  const handleAddress = (e, index) => {
    const value = e.target.value.trim();

    setRows((prevState) => {
      if(prevState[index]) prevState[index].address = value;
      return [...prevState];
    });

    // console.log(list, "handleValue");
  };

  const handleAmount = (e, index) => {
    const value = e.target.value;

    setRows((prevState) => {
      if(prevState[index]) prevState[index].amount = value;
      return [...prevState];
    });

    // console.log(list, "handleAmount");
  };

  const handleBox = (e, index) => {
    const value = e.target.value;

    setRows((prevState) => {
      if(prevState[index]) prevState[index].boxType = value;
      return [...prevState];
    });

    // console.log(list, "handleBox");
  };

  const addRow = () => {
    const rowDetail = {
      address: "",
      types: activeTab,
      boxType: "",
      amount: 1,
      isInvalid: {
        address: false,
        boxType: false,
        amount: false,
      }
    };

    setRows((prev) => ([...prev, rowDetail]));
  };

  const removeInputRow = (index) => {
    setRows((prevState) => ([...prevState.filter((row, idx) => idx !== index)]));
  };

  const validateFormInput = () => {
    try{
      let validated = true;

      for(let i = 0 ; i < rows.length ; i++){
        const isInvalid = {
          address: false,
          boxType: false,
          amount: false,
        };

        if(!rows[i].address?.trim?.()){
          isInvalid.address = true;
          validated = false;
        }

        if(rows[i].boxType?.trim?.() === ''){
          isInvalid.boxType = true;
          validated = false;
        }

        let amount = parseInt(rows[i].amount?.toString?.()?.trim?.());

        if(isNaN(amount) || amount < 1){
          isInvalid.amount = true;
          validated = false;
        }

        setRows((prevState) => {
          prevState[i].isInvalid = isInvalid;
          return [...prevState];
        });
      }

      return validated;
    }catch{
      return false;
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const validated = validateFormInput();

    if(!validated){
      return;
    }
    setConfirmWhitelistModal(true);
  };

  useEffect(() => {
    initialize();
  }, [activeTab, wallet]);

  return (
    <>
      {isAdmin && (
        // <form onSubmit={handleSubmitForm}>
          <div className="container ">
            <div className="row mt-4">
              <div className="col-6">
                <div className="input-group align-items-center">
                  <label>TYPE : </label>
                  <select
                    className="form-select form-select-sm ms-2"
                    style={{ maxWidth: "220px", border: "1px solid #ced4da" }}
                    name="_type"
                    required
                    defaultValue={activeTab}
                    value={activeTab}
                    onChange={(e) => handleChangeActiveTab(e.target.value)}
                  >
                    {console.log(activeTab, "CHECK ACTIVE")}
                    <option hidden disabled selected>
                      Select box
                    </option>
                    <option value="MONSTER">MONSTER</option>
                    <option value="LAND">LAND</option>
                    <option value="ITEM">ITEM</option>
                  </select>
                </div>
              </div>

              <div className="col-6 text-end">
                <button type="button" className="btn btn-info btn-sm" onClick={() => addRow()}>
                  Add Row
                </button>
              </div>

              <div className="col-12 my-4">
                <table className="table table-dark table-hover">
                  <thead>
                    <tr>
                      <th className="col-5">Wallet</th>
                      <th className="col-2">Box</th>
                      <th className="col-2">Amount</th>
                      <th className="col-1">Action</th>
                    </tr>
                  </thead>

                  {rows.length > 0 ? (
                    rows.map((item, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>
                              <input
                                name="_address"
                                type="text"
                                className={`form-control form-control-sm ${item.isInvalid.address ? 'is-invalid' : ''}`}
                                placeholder="wallet address"
                                required
                                value={item.address}
                                onChange={(e) => handleAddress(e, index)}
                              />
                            </td>

                            {activeTab === "MONSTER" && (
                              <td>
                                <select
                                test={item.boxType}
                                  name="_box"
                                  className={`form-select form-select-sm ${item.isInvalid.boxType ? 'is-invalid' : ''}`}
                                  required
                                  defaultValue={item.boxType}
                                  value={item.boxType}
                                  onChange={(e) => handleBox(e, index)}
                                >
                                  <option value="" hidden disabled selected>
                                    Select box
                                  </option>
                                  <option value="Immortal">Immortal</option>
                                  <option value="Legendary">Legendary</option>
                                  <option value="Epic">Epic</option>
                                  <option value="Rare">Rare</option>
                                  <option value="Common">Common</option>
                                </select>
                              </td>
                            )}

                            {activeTab === "LAND" && (
                              <td>
                                <select
                                  name="_box"
                                  className={`form-select form-select-sm ${item.isInvalid.boxType ? 'is-invalid' : ''}`}
                                  required
                                  defaultValue={item.boxType}
                                  value={item.boxType}
                                  onChange={(e) => handleBox(e, index)}
                                >
                                  <option value="" hidden disabled selected>
                                    Select box
                                  </option>
                                  <option value="0">LAND</option>
                                </select>
                              </td>
                            )}

                            {activeTab === "ITEM" && (
                              <td>
                                <select
                                  name="_box"
                                  className={`form-select form-select-sm ${item.isInvalid.boxType ? 'is-invalid' : ''}`}
                                  required
                                  defaultValue={item.boxType}
                                  value={item.boxType}
                                  onChange={(e) => handleBox(e, index)}
                                >
                                  <option value="" hidden disabled selected>
                                    Select box
                                  </option>
                                  <option value="1">ITEM</option>
                                </select>
                              </td>
                            )}

                            <td>
                              <input
                                name="_amount"
                                type="text"
                                className={`form-control form-control-sm ${item.isInvalid.amount ? 'is-invalid' : ''}`}
                                placeholder="Amount"
                                required
                                value={item.amount}
                                onChange={(e) => handleAmount(e, index)}
                              />
                            </td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeInputRow(index)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })
                  ) : (
                    <tbody></tbody>
                  )}

                  <tfoot>
                    <tr>
                      <td colSpan={5} className="text-end">
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={handleSubmitForm}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        // </form>
      )}
      <ConfirmWhitelistModal
        activeTab={activeTab}
        data={rows}
        onWallet={formatAccount}
        setWhitelists={setWhitelists}
        onClose={handleCloseConfirmWhitelistModal}
        show={showConfirmWhitelistModal}
      />
    </>
  );
};

export default Whitelist;
