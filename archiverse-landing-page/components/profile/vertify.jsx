import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Setvertify() {
  return (
    <>
      <Row className=" px-3 layout_profile-btn">
        <Col md={12}>
          <h2 className="text-white mt-3">Vertify Account</h2>
          <p className="text-white">
            Please Vertify your account to become the Creator.
          </p>
          <div className="create-box-layout text-white text-start mb-4">
            <p>Image</p>
            <Form.Group
              controlId="formFile"
              className="mb-3 custom-file-upload "
            >
              <Form.Label>
                <p>Choose file </p>
                <i className="fas fa-plus"></i>
              </Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <p className="cci-green">*Max file sizeis 20mb</p>

            <Form>
              <Form.Group className="mb-3" controlId="firstname">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  className="input-search-set "
                  placeholder="firstname"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastname">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  className="input-search-set "
                  placeholder="lastname"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="about">
                <Form.Label>About</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="input-search-set_new"
                />
              </Form.Group>
              <div className="d-flex align-items-center mb-2">
                <h5 className="me-auto mb-0">Portfolios</h5>
                <div className="ms-auto">
                  <button className="btn btn03 btn-hover color-1 w-120">
                    Add
                  </button>
                </div>
              </div>
              <div className="layout_profile-btn">
                <InputGroup className="mb-3 col-12">
                  <InputGroup.Text id="portfolios">https://</InputGroup.Text>
                  <FormControl
                    className="input-search-set"
                    id="basic-url"
                    aria-describedby="portfolios"
                  />
                  <Button
                    variant="danger"
                    id="button-addon2"
                    className="w-120 btn-del_profile"
                  >
                    Delete
                  </Button>
                </InputGroup>
              </div>

              <button className="btn btn03 btn-hover color-1 w-100">
                Submit
              </button>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
}
export default Setvertify;
