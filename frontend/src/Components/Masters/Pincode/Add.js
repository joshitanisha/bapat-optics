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
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);

  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const GetAllCountry = async () => {
    const response = await getData("/common/masters/all-country");
    if (response?.success) {
      setCountry(await Select2Data(response?.data, "country_id"));
    }
  };
  const GetAllStates = async (id) => {
    const response = await getData(`/common/masters/all-state/${id}`);
    if (response?.success) {
      setStates(await Select2Data(response?.data, "state_id"));
    }
  };

  const GetAllCities = async (id) => {
    const response = await getData(`/common/masters/all-city/${id}`);
    if (response?.success) {
      setCities(await Select2Data(response?.data, "city_id"));
    }
  };

  useEffect(() => {
    GetAllCountry();
    // GetAllStates();
    // GetAllCities();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {

      const finalData = new FormData();
      finalData.append("country_id", data.country_id?.value);
      finalData.append("state_id", data.state_id?.value);
      finalData.append("city_id", data.city_id?.value);
      finalData.append("name", data.name);
      const response = await withLoader(() => postData(`/admin/masters/pincode`, finalData));

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
            Add Pincode
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
                    <Form.Label>Country</Form.Label>

                    <Controller
                      name="country_id" // name of the field
                      {...register("country_id", {
                        required: "Select Country",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.country_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={country}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value); // Update Controller's value
                            GetAllStates(selectedOption.value);
                            setValue("country_id", selectedOption);
                            setValue("state_id", null);
                            setValue("city_id", null);
                            clearErrors("country_id");
                          }}
                        />
                      )}
                    />

                    {errors.country_id && (
                      <span className="text-danger">
                        {errors.country_id.message}
                      </span>
                    )}
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Label>State</Form.Label>

                    <Controller
                      name="state_id" // name of the field
                      {...register("state_id", {
                        required: "Select State",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.state_id ? "red" : baseStyles,
                            }),
                          }}
                          {...field}
                          options={states}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value); // Update Controller's value
                            GetAllCities(selectedOption.value);
                            setValue("state_id", selectedOption);
                            setValue("city_id", null);
                            clearErrors("state_id");
                          }}
                        />
                      )}
                    />

                    {errors.state_id && (
                      <span className="text-danger">
                        {errors.state_id.message}
                      </span>
                    )}
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Label>City</Form.Label>

                    <Controller
                      name="city_id" // name of the field
                      {...register("city_id", {
                        required: "Select City",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.city_id ? "red" : baseStyles,
                            }),
                          }}
                          {...field}
                          options={cities}
                        />
                      )}
                    />

                    {errors.city_id && (
                      <span className="text-danger">
                        {errors.city_id.message}
                      </span>
                    )}
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Label>Pincode</Form.Label>

                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Pincode"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "Enter Pin",
                            pattern: {
                              value: /^\d{6}$/,
                              message: "Pincode must be a 6-digit number",
                            },
                          })}

                          onKeyDown={(e) => {
                            // Allow arrow keys (left, right), backspace, and delete key
                            if (
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "Backspace" ||
                              e.key === "Delete"
                            ) {
                              return; // Allow the action
                            }

                            // Allow only digits (0-9)
                            if (!/^\d$/.test(e.key)) {
                              e.preventDefault(); // Prevent non-digit input
                            }

                            // Prevent input if length is 6
                            if (e.target.value.length >= 6 && !["ArrowLeft", "ArrowRight", "Backspace", "Delete"].includes(e.key)) {
                              e.preventDefault(); // Prevent adding more than 6 digits
                            }
                          }}
                        />
                      </InputGroup>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
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
