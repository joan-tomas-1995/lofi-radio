import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ModalInfo = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Lofi Radio Music</h3>
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
