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
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { getData } from "../../../utils/api";
import { RoleId, Select2Data } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const ExpiryDatePacking = (props) => {
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
  console.log(props?.show, "props?.show");

  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    console.log(data, "data ");

    try {
      const finalData = new FormData();
      finalData.append("expiry_date", data?.expiry_date);
      const response = await withLoader(() => postData(
        `/admin/orders/product-order/expiry-date/${props?.show}`,
        finalData
      ));

      if (response?.success) {
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

  const GetAllDeliveryBoys = async () => {
    if (user && user?.role_id === RoleId.Vendor) {
      const response = await getData(`/common/masters/delivery-boys`);
      if (response?.success) {
        setDeliveryBoys(await Select2Data(response?.data, "delivery_boy_id"));
      }
    }
  };

  useEffect(() => {
    GetAllDeliveryBoys();
  }, [props.show]);
  console.log(getValues(), "grtvalue");

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
            Packing Expiry Date
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              {/* {props?.data && (
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Address</Form.Label>
                      </div>

                      <p>
                        {props.data?.first_name} {props.data?.last_name},
                      </p>
                      <p>
                        {props.data?.floor}-floor , {props.data?.building} ,{" "}
                        {props.data?.apartment} , {props.data?.street}
                      </p>
                      <p>{props.data?.direction} </p>
                      <p>{props.data?.contact_no} </p>
                    </Form.Group>
                  </div>
                </Col>
              )} */}
              <Col md={6}>
                <Controller
                  name="expiry_date"
                  control={control}
                  rules={{
                    required: "Select Date",
                    validate: (value) =>
                      new Date(value) > new Date() ||
                      "Expiry date must be in the future",
                  }}
                  render={({ field }) => (
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]} // disables past dates
                      className={`form-control ${
                        errors.expiry_date ? "is-invalid" : ""
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.expiry_date && (
                  <div className="invalid-feedback">
                    {errors.expiry_date.message}
                  </div>
                )}
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
                    name={"Save"}
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

export default ExpiryDatePacking;
