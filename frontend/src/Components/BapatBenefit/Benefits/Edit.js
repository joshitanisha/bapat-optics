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
import { putData } from "../../../utils/api";
import { DiscountType, Select2Data } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    clearErrors,
  } = useForm();

  const imageFile = watch("image");
  const [imagePreview, setImagePreview] = useState(null);
  const [Offer, setOffer] = useState([]);
  const [Product, setProduct] = useState([]);
  const [Discounttype, setDiscounttype] = useState([]);

  // Fetch all dropdown data
  const fetchDropdownData = async () => {
    try {
      const [offerRes, productRes, discountTypeRes] = await Promise.all([
        getData(`/common/masters/all-offer`),
        getData(`/common/masters/product`),
        getData("/common/masters/discount-type"),
      ]);

      const offerOptions = offerRes?.success
        ? await Select2Data(offerRes.data, "offer_id")
        : [];
      const productOptions = productRes?.success
        ? await Select2Data(productRes.data, "product_id")
        : [];
      const discountTypeOptions = discountTypeRes?.success
        ? await Select2Data(discountTypeRes.data, "discount_type_id")
        : [];

      setOffer(offerOptions);
      setProduct(productOptions);
      setDiscounttype(discountTypeOptions);

      return { offerOptions, productOptions, discountTypeOptions };
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      return { offerOptions: [], productOptions: [], discountTypeOptions: [] };
    }
  };
    const { loading, withLoader } = useLoader();
  // Fetch edit data and prefill form
  const GetEditData = async (dropdownOptions) => {
    try {
      const response = await withLoader(() => getData(
        `/admin/bapatbenefit/offeredbenefit/${id}` // Updated endpoint
      ));
      const data = response?.data;

      // Find matching options from dropdown data
      const selectedOffer = dropdownOptions.offerOptions.find(
        (option) => option.value === data.offer_id?.value
      );
      const selectedDiscountType = dropdownOptions.discountTypeOptions.find(
        (option) => option.value === data.discount_type_id?.value
      );
      const selectedProducts =
        data.products?.map((product) =>
          dropdownOptions.productOptions.find(
            (option) => option.value === product.product_id.value
          )
        ) || [];

      reset({
        name: data.name,
        message: data.message,
        offer_id: selectedOffer || {
          value: data.offer_id?.value,
          label: data.offer_id?.label || "Unknown Offer",
        },
        product_ids: selectedProducts.filter(Boolean) || [],
        discount_type_id: selectedDiscountType || {
          value: data.discount_type_id?.value,
          label: data.discount_type_id?.label || "Unknown Discount Type",
        },
        discount_per:
          data.discount_type_id?.value === DiscountType.Percentage
            ? data.discount
            : "",
        discount:
          data.discount_type_id?.value === DiscountType.FixedAmount
            ? data.discount
            : "",
        image: data.image,
      });

      if (data.image) {
        setImagePreview(IMG_URL + data.image);
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    }
  };

  // Initialize dropdowns and fetch edit data
  useEffect(() => {
    const initializeData = async () => {
      const dropdownOptions = await fetchDropdownData();
      if (id) {
        await GetEditData(dropdownOptions);
      }
    };
    initializeData();
  }, [id]);

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
      // finalData.append("discount_type_id", data?.discount_type_id?.value);
      // finalData.append(
      //   "discount",
      //   data?.discount_type_id?.value === DiscountType.Percentage
      //     ? data?.discount_per
      //     : data?.discount
      // );
      if (data?.image && data.image[0]) {
        finalData.append("image", data.image[0]);
      }
      // Append product_ids as an array
      if (data?.product_ids) {
        data.product_ids.forEach((product) => {
          finalData.append("product_ids[]", product.value);
        });
      }

      const response = await withLoader(() => putData(
        `/admin/bapatbenefit/offeredbenefit/${id}`, // Updated endpoint
        finalData
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
            Edit Offered Product
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
                            "Message must be 200 characters or less",
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
                        {...register("image", {})}
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
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  ) : (
                    getValues("image") && (
                      <div className="image-preview-container">
                        <img
                          src={IMG_URL + getValues("image")}
                          alt="Preview"
                          className="image-preview"
                          style={{ maxWidth: "100px" }}
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
