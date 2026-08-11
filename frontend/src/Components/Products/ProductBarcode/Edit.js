import React, { useContext } from "react";
import { useState, useEffect } from "react";
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
import { putData } from "../../../utils/api";
import { CouponType, Select2Data } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
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
    setValue,
    watch,
    clearErrors,
  } = useForm();
 const { loading, withLoader } = useLoader();
  const GetEditData = async (id) => {
    const response = await withLoader(() => getData(`/admin/products/product-stock/${id}`));
    reset(response?.data);
  };
  useEffect(() => {
    if (id) {
      GetEditData(id);
    }
  }, [id]);

  const [products, setProducts] = useState([]);

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("barcode_no", data?.barcode_no);
      DataToSend.append("product_id", data?.product_id);
      DataToSend.append("mrp", data?.mrp || "");
      DataToSend.append("discount", data?.discount || "");
      DataToSend.append("discount_amount", data?.discount_amount || "");
      DataToSend.append("price", data?.price || "");
      DataToSend.append("tax_percentage", data?.tax_percentage || "");
      DataToSend.append("tax_amount", data?.tax_amount || "");
      DataToSend.append("base_amount", data?.base_amount || "");

      const response = await withLoader(() => putData(
        `/admin/products/product-stock//barcode-update/${id}`,
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
    const response = await getData(`/common/masters/product`);
    if (response?.success) {
      setProducts(await Select2Data(response?.data, "product_id"));
    }
  };

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    setToday(formattedDate);
    getAllProducts();
  }, []);

  const mrp = watch("mrp");
  const discount = watch("discount");
  const tax_percentage = watch("tax_percentage");

  useEffect(() => {
    const parsedMrp = parseFloat(mrp) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
    const parsedTax = parseFloat(tax_percentage) || 0;

    if (parsedMrp > 0) {
      const discountAmount = (parsedMrp * parsedDiscount) / 100;
      const sellingPrice = parsedMrp - discountAmount;

      setValue("discount_amount", discountAmount.toFixed(2));
      setValue("price", sellingPrice.toFixed(2));

      if (parsedTax > 0) {
        const taxAmount = (sellingPrice * parsedTax) / 100;
        const baseAmount = sellingPrice - taxAmount;
        setValue("tax_amount", taxAmount.toFixed(2));
        setValue("base_amount", baseAmount.toFixed(2));
      } else {
        setValue("tax_amount", "");
        setValue("base_amount", "");
      }
    } else {
      setValue("price", "");
      setValue("discount_amount", "");
      setValue("tax_amount", "");
      setValue("base_amount", "");
    }
  }, [mrp, discount, tax_percentage, setValue]);

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
            Edit Product Stocks
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              {" "}
              <Col md={4}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Barcode No.</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Barcode No."
                        className={classNames("", {
                          "is-invalid": errors?.barcode_no,
                        })}
                        {...register("barcode_no", {
                          required: "Barcode No. is required",
                        })}
                      />
                      {errors?.barcode_no && (
                        <span className="text-danger">
                          {errors.barcode_no.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row className="">
              <Col md={3}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>MRP</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="MRP"
                        className={classNames("", {
                          "is-invalid": errors?.mrp,
                        })}
                        {...register("mrp", {
                          required: "MRP is required",
                        })}
                        onKeyDown={(e) => {
                          if (
                            !/[\d.]/.test(e.key) &&
                            !["Backspace", "ArrowLeft", "ArrowRight"].includes(
                              e.key
                            )
                          )
                            e.preventDefault();
                          if (e.key === "." && e.target.value.includes("."))
                            e.preventDefault();
                        }}
                      />
                      {errors?.mrp && (
                        <span className="text-danger">
                          {errors.mrp.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>

                <div className="main-form-section mt-2">
                  <Row className="justify-content-center">
                    <Form.Label>Base Amount</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        readOnly
                        placeholder="Base Amount"
                        {...register("base_amount")}
                      />
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              {/* Discount */}
              <Col md={3}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Discount"
                        className={classNames("", {
                          "is-invalid": errors?.discount,
                        })}
                        {...register("discount", {
                          required: "Discount is required",
                        })}
                        onKeyDown={(e) => {
                          if (
                            !/[\d.]/.test(e.key) &&
                            !["Backspace", "ArrowLeft", "ArrowRight"].includes(
                              e.key
                            )
                          )
                            e.preventDefault();
                          if (e.key === "." && e.target.value.includes("."))
                            e.preventDefault();
                        }}
                      />
                      {errors?.discount && (
                        <span className="text-danger">
                          {errors.discount.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>

                {/* Discount Amount */}
                <div className="main-form-section mt-2">
                  <Row className="justify-content-center">
                    <Form.Label>Discount Amount</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        readOnly
                        placeholder="Discount Amount"
                        {...register("discount_amount")}
                      />
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              {/* Final Price */}
              <Col md={3}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Final Price</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        readOnly
                        placeholder="Final Price"
                        {...register("price")}
                      />
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              {/* Tax */}
              <Col md={3}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Tax Percentage</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Tax %"
                        className={classNames("", {
                          "is-invalid": errors?.tax_percentage,
                        })}
                        {...register("tax_percentage", {
                          required: "Tax Percentage is required",
                          validate: (value) =>
                            parseFloat(value) <= 100 ||
                            "Tax cannot exceed 100%",
                        })}
                        onKeyDown={(e) => {
                          if (
                            !/[\d.]/.test(e.key) &&
                            !["Backspace", "ArrowLeft", "ArrowRight"].includes(
                              e.key
                            )
                          )
                            e.preventDefault();
                          if (e.key === "." && e.target.value.includes("."))
                            e.preventDefault();
                        }}
                      />
                      {errors.tax_percentage && (
                        <span className="text-danger">
                          {errors.tax_percentage.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>

                {/* Tax Amount */}
                <div className="main-form-section mt-2">
                  <Row className="justify-content-center">
                    <Form.Label>Tax Amount</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        readOnly
                        placeholder="Tax Amount"
                        {...register("tax_amount")}
                      />
                    </Form.Group>
                  </Row>
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
