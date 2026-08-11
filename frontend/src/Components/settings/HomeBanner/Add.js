import React, { useContext, useEffect } from "react";
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
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { getDimension, Select2Data } from "../../../utils/common";
import { getData } from "../../../utils/api";
import Select from "react-select";
import {  useLoader } from "../../../utils/common";

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
    formState: { errors },
    clearErrors, control,
  } = useForm();
  const imageFile = watch("image");
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      // finalData.append("category_id", data?.category_id?.value);
      finalData.append("image", data.image[0]);
      // finalData.append("website_image", data.website_image[0]);
      const response = await withLoader(() => postData(`/admin/setting/home-banner`, finalData));

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

  

  const [countries, setCountries] = useState([]);

  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");

    if (response?.success) {
      setCountries(await Select2Data(response?.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
  }, []);
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
            Add Banner
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Category</Form.Label>
                    <Controller
                      name="category_id" // name of the field
                      {...register("category_id", {
                        required: "Select Category",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.category_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={countries}
                        />
                      )}
                    />
                    {errors.category_id && (
                      <span className="text-danger">
                        {errors.category_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col> */}
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
                          required: "Name is required",
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
                      <Form.Label> Image (752 px and 330 px)</Form.Label>
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
                             validate: async (value) => {
                            if (typeof value !== "string") {
                              const fileTypes = ["jpg", "png", "jpeg"];
                              const fileType = value[0].name?.split(".")[1];
                              if (!fileTypes.includes(fileType)) {
                                return `please upload a valid file format. (${fileTypes})`;
                              }
                              const sizes = await getDimension(value[0]);
                              if (sizes.width !== 752 && sizes.height !== 330) {
                                return "Image width and height must be 752 px and 330 px";
                              }
                              // const fileSize = Math.round(
                              //   value[0].size / 1024
                              // );
                              // if (fileSize > 500) {
                              //   return "file size must be lower than 500kb";
                              // }
                            }
                          },
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

                {imageFile && imageFile?.length > 0 && (
                    <div className="image-preview-container">
                      <img
                        src={URL.createObjectURL(imageFile[0])}
                        alt="Preview"
                        className="image-preview"
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
