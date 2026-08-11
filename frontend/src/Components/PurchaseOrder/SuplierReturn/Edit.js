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
    const response = await withLoader(() => getData(
      `/admin/purchase-order/purchase-product/${id}`
    ));
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quantitys",
  });

  const onSubmit = async (data) => {
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
      const response = await withLoader(() => putData(
        `/admin/purchase-order/purchase-product/${id}`,
        DataToSend
      ));

      console.log("DataToSend", getValues("name"));

      if (response?.success) {
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
            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="row justify-content-center mb-2 me-0 sm-0">
                  <Form.Label>Supplier</Form.Label>

                  <Controller
                    name="supplier_id" // name of the field
                    {...register("supplier_id", {
                      required: "Select City",
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
            </Col> */}
            <div className="oder-detail-holder mb-3">
              <div className="heading-holder mt-3">
                <h6> Product Return</h6>
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
                            <Form.Label>Quantity</Form.Label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name={`quantitys.${index}.quantity`} // Register color for the variant
                                placeholder="Quantity"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.quantitys?.[index]?.quantity,
                                })}
                                {...register(`quantitys.${index}.quantity`, {
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

                <div><b>Total Quantity : </b>{totalQuantity}</div>
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
