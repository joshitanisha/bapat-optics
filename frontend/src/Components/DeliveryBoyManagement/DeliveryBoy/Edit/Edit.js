import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import "./Create.css";
import Select from "react-select";
import Header from "../../../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalSave from "../../../common/ModelSave";
import { useNavigate } from "react-router";
import { putData } from "../../../../utils/api";

function Edit() {
  const { id } = useParams();

  console.log("idiididi", id);

  const navigate = useNavigate();
  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    isAllow,
    Per_Page_Dropdown,
    Select2Data,
    usertype,
    IMG_URL,
    postData,
  } = useContext(Context);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm();

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const imageFile = watch("image");
  const imageFiles = watch("images");

  console.log("imageFiles", imageFiles);

  const onSubmit = async (data) => {
    console.log("getData", getValues());

    try {
      const DataToSend = new FormData();
      DataToSend.append("name", data?.name);
      DataToSend.append("price", data?.price);
      DataToSend.append("mrp", data?.mrp);
      DataToSend.append("stock", data?.stock);
      DataToSend.append("manufacturer", data?.manufacturer);
      DataToSend.append("description", data?.description);
      DataToSend.append("tax_percentage", data?.tax_percentage);
      DataToSend.append("p_category_id", data?.p_category_id?.value);
      DataToSend.append("p_sub_category_id", data?.p_sub_category_id?.value);
      DataToSend.append("unit_id", data?.unit_id?.value);
      DataToSend.append("brand_id", data?.brand_id?.value);

      if (data?.image && data?.image[0]) {
        DataToSend.append("image", data.image[0]);
      }

      // Append the images (multiple files)
      if (data?.images && data?.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          DataToSend.append("images", data.images[i]);
        }
      }

      const response = await putData(`/admin/products/${id}`, DataToSend);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
        reset();
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/products");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  console.log("categories", categories);

  const getAllBrands = async () => {
    const response = await getData(`/common/masters/all-brands`);
    if (response?.success) {
      setBrands(await Select2Data(response?.data, "brand_id"));
    }
  };
  const getAllUnits = async () => {
    const response = await getData(`/common/masters/all-units`);
    if (response?.success) {
      setUnits(await Select2Data(response?.data, "unit_id"));
    }
  };
  const getAllCategories = async () => {
    const response = await getData("/common/masters/all-p-category");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };
  const getAllSubCategories = async (id) => {
    const response = await getData(`/common/masters/all-p-sub-category/${id}`);
    if (response?.success) {
      setSubCategories(await Select2Data(response?.data, "p_sub_category_id"));
    }
  };
  useEffect(() => {
    getAllBrands();
    getAllUnits();
    getAllCategories();
  }, []);

  const GetEditData = async () => {
    const response = await getData(`/admin/products/${id}`);
    reset(response?.data);
  };

  useEffect(() => {
    GetEditData();
  }, [id]);

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

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImagesChange = (e) => {
    const files = e.target.files;
    if (files) {
      const previews = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <>
      <Header title={"Edit Product"} link={"/employee/employee_details"} />
      <section className="Create">
        {/* back button start */}
        <div className="back_btn_holder">
          <FontAwesomeIcon
            className="back-btn"
            icon={faAngleLeft}
            onClick={() => navigate("/products")}
          />{" "}
          Back
        </div>
        {/* back button end */}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* 1. Order Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>1. Product Category</h6>
            </div>
            <div className="package-details-section">
              <div className="pending-table ">
                <div className="row ">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <div className="text-center">
                      <Form.Label>Category</Form.Label>
                    </div>
                    <Controller
                      className="select-contoller"
                      name={`p_category_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Category",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.p_category_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={categories}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                            getAllSubCategories(selectedValue?.value);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.p_category_id && (
                      <span className="text-danger">
                        {errors.p_category_id.message}
                      </span>
                    )}
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <div className="text-center">
                      <Form.Label>Sub Category</Form.Label>
                    </div>
                    <Controller
                      className="select-contoller"
                      name={`p_sub_category_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Sub Category",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.p_sub_category_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={subCategories}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.p_sub_category_id && (
                      <span className="text-danger">
                        {errors.p_sub_category_id.message}
                      </span>
                    )}
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <div className="text-center">
                      <Form.Label>Brand</Form.Label>
                    </div>
                    <Controller
                      className="select-contoller"
                      name={`brand_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Sub Category",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.brand_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={brands}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.brand_id && (
                      <span className="text-danger">
                        {errors.brand_id.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 1. Order Details end */}

          {/* 2. Package Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>2. Product</h6>
            </div>
            <div className="package-details-section">
              <Row>
                <Col>
                  {/* Package Weight */}
                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Name</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name={`name`}
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name, // Adjusted error checking
                          })}
                          {...register(`name`, {
                            required: "name is required",
                          })}
                        />
                      </div>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Thumbnail</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="file"
                          name="image"
                          placeholder="Image"
                          className={classNames("", {
                            "is-invalid": errors?.image,
                          })}
                          {...register("image", {
                            // required: "Image is required",
                          })}
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      {errors.image && (
                        <span className="text-danger">
                          {errors.image.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Unit</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="">
                        <Controller
                          className="select-contoller"
                          name={`unit_id`} // name of the field
                          control={control}
                          rules={{
                            required: "Select Unit",
                          }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <Select
                              styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  borderColor: errors?.unit_id
                                    ? "red"
                                    : baseStyles.borderColor,
                                }),
                              }}
                              // {...field}
                              options={units}
                              onChange={(selectedValue) => {
                                onChange(selectedValue);
                              }}
                              onBlur={onBlur}
                              value={value}
                              ref={ref}
                            />
                          )}
                        />
                      </div>
                      {errors.unit_id && (
                        <span className="text-danger">
                          {errors.unit_id.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Price</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name={`price`}
                          placeholder="Price"
                          className={classNames("", {
                            "is-invalid": errors?.price, // Adjusted error checking
                          })}
                          {...register(`price`, {
                            required: "Price is required",
                          })}
                          onKeyDown={(e) => {
                            // Allow numbers, backspace, left arrow, right arrow, and a decimal point
                            if (
                              !/[0-9]/.test(e.key) && // Disallow any non-numeric key
                              e.key !== "Backspace" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight" &&
                              e.key !== "Tab" &&
                              e.key !== "."
                            ) {
                              e.preventDefault(); // Prevent the event if it's not allowed
                            }

                            // Prevent entering more than one decimal point
                            if (e.key === "." && e.target.value.includes(".")) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      {errors.price && (
                        <span className="text-danger">
                          {errors.price.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">MRP</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name={`mrp`}
                          placeholder="MRP"
                          className={classNames("", {
                            "is-invalid": errors?.mrp, // Adjusted error checking
                          })}
                          {...register(`mrp`, {
                            required: "MRP is required",
                            validate: (value) => {
                              // Parse both price and mrp to numbers
                              const priceValue = parseFloat(getValues("price"));
                              const mrpValue = parseFloat(value);

                              // Check if mrp is less than price
                              if (mrpValue > priceValue) {
                                return "MRP must be less than Price";
                              }
                              return true; // Return true if valid
                            },
                          })}
                          onKeyDown={(e) => {
                            // Allow numbers, backspace, left arrow, right arrow, and a decimal point
                            if (
                              !/[0-9]/.test(e.key) && // Disallow any non-numeric key
                              e.key !== "Backspace" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight" &&
                              e.key !== "Tab" &&
                              e.key !== "."
                            ) {
                              e.preventDefault(); // Prevent the event if it's not allowed
                            }

                            // Prevent entering more than one decimal point
                            if (e.key === "." && e.target.value.includes(".")) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      {errors.mrp && (
                        <span className="text-danger">
                          {errors.mrp.message}
                        </span>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col lg={4} md={4} className="ms-5">
                  {typeof getValues("image") == "string" ? (
                    <div className="image-preview-container ms-5">
                      <img
                        src={IMG_URL + getValues("image")}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  ) : (
                    imagePreview && (
                      <div className="image-preview-container ms-5">
                        <img src={imagePreview} alt="Category Preview" />
                      </div>
                    )
                  )}
                </Col>
              </Row>
            </div>
          </div>
          {/* 2. Package Details end */}

          {/* 3. Pickup Slot Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>3. Details</h6>
            </div>
            <div className="package-details-section">
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Tax Percentage</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name={`tax_percentage`}
                      placeholder="Tax Percentage (%)"
                      className={classNames("", {
                        "is-invalid": errors?.tax_percentage, // Adjusted error checking
                      })}
                      {...register(`tax_percentage`, {
                        required: "Tax Percentage is required",
                        validate: (value) => {
                          const numericValue = parseFloat(value);
                          if (numericValue > 100) {
                            return "Tax percentage cannot exceed 100";
                          }
                          return true;
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow numbers, backspace, left arrow, right arrow, and a decimal point
                        if (
                          !/[0-9]/.test(e.key) && // Disallow any non-numeric key
                          e.key !== "Backspace" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight" &&
                          e.key !== "Tab" &&
                          e.key !== "."
                        )  {
                          e.preventDefault(); // Prevent the event if it's not allowed
                        }

                        // Prevent entering more than one decimal point
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        // Ensure the value stays within the range of 0 to 100
                        const value = e.target.value;
                        if (parseFloat(value) > 100) {
                          e.target.value = "100"; // Set the value to 100 if it exceeds
                        }
                      }}
                    />
                  </div>
                  {errors.tax_percentage && (
                    <span className="text-danger">
                      {errors.tax_percentage.message}
                    </span>
                  )}
                </Col>
              </Row>
              {/* Pickup Slot */}
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Manufacturer</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name={`manufacturer`}
                      placeholder="Manufacturer"
                      className={classNames("", {
                        "is-invalid": errors?.manufacturer, // Adjusted error checking
                      })}
                      {...register(`manufacturer`, {
                        required: "manufacturer is required",
                      })}
                    />
                  </div>
                  {errors.manufacturer && (
                    <span className="text-danger">
                      {errors.manufacturer.message}
                    </span>
                  )}
                </Col>
              </Row>
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Stock</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name={`stock`}
                      placeholder="Stock"
                      className={classNames("", {
                        "is-invalid": errors?.stock, // Adjusted error checking
                      })}
                      {...register(`stock`, {
                        required: "stock is required",
                      })}
                    />
                  </div>
                  {errors.stock && (
                    <span className="text-danger">{errors.stock.message}</span>
                  )}
                </Col>
              </Row>
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Description</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      as={"textArea"}
                      name={`description`}
                      placeholder="Description"
                      className={classNames("", {
                        "is-invalid": errors?.description, // Adjusted error checking
                      })}
                      {...register(`description`, {
                        required: "Description is required",
                      })}
                    />
                  </div>
                  {errors.description && (
                    <span className="text-danger">
                      {errors.description.message}
                    </span>
                  )}
                </Col>
              </Row>
            </div>
          </div>
          {/* 3. Pickup Slot Details end */}

          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>3. Images</h6>
            </div>
            <div className="package-details-section">
              {/* Pickup Slot */}
              <Row className="detail-row">
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="file"
                      name="images"
                      multiple
                      placeholder="Image"
                      className={classNames("", {
                        "is-invalid": errors?.images,
                      })}
                      {...register("images", {
                        // required: "Images is required",
                      })}
                      accept="image/*"
                      onChange={handleImagesChange}
                    />
                  </div>
                  {errors.images && (
                    <span className="text-danger">{errors.images.message}</span>
                  )}
                </Col>
                {/* {imagePreviews && imagePreviews.map((image, index) => {
                  return (
                    <div className="mt-2" key={index}>
                      <img
                        src={image}
                        alt={`Category Preview ${index}`}
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  );
                })} */}

                {imagePreviews && imagePreviews.length > 0 ? (
                  <div className="image-preview-container mt-2">
                    {imagePreviews.map((image, index) => {
                      return (
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="image-preview ms-2"
                        />
                      );
                    })}
                  </div>
                ) : (
                  Array.isArray(imageFiles) &&
                  imageFiles.length > 0 && (
                    <div className="image-preview-container mt-2">
                      {/* Displaying image URLs from the API response */}
                      {imageFiles.map((imageObj, index) => {
                        // Ensure the object has an 'image' URL property
                        if (imageObj && imageObj.image) {
                          return (
                            <img
                              src={IMG_URL + imageObj.image} // Use image URL from API response
                              alt={`Preview ${index + 1}`}
                              className="image-preview ms-2"
                            />
                          );
                        }
                        return null; // Skip rendering if the image URL is not present
                      })}
                    </div>
                  )
                )}
              </Row>
            </div>
          </div>

          {/* warning text-end */}
          <div className="d-flex justify-content-center">
            <div className="text-center mt-4 mx-2">
              <button
                className="Back-button"
                type="submit"
                onClick={() => navigate("/products")}
              >
                {" "}
                Cancel
              </button>
            </div>

            <div className="text-center mt-4 mx-2">
              <button
                className="schedule-button"
                // type="submit"
                onClick={onSubmit}
              >
                Update Product
              </button>
            </div>
          </div>
        </Form>
        <ModalSave
          message={showModal.message}
          showErrorModal={showModal.code ? true : false}
        />
      </section>
    </>
  );
}

export default Edit;
