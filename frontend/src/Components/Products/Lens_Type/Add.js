import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import Select from "react-select";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import classNames from "classnames";
import { getData } from "../../../utils/api";
import { ItemType, SelectImageData } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    control,
    setValue,
    getValues,
    watch,
  } = useForm();

  const imageFile = watch("image");
 const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("name", data?.name);

      sendData.append("item_type_id", ItemType.Product);

      // Use the image from gallery selection or file upload
      if (data?.image && data?.image[0]) {
        sendData.append("image", data?.image[0]);
      }
      const response = await withLoader(() => postData(`/admin/masters/lens-type`, sendData));

      if (response?.success) {
        setShowModal({ code: response.code, message: response.message });
      } else {
        setShowModal({
          code: response?.code,
          message: response?.errors,
        });
      }

      setTimeout(() => {
        setShowModal({ code: 0, message: "" });
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
            Add Lens Type
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label> Lens Type</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Type"
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Name is required",
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
                      <Form.Label>Image</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="image"
                        placeholder="Image"
                        className={classNames("", {
                          "is-invalid":
                            errors?.image ||
                            (errors?.gallery_image &&
                              !imageFile &&
                              !getValues("gallery_image")),
                        })}
                        {...register("image", {
                          required: !getValues("gallery_image")
                            ? "Image is required"
                            : false,
                        })}
                        accept="image/*"
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

              <Col md={6}>
                <div className="main-form-section mt-3">
                  {imageFile && imageFile?.length > 0 && (
                    <div className="image-preview-container">
                      <img
                        src={URL.createObjectURL(imageFile[0])}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
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

export default AddOffCanvance;
