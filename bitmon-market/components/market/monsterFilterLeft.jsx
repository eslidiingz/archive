import { Form } from "react-bootstrap";

const MonsterFilterLeft = ({ elements = [], grades = [], onChangeFilter }) => {
    return (
        <>
            <div>
                <form className="row">
                    {Array.isArray(elements) && elements.map((monsterElement, index) => (
                        <Form.Group
                            className="col-3 px-1 cursor select-sidebar-box"
                            controlId="formBasicCheckbox1"
                            key={`${monsterElement.id}_${index}`}
                        >
                            <img
                                src={monsterElement.imgSrc}
                                alt={`${monsterElement.id}_${index}`}
                                className="w-100"
                            />
                            <small className="font-small">{monsterElement.name}</small>
                            <Form.Check
                                type="checkbox"
                                className="form-check-marketplace"
                                name="elements"
                                onChange={(e) => onChangeFilter(e, monsterElement.id)}
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
                            className="px-1 col-lg-6 col-md-4 col-12 col-sm-4 my-2 d-flex justify-content-start align-content-center "
                            controlId="formBasicCheckbox01"
                            key={`${grade.id}_${index}`}
                        >
                            <Form.Check
                                type="checkbox"
                                name="ranks"
                                onChange={(e) => onChangeFilter(e, grade.id)}
                            />
                            <span className={`btn ${grade.class} cursor-default mx-2`}>
                                {grade.name}
                            </span>
                        </Form.Group>
                    ))}
                </form>
            </div>
        </>
    );
};

export default MonsterFilterLeft;