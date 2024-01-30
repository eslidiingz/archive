import Spinner from "react-bootstrap/Spinner";

var fullPageStyle = {
  position: "fixed",
  zIndex: "1100",
  left: "0",
  right: "0",
  top: "0",
  bottom: "0",
  display: "flex",
  background: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

var inlineStyle = {
  display: "inline-block",
};

function Loading({ fullPage }) {
  return (
    <div style={fullPage === true ? fullPageStyle : inlineStyle}>
      <Spinner animation="border" variant="light" />
    </div>
  );
}

export default Loading;
