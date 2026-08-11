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
import { Select2Data } from "../../../utils/common";
import { getData } from "../../../utils/api";
import { useEffect } from "react";
import Select from "react-select";
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
    watch,
    getValues,
    clearErrors,control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("country_id", data?.country_id?.value);
      finalData.append("country_code", data?.country_code);
      finalData.append("no_length", data?.no_length);
      finalData.append("flag", data?.flag[0]);
      const response = await postData(`/admin/masters/country-code`, finalData);

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
      clearErrors("flag")
    }
  };
  const [countries, setCountries] = useState([]);
  const GetAllCountry = async () => {
    const response = await getData("/common/masters/all-country");
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "country_id"));
    }
  };
  useEffect(() => {
    GetAllCountry();
    // setCountries(Select2Data(Country))
  }, []);
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
          <Modal.Title id="contained-modal-title-vcenter">Add Country Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">

              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Country</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Country"
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Country name is required",
                        })}
                      />
                    </InputGroup>
                    {errors.counnametry && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col> */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
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
                        />
                      )}
                    />
                    {errors.country_id && (
                      <span className="text-danger">
                        {errors.country_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Country Code</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="country_code"
                        placeholder="Country Code"
                        className={classNames("", {
                          "is-invalid": errors?.country_code,
                        })}
                        {...register("country_code", {
                          required: "Country Code is required",
                             validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.country_code && (
                      <span className="text-danger">{errors.country_code.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Number Length</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="no_length"
                        placeholder="Number Length"
                        className={classNames("", {
                          "is-invalid": errors?.no_length,
                        })}
                        {...register("no_length", {
                          required: "Number Length is required",
                        })}
                        maxLength={2}  // Limit the length to 2 digits
                        onKeyDown={(event) => {
                          // Allow only numeric keys (0-9), Backspace, Delete, Left/Right arrow keys
                          const allowedKeys = /[0-9]|Backspace|Delete|ArrowLeft|ArrowRight/;

                          // Check if the key pressed is valid
                          if (!allowedKeys.test(event.key)) {
                            event.preventDefault(); // Prevent invalid key
                          }
                        }}
                      />
                    </InputGroup>
                    {errors.no_length && (
                      <span className="text-danger">{errors.no_length.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Flag</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="flag"
                        placeholder="Flag"
                        className={classNames("", {
                          "is-invalid": errors?.flag,
                        })}
                        {...register("flag", {
                          required: "Flag is required",
                        })}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.flag && (
                      <span className="text-danger">
                        {errors.flag.message}
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
