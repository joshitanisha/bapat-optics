import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import "./Create.css";
import Select from "react-select";
import Header from "../../../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalSave from "../../../common/ModelSave";
import { useNavigate } from "react-router";

function Create() {
  const { id } = useParams();
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
  } = useForm({
    defaultValues: {
      variants: [{ name: "", price: "", mrp: "", image: "", description: "" }], // Default empty field
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  // const { fields1, append1, remove1 } = useFieldArray({ control, name: "variants", });

  const [variantsError, setVariantsError] = useState("");

  useEffect(() => {
    register("variants", {
      validate: (value) => {
        const isValid = value && value.length > 0;
        setVariantsError(isValid ? "" : "At least one variant is required");
        return isValid;
      },
    });
  }, [register]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const onSubmit = async (data) => {
    console.log("getData", getValues());

    try {
      const DataToSend = new FormData();
      DataToSend.append("name", data?.name);
      DataToSend.append("price", data?.price);
      DataToSend.append("mrp", data?.mrp);
      // DataToSend.append("manufacturer", data?.manufacturer);
      DataToSend.append("description", data?.description);
      DataToSend.append("tax_percentage", data?.tax_percentage);
      DataToSend.append("p_category_id", data?.p_category_id?.value);
      // DataToSend.append("p_sub_category_id", data?.p_sub_category_id?.value);
      // DataToSend.append("unit_id", data?.unit_id?.value);
      // DataToSend.append("brand_id", data?.brand_id?.value);
      DataToSend.append("image", data.image[0]);

      if (Array.isArray(data?.add_on_category_id)) {
        data.add_on_category_id.forEach((category) => {
          DataToSend.append(`add_on_category_id`, category?.value);
        });
      }

      // Append the images (multiple files)
      if (data?.images && data?.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          DataToSend.append("images", data.images[i]);
        }
      }

      if (Array.isArray(data?.add_on_id)) {
        const addOns = data.add_on_id.map((subCategory) => {
          return subCategory;
        });
        DataToSend.append("add_on_id", JSON.stringify(addOns));
      }

      console.log("variants", data);

      const variants = [];
      data.variants.forEach((variant, index) => {
        console.log("variant :--", { index }, ":-", variant);

        variants.push({
          name: variant.name,
          price: variant.price,
          mrp: variant.mrp,
          // image: variant.image,
          description: variant.description,
        });
      });

      DataToSend.append("variants", JSON.stringify(variants));

      const response = await postData("/admin/products", DataToSend);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
        setTimeout(() => {
          reset();
          setShowModal(0);
          navigate("/foods/:id");
        }, 1000);
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
        setTimeout(() => {
          setShowModal(0);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [addOnTypeList, setAddOnTypeList] = useState([]);
  const [addOnList, setAddOnList] = useState([]);

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
    const response = await getData("/common/masters/all-vendor-p-categories");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };
  const getAllSubCategories = async (id) => {
    const response = await getData(
      `/common/masters/all-vendor-p-sub-categories/${id}`,
    );
    if (response?.success) {
      setSubCategories(await Select2Data(response?.data, "p_sub_category_id"));
    }
  };

  const getAddOnCategories = async () => {
    const response = await getData(
      "/common/masters/all-food-add-on-categories",
    );
    setAddOnTypeList(await Select2Data(response?.data, "add_on_category_id"));
  };

  const Select3Data = async (data, name) => {
    const result = data.map((data) => ({
      value: data?.id,
      label: data?.name,
      name: name,
      add_on_category_id: data?.add_on_category_id,
    }));
    return result;
  };

  const getAllAddOnList = async (selectedCategories) => {
    let categoryValues = [];
    if (Array.isArray(selectedCategories)) {
      categoryValues = selectedCategories.map((category) => category?.value);
    }

    const response = await postData("/common/masters/all-food-add-ons", {
      add_on_category_id: categoryValues,
    });

    if (response?.success) {
      setAddOnList(await Select3Data(response?.data, "add_on_id"));
    }
  };

  useEffect(() => {
    getAllBrands();
    getAllUnits();
    getAllCategories();
    getAddOnCategories();
  }, []);

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

  const [imagePreview1, setImagePreview1] = useState({});
  const handleImageChange1 = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      console.log("File selected:", file); // Log the file to check if it's being captured

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);

      // Store the preview URL for the specific variant
      setImagePreview1((prevPreviews) => ({
        ...prevPreviews,
        [index]: previewUrl,
      }));

      // Set the file to the form field for that variant
      setValue(`variants[${index}].image`, file); // Make sure this sets the correct file object
    }
  };

  return (
    <>
      <Header title={"Create Food"} link={"/employee/employee_details"} />
      <section className="Create">
        {/* back button start */}
        <div className="back_btn_holder">
          <FontAwesomeIcon
            className="back-btn"
            icon={faAngleLeft}
            onClick={() => navigate("/foods/:id")}
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
                    <Form.Label>Category</Form.Label>
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
                            setValue("p_sub_category_id", "");
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

                  {/* <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <Form.Label>Sub Category</Form.Label>
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
                  </div> */}

                  {/* <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <Form.Label>Brand</Form.Label>
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
                  </div> */}
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
              {/* Package Weight */}
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Name</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="">
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
                    <span className="text-danger">{errors.name.message}</span>
                  )}
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Thumbnail</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="">
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
                  </div>
                  {errors.image && (
                    <span className="text-danger">{errors.image.message}</span>
                  )}
                </Col>
                <Col lg={4} md={4}>
                  {imagePreview && (
                    <div className="Preview_img_holder">
                      <img
                        className="Preview_img"
                        src={imagePreview}
                        alt="Category Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  )}
                </Col>
              </Row>

              {/* <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Unit</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className=" ">
                    <Controller
                      className="select-contoller "
                      name={`unit_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Unit",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
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
              </Row> */}

              {/* <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Price</div>
                </Col>
                <Col lg={4} md={4}>
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
                        )  {
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
                    <span className="text-danger">{errors.price.message}</span>
                  )}
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">MRP</div>
                </Col>
                <Col lg={4} md={4}>
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
                        )  {
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
                    <span className="text-danger">{errors.mrp.message}</span>
                  )}
                </Col>
              </Row> */}
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
              {/* <Row className="detail-row">
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
              </Row> */}
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
                <div className="img-row-holder">
                  {imagePreviews &&
                    imagePreviews.map((image, index) => {
                      return (
                        <div className="mt-2 mx-3" key={index}>
                          <img
                            src={image}
                            alt={`Category Preview ${index}`}
                            style={{ maxWidth: "100px" }}
                          />
                        </div>
                      );
                    })}
                </div>
              </Row>
            </div>
          </div>

          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>4. Allow Add On</h6>
            </div>

            <div className="package-details-section">
              <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                <Form.Label>Add On Categories</Form.Label>
                <Controller
                  className="select-contoller"
                  name={`add_on_category_id`} // name of the field
                  control={control}
                  rules={
                    {
                      // required: "Select add on Categories",
                    }
                  }
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      isMulti
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors?.add_on_category_id
                            ? "red"
                            : baseStyles.borderColor,
                        }),
                      }}
                      // {...field}
                      options={addOnTypeList}
                      onChange={(selectedValue) => {
                        onChange(selectedValue);
                        setValue("add_on_id", "");
                        getAllAddOnList(selectedValue);
                      }}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                    />
                  )}
                />
                {errors.add_on_category_id && (
                  <span className="text-danger">
                    {errors.add_on_category_id.message}
                  </span>
                )}
              </div>

              <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                <Form.Label>Add On</Form.Label>
                <Controller
                  className="select-contoller"
                  name={`add_on_id`} // name of the field
                  control={control}
                  rules={
                    {
                      // required: "Select Product Categories",
                    }
                  }
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      isMulti
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors?.add_on_id
                            ? "red"
                            : baseStyles.borderColor,
                        }),
                      }}
                      // {...field}
                      options={addOnList}
                      onChange={(selectedValue) => {
                        onChange(selectedValue);
                        // getAllSubCategories(selectedValue);
                      }}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                    />
                  )}
                />
                {errors.add_on_id && (
                  <span className="text-danger">
                    {errors.add_on_id.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>5. Variants</h6>
            </div>

            <div className="package-details-section">
              {fields.map((variant, index) => (
                <div key={variant.id} className="main-form-section mt-3">
                  <Row>
                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Variant Name</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name={`variants.${index}.name`} // Register color for the variant
                              placeholder="Variant Name"
                              className={classNames("", {
                                "is-invalid": errors?.variants?.[index]?.name,
                              })}
                              {...register(`variants.${index}.name`, {
                                required: "Variant name is required",
                              })}
                            />
                            {errors?.variants?.[index]?.name && (
                              <span className="text-danger">
                                {errors.variants[index].name.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Variant MRP</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name={`variants.${index}.mrp`} // Register color for the variant
                              placeholder="Variant MRP"
                              className={classNames("", {
                                "is-invalid": errors?.variants?.[index]?.mrp,
                              })}
                              {...register(`variants.${index}.mrp`, {
                                required: "Variant MRP is required",
                              })}
                              onKeyDown={(e) => {
                                // Allow backspace, left and right arrow keys
                                if (
                                  e.key === "Backspace" ||
                                  e.key === "ArrowLeft" ||
                                  e.key === "ArrowRight" ||
                                  e.key === "Tab"
                                ) {
                                  return; // Allow the action to continue
                                }

                                // Allow digits and decimal point
                                if (!/[\d.]/.test(e.key)) {
                                  e.preventDefault(); // Block the invalid key
                                }

                                // Prevent multiple decimal points
                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                ) {
                                  e.preventDefault(); // Block adding another decimal point
                                }
                              }}
                            />
                            {errors?.variants?.[index]?.mrp && (
                              <span className="text-danger">
                                {errors.variants[index].mrp.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Variant Price</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name={`variants.${index}.price`} // Register color for the variant
                              placeholder="Variant Price"
                              className={classNames("", {
                                "is-invalid": errors?.variants?.[index]?.price,
                              })}
                              {...register(`variants.${index}.price`, {
                                required: "Variant name is required",
                                validate: {
                                  lessThanPrice: (value) => {
                                    const mrp = getValues(
                                      `variants.${index}.mrp`,
                                    );
                                    if (parseFloat(value) >= parseFloat(mrp)) {
                                      return "Price must be less than MRP";
                                    }
                                    return true;
                                  },
                                },
                              })}
                              onKeyDown={(e) => {
                                // Allow backspace, left and right arrow keys
                                if (
                                  e.key === "Backspace" ||
                                  e.key === "ArrowLeft" ||
                                  e.key === "ArrowRight" ||
                                  e.key === "Tab"
                                ) {
                                  return; // Allow the action to continue
                                }

                                // Allow digits and decimal point
                                if (!/[\d.]/.test(e.key)) {
                                  e.preventDefault(); // Block the invalid key
                                }

                                // Prevent multiple decimal points
                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                ) {
                                  e.preventDefault(); // Block adding another decimal point
                                }
                              }}
                            />
                            {errors?.variants?.[index]?.price && (
                              <span className="text-danger">
                                {errors.variants[index].price.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    {/* <Col md={3}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Variant Image</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="file"
                              name={`variants[${index}].image`}
                              onChange={(e) => handleImageChange1(e, index)}
                            />
                            {errors?.variants?.[index]?.image && (
                              <span className="text-danger">
                                {errors.variants[index].image.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col> */}

                    {/* <Col md={12}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label> Description</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              as={"textArea"}
                              name={`variants.${index}.description`} // Register color for the variant
                              placeholder="Variant description"
                              className={classNames("", {
                                "is-invalid":
                                  errors?.variants?.[index]?.description,
                              })}
                              {...register(`variants.${index}.description`, {
                                required: "Variant name is required",
                              })}
                            />
                            {errors?.variants?.[index]?.description && (
                              <span className="text-danger">
                                {errors.variants[index].description.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col> */}
                    {/* <Col md={3}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label> Image Priview</Form.Label>
                          {imagePreview1[index] && (
                            <div className="image-preview">
                              <img src={imagePreview1[index]} alt={`Variant ${index} Preview`} width="100" />
                            </div>
                          )}
                        </Row>
                      </div>
                    </Col> */}
                  </Row>
                  {fields.length > 1 && (
                    <button
                      className="mt-3 add-varient"
                      type="button"
                      onClick={() => remove(index)} // Remove the variant
                    >
                      Remove Variant
                    </button>
                  )}
                  <hr />
                </div>
              ))}
            </div>
            <hr />
            <div className="text-center">
              <button
                type="button"
                className="add-varient"
                onClick={() => append({})}
              >
                + Add Variant
              </button>
            </div>
          </div>

          {/* warning text-end */}
          <div className="d-flex justify-content-center">
            <div className="text-center mt-4 mx-2">
              <button
                className="Back-button"
                type="submit"
                onClick={() => navigate("/foods/:id")}
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
                Create Product
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

export default Create;
