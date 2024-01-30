import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Table, Tabs, Tab } from "react-bootstrap";
import Config from "../../configs/config";
import { useWalletContext } from "../../context/wallet";
import { getAssets, updateAsset } from "../../models/Asset";
import { getOfferList, updateOffer } from "../../models/Offer";
import { shortWallet } from "../../utils/misc";
import { smartContact } from "../../utils/providers/connector";
import ApproveOfferModal from "../form/ApproveOffer";
import GetSymbol from "../symbol/getsymbol";
import Swal from "sweetalert2";
import useLoading from "../../hooks/useLoading";
import ButtonState from "../buttons/ButtonLoading";
import { useTokenListStore } from "../../stores/tokenList";
import { parseEther } from "ethers/lib/utils";

function SetOffer() {
  const { wallet } = useWalletContext();
  const [offerReceive, setOfferReceive] = useState([]);
  const [makeOfferTo, setMakeOfferTo] = useState([]);
  const [isOpenModalApprove, setIsOpenModalApprove] = useState(false);
  const [offerDataOnModal, setOfferDataOnModal] = useState({});
  const { toggle, loading } = useLoading();

  const { tokenList } = useTokenListStore();

  const init = useCallback(() => {
    const fetchingOfferReceive = async () => {
      let offerWhere = `{ownerAppExp: {_gte: "now()"}, isActive: {_eq: true}, offerTo: {_eq: "${wallet}"}}`;
      const result = await getOfferList(offerWhere);
      console.log("Offer Receive : ", result.data);
      setOfferReceive(result.data);
    };
    const fetchingMakeOffer = async () => {
      let offerWhere = `{offerAccExp: {_gte: "now()"}, ownerAppExp: {_gte: "now()"}, isActive: {_eq: true}, offerer: {_eq: "${wallet}"}}`;
      const result = await getOfferList(offerWhere);
      console.log("Offer Make : ", result.data);
      setMakeOfferTo(result.data);
    };
    fetchingOfferReceive();
    fetchingMakeOffer();
  }, []);
  const confirmOffer = async (offerData) => {
    console.log("Offer DATA : ", offerData);
    toggle(offerData, true);
    try {
      const marketContract = smartContact(
        Config.MARKETPLACE_CA,
        Config.MARKETPLACE_ABI
      );

      console.log(tokenList);
      const _token = tokenList.filter(
        (_item) =>
          _item.attributes.address.toLowerCase() ===
          offerData.tokenAddress.toLowerCase()
      )[0].attributes;

      let result;
      if (_token.is_native) {
        const value = {
          value: parseEther(offerData.offerPrice + ""),
        };
        const acceptOfferTx = await marketContract.offererAcceptOffer(
          offerData.offerId,
          offerData.offerTo,
          value
        );

        result = await acceptOfferTx.wait();
      } else {
        const acceptOfferTx = await marketContract.offererAcceptOffer(
          offerData.offerId,
          offerData.offerTo
        );

        result = await acceptOfferTx.wait();
      }

      if (result) {
        // remove all offer to this asset & update isAccept on offer
        const offerWhere = `{
                      offerTo: {_eq: "${offerData.offerTo}"},
                      tokenId: {_eq: ${offerData.tokenId}},
                      isActive: {_eq: true},
                      nftContract: {_eq: "${offerData.nftContract}"},
                      offerId: {_neq: ${offerData.offerId}},
                  }`;
        const offerAcceptWhere = `{
                      offerTo: {_eq: "${offerData.offerTo}"},
                      tokenId: {_eq: ${offerData.tokenId}},
                      isActive: {_eq: true},
                      nftContract: {_eq: "${offerData.nftContract}"},
                      offerId: {_eq: ${offerData.offerId}}
                  }`;
        const offerSet = `isActive: false`;
        const offerAcceptSet = `isAccept: true, isActive: false`;
        const updateOfferTx = await updateOffer(offerSet, offerWhere);
        const updateOfferAcceptTx = await updateOffer(
          offerAcceptSet,
          offerAcceptWhere
        );
        // update asset owner
        const assetWhere = `{
                      nftAddress: {_eq: "${offerData.nftContract}"},
                      tokenId: {_eq: ${offerData.tokenId}}
                  }`;
        const assetSet = `owner: "${offerData.offerer}"`;
        const updateAssetTx = await updateAsset(assetSet, assetWhere);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        Swal.fire("Error", "Transaction fail", "error");
        toggle(offerData, false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Transaction fail", "error");
      toggle(offerData, false);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <Row className="exp-tab px-3">
        <Tabs
          defaultActiveKey="Offer Received"
          id="main-tab"
          className="mb-3 px-0"
        >
          <Tab eventKey="Offer Received" title="Offer Received">
            <Col md={12} className="exp-table px-0">
              <div className="table-responsive">
                <Table borderless responsive hover>
                  <thead className="text-center">
                    <tr className="bd-bottom  align-middle">
                      <th className="py-3 ps-3 ">
                        <p className="mb-0 ">Item</p>
                      </th>
                      <th className="py-3 ps-3 ">
                        <p className="mb-0 ">Token Id</p>
                      </th>
                      <th className="py-3">
                        <p className="mb-0 ">Offer Price</p>
                      </th>
                      {/* <th className="py-3" ><p className="mb-0 " >offer with token</p></th> */}
                      {/* <th className="py-3" ><p className="mb-0 " >Floor Difference</p></th> */}
                      <th className="py-3">
                        <p className="mb-0 ">From</p>
                      </th>
                      <th className="py-3">
                        <p className="mb-0 ">Expiration</p>
                      </th>
                      <th className="py-3">
                        <p className="mb-0 ">Action</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {offerReceive.length == 0 && (
                      <tr>
                        <td colSpan={6}>
                          <i>No data</i>
                        </td>
                      </tr>
                    )}
                    {offerReceive.map((item, index) => {
                      return (
                        <tr key={index} className="align-middle">
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {shortWallet(item.nftContract)}
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">{item.tokenId}</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {item.offerPrice.toLocaleString() + " "}
                              <GetSymbol
                                address={item.tokenAddress}
                              ></GetSymbol>
                            </p>
                          </td>
                          {/* <td className="pt-4 pb-3">
                                                        <p className="mb-0 ">{shortWallet(item.tokenAddress) ?? "-"}</p>
                                                    </td> */}
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {shortWallet(item.offerer)}
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {dayjs(item.ownerAppExp).format("DD MMM YYYY") +
                                " at " +
                                dayjs(item.ownerAppExp).format("HH:mm")}
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            {!item.isOwnerApprove && (
                              <button
                                className="btn btn-primary color-1 w-100"
                                onClick={() => {
                                  setIsOpenModalApprove(!isOpenModalApprove);
                                  setOfferDataOnModal(item);
                                }}
                              >
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Tab>
          <Tab eventKey="Offer Made" title="Offer Made">
            <Col md={12} className="exp-table px-0">
              <div className="table-responsive">
                <Table borderless responsive hover>
                  <thead className="text-center">
                    <tr className="bd-bottom  align-middle">
                      <th className="py-3 ps-3 ">
                        <p className="mb-0 ">Item</p>
                      </th>
                      <th className="py-3 ps-3 ">
                        <p className="mb-0 ">Token Id</p>
                      </th>
                      <th className="py-3">
                        <p className="mb-0 ">Offer Price</p>
                      </th>
                      {/* <th className="py-3" ><p className="mb-0 " >Offer with token</p></th> */}
                      {/* <th className="py-3" ><p className="mb-0 " >Floor Difference</p></th> */}
                      <th className="py-3">
                        <p className="mb-0 ">To</p>
                      </th>
                      <th className="py-3">
                        <p className="mb-0 ">Expiration</p>
                      </th>
                      <th className="py-3">
                        <p className="mb-0 ">Action</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {makeOfferTo.length == 0 && (
                      <tr>
                        <td colSpan={6}>
                          <i>No data</i>
                        </td>
                      </tr>
                    )}
                    {makeOfferTo.map((item, index) => {
                      return (
                        <tr key={index} className="align-middle">
                          {console.log(item)}
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {shortWallet(item.nftContract)}
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">{item.tokenId}</p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {item.offerPrice.toLocaleString() + "  "}
                              <GetSymbol address={item.tokenAddress} />
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {shortWallet(item.offerTo)}
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            <p className="mb-0 ">
                              {dayjs(item.ownerAppExp).format("DD MMM YYYY") +
                                " at " +
                                dayjs(item.ownerAppExp).format("HH:mm")}
                            </p>
                          </td>
                          <td className="pt-4 pb-3">
                            {item.isOwnerApprove && (
                              <ButtonState
                                style={"btn btn-primary color-1 w-100"}
                                loading={
                                  loading.index === item &&
                                  loading.status === true
                                }
                                onFunction={() => confirmOffer(item)}
                                text={"Confirm"}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Tab>
        </Tabs>
      </Row>
      <Modal
        show={isOpenModalApprove}
        onHide={() => setIsOpenModalApprove(!isOpenModalApprove)}
        size="lg"
      >
        <ApproveOfferModal offerData={offerDataOnModal} />
      </Modal>
    </>
  );
}
export default SetOffer;
