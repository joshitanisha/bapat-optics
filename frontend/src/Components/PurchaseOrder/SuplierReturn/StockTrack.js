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
import { formatDate, formatDateToISTTime } from "../../../utils/common";

library.add(fas);

const StockTrack = (props) => {
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
            Stock Track
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props?.data?.Stock_Histories && props?.data?.Stock_Histories.length > 0 ? (
            <Table
              striped
              bordered
              hover
              responsive
              className="text-center align-middle"
            >
              <thead className="table-dark">
                <tr>
                  <th>Sr. No.</th>
                  <th>Date</th>
                
                  <th>Description</th>
                  
                </tr>
              </thead>
              <tbody>
                {props?.data?.Stock_Histories.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatDateToISTTime(entry.createdAt)}</td>
                    <td>
                     {entry?.name}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center my-5">
              <p style={{ fontSize: "36px", marginBottom: "10px" }}>📭</p>
              <h5 style={{ color: "#555" }}>No Stock History Available</h5>
            </div>
          )}
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

export default StockTrack;
