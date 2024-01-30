import config from "../../configs/config";
import { Form, Spinner } from "react-bootstrap";

const ItemFilterLeft = ({ itemTypes = {}, assets = [], grades = [], onChangeFilter, loading = false }) => {
    const IMG_EXTENSION = '.png';
    return (
        <>
            <div>
                <form className="row">
                    {loading && (
                        <div className="text-center d-flex justify-content-center">
                            <span className="me-2 my-auto">Loading</span> <Spinner animation="border" role="status" />
                        </div>
                    )}
                    {(!loading && Array.isArray(itemTypes)) && itemTypes.map((types, index) => (
                        <Form.Group
                            className="col-3 px-1 cursor select-sidebar-box"
                            key={`${types.id}_${index}`}
                        >
                            {/* <img
                                src={`${config.INVENTORY_IMG_URL}/items/${types.id}${IMG_EXTENSION}`}
                                alt=""
                                className="w-100 w-h-fixitem-mar"
                            /> */}
                            <small className="font-small">{types.title}</small>
                            <Form.Check
                                type="checkbox"
                                className="form-check-marketplace"
                                name="assets"
                                onChange={(e) => onChangeFilter(e, types.id)}
                            />
                        </Form.Group>
                    ))}
                </form>
            </div>
            <div className="text-start">
                <p className="mt-4 mb-0">Rank</p>
                <form className="row fix-row">
                    {Array.isArray(grades) && grades.map((grade, index) => (
                        <Form.Group
                            className="px-1 col-lg-6 col-md-4 col-12 col-sm-4 my-2 d-flex justify-content-start align-content-center"
                            controlId="formBasicCheckbox01"
                            key={`${grade.id}_${index}`}
                        >
                            <Form.Check type="checkbox" className="" />
                            <buttom className={`btn ${grade.class} mx-2`}>
                                {grade.name}
                            </buttom>
                        </Form.Group>
                    ))}
                </form>
            </div>
        </>
    );
};

export default ItemFilterLeft;