import { Spinner } from "react-bootstrap";

const ButtonState = ({ style, loading, text, onFunction }) => {
  return (
    <button disabled={loading} onClick={onFunction} className={style}>
      {loading && (
        <Spinner align="center" variant="light" animation="border" size="sm" />
      )}{" "}
      {text}
    </button>
  );
};

export default ButtonState;
