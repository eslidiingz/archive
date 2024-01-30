import Accordion from "react-bootstrap/Accordion";
import CiButton from "./button/ButtonBootstrap";
import CodeButtonComponents from "./button/ButtonStyleComponents";
import InputStyleComponents from "./InputStyleComponenets";

function CiMainInfo() {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Button</Accordion.Header>
        <Accordion.Body>
          <CiButton />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Button Style Components</Accordion.Header>
        <Accordion.Body>
          <CodeButtonComponents />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Input Style Components</Accordion.Header>
        <Accordion.Body>
          <InputStyleComponents />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default CiMainInfo;
