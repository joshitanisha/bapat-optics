import React, { useContext } from "react";
import { useState, useEffect } from "react";
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
import { putData } from "../../utils/api";
import JoditEditor from "jodit-react";
import {  useLoader } from "../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/contact-us-form/${id}`));
    reset(response?.data);
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset, trigger,
    getValues,
    watch,
  } = useForm();

  const imageFile = watch("image");

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("email", data?.email);
      finalData.append("number", data?.number);
      finalData.append("message", data?.message);
      const response = await putData(`/admin/contact-us-form/${id}`, finalData);

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
            Edit Contact Us Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <Form.Label>Name</Form.Label>

                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "Name Is Required",
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
                  </Row>
                </div>

                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>

                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Email Address"
                          className={classNames("", {
                            "is-invalid": errors?.email,
                          })}
                          {...register("email", {
                            required: "email Is Required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            }
                          })}
                        />
                      </InputGroup>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.subname.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>

                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <Form.Label>Number</Form.Label>

                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="number"
                          placeholder="Phone Number"
                          className={classNames("", {
                            "is-invalid": errors?.number,
                          })}
                          {...register("number", {
                            required: "number Is Required",
                            valueAsNumber: true,
                          })}
                        />
                      </InputGroup>
                      {errors.number && (
                        <span className="text-danger">
                          {errors.number.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
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

export default EditOffCanvance;
