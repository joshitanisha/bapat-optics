import React from "react";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";

const ModalDelete = (props) => {
  return (
    <div className="upload-modal">
      <div
        className={`modal fade ${props.show ? "show" : ""}`}
        style={{ display: props.show ? "block" : "none" }}
        id="exampleModaldel"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h1 className="add-success text-center  mt-2">Are you sure ?</h1>
              <p>
                Do You Really Want to Delete These Record?
                <br />
                Dependent Data Also Be Deleted And
                <br /> This Process CanNot Be Undone{" "}
              </p>
              <div className="button-holder text-center mt-2">
                <button
                  className="btn btn-yes me-2"
                  onClick={() => {
                    props.handleDeleteRecord(props.id, props.name);
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-no"
                  onClick={props.handleDeleteCancel}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
