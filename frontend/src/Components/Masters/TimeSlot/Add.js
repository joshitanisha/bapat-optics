import React, { useContext } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    watch,control,
    getValues,
    formState: { errors },
  } = useForm();
const formatTime = (date) => {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`; // 24-hour format (e.g., "14:30")
};

 const onSubmit = async (data) => {
  try {
  

    const payload = {
      ...data,
      from: formatTime(data.from), // convert to HH:mm
      to: formatTime(data.to),
    };

    const response = await postData(`/admin/masters/time-slot`, payload);

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

const fromTime = watch("from");
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
            Add Time Slot
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>From Time</Form.Label>
                    <InputGroup>
                      <Controller
                        control={control}
                        name="from"
                        rules={{ required: "From time is required" }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={field.onChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select From Time"
                            className={classNames("form-control", {
                              "is-invalid": errors?.from,
                            })}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.from && (
                      <span className="text-danger">{errors.from.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>To Time</Form.Label>
                    <InputGroup>
                      <Controller
                        control={control}
                        name="to"
                        rules={{
                          required: "To time is required",
                          validate: (value) => {
                            const from = fromTime;
                            const to = value;
                            if (from && to) {
                              return (
                                new Date(to) > new Date(from) ||
                                "To time must be after From time"
                              );
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={field.onChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select To Time"
                            className={classNames("form-control", {
                              "is-invalid": errors?.to,
                            })}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.to && (
                      <span className="text-danger">{errors.to.message}</span>
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

export default AddOffCanvance;
