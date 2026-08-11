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
  } = useForm();
const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("name", data?.name);
      sendData.append("description", data?.description);
      sendData.append("logo", data?.logo[0]);
      const response = await withLoader(() => postData(
        `/admin/about-us/vission-mission`,
        sendData
      ));

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
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 100;

  const handleInputChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="edit-modal-holder"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Our Vision Mission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
              <Col md={12}>
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
                        maxLength={100} // Enforce max length of 100 characters
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Name is required",
                          maxLength: {
                            value: 100,
                            message: "Name should not exceed 100 characters",
                          },
                        })}
                        onChange={handleInputChange}
                      />
                    </InputGroup>{" "}
                    <div className="text-end">
                      <small>{maxCharLimit} characters Limit </small>
                    </div>
                    {errors.name && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* <Col md={12}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="text-center">
                      <Form.Label>Description</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={10}
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

              <Col lg={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-start">
                    {" "}
                    {/* Align to left */}
                    {/* Description */}
                    <Col sm={12}>
                      <Form.Label className="">Description</Form.Label>
                      <Form.Group>
                        <Controller
                          name="description" // Provide the field name
                          control={control} // Pass the control object from useForm()
                          rules={{
                            required: "description is required",
                          }} // Validation rules
                          render={({ field }) => (
                            <JoditEditor
                              value={field?.value}
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
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Logo</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="logo"
                        placeholder="Logo"
                        className={classNames("", {
                          "is-invalid": errors?.logo,
                        })}
                        {...register("logo", {
                          required: "logo is required",
                        })}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.logo && (
                      <span className="text-danger">{errors.logo.message}</span>
                    )}
                  </Form.Group>
                </div>

                <div className="main-form-section mt-3">
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
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

export default AddOffCanvance;
