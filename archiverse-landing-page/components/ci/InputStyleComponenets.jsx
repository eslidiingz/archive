import { Container, Row, Col, Button } from "react-bootstrap";
import { InputPrimary } from "../stylecomponents/Form";

function InputStyleComponents(props) {
  return (
    <>
      <Row className="w-100 my-3">
        <Col lg={12}>
          <p className="ci-txtsubmenu mb-1">Input Style Components</p>
          <InputPrimary placeholder="test" />
          <p className="ci-txt-topic-detail my-3">Code</p>
          <pre className="language-html">
            <code className="language-html">
              <span className="token comment">
                &lt;! -- import Style Components -- &gt;
              </span>
              <br />
              <span className="token punctuation">
                import
                <span className="token attr-value">
                  {"{"}InputPrimary{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Form&quot;;
              </span>
              <br />

              <span className="token tag">
                <span className="token punctuation">&lt;</span>
                InputPrimary <span className="token punctuation">/&gt;</span>
              </span>
            </code>
          </pre>
        </Col>
      </Row>
    </>
  );
}

export default InputStyleComponents;
