import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";

import { Modal, Row, Table } from "react-bootstrap";
import { CancelButton } from "../../common/Button";
library.add(fas);

const ProductRefundModal = (props) => {
  console.log("props?.data", props?.data);

  const data = props?.data;

  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          <Row className="mt-5 pb-3">
            <div className="d-flex justify-content-center">
              <Link>
                <CancelButton name={"Close"} handleClose={props.handleClose} />
              </Link>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductRefundModal;
