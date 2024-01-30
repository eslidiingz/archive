import Search from "/components/form/search";
import Select from "/components/form/select";
import CardExplore from "/components/card/CardExplore";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";

import { getCollection } from "/models/Collection";
import { shortWallet } from "/utils/misc";

import { useWalletContext } from "/context/wallet";

const SetCollection = ({ isActive }) => {
  const { wallet, walletAction } = useWalletContext();

  const [rows, setRows] = useState([]);

  const [filter, setFilter] = useState({
    keyword: "",
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
    let where = `{
			_and: {
				creatorWallet: {_eq: "${wallet}"},
        isArchiverse: {_eq: true},
				${filter.keyword ? `, name: {_like: "%${filter.keyword}%"}` : ``}
			}
		}`;
    let collections = await getCollection(where);
    setRows(collections.data);
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
        <Col xl={9} lg={8} className="my-2">
          <Search
            name="keyword"
            filter={filter}
            handleFilterChange={handleFilterChange}
          />
        </Col>
        {/* <Col md={3} className="my-2"></Col> */}
        <Col xl={3} lg={4} className="my-2">
          <Link href="/collection/create">
            <Button variant="secondary px-3 w-100">Create Collection</Button>
          </Link>
        </Col>
      </Row>

      <div className="row">
        {rows.map((item, index) => {
          return (
            <div className="col-12 col-md-6 col-xl-4 mb-4" key={index}>
              <CardExplore
                cover={item.backgroundUrl || "/blank-profile.png"}
                image={item.coverUrl || "/blank-profile.png"}
                data={item}
                name={item.name}
                des={item.description ? item.description : "Description"}
              />
            </div>
          );
        })}
        {rows.length == 0 && (
          <div className="text-center text-dark mt-2">
            <i>
              <h6>No data</h6>
            </i>
          </div>
        )}
      </div>
    </>
  );
};

export default SetCollection;
