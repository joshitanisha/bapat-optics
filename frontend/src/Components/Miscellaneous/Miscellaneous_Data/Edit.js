import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// *******************toster****************************
import Select from "react-select";
import ModalSave from "../../common/ModelSave";
import Validation from "../../common/FormValidation";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import JoditEditor from "jodit-react";
import { formatDate } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, Select2Data } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const GetEditData = async () => {
    const response = await getData(`/admin/miscellaneous/data/${id}`);
     reset({
      ...response?.data,
      date: formatDate(response?.data.date), // Format the ISO date
    });
    // reset(response?.data);
    //  date: formatDate(fetchedData.date), 
  };

  const [categories, setCategories] = useState([]);

  const GetAllFaqCategory = async () => {
    const response = await getData("/common/masters/all-miscellaneous-reason");
    if (response?.success) {
      setCategories(
        await Select2Data(response?.data, "miscellaneous_reason_id")
      );
    }
  };

  useEffect(() => {
    GetAllFaqCategory();
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append(
        "miscellaneous_reason_id",
        data?.miscellaneous_reason_id?.value
      );
      DataToSend.append("date", data?.date);
      DataToSend.append("comment", data?.comment);
       DataToSend.append("rupees", data?.rupees);
      const response = await putData(
        `/admin/miscellaneous/data/${id}`,
        DataToSend
      );

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
            Edit Miscellaneous Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
            // className="stateclass"
          >
            <Row>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Miscellaneous Reason</Form.Label>
                    <Controller
                      name="miscellaneous_reason_id" // name of the field
                      {...register("miscellaneous_reason_id", {
                        required: "Select Category",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.miscellaneous_reason_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={categories}
                        />
                      )}
                    />
                    {errors.miscellaneous_reason_id && (
                      <span className="text-danger">
                        {errors.miscellaneous_reason_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Comment</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          type="text"
                          name="comment"
                          placeholder="comment"
                          className={classNames("", {
                            "is-invalid": errors?.comment,
                          })}
                          {...register("comment", {
                            required: "comment is required",
                              validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          })}
                        />
                      </InputGroup>
                      {errors.comment && (
                        <span className="text-danger">
                          {errors.comment.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Rupees</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          type="text"
                          name="rupees"
                          placeholder="rupees"
                          className={classNames("", {
                            "is-invalid": errors?.rupees,
                          })}
                          {...register("rupees", {
                            required: "rupees is required",
                              validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          })}
                        />
                      </InputGroup>
                      {errors.comment && (
                        <span className="text-danger">
                          {errors.comment.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Date</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          // as="textarea"
                          type="date"
                          name="date"
                          placeholder="date"
                          className={classNames("", {
                            "is-invalid": errors?.date,
                          })}
                          {...register("date", {
                            required: "date is required",
                              validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          })}
                        />
                      </InputGroup>
                      {errors.date && (
                        <span className="text-danger">
                          {errors.date.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              {/* <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Answer</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="answer"
                          control={control}
                          rules={{
                            required: "Answer is required.",
                            // maxLength: {
                            //   value: 600,
                            //   message:
                            //     "Answer must be at most 600 characters long.",
                            // },
                          }} // Correct the maxLength rule
                          render={({ field: { onChange, onBlur, value } }) => (
                            <JoditEditor
                              value={value}
                              onBlur={() => {
                                onBlur();
                                trigger("answer");
                              }}
                              onChange={onChange}
                            />
                          )}
                        />
                      </InputGroup>
                      {errors.answer && (
                        <span className="text-danger">
                          {errors.answer.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col> */}

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

export default EditOffCanvance;
