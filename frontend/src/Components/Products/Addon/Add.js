import React, { useContext } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import JoditEditor from "jodit-react";
import { useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    control,
    formState: { errors },
    clearErrors,
  } = useForm();
  const imageFile = watch("image");
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("price", data?.price);
      finalData.append("mrp", data?.mrp);
      finalData.append("description", data?.description);
      finalData.append("image", data.image[0]);
      const response = await withLoader(() =>
        postData(`/admin/products/addon`, finalData),
      );

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({
          code: response?.code,
          message: response?.message,
        });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
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
      clearErrors("image");
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
            Add Addon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                          required: "Brand is required",
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
                      <Form.Label>MRP</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="MRP"
                        className={classNames("", {
                          "is-invalid": errors?.mrp,
                        })}
                        {...register("mrp", {
                          required: "MRP is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
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

                          if (e.key === "." && e.target.value.includes(".")) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </InputGroup>
                    {errors.mrp && (
                      <span className="text-danger">{errors.mrp.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Price"
                        className={classNames("", {
                          "is-invalid": errors?.price,
                        })}
                        {...register("price", {
                          required: "Price is required",
                          validate: (value) => {
                            if (value.length > 200) {
                              return "Data must be 200 characters or less";
                            }
                            const mrp = parseFloat(watch("mrp")); // get MRP value
                            const price = parseFloat(value);
                            if (!isNaN(price) && !isNaN(mrp) && price > mrp) {
                              return "Price cannot be greater than MRP";
                            }
                            return true;
                          },
                        })}
                        onKeyDown={(e) => {
                          if (
                            ["Backspace", "ArrowLeft", "ArrowRight"].includes(
                              e.key,
                            )
                          )
                            return;
                          if (!/[\d.]/.test(e.key)) e.preventDefault();
                          if (e.key === "." && e.target.value.includes("."))
                            e.preventDefault();
                        }}
                      />
                    </InputGroup>
                    {errors.price && (
                      <span className="text-danger">
                        {errors.price.message}
                      </span>
                    )}
                  </Form.Group>
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
                        {...register("image", {
                          required: "Image is required",
                        })}
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
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Description</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="description"
                          control={control}
                          rules={{
                            validate: (value) => {
                              // Strip HTML tags and whitespace
                              const plainText = value
                                ?.replace(/<[^>]+>/g, "")
                                .trim();
                              return (
                                plainText.length > 0 ||
                                "Description is required."
                              );
                            },
                          }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <JoditEditor
                              value={value}
                              ref={ref}
                              onBlur={() => {
                                onBlur();
                                trigger("description"); // re-validate on blur
                              }}
                              onChange={(newContent) => {
                                onChange(newContent);
                              }}
                            />
                          )}
                        />
                      </InputGroup>
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              <Col md={12}>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
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

export default AddOffCanvance;
