import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import Select from "react-select";
import { putData } from "../../../utils/api";
import { CouponType, Select2Data } from "../../../utils/common";
import { useNavigate } from "react-router";
import Header from "../../Header/Header";
import { useParams } from "react-router-dom";
import { useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const navigate = useNavigate();
  // const id = props.show;
  const { id } = useParams();
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const [enableBrand, setEnableBrand] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
    clearErrors,
  } = useForm();

  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/coupon/${id}`));
    const formattedStartDate = response?.data?.s_date
      ? response?.data?.s_date.split(" ")[0]
      : "";
    const formattedEndDate = response?.data?.e_date
      ? response?.data?.e_date.split(" ")[0]
      : "";
    reset({
      ...response?.data,
      s_date: formattedStartDate,
      e_date: formattedEndDate,
    });

    if (response?.data?.discount_type_id?.value === CouponType.Percentage) {
      setValue("discount_per", response?.data?.discount);
    }
    setEnableBrand(response?.data?.brand_status);
   await getAllBrands(response?.data?.category_id?.value)
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const imageFile = watch("image");
  const dateStatus = watch("date_status");
  const onSubmit = async (data) => {
    try {
      

      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("code", data?.code);
      if (data?.coupon_type_id?.value) {
        finalData.append("coupon_type_id", data?.coupon_type_id?.value);
      }

      finalData.append("discount_type_id", data?.discount_type_id?.value);

      finalData.append("date_status", data?.date_status);
      finalData.append("message", data?.message);
      finalData.append("info", data?.info);
      finalData.append(
        "discount",
        data?.discount_type_id?.value === CouponType.Percentage
          ? data?.discount_per
          : data?.discount
      );
      finalData.append("required_amount", data?.required_amount);
      if (data?.use_per_coupon) {
        finalData.append("use_per_coupon", data?.use_per_coupon);
      }

      finalData.append("use_per_customer", data?.use_per_customer);
      if (data?.s_date) {
        finalData.append("s_date", data?.s_date);
      }
      if (data?.e_date) {
        finalData.append("e_date", data?.e_date);
      }
      if (data.brand_id) {
        finalData.append(
          "brand_id",
          JSON.stringify(data.brand_id.map((option) => option.value))
        );
      }
      if (selectedCouponType?.value === 2 || selectedCouponType?.value === 1) {
        // if (data?.brand_id && data?.brand_id?.value !== null) {
        //   finalData.append("brand_id", data?.brand_id?.value);
        // }
        if (data?.category_id && data?.category_id?.value !== null) {
          finalData.append("category_id", data?.category_id?.value);
        }
      }

      finalData.append("image", data.image[0]);
      const response = await withLoader(() =>
        putData(`/admin/coupon/${id}`, finalData)
      );

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/coupons/coupon");
        // props.handleClose();
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
      name: "coupon_type_id",
      label: "Percentage",
    },
    {
      value: CouponType.FixedAmount,
      name: "coupon_type_id",
      label: "Fixed Amount",
    },
  ];

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    setToday(formattedDate);
  }, []);

  const [brands, setBrands] = useState([]);
  const [Category, setCategory] = useState([]);
  const [couponType, setCouponType] = useState([]);
  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");

    if (response?.success) {
      setCategory(await Select2Data(response?.data, "category_id"));
    }
  };

  const getAllBrands = async (category_id) => {
    const response = await getData(
      `/common/masters/all-brands?category_id=${category_id}`
    );
    if (response?.success) {
      setBrands(await Select2Data(response?.data, "brand_id"));
    }
  };

  const getAllCouponType = async () => {
    const response = await getData(`/common/masters/all-coupon-type`);
    if (response?.success) {
      setCouponType(await Select2Data(response?.data, "coupon_type_id"));
    }
  };
  useEffect(() => {
    // getAllBrands();
    GetAllCategory();
    getAllCouponType();
  }, []);
  const selectedCouponType = watch("coupon_type_id");

  return (
    <>
      <Header title={"Edit Coupon"} link={"#"} />
      <section className="Create">
        <div className="back_btn_holder">
          <div onClick={() => navigate(`/coupons/coupon`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
        </div>
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
                        validate: (value) => {
                          const words = value.match(/\b\w+\b/g); // Match all word-like segments
                          return (
                            !words ||
                            words.length <= 50 ||
                            "Data must be 100 words or less"
                          );
                        },
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
                <Row className="row justify-content-center mb-2 me-0 sm-0">
                  <Form.Label>Coupon Type</Form.Label>
                  <Controller
                    name="coupon_type_id"
                    {...register("coupon_type_id", {
                      // required: "Select Category",
                    })}
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Coupon Type"
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors.coupon_type_id
                              ? "red"
                              : baseStyles,
                          }),
                        }}
                        {...field}
                        options={couponType}
                      />
                    )}
                  />
                  {errors.coupon_type_id && (
                    <span className="text-danger">
                      {errors.coupon_type_id.message}
                    </span>
                  )}
                </Row>
              </div>
            </Col>

            {selectedCouponType?.value === 2 && (
              <>
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Row className="row justify-content-center mb-2 me-0 sm-0">
                      <Form.Label>Category</Form.Label>
                      <Controller
                        name="category_id" // name of the field
                        {...register("category_id", {
                          // required: "Select Category",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.category_id
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={Category}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.value); // Update Controller's value
                              getAllBrands(selectedOption.value);
                              setValue("category_id", selectedOption);
                              setValue("brand_id", null);
                            }}
                          />
                        )}
                      />
                      {errors.category_id && (
                        <span className="text-danger">
                          {errors.category_id.message}
                        </span>
                      )}
                    </Row>
                  </div>
                  <Form.Check
                    type="checkbox"
                    label="Select Brand"
                    checked={enableBrand}
                    onChange={(e) => {
                      setEnableBrand(e.target.checked);

                      if (!e.target.checked) {
                        setValue("brand_id", []); // clear brand when unchecked
                      }
                    }}
                  />
                </Col>

                {enableBrand && (
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Row className="row justify-content-center mb-2 me-0 sm-0">
                        <Form.Label>Brand</Form.Label>
                        <Controller
                          className="select-contoller"
                          name={`brand_id`} // name of the field
                          control={control}
                          rules={
                            {
                              // required: "Select Sub Category",
                            }
                          }
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <Select
                              isMulti
                              styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  borderColor: errors?.brand_id
                                    ? "red"
                                    : baseStyles.borderColor,
                                }),
                              }}
                              // {...field}
                              options={brands}
                              onChange={(selectedValue) => {
                                onChange(selectedValue);
                              }}
                              onBlur={onBlur}
                              value={value}
                              ref={ref}
                            />
                          )}
                        />
                        {errors.brand_id && (
                          <span className="text-danger">
                            {errors.brand_id.message}
                          </span>
                        )}
                      </Row>
                    </div>
                  </Col>
                )}
              </>
            )}

            {/* {selectedCouponType?.value === 1 && (
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Brand</Form.Label>
                    <Controller
                      className="select-contoller"
                      name={`brand_id`} // name of the field
                      control={control}
                      rules={
                        {
                          // required: "Select Sub Category",
                        }
                      }
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.brand_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={brands}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                            setValue("brand_id", selectedValue);
                            setValue("category_id", null);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.brand_id && (
                      <span className="text-danger">
                        {errors.brand_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>
            )} */}

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Code</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="code"
                      placeholder="Code"
                      className={classNames("", {
                        "is-invalid": errors?.code,
                      })}
                      {...register("code", {
                        required: "Code is required",
                        validate: (value) => {
                          const words = value.match(/\b\w+\b/g); // Match all word-like segments
                          return (
                            !words ||
                            words.length <= 50 ||
                            "Data must be 100 words or less"
                          );
                        },
                      })}
                      onKeyDown={(e) => {
                        if (!/[\w_]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </InputGroup>
                  {errors.code && (
                    <span className="text-danger">{errors.code.message}</span>
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
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            e.key === "Backspace"
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
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            e.key === "Backspace"
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
                        validate: (value) =>
                          value.length <= 200 ||
                          "Data must be 200 characters or less",
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
                    <Form.Label>Info</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      as={"textArea"}
                      name="info"
                      placeholder="Info"
                      className={classNames("", {
                        "is-invalid": errors?.info,
                      })}
                      {...register("info", {
                        required: "Info is required",
                        validate: (value) =>
                          value.length <= 200 ||
                          "Data must be 200 characters or less",
                      })}
                    />
                  </InputGroup>
                  {errors.info && (
                    <span className="text-danger">{errors.info.message}</span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Required Amount</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="required_amount"
                      placeholder="Required Amount"
                      className={classNames("", {
                        "is-invalid": errors?.required_amount,
                      })}
                      {...register("required_amount", {
                        required: "Required Amount is required",
                      })}
                      onKeyDown={(e) => {
                        // Allow left and right arrows and backspace
                        if (
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowRight" ||
                          e.key === "Backspace"
                        ) {
                          return;
                        }

                        // Allow only numbers
                        if (!/[\d]/.test(e.key)) {
                          e.preventDefault(); // Prevent non-numeric input
                        }
                      }}
                    />
                  </InputGroup>
                  {errors.required_amount && (
                    <span className="text-danger">
                      {errors.required_amount.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Use Per Coupon</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="use_per_coupon"
                      placeholder="use_per_coupon"
                      className={classNames("", {
                        "is-invalid": errors?.use_per_coupon,
                      })}
                      {...register("use_per_coupon", {
                        // required: "Use Per Coupon is required",
                      })}
                      onKeyDown={(e) => {
                        // Allow left and right arrows and backspace
                        if (
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowRight" ||
                          e.key === "Backspace"
                        ) {
                          return;
                        }

                        // Allow only numbers
                        if (!/[\d]/.test(e.key)) {
                          e.preventDefault(); // Prevent non-numeric input
                        }
                      }}
                    />
                  </InputGroup>
                  {errors.use_per_coupon && (
                    <span className="text-danger">
                      {errors.use_per_coupon.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Use Per Customer</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="use_per_customer"
                      placeholder="Use Per Customer"
                      className={classNames("", {
                        "is-invalid": errors?.use_per_customer,
                      })}
                      {...register("use_per_customer", {
                        required: "Use Per Customer is required",
                      })}
                      onKeyDown={(e) => {
                        // Allow left and right arrows and backspace
                        if (
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowRight" ||
                          e.key === "Backspace"
                        ) {
                          return;
                        }

                        // Allow only numbers
                        if (!/[\d]/.test(e.key)) {
                          e.preventDefault(); // Prevent non-numeric input
                        }
                      }}
                    />
                  </InputGroup>
                  {errors.use_per_customer && (
                    <span className="text-danger">
                      {errors.use_per_customer.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </Col>

            {/* <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="date_status"
                label="Enable Date Range"
                {...register("date_status")}
              />
            </Form.Group> */}

            {selectedCouponType?.value === 4 && (
              <>
                <Col md={6}>
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
                            // validate: (value) => {
                            //   const startDate = new Date(value);
                            //   const todayDate = new Date(today);
                            //   return (
                            //     todayDate <= startDate ||
                            //     "Start date must be today or in the future"
                            //   );
                            // },
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
                            // validate: (value) => {
                            //   const startDate = new Date(watch("s_date"));
                            //   const endDate = new Date(value);
                            //   return (
                            //     endDate > startDate ||
                            //     "End date must be greater than start date"
                            //   );
                            // },
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
                </Col>
              </>
            )}

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
                        // required: "Image is required",
                      })}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </InputGroup>
                  {errors.image && (
                    <span className="text-danger">{errors.image.message}</span>
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
                        // src={URL.createObjectURL(getValues("image")[0])}
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
                <Link to={"/coupons/coupon"}>
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
      </section>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default EditOffCanvance;
