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
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);

  const id = props.show;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/masters/city/${id}`));
    reset(response?.data);

  };

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
  useEffect(() => {
    GetAllCountry();
    GetAllStates();
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm();

  const imageFile = watch("image");
  
  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("country_id", data?.country_id?.value);
      DataToSend.append("state_id", data?.state_id?.value);
      DataToSend.append("name", data?.name);
      DataToSend.append("image", data?.image[0]);
      const response = await withLoader(() => putData(`/admin/masters/city/${id}`, DataToSend));

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
            Edit City
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
                    <Form.Label className="text-left">Image</Form.Label>

                    <Form.Group>
                      <Form.Control
                        className={classNames("", {
                          "is-invalid": errors?.image,
                        })}
                        type="file"
                        {...register("image", {
                          // validate: async (value) => {
                          //   if (typeof value !== "string") {
                          //     const fileTypes = ["jpg", "png", "jpeg"];
                          //     const fileType = value[0].name?.split(".")[1];
                          //     if (!fileTypes.includes(fileType)) {
                          //       return `please upload a valid file format. (${fileTypes})`;
                          //     }
                          //     const sizes = await getDimension(value[0]);
                          //     if (
                          //       sizes.width !== 420 &&
                          //       sizes.height !== 520
                          //     ) {
                          //       return "Image width and height must be 420 px and 520 px";
                          //     }
                          //     const fileSize = Math.round(
                          //       value[0].size / 1024
                          //     );
                          //     if (fileSize > 500) {
                          //       return "file size must be lower than 500kb";
                          //     }
                          //   }
                          // },
                        })}
                        accept=".jpg, .jpeg, .png"
                      />
                    </Form.Group>
                    {errors.image && (
                      <span className="text-danger">
                        {errors.image.message}
                      </span>
                    )}
                </div>

                       <div className="main-form-section mt-3">
                  <Form.Label>Image Preview</Form.Label>

                  {typeof getValues("image") == "string" ? (
                    <div className="image-preview-container">
                      <img
                        src={IMG_URL + getValues("image")}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  ) : (
                    imageFile &&
                    imageFile?.length > 0 && (
                      <div className="image-preview-container">
                        <img
                          src={URL?.createObjectURL(imageFile[0])}
                          alt="Preview"
                          className="image-preview"
                        />
                      </div>
                    )
                  )}
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

export default EditOffCanvance;
