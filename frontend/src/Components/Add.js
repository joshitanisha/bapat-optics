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
import { useForm } from "react-hook-form";
import classNames from "classnames";
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
    formState: { errors },
  } = useForm();
  const imageFile = watch("image");

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("days", data?.days);
      finalData.append("price", data?.price);
      const response = await postData(`/admin/subscription/plan`, finalData);

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
          <Modal.Title id="contained-modal-title-vcenter">Add Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Plan</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Plan Name..."
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Plan Name is required",
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
                      <Form.Label>Days</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="days"
                        placeholder="No. of days"
                        className={classNames("", {
                          "is-invalid": errors?.days,
                        })}
                        {...register("days", {
                          required: "No. of days is required",
                        })}
                        onKeyDown={(e) => {
                          const allowedKeys = [
                            "ArrowLeft",
                            "ArrowRight",
                            "Backspace",
                            "Tab",
                            "Delete",
                          ];
                          // Allow only numbers and specific arrow keys (left, right) and backspace
                          if (
                            !/[0-9]/.test(e.key) &&
                            !allowedKeys.includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </InputGroup>
                    {errors.days && (
                      <span className="text-danger">{errors.days.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Price</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="price"
                        placeholder="Price"
                        className={classNames("", {
                          "is-invalid": errors?.price,
                        })}
                        {...register("price", {
                          required: "Price is required",
                        })}
                        onKeyDown={(e) => {
                          const allowedKeys = [
                            "ArrowLeft",
                            "ArrowRight",
                            "Backspace",
                            "Tab",
                            "Delete",
                          ];
                          // Allow only numbers, decimal point, and specific arrow keys
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "." &&
                            !allowedKeys.includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </InputGroup>
                    {errors.price && (
                      <span className="text-danger">
                        {errors.price.message}
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
