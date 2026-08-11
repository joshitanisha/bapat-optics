import React from "react";
import circle from "../../Components/assets/icons/circle.png";
import Modal from "react-bootstrap/Modal";
// import "../Tabels/Tabels.css";
import "./ModelBulkUpload.css";
const ModelBulkUpload = (props) => {
  return (
    <>
      <div>
        <Modal
          show={props.showErrorModal}
          centered
          className={`save-modal modal fade ${
            props.showErrorModal ? "show" : ""
          }`}
          style={{ display: props.showErrorModal ? "block" : "none" }}
        >
          <Modal.Body>
            <div className="circle  justify-content-end">
              <img src={circle} className="circle-img mb-2" alt="" />
            </div>
            <h1 className="add-success text-center">{props.message}</h1>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default ModelBulkUpload;
