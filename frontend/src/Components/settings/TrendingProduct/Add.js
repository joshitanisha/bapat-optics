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
import { Select2Data } from "../../../utils/common";
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
    clearErrors,
    control,
  } = useForm();
  const imageFile = watch("image");
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      // finalData.append("name", data?.name);

      finalData.append("product_id", data?.product_id?.value);
      finalData.append("gender_id", data?.gender_id?.value);

      finalData.append("image", data.image[0]);
      // finalData.append("website_image", data.website_image[0]);
      const response = await withLoader(() => postData(
        `/admin/setting/trending-product`,
        finalData
      ));

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
    const response = await getData("/common/masters/trending-product-type");

    if (response?.success) {
      setBannerType(await Select2Data(response?.data, "banner_type_id"));
    }
  };
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    const response = await getData(`/common/masters/product`);
    if (response?.success) {
      setProducts(await Select2Data(response?.data, "product_id"));
    }
  };

  useEffect(() => {
    getAllProducts();
    GetAllCategory();
    GetAllBannerType();
  }, []);

  const options = [
    { value: 1, label: "Men" },
    { value: 2, label: "Women" },
  ];
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
            Add Trending Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Gender</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="gender_id" // name of the field
                        {...register("gender_id", {
                          required: "Select Gender",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.gender_id
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={options}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.gender_id && (
                      <span className="text-danger">
                        {errors.gender_id.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Product</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="product_id" // name of the field
                        {...register("product_id", {
                          required: "Select Product",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.product_id
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={products}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.product_id && (
                      <span className="text-danger">
                        {errors.product_id.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label> Image</Form.Label>
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
              <Col md={12}>
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
