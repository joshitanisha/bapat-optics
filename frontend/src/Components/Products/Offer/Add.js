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
import Select from "react-select";
import { CouponType } from "../../../utils/common";
import { useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm();
  const imageFile = watch("image");
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      // finalData.append("discount_type_id", data?.discount_type_id?.value);

      // finalData.append("discount", data?.discount);
      finalData.append("message", data?.message);
      finalData.append("image", data?.image[0]);
      const response = await withLoader(() =>
        postData(`/admin/masters/offer`, finalData)
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

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
      clearErrors("image");
    }
  };

  const dropdownList = [
    {
      value: CouponType.Percentage,
      name: "discount_type_id",
      label: "Percentage",
    },
    {
      value: CouponType.FixedAmount,
      name: "discount_type_id",
      label: "Fixed Amount",
    },
  ];

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
            Add Offer
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
                          required: "Name is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.name && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Type</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="discount_type_id" // name of the field
                        {...register("discount_type_id", {
                          required: "Select discount_type_id",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            defaultValue={dropdownList[0]}
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.discount_type_id
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={dropdownList}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption);
                              clearErrors("discount");
                            }}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.discount_type_id && (
                      <span className="text-danger">
                        {errors.discount_type_id.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {watch("discount_type_id")?.value === CouponType.Percentage ? (
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Discount (%)</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="discount"
                          placeholder="Discount"
                          className={classNames("", {
                            "is-invalid": errors?.discount,
                          })}
                          {...register("discount", {
                            required: "Discount is required", // Percentage validation
                            pattern: {
                              value: /^[0-9]{1,2}(\.[0-9]{1,2})?$/, // Allows up to two decimal places
                              message:
                                "Please enter a valid discount (up to two decimal places)",
                            },
                            validate: (value) => {
                              return (
                                parseFloat(value) <= 99.99 ||
                                "Discount cannot exceed 99.99"
                              ); // Max limit for Percentage
                            },
                          })}
                          onKeyDown={(e) => {
                            const currentValue = e.target.value;
                            // Allow left and right arrows and backspace
                            if (
                              e.key === "Backspace" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "Tab" ||
                              e.key === "-"
                            ) {
                              return;
                            }
                            // Ensure only numbers and a single decimal point are allowed
                            if (
                              !/[\d\.]/.test(e.key) ||
                              (e.key === "." && currentValue.includes(".")) ||
                              (currentValue.length >= 5 &&
                                e.key !== "Backspace") ||
                              (currentValue.includes(".") &&
                                currentValue.split(".")[1].length >= 2 &&
                                e.key !== "Backspace")
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </InputGroup>
                      {errors.discount && (
                        <span className="text-danger">
                          {errors.discount.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>
              ) : (
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Discount</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="discount"
                          placeholder="Discount"
                          className={classNames("", {
                            "is-invalid": errors?.discount,
                          })}
                          {...register("discount", {
                            required: "Discount is required", // Fixed Amount validation
                            validate: (value) => {
                              // Ensure value is numeric for Fixed Amount (no decimals allowed)
                              return (
                                !isNaN(value) || "Please enter a valid number"
                              );
                            },
                          })}
                          onKeyDown={(e) => {
                            const currentValue = e.target.value;
                            // Allow left and right arrows and backspace
                            if (
                              e.key === "Backspace" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "Tab" ||
                              e.key === "-"
                            ) {
                              return;
                            }
                            // Prevent non-numeric values
                            if (!/[\d]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </InputGroup>
                      {errors.discount && (
                        <span className="text-danger">
                          {errors.discount.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>
              )} */}

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Description</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        as={"textArea"}
                        name="Description"
                        placeholder="Description"
                        className={classNames("", {
                          "is-invalid": errors?.message,
                        })}
                        {...register("message", {
                          required: "Description is required",
                        })}
                      />
                    </InputGroup>
                    {errors.message && (
                      <span className="text-danger">
                        {errors.message.message}
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

                <div className="main-form-section mt-3">
                  <Form.Label>Image Preview</Form.Label>
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
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
