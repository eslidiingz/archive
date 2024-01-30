import { Container, Row, Col, Button, Accordion } from "react-bootstrap";
import CodeButtonPrimary from "./ButtonPrimary";
import CodeButtonSecondary from "./ButtonSecondary";
import CodeButtonSuccess from "./ButtonSuccess";
import CodeButtonInfo from "./Buttoninfo";
import CodeButtonDanger from "./ButtonDanger";
import CodeButtonLight from "./ButtonLight";
import CodeButtonDark from "./ButtonDark";

function CiButton(props) {
  return (
    <>
      <Col lg={12}>
        <CodeButtonPrimary />
        <CodeButtonSecondary />
        <CodeButtonSuccess />
        <CodeButtonInfo />
        <CodeButtonDanger />
        <CodeButtonLight />
        <CodeButtonDark />
      </Col>
    </>
  );
}

export default CiButton;
