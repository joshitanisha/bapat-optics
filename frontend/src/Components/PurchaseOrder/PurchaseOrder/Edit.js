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
import {  useLoader } from "../../../utils/common";
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
    
      const response = await withLoader(() => getData(
        `/admin/purchase-order/purchase-product/${id}`
      ));
      reset(response?.data);
      GetAllProduct();
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

  const Select3Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: data?.name,
      name: name,
      data: data,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
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
      const qty = parseFloat(item?.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quantitys",
  });
  const [loader, setLoder] = useState(false);
  const onSubmit = async (data) => {
    setLoder(true);
    try {
      const DataToSend = new FormData();
      DataToSend.append("total_quantity", totalQuantity);
      DataToSend.append("supplier_id", data?.supplier_id?.value);
      const variants = [];
      data.quantitys.forEach((val, index) => {
        variants.push({
          product_id: val?.product_id?.value,
          quantity: val.quantity,
          description: val.description,
        });
      });

      DataToSend.append("quantitys", JSON.stringify(variants));
      const response = await putData(
        `/admin/purchase-order/purchase-product/${id}`,
        DataToSend
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

  const [CancellationPolicyError, setCancellationPolicyError] = useState("");
  useEffect(() => {
    register("quantitys", {
      validate: (value) => {
        const isValid = value && value.length > 0;
        setCancellationPolicyError(
          isValid ? "" : "At least one Purchase Quantity is required"
        );
        return isValid;
      },
    });
  }, [register]);

  return (
    <>
      <Header title={"Edit Purchase Order"} link={"#"} />
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
            <div className="oder-detail-holder mb-3">
              <div className="heading-holder mt-3">
                <h6> Purchase Quantity</h6>
              </div>

              <div className="package-details-section">
                {fields.map((variant, index) => (
                  <div key={variant.id} className="main-form-section mt-3">
                    <Row>
                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Product/Bo Code</Form.Label>
                            <Form.Group>
                              <Controller
                                name={`quantitys.${index}.product_id`} // name of the field
                                {...register(`quantitys.${index}.product_id`, {
                                  required: "Select Product",
                                })}
                                control={control}
                                render={({ field }) => (
                                  <Select
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

                      <Col md={4}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Colour</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Brand"
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
                            <Form.Label>Quantity</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name={`quantitys.${index}.quantity`}
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.quantity,
                                })}
                                {...register(`quantitys.${index}.quantity`, {
                                  required: "Quantity is required",
                                  validate: (value) => {
                                    if (!/^[1-9]\d*$/.test(value)) {
                                      return "Quantity must be a valid number greater than 0";
                                    }
                                    return true;
                                  },
                                })}
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

                <div>
                  <b>Total Quantity : </b>{totalQuantity}
                </div>
              </div>
              {CancellationPolicyError && (
                <div className="text-danger">{CancellationPolicyError}</div>
              )}
              <hr />
              <div className="text-center">
                <button
                  type="button"
                  className="add-varient"
                  onClick={() => append({})}
                >
                  + Add Product
                </button>
              </div>
            </div>

            <Row className="mt-5 pb-3">
              <div className="d-flex justify-content-center">
                <Link to={"/purchase-product/purchase-product"}>
                  <CancelButton
                    name={"Cancel"}
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
                    name={"Save"}
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                )}
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
