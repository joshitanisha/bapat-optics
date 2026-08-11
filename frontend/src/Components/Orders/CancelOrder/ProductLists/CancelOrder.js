import React, { useEffect, useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Product.css";
import { Context } from "../../../../utils/context";
import { useForm } from "react-hook-form";
import { getData } from "../../../../utils/api";
import Summary from "../Summary/Summary";

function CancelOrder({ user_id, setSelectedOrder, selectedOrder }) {
  const { IMG_URL } = useContext(Context);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      invoice_no: "",
      order_details: null,
    },
  });

  const orderDetails = watch("order_details");
  const [OrderId, setOrderId] = useState(null);

  const getProductDetails = async () => {
    clearErrors();
    if (!user_id) {
      alert("Please Add User Details...!");
      return;
    }
    const invoice_no = watch("invoice_no");

    if (!invoice_no) {
      alert("Please enter invoice number");
      return;
    }

    const res = await getData(
      `/admin/offline-order/getInvoiceNoOrder/${user_id}?invoice_no=${invoice_no}`,
    );

    if (res.success) {
      await setValue("order_details", res.data);
      setOrderId(res.data?.id);
    } else {
      setError("order_details", {
        type: "manual",
        message: res.errors || "Order not found",
      });
      await setValue("order_details", null);
    }
  };

  const onSubmit = (data) => {
    console.log("Cancel Order Data =>", data);
  };
  useEffect(() => {
    if (selectedOrder) {
      setValue("invoice_no", selectedOrder?.invoice_no);
      getProductDetails();
    }
  }, [selectedOrder]);


  return (
    <>
      <Row>
        <Col md={8}>
          <section className="product-container">
            <h4 className="product-title">Cancel Order</h4>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="product-input-wrapper p-4 shadow rounded bg-white position-relative">
                {/* Invoice Input */}
                <Row className="align-items-start g-3 mb-4">
                  <Col md={8}>
                    <Form.Group>
                      <div className="input-icon d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faArchive}
                          className="icon me-2"
                        />
                        <Form.Control
                          type="text"
                          placeholder="Enter Invoice No. "
                          {...register("invoice_no")}
                          className="user-input"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button variant="dark" onClick={getProductDetails}>
                      Fetch Order
                    </Button>
                  </Col>
                </Row>

                {/* Order Details Section */}
                {orderDetails?.Product_Order_Details?.map((val, pIndex) => (
                  <Col className="col-lg-12 col-md-6 col-6 mb-4" key={pIndex}>
                    <div className="product-details-card shadow-sm p-3 rounded bg-white ">
                      <div className="me-3 d-flex align-items-start">
                        <Form.Check
                          type="checkbox"
                          {...register(
                            `order_details.Product_Order_Details.${pIndex}.is_selected`,
                          )}
                        />
                      </div>

                      <div className="product-image-container  text-center">
                        <img
                          src={IMG_URL + val?.Product?.image}
                          alt="Product"
                          className="product-image"
                        />
                      </div>

                      <div className="product-info ">
                        <p className="variant-name mb-1">
                          {val?.Product?.p_category?.name}
                        </p>
                        <h5 className="product-name mb-2">
                          {val?.Product?.name}
                        </h5>
                        <p className="product-price mb-1">
                          <strong>Sub Total:</strong> ₹{" "}
                          {val?.total_selling_price}
                        </p>
                        <p className="product-price mb-1">
                          <strong>AddOn Price:</strong> ₹{" "}
                          {val?.total_addon_price}
                        </p>
                        <p className="product-price mb-1">
                          <strong>Shipping Charges:</strong> ₹{" "}
                          {val?.delivery_charges}
                        </p>
                        <p className="product-price mb-1">
                          <strong>Coupon Discount:</strong> ₹{" "}
                          {val?.coupon_discount}
                        </p>
                        <p className="product-price mb-1">
                          <strong>Reward Discount:</strong> ₹{" "}
                          {val?.reward_discount}
                        </p>
                        <p className="product-price mb-1">
                          <strong>Offer Discount:</strong> ₹{" "}
                          {val?.offer_discount}
                        </p>
                        <p className="product-price mb-1">
                          <strong>Total Tax:</strong> ₹ {val?.total_tax}
                        </p>
                        <p className="product-price mb-1">
                          <strong>Total Amount:</strong> ₹ {val?.total_amount}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}

                {errors?.order_details && (
                  <span className="text-danger">
                    {errors.order_details.message}
                  </span>
                )}

                {/* Action Buttons */}
                {orderDetails && (
                  <Button
                    variant="danger"
                    type="button" // use button so it doesn't submit the form
                    className="mt-3"
                    onClick={() => {
                      setValue("order_details", "");
                      setValue("invoice_no", "");
                    }} // wrap in arrow function
                  >
                    Cancel Selected Products
                  </Button>
                )}
              </div>
            </Form>
          </section>
        </Col>

        {/* Summary Section */}
        <Col md={4}>
          <Summary
            OrderId={OrderId}
            user_id={user_id}
            getValues={getValues}
            watch={watch}
            setValue={setValue}
          />
        </Col>
      </Row>
    </>
  );
}

export default CancelOrder;

//for multiple order  one time

// import React, { useEffect, useContext, useState } from "react";
// import { Button, Form, Row, Col } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArchive,
//   faBarcode,
//   faCube,
//   faPlus,
//   faTrash,
// } from "@fortawesome/free-solid-svg-icons";
// import "./Product.css";
// import { Context } from "../../../../utils/context";
// import { useLocation } from "react-router-dom";
// import { useFieldArray, useForm } from "react-hook-form";
// import { getData } from "../../../../utils/api";
// import Summary from "../Summary/Summary";
// import LensModal from "../LensModal/LensModal";
// import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
// import { Category, Select2Data } from "../../../../utils/common";

// function CancelOrder({ user_id }) {
//   const { toggleSidebarFalse, IMG_URL } = useContext(Context);

//   const [lensModalShow, setLensModalShow] = useState(false);
//   const [lensIndex, setLensIndex] = useState("");

//   const {
//     control,
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     getValues,
//     formState: { errors },
//     setError,
//   } = useForm({
//     defaultValues: {
//       orders: [
//         { barcode_no: "", model: "", order_details: "" },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "orders",
//   });

//   const onSubmit = (data) => {
//     console.log("Product Search Input:", data);
//   };

//   const getProductDetails = async (index, user_id) => {
//     const invoice_no = watch(`orders.${index}.invoice_no`);
//     if (user_id === null) {
//       alert("check User");
//     }

//     const res = await getData(
//       `/admin/offline-order/getInvoiceNoOrder/${user_id}?invoice_no=${
//         invoice_no || ""
//       }`
//     );

//     if (res.success) {
//       await setValue(`orders.${index}.order_details`, res.data);
//     } else {
//       setError(`orders.${index}.order_details`, {
//         type: "manual",
//         message: res.errors,
//       });
//       // await setValue(`orders.${index}.order_details`, res?.errors);
//     }
//   };

//   const handleAddLens = async (index) => {
//     await setLensModalShow(true);
//     await setLensIndex(index);
//   };

//   const [categories, setCategories] = useState([]);

//   const getAllCategories = async () => {
//     const response = await getData("/common/masters/all-p-category?admin=true");
//     if (response?.success) {
//       setCategories(await Select2Data(response.data, "p_category_id"));
//     }
//   };

//   useEffect(() => {
//     getAllCategories();
//   }, []);

//   useEffect(() => {
//     const subscription = watch((value, { name }) => {
//       if (name && name.includes("orders") && name.endsWith("invoice_no")) {
//         const match = name.match(/orders\.(\d+)\./);
//         if (match) {
//           const index = parseInt(match[1], 10);
//           getProductDetails(index, user_id);
//         }
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [watch, user_id]);

//   return (
//     <>
//       <Row>
//         <Col md={8}>
//           <section className="product-container">
//             <h4 className="product-title">Orders</h4>

//             <Form onSubmit={handleSubmit(onSubmit)}>
//               {fields.map((item, index) => (
//                 <Row key={index} className="mb-4">
//                   <Col md={12}>
//                     <div className="product-input-wrapper p-4 shadow rounded bg-white position-relative">
//                       {/* Search Inputs */}
//                       <Row className="align-items-start g-3 mb-4">
//                         <Col md={8}>
//                           <Form.Group>
//                             <div className="input-icon d-flex align-items-center">
//                               <FontAwesomeIcon
//                                 icon={faArchive}
//                                 className="icon me-2"
//                               />
//                               <Form.Control
//                                 type="text"
//                                 placeholder="Invoice No. "
//                                 {...register(`orders.${index}.invoice_no`)}
//                                 className="user-input"
//                               />
//                             </div>
//                           </Form.Group>
//                         </Col>
//                       </Row>

//                       {/* Product Details */}
//                       {watch(
//                         `orders.${index}.order_details`
//                       )?.Product_Order_Details?.map((val, pIndex) => (
//                         <Col
//                           className="col-lg-12 col-md-6 col-6 mb-4"
//                           key={pIndex}
//                         >
//                           <div className="product-details-card shadow-sm p-3 rounded bg-white d-flex flex-md-row flex-column ">
//                             <div className="me-3 d-flex align-items-start">
//                               <Form.Check
//                                 type="checkbox"
//                                 {...register(
//                                   `orders.${index}.order_details.Product_Order_Details.${pIndex}.is_selected`
//                                 )}
//                               />
//                             </div>

//                             <div className="product-image-container  text-center">
//                               <img
//                                 src={IMG_URL + val?.Product?.image}
//                                 alt="Product"
//                                 className="product-image"
//                               />
//                             </div>

//                             <div className="product-info ">
//                               <p className="variant-name mb-1">
//                                 {val?.Product?.p_category?.name}
//                               </p>
//                               <h5 className="product-name mb-2">
//                                 {val?.Product?.name}
//                               </h5>
//                               <p className="product-price mb-1">
//                                 <strong>Sub Total:</strong> ₹{" "}
//                                 {val?.total_selling_price}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>AddOn Price:</strong> ₹{" "}
//                                 {val?.total_addon_price}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>Shipping Charges:</strong> ₹{" "}
//                                 {val?.delivery_charges}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>Coupon Discount:</strong> ₹{" "}
//                                 {val?.coupon_discount}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>Reward Discount:</strong> ₹{" "}
//                                 {val?.reward_discount}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>Offer Discount:</strong> ₹{" "}
//                                 {val?.total_offer_discount}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>Total Tax:</strong> ₹ {val?.total_tax}
//                               </p>
//                               <p className="product-price mb-1">
//                                 <strong>Total Amount:</strong> ₹{" "}
//                                 {val?.total_amount}
//                               </p>
//                             </div>
//                           </div>
//                         </Col>
//                       ))}

//                       {errors?.orders?.[index]?.order_details && (
//                         <span className="text-danger">
//                           {errors.orders[index].order_details.message}
//                         </span>
//                       )}

//                       {/* Action Buttons */}
//                       {index === fields.length - 1 ? (
//                         <Button
//                           variant="dark"
//                           className="add-btn-floating"
//                           onClick={() =>
//                             append({
//                               barcode_no: "",
//                               model: "",
//                               order_details: "",
//                             })
//                           }
//                         >
//                           <FontAwesomeIcon icon={faPlus} className="me-2" />
//                           Add Order
//                         </Button>
//                       ) : (
//                         <Button
//                           variant="danger"
//                           className="add-btn-floating"
//                           onClick={() => remove(index)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} className="me-2" />
//                           Remove
//                         </Button>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>
//               ))}
//             </Form>
//           </section>
//         </Col>
//         <Col md={4}>
//           <Summary
//             user_id={user_id}
//             getValues={getValues}
//             watch={watch}
//             setValue={setValue}
//           />
//         </Col>
//       </Row>

//     </>
//   );
// }

// export default CancelOrder;
