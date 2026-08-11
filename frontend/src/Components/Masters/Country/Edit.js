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
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/masters/country/${id}`));
    reset(response?.data);
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
    getValues,
    watch,
  } = useForm();

  const imageFile = watch("image");

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("name", data?.name);
      DataToSend.append("currency", data?.currency);
      DataToSend.append("country_code", data?.country_code);
      DataToSend.append("image", data?.image[0]);
      const response = await withLoader(() => putData(
        `/admin/masters/country/${id}`,
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
            Edit Country
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Country</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Country"
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
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Currency</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="currency"
                        placeholder="Currency"
                        className={classNames("", {
                          "is-invalid": errors?.currency,
                        })}
                        {...register("currency", {
                          required: "Currency is required",
                        })}
                      />
                    </InputGroup>
                    {errors.currency && (
                      <span className="text-danger">
                        {errors.currency.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Country Code</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="country_code"
                        placeholder="+91 "
                        className={classNames("", {
                          "is-invalid": errors?.country_code,
                        })}
                        {...register("country_code", {
                          required: "Country Code is required",
                        })}
                      />
                    </InputGroup>
                    {errors.country_code && (
                      <span className="text-danger">
                        {errors.country_code.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Label className="text-left">Image</Form.Label>

                    <Form.Group>
                      <Form.Control
                        className={classNames("", {
                          "is-invalid": errors?.image,
                        })}
                        type="file"
                        {...register("image", {
                          // validate: async (value) => {
                          //   if (typeof value !== "string") {
                          //     const fileTypes = ["jpg", "png", "jpeg"];
                          //     const fileType = value[0].name?.split(".")[1];
                          //     if (!fileTypes.includes(fileType)) {
                          //       return `please upload a valid file format. (${fileTypes})`;
                          //     }
                          //     const sizes = await getDimension(value[0]);
                          //     if (
                          //       sizes.width !== 420 &&
                          //       sizes.height !== 520
                          //     ) {
                          //       return "Image width and height must be 420 px and 520 px";
                          //     }
                          //     const fileSize = Math.round(
                          //       value[0].size / 1024
                          //     );
                          //     if (fileSize > 500) {
                          //       return "file size must be lower than 500kb";
                          //     }
                          //   }
                          // },
                        })}
                        accept=".jpg, .jpeg, .png"
                      />
                    </Form.Group>
                    {errors.image && (
                      <span className="text-danger">
                        {errors.image.message}
                      </span>
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
