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

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [language, setLanguage] = useState()

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const GetAllCountry = async () => {
    const response = await getData("/common/masters/all-country");
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "country_id"));
    }
  };
  const GetAllStates = async (id) => {
    const response = await getData(`/common/masters/all-state/${id}`);
    if (response?.success) {
      setStates(await Select2Data(response?.data, "state_id"));
    }
  };
  const GetAllLanguage = async () => {
    const response = await getData("/common/masters/allLanguage");
    if (response?.success) {
      setLanguage(await Select2Data(response?.data, "language_id"));
    }
  };

  useEffect(() => {
    GetAllCountry();
    GetAllStates();
    GetAllLanguage();
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
      const DataToSend = new FormData();
      DataToSend.append("country_id", data?.country_id?.value);
      DataToSend.append("state_id", data?.state_id?.value);
      DataToSend.append("name", data?.name);
      DataToSend.append("image", data?.image[0]);
      const response = await withLoader(() => postData(`/admin/masters/city`, DataToSend));

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

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
      clearErrors("image")
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
          <Modal.Title id="contained-modal-title-vcenter">Add City</Modal.Title>
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
                          options={countries}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value); // Update Controller's value
                            GetAllStates(selectedOption.value);
                            setValue("country_id", selectedOption);
                            setValue("state_id", null);
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
                {/* {console.log(language, 'language') */}
                {/* } */}
                <div className="main-form-section mt-3">
                    <Form.Label>Languages</Form.Label>
                    <Controller
                      name="language_id" // name of the field
                      {...register("language_id", {
                        required: "Please select at least one language",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.language_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={language}
                        />
                      )}
                    />
                    {errors.language_id && (
                      <span className="text-danger">
                        {errors.language_id.message}
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
                    <Form.Label>City Name</Form.Label>

                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="City Name"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "Name is required",
                            validate: (value) =>
                              value.length <= 200 ||
                              "Data must be 200 characters or less",

                          })}
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

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Image</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="image"
                        placeholder="Image"
                        className={classNames("", {
                          "is-invalid": errors?.image,
                        })}
                        {...register("image", {
                          required: "Image is required",
                        })}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.image && (
                      <span className="text-danger">
                        {errors.image.message}
                      </span>
                    )}
                  </Form.Group>

                </div>
              </Col>

              <Col md={6}>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      style={{ maxWidth: "100px" }}
                    />
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

export default AddOffCanvance;
