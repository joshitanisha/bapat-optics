import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import Select from "react-select";
import ModalSave from "../../../common/ModelSave";
import Validation from "../../../common/FormValidation";
import { CancelButton, SaveButton } from "../../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import JoditEditor from "jodit-react";
import {  useLoader } from "../../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
    setError,
    getValues,
  } = useForm();

  const imageFile = watch("image");
  const [orderSummary, setOrderCalculation] = useState(null);
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();

      // finalData.append("delivery_date", data?.delivery_date);
      // finalData.append("address_id", data?.address_id?.value);
      // finalData.append("user_id", data?.user_id?.value);
      finalData.append("name", data?.name);
      finalData.append("email", data?.email);
      finalData.append("contact_no", data?.contact_no);
      if (data?.payment_method_id?.value) {
        finalData.append("payment_method_id", data?.payment_method_id?.value);
      }

      // if (data?.time_slot_id?.value) {
      //   finalData.append("time_slot_id", data?.time_slot_id?.value);
      // }

      finalData.append(
        "order_summary",
        JSON.stringify(orderSummary?.order_summary)
      );
      finalData.append(
        "order_Details_summary",
        JSON.stringify(orderSummary?.order_Details_summary)
      );

      const variants = [];
      data.products.forEach((val, index) => {
        variants.push({
          product_id: val?.product_id?.value,
          variant_id: val?.variant_id?.value,
          quantity: val.quantity,
        });
      });

      finalData.append("products", JSON.stringify(variants));

      const response = await withLoader(() => postData(`/admin/orders`, finalData));
      if (response?.success) {
        props.getDataAll();
        props.GetAllCounts();
        await setShowModal({ code: response.code, message: response.message });
        setTimeout(() => {
          setShowModal(0);
          props.handleClose();
        }, 1000);
      } else {
        console.log(response?.errors?.contact, "(response?.errors?.contact");

        if (response?.errors?.email) {
          setError("email", {
            type: "manual",
            message: response?.errors?.email,
          });
        } else if (response?.errors?.contact) {
          setError("contact_no", {
            type: "manual",
            message: response?.errors?.contact,
          });
        }

        // await setShowModal({ code: response?.code, message: response?.errors });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const [customer, setCustomer] = useState();
  const [address, setAddres] = useState();
  const [timeSlot, setTimeSlot] = useState();
  const [pamentMethod, setPaymentMethod] = useState();
  const [today, setToday] = useState();

  const GetAllPaymentMethod = async () => {
    const response = await getData("/common/masters/all-payment-methods");
    if (response?.success) {
      setPaymentMethod(await Select2Data(response?.data, "payment_method_id"));
    }
  };
  const GetAllCustomer = async () => {
    const response = await getData("/common/masters/all-customers");
    if (response?.success) {
      setCustomer(await Select2Data(response?.data, "user_id"));
    }
  };
  const Select4Data = async (data, name, other = false) => {
    const result = data?.map((d) => {
      // Build label string dynamically
      const labelParts = [
        d?.building,
        d?.floor,
        d?.apartment,
        d?.street,
        d?.direction,
        d?.area,
        d?.socity_name,
        d?.landmark,
        d?.contact_no,
      ].filter(Boolean); // remove null/undefined

      return {
        value: d?.id,
        label: labelParts.join(", "), // combine with commas
        name: name,
      };
    });

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
  const GetAllAddress = async (id) => {
    const response = await getData(`/common/masters/all-address-user/${id}`);
    if (response?.success) {
      setAddres(await Select4Data(response?.data, "address_id"));
    }
  };

  const Select3Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: `${data?.from}-${data?.to}`,
      name: name,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };

  const GetAllTimeSlot = async () => {
    const response = await getData(
      `/common/masters/all-time-slot?delivery_date=${getValues(
        "delivery_date"
      )}`
    );
    if (response?.success) {
      setTimeSlot(await Select3Data(response?.data, "time_slot_id"));
    }
  };

  useEffect(() => {
    GetAllTimeSlot();

    GetAllCustomer();
    GetAllPaymentMethod();

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setToday(formattedDate);
  }, []);

  const [product, setProduct] = useState([]);

  const GetAllProduct = async () => {
    const response = await getData("/common/masters/order-product");

    if (response?.success) {
      setProduct(await Select2Data(response?.data, "product_id"));
    }
  };

  const [variantData, setVariantData] = useState([]);

  const Select5Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: data?.name,
      name: name,
      stock: data?.general_stock,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
  const GetVariantsByProduct = async (productId, rowIndex) => {
    if (!productId) return;
    const response = await getData(
      `/common/masters/order-product-varient/${productId}`
    );
    if (response?.success) {
      setVariantData(await Select5Data(response?.data, "variant_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const [CancellationPolicyError, setCancellationPolicyError] = useState("");
  useEffect(() => {
    register("products", {
      validate: (value) => {
        const isValid = value && value.length > 0;
        setCancellationPolicyError(
          isValid ? "" : "At least one Product is required"
        );
        return isValid;
      },
    });
  }, [register]);

  const [isCalculated, setIsCalculated] = useState(false);

  // call calculation API
  const handleCalculate = async (formValues) => {
    try {
      const finalData = {
        delivery_date: formValues?.delivery_date,
        // address_id: formValues?.address_id?.value,
        // user_id: formValues?.user_id?.value,
        payment_method_id: formValues?.payment_method_id?.value,
        name: formValues?.name,
        email: formValues?.email,
        contact_no: formValues?.contact_no,
        time_slot_id: formValues?.time_slot_id?.value,
        products: formValues.products?.map((p) => ({
          product_id: p?.product_id?.value,
          variant_id: p?.variant_id?.value,
          quantity: p.quantity,
        })),
      };

      const response = await postData("/admin/orders/calculate", finalData);
      if (response?.success) {
        setOrderCalculation(response.data);
        setIsCalculated(true);
      } else {
        setShowModal({ code: response.code, message: response.errors });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deliveryDate = watch("delivery_date"); // watch the date field

  useEffect(() => {
    if (deliveryDate) {
      GetAllTimeSlot(); // call whenever date changes
    }
  }, [deliveryDate]);

  const products = watch("products");

  useEffect(() => {
    setIsCalculated(false);
  }, [products]);

  console.log(products, "hhhhhhhhhh");

  console.log(isCalculated, "isCalculated");

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
            Add Order
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
                  <Form.Group>
                    <div className="">
                      <Form.Label>User Name</Form.Label>
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
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>User Email</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email"
                        className={classNames("", {
                          "is-invalid": errors?.email,
                        })}
                        {...register("email", {
                          // required: "email is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.email && (
                      <span className="text-danger">
                        {errors.email.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>User Contact No. </Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="contact_no"
                        placeholder="contact_no"
                        className={classNames("", {
                          "is-invalid": errors?.contact_no,
                        })}
                        {...register("contact_no", {
                          required: "contact_no is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.contact_no && (
                      <span className="text-danger">
                        {errors.contact_no.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Delivery Date</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        name="delivery_date"
                        placeholder="Delivery Date"
                        className={classNames("", {
                          // "is-invalid": errors?.delivery_date,
                        })}
                        min={today}
                        {...register("delivery_date", {
                          // required: "Delivery Date is required",
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
                    {errors.delivery_date && (
                      <span className="text-danger">
                        {errors.delivery_date.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
            
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Time Slot</Form.Label>

                    <Controller
                      name="time_slot_id" // name of the field
                      {...register("time_slot_id", {
                        // required: "Please Select Time Slot",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.time_slot_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={timeSlot}
                        />
                      )}
                    />

                    {errors.time_slot_id && (
                      <span className="text-danger">
                        {errors.time_slot_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col> */}

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Payment method</Form.Label>

                    <Controller
                      name="payment_method_id" // name of the field
                      {...register("payment_method_id", {
                        // required: "Please Select Payment method",
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
                          options={pamentMethod}
                        />
                      )}
                    />

                    {errors.payment_method_id && (
                      <span className="text-danger">
                        {errors.payment_method_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>

              {fields.map((variant, index) => (
                <div key={variant.id} className="main-form-section mt-3">
                  <Row>
                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Product</Form.Label>
                          <Form.Group>
                            <Controller
                              name={`products.${index}.product_id`}
                              control={control}
                              rules={{
                                required: "Select Product",
                              }}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors?.products?.[index]
                                        ?.product_id
                                        ? "red"
                                        : baseStyles.borderColor,
                                    }),
                                  }}
                                  {...field}
                                  options={product}
                                  onChange={(selected) => {
                                    setIsCalculated(false); // << Important: reset calculation flag
                                    field.onChange(selected); // Update react-hook-form state
                                    setValue(
                                      `products.${index}.product_id`,
                                      selected
                                    );
                                    setValue(
                                      `products.${index}.variant_id`,
                                      null
                                    );
                                    GetVariantsByProduct(
                                      selected?.value,
                                      index
                                    );
                                  }}
                                />
                              )}
                            />

                            {errors?.products?.[index]?.product_id && (
                              <span className="text-danger">
                                {errors.products[index].product_id.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Variant</Form.Label>
                          <Form.Group>
                            <Controller
                              name={`products.${index}.variant_id`}
                              control={control}
                              rules={{
                                required: "Select Variant",
                                validate: (selected) => {
                                  const selectedOption = variantData.find(
                                    (v) => v.value === selected?.value
                                  );
                                  const enteredQty = watch(
                                    `products.${index}.quantity`
                                  );

                                  if (
                                    enteredQty &&
                                    selectedOption &&
                                    Number(enteredQty) >
                                      Number(selectedOption.stock)
                                  ) {
                                    return `Only ${selectedOption.stock} items in stock`;
                                  }
                                  return true;
                                },
                              }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={variantData}
                                  onChange={(selected) => {
                                    setIsCalculated(false); // << Important: set false on every change
                                    field.onChange(selected); // Update react-hook-form state
                                  }}
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors?.products?.[index]
                                        ?.variant_id
                                        ? "red"
                                        : baseStyles.borderColor,
                                    }),
                                  }}
                                />
                              )}
                            />

                            {errors?.products?.[index]?.variant_id && (
                              <span className="text-danger">
                                {errors.products[index].variant_id.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Quantity</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name={`products.${index}.quantity`} // Register color for the variant
                              placeholder="Quantity"
                              className={classNames("", {
                                "is-invalid":
                                  errors?.products?.[index]?.quantity,
                              })}
                              {...register(`products.${index}.quantity`, {
                                required: "Quantity is required",
                                min: {
                                  value: 1,
                                  message: "Quantity must be at least 1",
                                },
                                max: {
                                  value: 1000,
                                  message: "Quantity must be 1000 or less",
                                },
                              })}
                              onChange={(e) => {
                                setIsCalculated(false);
                                setValue(
                                  `products.${index}.quantity`,
                                  e.target.value
                                );
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Backspace" ||
                                  e.key === "ArrowLeft" ||
                                  e.key === "ArrowRight" ||
                                  e.key === "Tab"
                                ) {
                                  return; // Allow the action to continue
                                }

                                // Allow digits and decimal point
                                if (!/[\d.]/.test(e.key)) {
                                  e.preventDefault(); // Block the invalid key
                                }

                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {errors?.products?.[index]?.quantity && (
                              <span className="text-danger">
                                {errors.products[index].quantity.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  {fields.length > 1 && (
                    <button
                      className="mt-3 add-varient"
                      type="button"
                      onClick={() => remove(index)} // Remove the variant
                    >
                      Remove Product
                    </button>
                  )}
                  <hr />
                </div>
              ))}

              {CancellationPolicyError && (
                <div className="text-danger">{CancellationPolicyError}</div>
              )}
              <hr />
              <div className="text-center">
                <button
                  type="button"
                  className="add-varient"
                  onClick={() => {
                    append({});
                    setIsCalculated(false);
                  }}
                >
                  + Add Product
                </button>
              </div>
              <div className="text-center mt-4">
                <h4>Order Summary</h4>
                <p>No. of Items: {orderSummary?.order_summary?.no_of_item}</p>
                <p>Total MRP: ₹{orderSummary?.order_summary?.total_mrp}</p>
                <p>
                  Total Selling Price: ₹
                  {orderSummary?.order_summary?.total_selling_price}
                </p>
                <p>Total Tax: ₹{orderSummary?.order_summary?.total_tax}</p>

                <p>
                  Total Shipping Charges: ₹
                  {orderSummary?.order_summary?.total_delivery_charges}
                </p>
                <p>
                  Total Offer Discount: ₹
                  {orderSummary?.order_summary?.total_offer_discount}
                </p>
                <p>
                  Total Coupon Discount: ₹
                  {orderSummary?.order_summary?.total_coupon_discount}
                </p>

                <h5 className="mt-3">
                  Final Amount: ₹{orderSummary?.order_summary?.total_amount}
                </h5>

                <hr className="my-3" />
              </div>
              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <Link>
                    <CancelButton
                      name={"Cancel"}
                      handleClose={props.handleClose}
                    />
                  </Link>

                  {!isCalculated ? (
                    <SaveButton
                      name={"Calculate"}
                      handleSubmit={handleSubmit(handleCalculate)}
                    />
                  ) : (
                    <SaveButton
                      name={"Confirm Order"}
                      handleSubmit={handleSubmit(onSubmit)}
                    />
                  )}
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
