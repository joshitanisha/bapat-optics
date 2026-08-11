import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./Product.css";

import Card from "react-bootstrap/Card";
import Select from "react-select";
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import {
  Row,
  Col,
  Form,
  Modal,
  Container,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import { Context } from "../../../utils/context";
import JoditEditor from "jodit-react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  useLoader } from "../../../utils/common";
const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data, getDimension } = useContext(Context);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childSubCategories, setChildSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [taxPercentages, setPercentages] = useState([]);
  const [attributes, setAttribute] = useState([]);
  const [subAttributes, setSubAttribute] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const imagesFile = watch("images");
  const imageFile = watch("image1");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants", // Name of your field array
  });

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

  const validateSellingPrice = (value, index) => {
    const mrpValue = parseFloat(getValues(`variants.${index}.mrp`));
    const sellingPrice = parseFloat(value);
    if (sellingPrice >= mrpValue) {
      return "Selling price must be less than MRP";
    }
    return true; // Validation passed
  };
 const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();

      DataToSend.append("name", data?.name);
      DataToSend.append("short_description", data?.short_description);
      DataToSend.append("manufacturer", data?.manufacturer);
      DataToSend.append("vender", data?.vender);
      DataToSend.append("about", data?.about);
      DataToSend.append("benifits", data?.benifits);
      DataToSend.append("storage", data?.storage);
      DataToSend.append("image1", data?.image1[0]);
      DataToSend.append("category_id", data?.category_id?.value);
      DataToSend.append("sub_category_id", data?.sub_category_id?.value);
      DataToSend.append("child_category_id", data?.child_category_id?.value);
      DataToSend.append("brand_id", data?.brand_id?.value);
      DataToSend.append("tax_type_id", data?.tax_type_id?.value);
      DataToSend.append("tax_percentage_id", data?.tax_percentage_id?.value);

      // Append variants
      const variants = [];
      data.variants.forEach((variant, index) => {
        variants.push({
          // attribute_id: variant.attribute_id?.value,
          // sub_attribute_id: variant.sub_attribute_id?.value,
          v_name: variant.v_name,
          unit: variant.unit,
          mrp: variant.mrp,
          sku: variant.sku,
          s_price: variant.s_price,
        });

        let inputImages = document.getElementById(`variantImages${index}`);

        const files = inputImages.files;
        for (let i = 0; i < files.length; i++) {
          DataToSend.append(`images${index}`, files[i]);
        }
      });

      DataToSend.append("variants", JSON.stringify(variants));
      const response = await withLoader(() => postData(`/product`, DataToSend));

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
    const response = await getData("/allcategories");

    if (response?.success) {
      setCategories(await Select2Data(response?.data, "category_id"));
    }
  };

  const GetAllSubCategory = async (id) => {
    const response = await getData(`/allsubcategories/${id}`);

    if (response?.success) {
      setSubCategories(await Select2Data(response?.data, "sub_category_id"));
    }
  };

  const GetAllChildSubCategory = async (id) => {
    const response = await getData(`/allchildsubcategories/${id}`);

    if (response?.success) {
      setChildSubCategories(
        await Select2Data(response?.data, "sub_category_id")
      );
    }
  };

  const GetAllBrands = async () => {
    const response = await getData("/allbrands");

    if (response?.success) {
      setBrands(await Select2Data(response?.data, "brand_id"));
    }
  };

  const GetAllTaxTypes = async () => {
    const response = await getData("/all-tax-type");

    if (response?.success) {
      setTaxTypes(await Select2Data(response?.data, "tax_type_id"));
    }
  };

  const GetAllTaxPercentages = async (id) => {
    const response = await getData(`/all-tax-percentage/${id}`);

    if (response?.success) {
      setPercentages(await Select2Data(response?.data, "tax_percentage_id"));
    }
  };

  const GetAllAttributes = async () => {
    const response = await getData(`/all-attribute`);

    if (response?.success) {
      setAttribute(await Select2Data(response?.data, "attribute_id"));
    }
  };

  const GetAllSubAttributes = async (id) => {
    const response = await getData(`/all-sub-attribute/${id}`);

    if (response?.success) {
      setSubAttribute(await Select2Data(response?.data, "sub_attribute_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
    GetAllBrands();
    GetAllTaxTypes();
    GetAllAttributes();
  }, []);

  const deleteImage = async (index) => {
    const updatedImagesFile = [...imagesFile];
    updatedImagesFile.splice(index, 1);
    setValue("images", updatedImagesFile);
  };

  return (
    <>
      <div className="prodcuttttt">
        <Offcanvas
          show={props.show}
          style={{ width: "80%" }}
          placement={"end"}
          onHide={props.handleClose}
        >
          <Offcanvas.Header closeButton>
            {/* <Offcanvas.Title>Add Employee</Offcanvas.Title> */}
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="shadow-lg p-3 mb-5  rounded">
              <Card.Body>
                <Card.Title>Add Product</Card.Title>
                <hr />
                <Container>
                  <Form
                    // onSubmit={() => handleSubmit(onSubmit)}
                    role="form"
                    // className="stateclass"
                  >
                    <Row>
                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="row justify-content-center mb-2 me-0 sm-0">
                            <Form.Label>Category</Form.Label>
                            <Controller
                              name="category_id" // name of the field
                              {...register("category_id", {
                                required: "Select Category",
                              })}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors.category_id
                                        ? "red"
                                        : baseStyles,
                                    }),
                                  }}
                                  {...field}
                                  options={categories}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption.value); // Update Controller's value
                                    GetAllSubCategory(selectedOption.value);
                                    setValue("category_id", selectedOption);
                                    setValue("sub_category_id", "");
                                    setValue("child_category_id", "");
                                  }}
                                />
                              )}
                            />
                            {errors.category_id && (
                              <span className="text-danger">
                                {errors.category_id.message}
                              </span>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="row justify-content-center mb-2 me-0 sm-0">
                            <Form.Label>Sub Category</Form.Label>
                            <Controller
                              name="sub_category_id" // name of the field
                              {...register("sub_category_id", {
                                required: "Select Sub Category",
                              })}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors.sub_category_id
                                        ? "red"
                                        : baseStyles,
                                    }),
                                  }}
                                  {...field}
                                  options={subCategories}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption.value); // Update Controller's value
                                    GetAllChildSubCategory(
                                      selectedOption.value
                                    );
                                    setValue("sub_category_id", selectedOption);
                                    setValue("child_category_id", "");
                                  }}
                                />
                              )}
                            />
                            {errors.sub_category_id && (
                              <span className="text-danger">
                                {errors.sub_category_id.message}
                              </span>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="row justify-content-center mb-2 me-0 sm-0">
                            <Form.Label>Child Sub Category</Form.Label>
                            <Controller
                              name="child_category_id" // name of the field
                              {...register("child_category_id", {
                                required: "Select Child Sub Category",
                              })}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors.child_category_id
                                        ? "red"
                                        : baseStyles,
                                    }),
                                  }}
                                  {...field}
                                  options={childSubCategories}
                                />
                              )}
                            />
                            {errors.child_category_id && (
                              <span className="text-danger">
                                {errors.child_category_id.message}
                              </span>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Name</Form.Label>
                            <Form.Group>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  placeholder="Name .."
                                  className={classNames("", {
                                    "is-invalid": errors?.name,
                                  })}
                                  {...register("name", {
                                    required: "Name is required",
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

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Group>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  name="short_description"
                                  placeholder="Short Description"
                                  maxLength={40}
                                  className={classNames("", {
                                    "is-invalid": errors?.short_description,
                                  })}
                                  {...register("short_description", {
                                    required: "Short Description is required",
                                  })}
                                />
                              </InputGroup>
                              {errors.short_description && (
                                <span className="text-danger">
                                  {errors.short_description.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Form.Label>image</Form.Label>

                          <Form.Group>
                            <Form.Control
                              className={classNames("", {
                                "is-invalid": errors?.image1,
                              })}
                              type="file"
                              {...register("image1", {
                                required: "images is required",
                              })}
                              accept="image/*"
                            />
                          </Form.Group>
                          {errors.image1 && (
                            <span className="text-danger">
                              {errors.image1.message}
                            </span>
                          )}
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Form.Label>image</Form.Label>
                          {imageFile && imageFile?.length > 0 && (
                            <div className="image-preview-container">
                              <img
                                // src={URL.createObjectURL(getValues("image")[0])}
                                src={URL?.createObjectURL(imageFile[0])}
                                alt="Preview"
                                className="image-preview"
                              />
                            </div>
                          )}
                        </div>
                      </Col>

                      <div className="main-form-section mt-3"></div>
                      <Card.Title>Product Details</Card.Title>
                      <hr />

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-center">
                            <Form.Label>manufacturer</Form.Label>
                            <Form.Group>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  name="manufacturer"
                                  placeholder="Manufacturer"
                                  className={classNames("", {
                                    "is-invalid": errors?.manufacturer,
                                  })}
                                  {...register("manufacturer", {
                                    required: "manufacturer is required",
                                  })}
                                />
                              </InputGroup>
                              {errors.manufacturer && (
                                <span className="text-danger">
                                  {errors.manufacturer.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>

                          <Row className="justify-content-center">
                            <Form.Label>vender</Form.Label>
                            <Form.Group>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  name="vender"
                                  placeholder="vender"
                                  className={classNames("", {
                                    "is-invalid": errors?.vender,
                                  })}
                                  {...register("vender", {
                                    required: "vender is required",
                                  })}
                                />
                              </InputGroup>
                              {errors.vender && (
                                <span className="text-danger">
                                  {errors.vender.message}
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </div>
                      </Col>

                      {/* <Col xl={3} md={6}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label>vender</Form.Label>
                          <Form.Group>
                            <InputGroup>
                              <Form.Control
                                type="text"
                                name="vender"
                                placeholder="vender"
                                className={classNames("", {
                                  "is-invalid": errors?.vender,
                                })}
                                {...register("vender", {
                                  required: "vender is required",
                                })}
                              />
                            </InputGroup>
                            {errors.vender && (
                              <span className="text-danger">
                                {errors.vender.message}
                              </span>
                            )}
                          </Form.Group>
                        </Row>
                      </div>
                    </Col> */}

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="row justify-content-center mb-2 me-0 sm-0">
                            <Form.Label>Brand</Form.Label>
                            <Controller
                              name="brand_id" // name of the field
                              {...register("brand_id", {
                                required: "Select Brand",
                              })}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors.brand_id
                                        ? "red"
                                        : baseStyles,
                                    }),
                                  }}
                                  {...field}
                                  options={brands}
                                />
                              )}
                            />
                            {errors.brand_id && (
                              <span className="text-danger">
                                {errors.brand_id.message}
                              </span>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="row justify-content-center mb-2 me-0 sm-0">
                            <Form.Label>Tax Type</Form.Label>
                            <Controller
                              name="tax_type_id" // name of the field
                              {...register("tax_type_id", {
                                required: "Select Tax Type",
                              })}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors.tax_type_id
                                        ? "red"
                                        : baseStyles,
                                    }),
                                  }}
                                  {...field}
                                  options={taxTypes}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption.value); // Update Controller's value
                                    GetAllTaxPercentages(selectedOption.value);
                                    setValue("tax_type_id", selectedOption);
                                  }}
                                />
                              )}
                            />
                            {errors.tax_type_id && (
                              <span className="text-danger">
                                {errors.tax_type_id.message}
                              </span>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col xl={3} md={6}>
                        <div className="main-form-section mt-3">
                          <Row className="row justify-content-center mb-2 me-0 sm-0">
                            <Form.Label>Tax Percentage</Form.Label>
                            <Controller
                              name="tax_percentage_id" // name of the field
                              {...register("tax_percentage_id", {
                                required: "Select Tax Percentage",
                              })}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  styles={{
                                    control: (baseStyles) => ({
                                      ...baseStyles,
                                      borderColor: errors.tax_percentage_id
                                        ? "red"
                                        : baseStyles,
                                    }),
                                  }}
                                  {...field}
                                  options={taxPercentages}
                                />
                              )}
                            />
                            {errors.tax_percentage_id && (
                              <span className="text-danger">
                                {errors.tax_percentage_id.message}
                              </span>
                            )}
                          </Row>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-start">
                            {" "}
                            {/* Align to left */}
                            {/* Description */}
                            <Col sm={12}>
                              <Form.Label className="text-center">
                                about
                              </Form.Label>
                              <Form.Group>
                                <Controller
                                  name="about" // Provide the field name
                                  control={control} // Pass the control object from useForm()
                                  rules={{ required: "about is required" }} // Validation rules
                                  render={({ field }) => (
                                    <JoditEditor
                                      value={field.value}
                                      onChange={(newContent) =>
                                        field.onChange(newContent)
                                      }
                                      onBlur={field.onBlur}
                                      className={classNames("", {
                                        "is-invalid": !!errors.about,
                                      })}
                                      placeholder="about"
                                    />
                                  )}
                                />
                              </Form.Group>
                              {errors.about && (
                                <span className="text-danger">
                                  {errors.about.message}
                                </span>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-start">
                            {" "}
                            {/* Align to left */}
                            {/* Description */}
                            <Col sm={12}>
                              <Form.Label className="text-center">
                                benifits
                              </Form.Label>
                              <Form.Group>
                                <Controller
                                  name="benifits" // Provide the field name
                                  control={control} // Pass the control object from useForm()
                                  rules={{ required: "benifits is required" }} // Validation rules
                                  render={({ field }) => (
                                    <JoditEditor
                                      value={field.value}
                                      onChange={(newContent) =>
                                        field.onChange(newContent)
                                      }
                                      onBlur={field.onBlur}
                                      className={classNames("", {
                                        "is-invalid": !!errors.benifits,
                                      })}
                                      placeholder="benifits"
                                    />
                                  )}
                                />
                              </Form.Group>
                              {errors.benifits && (
                                <span className="text-danger">
                                  {errors.benifits.message}
                                </span>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="main-form-section mt-3">
                          <Row className="justify-content-start">
                            {" "}
                            {/* Align to left */}
                            {/* Description */}
                            <Col sm={12}>
                              <Form.Label className="text-center">
                                storage
                              </Form.Label>
                              <Form.Group>
                                <Controller
                                  name="storage" // Provide the field name
                                  control={control} // Pass the control object from useForm()
                                  rules={{ required: "storage is required" }} // Validation rules
                                  render={({ field }) => (
                                    <JoditEditor
                                      value={field.value}
                                      onChange={(newContent) =>
                                        field.onChange(newContent)
                                      }
                                      onBlur={field.onBlur}
                                      className={classNames("", {
                                        "is-invalid": !!errors.storage,
                                      })}
                                      placeholder="storage"
                                    />
                                  )}
                                />
                              </Form.Group>
                              {errors.storage && (
                                <span className="text-danger">
                                  {errors.storage.message}
                                </span>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      {/* images Preview */}
                      {/* <Col lg={12}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label column sm={3} className="text-center">
                            images Preview
                          </Form.Label>
                          <Col sm={9}>
                            {imagesFile && imagesFile?.length > 0 && (
                              <div className="images-preview-container">
                                <img
                                  src={URL.createObjectURL(imagesFile[0])}
                                  alt="Preview"
                                  className="images-preview"
                                  
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Col> */}

                      <div className="main-form-section mt-3"></div>
                      <Card.Title>
                        Product variants Details
                        {variantsError && (
                          <div className="text-danger">{variantsError}</div>
                        )}
                      </Card.Title>
                      <hr />

                      {fields.map((variant, index) => (
                        <div
                          key={variant.id}
                          className="main-form-section mt-3"
                        >
                          <Row>
                            <Col xl={3} md={6}>
                              <div className="main-form-section mt-3">
                                <Row className="justify-content-center">
                                  <Form.Label>Variant Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        name={`variants.${index}.v_name`} // Register color for the variant
                                        placeholder="Variant Name"
                                        className={classNames("", {
                                          "is-invalid":
                                            errors?.variants?.[index]?.v_name,
                                        })}
                                        {...register(
                                          `variants.${index}.v_name`,
                                          {
                                            required:
                                              "Variant name is required",
                                          }
                                        )}
                                      />
                                    </InputGroup>

                                    {errors?.variants?.[index]?.v_name && (
                                      <span className="text-danger">
                                        {errors.variants[index].v_name.message}
                                      </span>
                                    )}
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col xl={3} md={6}>
                              <div className="main-form-section mt-3">
                                <Row className="justify-content-center">
                                  <Form.Label>unit</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="number"
                                        name={`variants.${index}.unit`}
                                        placeholder="Unit"
                                        className={classNames("", {
                                          "is-invalid":
                                            errors?.variants?.[index]?.unit, // Updated error handling
                                        })}
                                        {...register(`variants.${index}.unit`, {
                                          required: "Unit is required",
                                        })}
                                      />
                                    </InputGroup>
                                    {errors?.variants?.[index]?.unit && (
                                      <span className="text-danger">
                                        {
                                          errors?.variants?.[index]?.unit
                                            .message
                                        }
                                      </span>
                                    )}
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            {/* MRP */}
                            <Col xl={3} md={6}>
                              <div className="main-form-section mt-3">
                                <Row className="justify-content-center">
                                  <Form.Label>mrp</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="number"
                                        name={`variants.${index}.mrp`}
                                        placeholder="mrp"
                                        className={classNames("", {
                                          "is-invalid":
                                            errors?.variants?.[index]?.mrp, // Updated error handling
                                        })}
                                        {...register(`variants.${index}.mrp`, {
                                          required: "MRP is required",
                                        })}
                                      />
                                    </InputGroup>
                                    {errors?.variants?.[index]?.mrp && (
                                      <span className="text-danger">
                                        {errors.variants[index].mrp.message}
                                      </span>
                                    )}
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            {/* SKU */}
                            <Col xl={3} md={6}>
                              <div className="main-form-section mt-3">
                                <Row className="justify-content-center">
                                  <Form.Label>sku</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        name={`variants.${index}.sku`}
                                        placeholder="sku"
                                        className={classNames("", {
                                          "is-invalid":
                                            errors?.variants?.[index]?.sku, // Updated error handling
                                        })}
                                        {...register(`variants.${index}.sku`, {
                                          required: "sku is required",
                                        })}
                                      />
                                    </InputGroup>
                                    {errors?.variants?.[index]?.sku && (
                                      <span className="text-danger">
                                        {errors.variants[index].sku.message}
                                      </span>
                                    )}
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            {/* Selling Prise */}
                            <Col xl={3} md={6}>
                              <div className="main-form-section mt-3">
                                <Row className="justify-content-center">
                                  <Form.Label>Selling Price</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="number"
                                        name={`variants.${index}.s_price`}
                                        placeholder="Selling Price"
                                        className={classNames("", {
                                          "is-invalid":
                                            errors?.variants?.[index]?.s_price, // Updated error handling
                                        })}
                                        {...register(
                                          `variants.${index}.s_price`,
                                          {
                                            required:
                                              "Selling Price is required",
                                            validate: validateSellingPrice,
                                          }
                                        )}
                                      />
                                    </InputGroup>
                                    {errors?.variants?.[index]?.s_price && (
                                      <span className="text-danger">
                                        {errors.variants[index].s_price.message}
                                      </span>
                                    )}
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="main-form-section mt-3">
                                <Form.Label>images</Form.Label>

                                <Form.Group>
                                  <Form.Control
                                    className={classNames("", {
                                      "is-invalid": errors?.image,
                                    })}
                                    type="file"
                                    multiple
                                    {...register(`variants.${index}.image`, {
                                      required: "images is required",
                                    })}
                                    id={`variantImages${index}`}
                                    accept="image/*"
                                  />
                                </Form.Group>
                                {errors.image && (
                                  <span className="text-danger">
                                    {errors.image.message}
                                  </span>
                                )}
                                {/* <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>Preview</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {imagesFile && imagesFile?.map((image, imageIndex) => (
                                    <tr key={imageIndex}>
                                      <td>
                                        <img
                                          src={URL.createObjectURL(image)}
                                          alt={`Image ${imageIndex + 1}`}
                                          
                                        />
                                      </td>
                                      <td>
                                        <Button
                                          variant="danger"
                                          onClick={() => deleteImage(index, imageIndex)} // Handle image deletion
                                          style={{ width: "100%", padding: "0.375rem 0.75rem" }}
                                        >
                                          <FontAwesomeIcon icon={["fas", "trash"]} />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>

                              </Table> */}
                              </div>
                            </Col>
                          </Row>
                          <button
                            className="mt-3 add-varient"
                            type="button"
                            onClick={() => remove(index)}
                          >
                            Remove Variant
                          </button>
                        </div>
                      ))}
                      <div className="main-form-section mt-3"></div>
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
                      <Row className="mt-5 pb-3">
                        <div className="d-flex justify-content-center">
                          <Link>
                            <CancelButton
                              name={"Cancel"}
                              handleClose={props.handleClose}
                            />
                          </Link>

                          <Button
                            name={"Save"}
                            onClick={handleSubmit(onSubmit)}
                            type="button"
                            className="save-btnnnnnn"
                          >
                            <FontAwesomeIcon
                              icon="fa-solid fa-floppy-disk"
                              className="me-2"
                            />
                            save
                          </Button>
                        </div>
                      </Row>
                    </Row>
                  </Form>
                </Container>
              </Card.Body>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <ModalSave
          message={showModal.message}
          showErrorModal={showModal.code ? true : false}
        />
      </div>
    </>
  );
};

export default AddOffCanvance;
