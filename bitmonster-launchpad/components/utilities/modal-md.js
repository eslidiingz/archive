import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Modal = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
      <div className="modal-overlay">
        <div className="modal-body-md">
          <div className="d-flex flex-row w-100 justify-content-between p-3">
            <div>
              {title && <div className="font-w-700">{title}</div>}
            </div>
            <div>
              <a href="#" onClick={handleCloseClick}>
                <img alt="close.svg" className="modal-close" src="icon/close.svg"/>
              </a>
            </div>
          </div>
          <div className="modal-content px-3 pb-3">{children}</div>
        </div>
      </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};
export default Modal;
