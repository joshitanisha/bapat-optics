import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import Card from "react-bootstrap/Card";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import classNames from "classnames";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const {
    fields: addOnFields,
    append: appendAddOn,
    remove: removeAddOn,
  } = useFieldArray({
    control,
    name: "social_media",
  });

  const [addOnError, setAddOnError] = useState("");

  useEffect(() => {
    register("social_media", {
      validate: (value) => {
        const isValid = value && value.length > 0;
        setAddOnError(isValid ? "" : "At least one Social Media is required");
        return isValid;
      },
    });
  }, [register]);
 const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("name", data?.name);
      sendData.append("designation", data?.designation);
      sendData.append("image", data?.image[0]);

      const social_media = [];
      data.social_media.forEach((variant) => {
        const addOn = {
          link: variant.link,
          social_media_id: variant.social_media_id?.value,
        };

        social_media.push(addOn);
      });

      sendData.append("social_media", JSON.stringify(social_media));

      const response = await withLoader(() => postData(`/admin/about-us/our-team`, sendData));

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
      setImageFile([file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
    }
  };

  const [socialMedia, setSocialMedia] = useState([]);

  const GetAllSocialMedia = async () => {
    const response = await getData("/common/masters/social-links");
    if (response?.success) {
      setSocialMedia(await Select2Data(response?.data, "social_media_id"));
    }
  };

  useEffect(() => {
    GetAllSocialMedia();
  }, []);
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 100;

  const handleInputChange = (e) => {
    setCharCount(e.target.value.length);
  };
  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="edit-modal-holder"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Our Team
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
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
                        maxLength={100} // Enforce max length of 100 characters
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Name is required",
                          maxLength: {
                            value: 100,
                            message: "Name should not exceed 100 characters",
                          },
                        })}
                        onChange={handleInputChange}
                      />
                    </InputGroup>{" "}
                    <div className="text-end">
                      <small>{maxCharLimit} characters Limit </small>
                    </div>
                    {errors.name && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="text-center">
                      <Form.Label>Designation</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="designation"
                        placeholder="Designation"
                        className={classNames("", {
                          "is-invalid": errors?.designation,
                        })}
                        {...register("designation", {
                          required: "Designation is required",
                          maxLength: {
                            value: maxCharLimit,
                            message: `Name cannot exceed ${maxCharLimit} characters`,
                          },
                        })}
                        maxLength={maxCharLimit}
                        onChange={handleInputChange}
                      />
                    </InputGroup>{" "}
                    <div className="text-end">
                      <small>{maxCharLimit} characters Limit </small>
                    </div>
                    {errors.designation && (
                      <span className="text-danger">
                        {errors.designation.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="text-center">
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

              <Col md={6}>
                <div className="main-form-section mt-3">
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  )}
                </div>
              </Col>

              <div className="main-form-section mt-3"></div>
              <Card.Title>
                Social Media
                {addOnError && <div className="text-danger">{addOnError}</div>}
              </Card.Title>
              <hr />

              {addOnFields.map((variant, index) => (
                <div key={variant.id} className="main-form-section mt-3">
                  <Row>
                    <Col md={3}>
                      <div className="main-form-section mt-3">
                        <Row className="row justify-content-center mb-2 me-0 sm-0">
                          <Form.Label>Social Media</Form.Label>
                          <Controller
                            name={`social_media.${index}.social_media_id`} // name of the field
                            {...register(
                              `social_media.${index}.social_media_id`,
                              {
                                required: "Select Social Media",
                              }
                            )}
                            control={control}
                            render={({ field }) => (
                              <Select
                                styles={{
                                  control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderColor: errors?.social_media?.[index]
                                      ?.social_media_id
                                      ? "red"
                                      : baseStyles,
                                  }),
                                }}
                                {...field}
                                options={socialMedia}
                              />
                            )}
                          />
                          {errors?.social_media?.[index]?.social_media_id && (
                            <span className="text-danger">
                              {
                                errors?.social_media?.[index]?.social_media_id
                                  .message
                              }
                            </span>
                          )}
                        </Row>
                      </div>
                    </Col>

                    <Col md={3}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Link</Form.Label>
                          <Form.Group>
                            <InputGroup>
                              <Form.Control
                                type="text"
                                name={`social_media.${index}.link`}
                                placeholder="Link"
                                className={classNames("", {
                                  "is-invalid":
                                    errors?.social_media?.[index]?.link,
                                })}
                                {...register(`social_media.${index}.link`, {
                                  required: "Link is required",
                                  pattern: {
                                    value:
                                      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
                                    message: "Enter a valid URL",
                                  },
                                })}
                              />
                            </InputGroup>
                            {errors?.social_media?.[index]?.link && (
                              <span className="text-danger">
                                {errors?.social_media?.[index]?.link.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    <Col lg={3}>
                      <button
                        className="mt-3 add-varient"
                        type="button"
                        onClick={() => removeAddOn(index)}
                      >
                        Remove Social Media
                      </button>
                    </Col>
                  </Row>
                </div>
              ))}

              <div className="main-form-section mt-3"></div>
              <hr />
              <div className="text-center">
                <button
                  type="button"
                  className="add-varient"
                  onClick={() => appendAddOn({})}
                >
                  + Add Social Media
                </button>
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
