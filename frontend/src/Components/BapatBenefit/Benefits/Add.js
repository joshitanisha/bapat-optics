import React, { useContext, useEffect, useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import Select from "react-select";
import { DiscountType, Select2Data } from "../../../utils/common";
import { useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm();
  const imageFile = watch("image");

  const [imagePreview, setImagePreview] = useState(null);
  const [Offer, setOffer] = useState([]);
  const [Product, setProduct] = useState([]);
  const [Discounttype, setDiscounttype] = useState([]);
  const { loading, withLoader } = useLoader();
  const getAllOffer = async () => {
    const response = await getData(`/common/masters/all-offer`);
    if (response?.success) {
      setOffer(await Select2Data(response?.data, "offer_id"));
    }
  };

  const getAllProduct = async () => {
    const response = await getData(`/common/masters/product`);
    if (response?.success) {
      setProduct(await Select2Data(response?.data, "product_id"));
    }
  };

  const getAllDiscounttype = async () => {
    const response = await getData("/common/masters/discount-type");
    if (response?.success) {
      setDiscounttype(await Select2Data(response?.data, "discount_type_id"));
    }
  };

  useEffect(() => {
    getAllOffer();
    getAllProduct();
    getAllDiscounttype();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      clearErrors("image");
    }
  };

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("message", data?.message);
      finalData.append("offer_id", data?.offer_id?.value);
      // finalData.append(
      //   "discount",
      //   data?.discount_type_id?.value === DiscountType.Percentage
      //     ? data?.discount_per
      //     : data?.discount
      // );
      // finalData.append("discount_type_id", data?.discount_type_id?.value);
      if (data?.image && data.image[0]) {
        finalData.append("image", data.image[0]);
      }
      // Append product_ids as an array
      if (data?.product_ids) {
        data.product_ids.forEach((product) => {
          finalData.append("product_ids[]", product.value);
        });
      }

      const response = await withLoader(() =>
        postData(
          "/admin/bapatbenefit/offeredbenefit", // Updated endpoint
          finalData,
        ),
      );

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({
          code: response?.code,
          message: response?.message,
        });
      }
      setTimeout(() => {
        setShowModal({ code: 0, message: "" });
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowModal({
        code: 500,
        message: "An error occurred while submitting the form",
      });
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
            Add Offered Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row>
              <Col md={6}>
                <div className="main-form-section mt-3">
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
                          required: "Name is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Name must be 200 characters or less",
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
                    <Form.Label>Message</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="message"
                        placeholder="Message"
                        className={classNames("", {
                          "is-invalid": errors?.message,
                        })}
                        {...register("message", {
                          required: "Message is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Name must be 200 characters or less",
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
                    <Form.Label>Offer</Form.Label>
                    <InputGroup>
                      <Controller
                        name="offer_id"
                        control={control}
                        rules={{ required: "Offer is required" }}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.offer_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            {...field}
                            options={Offer}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption);
                              clearErrors("offer_id");
                            }}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.offer_id && (
                      <span className="text-danger">
                        {errors.offer_id.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Products</Form.Label>
                    <InputGroup>
                      <Controller
                        name="product_ids"
                        control={control}
                        rules={{ required: "At least one product is required" }}
                        render={({ field }) => (
                          <Select
                            isMulti
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.product_ids
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            {...field}
                            options={Product}
                            onChange={(selectedOptions) => {
                              field.onChange(selectedOptions);
                              clearErrors("product_ids");
                            }}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.product_ids && (
                      <span className="text-danger">
                        {errors.product_ids.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Discount Type</Form.Label>
                    <InputGroup>
                      <Controller
                        name="discount_type_id"
                        control={control}
                        rules={{ required: "Discount Type is required" }}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.discount_type_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            {...field}
                            options={Discounttype}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption);
                              clearErrors("discount");
                              clearErrors("discount_per");
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

              {watch("discount_type_id")?.value === DiscountType.Percentage ? (
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <Form.Label>Discount (%)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="discount_per"
                          placeholder="Discount"
                          className={classNames("", {
                            "is-invalid": errors?.discount_per,
                          })}
                          {...register("discount_per", {
                            required: "Discount is required",
                            pattern: {
                              value: /^[0-9]{1,2}(\.[0-9]{1,2})?$/,
                              message:
                                "Please enter a valid discount (up to two decimal places)",
                            },
                            validate: (value) =>
                              parseFloat(value) <= 99.99 ||
                              "Discount cannot exceed 99.99",
                          })}
                          onKeyDown={(e) => {
                            const currentValue = e.target.value;
                            if (
                              e.key === "Backspace" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "Tab" ||
                              e.key === "-"
                            ) {
                              return;
                            }
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
                      <Form.Label>Discount</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="discount"
                          placeholder="Discount"
                          className={classNames("", {
                            "is-invalid": errors?.discount,
                          })}
                          {...register("discount", {
                            required: "Discount is required",
                            validate: (value) =>
                              !isNaN(value) || "Please enter a valid number",
                          })}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "Tab" ||
                              e.key === "-"
                            ) {
                              return;
                            }
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
                    <Form.Label>Image</Form.Label>
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
