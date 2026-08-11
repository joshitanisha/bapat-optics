import { Controller, useFieldArray } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
// import ProductSection from "./ProductSection";
import { useEffect, useState } from "react";
import { getData } from "../../../utils/api";
import { Select2Data } from "../../../utils/common";

const VarientSection = ({
  product_id,
  weekIndex,
  control,
  register,
  getValues,
  errors,
  watch,
  setValue,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `quantitys.${weekIndex}.varients`,
  });

  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    const response = await getData("/common/masters/all-vendor-p-categories");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };
  const [days, setDays] = useState([]);
  const getAllDays = async () => {
    const response = await getData("/common/masters/all-days");
    if (response?.success) {
      setDays(await Select2Data(response?.data, "day_id"));
    }
  };
  useEffect(() => {
    getAllCategories();
    getAllDays();
  }, []);

  const [productVarient, setProductVarient] = useState([]);

  const Select2Data = async (data, name, other = false) => {
    const result = data?.map((data) => ({
      value: data?.id,
      label: data?.name,
      price: data?.price,
      name: name,
    }));

    if (other) {
      result.push({ value: "0", label: "Other", name: name });
    }
    return result;
  };
  const GetAllProductVarient = async (id) => {
    const response = await getData(
      `/common/masters/product-varient/${product_id?.value}`
    );

    if (response?.success) {
      setProductVarient(await Select2Data(response?.data, "varient_id"));
    }
  };

  useEffect(() => {
    GetAllProductVarient();
  }, []);

  //   useEffect(() => {
  //   const fetchAndAppendVariants = async () => {
  //     const response = await getData(
  //       `/common/masters/product-varient/${product_id?.value}`
  //     );

  //     if (response?.success) {
  //       const variants = await Select2Data(response?.data, "varient_id");
  //       setProductVarient(variants);

  //       // Clear existing fields and append one for each variant
  //       if (variants.length > 0) {
  //         // Remove existing if any
  //         while (productVarient.length) remove(0);

  //         variants.forEach((variant) => {
  //           append({
  //             varient_id: variant,
  //             receive_quantity: "",
  //           });
  //         });
  //       }
  //     }
  //   };

  //   fetchAndAppendVariants();
  // }, [product_id]);

  return (
    <>
      {fields.map((delivery, deliveryIndex) => (
        <div key={delivery.id} className="border p-3 mb-3">
          <Row>
            <h5>variant {deliveryIndex + 1}</h5>
            <Col md={4}>
              <Form.Group>
                <Form.Label>varient</Form.Label>
                <Controller
                  control={control}
                  name={`quantitys.${weekIndex}.varients.${deliveryIndex}.varient_id`}
                  render={({ field }) => (
                    <Select
                      isDisabled
                      {...field}
                      options={productVarient}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption.value);
                        setValue(
                          `quantitys.${weekIndex}.varients.${deliveryIndex}.varient_id`,
                          selectedOption
                        );
                        setValue(
                          `quantitys.${weekIndex}.varients.${deliveryIndex}.selling_price`,
                          selectedOption?.price || ""
                        );
                      }}
                    />
                  )}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Current Selling Price</Form.Label>
                <Form.Control
                  readOnly
                  type="text"
                  placeholder="Selling Price"
                  {...register(
                    `quantitys.${weekIndex}.varients.${deliveryIndex}.selling_price`,
                    {
                      required: "selling_price is required",
                      validate: (value) =>
                        value.length <= 200 ||
                        "Data must be 200 characters or less",
                    }
                  )}
                  // className={classNames({
                  //   "is-invalid":
                  //     errors?.quantitys?.[weekIndex]?.varients?.[deliveryIndex]
                  //       ?.receive_quantity,
                  // })}
                />
                {errors?.quantitys?.[weekIndex]?.varients?.[deliveryIndex]
                  ?.selling_price && (
                  <Form.Control.Feedback type="invalid">
                    {
                      errors.quantitys[weekIndex].varients[deliveryIndex]
                        .selling_price.message
                    }
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="General Stock"
                  {...register(
                    `quantitys.${weekIndex}.varients.${deliveryIndex}.general_stock`,
                    {
                      required: "General Stock is required",
                    }
                  )}
                  // className={classNames({
                  //   "is-invalid":
                  //     errors?.quantitys?.[weekIndex]?.varients?.[deliveryIndex]
                  //       ?.receive_quantity,
                  // })}
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (
                      allowedKeys.includes(e.key) ||
                      /^\d$/.test(e.key) || // Allow digits
                      (e.key === "." && !e.target.value.includes(".")) // Allow one dot
                    ) {
                      return;
                    }

                    e.preventDefault(); // Block other keys
                  }}
                />
                {errors?.quantitys?.[weekIndex]?.varients?.[deliveryIndex]
                  ?.general_stock && (
                  <Form.Control.Feedback type="invalid">
                    {
                      errors.quantitys[weekIndex].varients[deliveryIndex]
                        .general_stock.message
                    }
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {watch(
                `quantitys.${weekIndex}.varients.${deliveryIndex}.general_stock`
              ) > 0 &&
                Array.from(
                  {
                    length: parseInt(
                      watch(
                        `quantitys.${weekIndex}.varients.${deliveryIndex}.general_stock`
                      )
                    ),
                  },
                  (_, i) => (
                    <Form.Group className="mt-2" key={i}>
                      <Form.Label>Model No. {i + 1}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={`Enter Model No. ${i + 1}`}
                        {...register(
                          `quantitys.${weekIndex}.varients.${deliveryIndex}.models.${i}`,
                          { required: "Model No. is required" }
                        )}
                      />
                    </Form.Group>
                  )
                )}
            </Col>
            {/* <Col md={4}>
              <Form.Group>
                <Form.Label>Subscription Stock</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Subscription Stock"
                  {...register(
                    `quantitys.${weekIndex}.varients.${deliveryIndex}.subscription_stock`,
                    {
                      required: "General Stock is required",
                    }
                  )}
                  // className={classNames({
                  //   "is-invalid":
                  //     errors?.quantitys?.[weekIndex]?.varients?.[deliveryIndex]
                  //       ?.receive_quantity,
                  // })}
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (
                      allowedKeys.includes(e.key) ||
                      /^\d$/.test(e.key) || // Allow digits
                      (e.key === "." && !e.target.value.includes(".")) // Allow one dot
                    ) {
                      return;
                    }

                    e.preventDefault(); // Block other keys
                  }}
                />
                {errors?.quantitys?.[weekIndex]?.varients?.[deliveryIndex]
                  ?.subscription_stock && (
                  <Form.Control.Feedback type="invalid">
                    {
                      errors.quantitys[weekIndex].varients[deliveryIndex]
                        .subscription_stock.message
                    }
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col> */}
          </Row>

          {/* <button
            type="button"
            className="btn btn-danger mt-3"
            onClick={() => remove(deliveryIndex)}
          >
            Remove Variant
          </button> */}
        </div>
      ))}

      {/* <button
        type="button"
        className="btn btn-secondary"
        onClick={() => append({ products: [] })}
      >
        + Add Variant
      </button> */}
    </>
  );
};

export default VarientSection;
