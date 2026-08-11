import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import "./LensEdit.css";
import Select from "react-select";
import Header from "../../../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalSave from "../../../common/ModelSave";
import { useNavigate } from "react-router";
import { putData } from "../../../../utils/api";
import AddOffCanvance from "../../Colour/Add";

function LensEdit() {
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
    Select2DataColor,
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

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("name", data?.name);

      DataToSend.append("manufacturer", data?.manufacturer);
      DataToSend.append("description", data?.description);
      DataToSend.append("tax_percentage", data?.tax_percentage);

      DataToSend.append("brand_id", data?.brand_id?.value);
      // DataToSend.append("item_code", data?.item_code);
      // DataToSend.append("lic_no", data?.lic_no);
      // DataToSend.append("tag", data?.tag);
      // DataToSend.append("measurements", data?.measurements);

      DataToSend.append("sort_order", data?.sort_order);

      if (data?.image && data?.image[0]) {
        DataToSend.append("image", data.image[0]);
      }

      DataToSend.append("material_id", data?.material_id?.value);

      DataToSend.append("lens_category_id", data?.lens_category_id?.value);
      DataToSend.append("lens_type_id", data?.lens_type_id?.value);

      DataToSend.append("bo_code", data?.bo_code);
      DataToSend.append("resultant_power", data?.resultant_power);
      DataToSend.append("cyl", data?.cyl);
      DataToSend.append("coating_name", data?.coating_name);
      DataToSend.append("index", data?.index);

      const variants = [];
      data.variants.forEach((variant, index) => {
        variants.push({
          id: variant?.id,
          name: variant.name,
          price: variant.price,
          mrp: variant.mrp,
          size: variant.size,
          color_id: variant.color_id.value,
          // image: variant.image,
          // description: variant.description,
        });
        let inputImages = document.getElementById(`variantImages${index}`);

        const files = inputImages?.files;
        if (files) {
          for (let i = 0; i < files?.length; i++) {
            DataToSend.append(`images${index}`, files[i]);
          }
        }
      });

      DataToSend.append("variants", JSON.stringify(variants));

      const response = await putData(`/admin/lens/${id}`, DataToSend);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.data });
        reset();
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
        setTimeout(() => {
          setShowModal(0);
        }, 1000);
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/products");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [Countries, setCountries] = useState([]);

  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const [Color, setColor] = useState([]);
  const [Shape, setShape] = useState([]);
  const [Material, setMaterial] = useState([]);
  const [Gender, setGender] = useState([]);
  const [FaceWidth, setFaceWidth] = useState([]);
  const [FrameType, setFrameType] = useState([]);
  const watchedUnit = watch("unit_id");

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
  const getAllLensCategories = async () => {
    const response = await getData("/common/masters/all-lens-category");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "lens_category_id"));
    }
  };

  const getAllLensTypes = async () => {
    const response = await getData("/common/masters/all-lens-type");
    if (response?.success) {
      setTypes(await Select2Data(response?.data, "lens_type_id"));
    }
  };
  const getAllSubCategories = async (id) => {
    const response = await getData(`/common/masters/all-p-sub-category/${id}`);
    if (response?.success) {
      setSubCategories(await Select2Data(response?.data, "p_sub_category_id"));
    }
  };
  const getAllChildCategories = async (id) => {
    const response = await getData(
      `/common/masters/all-p-child-category/${id}`
    );
    if (response?.success) {
      setChildCategories(
        await Select2Data(response?.data, "p_child_category_id")
      );
    }
  };
  const getAllCountries = async () => {
    const response = await getData(`/common/masters/all-country`);
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "made_in_id"));
    }
  };

  const getAllShape = async () => {
    const response = await getData(`/common/masters/all-shape`);
    if (response?.success) {
      setShape(await Select2Data(response?.data, "shape_id"));
    }
  };
  const getAllColor = async () => {
    const response = await getData(`/common/masters/all-color`);
    if (response?.success) {
      setColor(await Select2DataColor(response?.data, "color_id"));
    }
  };
  const getAllGender = async () => {
    const response = await getData(`/common/masters/all-gender`);
    if (response?.success) {
      setGender(await Select2Data(response?.data, "gender_id"));
    }
  };
  const getAllFrameType = async () => {
    const response = await getData(`/common/masters/all-frame-type`);
    if (response?.success) {
      setFrameType(await Select2Data(response?.data, "frame_type_id"));
    }
  };
  const getAllFaceWidth = async () => {
    const response = await getData(`/common/masters/all-face-width`);
    if (response?.success) {
      setFaceWidth(await Select2Data(response?.data, "face_width_id"));
    }
  };
  const getAllMaterial = async () => {
    const response = await getData(`/common/masters/all-material`);
    if (response?.success) {
      setMaterial(await Select2Data(response?.data, "face_width_id"));
    }
  };
  useEffect(() => {
    getAllGender();
    getAllFrameType();
    getAllFaceWidth();
    getAllMaterial();
    getAllCountries();
    getAllBrands();
    getAllUnits();
    getAllLensCategories();
    getAllLensTypes();

    getAllColor();
    getAllShape();
  }, []);

  const [show, setShowAdd] = useState(false);

  const handleClose = async () => {
    await getAllColor();
    await setShowAdd(false);
  };
  const handleShow = () => setShowAdd(true);

  const GetEditData = async () => {
    const response = await getData(`/admin/lens/${id}`);
    reset(response?.data);
    if (response?.data?.variants?.length) {
      const previews = {};

      response?.data.variants.forEach((variant, index) => {
        if (variant.variant_images?.length) {
          previews[index] = variant.variant_images.map((img) => ({
            id: img.id,
            url: IMG_URL + img.image,
          }));
        }
      });

      setImagePreviews(previews);
    }
  };

  useEffect(() => {
    GetEditData();
  }, [id]);

  const [imagePreview, setImagePreview] = useState(null);

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

  const handleVarientImagesChange = (e, index) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => ({
      id: null,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), ...urls],
    }));
  };

  const handleRemoveImage = async (variantIndex, imageIndex) => {
    const imageList = imagePreviews[variantIndex] || [];
    const targetImage = imageList[imageIndex];

    // Optional confirm
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    // If it's a server image (has an id), delete from server
    if (targetImage?.id) {
      try {
        await deleteData(`/admin/products/product-image/${targetImage.id}`);
        console.log("Image deleted from server:", targetImage.id);
      } catch (err) {
        console.error("Failed to delete image:", err);
        alert("Failed to delete image from server.");
        return;
      }
    }

    // Remove from preview state
    setImagePreviews((prev) => {
      const updatedImages = [...(prev[variantIndex] || [])];
      updatedImages.splice(imageIndex, 1);
      return {
        ...prev,
        [variantIndex]: updatedImages,
      };
    });
  };

  return (
    <>
      <Header title={"Edit Product"} link={"/employee/employee_details"} />
      <section className="Create">
        {/* back button start */}
        <div className="back_btn_holder">
          <div onClick={() => navigate(`/products`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
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
                      name={`lens_category_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Category",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.lens_category_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={categories}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                            getAllSubCategories(selectedValue?.value);
                            setValue("p_sub_category_id", "");
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.lens_category_id && (
                      <span className="text-danger">
                        {errors.lens_category_id.message}
                      </span>
                    )}
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <Form.Label>Type</Form.Label>
                    <Controller
                      className="select-contoller"
                      name={`lens_type_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Type",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.lens_type_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={types}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.lens_type_id && (
                      <span className="text-danger">
                        {errors.lens_type_id.message}
                      </span>
                    )}
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
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
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <Form.Label>Material</Form.Label>
                    <Controller
                      className="select-contoller"
                      name={`material_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Material",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.material_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={Material}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.material_id && (
                      <span className="text-danger">
                        {errors.material_id.message}
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
                            validate: (value) =>
                              value.length <= 200 ||
                              "Data must be 200 characters or less",
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
                          accept="image/*, video/*"
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
                </Col>

                <Col lg={4} md={4} className="ms-5">
                  {typeof getValues("image") === "string" ? (
                    // If image is a string (URL), show the preview
                    <div className="image-preview-container ms-5">
                      {getValues("image").endsWith(".mp4") ||
                      getValues("image").endsWith(".mov") ||
                      getValues("image").endsWith(".avi") ? (
                        // If the file is a video, show a video element
                        <video
                          src={IMG_URL + getValues("image")}
                          alt="Preview"
                          className="preview-video"
                          // controls
                          autoPlay
                          muted
                          loop
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        // If it's an image, show the image preview
                        <img
                          src={IMG_URL + getValues("image")}
                          alt="Preview"
                          className="image-preview"
                          width={50}
                        />
                      )}
                    </div>
                  ) : (
                    // If the image is not a string (i.e., it's a file or URL in preview), show that
                    imagePreview && (
                      <div className="image-preview-container ms-5">
                        {imagePreview.includes("video") ? (
                          // If the preview is a video, show a video element
                          <video
                            src={imagePreview}
                            alt="Preview"
                            className="preview-video"
                            // controls
                            autoPlay
                            muted
                            loop
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          // Otherwise, show an image
                          <img
                            src={imagePreview}
                            alt="Category Preview"
                            width={150}
                          />
                        )}
                      </div>
                    )
                  )}
                </Col>
              </Row>
            </div>
          </div>

          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>3. Details</h6>
            </div>
            <div className="package-details-section">
              <Row className="detail-row">
                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Tax Percentage</Form.Label>
                      <Form.Group>
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
                            ) {
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
                        {errors.tax_percentage && (
                          <span className="text-danger">
                            {errors.tax_percentage.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Manufacturer</Form.Label>
                      <Form.Group>
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
                        {errors.manufacturer && (
                          <span className="text-danger">
                            {errors.manufacturer.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>BO Code</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name={`bo_code`}
                          placeholder="BO Code"
                          className={classNames("", {
                            "is-invalid": errors?.bo_code, // Adjusted error checking
                          })}
                          {...register(`bo_code`, {
                            required: "bo_code is required",
                          })}
                        />
                        {errors.bo_code && (
                          <span className="text-danger">
                            {errors.bo_code.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Resultant Power</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name={`resultant_power`}
                          placeholder="Resultant Power"
                          className={classNames("", {
                            "is-invalid": errors?.resultant_power, // Adjusted error checking
                          })}
                          {...register(`resultant_power`, {
                            required: "resultant_power is required",
                          })}
                        />
                        {errors.resultant_power && (
                          <span className="text-danger">
                            {errors.resultant_power.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>CYL</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name={`cyl`}
                          placeholder="CYL"
                          className={classNames("", {
                            "is-invalid": errors?.cyl, // Adjusted error checking
                          })}
                          {...register(`cyl`, {
                            required: "cyl is required",
                          })}
                        />
                        {errors.cyl && (
                          <span className="text-danger">
                            {errors.cyl.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Coating Name</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name={`coating_name`}
                          placeholder="Coating Name"
                          className={classNames("", {
                            "is-invalid": errors?.coating_name, // Adjusted error checking
                          })}
                          {...register(`coating_name`, {
                            required: "coating_name is required",
                          })}
                        />
                        {errors.coating_name && (
                          <span className="text-danger">
                            {errors.coating_name.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Index</Form.Label>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name={`index`}
                          placeholder="Index"
                          className={classNames("", {
                            "is-invalid": errors?.index, // Adjusted error checking
                          })}
                          {...register(`index`, {
                            required: "index is required",
                          })}
                        />
                        {errors.index && (
                          <span className="text-danger">
                            {errors.index.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={12}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Description</Form.Label>
                      <Form.Group>
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
                        {errors.description && (
                          <span className="text-danger">
                            {errors.description.message}
                          </span>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          {/* 3. Pickup Slot Details end */}

          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>5. Upgraded</h6>
            </div>

            <div className="package-details-section">
              {fields?.map((variant, index) => (
                <div key={variant.id} className="main-form-section mt-3">
                  <Row>
                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Upgraded Name</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name={`variants.${index}.name`} // Register color for the variant
                              placeholder="Upgraded Name"
                              className={classNames("", {
                                "is-invalid": errors?.variants?.[index]?.name,
                              })}
                              {...register(`variants.${index}.name`, {
                                required: "Upgraded Name is required",
                              })}
                              // onKeyDown={(e) => {
                              //   // Allow backspace, left and right arrow keys
                              //   if (
                              //     e.key === "Backspace" ||
                              //     e.key === "ArrowLeft" ||
                              //     e.key === "ArrowRight"
                              //   ) {
                              //     return; // Allow the action to continue
                              //   }

                              //   // Allow digits and decimal point
                              //   if (!/[\d.]/.test(e.key)) {
                              //     e.preventDefault(); // Block the invalid key
                              //   }

                              //   // Prevent multiple decimal points
                              //   if (
                              //     e.key === "." &&
                              //     e.target.value.includes(".")
                              //   ) {
                              //     e.preventDefault(); // Block adding another decimal point
                              //   }
                              // }}
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
                      <div className="main-form-section mt-3 d-flex">
                        <Row className="justify-content-center row me-0 ms-0lwidth">
                          <Form.Label>Color</Form.Label>
                          <Controller
                            name={`variants.${index}.color_id`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={Color}
                                styles={{
                                  control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderColor: errors?.variants?.[index]
                                      ?.color_id
                                      ? "red"
                                      : baseStyles.borderColor,
                                  }),
                                }}
                                formatOptionLabel={(option) => (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: option.code, // hex color
                                        border: "1px solid #ccc",
                                        display: "inline-block",
                                      }}
                                    />
                                    <span>{option.label}</span>
                                  </div>
                                )}
                              />
                            )}
                            rules={{ required: "Select Color" }}
                          />
                          {errors?.variants?.[index]?.color_id && (
                            <span className="text-danger">
                              {errors.variants[index].color_id.message}
                            </span>
                          )}
                        </Row>

                        <button
                          type="button"
                          className="btn btn-success addcolbtn"
                          onClick={() => handleShow()}
                        >
                          <FontAwesomeIcon icon={faAdd} />
                        </button>
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
                                      `variants.${index}.mrp`
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

                   

                    <Col md={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>Images</Form.Label>
                          <Form.Group>
                            <Form.Control
                              className={classNames("", {
                                "is-invalid": errors?.variants?.[index]?.image,
                              })}
                              type="file"
                              multiple
                              {...register(`variants.${index}.image`, {
                                // required: "Images are required",
                              })}
                              accept="image/*"
                              id={`variantImages${index}`}
                              onChange={(e) =>
                                handleVarientImagesChange(e, index)
                              }
                            />
                            {errors?.variants?.[index]?.image && (
                              <div className="text-danger">
                                {errors.variants[index].image.message}
                              </div>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                    {Array.isArray(imagePreviews[index]) && (
                      <div className="d-flex  flex-wrap gap-2 mt-2">
                        {imagePreviews[index].map((imgObj, i) => (
                          <div
                            key={i}
                            className="varimggdiv position-relative"
                            onClick={() => handleRemoveImage(index, i)}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={imgObj.url} //  correct way
                              alt={`Preview ${i}`}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <FontAwesomeIcon
                              className="dlticon position-absolute top-0 end-0 m-1 text-danger"
                              icon="xmark"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Row>
                  
                  <hr />
                </div>
              ))}
            </div>
            <hr />
            
          </div>

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

      <AddOffCanvance
        handleClose={handleClose}
        setShow={setShowAdd}
        show={show}
      />
    </>
  );
}

export default LensEdit;
