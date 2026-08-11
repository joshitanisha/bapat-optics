import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import Select from "react-select";
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import { SelectImageData } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);

  const [product, setProduct] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const GetAllProduct = async () => {
    const response = await getData("/common/masters/product");

    if (response?.success) {
      setProduct(await Select2Data(response?.data, "product_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
    getValues,
  } = useForm();

  const watchQuantitys = watch("quantitys"); // watches the entire array

  const totalQuantity =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

    const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("total_quantity", totalQuantity);
      const variants = [];
      data.quantitys.forEach((val, index) => {
        variants.push({
          product_id: val?.product_id?.value,
          quantity: val.quantity,
        });
      });

      DataToSend.append("quantitys", JSON.stringify(variants));

      const response = await withLoader(() => postData(
        `/admin/purchase-order/purchase-product`,
        DataToSend
      ));

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quantitys",
  });

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
            Add Purchase Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
            // className="stateclass"
          >
            <Row>
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
                              <Form.Label>Product</Form.Label>
                              <Form.Group>
                                <Controller
                                  name={`quantitys.${index}.product_id`} // name of the field
                                  {...register(
                                    `quantitys.${index}.product_id`,
                                    {
                                      required: "Select Product",
                                    }
                                  )}
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
