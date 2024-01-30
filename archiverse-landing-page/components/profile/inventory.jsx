import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import Search from "/components/form/search";
import Select from "/components/form/select";
import CardHidden from "/components/card/CardHidden";
import { useWalletContext } from "/context/wallet";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { myNftList, smartContractAsset } from "/models/Asset";
import { getCollection } from "/models/Collection";
import CardTrending from "../card/CardTrending";
import CardExplore from "../cardExplore/CardExplore";

function SetCreate(props) {
  const { wallet } = useWalletContext();

  const [rows, setRows] = useState([]);

  const [options, setOptions] = useState({
    collections: [],
  });

  const [filter, setFilter] = useState({
    keyword: "",
    collection: null,
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

  const handleFetchOptions = async () => {
    let where = `{
			_and: {
				creatorWallet: {_eq: "${wallet}"}
			}
		}`;
    let collections = await getCollection(where);

    const results = await Promise.all(
      collections.data.map(async (item, index) => {
        return {
          value: item.id,
          label: item.name,
        };
      })
    );

    setOptions((prevState) => ({
      ...prevState,
      collections: results,
    }));
  };

  const handleFetch = async () => {
    let where = `{
			_and: {
				owner: {_eq: "${wallet}"},
        isArchiverse: {_eq: true},
				${
          filter.keyword
            ? `, metadata: {_cast: {String: {_like: "%${filter.keyword}%"}}}`
            : ``
        }
				${filter.collection ? `, collectionId: {_eq: "${filter.collection}"}` : ``}
			}
		}`;
    let rows = await myNftList(where);
    console.log(rows);
    setRows(rows);
  };

  useEffect(() => {
    handleFetch();
  }, [filter]);

  const init = useCallback(async () => {
    await handleFetchOptions();
    await handleFetch();
  }, []);

  useEffect(() => {
    if (wallet) init();
  }, [wallet]);

  return (
    <>
      <Row className="my-4">
        <Col md={6} className="my-2"></Col>
        <Col md={3} className="my-2"></Col>
        <Col md={3} className="my-2 text-end">
          <Link href="/Create">
            <Button variant="secondary px-4">Create </Button>
          </Link>
        </Col>
      </Row>

      <Row className="my-4">
        <Col sd={12} md={6} className="my-2">
          <Search
            name="keyword"
            filter={filter}
            handleFilterChange={handleFilterChange}
          />
        </Col>

        <Col sd={12} md={6} className="my-2">
          <select
            className="form-select input-search-set"
            aria-label="Default select example"
            name="collection"
            value={filter.collection}
            onChange={(e) => {
              handleFilterChange(e);
            }}
          >
            <option selected>Choose Collection</option>
            {options.collections.map((item, index) => (
              <option key={`collection-option-${index}`} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      <Row>
        {rows.length == 0 && (
          <div className="text-center text-dark mt-2">
            <i>
              <h6>No data</h6>
            </i>
          </div>
        )}
        {rows.map((_item, index) => {
          return (
            <Col xl={4} md={6} className="my-2" key={index}>
              <CardExplore
                img={_item.metadata.image}
                title={_item.metadata.name}
                detail={_item.metadata.description}
                nftAddress={_item.nftAddress}
                tokenId={_item.tokenId}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
}
export default SetCreate;
