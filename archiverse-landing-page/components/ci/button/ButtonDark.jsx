import { Container, Row, Col, Button } from "react-bootstrap";

function CodeButtonDark() {
  return (
    <>
      <Row className="w-100 my-3">
        <Col lg={2}>
          <Button variant="dark w-100">
            <p className="px-5">Dark</p>
          </Button>
        </Col>
        <Col lg={10}>
          <p className="ci-txt-topic-detail">Code</p>
          <span className="token tag">
            <span className="token tag">
              <span className="token punctuation">&lt;</span>Button
            </span>{" "}
            <span className="token attr-name">variant</span>
            <span className="token attr-value">
              <span className="token punctuation attr-equals">=</span>
              <span className="token punctuation">&quot;</span>
              <span className="tokencode">dark</span>
              <span className="token punctuation">&quot;</span>{" "}
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
              <span className="token punctuation">dark</span>
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

export default CodeButtonDark;
