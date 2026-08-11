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
import Validation from "../../common/FormValidation";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import { SelectImageData } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/masters/p-sub-category/${id}`));
    reset(response?.data);

    setImagePreview(IMG_URL + response?.data?.image);
  };

  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");

    if (response?.success) {
      setCountries(await Select2Data(response?.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm();

  const imageFile = watch("image");

  const onSubmit = async (data) => {
    try {
      console.log(data,'data data');
      
      const DataToSend = new FormData();
      DataToSend.append("p_category_id", data?.p_category_id?.value);
      DataToSend.append("name", data?.name);
      if (data?.image instanceof FileList && data.image.length > 0) {
        console.log("simple image");
        
        DataToSend.append("image", data?.image[0]);
      } else if (data?.gallery_image?.image[0]) {
        console.log('gallery image');
        
        DataToSend.append("image", data?.gallery_image?.image);
      }
      const response = await withLoader(() => putData(
        `/admin/masters/p-sub-category/${id}`,
        DataToSend
      ));

      console.log("DataToSend", getValues("name"));

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
    const file = e?.target?.files[0] || e;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const [GalleryImages, setGalleryImages] = useState([]);
  const getGalleyImages = async () => {
    try {
      const response = await getData("/common/masters/all-gallery-images");

      // Check if response and response.data exist
      if (response && response.data) {
        setGalleryImages(await SelectImageData(response.data, "image"));
      } else {
        console.error("No gallery images data found:", response);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };

  useEffect(() => {
    getGalleyImages();
  }, []);

  const handleGalleryImageChange = (selectedOption) => {
    // Reset the file input when an image is selected from the gallery
    setValue("image", null); // Reset file input
    setValue("gallery_image", selectedOption); // Set the gallery image in the form
    setImagePreview(IMG_URL + selectedOption?.image); // Set the selected image preview
  };

  const handleFileInputChange = (e) => {
    // Reset the dropdown when a file is uploaded
    setValue("gallery_image", null); // Reset gallery selection
    handleImageChange(e); // Handle the file input change
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
            Edit Sub Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Category</Form.Label>
                    <Controller
                      name="p_category_id" // name of the field
                      {...register("p_category_id", {
                        required: "Select Category",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.p_category_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={countries}
                        />
                      )}
                    />
                    {errors.p_category_id && (
                      <span className="text-danger">
                        {errors.p_category_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Name</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="State"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "State is required",
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
                        onChange={handleFileInputChange}
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
                  <Form.Group>
                    <div className="">
                      <Form.Label>Gallery Image</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="gallery_image" // name of the field
                        {...register("gallery_image", {
                          // required: !getValues("image") ? "Select Image" : false,
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.gallery_image
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={GalleryImages} // Pass gallery images here
                            onChange={handleGalleryImageChange} // Handle gallery selection change
                            formatOptionLabel={(option) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={IMG_URL + option?.image}
                                  alt={option?.label}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    marginRight: "10px",
                                  }}
                                />
                                <span>{option?.label}</span>
                              </div>
                            )}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.gallery_image && (
                      <span className="text-danger">
                        {errors.gallery_image.message}
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
