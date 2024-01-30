
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form'





function SetSetting() {

    return (
      <>
            <Row className=" px-3">
                <Col md={12}>
                    <h2 className="text-white mt-3">Theme</h2>
                    <div className="d-flex">
                        <img src="../assets/rsu-image/icons/moon.svg"/>
                        <p className="mb-0 text-white px-3 ">
                            Dark Mode
                        </p>
                        <Form className="px-3">
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                            />
                        </Form>
                    </div>
                </Col>
            </Row>
      </>
    )
  }
  export default SetSetting
  