import Search from "/components/form/search";
import Select from "/components/form/select";

import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

import { useWalletContext } from "/context/wallet";
import { getTransactions } from "/models/Transaction";
import { shortWallet } from "/utils/misc";
import { dateFromNowWithDateType } from "/utils/time";

function SetActivity({ isActive }) {
  const { wallet } = useWalletContext();

  const [options, setOptions] = useState({
    eventTypes: [
      {
        value: 0,
        label: "Create Order",
      },
      {
        value: 1,
        label: "Buy Order",
      },
      {
        value: 2,
        label: "Cancel Order",
      },
      {
        value: 3,
        label: "Safe mint",
      },
      {
        value: 4,
        label: "Accept Bidding",
      },
    ],
    orderBy: [
      {
        value: "desc",
        label: "Newest Listed",
      },
      {
        value: "asc",
        label: "Oldest Listed",
      },
    ],
  });

  const [rows, setRows] = useState([]);

  const [filter, setFilter] = useState({
    keyword: "",
    eventTypes: "",
    orderBy: "desc",
  });
  const handleFilterChange = (event) => {
    if (event.target.type == "checkbox") {
      setFilter((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.checked,
      }));
    } else {
      setFilter((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handleFetch = async () => {
    let where = `
			{
				_and: {
					_or: [
						{to: {_eq: "${wallet}"}},
						{from: {_eq: "${wallet}"}}
					], 
					${
            filter.keyword &&
            `
							asset: {
								_and: {
									nftAddress: {_like: "%${filter.keyword}%"}
								}
							}
						`
          }
					${filter.eventTypes ? `, txType: {_eq: ${filter.eventTypes}}` : ``}
				}
			}
		`;
    let { data } = await getTransactions(where, filter.orderBy);

    setRows(data);
  };

  useEffect(() => {
    handleFetch();
  }, [filter]);

  const init = useCallback(async () => {
    await handleFetch();
  }, []);

  useEffect(() => {
    if (wallet) init();
  }, [wallet]);

  return (
    <>
      <Row className="my-4">
        <Col md={6} className="my-2">
          <Search
            name="keyword"
            filter={filter}
            handleFilterChange={handleFilterChange}
          />
        </Col>
        <Col md={3} className="my-2">
          {options.eventTypes.label}
          <Select
            placeholder="Event Type"
            name="eventTypes"
            options={options.eventTypes}
            filter={filter}
            handleFilterChange={handleFilterChange}
          />
        </Col>
        <Col md={3} className="my-2">
          <Select
            placeholder="Sorting"
            name="orderBy"
            options={options.orderBy}
            filter={filter}
            handleFilterChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Row className="exp-table">
        <Table responsive borderless hover className=" text-white">
          <thead>
            <tr className="bd-bottom text-white text-center">
              <th>Event type</th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Token ID</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
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
              return (
                <tr key={index} className="text-center">
                  <td>
                    <div className="td-width">
                      {options.eventTypes[item.txType]?.label}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center td-width">
                      {/* <img className="mx-1 w-img-td" src="/assets/rsu-image/user/Ellipse.png" /> */}
                      <div>
                        {item?.assets[0]?.nftAddress &&
                          shortWallet(item?.assets[0]?.nftAddress)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className=" d-flex td-width">
                      {/* <img className="mx-2" src="/assets/swaple/icon-omcoin.webp" /> */}
                      {item.price ? item.price.toLocaleString() : "-"}
                    </div>
                  </td>
                  <td>
                    <div className=" d-flex  td-width">
                      {item.asset_ids?.length}
                    </div>
                  </td>
                  <td>
                    <div className=" d-flex  td-width">
                      {item.assets.length > 0
                        ? item.assets.map((a) => a.tokenId).join(",")
                        : "-"}
                    </div>
                  </td>
                  <td>
                    <div className=" d-flex cci-green td-width">
                      <div>{item.from ? shortWallet(item.from) : "-"}</div>
                      {/* <img className="mx-2" src="/assets/rsu-image/icons/verify.svg" /> */}
                    </div>
                  </td>
                  <td>
                    <div className=" d-flex cci-green td-width">
                      {item.to ? shortWallet(item.to) : "-"}
                    </div>
                  </td>
                  <td>
                    <div className=" d-flex cci-green td-width">
                      {dateFromNowWithDateType(item.createdAt)}
                      {/* <img className="mx-2" src="/assets/rsu-image/icons/document.svg" /> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </>
  );
}
export default SetActivity;
