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
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const imageFile = watch("image");
const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("p_category_id", data?.p_category_id?.value);
      DataToSend.append("p_sub_category_id", data?.p_sub_category_id?.value);
      DataToSend.append("name", data?.name);
      DataToSend.append("image", data?.image[0]);
      const response = await withLoader(() => postData(
        `/admin/masters/p-child-category`,
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

  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_p_category_id"));
    }
  };

  const GetAllSubCategory = async (id) => {
    const response = await getData(`/common/masters/all-p-sub-category/${id}`);
    if (response?.success) {
      setSubCategories(
        await Select2Data(response?.data, "p_p_sub_category_id")
      );
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
            Add Child Sub Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
            // className="stateclass"
          >
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
                          options={categories}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value); // Update Controller's value
                            GetAllSubCategory(selectedOption.value);
                            setValue("p_category_id", selectedOption);
                            setValue("p_sub_category_id", null);
                          }}
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
                    <Form.Label>Sub Category</Form.Label>
                    <Controller
                      name="p_sub_category_id" // name of the field
                      {...register("p_sub_category_id", {
                        required: "Select Sub Category",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.p_sub_category_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={subCategories}
                        />
                      )}
                    />
                    {errors.p_sub_category_id && (
                      <span className="text-danger">
                        {errors.p_sub_category_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Child Category</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder=" Child Category"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "Child Category is required",
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
                    <Form.Group>
                      <Form.Control
                        className={classNames("", {
                          "is-invalid": errors?.image,
                        })}
                        type="file"
                        {...register("image", {
                          required: "Image is required",
                        })}
                        accept=".jpg, .jpeg, .png"
                      />
                    </Form.Group>
                    {errors.image && (
                      <span className="text-danger">
                        {errors.image.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col className="main-form-section mt-3">
                <div className="main-form-section mt-3">
                  <Form.Label> Image Preview</Form.Label>

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
