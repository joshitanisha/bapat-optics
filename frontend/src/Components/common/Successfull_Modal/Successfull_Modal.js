import React from "react";
import "./Successfull_Modal.css";
import { Button, Modal } from "react-bootstrap";
import Successfull_Lottie from "./Successfull_Lottie/Successfull_Lottie";

function Successfull_Modal(props) {
  const { message, subMessage } = props; // Extracting 'message' prop
  return (
    <>
      <div className="Successfull_Modal_sec">
        <Modal
          className="Successfull_Modal"
          {...props}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="lottie-holder">
              {" "}
              <Successfull_Lottie />
            </div>
            <div className="text-center">
              <p>{message}</p> {/* Displaying the 'message' prop */}
              <sub>{subMessage}</sub>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Successfull_Modal;
