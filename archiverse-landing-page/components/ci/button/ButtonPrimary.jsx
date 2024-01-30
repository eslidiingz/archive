import { Container, Row, Col, Button } from "react-bootstrap";

function CodeButtonPrimary(props) {
  return (
    <>
      <Row className="w-100">
        <Col lg={2} className="d-flex align-items-center">
          <Button variant="primary w-100">
            <p className="px-5">Primary</p>
          </Button>
        </Col>
        <Col lg={10}>
          <p className="ci-txt-topic-detail">Code</p>
          <span className="token tag">
            <span className="token tag">
              <span className="token punctuation">&lt;</span>Button
            </span>
            <span className="token attr-name">variant</span>
            <span className="token attr-value">
              <span className="token punctuation attr-equals">=</span>
              <span className="token punctuation">&quot;</span>
              <span className="tokencode">primary</span>
              <span className="token punctuation">&quot;</span>
              <span className="token attr-name">className</span>
              <span className="token punctuation attr-equals">=</span>
              <span className="token punctuation">&quot;</span>
              <span className="tokencode">px-5</span>
              <span className="token punctuation">&quot;</span>
              <span className="token punctuation">&gt;</span>
              <span className="token tag">
                <span className="token punctuation">&lt;</span>p
              </span>
              <span className="token punctuation">&gt;</span>
              <span className="token punctuation">Primary</span>
              <span className="token tag">
                <span className="token punctuation">&lt;/</span>p
              </span>
              <span className="token punctuation">&gt;</span>
            </span>
            <span className="token tag">
              <span className="token punctuation">&lt;/</span>Button
              <span className="token punctuation">&gt;</span>
            </span>
          </span>
        </Col>
      </Row>
    </>
  );
}

export default CodeButtonPrimary;
