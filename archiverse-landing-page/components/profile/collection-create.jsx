import { Row, Col, Button } from "react-bootstrap";
import Search from "../../components/form/search";
import Select from "../../components/form/select";
import CardExplore from "../../components/card/CardExplore";
import { useEffect } from "react";
import { useCallback } from "react";
import { getCollection } from "../../models/Collection";
import { useState } from "react";
import { shortWallet } from "../../utils/misc";

function SetCollection({ isActive }) {
  const [collections, setCollections] = useState([]);
  const fetching = useCallback(async () => {
    const fetchingCollection = async () => {
      let collections = await getCollection();
      console.log("Collection : ", collections.data);
      setCollections(collections.data);
    };
    await fetchingCollection();
  }, []);
  useEffect(() => {
    fetching();
  }, []);
  return (
    <>
      <Row className="my-4">
        <Col md={6} className="my-2">
          <Search />
        </Col>
        <Col md={3} className="my-2">
          <Select selected="Single Items" />
        </Col>
        <Col md={3} className="my-2">
          <Select selected="Price" />
        </Col>
      </Row>
      <div className="row">
        {collections.map((item, index) => {
          return (
            <div className="col-12 col-md-6 col-xl-4 mb-4" key={index}>
              <CardExplore
                cover={item.coverUrl}
                data={item}
                // imgProfile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                name={shortWallet(item.creatorWallet)}
                // user="Warawrp"
                title={item.name}
                des={item.description ? item.description : "Description"}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default SetCollection;
