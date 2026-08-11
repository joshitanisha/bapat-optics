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
import Select from "react-select";
import ModalSave from "../../common/ModelSave";
import Validation from "../../common/FormValidation";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import { SelectImageData } from "../../../utils/common";
import { useNavigate } from "react-router";
import Header from "../../Header/Header";
import { useParams } from "react-router-dom";
import VarientSection from "./Varient";
import { useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const id = props.show;
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    try {
      const response = await withLoader(() =>
        getData(`/admin/purchase-order/receiving-order/${id}`),
      );
      reset(response?.data);
    } catch (error) {
      console.error("getDataAll error:", error);
    }
  };

  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");

    if (response?.success) {
      setCountries(await Select2Data(response?.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm();
  const [product, setProduct] = useState([]);

  const GetAllProduct = async () => {
    const response = await getData("/common/masters/product");

    if (response?.success) {
      setProduct(await Select2Data(response?.data, "product_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
  }, []);
  const watchQuantitys = watch("quantitys"); // watches the entire array

  const totalQuantity =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

  const wasteQuantity =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.waste_quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

  // const gst_price = parseFloat(item?.gstprice);

  const totalPrice =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.quantity);
      const price = parseFloat(item?.price);
      const gst_price = parseFloat(item?.gstprice);
      const total = (isNaN(qty) ? 0 : qty) * (isNaN(price) ? 0 : price);
      return sum + (total + gst_price);
    }, 0) || 0;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quantitys",
  });

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("total_quantity", totalQuantity);
      DataToSend.append("total_waste_quantity", wasteQuantity);
      // DataToSend.append("expiry_date", data?.expiry_date);
      const quantity = [];

      data.quantitys.forEach((val, index) => {
        const qty = parseFloat(val?.quantity) || 0;
        const price = parseFloat(val?.price) || 0;
        const total = (qty * price).toFixed(2);

        const quantityItem = {
          id: val?.id,
          product_id: val?.product_id?.value,
          quantity: val?.quantity || 0,
          waste_quantity: val?.waste_quantity || 0,
          expiry_date: val?.expiry_date,
          price: val?.price || 0,
          total_price: total,
          varients: [],
        };

        // val.varients?.forEach((variant) => {
        //   quantityItem.varients.push({
        //     id: variant.id,
        //     product_id: val?.product_id?.value,
        //     variant_id: variant?.varient_id?.value,
        //     general_stock: variant?.general_stock || 0,
        //     selling_price: variant?.selling_price || 0,
        //     subscription_stock: variant?.subscription_stock || 0,
        //   });
        // });

        quantity.push(quantityItem);
      });

      DataToSend.append("quantitys", JSON.stringify(quantity));
      const response = await withLoader(() =>
        putData(`/admin/purchase-order/receiving-order/${id}`, DataToSend),
      );

      console.log("DataToSend", getValues("name"));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/purchase-product/receiving-order");
        // props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [supplier, setSupplier] = useState([]);
  const GetAllSupplier = async () => {
    const response = await getData("/common/masters/all-supplier");
    if (response?.success) {
      setSupplier(await Select2Data(response?.data, "supplier_id"));
    }
  };
  useEffect(() => {
    GetAllSupplier();
  }, []);

  return (
    <>
      <Header title={"Edit Receiving Order"} link={"#"} />
      <section className="Create">
        <div className="back_btn_holder">
          <div onClick={() => navigate(`/purchase-product/receiving-order`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
        </div>

        <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
          <Row>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <div className="main-form-section ">
                <Row className="row justify-content-center mb-2 me-0 sm-0">
                  <Form.Label>Supplier</Form.Label>

                  <Controller
                    name="supplier_id" // name of the field
                    {...register("supplier_id", {
                      required: "Select Supplier",
                    })}
                    control={control}
                    render={({ field }) => (
                      <Select
                        isDisabled
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors.supplier_id
                              ? "red"
                              : baseStyles,
                          }),
                        }}
                        {...field}
                        options={supplier}
                      // onChange={(selectedOption) => {
                      //   field.onChange(selectedOption.value); // Update Controller's value
                      //   GetAllStates(selectedOption.value);
                      //   setValue("country_id", selectedOption);
                      //   setValue("state_id", null);
                      // }}
                      />
                    )}
                  />

                  {errors.supplier_id && (
                    <span className="text-danger">
                      {errors.supplier_id.message}
                    </span>
                  )}
                </Row>
              </div>
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <div className="main-form-section ">
                <Row className="justify-content-center">
                  <Form.Label>Invoice No.</Form.Label>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        disabled
                        type="text"
                        name="name"
                        placeholder="Invoice No."
                        className={classNames("", {
                          "is-invalid": errors?.invoice_no,
                        })}
                        {...register("invoice_no", {
                          required: "Invoice No. is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.invoice_no && (
                      <span className="text-danger">
                        {errors.invoice_no.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <div className="main-form-section ">
                <Row className="justify-content-center">
                  <Form.Label>Order No.</Form.Label>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        disabled
                        type="text"
                        name="name"
                        placeholder="Order No. "
                        className={classNames("", {
                          "is-invalid": errors?.order_no,
                        })}
                        {...register("order_no", {
                          required: "Order No. is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.order_no && (
                      <span className="text-danger">
                        {errors.order_no.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </div>
            <div className="oder-detail-holder mb-3">
              <div className="heading-holder ">
                <h6> Receiving Quantity</h6>
              </div>

              <div className="package-details-section">
                {fields.map((variant, index) => (
                  <div key={variant.id} className="main-form-section ">
                    <Row>
                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Product</Form.Label>
                            <Form.Group>
                              <Controller
                                name={`quantitys.${index}.product_id`} // name of the field
                                {...register(`quantitys.${index}.product_id`, {
                                  required: "Select Product",
                                })}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    isDisabled
                                    styles={{
                                      control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderColor: errors?.add_on?.[index]
                                          ?.product_id
                                          ? "red"
                                          : baseStyles,
                                      }),
                                    }}
                                    {...field}
                                    options={product}
                                  />
                                )}
                              />
                              {errors?.quantitys?.[index]?.product_id && (
                                <span className="text-danger">
                                  {errors.quantitys[index].product_id.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>
                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Brand</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                placeholder="Brand"
                                value={
                                  watch(`quantitys.${index}.product_id`)?.data
                                    ?.Brand?.name || ""
                                }
                                readOnly
                              />
                            </Form.Group>
                          </Row>
                        </div>
                      </div>
                      {watch(`quantitys.${index}.product_id`)?.Colour?.name && (
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Colour</Form.Label>
                              <Form.Group>
                                <Form.Control
                                  disabled
                                  type="text"
                                  placeholder="Colour"
                                  value={
                                    watch(`quantitys.${index}.product_id`)?.data
                                      ?.Colour?.name || ""
                                  }
                                  readOnly
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </div>
                      )}

                      {watch(`quantitys.${index}.product_id`)?.data?.size && (
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Size</Form.Label>
                              <Form.Group>
                                <Form.Control
                                  disabled
                                  type="text"
                                  placeholder="Brand"
                                  value={
                                    watch(`quantitys.${index}.product_id`)?.data
                                      ?.size || ""
                                  }
                                  readOnly
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </div>
                      )}

                      {watch(`quantitys.${index}.product_id`)?.data?.index && (
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Index</Form.Label>
                              <Form.Group>
                                <Form.Control
                                  disabled
                                  type="text"
                                  placeholder="Index"
                                  value={
                                    watch(`quantitys.${index}.product_id`)?.data
                                      ?.index || ""
                                  }
                                  readOnly
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </div>
                      )}

                      {watch(`quantitys.${index}.product_id`)?.data
                        ?.coating_name && (
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                            <div className="main-form-section mt-3">
                              <Row className="justify-content-center">
                                <Form.Label>Coating Name</Form.Label>
                                <Form.Group>
                                  <Form.Control
                                    disabled
                                    type="text"
                                    placeholder="Index"
                                    value={
                                      watch(`quantitys.${index}.product_id`)?.data
                                        ?.coating_name || ""
                                    }
                                    readOnly
                                  />
                                </Form.Group>
                              </Row>
                            </div>
                          </div>
                        )}

                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Description</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                name={`quantitys.${index}.description`}
                                placeholder="Description"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.description,
                                })}
                                {...register(`quantitys.${index}.description`, {
                                  required: "Description is required",
                                  validate: (value) =>
                                    value.length <= 200 ||
                                    "Data must be 200 characters or less",
                                })}
                              />
                              {errors?.quantitys?.[index]?.description && (
                                <span className="text-danger">
                                  {errors.quantitys[index].description.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>

                      {/* <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Waste Quantity</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name={`quantitys.${index}.waste_quantity`} // Register color for the variant
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.waste_quantity,
                                })}
                                {...register(
                                  `quantitys.${index}.waste_quantity`,
                                  {
                                    // required: "Quantity is required",
                                  }
                                )}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "ArrowLeft" ||
                                    e.key === "ArrowRight"
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
                              {errors?.quantitys?.[index]?.waste_quantity && (
                                <span className="text-danger">
                                  {
                                    errors.quantitys[index].waste_quantity
                                      .message
                                  }
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col> */}
                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Purchase Price</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                name={`quantitys.${index}.price`} // Register color for the variant
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.price,
                                })}
                                {...register(`quantitys.${index}.price`, {
                                  required: "price is required",
                                  validate: (value) =>
                                    value.length <= 200 ||
                                    "Data must be 200 characters or less",
                                })}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "ArrowLeft" ||
                                    e.key === "ArrowRight"
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
                              {errors?.quantitys?.[index]?.price && (
                                <span className="text-danger">
                                  {errors.quantitys[index].price.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>

                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Total</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                name={`quantitys.${index}.total_price`}
                                value={(() => {
                                  const receiveQty =
                                    parseFloat(
                                      watch(`quantitys.${index}.quantity`),
                                    ) || 0;
                                  const price =
                                    parseFloat(
                                      watch(`quantitys.${index}.price`),
                                    ) || 0;
                                  const total_price =
                                    parseFloat(
                                      watch(`quantitys.${index}.total_price`),
                                    ) || 0;
                                  return total_price;

                                })()}
                                // (receiveQty * price).toFixed(2);
                                readOnly
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.total_price,
                                })}
                              />
                              {errors?.quantitys?.[index]?.total_price && (
                                <span className="text-danger">
                                  {errors.quantitys[index].total_price.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>

                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                name={`quantitys.${index}.quantity`} // Register color for the variant
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.quantity,
                                })}
                                {...register(`quantitys.${index}.quantity`, {
                                  required: "Quantity is required",
                                })}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "ArrowLeft" ||
                                    e.key === "ArrowRight"
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
                              {errors?.quantitys?.[index]?.quantity && (
                                <span className="text-danger">
                                  {errors.quantitys[index].quantity.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>
                      <hr className="mt-3" />
                      {watch(`quantitys.${index}.barcode_status`) &&
                        Number(watch(`quantitys.${index}.quantity`)) > 0 &&
                        Array.from(
                          {
                            length: Number(
                              watch(`quantitys.${index}.quantity`),
                            ),
                          },
                          (_, i) => (
                            <>
                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                                <Form.Group className="mt-2" key={i}>
                                  <Form.Label>Model No. {i + 1}</Form.Label>
                                  <Form.Control
                                    disabled
                                    type="text"
                                    placeholder={`Enter Model No. ${i + 1}`}
                                    {...register(
                                      `quantitys.${index}.models.${i}`,
                                      {
                                        required: "Model No. is required",
                                      },
                                    )}
                                    className={classNames("", {
                                      "is-invalid":
                                        errors?.quantitys?.[index]?.models?.[i],
                                    })}
                                  />
                                  {errors?.quantitys?.[index]?.models?.[i] && (
                                    <span className="text-danger">
                                      {
                                        errors.quantitys[index].models[i]
                                          .message
                                      }
                                    </span>
                                  )}
                                </Form.Group>
                              </div>
                            </>
                          ),
                        )}


                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>GST</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                name={`quantitys.${index}.gst`} // Register color for the variant
                                placeholder="GST"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.gst,
                                })}
                                {...register(`quantitys.${index}.gst`, {
                                  required: "GST is required",
                                })}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "ArrowLeft" ||
                                    e.key === "ArrowRight"
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
                              {errors?.quantitys?.[index]?.gst && (
                                <span className="text-danger">
                                  {errors.quantitys[index].gst.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>

                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>GTS Price</Form.Label>
                            <Form.Group>
                              <Form.Control
                                disabled
                                type="text"
                                name={`quantitys.${index}.gstprice`} // Register color for the variant
                                placeholder="gstprice"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.gstprice,
                                })}
                                {...register(`quantitys.${index}.gstprice`, {
                                  required: "gstprice is required",
                                })}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "ArrowLeft" ||
                                    e.key === "ArrowRight"
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
                              {errors?.quantitys?.[index]?.gstprice && (
                                <span className="text-danger">
                                  {errors.quantitys[index].gstprice.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </div>

                      <hr className="mt-3" />

                      {/* <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="date"
                                name={`quantitys.${index}.expiry_date`}
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.expiry_date,
                                })}
                                min={new Date().toISOString().split("T")[0]}
                                {...register(`quantitys.${index}.expiry_date`, {
                                  // required: "Expiry Date is required",
                                  // validate: (value) => {
                                  //   const selectedDate = new Date(value);
                                  //   const today = new Date();
                                  //   today.setHours(0, 0, 0, 0);
                                  //   return (
                                  //     selectedDate > today ||
                                  //     "Expiry Date must be in the future"
                                  //   );
                                  // },
                                })}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value) {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (selectedDate <= today) {
                                      e.target.blur();
                                    }
                                  }
                                }}
                              />
                              {errors.expiry_date && (
                                <div className="invalid-feedback">
                                  {errors.expiry_date.message}
                                </div>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col> */}

                      {/* <VarientSection
                        product_id={getValues(`quantitys.${index}.product_id`)}
                        weekIndex={index}
                        control={control}
                        register={register}
                        getValues={getValues}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                      /> */}
                    </Row>
                    {/* {fields.length > 1 && (
                      <button
                        className="mt-3 add-varient"
                        type="button"
                        onClick={() => remove(index)} // Remove the variant
                      >
                        Remove Product
                      </button>
                    )} */}
                  </div>
                ))}
                <div>
                  <b>Total Quantity : </b>
                  {totalQuantity}
                </div>
                <div>
                  <b>Total Price : ₹</b>
                  {totalPrice}
                </div>
              </div>
              <hr />
              {/* <div className="text-center">
                <button
                  type="button"
                  className="add-varient"
                  onClick={() => append({})}
                >
                  + Add Product
                </button>
              </div> */}
            </div>

            {/* <Row className="mt-5 pb-3">
              <div className="d-flex justify-content-center">
                <Link to={"/purchase-product/receiving-order"}>
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
            </Row> */}
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
