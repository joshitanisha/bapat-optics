import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import "./Create.css";
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
import { Category } from "../../../../utils/common";
import { useLoader } from "../../../../utils/common";
function Edit() {
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
    // defaultValues: {
    //   variants: [{ name: "", price: "", mrp: "", image: "", description: "" }],
    // },
  });

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
      DataToSend.append("name", data?.name);

      DataToSend.append("p_category_id", data?.p_category_id?.value);

      DataToSend.append("brand_id", data?.brand_id?.value);
      DataToSend.append("material_id", data?.material_id?.value || "");
      DataToSend.append("frame_type_id", data?.frame_type_id?.value || "");
      DataToSend.append("gender_id", data?.gender_id?.value || "");
      DataToSend.append("shape_id", data?.shape_id?.value || "");
      DataToSend.append("color_id", data?.color_id?.value || "");

      DataToSend.append("face_width_id", data?.face_width_id?.value || "");
      DataToSend.append("water_content", data?.water_content || "");
      DataToSend.append("diameter", data?.diameter || "");
      DataToSend.append("base_curve", data?.base_curve || "");
      DataToSend.append("dk_t", data?.dk_t || "");
      DataToSend.append("index", data?.index || "");
      DataToSend.append("size", data?.size || "");
      DataToSend.append("manufacturer", data?.product_name);
      DataToSend.append("total_measurements", data?.total_measurements || "");
      DataToSend.append("coating_name", data?.coating_name || "");

      DataToSend.append("lens_color_id", data?.lens_color_id?.value || "");
      DataToSend.append(
        "lens_category_id",
        data?.lens_category_id?.value || "",
      );
      // DataToSend.append("color_id", data?.color_id?.value || "");
      DataToSend.append("lens_type_id", data?.lens_type_id?.value || "");
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
      DataToSend.append("coating_id", data?.coating_id?.value || "");
      DataToSend.append("customer_name", data?.customer_name);
      DataToSend.append("model_no", data?.model_no || "");
      DataToSend.append("hsn_code", data?.hsn_code);
      if (data?.thumbnail?.[0]) {
        DataToSend.append("thumbnail", data?.thumbnail?.[0]);
      }

      if (data?.lense_addons?.length > 0) {
        const addonsPayload = data.lense_addons.map((addon) => ({
          id: addon.id || null,
          lense_addon_name: addon.lense_addon_name,
          lense_addon_price: addon.lense_addon_price,
          lense_addon_mrp: addon.lense_addon_mrp,
        }));

        DataToSend.append("lense_addons", JSON.stringify(addonsPayload));
      }

      const inputImages = document.getElementById(`variantImages`);
      if (inputImages && inputImages.files) {
        const files = inputImages.files;
        for (let i = 0; i < files.length; i++) {
          DataToSend.append(`image`, files[i]);
        }
      }

      const response = await withLoader(() =>
        putData(`/admin/products/${id}`, DataToSend),
      );

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
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const [Color, setColor] = useState([]);
  const [Shape, setShape] = useState([]);
  const [Material, setMaterial] = useState([]);
  const [Gender, setGender] = useState([]);
  const [FaceWidth, setFaceWidth] = useState([]);
  const [FrameType, setFrameType] = useState([]);
  const watchedUnit = watch("unit_id");
  const [lensCategories, setLensCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coating, setCoating] = useState([]);
  const [category, setCategory] = useState();

  // const GetEditData = async () => {
  //   try {
  //     const response = await withLoader(() => getData(`/admin/products/${id}`));
  //     reset(response?.data);

  //     let previews = [];

  //     if (response?.data?.variant_images?.length) {
  //       previews = response.data.variant_images.map((img) => ({
  //         id: img.id,
  //         url: IMG_URL + img.image,
  //       }));
  //     }

  //     setImagePreviews(previews);
  //     setCategory(response?.data?.p_category_id?.value);
  //   } catch (error) {
  //     console.error("Error fetching edit data", error);
  //   }
  // };

  useEffect(() => {
    GetEditData();
  }, [id]);
  const getAllCoating = async () => {
    const response = await getData("/common/masters/all-coating");
    if (response?.success) {
      setCoating(await Select2Data(response?.data, "coating_id"));
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
      setCategories(await Select2Data(response?.data, "p_category_id"));
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

  const getAllShape = async () => {
    const response = await getData(`/common/masters/all-shape`);
    if (response?.success) {
      setShape(await Select2Data(response?.data, "shape_id"));
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
  const getAllMaterial = async (category) => {
    const response = await getData(
      `/common/masters/all-material?category_id=${category}`,
    );
    if (response?.success) {
      setMaterial(await Select2Data(response?.data, "material_id"));
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
  const getAllBrands = async (category) => {
    const response = await getData(
      `/common/masters/all-brands?category_id=${category}`,
    );
    if (response?.success) {
      setBrands(await Select2Data(response?.data, "brand_id"));
    }
  };

  useEffect(() => {
    getAllBrands(category);
    getAllMaterial(category);
    getAllColor(category);
  }, [category]);
  useEffect(() => {
    getAllGender();
    getAllFrameType();
    getAllFaceWidth();

    getAllCountries();

    getAllUnits();
    getAllCategories();
    getAllLensCategories();
    getAllLensTypes();
    getAllCoating();

    getAllShape();
  }, []);

  const [show, setShowAdd] = useState(false);
  const handleClose = async () => {
    await getAllColor();
    await setShowAdd(false);
  };
  const handleShow = () => setShowAdd(true);

  // const GetEditData = async () => {
  //   const response = await getData(`/admin/products/${id}`);
  //   reset(response?.data);

  //   let previews = [];

  //   if (response?.data?.variant_images?.length) {
  //     previews = response.data.variant_images.map((img) => ({
  //       id: img.id,
  //       url: IMG_URL + img.image,
  //     }));
  //   }

  //   setImagePreviews(previews);
  // };

  // const GetEditData = async () => {
  //   try {

  //     const response = await withLoader(() => getData(`/admin/products/${id}`));
  //     reset(response?.data);

  //     let previews = [];

  //     if (response?.data?.variant_images?.length) {
  //       previews = response.data.variant_images.map((img) => ({
  //         id: img.id,
  //         url: IMG_URL + img.image,
  //       }));
  //     }

  //     setImagePreviews(previews);
  //   } catch (error) {
  //     console.error("Error fetching edit data", error);
  //   }
  // };

  const GetEditData = async () => {
    try {
      const response = await withLoader(() => getData(`/admin/products/${id}`));
      console.log("response", response);
      reset({
        ...response?.data,

        lense_addons:
          response?.data?.lense_addons?.length > 0
            ? response.data.lense_addons.map((addon) => ({
              id: addon.id,
              lense_addon_name: addon.lense_addon_name,
              lense_addon_price: addon.lense_addon_price,
              lense_addon_mrp: addon.lense_addon_mrp,
              status: addon.status,
            }))
            : [], // empty default if no addons
      });

      let previews = [];
      if (response?.data?.variant_images?.length) {
        previews = response.data.variant_images.map((img) => ({
          id: img.id,
          url: IMG_URL + img.image,
        }));
      }
      setImagePreviews(previews);
    } catch (error) {
      console.error("Error fetching edit data", error);
    }
  };

  useEffect(() => {
    GetEditData();
  }, [id]);

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
    const urls = files.map((file) => ({
      id: null,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...(prev || []), ...urls]);
  };

  const handleRemoveImage = async (imageIndex) => {
    const targetImage = imagePreviews[imageIndex];

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
      const updatedImages = [...prev];
      updatedImages.splice(imageIndex, 1);
      return updatedImages;
    });
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





  const HandleDownload = async () => {
    // if (selectAllChecked.length === 0) {
    //   alert("Please Select Atleast One Record");
    //   return;
    // }
    setLoder(true);
    try {

      const targetId = getValues("stock_id");

      if (!targetId) {
        alert("Stock ID is missing");
        setLoder(false);
        return;
      }

      console.log(targetId, "targetId");

      const response = await postData(
        `/admin/products/product-stock/barcode-generate`,
        [Number(targetId)],
      );

      console.log(response, "response");

      // ✔ Expecting something like "/public/invoices/barcode.pdf"
      const pdfPath = response?.data;

      if (!pdfPath) {
        alert("PDF path not found in response");
        setLoder(false);
        return;
      }

      // Create final file URL
      const fileUrl = `${IMG_URL}${pdfPath}`;

      // Fetch PDF
      const res = await fetch(fileUrl);
      if (!res.ok) {
        alert("Failed to fetch PDF");
        setLoder(false);
        return;
      }

      const blob = await res.blob();

      if (blob.type !== "application/pdf") {
        alert("Server did not return a valid PDF file");
        setLoder(false);
        return;
      }

      // Create download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "barcode.pdf"; // you can make it dynamic
      link.click();
      window.URL.revokeObjectURL(url);

      setLoder(false);

      await GetEditData(); // getDataAll();

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
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

        <Form>
          {/* 1. Order Details start */}
          <div className="oder-detail-holder mb-3">
            {/* <div className="heading-holder mt-3">
              <h6>1. Product Category</h6>
            </div> */}
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
                            setCategory(selectedValue?.value);
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
                            !value ||
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

                  {watch("p_category_id")?.value === Category?.ContactLens && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>BO Code</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`bo_code`} // Register color for the variant
                            placeholder="BO Code"
                            className={classNames("", {
                              "is-invalid": errors?.bo_code,
                            })}
                            {...register(`bo_code`, {
                              required: "BO Code is required",
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
                          {errors?.bo_code && (
                            <span className="text-danger">
                              {errors.bo_code.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>

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
                      {/* <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
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
                      </div> */}
                    </>
                  )}

                  {watch("p_category_id")?.value === Category?.Lenses && (
                    <>
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                        <Form.Label>BO Code</Form.Label>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            name={`bo_code`} // Register color for the variant
                            placeholder="BO Code"
                            className={classNames("", {
                              "is-invalid": errors?.bo_code,
                            })}
                            {...register(`bo_code`, {
                              required: "BO Code is required",
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
                          {errors?.bo_code && (
                            <span className="text-danger">
                              {errors.bo_code.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
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
                      {/* <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
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
                      </div> */}
                    </>
                  )}

                  {(watch("p_category_id")?.value === Category?.Eyeglasses ||
                    watch("p_category_id")?.value === Category?.Sunglasses ||
                    watch("p_category_id")?.value === Category?.ContactLens ||
                    watch("p_category_id")?.value === Category?.Lenses) && (
                      <>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                          <Form.Label>Brand</Form.Label>
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
                    </>
                  )}

                  {watch("p_category_id")?.value === Category?.Lenses && (
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
                              e.key === "Tab" ||
                              e.key === "-" ||
                              e.key === "ArrowRight"
                            ) {
                              return; // Allow the action to continue
                            }

                            // Allow digits and decimal point
                            if (!/[\d.]/.test(e.key)) {
                              e.preventDefault(); // Block the invalid key
                            }

                            // Prevent multiple decimal points
                            if (e.key === "." && e.target.value.includes(".")) {
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
                    <Col md={4}>
                      <div className="detail-label">Name</div>
                    </Col>
                    <Col lg={8} md={8}>
                      <div className="">
                        <Form.Control
                          type="text"
                          // value={`${watch("brand_id")?.label || ""}  ${
                          //   watch("shape_id")?.label || ""
                          // } ${watch("color_id")?.label || ""} ${
                          //   watch("model_no") || ""
                          // }`}
                          name={`name`}
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name, // Adjusted error checking
                          })}
                          {...register(`name`, {
                            required: "name is required",
                            validate: (value) => {
                              const words = value.match(/\b\w+\b/g); // Match all word-like segments
                              return (
                                !words ||
                                words.length <= 50 ||
                                "Data must be 100 words or less"
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

                    <Col md={4} className="mt-3">
                      <div className="detail-label">Thumbnail</div>
                    </Col>
                    <Col lg={4} md={4} className="mt-3">
                      <div className="">
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
                      {imagePreview
                        ? imagePreview?.length > 0 && (
                          <div className="image-preview-container">
                            <img
                              // src={URL.createObjectURL(getValues("image")[0])}
                              src={imagePreview}
                              alt="Preview"
                              className="image-preview"
                            />
                          </div>
                        )
                        : typeof getValues("image") == "string" && (
                          <div className="image-preview-container">
                            <img
                              src={IMG_URL + getValues("image")}
                              alt="Preview"
                              className="image-preview"
                            />
                          </div>
                        )}
                    </Col>

                    {/* --- ROW 0: Non-Editable Receiving Info (Displays Above MRP) --- */}
                    <Row>
                      {/* Invoice No */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Invoice No.</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Invoice No"
                              {...register("invoice_no")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Order No */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Order No.</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Order No"
                              {...register("order_no")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Quantity */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Quantity"
                              {...register("quantity")}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>


                    <Row>
                      {/* MRP */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>MRP</Form.Label>
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
                                if (e.key === "." && e.target.value.includes("."))
                                  e.preventDefault();
                              }}
                            />
                            {errors?.mrp && (
                              <span className="text-danger">{errors.mrp.message}</span>
                            )}
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Discount (%) */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Discount (%)</Form.Label>
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
                                if (e.key === "." && e.target.value.includes("."))
                                  e.preventDefault();
                              }}
                            />
                            {errors?.discount && (
                              <span className="text-danger">
                                {errors.discount.message}
                              </span>
                            )}
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Discount Amount */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Discount Amount</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Discount Amount"
                              {...register("discount_amount")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Final Price */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Final Price</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Final Price"
                              {...register("price")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Tax Percentage */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Tax %</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Tax %"
                              className={classNames("", {
                                "is-invalid": errors?.tax_percentage,
                              })}
                              {...register("tax_percentage", {
                                required: "Tax Percentage is required",
                                validate: (value) =>
                                  parseFloat(value) <= 100 || "Tax cannot exceed 100%",
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
                                if (e.key === "." && e.target.value.includes("."))
                                  e.preventDefault();
                              }}
                            />
                            {errors.tax_percentage && (
                              <span className="text-danger">
                                {errors.tax_percentage.message}
                              </span>
                            )}
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Tax Amount */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Tax Amount</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Tax Amount"
                              {...register("tax_amount")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Base Amount */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Base Amount</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Base Amount"
                              {...register("base_amount")}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      {/* WLP */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>WLP</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="WLP"
                              {...register("wlp")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Discount (%) */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Discount (%)</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Discount %"
                              {...register("wlpdiscount")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Discount Amount */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Discount Amount</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Discount Amount"
                              {...register("wlpdiscountamount")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Price */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Price"
                              {...register("base_price")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* GST (%) */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>GST (%)</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="GST %"
                              {...register("gst")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* GST Amount */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>GST Amount</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="GST Amount"
                              {...register("gst_price")}
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      {/* Final Price */}
                      <Col>
                        <div className="main-form-section mt-3">
                          <Form.Group>
                            <Form.Label>Final Price</Form.Label>
                            <Form.Control
                              type="text"
                              readOnly
                              placeholder="Final Price"
                              {...register("total_price")}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>



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

                    <Col md={4}>
                      <div className="main-form-section mt-3">
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
                    </Col>
                    {Array.isArray(imagePreviews) && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {imagePreviews.map((src, i) => (
                          <div
                            key={i}
                            className="varimggdiv position-relative"
                            onClick={() => handleRemoveImage(i)}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              key={i}
                              src={src?.url}
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

                    {watch("p_category_id")?.value === Category?.Lenses && (
                      <div className="oder-detail-holder mb-3">
                        <div className="heading-holder mt-3">
                          <h6>Lens Addons</h6>
                        </div>

                        <div className="package-details-section">
                          {addonFields.map((item, index) => (
                            <div
                              key={item.id}
                              className="main-form-section mt-3"
                            >
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
                                    defaultValue={item.lense_addon_name} // default for edit
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
                                    defaultValue={item.lense_addon_price} // default for edit
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
                                    defaultValue={item.lense_addon_mrp} // default for edit
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
                  </Row>
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

            {loader ? (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light me-2 text-center mt-4 mx-2"
                  role="status"
                ></div>
              </>
            ) : (
              <div className="text-center mt-4 mx-2">
                <button
                  className="schedule-button"
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                >
                  Update Product
                </button>
              </div>
            )}

            {/* Barcode Button */}
            <div className="text-center mt-4 mx-2">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={HandleDownload}
                disabled={loader}
              >
                {loader ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm text-light me-2"
                      role="status"
                    ></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Download Barcode
                    <FontAwesomeIcon
                      icon="fa-solid fa-file-lines"
                      className="pdf-icon ms-3"
                      variant="success"
                    />
                  </>
                )}
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

export default Edit;
