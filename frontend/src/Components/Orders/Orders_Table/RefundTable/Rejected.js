import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
// *******************toster****************************
import ModalSave from "../../../common/ModelSave";
import { CancelButton, SaveButton } from "../../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { getData } from "../../../../utils/api";
import { IDS, RoleId, Select2Data } from "../../../../utils/common";
import {  useLoader } from "../../../../utils/common";
library.add(fas);

const Rejected = (props) => {
  const { postData, user } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const response = await withLoader(() => postData(
        `/admin/orders/accept-refund-order/${props?.show}`,
        {
          type: "reject",
          ...data,
        }
      ));

      if (response?.success) {
        await props.getDataAll();
        await props.GetAllCounts();
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

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
            Rejected Payment Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Remark</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter remark"
                      {...register("remark", {
                        required: "Remark is required",
                      })}
                    />
                    <Form.Text className="text-muted">
                      Please provide any additional information or remarks.
                    </Form.Text>

                    {errors.remark && (
                      <div className="text-danger">{errors.remark.message}</div>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <Link>
                    <CancelButton
                      name={"Cancel"}
                      handleClose={props.handleClose}
                    />
                  </Link>

                  <SaveButton
                    name={"Rejected"}
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                </div>
              </Row>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default Rejected;
