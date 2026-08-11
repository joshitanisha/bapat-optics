import React, { useContext } from "react";
import { useState } from "react";
import "../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import ModalSave from "../common/ModelSave";
import { CancelButton, SaveButton } from "../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import JoditEditor from "jodit-react";
import {  useLoader } from "../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const { control,
    register, trigger,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const imageFile = watch("image");
const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("email", data?.email);
      finalData.append("number", data?.number);
      finalData.append("message", data?.message);

      const response = await withLoader(() => postData(`/admin/contact-us-form`, finalData));

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

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
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
            Add Contact Us Form
          </Modal.Title>
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
                          required: "name is required",
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
                      <Form.Label>Email Address</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        className={classNames("", {
                          "is-invalid": errors?.email,
                        })}
                        {...register("email", {
                          required: "email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.email && (
                      <span className="text-danger">{errors.email.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Number</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="number"
                        placeholder="Enter number"
                        className={classNames("", {
                          "is-invalid": errors?.number,
                        })}
                        {...register("number", {
                          required: "number is required",
                        })}
                      />
                    </InputGroup>
                    {errors.number && (
                      <span className="text-danger">{errors.number.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Message</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="message"
                          control={control}
                          rules={{
                            required: "message is required.",
                            // maxLength: {
                            //   value: 600,
                            //   message:
                            //     "content must be at most 600 characters long.",
                            // },
                          }} // Correct the maxLength rule
                          render={({ field: { onChange, onBlur, value } }) => (
                            <JoditEditor
                              value={value}
                              onBlur={() => {
                                onBlur();
                                trigger("message");
                              }}
                              onChange={onChange}
                            />
                          )}
                        />
                      </InputGroup>
                      {errors.message && (
                        <span className="text-danger">
                          {errors.message.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
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
