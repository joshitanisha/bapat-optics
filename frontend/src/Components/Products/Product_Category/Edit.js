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
import { putData } from "../../../utils/api";
import Select from "react-select";
import { ItemType, SelectImageData } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

 


  // const GetEditData = async () => {
  //   const response = await getData(`/admin/masters/p-category/${id}`);
  //   reset(response?.data);
  // };
const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    try {
      

      const response = await withLoader(() => getData(`/admin/masters/p-category/${id}`));
      reset(response?.data);

    } catch (error) {
      console.error("GetEditData error:", error);

    } 
  };


  useEffect(() => {
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm();

  const imageFile = watch("image");

  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("name", data?.name);
      sendData.append("tax_percentage", data?.tax_percentage);
      sendData.append("discount_percentage", data?.discount_percentage);
      sendData.append("sort_order", data?.sort_order);
      // sendData.append("item_type_id", ItemType.Product);
      // sendData.append("button_color", data?.button_color);
      // sendData.append("background_color", data?.background_color);
      if (data?.image instanceof FileList && data.image.length > 0) {
        sendData.append("image", data?.image[0]);
      } else if (data?.gallery_image?.image[0]) {
        sendData.append("image", data?.gallery_image?.image);
      }
      const response = await withLoader(() => putData(
        `/admin/masters/p-category/${id}`,
        sendData
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
            Edit Product Category
          </Modal.Title>
        </Modal.Header>
        
          <Modal.Body>
            <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
              <Row className="">
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Group>
                        <div className="">
                          <Form.Label>Product Category</Form.Label>
                        </div>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Category"
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
                          <span className="text-danger">
                            {errors.name.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label> Tax Percentage</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Tax Percentage"
                          className={classNames("", {
                            "is-invalid": errors?.tax_percentage,
                          })}
                          {...register("tax_percentage", {
                            required: " Tax Percentage is required",
                          })}
                          onKeyDown={(e) => {
                            const allowedKeys = [
                              "Backspace",
                              "Tab",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ];

                            const currentValue = e.target.value;

                            if (
                              !(
                                (e.key >= "0" && e.key <= "9") ||
                                allowedKeys.includes(e.key)
                              )
                            ) {
                              e.preventDefault();
                            }
                            if (currentValue === "0" && e.key === "0") {
                              e.preventDefault();
                            }



                            const futureValue = e.target.value + e.key;

                            // Prevent typing more than 100
                            if (!isNaN(futureValue) && Number(futureValue) > 100) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </InputGroup>

                      {errors.tax_percentage && (
                        <span className="text-danger">
                          {errors.tax_percentage.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label> Discount Percentage</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Discount Percentage"
                          className={classNames("", {
                            "is-invalid": errors?.discount_percentage,
                          })}
                          {...register("discount_percentage", {
                            required: " Discount Percentage is required",
                          })}
                          onKeyDown={(e) => {
                            const allowedKeys = [
                              "Backspace",
                              "Tab",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ];

                            const currentValue = e.target.value;
                            // Allow numbers and control keys
                            if (
                              !(
                                (e.key >= "0" && e.key <= "9") ||
                                allowedKeys.includes(e.key)
                              )
                            ) {
                              e.preventDefault();
                            }

                            if (currentValue === "0" && e.key === "0") {
                              e.preventDefault();
                            }

                            // Get future value (current + pressed key)
                            const futureValue = e.target.value + e.key;

                            // Prevent typing more than 100
                            if (!isNaN(futureValue) && Number(futureValue) > 100) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </InputGroup>
                      {errors.discount_percentage && (
                        <span className="text-danger">
                          {errors.discount_percentage.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Group>
                        <div className="">
                          <Form.Label>Sort order</Form.Label>
                        </div>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Sort order"
                            className={classNames("", {
                              "is-invalid": errors?.sort_order,
                            })}
                            {...register("sort_order", {
                              required: "Sort order is required",
                              validate: (value) =>
                                value.length <= 200 ||
                                "Data must be 200 characters or less",
                            })}
                            onKeyDown={(e) => {
                              // Allow: Backspace, Tab, Arrow keys, Delete
                              if (
                                [
                                  "Backspace",
                                  "Tab",
                                  "ArrowLeft",
                                  "ArrowRight",
                                  "Delete",
                                ].includes(e.key)
                              ) {
                                return;
                              }

                              // Prevent non-numeric keys
                              if (!/^[0-9]$/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </InputGroup>
                        {errors.sort_order && (
                          <span className="text-danger">
                            {errors.sort_order.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>

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
                          {...register("image")}
                          accept="image/*"
                        />
                      </InputGroup>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.image.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="main-form-section mt-3">
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
