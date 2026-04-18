import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ModalInfo = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="modal-title">Lofi Radio Music</h3>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal">
            <IoMdCloseCircleOutline size="1.5em" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalInfo;
