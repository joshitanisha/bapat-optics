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
import { getDimension, Select2Data, useLoader } from "../../../utils/common";
import Select from "react-select";
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
    const response = await withLoader(() =>
      getData(`/admin/setting/all-banner/${id}`)
    );
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
  const imageFileweb = watch("website_image");

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      if (data?.category_id?.value) {
        finalData.append("category_id", data?.category_id?.value);
      }

      finalData.append("banner_type_id", data?.banner_type_id?.value);
      finalData.append("image", data.image[0]);

      const response = await withLoader(() =>
        putData(`/admin/setting/all-banner/${id}`, finalData)
      );

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

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
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

  const getDimension = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  };

  console.log(watch("banner_type_id")?.value, "watch ");

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
            Edit Banner
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
                      name="banner_type_id"
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
                      name="category_id"
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
                  <Row className="justify-content-center">
                    <Form.Group>
                      <Form.Label>Name</Form.Label>

                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "Name Is Required",
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
