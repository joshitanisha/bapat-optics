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
  const { postData,IMG_URL } = useContext(Context);
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
    clearErrors,
    control,
  } = useForm();
  const imageFile = watch("image");
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      if (data?.category_id?.value) {
        finalData.append("category_id", data?.category_id?.value);
      }

      finalData.append("banner_type_id", data?.banner_type_id?.value);
      finalData.append("image", data.image[0]);
      // finalData.append("website_image", data.website_image[0]);
      const response = await withLoader(() => postData(`/admin/setting/all-banner`, finalData));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({
          code: response?.code,
          message: response?.errors,
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

  const [bannerType, setBannerType] = useState([]);

  const GetAllBannerType = async () => {
    const response = await getData("/common/masters/all-banner-type");

    if (response?.success) {
      setBannerType(await Select2Data(response?.data, "banner_type_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
    GetAllBannerType();
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
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Banner Type</Form.Label>
                    <Controller
                      name="banner_type_id" // name of the field
                      {...register("banner_type_id", {
                        required: "Select Banner Type",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.banner_type_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={bannerType}
                        />
                      )}
                    />
                    {errors.banner_type_id && (
                      <span className="text-danger">
                        {errors.banner_type_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Category</Form.Label>
                    <Controller
                      name="category_id" // name of the field
                      {...register("category_id", {
                        // required: "Select Category",
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
              </Col>
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
                  {watch("banner_type_id")?.value === 1 ? (
                              <Col lg={6}>
                                {/* Upload Section */}
                                <div className="main-form-section mt-3">
                                  <Row className="justify-content-start">
                                    <Form.Label className="text-left">
                                      Image (1296 x 454) or Video (mp4, max 20MB)
                                    </Form.Label>
              
                                    <Form.Group>
                                      <Form.Control
                                        className={classNames("", {
                                          "is-invalid": errors?.image,
                                        })}
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg, video/mp4, video/webm, video/ogg"
                                        {...register("image", {
                                          validate: async (value) => {
                                            if (
                                              typeof value !== "string" &&
                                              value?.length > 0
                                            ) {
                                              const file = value[0];
                                              const isImage = file.type.startsWith("image/");
                                              const isVideo = file.type.startsWith("video/");
              
                                              if (!isImage && !isVideo) {
                                                return "Only image or video files are allowed";
                                              }
              
                                              // ✅ Image validation
                                              if (isImage) {
                                                const ext = file.name
                                                  .split(".")
                                                  .pop()
                                                  .toLowerCase();
                                                const imageTypes = ["jpg", "jpeg", "png"];
              
                                                if (!imageTypes.includes(ext)) {
                                                  return "Only jpg, jpeg, png images allowed";
                                                }
              
                                                const sizes = await getDimension(file);
                                                if (
                                                  sizes.width !== 1296 ||
                                                  sizes.height !== 454
                                                ) {
                                                  return "Image width and height must be 1296 x 454 px";
                                                }
                                              }
              
                                              // ✅ Video validation
                                              // if (isVideo) {
                                              //   const ext = file.name
                                              //     .split(".")
                                              //     .pop()
                                              //     .toLowerCase();
                                              //   const videoTypes = ["mp4", "webm", "ogg"];
              
                                              //   if (!videoTypes.includes(ext)) {
                                              //     return "Only mp4, webm or ogg videos allowed";
                                              //   }
              
                                              //   const sizeMB = file.size / (1024 * 1024);
                                              //   if (sizeMB > 20) {
                                              //     return "Video size must be less than 20MB";
                                              //   }
                                              // }
                                            }
                                          },
                                        })}
                                      />
                                    </Form.Group>
              
                                    {errors.image && (
                                      <span className="text-danger">
                                        {errors.image.message}
                                      </span>
                                    )}
                                  </Row>
                                </div>
              
                                {/* Preview Section */}
                                <div className="main-form-section mt-3">
                                  <Form.Label>Preview</Form.Label>
              
                                  {/* Existing from backend */}
                                  {typeof getValues("image") === "string" ? (
                                    <div className="image-preview-container">
                                      {getValues("image")?.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video
                                          src={IMG_URL + getValues("image")}
                                          controls
                                          width="700"
                                          className="image-preview"
                                        />
                                      ) : (
                                        <img
                                          src={IMG_URL + getValues("image")}
                                          alt="Preview"
                                          className="image-preview"
                                        />
                                      )}
                                    </div>
                                  ) : (
                                    imageFile?.length > 0 &&
                                    (() => {
                                      const file = imageFile[0];
                                      const isVideo = file.type.startsWith("video/");
              
                                      return (
                                        <div className="image-preview-container">
                                          {isVideo ? (
                                            <video
                                              src={URL.createObjectURL(file)}
                                              controls
                                              width="700"
                                              className="image-preview"
                                            />
                                          ) : (
                                            <img
                                              src={URL.createObjectURL(file)}
                                              alt="Preview"
                                              width="700"
                                              className="image-preview"
                                            />
                                          )}
                                        </div>
                                      );
                                    })()
                                  )}
                                </div>
                              </Col>
                            ) : (
                              <Col lg={6}>
                                <div className="main-form-section mt-3">
                                  <Row className="justify-content-start">
                                    <Form.Label className="text-left">
                                      Image (1296 px and 454 px)
                                    </Form.Label>
              
                                    <Form.Group>
                                      <Form.Control
                                        className={classNames("", {
                                          "is-invalid": errors?.image,
                                        })}
                                        type="file"
                                        {...register("image", {
                                          validate: async (value) => {
                                            if (typeof value !== "string") {
                                              const fileTypes = ["jpg", "png", "jpeg"];
                                              const fileType = value[0].name?.split(".")[1];
                                              if (!fileTypes.includes(fileType)) {
                                                return `please upload a valid file format. (${fileTypes})`;
                                              }
                                              const sizes = await getDimension(value[0]);
                                              if (
                                                sizes.width !== 1296 &&
                                                sizes.height !== 454
                                              ) {
                                                return "Image width and height must be 1296 px and 454 px";
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
                                        accept=".jpg, .jpeg, .png"
                                      />
                                    </Form.Group>
                                    {errors.image && (
                                      <span className="text-danger">
                                        {errors.image.message}
                                      </span>
                                    )}
                                  </Row>
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
                                          // src={URL.createObjectURL(getValues("image")[0])}
                                          src={URL?.createObjectURL(imageFile[0])}
                                          alt="Preview"
                                          className="image-preview"
                                          width={"700px"}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            )}

              {/* <Col md={6}>
                <div className="main-form-section mt-3 mb-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label> Image (1296 px and 454 px)</Form.Label>
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
                              if (sizes.width !== 1296 && sizes.height !== 454) {
                                return "Image width and height must be 1296 px and 454 px";
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
              </Col> */}
             

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
