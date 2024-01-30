
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { Table, Tabs, Tab} from "react-bootstrap";
import Swal from "sweetalert2";
import Accept from "../../components/modal/Accept";
import Config from "../../configs/config";
import { useWalletContext } from "../../context/wallet";
import { getBidding, getMarketplaces, updateBidding } from "../../models/Marketplace";
import { shortWallet } from "../../utils/misc";
import { smartContact } from "../../utils/providers/connector";

function Setbiding() {
    const [showAcceptModal, setAcceptModal] = useState(false);
    const { wallet } = useWalletContext();
    const [bidList, setBidList] = useState([]);
    const router = useRouter();
    const handleCloseAcceptModal = () => {
        setAcceptModal(false);
    };
    const init = useCallback(() => {
        function uniqByKeepLast(a, key) {
            return [
                ...new Map(
                    a.map(x => [key(x), x])
                ).values()
            ]
        }
        const fetchBidding = async () => {
            const where = `{bidder: {_eq: "${wallet}"}, isRefund: {_eq: false}}`;
            let bids = await getBidding(where);
            bids = bids.filter(item => wallet != item.orders.sellerWallet);
            const uniqBids = uniqByKeepLast(bids, it => it.orderId);
            console.log(uniqBids)
            setBidList(uniqBids);
        }
        fetchBidding();
    }, [])
    const refundBidding = async (orderId, bidData) => {
        const marketContract = smartContact(Config.MARKETPLACE_CA, Config.MARKETPLACE_ABI);
        try {
            const latestBid = await marketContract.getLatestBidder(orderId);
            const bidId = latestBid.bidId.toNumber();
            const marketData = await getMarketplaces(`{orderId: {_eq: ${orderId}}}`);
            const errVal = {
                text: `Transaction fail`,
                isErr: false
            };
            if(marketData.length == 0) {errVal.text = `Auction nout found`; errVal.isErr = true};
            if(latestBid.bidder === wallet && latestBid.isAccept == false && marketData.data[0].isActive){
                errVal.text = `Accept bidding before refund`;
                errVal.isErr = true;
            }
            if(errVal.isErr){
                Swal.fire("Error", errVal.text, 'error');
                return;
            }
            const refundsTx = await marketContract.refundBidding(orderId);
            const result = await refundsTx.wait();
            if(result){
                const bidsWhere = `{orderId: {_eq: ${orderId}}, bidder: {_eq: "${wallet}"}}`;
                const bidsSet = `isRefund: true`;
                const updateBiddingTx = await updateBidding(bidsSet, bidsWhere);
                console.log(updateBiddingTx);
                Swal.fire("Success", "Refunds success", "success");
                setTimeout(() => {
                    location.reload();
                }, 1000)
            } 
            
        } catch (e){
            console.log(e);
            Swal.fire("Error", "Transaction fail", "error");
        }
    }
    useEffect(() => {
        init()
    }, [])

    return (
        <>
                <Row className="exp-tab px-3">
                    <Tabs defaultActiveKey="Biding list" id="main-tab" className="mb-3 px-0">
                        <Tab eventKey="Biding list" title="Bidding list" >
                            <Col md={12} className="exp-table px-0">
                                <div className="table-responsive">
                                    <Table borderless responsive hover >
                                        <thead>
                                        <tr className="bd-bottom text-center" >
                                            <th className="py-3 ps-3 " ><p className="mb-0" >Item</p></th>
                                            <th className="py-3 ps-3 " ><p className="mb-0" >Token ID</p></th>
                                            <th className="py-3" ><p className="mb-0" >Bid Price</p></th>
                                            {/* <th className="py-3" ><p className="mb-0" >USD Unit Price</p></th> */}
                                            {/* <th className="py-3" ><p className="mb-0" >Floor Difference</p></th> */}
                                            <th className="py-3" ><p className="mb-0" >To</p></th>
                                            {/* <th className="py-3" ><p className="mb-0" >Expiration</p></th> */}
                                            {/* <th className="py-3" ><p className="mb-0" >Received</p></th> */}
                                            <th className="py-3" ><p className="mb-0" >Actions</p></th>
                                        </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            {
                                                bidList.length == 0 && (
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <i>No data</i>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            {
                                                bidList.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td className="pt-4 pb-3">
                                                            {item.orders?.nftContract ? shortWallet(item.orders?.nftContract) :  "-"}
                                                        </td>
                                                        <td className="pt-4 pb-3">
                                                            {item.orders?.tokenId}
                                                        </td>
                                                        <td className="pt-4 pb-3">
                                                            {item.bidPrice}
                                                        </td>
                                                        <td className="pt-4 pb-3">
                                                            {item.orders?.sellerWallet ? shortWallet(item.orders?.sellerWallet) : "-"}
                                                        </td>
                                                        <td className="pt-4 pb-3">
                                                        <button className="btn  btn-primary color-1 w-50 p-1" type="btn" onClick={() => router.push(`/assets/${item.orders.nftContract}/${item.orders.tokenId}`)}>view</button>
                                                            {
                                                                new Date(item.orders.acceptTime).getTime() >= new Date().getTime() &&
                                                                <>
                                                                    <button
                                                                        className="btn btn-primary p-1 color-1 w-50"
                                                                        onClick={() => refundBidding(item.orders.orderId, item)}
                                                                    >
                                                                        refund
                                                                    </button>
                                                                </>
                                                            }
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Tab>
                    </Tabs>
                </Row>
                <Accept
                    onClose={handleCloseAcceptModal}
                    show={showAcceptModal}
                />
        </>
    )
  }
  export default Setbiding
  