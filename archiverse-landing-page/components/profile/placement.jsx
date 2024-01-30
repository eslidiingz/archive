import Accept from "/components/modal/Accept";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Table, Tabs, Tab,Button } from "react-bootstrap";

import { useWalletContext } from "/context/wallet";
import { getMarketplaces } from "/models/Marketplace";
import { shortWallet } from "/utils/misc";
import dayjs from "dayjs";

function Setplacement({ isActive }) {

	const router = useRouter();

	const { wallet } = useWalletContext();

	const [rows, setRows] = useState([])

	const [showAcceptModal, setAcceptModal] = useState(false);

	const handleCloseAcceptModal = () => {
		setAcceptModal(false);
	};

	const handleFetch = async () => {

		let where = `
			{
				isActive: {_eq: true},
				sellerWallet: {_eq: "${wallet}"}
			}
		`;
		let { data } = await getMarketplaces(where);

		setRows(data);

	};

	const init = useCallback(async () => {
		await handleFetch();
	}, []);

	useEffect(() => {
		if( wallet ) init();
	}, [wallet])

	return (
		<>
			<Row className="exp-tab px-3">
				<Tabs defaultActiveKey="Placement list" id="main-tab" className="mb-3 px-0">
					<Tab eventKey="Placement list" title="Placement list" >
						<Col md={12} className="exp-table px-0">
							<div className="table-responsive">
								<Table borderless responsive hover >
									<thead>
										<tr className="bd-bottom text-white text-center" >
											<th className="py-3 ps-3 " ><p className="mb-0 " >Item</p></th>
											<th className="py-3 ps-3 " ><p className="mb-0 " >Token Id</p></th>
											<th className="py-3" ><p className="mb-0 " >Price</p></th>
											<th className="py-3" ><p className="mb-0 " >Current Price</p></th>
											{/* <th className="py-3" ><p className="mb-0 " >Floor Difference</p></th> */}
											<th className="py-3" ><p className="mb-0 " >From</p></th>
											<th className="py-3" ><p className="mb-0 " >Expiration</p></th>
											<th className="py-3" ><p className="mb-0 " >Type</p></th>
											<th className="py-3" ><p className="mb-0 " >Actions</p></th>
										</tr>
									</thead>
									<tbody>
										{rows.length == 0 && (
											<tr>
												<td colSpan={8} align="center">
													<i>No data</i>
												</td>
											</tr>
										)}
										{rows.map((item, index) => {
											return <tr key={index} className="text-center align-middle">
												<td className="pt-4 pb-3 ps-3">
													<p className="mb-0 ">{shortWallet(item.nftContract)}</p>
												</td>
												<td className="pt-4 pb-3 ps-3">
													<p className="mb-0 ">{item.tokenId}</p>
												</td>
												<td className="pt-4 pb-3">
													<p className="mb-0 ">{item.price.toLocaleString()} {item.symbol}</p>
												</td>
												<td className="pt-4 pb-3">
													<p className="mb-0 ">{item.currentPrice.toLocaleString()} {item.symbol}</p>
												</td>
												{/* <td className="pt-4 pb-3">
													<p className="mb-0 ">text</p>
												</td>
												<td className="pt-4 pb-3">
													<p className="mb-0 ">text</p>
												</td> */}
												<td className="pt-4 pb-3">
													<p className="mb-0 ">{shortWallet(item.sellerWallet)}</p>
												</td>
												{/* <td className="pt-4 pb-3">
													<p className="mb-0 ">text</p>
												</td> */}
												<td className="pt-4 pb-3">
													<p className="mb-0 text-white text-center">{item.orderType == 0 ? <i>-</i> :  (item.expiration ? dayjs(item.expiration).format("YYYY-MMM-DD") : "-")}</p>
												</td>
												<td className="pt-4 pb-3">
													<p className="mb-0 ">{item.orderType == 0 ? "Sell" : "Auction"}</p>
												</td>
												<td className="pt-4 pb-3">
													<button className="btn btn-primary color-1 w-100 p-1" type="btn" onClick={() => router.push(`/assets/${item.nftContract}/${item.tokenId}`)}>View</button>
												</td>
											</tr>
										})}
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
export default Setplacement
