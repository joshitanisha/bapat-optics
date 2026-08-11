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
import JoditEditor from "jodit-react";

import DateTimePickerComponent from "../../common/DateTimePicker";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm();

  // Watch the start date field
  const startDate = watch("start_date");

  // Custom validation function for end date
  const validateEndDate = (endDate) => {
    if (!endDate) {
      return "End Date is required";
    }
    if (new Date(endDate) < new Date(startDate)) {
      return "End Date cannot be before Start Date";
    }
    return true;
  };
const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("name", data?.name);
      sendData.append("start_date", data?.start_date);
      sendData.append("end_date", data?.end_date);
      sendData.append("discount_percentage", data?.discount_percentage);
      const response = await withLoader(() => postData(`/product/sale`, sendData));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({
          code: response?.code,
          message: response?.message,
        });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile([file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
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
          <Modal.Title id="contained-modal-title-vcenter">Add Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Name</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                    </InputGroup>
                    {errors.name && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Discount Percentage</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="discount_percentage"
                        placeholder="Discount Percentage"
                        className={classNames("", {
                          "is-invalid": errors?.discount_percentage,
                        })}
                        {...register("discount_percentage", {
                          required: "Discount Percentage is required",
                          pattern: {
                            value: /^[0-9][0-9]?$|^100$/,
                            message: "Please enter a number between 0 and 100",
                          },
                        })}
                        // {...register("discount_percentage", {
                        //   required: "Discount Percentage is required",
                        // })}
                      />
                    </InputGroup>
                    {errors.discount_percentage && (
                      <span className="text-danger">
                        {errors.discount_percentage.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* <DateTimePickerComponent
                      setValue={setValue}
                      name={"start_date"}
                      errors={errors}
                      register={register}
                    /> */}

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Start Date</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        name="start_date"
                        placeholder="Start Date"
                        className={classNames("", {
                          "is-invalid": errors?.start_date,
                        })}
                        {...register("start_date", {
                          required: "Start Date is required",
                        })}
                      />
                    </InputGroup>

                    {errors.start_date && (
                      <span className="text-danger">
                        {errors.start_date.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>End Date</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        name="end_date"
                        placeholder="End Date"
                        min={startDate}
                        className={classNames("", {
                          "is-invalid": errors?.end_date,
                        })}
                        {...register("end_date", {
                          required: "End Date is required",
                          validate: validateEndDate,
                        })}
                      />
                    </InputGroup>
                    {errors.end_date && (
                      <span className="text-danger">
                        {errors.end_date.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* <DateTimePickerComponent
                      setValue={setValue}
                      name={"end_date"}
                      errors={errors}
                      register={register}
                    /> */}

              {/* <Col lg={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-start">
                    <Col sm={12}>
                      <Form.Label className="text-center">
                        Description
                      </Form.Label>
                      <Form.Group>
                        <Controller
                          name="description" // Provide the field name
                          control={control} // Pass the control object from useForm()
                          rules={{
                            required: "description is required",
                          }} // Validation rules
                          render={({ field }) => (
                            <JoditEditor
                              value={field.value}
                              onChange={(newContent) =>
                                field.onChange(newContent)
                              }
                              onBlur={field.onBlur}
                              className={classNames("", {
                                "is-invalid": !!errors.description,
                              })}
                              placeholder="Description"
                            />
                          )}
                        />
                      </Form.Group>
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col> */}

              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Description</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Description"
                        className={classNames("", {
                          "is-invalid": errors?.description,
                        })}
                        {...register("description", {
                          required: "Description is required",
                        })}
                      />
                    </InputGroup>
                    {errors.description && (
                      <span className="text-danger">
                        {errors.description.message}
                      </span>
                    )}
                  </Form.Group>
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

export default AddOffCanvance;
