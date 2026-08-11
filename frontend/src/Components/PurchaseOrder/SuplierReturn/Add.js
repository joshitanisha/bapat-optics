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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import { SelectImageData } from "../../../utils/common";
import { useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);

  const [product, setProduct] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const Select4Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: data?.name,
      name: name,
      category_id: data.p_category_id,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
  const GetAllProduct = async (p_category_id, index) => {
    const response = await getData(`/common/masters/stock-available-product`);

    if (response?.success) {
      await setProduct(await Select4Data(response.data, "product_id"));
    }
  };

  const [stock, setStock] = useState([]);

  const Select3Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: `${data?.barcode_no}-${data?.model}`,
      name: name,
      supplier_id: data.supplier_id,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
  const GetAllStock = async (id) => {
    const response = await getData(
      `/common/masters/stock-available-sale/${id}`,
    );

    if (response?.success) {
      await setStock(await Select3Data(response.data, "stock_id"));
    }
  };
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    const response = await getData("/common/masters/all-p-category?admin=true");
    if (response?.success) {
      setCategories(await Select2Data(response.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
    getValues,
  } = useForm();

  const watchQuantitys = watch("quantitys"); // watches the entire array

  const [CancellationPolicyError, setCancellationPolicyError] = useState("");
  useEffect(() => {
    register("quantitys", {
      validate: (value) => {
        const isValid = value && value.length > 0;
        setCancellationPolicyError(
          isValid ? "" : "At least one Purchase Quantity is required",
        );
        return isValid;
      },
    });
  }, [register]);
  const totalQuantity =
    watchQuantitys?.reduce((sum, item) => {
      const qty = parseFloat(item?.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

  const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();

      const variants = [];
      data.quantitys.forEach((val, index) => {
        variants.push({
          product_id: val?.product_id?.value,
          supplier_id: val?.supplier_id?.value,
          stock_id: val?.stock_id?.value,
          description: val.description,
        });
      });

      DataToSend.append("quantitys", JSON.stringify(variants));

      const response = await withLoader(() =>
        postData(`/admin/purchase-order/supplier-return`, DataToSend),
      );

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quantitys",
  });

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

  console.log(product, "product product");

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
            Add Supplier Return
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
            // className="stateclass"
          >
            <Row>
              {/* <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Supplier</Form.Label>

                    <Controller
                      name="supplier_id" // name of the field
                      {...register("supplier_id", {
                        required: "Select City",
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
              </Col> */}
              <div className="oder-detail-holder mb-3">
                <div className="heading-holder mt-3">
                  <h6> Product Return</h6>
                </div>

                {fields.map((variant, index) => (
                  <div className="package-details-section">
                    <div key={variant.id} className="main-form-section">
                      <Row>
                        {/* <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Category</Form.Label>
                              <Form.Group>
                                <Controller
                                  name={`quantitys.${index}.p_category_id`} // name of the field
                                  {...register(
                                    `quantitys.${index}.p_category_id`,
                                    {
                                      required: "Select Category",
                                    }
                                  )}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      styles={{
                                        control: (baseStyles) => ({
                                          ...baseStyles,
                                          borderColor: errors?.quantitys?.[index]?.p_category_id
                                            ?.p_category_id
                                            ? "red"
                                            : baseStyles,
                                        }),
                                      }}
                                      {...field}
                                      options={categories}
                                      onChange={(selectedOption) => {
                                        field.onChange(selectedOption); // Update Controller's value
                                        setValue(`quantitys.${index}.product_id`, null);
                                        GetAllProduct(selectedOption.value, index);
                                      }}


                                    />
                                  )}
                                />

                              </Form.Group>
                            </Row>
                          </div>
                        </Col> */}
                        <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Product</Form.Label>
                              <Form.Group>
                                <Controller
                                  name={`quantitys.${index}.product_id`} // name of the field
                                  {...register(
                                    `quantitys.${index}.product_id`,
                                    {
                                      required: "Select Product",
                                    },
                                  )}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      placeholder="Select Product"
                                      styles={{
                                        control: (baseStyles) => ({
                                          ...baseStyles,
                                          borderColor: errors?.quantitys?.[
                                            index
                                          ]?.product_id?.product_id
                                            ? "red"
                                            : baseStyles,
                                        }),
                                      }}
                                      {...field}
                                      options={product}
                                      onChange={(selectedOption) => {
                                        field.onChange(selectedOption);
                                        setValue(
                                          `quantitys.${index}.stock_id`,
                                          null,
                                        );
                                        setValue(
                                          `quantitys.${index}.supplier_id`,
                                          null,
                                        );
                                        GetAllStock(selectedOption.value);
                                      }}
                                    />
                                  )}
                                />
                                {errors?.quantitys?.[index]?.product_id && (
                                  <span className="text-danger">
                                    {errors.quantitys[index].product_id.message}
                                  </span>
                                )}
                              </Form.Group>
                            </Row>
                          </div>
                        </Col>

                        {[2, 5].includes(
                          Number(
                            watch(`quantitys.${index}.product_id`)?.category_id,
                          ),
                        ) && (
                          <Col md={4}>
                            <div className="main-form-section mt-3">
                              <Row className="justify-content-center">
                                <Form.Label>Stock</Form.Label>
                                <Form.Group>
                                  <Controller
                                    name={`quantitys.${index}.stock_id`}
                                    control={control}
                                    rules={{ required: "Select Product" }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        styles={{
                                          control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderColor: errors?.quantitys?.[
                                              index
                                            ]?.stock_id
                                              ? "red"
                                              : baseStyles.borderColor,
                                          }),
                                        }}
                                        options={stock}
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption);

                                          // Set supplier if available
                                          if (selectedOption?.supplier_id) {
                                            const selectedSupplier =
                                              supplier.find(
                                                (s) =>
                                                  s.value ===
                                                  selectedOption.supplier_id,
                                              );
                                            setValue(
                                              `quantitys.${index}.supplier_id`,
                                              selectedSupplier || null,
                                            );
                                            // Make supplier read-only when stock has supplier_id
                                            setValue(
                                              `quantitys.${index}.supplier_readonly`,
                                              true,
                                            );
                                          } else {
                                            // Enable supplier select if no supplier_id from stock
                                            setValue(
                                              `quantitys.${index}.supplier_id`,
                                              null,
                                            );
                                            setValue(
                                              `quantitys.${index}.supplier_readonly`,
                                              false,
                                            );
                                          }
                                        }}
                                      />
                                    )}
                                  />
                                  {errors?.quantitys?.[index]?.stock_id && (
                                    <span className="text-danger">
                                      {errors.quantitys[index].stock_id.message}
                                    </span>
                                  )}
                                </Form.Group>
                              </Row>
                            </div>
                          </Col>
                        )}

                        <Col md={4}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Supplier</Form.Label>
                              <Form.Group>
                                <Controller
                                  name={`quantitys.${index}.supplier_id`}
                                  control={control}
                                  rules={{ required: "Select Supplier" }}
                                  render={({ field }) => {
                                    const supplierReadonly = watch(
                                      `quantitys.${index}.supplier_readonly`,
                                    );

                                    return (
                                      <Select
                                        {...field}
                                        // isDisabled={supplierReadonly} // make readonly when stock has supplier
                                        // styles={{
                                        //   control: (baseStyles) => ({
                                        //     ...baseStyles,
                                        //     borderColor: errors?.quantitys?.[
                                        //       index
                                        //     ]?.supplier_id
                                        //       ? "red"
                                        //       : baseStyles.borderColor,
                                        //     backgroundColor: supplierReadonly
                                        //       ? "#f5f5f5"
                                        //       : baseStyles.backgroundColor,
                                        //   }),
                                        // }}
                                        options={supplier}
                                      />
                                    );
                                  }}
                                />
                                {errors?.quantitys?.[index]?.supplier_id && (
                                  <span className="text-danger">
                                    {
                                      errors.quantitys[index].supplier_id
                                        .message
                                    }
                                  </span>
                                )}
                              </Form.Group>
                            </Row>
                          </div>
                        </Col>

                        <Col md={12}>
                          <div className="main-form-section mt-3">
                            <Row className="justify-content-center">
                              <Form.Label>Description</Form.Label>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  name={`quantitys.${index}.description`}
                                  placeholder="Description"
                                  className={classNames("", {
                                    "is-invalid":
                                      errors?.quantitys?.[index]?.description,
                                  })}
                                  {...register(
                                    `quantitys.${index}.description`,
                                    {
                                      required: "Description is required",
                                      validate: (value) =>
                                        value.length <= 200 ||
                                        "Data must be 200 characters or less",
                                    },
                                  )}
                                />
                                {errors?.quantitys?.[index]?.description && (
                                  <span className="text-danger">
                                    {
                                      errors.quantitys[index].description
                                        .message
                                    }
                                  </span>
                                )}
                              </Form.Group>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      {fields.length > 0 && (
                        <button
                          className="mt-3 add-varient"
                          type="button"
                          onClick={() => remove(index)} // Remove the variant
                        >
                          Remove Product
                        </button>
                      )}
                      <hr />
                    </div>
                  </div>
                ))}
                {CancellationPolicyError && (
                  <div className="text-danger">{CancellationPolicyError}</div>
                )}

                <hr />
                <div className="text-center">
                  <button
                    type="button"
                    className="add-varient"
                    onClick={() => append({})}
                  >
                    + Add Product
                  </button>
                </div>
              </div>

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
