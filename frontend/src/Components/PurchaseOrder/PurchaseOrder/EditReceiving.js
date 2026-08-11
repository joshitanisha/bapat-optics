import React, { useContext, useRef } from "react";
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
import VarientSection from "./Varient";
import { useParams } from "react-router-dom";
import { color } from "framer-motion";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import AddOffCanvance from "../../Products/Colour/Add";
import { useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const navigate = useNavigate();

  // const id = props.show;
  const { id } = useParams();
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [colors, setColor] = useState([]);
  const GetAllColors = async (category_id) => {
    console.log(category_id, "category_id");

    const response = await getData(
      `/common/masters/all-color?category_id=${category_id}`,
    );
    if (response?.success) {
      setColor(await Select2Data(response?.data, "color_id"));
    }
  };
  const [show, setShowAdd] = useState(false);
  const handleClose = async () => {
    const category_id = watch("category_id");
    await GetAllColors(category_id?.value);
    await setShowAdd(false);
  };
  const handleShow = () => setShowAdd(true);
  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() =>
      getData(`/admin/purchase-order/purchase-product/${id}`),
    );
    reset(response?.data);
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

  const Select3Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: data?.name,
      name: name,
      data: data,
      category_id: data.p_category_id,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
  const [product, setProduct] = useState([]);

  const GetAllProduct = async () => {
    const response = await getData("/common/masters/product");

    if (response?.success) {
      setProduct(await Select3Data(response?.data, "product_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
  }, []);
  const watchQuantitys = watch("quantitys");

  const totalQuantity =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.receive_quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

  const totalPrice =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.receive_quantity);
      const price = parseFloat(item?.price);
      const total = (isNaN(qty) ? 0 : qty) * (isNaN(price) ? 0 : price);
      return sum + total;
    }, 0) || 0;
  const [loader, setLoder] = useState(false);
  const onSubmit = async (data) => {
    setLoder(true);
    try {
      const DataToSend = new FormData();
      DataToSend.append("id", data?.id);
      DataToSend.append("total_quantity", totalQuantity);
      DataToSend.append("total_price", totalPrice);
      DataToSend.append("batch_no", data?.batch_no);
      DataToSend.append("order_no", data?.order_no);
      DataToSend.append("invoice_no", data?.invoice_no);
      // DataToSend.append("expiry_date", data?.expiry_date);
      DataToSend.append("supplier_id", data?.supplier_id?.value);

      const quantity = [];

      data.quantitys.forEach((val, index) => {
        const qty = parseFloat(val?.receive_quantity) || 0;
        const price = parseFloat(val?.price) || 0;
        const total = (qty * price).toFixed(2);

        const quantityItem = {
          id: val?.id,
          product_id: val?.product_id?.value,
          quantity: val?.receive_quantity || 0,
          // expiry_date: val?.expiry_date,
          description: val?.description,
          price: val?.price || 0,
          total_price: total,
          models: val?.models || [],
          // varients: [],
        };

        // val.varients?.forEach((variant) => {
        //   let varientsData = {
        //     product_id: val?.product_id?.value,
        //     variant_id: variant?.varient_id,
        //     general_stock: variant?.general_stock || 0,
        //     selling_price: variant?.selling_price || 0,
        //     subscription_stock: variant?.subscription_stock || 0,
        //     models: variant?.models || [],
        //   };
        //   quantityItem.varients.push(varientsData);
        // });

        quantity.push(quantityItem);
      });

      DataToSend.append("quantitys", JSON.stringify(quantity));

      const response = await withLoader(() =>
        putData(
          `/admin/purchase-order/purchase-product/receiving/${id}`,
          DataToSend,
        ),
      );

      if (response?.success) {
        setLoder(false);
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/purchase-product/purchase-product");
        // props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quantitys",
  });

  const [supplier, setSupplier] = useState([]);
  const GetAllSupplier = async () => {
    const response = await getData("/common/masters/all-supplier");
    if (response?.success) {
      setSupplier(await Select2Data(response?.data, "supplier_id"));
    }
  };

  const [brands, setBrands] = useState([]);
  const GetAllBrands = async () => {
    const response = await getData("/common/masters/all-brands");
    if (response?.success) {
      setBrands(await Select2Data(response?.data, "brand_id"));
    }
  };
  useEffect(() => {
    GetAllSupplier();

    GetAllBrands();
  }, []);
  const colorCalledRef = useRef(false);
  return (
    <>
      <Header title={"Product Purchase Compare"} link={"#"} />
      <section className="Create">
        <div className="back_btn_holder">
          <div onClick={() => navigate(`/purchase-product/purchase-product`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
        </div>

        <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
          <Row>
            <Col md={6}>
              <div className="main-form-section mt-3">
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
                        isDisabled={true}
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
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Invoice No</Form.Label>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Invoice No"
                        className={classNames("", {
                          "is-invalid": errors?.invoice_no,
                        })}
                        {...register("invoice_no", {
                          required: "Invoice No is required",
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
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Order No</Form.Label>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Order No"
                        className={classNames("", {
                          "is-invalid": errors?.order_no,
                        })}
                        {...register("order_no", {
                          required: "Order No is required",
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
            </Col>
            <div className="oder-detail-holder mb-3">
              <div className="heading-holder mt-3">
                <h6> Receiving Quanitity</h6>
              </div>

              <div className="package-details-section">
                {fields.map((variant, index) => (
                  <div key={variant.id} className="main-form-section mt-3">
                    <Row>
                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Product</Form.Label>
                            <Form.Group>
                              {/* <Controller
                                name={`quantitys.${index}.product_id`} // name of the field
                                {...register(`quantitys.${index}.product_id`, {
                                  required: "Select Product",
                                })}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    isDisabled={true}
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
                                    onChange={(selectedOption) => {
                                      field.onChange(selectedOption.value); // Update Controller's value
                                       GetAllColors(selectedOption?.data?.p_category_id);
                                   
                                    }}
                                  />
                                )}
                              /> */}
                              <Controller
                                name={`quantitys.${index}.product_id`}
                                control={control}
                                rules={{ required: "Select Product" }}
                                render={({ field }) => {
                                  if (
                                    field?.value?.data?.p_category_id &&
                                    !colorCalledRef.current
                                  ) {
                                    colorCalledRef.current = true; // stop repeat calls
                                    GetAllColors(
                                      field.value.data.p_category_id,
                                    );
                                  }

                                  return (
                                    <Select
                                      {...field}
                                      options={product}
                                      isDisabled={true}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          borderColor: errors?.quantitys?.[
                                            index
                                          ]?.product_id
                                            ? "red"
                                            : base.borderColor,
                                        }),
                                      }}
                                    />
                                  );
                                }}
                              />

                              {errors?.quantitys?.[index]?.product_id && (
                                <span className="text-danger">
                                  {errors.quantitys[index].product_id.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col>

                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Brand</Form.Label>
                            <Form.Group>
                              <Form.Control
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
                      </Col>
                      {watch(`quantitys.${index}.product_id`)?.Colour?.name && (
                        <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Colour</Form.Label>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Colour"
                                  value={
                                    watch(`quantitys.${index}.product_id`)?.data
                                      ?.Colour?.name ||
                                    watch(`quantitys.${index}.product_id`)?.data
                                      ?.lens_color?.name
                                  }
                                  readOnly
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </Col>
                      )}

                      {watch(`quantitys.${index}.product_id`)?.data?.size && (
                        <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Size</Form.Label>
                              <Form.Group>
                                <Form.Control
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
                        </Col>
                      )}

                      {watch(`quantitys.${index}.product_id`)?.data?.index && (
                        <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Index</Form.Label>
                              <Form.Group>
                                <Form.Control
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
                        </Col>
                      )}

                      {watch(`quantitys.${index}.product_id`)?.data?.Coating
                        ?.name && (
                        <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Coating Name</Form.Label>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Coating"
                                  value={
                                    watch(`quantitys.${index}.product_id`)?.data
                                      ?.Coating?.name || ""
                                  }
                                  readOnly
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </Col>
                      )}
                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Purchase Quantity</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name={`quantitys.${index}.quantity`} // Register color for the variant
                                placeholder="Quanitity"
                                readOnly
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.quantity,
                                })}
                                {...register(`quantitys.${index}.quantity`, {
                                  required: "Quanitity is required",
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
                      </Col>

                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Purchase Price</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name={`quantitys.${index}.price`} // Register color for the variant
                                placeholder="Quanitity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.price,
                                })}
                                {...register(`quantitys.${index}.price`, {
                                  required: "price is required",
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
                      </Col>

                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Total</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name={`quantitys.${index}.total_price`}
                                value={(() => {
                                  const receiveQty =
                                    parseFloat(
                                      watch(
                                        `quantitys.${index}.receive_quantity`,
                                      ),
                                    ) || 0;
                                  const price =
                                    parseFloat(
                                      watch(`quantitys.${index}.price`),
                                    ) || 0;
                                  return (receiveQty * price).toFixed(2);
                                })()}
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
                      </Col>

                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Description</Form.Label>
                            <Form.Group>
                              <Form.Control
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
                      </Col>

                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Receive Quantity</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]
                                      ?.receive_quantity,
                                })}
                                {...register(
                                  `quantitys.${index}.receive_quantity`,
                                  {
                                    required: "Quantity is required",
                                    pattern: {
                                      value: /^[0-9]*\.?[0-9]*$/,
                                      message:
                                        "Only numbers and decimals are allowed",
                                    },
                                  },
                                )}
                                onKeyDown={(e) => {
                                  const invalidKeys = [
                                    "e",
                                    "E",
                                    "+",
                                    "-",
                                    ".",
                                    ",",
                                  ];

                                  // Allow Backspace, Arrow keys
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "ArrowLeft" ||
                                    e.key === "ArrowRight" ||
                                    e.key === "Tab"
                                  ) {
                                    return;
                                  }

                                  // Block ".", letters, symbols, negative, decimal
                                  if (invalidKeys.includes(e.key)) {
                                    e.preventDefault();
                                  }

                                  // Block anything that is NOT a number 1–9
                                  if (!/^[0-9]$/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              {errors?.quantitys?.[index]?.receive_quantity && (
                                <span className="text-danger">
                                  {
                                    errors.quantitys[index].receive_quantity
                                      .message
                                  }
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col>
                      <hr className="mt-3" />
                      <div className="row me-0 ms-0">
                        <Col md={12}>
                          {watch(`quantitys.${index}.barcode_status`) &&
                            Number(
                              watch(`quantitys.${index}.receive_quantity`),
                            ) > 0 &&
                            Array.from(
                              {
                                length: Number(
                                  watch(`quantitys.${index}.receive_quantity`),
                                ),
                              },
                              (_, i) => {
                                const useColorBrand = watch(
                                  `quantitys.${index}.models.${i}.use_product_color_brand`,
                                );

                                return (
                                  <>
                                    <div
                                      className="row align-items-start mt-3"
                                      key={i}
                                    >
                                      <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                        <Form.Group>
                                          <Form.Label>
                                            Model No. {i + 1}
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            placeholder={`Enter Model No ${i + 1}`}
                                            defaultValue={
                                              watch(
                                                `quantitys.${index}.product_id`,
                                              )?.data?.model_no
                                            }
                                            {...register(
                                              `quantitys.${index}.models.${i}.model_no`,
                                              {
                                                required:
                                                  "Model No is required",
                                              },
                                            )}
                                            className={classNames({
                                              "is-invalid":
                                                errors?.quantitys?.[index]
                                                  ?.models?.[i]?.model_no,
                                            })}
                                          />
                                          {errors?.quantitys?.[index]?.models?.[
                                            i
                                          ]?.model_no && (
                                            <span className="text-danger">
                                              {
                                                errors.quantitys[index].models[
                                                  i
                                                ].model_no.message
                                              }
                                            </span>
                                          )}
                                        </Form.Group>

                                        {/* Checkbox */}
                                        <Form.Group className="mt-4">
                                          <Form.Check
                                            type="checkbox"
                                            label="Different Color / Size"
                                            {...register(
                                              `quantitys.${index}.models.${i}.use_product_color_brand`,
                                            )}
                                          />
                                        </Form.Group>
                                      </div>

                                      {/* Color */}
                                      {useColorBrand && (
                                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                          <Form.Group>
                                            <Form.Label>Colour</Form.Label>
                                            <div className="d-flex align-items-center gap-2">
                                              <Controller
                                                name={`quantitys.${index}.models.${i}.color_id`}
                                                control={control}
                                                rules={{
                                                  required: "Color is required",
                                                }}
                                                render={({ field }) => (
                                                  <Select
                                                    {...field}
                                                    options={colors}
                                                    placeholder="Select Color"
                                                  />
                                                )}
                                              />
                                              <button
                                                type="button"
                                                className="btn btn-success addcolbtn"
                                                onClick={handleShow}
                                              >
                                                <FontAwesomeIcon icon={faAdd} />
                                              </button>
                                            </div>

                                            {errors?.quantitys?.[index]
                                              ?.models?.[i]?.color_id && (
                                              <span className="text-danger">
                                                {
                                                  errors.quantitys[index]
                                                    .models[i].color_id.message
                                                }
                                              </span>
                                            )}
                                          </Form.Group>
                                        </div>
                                      )}

                                      {/* Size */}
                                      {useColorBrand && (
                                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                          <Form.Group>
                                            <Form.Label>Size</Form.Label>
                                            <Form.Control
                                              type="text"
                                              placeholder="Enter Size"
                                              {...register(
                                                `quantitys.${index}.models.${i}.size`,
                                                {
                                                  required: "Size is required",
                                                },
                                              )}
                                              className={classNames({
                                                "is-invalid":
                                                  errors?.quantitys?.[index]
                                                    ?.models?.[i]?.size,
                                              })}
                                            />
                                            {errors?.quantitys?.[index]
                                              ?.models?.[i]?.size && (
                                              <span className="text-danger">
                                                {
                                                  errors.quantitys[index]
                                                    .models[i].size.message
                                                }
                                              </span>
                                            )}
                                          </Form.Group>
                                        </div>
                                      )}
                                    </div>
                                    <hr className="mt-3" />
                                  </>
                                );
                              },
                            )}
                        </Col>
                      </div>

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
                                min={new Date().toISOString().split("T")[0]} // disable past dates in picker
                                {...register(`quantitys.${index}.expiry_date`, {
                                  required: "Expiry Date is required",
                                  validate: (value) => {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return (
                                      selectedDate > today ||
                                      "Expiry Date must be in the future"
                                    );
                                  },
                                })}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value) {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (selectedDate <= today) {
                                      e.target.blur(); // remove focus from the input if past date is entered
                                    }
                                  }
                                }}
                              />

                              {errors?.quantitys?.[index]?.expiry_date && (
                                <span className="text-danger">
                                  {errors.quantitys[index].expiry_date.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col> */}

                      {/* <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Group>
                              <Controller
                                name="expiry_date"
                                control={control}
                                rules={{
                                  required: "Select Date",
                                  validate: (value) =>
                                    new Date(value) > new Date() ||
                                    "Expiry date must be in the future",
                                }}
                                render={({ field }) => (
                                  <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]} // disables past dates
                                    className={`form-control ${
                                      errors.expiry_date ? "is-invalid" : ""
                                    }`}
                                    {...field}
                                  />
                                )}
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
                      {/* 
                      <VarientSection
                        product_id={getValues(`quantitys.${index}.product_id`)}
                        index={index}
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
                          Remove Quanitity
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
              {/* <div className="text-center">
                  <button
                    type="button"
                    className="add-varient"
                    onClick={() => append({})}
                  >
                    + Add Quanitity
                  </button>
                </div> */}
            </div>

            <Row className="mt-5 pb-3">
              <div className="d-flex justify-content-center">
                <Link to={"/purchase-product/purchase-product"}>
                  <CancelButton
                    name={"cancel"}
                    handleClose={props.handleClose}
                  />
                </Link>

                {loader ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm text-light me-2 text-center mt-4 mx-2"
                      role="status"
                    ></div>
                  </>
                ) : (
                  <SaveButton
                    name={"save"}
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                )}
              </div>
            </Row>
          </Row>
        </Form>
      </section>

      <AddOffCanvance
        handleClose={handleClose}
        setShow={setShowAdd}
        show={show}
      />
      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default EditOffCanvance;
