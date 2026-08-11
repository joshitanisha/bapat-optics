import React from "react";
import circle from "../../Components/assets/icons/circle.png";
import Modal from "react-bootstrap/Modal";
// import "../Tabels/Tabels.css";
import "./ModelSave.css";
const ModalSave = (props) => {
  return (
    <>
      {/* <div className={`save-modal modal fade ${props.showErrorModal ? "show" : ""}`}
        style={{ display: props.showErrorModal ? "block" : "none" }}
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="circle justify-content-end">
                <img src={circle} className="circle-img mb-2" alt="" />
              </div>
              <h1 className="add-success text-center">{props.message}</h1>
            </div>
          </div>
        </div>
      </div> */}

      <div>
        <Modal
          show={props.showErrorModal}
          centered
          className={`save-modal modal fade ${props.showErrorModal ? "show" : ""
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

export default ModalSave;
