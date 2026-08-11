import React, { useContext, useEffect } from "react";
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
import Select from "react-select";
import { CouponType, Select2Data } from "../../../utils/common";
import { getData } from "../../../utils/api";
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
    clearErrors,
    control,
    setValue,
  } = useForm();
  const imageFile = watch("image");

  const [products, setProducts] = useState([]);
  const [discountTypes, setDiscountTypes] = useState([]);

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("product_id", data?.product_id?.value);
      finalData.append("discount_type_id", data?.discount_type_id?.value);
      finalData.append("message", data?.message);
      finalData.append(
        "discount",
        data?.discount_type_id?.value === CouponType.Percentage
          ? data?.discount_per
          : data?.discount
      );
      finalData.append("image", data.image[0]);
      const response = await postData(
        `/admin/products/offered-product`,
        finalData
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

  const getAllProducts = async () => {
    const response = await getData(`/common/masters/vendors-product`);
    if (response?.success) {
      setProducts(await Select2Data(response?.data, "product_id"));
    }
  };

  const getAllDiscountTypes = async () => {
    const response = await getData(`/common/masters/discount-type`);
    if (response?.success) {
      setDiscountTypes(await Select2Data(response?.data, "discount_type_id"));
    }
  };

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    setToday(formattedDate);
    setValue("discount_type_id", dropdownList[0]);
    getAllProducts();
    getAllDiscountTypes();
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
          <Modal.Title id="contained-modal-title-vcenter">
            Add Offerd Food
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Food</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="product_id" // name of the field
                        {...register("product_id", {
                          required: "Select Product",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.product_id
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={products}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.product_id && (
                      <span className="text-danger">
                        {errors.product_id.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
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
                          name="discount_per"
                          placeholder="Discount"
                          className={classNames("", {
                            "is-invalid": errors?.discount_per,
                          })}
                          {...register("discount_per", {
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
                      {errors.discount_per && (
                        <span className="text-danger">
                          {errors.discount_per.message}
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
              )}

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Message</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        as={"textArea"}
                        name="message"
                        placeholder="Message"
                        className={classNames("", {
                          "is-invalid": errors?.message,
                        })}
                        {...register("message", {
                          required: "Message is required",
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

              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Start Date</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        name="s_date"
                        placeholder="Start Date"
                        className={classNames("", {
                          "is-invalid": errors?.s_date,
                        })}
                        min={today}
                        {...register("s_date", {
                          required: "Start Date is required",
                          validate: (value) => {
                            const startDate = new Date(value);
                            const todayDate = new Date(today);
                            return (
                              todayDate <= startDate ||
                              "Start date must be today or in the future"
                            );
                          },
                        })}
                      />
                    </InputGroup>
                    {errors.s_date && (
                      <span className="text-danger">
                        {errors.s_date.message}
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
                        name="e_date"
                        placeholder="End Date"
                        className={classNames("", {
                          "is-invalid": errors?.e_date,
                        })}
                        min={watch("s_date")}
                        {...register("e_date", {
                          required: "End Date is required",
                          validate: (value) => {
                            const startDate = new Date(watch("s_date"));
                            const endDate = new Date(value);
                            return (
                              endDate > startDate ||
                              "End date must be greater than start date"
                            );
                          },
                        })}
                      />
                    </InputGroup>
                    {errors.e_date && (
                      <span className="text-danger">
                        {errors.e_date.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col> */}

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Banner Image</Form.Label>
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

              <Col lg={6}>
                <div className="main-form-section mt-3">
                  <Form.Label>Image Preview</Form.Label>
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
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
