import React, { useEffect, useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Product.css";
import { Context } from "../../../../utils/context";
import { useForm } from "react-hook-form";
import { getData } from "../../../../utils/api";
import Summary from "../Summary/Summary";
import SendSupplier from "../Summary/SendSupplier";

function CancelOrder({ user_id, selectedOrder }) {
  const { IMG_URL } = useContext(Context);

  const [sendSupplier, setSendSupplier] = useState(false);

  const [sendProduct, setSendProduct] = useState(false);
  const [sendSupplierDone, setSendSupplierdone] = useState(false);
  const [sentProducts, setSentProducts] = useState([]);
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
  // Fetch order details based on invoice number
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
      `/admin/offline-order/return-getInvoiceNoOrder/${user_id}?invoice_no=${invoice_no}`,
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

  const handleCloseSendSupplier = () => setSendSupplier(false);
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
            <h4 className="product-title">Return Order</h4>

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
                          <strong>Lense Price:</strong> ₹{" "}
                          {val?.total_lense_price}
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

                    <div className="text-end mt-3">
                      {sentProducts?.includes(val.id) ? (
                        <div className="text-success text-center mt-3">
                          ✅ Mail sent to supplier successfully
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSendSupplier(true);
                            setSendProduct(val);
                          }}
                          disabled={
                            !orderDetails?.Product_Order_Details?.some(
                              (x) => x.is_selected,
                            )
                          }
                        >
                          Send to Supplier
                        </Button>
                      )}
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

      <SendSupplier
        setSentProducts={setSentProducts}
        sendSupplierDone={sendSupplierDone}
        setSendSupplierdone={setSendSupplierdone}
        sendProduct={sendProduct}
        // SelectedOrder={SelectedOrder}
        show={sendSupplier}
        handleClose={() => handleCloseSendSupplier()}
      />
    </>
  );
}

export default CancelOrder;
