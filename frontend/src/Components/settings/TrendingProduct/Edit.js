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
import { Select2Data } from "../../../utils/common";
import Select from "react-select";
import {  useLoader } from "../../../utils/common";
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
    const response = await withLoader(() => getData(`/admin/setting/trending-product/${id}`));
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
      finalData.append("product_id", data?.product_id?.value);
      finalData.append("image", data.image[0]);
      finalData.append("gender_id", data?.gender_id?.value);
      const response = await withLoader(() => putData(
        `/admin/setting/trending-product/${id}`,
        finalData
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
            Edit Trending Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col lg={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-start">
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
                  </Row>
                </div>
              </Col>

              <Col lg={6}>
                <Form.Label className="text-left"> Image</Form.Label>

                <Form.Group>
                  <Form.Control
                    className={classNames("", {
                      "is-invalid": errors?.image,
                    })}
                    type="file"
                    {...register("image", {
                      // validate: async (value) => {
                      //   if (typeof value !== "string") {
                      //     const fileTypes = ["jpg", "png", "jpeg"];
                      //     const fileType = value[0].name?.split(".")[1];
                      //     if (!fileTypes.includes(fileType)) {
                      //       return `please upload a valid file format. (${fileTypes})`;
                      //     }
                      //     const sizes = await getDimension(value[0]);
                      //     if (
                      //       sizes.width !== 420 &&
                      //       sizes.height !== 520
                      //     ) {
                      //       return "Image width and height must be 420 px and 520 px";
                      //     }
                      //     const fileSize = Math.round(
                      //       value[0].size / 1024
                      //     );
                      //     if (fileSize > 500) {
                      //       return "file size must be lower than 500kb";
                      //     }
                      //   }
                      // },
                    })}
                    accept=".jpg, .jpeg, .png"
                  />
                </Form.Group>
                {errors.image && (
                  <span className="text-danger">{errors.image.message}</span>
                )}
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
