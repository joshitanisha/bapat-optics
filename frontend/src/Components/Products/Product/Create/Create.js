import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import "./Create.css";
import Select from "react-select";
import Header from "../../../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faAngleLeft,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalSave from "../../../common/ModelSave";
import { useNavigate } from "react-router";
import { Colors } from "chart.js";
import AddOffCanvance from "../../Colour/Add";
import { Category } from "../../../../utils/common";
import { useLoader } from "../../../../utils/common";
import AddOffCanvanceBrand from "../../../Masters/Brands/Add";
import AddOffCanvanceMaterial from "../../Material/Add";
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
  } = useForm({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: addonFields,
    append: addAddon,
    remove: removeAddon,
  } = useFieldArray({
    control,
    name: "lense_addons",
  });

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [loader, setLoder] = useState(false);
  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();

      DataToSend.append("p_category_id", data?.p_category_id?.value);

      if (data?.p_category_id?.value === Category?.Lenses) {
        DataToSend.append("lens_color_id", data?.lens_color_id?.value || "");
        DataToSend.append(
          "lens_category_id",
          data?.lens_category_id?.value || "",
        );
        DataToSend.append("lens_type_id", data?.lens_type_id?.value || "");
      }

      if (data?.p_category_id?.value === Category?.Eyeglasses) {
      }

      if (data?.p_category_id?.value === Category?.Sunglasses) {
        DataToSend.append("lens_color_id", data?.lens_color_id?.value || "");
      }

      if (data?.p_category_id?.value === Category?.Accessories) {
      }

      if (data?.p_category_id?.value === Category?.ContactLens) {
      }

      DataToSend.append("name", data?.name);

      if (data?.product_name) {
        DataToSend.append("manufacturer", data?.product_name);
      }

      DataToSend.append("brand_id", data?.brand_id?.value || "");
      DataToSend.append("material_id", data?.material_id?.value || "");
      DataToSend.append("frame_type_id", data?.frame_type_id?.value || "");
      DataToSend.append("gender_id", data?.gender_id?.value || "");
      DataToSend.append("shape_id", data?.shape_id?.value || "");
      DataToSend.append("color_id", data?.color_id?.value || "");
      DataToSend.append("coating_id", data?.coating_id?.value || "");
      DataToSend.append("face_width_id", data?.face_width_id?.value || "");
      DataToSend.append("water_content", data?.water_content || "");
      DataToSend.append("diameter", data?.diameter || "");
      DataToSend.append("base_curve", data?.base_curve || "");
      DataToSend.append("dk_t", data?.dk_t || "");
      DataToSend.append("index", data?.index || "");
      DataToSend.append("size", data?.size || "");

      DataToSend.append("total_measurements", data?.total_measurements || "");
      DataToSend.append("coating_name", data?.coating_name || "");

      DataToSend.append("bo_code", data?.bo_code || "");
      DataToSend.append("modality", data?.modality || "");
      DataToSend.append("made_in_id", data?.made_in_id?.value || "");
      DataToSend.append("unit_id", data?.unit_id?.value);
      DataToSend.append("stock_type_id", data?.stock_type_id?.value || "");
      DataToSend.append(
        "delivery_type_id",
        data?.delivery_type_id?.value || "",
      );
      DataToSend.append("mrp", data?.mrp || "");
      DataToSend.append("discount", data?.discount || "");
      DataToSend.append("discount_amount", data?.discount_amount || "");
      DataToSend.append("price", data?.price || "");
      DataToSend.append("tax_percentage", data?.tax_percentage || "");
      DataToSend.append("tax_amount", data?.tax_amount || "");
      DataToSend.append("base_amount", data?.base_amount || "");
      DataToSend.append("description", data?.description || "");
      DataToSend.append("is_active", data?.is_active ? 1 : 0);
      if (data?.thumbnail && data?.thumbnail?.[0]) {
        DataToSend.append("thumbnail", data?.thumbnail?.[0]);
      }
      DataToSend.append("supplier_id", data?.supplier_id?.value);
      DataToSend.append("order_no", data?.order_no || "");
      DataToSend.append("invoice_no", data?.invoice_no || "");
      DataToSend.append("model_no", data?.model_no || "");
      DataToSend.append("quantity", data?.quantity);
      DataToSend.append("customer_view", data?.customer_view);
      if (data?.customer_name) {
        DataToSend.append("customer_name", data?.customer_name);
      }

      if (data?.lense_addons?.length > 0) {
        DataToSend.append("lense_addons", JSON.stringify(data.lense_addons));
      }
      DataToSend.append("hsn_code", data?.hsn_code);

      const inputImages = document.getElementById(`variantImages`);
      if (inputImages && inputImages.files) {
        const files = inputImages.files;
        for (let i = 0; i < files.length; i++) {
          DataToSend.append(`image`, files[i]);
        }
      }

      const response = await withLoader(() =>
        postData("/admin/products", DataToSend),
      );

      if (response?.success) {
        setShowModal({
          code: response.code,
          message: response.message,
        });
      } else {
        const err =
          typeof response?.errors === "string"
            ? response.errors
            : response?.errors?.message ||
              response?.message ||
              "Something went wrong";

        setShowModal({
          code: response?.code || 500,
          message: err,
        });
      }

      setTimeout(() => {
        reset();
        setShowModal(0);
        navigate("/products");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [Countries, setCountries] = useState([]);
  const [stockTypes, setStockTypes] = useState([]);
  const [Color, setColor] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [Shape, setShape] = useState([]);
  const [Material, setMaterial] = useState([]);
  const [Gender, setGender] = useState([]);
  const [FaceWidth, setFaceWidth] = useState([]);
  const [FrameType, setFrameType] = useState([]);
  const [DeliveryType, setDeliveryType] = useState([]);
  const [lensCategories, setLensCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [coating, setCoating] = useState([]);

  const [category, setCategory] = React.useState();
  const watchedUnit = watch("unit_id");

  const getAllBrands = async (category) => {
    const response = await getData(
      `/common/masters/all-brands?category_id=${category}`,
    );
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
    const response = await getData("/common/masters/all-p-category?admin=true");
    if (response?.success) {
      setCategories(await Select2Data(response.data, "p_category_id"));
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

  const getAllChildCategories = async (id) => {
    const response = await getData(
      `/common/masters/all-p-child-category/${id}`,
    );
    if (response?.success) {
      setChildCategories(
        await Select2Data(response?.data, "p_child_category_id"),
      );
    }
  };
  const getAllCountries = async () => {
    const response = await getData(`/common/masters/all-country`);
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "made_in_id"));
    }
  };
  const getAllStockTypes = async () => {
    const response = await getData(`/common/masters/all-stock-types`);
    if (response?.success) {
      setStockTypes(await Select2Data(response?.data, "stock_type_id"));
    }
  };

  const getAllDeliveryType = async () => {
    const response = await getData(`/common/masters/all-delivery-type`);
    if (response?.success) {
      setDeliveryType(await Select2Data(response?.data, "farmer_id"));
    }
  };

  const getAllShape = async () => {
    const response = await getData(`/common/masters/all-shape`);
    if (response?.success) {
      setShape(await Select2Data(response?.data, "shape_id"));
    }
  };
  const getAllColor = async (category) => {
    const response = await getData(
      `/common/masters/all-color?category_id=${category}`,
    );
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
  const getAllMaterial = async (category) => {
    const response = await getData(
      `/common/masters/all-material?category_id=${category}`,
    );
    if (response?.success) {
      setMaterial(await Select2Data(response?.data, "material_id"));
    }
  };

  const getAllLensCategories = async () => {
    const response = await getData("/common/masters/all-lens-category");
    if (response?.success) {
      setLensCategories(await Select2Data(response?.data, "lens_category_id"));
    }
  };

  const getAllLensTypes = async () => {
    const response = await getData("/common/masters/all-lens-type");
    if (response?.success) {
      setTypes(await Select2Data(response?.data, "lens_type_id"));
    }
  };

  const getAllCoating = async () => {
    const response = await getData("/common/masters/all-coating");
    if (response?.success) {
      setCoating(await Select2Data(response?.data, "coating_id"));
    }
  };
  useEffect(() => {
    getAllGender();
    getAllFrameType();
    getAllFaceWidth();
    getAllCoating();
    getAllCountries();

    getAllUnits();
    getAllCategories();
    getAllLensCategories();
    getAllLensTypes();
    getAllStockTypes();
    // getAllColor();
    getAllShape();
    getAllDeliveryType();
  }, []);

  useEffect(() => {
    getAllBrands(category);
    getAllMaterial(category);
    getAllColor(category);
  }, [category]);

  const [show, setShowAdd] = useState(false);

  const handleClose = async () => {
    await getAllColor(category);
    await setShowAdd(false);
  };
  const handleShow = () => setShowAdd(true);

  const [showBrand, setShowBrand] = useState(false);

  const handleCloseBrand = async () => {
    await getAllBrands(category);
    await setShowBrand(false);
  };
  const handleShowBrand = () => setShowBrand(true);

  const [showMaterial, setShowMaterial] = useState(false);

  const handleCloseMaterial = async () => {
    await getAllMaterial(category);
    await setShowMaterial(false);
  };
  const handleShowMaterial = () => setShowMaterial(true);

  const [imagePreview, setImagePreview] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
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

  const handleVarientImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => ({
      ...prev,
      urls,
    }));
  };

  const mrp = watch("mrp");
  const discount = watch("discount");
  const tax_percentage = watch("tax_percentage");

  useEffect(() => {
    const parsedMrp = parseFloat(mrp) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
    const parsedTax = parseFloat(tax_percentage) || 0;

    if (parsedMrp > 0) {
      const discountAmount = (parsedMrp * parsedDiscount) / 100;
      const sellingPrice = parsedMrp - discountAmount;

      setValue("discount_amount", discountAmount.toFixed(2));
      setValue("price", sellingPrice.toFixed(2));

      if (parsedTax > 0) {
        const taxAmount = (sellingPrice * parsedTax) / 100;
        const baseAmount = sellingPrice - taxAmount;
        setValue("tax_amount", taxAmount.toFixed(2));
        setValue("base_amount", baseAmount.toFixed(2));
      } else {
        setValue("tax_amount", "");
        setValue("base_amount", "");
      }
    } else {
      setValue("price", "");
      setValue("discount_amount", "");
      setValue("tax_amount", "");
      setValue("base_amount", "");
    }
  }, [mrp, discount, tax_percentage, setValue]);

  const [supplier, setSupplier] = useState([]);
  const GetAllSupplier = async () => {
    const response = await getData("/common/masters/all-supplier");
    if (response?.success) {
      setSupplier(await Select2Data(response?.data, "supplier_id"));
    }
  };
  useEffect(() => {
    GetAllSupplier();
  }, []);

  const brand = watch("brand_id");
  const shape = watch("shape_id");
  const color = watch("color_id");
  const model = watch("model_no");
  const product_name = watch("product_name");
  const modality = watch("modality");
  const bocode = watch("bo_code");
  const categorydata = watch("p_category_id");

  useEffect(() => {
    if (categorydata?.value !== Category?.Accessories) {
      const isLensCategory =
        categorydata?.value === Category?.Lenses ||
        categorydata?.value === Category?.ContactLens;
      const iscontactLensCategory =
        categorydata?.value === Category?.ContactLens;

      const parts = [
        brand?.label,
        shape?.label,
        color?.label,
        product_name,
        isLensCategory ? bocode : model,
        iscontactLensCategory ? "" : modality,
      ];

      const autoName = parts
        .map((v) => (typeof v === "string" ? v.trim() : v))
        .filter(Boolean)
        .join(" ");

      setValue("name", autoName, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [
    brand,
    shape,
    color,
    model,
    bocode,
    categorydata,
    modality,
    product_name,
  ]);

  return (
    <>
      <Header title={"Create Product"} link={"/employee/employee_details"} />
      <section className="Create">
        {/* back button start */}
        <div className="back_btn_holder d-flex ">
          <div onClick={() => navigate(`/products`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
        </div>
        {/* back button end */}

        <Form>
          {/* 1. Order Details start */}
          <div className="oder-detail-holder mb-3">
            {/* <div className="heading-holder mt-3">
              <h6>1. Product Category</h6>
            </div> */}
            <div className="package-details-section">
              <div className="pending-table ">
                <div className="row me-0 ms-0">
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
                            setCategory(selectedValue?.value);
                            // getAllSubCategories(selectedValue?.value);
                            // setValue("p_sub_category_id", "");
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
                    <Form.Label>HSN Code</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="HSN Code"
                        className={classNames("", {
                          "is-invalid": errors?.hsn_code,
                        })}
                        {...register("hsn_code", {
                          required: "HSN Code is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />

                      {errors.hsn_code && (
                        <span className="text-danger">
                          {errors.hsn_code.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <Form.Label>Model No.</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Model No."
                        className={classNames("", {
                          "is-invalid": errors?.model_no,
                        })}
                        {...register("model_no", {
                          required:
                            watch("p_category_id")?.value ===
                              Category?.ContactLens ||
                            watch("p_category_id")?.value === Category?.Lenses
                              ? false
                              : "Model No. is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />

                      {errors.model_no && (
                        <span className="text-danger">
                          {errors.model_no.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>

                  {(watch("p_category_id")?.value === Category?.ContactLens ||
                    watch("p_category_id")?.value === Category?.Lenses) && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>BO Code</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`bo_code`}
                            placeholder="BO Code"
                            className={classNames("", {
                              "is-invalid": errors?.bo_code,
                            })}
                            {...register(`bo_code`, {
                              required: "BO Code is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow control keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab"
                              ) {
                                return;
                              }

                              // Allow only digits
                              if (!/^\d$/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                          {errors?.bo_code && (
                            <span className="text-danger">
                              {errors.bo_code.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                    </>
                  )}

                  {watch("p_category_id")?.value === Category?.Lenses && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Lens Category</Form.Label>
                        <Controller
                          className="select-contoller"
                          name={`lens_category_id`} // name of the field
                          control={control}
                          rules={{
                            required: "Select Lens Category",
                          }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
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
                              options={lensCategories}
                              onChange={(selectedValue) => {
                                onChange(selectedValue);
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
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
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
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`modality`} // Register color for the variant
                            placeholder="Customer Name"
                            className={classNames("", {
                              "is-invalid": errors?.customer_name,
                            })}
                            {...register(`customer_name`, {
                              // required: "Customer Name is required",
                            })}
                          />
                          {errors?.customer_name && (
                            <span className="text-danger">
                              {errors.customer_name.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                    </>
                  )}

                  {(watch("p_category_id")?.value === Category?.Eyeglasses ||
                    watch("p_category_id")?.value === Category?.Sunglasses ||
                    watch("p_category_id")?.value === Category?.ContactLens ||
                    watch("p_category_id")?.value === Category?.Lenses) && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Brand</Form.Label>
                        <div className="main-form-section align-items-center mt-1 d-flex">
                          <Row className="justify-content-center row me-0 ms-0 w-100">
                            <Controller
                              className="select-contoller"
                              name={`brand_id`} // name of the field
                              control={control}
                              rules={{
                                required: "Select Brand",
                              }}
                              render={({
                                field: { onChange, onBlur, value, ref },
                              }) => (
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
                          </Row>

                          <button
                            type="button"
                            className="btn btn-success addcolbtn"
                            onClick={() => handleShowBrand()}
                          >
                            <FontAwesomeIcon icon={faAdd} />
                          </button>
                        </div>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Material</Form.Label>
                        <div className="main-form-section align-items-center mt-1 d-flex">
                          <Row className="justify-content-center row me-0 ms-0 w-100">
                            <Controller
                              className="select-contoller"
                              name={`material_id`} // name of the field
                              control={control}
                              rules={{
                                required: "Select Material",
                              }}
                              render={({
                                field: { onChange, onBlur, value, ref },
                              }) => (
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
                          </Row>

                          <button
                            type="button"
                            className="btn btn-success addcolbtn"
                            onClick={() => handleShowMaterial()}
                          >
                            <FontAwesomeIcon icon={faAdd} />
                          </button>
                        </div>
                      </div>

                      {(watch("p_category_id")?.value ===
                        Category?.Eyeglasses ||
                        watch("p_category_id")?.value ===
                          Category?.Sunglasses ||
                        watch("p_category_id")?.value === Category?.Lenses) && (
                        <>
                          {(watch("p_category_id")?.value ===
                            Category?.Sunglasses ||
                            watch("p_category_id")?.value ===
                              Category?.Eyeglasses) && (
                            <>
                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                                <Form.Label>Frame Type</Form.Label>
                                <Controller
                                  className="select-contoller"
                                  name={`frame_type_id`} // name of the field
                                  control={control}
                                  rules={{
                                    required: "Select Frame Type",
                                  }}
                                  render={({
                                    field: { onChange, onBlur, value, ref },
                                  }) => (
                                    <Select
                                      styles={{
                                        control: (baseStyles) => ({
                                          ...baseStyles,
                                          borderColor: errors?.frame_type_id
                                            ? "red"
                                            : baseStyles.borderColor,
                                        }),
                                      }}
                                      // {...field}
                                      options={FrameType}
                                      onChange={(selectedValue) => {
                                        onChange(selectedValue);
                                      }}
                                      onBlur={onBlur}
                                      value={value}
                                      ref={ref}
                                    />
                                  )}
                                />
                                {errors.frame_type_id && (
                                  <span className="text-danger">
                                    {errors.frame_type_id.message}
                                  </span>
                                )}
                              </div>

                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                                <Form.Label>Gender</Form.Label>
                                <Controller
                                  className="select-contoller"
                                  name={`gender_id`} // name of the field
                                  control={control}
                                  rules={{
                                    required: "Select Frame Type",
                                  }}
                                  render={({
                                    field: { onChange, onBlur, value, ref },
                                  }) => (
                                    <Select
                                      styles={{
                                        control: (baseStyles) => ({
                                          ...baseStyles,
                                          borderColor: errors?.gender_id
                                            ? "red"
                                            : baseStyles.borderColor,
                                        }),
                                      }}
                                      // {...field}
                                      options={Gender}
                                      onChange={(selectedValue) => {
                                        onChange(selectedValue);
                                      }}
                                      onBlur={onBlur}
                                      value={value}
                                      ref={ref}
                                    />
                                  )}
                                />
                                {errors.gender_id && (
                                  <span className="text-danger">
                                    {errors.gender_id.message}
                                  </span>
                                )}
                              </div>

                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                                <Form.Label>Frame Color</Form.Label>
                                <div className="main-form-section align-items-center mt-1 d-flex">
                                  <Row className="justify-content-center row me-0 ms-0 w-100">
                                    <Controller
                                      name={`color_id`}
                                      control={control}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          options={Color}
                                          styles={{
                                            control: (baseStyles) => ({
                                              ...baseStyles,
                                              borderColor: errors?.color_id
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

                                    {errors?.color_id && (
                                      <span className="text-danger">
                                        {errors.color_id.message}
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
                              </div>
                            </>
                          )}

                          {(watch("p_category_id")?.value ===
                            Category?.Sunglasses ||
                            watch("p_category_id")?.value ===
                              Category?.Lenses) && (
                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                              <Form.Label>Lens Color</Form.Label>
                              <div className="main-form-section align-items-center mt-1 d-flex">
                                <Row className="justify-content-center row me-0 ms-0 w-100">
                                  <Controller
                                    name={`lens_color_id`}
                                    control={control}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={Color}
                                        styles={{
                                          control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderColor: errors?.lens_color_id
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

                                  {errors?.lens_color_id && (
                                    <span className="text-danger">
                                      {errors.lens_color_id.message}
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
                            </div>
                          )}
                          {(watch("p_category_id")?.value ===
                            Category?.Sunglasses ||
                            watch("p_category_id")?.value ===
                              Category?.Eyeglasses) && (
                            <>
                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                                <Form.Label>Shape</Form.Label>
                                <Controller
                                  className="select-contoller"
                                  name={`shape_id`} // name of the field
                                  control={control}
                                  rules={{
                                    required: "Select Shape",
                                  }}
                                  render={({
                                    field: { onChange, onBlur, value, ref },
                                  }) => (
                                    <Select
                                      styles={{
                                        control: (baseStyles) => ({
                                          ...baseStyles,
                                          borderColor: errors?.shape_id
                                            ? "red"
                                            : baseStyles.borderColor,
                                        }),
                                      }}
                                      // {...field}
                                      options={Shape}
                                      onChange={(selectedValue) => {
                                        onChange(selectedValue);
                                      }}
                                      onBlur={onBlur}
                                      value={value}
                                      ref={ref}
                                    />
                                  )}
                                />
                                {errors.shape_id && (
                                  <span className="text-danger">
                                    {errors.shape_id.message}
                                  </span>
                                )}
                              </div>

                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                                <Form.Label>Size</Form.Label>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    name={`size`} // Register color for the variant
                                    placeholder="Size"
                                    className={classNames("", {
                                      "is-invalid": errors?.size,
                                    })}
                                    {...register(`size`, {
                                      required: "Size is required",
                                    })}
                                    onKeyDown={(e) => {
                                      // Allow backspace, left and right arrow keys
                                      if (
                                        e.key === "Backspace" ||
                                        e.key === "ArrowLeft" ||
                                        e.key === "ArrowRight" ||
                                        e.key === "Tab" ||
                                        e.key === "-"
                                      ) {
                                        return;
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
                                  {errors?.size && (
                                    <span className="text-danger">
                                      {errors.size.message}
                                    </span>
                                  )}
                                </Form.Group>
                              </div>

                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                                <Form.Label>Total Measurements</Form.Label>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    name={`total_measurements`} // Register color for the variant
                                    placeholder="Total Measurements"
                                    className={classNames("", {
                                      "is-invalid": errors?.total_measurements,
                                    })}
                                    {...register(`total_measurements`, {
                                      required:
                                        "Total Measurements is required",
                                    })}
                                    onKeyDown={(e) => {
                                      // Allow backspace, left and right arrow keys
                                      if (
                                        e.key === "Backspace" ||
                                        e.key === "ArrowLeft" ||
                                        e.key === "ArrowRight" ||
                                        e.key === "Tab" ||
                                        e.key === "-"
                                      ) {
                                        return;
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
                                  {errors?.total_measurements && (
                                    <span className="text-danger">
                                      {errors.total_measurements.message}
                                    </span>
                                  )}
                                </Form.Group>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {watch("p_category_id")?.value === Category?.ContactLens && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Modality</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`modality`} // Register color for the variant
                            placeholder="Modality"
                            className={classNames("", {
                              "is-invalid": errors?.modality,
                            })}
                            {...register(`modality`, {
                              required: "Modality is required",
                            })}
                          />
                          {errors?.modality && (
                            <span className="text-danger">
                              {errors.modality.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Water Content (%)</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`water_content`} // Register color for the variant
                            placeholder="Water Content (%)"
                            className={classNames("", {
                              "is-invalid": errors?.water_content,
                            })}
                            {...register(`water_content`, {
                              required: "Water Content (%) is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow backspace, left and right arrow keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab" ||
                                e.key === "-"
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
                          {errors?.water_content && (
                            <span className="text-danger">
                              {errors.water_content.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Base Curve</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`base_curve`} // Register color for the variant
                            placeholder="Base Curve"
                            className={classNames("", {
                              "is-invalid": errors?.base_curve,
                            })}
                            {...register(`base_curve`, {
                              required: "Base Curve is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow backspace, left and right arrow keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab" ||
                                e.key === "-"
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
                          {errors?.base_curve && (
                            <span className="text-danger">
                              {errors.base_curve.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Diameter</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`diameter`} // Register color for the variant
                            placeholder="Diameter"
                            className={classNames("", {
                              "is-invalid": errors?.diameter,
                            })}
                            {...register(`diameter`, {
                              required: "Diameter is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow backspace, left and right arrow keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab" ||
                                e.key === "-"
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
                          {errors?.diameter && (
                            <span className="text-danger">
                              {errors.diameter.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>DK/T</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`dk_t`} // Register color for the variant
                            placeholder="DK/T"
                            className={classNames("", {
                              "is-invalid": errors?.dk_t,
                            })}
                            {...register(`dk_t`, {
                              required: "DK/T is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow backspace, left and right arrow keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab" ||
                                e.key === "-"
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
                          {errors?.dk_t && (
                            <span className="text-danger">
                              {errors.dk_t.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`modality`} // Register color for the variant
                            placeholder="Customer Name"
                            className={classNames("", {
                              "is-invalid": errors?.customer_name,
                            })}
                            {...register(`customer_name`, {
                              // required: "Customer Name is required",
                            })}
                          />
                          {errors?.customer_name && (
                            <span className="text-danger">
                              {errors.customer_name.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Pack Size</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`size`} // Register color for the variant
                            placeholder="Pack Size"
                            className={classNames("", {
                              "is-invalid": errors?.size,
                            })}
                            {...register(`size`, {
                              required: "Pack Size is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow backspace, left and right arrow keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab" ||
                                e.key === "-"
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
                          {errors?.size && (
                            <span className="text-danger">
                              {errors.size.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`size`} // Register color for the variant
                            placeholder="Product Name"
                            className={classNames("", {
                              "is-invalid": errors?.product_name,
                            })}
                            {...register(`product_name`, {
                              required: "Product Name is required",
                            })}
                          />
                          {errors?.product_name && (
                            <span className="text-danger">
                              {errors.product_name.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                    </>
                  )}

                  {watch("p_category_id")?.value === Category?.Lenses && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Index</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`index`} // Register color for the variant
                            placeholder="Index"
                            className={classNames("", {
                              "is-invalid": errors?.index,
                            })}
                            {...register(`index`, {
                              required: "Index is required",
                            })}
                            onKeyDown={(e) => {
                              // Allow backspace, left and right arrow keys
                              if (
                                e.key === "Backspace" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "Tab" ||
                                e.key === "-"
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
                          {errors?.index && (
                            <span className="text-danger">
                              {errors.index.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`size`} // Register color for the variant
                            placeholder="Product Name"
                            className={classNames("", {
                              "is-invalid": errors?.product_name,
                            })}
                            {...register(`product_name`, {
                              required: "Product Name is required",
                            })}
                          />
                          {errors?.product_name && (
                            <span className="text-danger">
                              {errors.product_name.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                    </>
                  )}

                  {watch("p_category_id")?.value === Category?.Lenses && (
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                      <Form.Label>Coating</Form.Label>
                      <Controller
                        className="select-contoller"
                        name={`coating_id`} // name of the field
                        control={control}
                        rules={{
                          required: "Select Frame Type",
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors?.coating_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            // {...field}
                            options={coating}
                            onChange={(selectedValue) => {
                              onChange(selectedValue);
                            }}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                          />
                        )}
                      />
                      {errors.coating_id && (
                        <span className="text-danger">
                          {errors.coating_id.message}
                        </span>
                      )}
                    </div>

                    // <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    //   <Form.Label>Coating Name</Form.Label>
                    //   <Form.Group>
                    //     <Form.Control
                    //       type="text"
                    //       name={`coating_name`}
                    //       placeholder="Coating Name"
                    //       className={classNames("", {
                    //         "is-invalid": errors?.coating_name, // Adjusted error checking
                    //       })}
                    //       {...register(`coating_name`, {
                    //         required: "Coating Name is required",
                    //         validate: (value) => {
                    //           const words = value.match(/\b\w+\b/g); // Match all word-like segments
                    //           return (
                    //             !words ||
                    //             words.length <= 50 ||
                    //             "Data must be 100 words or less"
                    //           );
                    //         },
                    //       })}
                    //     />

                    //     {errors.coating_name && (
                    //       <span className="text-danger">
                    //         {errors.coating_name.message}
                    //       </span>
                    //     )}
                    //   </Form.Group>
                    // </div>
                  )}

                  <Row className="detail-row mt-2 me-0 ms-0">
                    <Col lg={4} md={4} className="mt-3">
                      <div className="">
                        <div className="detail-label">Name</div>
                        <Form.Control
                          type="text"
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "name is required",
                            validate: (value) => {
                              const words = value.match(/\b\w+\b/g);
                              return (
                                !words ||
                                words.length <= 50 ||
                                "Data must be 50 words or less"
                              );
                            },
                          })}
                        />
                      </div>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </Col>
                    <Col lg={4} md={4} className="mt-3">
                      <div className="">
                        <div className="detail-label">Thumbnail</div>
                        <Form.Control
                          type="file"
                          name="thumbnail"
                          placeholder="Image"
                          className={classNames("", {
                            "is-invalid": errors?.thumbnail,
                          })}
                          {...register("thumbnail", {
                            // required: "Image is required",
                          })}
                          accept="image/*, video/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      {errors.thumbnail && (
                        <span className="text-danger">
                          {errors.thumbnail.message}
                        </span>
                      )}
                    </Col>
                    <Col lg={4} md={4} className="mt-3">
                      {imagePreview && (
                        <div className="Preview_img_holder">
                          {/* Check if the preview is an image or video */}
                          {imagePreview.includes("video") ? (
                            // Display video preview if it's a video
                            <video
                              className="Preview_video"
                              autoPlay
                              muted
                              loop
                              // controls
                              style={{ maxWidth: "200px" }}
                            >
                              <source src={imagePreview} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            // Display image preview if it's an image
                            <img
                              className="Preview_img"
                              src={imagePreview}
                              alt="Category Preview"
                              style={{ maxWidth: "200px" }}
                            />
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="detail-row mt-2 me-0 ms-0">
                    <Col md={2} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>MRP</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="MRP"
                              className={classNames("", {
                                "is-invalid": errors?.mrp,
                              })}
                              {...register("mrp", {
                                required: "MRP is required",
                              })}
                              onKeyDown={(e) => {
                                if (
                                  !/[\d.]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                )
                                  e.preventDefault();
                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                )
                                  e.preventDefault();
                              }}
                            />
                            {errors?.mrp && (
                              <span className="text-danger">
                                {errors.mrp.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    <Col md={2} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Discount (%)</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Discount"
                              className={classNames("", {
                                "is-invalid": errors?.discount,
                              })}
                              {...register("discount", {
                                required: "Discount is required",
                              })}
                              onKeyDown={(e) => {
                                if (
                                  !/[\d.]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                )
                                  e.preventDefault();
                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                )
                                  e.preventDefault();
                              }}
                            />
                            {errors?.discount && (
                              <span className="text-danger">
                                {errors.discount.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>

                      {/* Discount Amount */}
                      <div className="main-form-section mt-2">
                        <Row className="justify-content-center">
                          <Form.Label>Discount Amount</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Discount Amount"
                              {...register("discount_amount")}
                            />
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    {/* Final Price */}
                    <Col md={2} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Final Price</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Final Price"
                              {...register("price")}
                            />
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    {/* Tax */}
                    <Col md={2} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Tax Percentage</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Tax %"
                              className={classNames("", {
                                "is-invalid": errors?.tax_percentage,
                              })}
                              {...register("tax_percentage", {
                                required: "Tax Percentage is required",
                                validate: (value) =>
                                  parseFloat(value) <= 100 ||
                                  "Tax cannot exceed 100%",
                              })}
                              onKeyDown={(e) => {
                                if (
                                  !/[\d.]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                )
                                  e.preventDefault();
                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                )
                                  e.preventDefault();
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

                      {/* Tax Amount */}
                      <div className="main-form-section mt-2">
                        <Row className="justify-content-center">
                          <Form.Label>Tax Amount</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Tax Amount"
                              {...register("tax_amount")}
                            />
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    <Col md={2} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Base Amount</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Base Amount"
                              {...register("base_amount")}
                            />
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                  </Row>

                  <Row className="detail-row mt-2 me-0 ms-0">
                    <Col md={6} className="mt-3">
                      <div className="main-form-section">
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

                    <Col md={6} className="mt-3">
                      <div className="main-form-section">
                        <Row className="justify-content-center">
                          <Form.Label>Images</Form.Label>
                          <Form.Group>
                            <Form.Control
                              className={classNames("", {
                                "is-invalid": errors?.image,
                              })}
                              type="file"
                              multiple
                              {...register(`image`, {
                                // required: "Images are required",
                              })}
                              accept="image/*"
                              id={`variantImages`}
                              onChange={(e) => handleVarientImagesChange(e)}
                            />
                            {errors?.image && (
                              <div className="text-danger">
                                {errors.image.message}
                              </div>
                            )}
                          </Form.Group>
                        </Row>
                      </div>

                      {Array.isArray(imagePreviews?.urls) && (
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {imagePreviews?.urls.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`Preview ${i}`}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row mt-2 me-0 ms-0">
                    <Col md={3} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="row justify-content-center mb-2 me-0 sm-0">
                          <Form.Label>Supplier</Form.Label>

                          <Controller
                            name="supplier_id" // name of the field
                            {...register("supplier_id", {
                              required: "Select Supplier",
                            })}
                            control={control}
                            render={({ field }) => (
                              <Select
                                styles={{
                                  control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderColor: errors.supplier_id
                                      ? "red"
                                      : baseStyles,
                                  }),
                                }}
                                {...field}
                                options={supplier}
                                // onChange={(selectedOption) => {
                                //   field.onChange(selectedOption.value); // Update Controller's value
                                //   GetAllStates(selectedOption.value);
                                //   setValue("country_id", selectedOption);
                                //   setValue("state_id", null);
                                // }}
                              />
                            )}
                          />

                          {errors.supplier_id && (
                            <span className="text-danger">
                              {errors.supplier_id.message}
                            </span>
                          )}
                        </Row>
                      </div>
                    </Col>
                    <Col md={3} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Quantity</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Quantity"
                              className={classNames("", {
                                "is-invalid": errors?.quantity,
                              })}
                              {...register("quantity", {
                                required: "Quantity is required",
                              })}
                              onKeyDown={(e) => {
                                if (
                                  !/[\d.]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                )
                                  e.preventDefault();
                                if (
                                  e.key === "." &&
                                  e.target.value.includes(".")
                                )
                                  e.preventDefault();
                              }}
                            />
                            {errors.quantity && (
                              <span className="text-danger">
                                {errors.quantity.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>

                      {/* Tax Amount */}
                    </Col>
                    {/* <Col md={3} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Invoice No.</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Invoice No. "
                              className={classNames("", {
                                "is-invalid": errors?.invoice_no,
                              })}
                              {...register("invoice_no", {
                                // required: "Invoice No. is required",
                                validate: (value) =>
                                  value.length <= 200 ||
                                  "Data must be 200 characters or less",
                              })}
                            />

                            {errors.invoice_no && (
                              <span className="text-danger">
                                {errors.invoice_no.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>

                    <Col md={3} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Order No.</Form.Label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Order No. "
                              className={classNames("", {
                                "is-invalid": errors?.order_no,
                              })}
                              {...register("order_no", {
                                // required: "Order No. is required",
                                validate: (value) =>
                                  value.length <= 200 ||
                                  "Data must be 200 characters or less",
                              })}
                            />

                            {errors.order_no && (
                              <span className="text-danger">
                                {errors.order_no.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>*/}

                    <Col md={3} className="mt-3">
                      <div className="main-form-section ">
                        <Row className="justify-content-center">
                          <Form.Label>Customer View.</Form.Label>
                          <Form.Group>
                            <Form.Check
                              type="checkbox"
                              label="Show to customer"
                              className="mt-1"
                              {...register("customer_view")}
                            />
                          </Form.Group>
                        </Row>
                      </div>
                    </Col>
                  </Row>

                  {watch("p_category_id")?.value === Category?.Lenses && (
                    <div className="oder-detail-holder mb-3">
                      <div className="heading-holder mt-3">
                        <h6>Lens Addons</h6>
                      </div>

                      <div className="package-details-section">
                        {addonFields.map((item, index) => (
                          <div key={item.id} className="main-form-section mt-3">
                            <Row>
                              <Col md={4}>
                                <Form.Label>Addon Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Addon name"
                                  {...register(
                                    `lense_addons.${index}.lense_addon_name`,
                                    {
                                      required: "Addon name is required",
                                    },
                                  )}
                                />
                              </Col>

                              <Col md={4}>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Price"
                                  {...register(
                                    `lense_addons.${index}.lense_addon_price`,
                                    {
                                      required: "Price is required",
                                      min: 1,
                                    },
                                  )}
                                />
                              </Col>

                              <Col md={4}>
                                <Form.Label>MRP</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="MRP"
                                  {...register(
                                    `lense_addons.${index}.lense_addon_mrp`,
                                    {
                                      required: "MRP is required",
                                      min: 1,
                                    },
                                  )}
                                />
                              </Col>
                            </Row>

                            {addonFields.length > 1 && (
                              <button
                                type="button"
                                className="mt-3 add-varient"
                                onClick={() => removeAddon(index)}
                              >
                                Remove Addon
                              </button>
                            )}

                            <hr />
                          </div>
                        ))}

                        <div className="text-center">
                          <button
                            type="button"
                            className="add-varient"
                            onClick={() =>
                              addAddon({
                                lense_addon_name: "",
                                lense_addon_price: "",
                                lense_addon_mrp: "",
                              })
                            }
                          >
                            + Add Addon
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* 1. Order Details end */}

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
                type="button"
                onClick={handleSubmit(onSubmit)}
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

      <AddOffCanvance
        handleClose={handleClose}
        setShow={setShowAdd}
        show={show}
      />

      <AddOffCanvanceBrand
        handleClose={handleCloseBrand}
        setShow={setShowBrand}
        show={showBrand}
      />
      <AddOffCanvanceMaterial
        handleClose={handleCloseMaterial}
        setShow={setShowMaterial}
        show={showMaterial}
      />
    </>
  );
}

export default Create;
