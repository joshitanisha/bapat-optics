import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Logoutmodal.css";
const Logoutmodal = (props) => {
  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        className="logoutmodal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm Log Out
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>No</Button>
          <Button onClick={props.LogOut} className="yesbtn">
            Yes, LogOut
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Logoutmodal;
