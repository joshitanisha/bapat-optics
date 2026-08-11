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
import JoditEditor from "jodit-react";
import { IDS, ItemType, useLoader, Loader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  // const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/about-us/vission-mission/${id}`));
    reset(response?.data);
    // setImagePreview(IMG_URL + response?.data?.logo);
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

  const imageFile = watch("logo");
  // const imageFile2 = watch("logo_two");

  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("name", data?.name);
      sendData.append("description", data?.description);
      sendData.append("logo", data?.logo[0]);
      // sendData.append("logo_two", data?.logo_two[0]);
      const response = await withLoader(() => postData(
        `/admin/about-us/vission-mission/${id}`,
        sendData
      ));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response.code, message: response.message });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  // const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageFile([file]);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result); // Set image preview
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setImageFile(null);
  //   }
  // };
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
            Edit Our Vision Mission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
              <Col md={12}>
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

              {/* <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <div className="text-center">
                        <Form.Label>Description</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={10}
                          name="description"
                          placeholder="Description"
                          className={classNames("", {
                            "is-invalid": errors?.description,
                          })}
                          {...register("description", {
                            required: "description is required",
                          })}
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
              </Col> */}

              <Col lg={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-start">
                    {" "}
                    {/* Align to left */}
                    {/* Description */}
                    <Col sm={12}>
                      <Form.Label className="text-center">
                        Description
                      </Form.Label>
                      <Form.Group>
                        <Controller
                          name="description" // Provide the field name
                          control={control} // Pass the control object from useForm()
                          rules={{
                            required: "description is required",
                          }} // Validation rules
                          render={({ field }) => (
                            <JoditEditor
                              value={field?.value}
                              onChange={(newContent) =>
                                field.onChange(newContent)
                              }
                              onBlur={field.onBlur}
                              className={classNames("", {
                                "is-invalid": !!errors.description,
                              })}
                              placeholder="Description"
                            />
                          )}
                        />
                      </Form.Group>
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="text-center">
                      <Form.Label>Logo</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="logo"
                        placeholder="Logo"
                        className={classNames("", {
                          "is-invalid": errors?.logo,
                        })}
                        {...register("logo")}
                        accept="image/*"
                        // onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.logo && (
                      <span className="text-danger">{errors.logo.message}</span>
                    )}
                  </Form.Group>
                  {/* {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  )} */}
                </div>

                    <div className="main-form-section mt-3">
                  <Form.Label>Image Preview</Form.Label>

                  {typeof getValues("logo") == "string" ? (
                    <div className="image-preview-container">
                      <img
                        src={IMG_URL + getValues("logo")}
                        alt="Preview"
                        className="image-preview"
                        style={{ width: "150px", height: "130px" }}
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
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                    )
                  )}
                </div>
              </Col>

            

              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="text-center">
                      <Form.Label>Image Two</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="logo_two"
                        placeholder="Logo"
                        className={classNames("", {
                          "is-invalid": errors?.logo_two,
                        })}
                        {...register("logo_two")}
                        accept="image/*"
                        // onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.logo_two && (
                      <span className="text-danger">
                        {errors.logo_two.message}
                      </span>
                    )}
                  </Form.Group>
                 
                </div>
              </Col> */}

              {/* <Col lg={6}>
                <div className="main-form-section mt-3">
                  <Form.Label>Image Preview</Form.Label>

                  {typeof getValues("logo_two") == "string" ? (
                    <div className="image-preview-container">
                      <img
                        src={IMG_URL + getValues("logo_two")}
                        alt="Preview"
                        className="image-preview"
                        style={{ width: "150px", height: "130px" }}
                      />
                    </div>
                  ) : (
                    imageFile2 &&
                    imageFile2?.length > 0 && (
                      <div className="image-preview-container">
                        <img
                          // src={URL.createObjectURL(getValues("image")[0])}
                          src={URL?.createObjectURL(imageFile2[0])}
                          alt="Preview"
                          className="image-preview"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                    )
                  )}
                </div>
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

export default EditOffCanvance;
