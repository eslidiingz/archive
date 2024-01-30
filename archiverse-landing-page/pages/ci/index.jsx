import React from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import CiMainInfo from "../../components/ci/Maininfo";
import DropdownStyleComponents from "../../components/stylecomponents/Dropdown";
import { text, text2 } from "../../components/data/test";

const Ci = (props) => {
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col sm={12}>
              <h1>Ci Document</h1>
            </Col>
            <Col sm={12}>
              <hr className="my-5" />
            </Col>
            <Col sm={12}>
              <CiMainInfo />
            </Col>
            <Col sm={12}>
              <DropdownStyleComponents items={text} />
              <DropdownStyleComponents items={text2} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Ci;
