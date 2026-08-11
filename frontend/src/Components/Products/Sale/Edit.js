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
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  
const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/product/sale/${id}`));
    reset(response?.data);
    setImagePreview(IMG_URL + response?.data?.logo);
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
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("description", data?.description);
      sendData.append("short_description", data?.short_description);

      const response = await withLoader(() => postData(`/product/sale/${id}`, sendData));

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
            Edit Sale
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Description</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
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

              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Short Description</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="short_description"
                        placeholder="Short Description"
                        className={classNames("", {
                          "is-invalid": errors?.short_description,
                        })}
                        {...register("short_description", {
                          required: "short description is required",
                        })}
                      />
                    </InputGroup>
                    {errors.short_description && (
                      <span className="text-danger">
                        {errors.short_description.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

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
                              value={field.value}
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
