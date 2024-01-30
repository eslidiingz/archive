import { Container, Row, Col, Button } from "react-bootstrap";
import { ButtonComponents } from "../../stylecomponents/Button";

const CodeButtonComponents = () => {
  return (
    <>
      <Row className="w-100 my-3">
        <Col lg={12}>
          <p className="ci-txtsubmenu mb-1">
            Button Style Components Primary + Button size secondary {"("} {"*"}
            width 140px {")"}
          </p>
          <ButtonComponents color="primary">
            <p>Btn primary</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">primary</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">Primary</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col xs={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components Primary + Button full size {"("} {"*"} width
            180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="primary">
            <p>Btn Primary</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">primary</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">Primary</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col xs={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-3">
          <p className="ci-txtsubmenu mb-1">
            Button Style Components Secondary + Button size secondary {"("}
            {"*"} width 145px {")"}
          </p>
          <ButtonComponents color="secondary">
            <p>Btn Secondary</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">secondary</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">Secondary</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col lg={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components Secondary + Button full size {"("} {"*"}
            width 180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="secondary">
            <p>Btn Secondary</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">secondary</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">Secondary</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col sm={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-3">
          <p className="ci-txtsubmenu mb-1">
            Button Style Components Secondary + Button size secondary {"("}
            {"*"} width 145px {")"}
          </p>
          <ButtonComponents color="dark">
            <p>Btn Dark</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">dark</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">Dark</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col lg={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components Dark + Button full size {"("} {"*"} width
            180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="dark">
            <p>Btn Dark</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">dark</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">Dark</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col sm={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-3">
          <p className="ci-txtsubmenu mb-1">
            Button Style Components Secondary + Button size secondary {"("}
            {"*"} width 145px {")"}
          </p>
          <ButtonComponents color="success">
            <p>Btn success</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">success</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">success</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col lg={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components success + Button full size {"("} {"*"} width
            180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="success">
            <p>Btn success</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">success</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">success</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col sm={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-3">
          <p className="ci-txtsubmenu mb-1">
            Button Style Components Secondary + Button size secondary {"("}
            {"*"} width 145px {")"}
          </p>
          <ButtonComponents color="danger">
            <p>Btn danger</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">danger</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">danger</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col lg={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components danger + Button full size {"("} {"*"} width
            180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="danger">
            <p>Btn danger</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">danger</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">danger</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col sm={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-3">
          <p className="ci-txtsubmenu mb-1">
            Button Style Components info + Button size secondary {"("} {"*"}
            width 145px {")"}
          </p>
          <ButtonComponents color="info">
            <p>Btn info</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">info</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">info</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col lg={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components info + Button full size {"("} {"*"} width
            180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="info">
            <p>Btn info</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">info</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">info</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col sm={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-3">
          <p className="ci-txtsubmenu mb-1">
            Button Style Components Light + Button size secondary {"("} {"*"}
            width 145px {")"}
          </p>
          <ButtonComponents color="light">
            <p>Btn light</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">light</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">light</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
        <Col lg={12}>
          <hr />
        </Col>
        <Col sm={12} className="mb-1">
          <p className="ci-txtsubmenu">
            Button Style Components light + Button full size {"("} {"*"} width
            180px {")"}
          </p>
        </Col>
        <Col lg={12}>
          <ButtonComponents fullsizebutton color="light">
            <p>Btn light</p>
          </ButtonComponents>
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
                  {"{"}ButtonComponents{"}"} {"*"} Custom Name Style Components
                  {"*"}
                </span>
                from &quot;StyleComponents/Button&quot;;
              </span>
              <br />
              <span className="token tag">
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>
                  ButtonComponents
                </span>
                <span className="token attr-name">color</span>
                <span className="token attr-value">
                  <span className="token punctuation attr-equals">=</span>
                  <span className="token punctuation">&quot;</span>
                  <span className="tokencode">light</span>
                  <span className="token punctuation">&quot;</span>
                </span>
                <span className="token attr-name">fullsizebutton</span>
                <span className="token attr-value">
                  <span className="token punctuation">&gt;</span>
                </span>
                <span className="token tag">
                  <span className="token punctuation">&lt;</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token punctuation">light</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>p
                </span>
                <span className="token punctuation">&gt;</span>
                <span className="token tag">
                  <span className="token punctuation">&lt;/</span>
                  ButtonComponents
                  <span className="token punctuation">&gt;</span>
                </span>
              </span>
            </code>
          </pre>
        </Col>
      </Row>
    </>
  );
};

export default CodeButtonComponents;
