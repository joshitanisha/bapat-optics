import React, { useEffect, useContext, useState } from "react";
import { Button, Form, Row, Col, Card, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode,
  faCube,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./Summary.css";
import { Context } from "../../../../utils/context";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getData, postData } from "../../../../utils/api";
import OrderPlacedModal from "../OrderPlacedModal";
import ErrorModal from "../ErrorModal";
import GST_modal from "../../../common/gst_modal/GST_modal";
import Green_Btn from "../../../common/green_btn/Green_Btn";
import { ClipLoader } from "react-spinners";
import { Code } from "lucide-react";
import View_All_Coupon_Code from "./view_All_Coupon_Code/View_All_Coupon_Code";

function Summary({
  prescription,
  user_id,
  setValue,
  watch,
  getValues,
  setOrderSummaryData,
  hoveredProduct,
}) {
  console.log("Hovered Product:", hoveredProduct);
  const [paymentMethod, setPaymentMethod] = useState("1"); // default
  const [rewardData, setRewardData] = useState(false);
  const { toggleSidebar, IMG_URL } = useContext(Context);

  const [orderSummary, setOrderSummary] = useState();
  const [orderDetailsSummary, setOrderDetailsSummary] = useState();
  const [GSTNumber, setGSTNumber] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShowCoupon, setModalShowCoupon] = React.useState(false);
  const [CouponCode, setCouponCode] = useState("");
  const [Code, setCode] = useState("");
  const [CouponError, setCouponError] = useState("");
  const [Message, setMessage] = useState("");
  const [CouponApply, setCouponApply] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessReward, setShowSuccessReward] = useState(false);

  const [rewardStatus, setRewardStatus] = useState(false);
  const [couponStatus, setCouponStatus] = useState(false);
  const calculateOrder = async (arr) => {
    // if (!user_id) {
    //   alert("Please Add User Details...!");
    //   return false;
    // }
    const res = await postData(`/admin/orders/calculate`, {
      products: arr,
      reward_status: rewardData,
      code: CouponCode,
      user_id,
    });

    if (res?.success) {
  const summary = res?.data?.order_summary;

await setOrderSummary(summary);
setOrderSummaryData?.(summary);
      await setOrderDetailsSummary(res?.data?.order_Details_summary);
      console.log("Order Details Summary:", res.data.order_Details_summary);
      await setCouponError(res?.data?.order_summary?.message);
      if (
        res?.data?.order_summary?.coupon_applied &&
        CouponCode &&
        couponStatus
      ) {
        setMessage("Coupon applied successfully.");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCouponStatus(false);
        }, 2000);
      } else if (
        res?.data?.order_summary?.reward_status &&
        rewardData &&
        rewardStatus
      ) {
        setMessage("Reward applied successfully.");
        setShowSuccessReward(true);
        setTimeout(() => {
          setShowSuccessReward(false);
          setRewardStatus(false);
        }, 2000);
      } else if (CouponCode) {
        setCouponCode("");
        setCode("");
        setCouponApply(false);
        setMessage(res?.data?.order_summary?.message);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      }
    }
  };

  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const [advancePayment, setAdvancePayment] = useState(0);
  const [DoctorName, setDoctorName] = useState("");

  const [loader, setLoder] = useState(false);

  const [orderId, setOrderId] = useState(null);

  const createOrder = async () => {
    setLoder(true);
    if (!paymentMethod) {
      alert("Please Select Payment Method...!");
      return false;
    }
    if (!user_id) {
      alert("Please Add User Details...!");
      return false;
    }

    if (orderDetailsSummary?.length <= 0) {
      alert("Product Required...!");
      return false;
    }
    const finalData = new FormData();
    finalData.append("order_summary", JSON.stringify(orderSummary));
    finalData.append(
      "order_Details_summary",
      JSON.stringify(orderDetailsSummary),
    );
    finalData.append("payment_method_id", paymentMethod);
    finalData.append("user_id", user_id);

    finalData.append("advance_amount", advancePayment);
    finalData.append("gst_number", GSTNumber);

    finalData.append("doctor_name", DoctorName);

    const res = await postData(`/admin/orders`, finalData);

    if (res?.success) {
      console.log("Res", res);
      setOrderId(res?.data?.id);
      setMessage("Order Placed Successfully!");
      setShowSuccess(true);
      setShowModal(true);
      setLoder(false);
      setTimeout(() => {
        setMessage("");
        setShowModal(false);
        // setShowSuccess(false);
        // toggleSidebar();
        // navigate("/orders/all-orders");
      }, 3000);
    } else {
      setLoder(false);
      setMessage(res?.errors);
      await setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };


  const downloadInvoice = async (order_id, isAdvance = false) => {
    setLoder(order_id);
    try {
      console.log("isAdvance",isAdvance);
      const response = await postData("/common/masters/invoice-genarate", {
        order_id,
        isAdvance // <--- Pass it to the backend
      });

      if (!response?.data) {
        alert("Invoice not found");
        return;
      }

      if (response?.success) {
        console.log("1", response?.success);
        const fileUrl = `${IMG_URL}${response.data}`;
        console.log("fileUrl", fileUrl);
        // 2️⃣ Fetch PDF silently (URL not visible to user)
        const fileResponse = await fetch(fileUrl);
        console.log("fileResponse", fileResponse);
        const blob = await fileResponse.blob();
        console.log("2", blob.type);
        if (blob.type !== "application/pdf") {
          alert("Invalid invoice file");
          return;
        }

        // 3️⃣ Download file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice_${order_id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setLoder(false);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download invoice");
    }
  };

  const printAdvanceReceipt = () => {
    console.log("Triggering Advance Receipt Download...");
    // window.open(`/orders/advance-receipt/${orderId}`, "_blank");
  };

  const printTaxInvoice = () => {
    console.log("Triggering Tax Invoice Download...");
    // window.open(`/orders/tax-invoice/${orderId}`, "_blank");
  };

  useEffect(() => {
    const subscription = watch((values) => {
      if (values.products && Array.isArray(values.products)) {
        const arr = values.products
          .filter(
            (p) => p?.product_details && p?.product_details?.id,
            // &&
            // p?.product_details?.Stock?.barcode_no
          )
          .map((p) => ({
            product_id: p.product_details.id,
            category_id: p.product_details.p_category_id,
            brand_id: p.product_details.brand_id,
            prescription_id:
              p.product_details.prescription_details?.prescription?.id,
            addon_id: p.product_details.addon_details?.id,
            lense_id: p.product_details.lens_details?.id,
            lense_category_id: p.product_details.lens_details?.p_category_id,
            lense_brand_id: p?.product_details.lens_details?.brand_id,
            stock_lense_id: p.product_details.lens_details?.Stock?.id,
            barcode_no: p?.product_details?.Stock?.barcode_no,
            quantity: 1,
          }));

        calculateOrder(arr);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const values = getValues(); // from react-hook-form
    if (values.products && Array.isArray(values.products)) {
      const arr = values.products
        .filter(
          (p) =>
            p?.product_details &&
            p?.product_details?.id &&
            p?.product_details?.Stock?.barcode_no,
        )
        .map((p) => ({
          product_id: p.product_details.id,
          category_id: p.product_details.p_category_id,
          brand_id: p.product_details.brand_id,
          prescription_id:
            p.product_details.prescription_details?.prescription?.id,
          addon_id: p.product_details.addon_details?.id,
          lense_id: p.product_details.lens_details?.id,
          stock_lense_id: p.product_details.lens_details?.Stock?.id,
          barcode_no: p?.product_details?.Stock?.barcode_no,
          quantity: 1,
        }));

      calculateOrder(arr);
    }
  }, [rewardData, CouponApply]);

  // useEffect(() => {
  //   const subscription = watch((values) => {
  //     if (values.products && Array.isArray(values.products)) {
  //       const arr = values.products
  //         .filter((p) => p?.product_details && p?.product_details?.id)
  //         .map((p) => {
  //           if (p.product_details.p_category_id === Category.Lenses) {
  //             return {
  //               prescription_id:
  //                 p.product_details.prescription_details?.prescription?.id,
  //               addon_id: p.product_details.addon_details?.id,
  //               lense_id: p.product_details.id,
  //               lense_category_id: p.product_details.p_category_id,
  //               lense_brand_id: p.product_details.brand_id,
  //               stock_lense_id: p.product_details.lens_details?.Stock?.id,
  //               barcode_no: p?.product_details?.Stock?.barcode_no,
  //               quantity: 1,
  //             };
  //           } else {
  //             return {
  //               product_id: p.product_details.id,
  //               category_id: p.product_details.p_category_id,
  //               brand_id: p.product_details.brand_id,
  //               prescription_id:
  //                 p.product_details.prescription_details?.prescription?.id,
  //               addon_id: p.product_details.addon_details?.id,
  //               lense_id: p.product_details.lens_details?.id,
  //               lense_category_id:
  //                 p.product_details.lens_details?.p_category_id,
  //               lense_brand_id: p?.product_details.lens_details?.brand_id,
  //               stock_lense_id: p.product_details.lens_details?.Stock?.id,
  //               barcode_no: p?.product_details?.Stock?.barcode_no,
  //               quantity: 1,
  //             };
  //           }
  //         });

  //       calculateOrder(arr);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch]);
  const [userWallet, setUserWallet] = useState(false);

  const userWalletdata = async (arr) => {
    const res = await getData(`/admin/wallet/${user_id}`);
    setUserWallet(res);
  };

  useEffect(() => {
    userWalletdata();
  }, [user_id]);

  useEffect(() => {
    setAdvancePayment(orderSummary?.total_amount);
  }, [orderSummary?.total_amount]);

  const grandTotal = Number(orderSummary?.total_amount || 0);
  const remainingAmount = Math.max(grandTotal - Number(advancePayment || 0), 0);
  const handleApplyCoupon = (code) => {
    setCode(code);
    setCouponCode(code);
    if (!code.trim()) {
      setCouponError("Coupon code is required");
      return;
    }
    setModalShowCoupon(false);
    setCouponStatus(true);
    setCouponError("");
    setCouponApply(true);
  };
  return (
    <>
      <section className="summary-container">
        <h4 className="summary-title">Summary</h4>
        <Row>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                {hoveredProduct ? (
                  <>
                    <img
                      src={
                        IMG_URL +
                        (
                          hoveredProduct.product_image ||
                          hoveredProduct.image ||
                          hoveredProduct.image_url ||
                          ""
                        )
                      }
                      alt={hoveredProduct.product_name}
                      style={{
                        width: "220px",
                        height: "220px",
                        objectFit: "contain",
                      }}
                    />
                    <h5 className="mt-3">{hoveredProduct.product_name}</h5>
                  </>
                ) : (
                  <div
                    style={{
                      height: 250,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#888",
                    }}
                  >
                    No Product Selected
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Card className="summary-card shadow-sm p-0">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    {hoveredProduct && (
                      <div className="text-center mb-4">
                        <img
                          src={
                            IMG_URL +
                            (
                              hoveredProduct.product_image ||
                              hoveredProduct.image ||
                              hoveredProduct.image_url ||
                              ""
                            )
                          }
                          alt={hoveredProduct.product_name}
                          style={{
                            width: "180px",
                            height: "180px",
                            objectFit: "contain",
                          }}
                        />
                        <h5 className="mt-2">{hoveredProduct.product_name}</h5>
                      </div>
                    )}
                  </Col>

                  <Col md={8}>
                    <h4 className="summary-title">Summary</h4>
                    <Card className="summary-card shadow-sm p-0">
                      <Card.Body>
                        <Row className="summary-row">
                          <Col>Product Discounted Price</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_selling_price).toFixed(2)}
                          </Col>
                        </Row>
                        <Row className="summary-row">
                          <Col>Product Discount</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_discount).toFixed(2)}
                          </Col>
                        </Row>
                        <Row className="summary-row">
                          <Col>Lens MRP</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_lense_mrp).toFixed(2)}
                          </Col>
                        </Row>
                        <Row className="summary-row">
                          <Col>Lens Discount</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_lense_discount).toFixed(2)}
                          </Col>
                        </Row>
                        {/* <Row className="summary-row">
                          <Col>Addon Price</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_addon_price).toFixed(2)}
                          </Col>
                        </Row> */}

                        <Row className="summary-row">
                          <Col>Product Tax</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_tax).toFixed(2)}
                          </Col>
                        </Row>
                        <Row className="summary-row">
                          <Col>Lens Tax</Col>
                          <Col className="text-end">
                            ₹ {Number(orderSummary?.total_lense_tax).toFixed(2)}
                          </Col>
                        </Row>

                        <Row className="summary-row">
                          <Col>Coupon Discount</Col>
                          <Col className="text-end text-danger">
                            - ₹ {Number(orderSummary?.total_coupon_discount).toFixed(2)}
                          </Col>
                        </Row>

                        <Row className="summary-row">
                          <Col>Offer Discount</Col>
                          <Col className="text-end text-danger">
                            - ₹ {Number(orderSummary?.total_offer_discount).toFixed(2)}
                          </Col>
                        </Row>

                        <Row className="summary-row">
                          <Col>Reward Discount</Col>
                          <Col className="text-end text-danger">
                            - ₹ {Number(orderSummary?.reward_discount).toFixed(2)}
                          </Col>
                        </Row>

                        <Row className="summary-row">
                          <Col>Shipping</Col>
                          <Col className="text-end text-danger">
                            ₹ {Number(orderSummary?.total_delivery_charges).toFixed(2)}
                          </Col>
                        </Row>

                        <Row className="summary-row">
                          <Col>
                            Reward Points
                            <br />
                            <span style={{ color: "orange" }}>
                              ({Number(userWallet?.data?.amount).toFixed(2) || 0}{" "}
                              {rewardData ? "Used" : "available"})
                            </span>
                            <Badge
                              bg={rewardData ? "danger" : "secondary"}
                              onClick={() => {
                                setRewardData(!rewardData);
                                setRewardStatus(true);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {rewardData ? "Remove" : "Apply"}
                            </Badge>
                          </Col>

                          <Col className="text-end text-danger">
                            ₹ {Number(orderSummary?.reward_discount).toFixed(2)}
                          </Col>
                        </Row>

                        <hr />

                        <Row className="summary-row align-items-center">
                          <Col>GST Number</Col>
                          <Col className="text-end text-danger">
                            <div className="row-divider">
                              <div className="qty_div">
                                <Green_Btn
                                  onClick={() => setModalShow(true)}
                                  btn_name="GST Number"
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <Row className="summary-row total-row">
                          <Col>Grand Total</Col>
                          <Col className="text-end fw-bold fs-6 text-success">
                            ₹ {Number(orderSummary?.total_amount).toFixed(2)}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    {/* ✅ Payment Method Options */}
                    <Card className="mt-3 shadow-sm">
                      <Card.Body>
                        <h6 className="fw-bold mb-3">Select Payment Method</h6>
                        <Form>
                          <div className="d-flex justify-content-between">
                            <Form.Check
                              type="radio"
                              id="cash"
                              label="💵 Cash"
                              value="1"
                              name="paymentMethod"
                              checked={paymentMethod === "1"}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <Form.Check
                              type="radio"
                              id="online"
                              label="💳 Online"
                              value="3"
                              name="paymentMethod"
                              checked={paymentMethod === "3"}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>

                    <Row className="summary-row align-items-center mt-3">
                      <Col>Advance Payment</Col>
                      <Col className="text-end">
                        <Form.Control
                          type="number"
                          min="0"
                          max={grandTotal}
                          value={advancePayment === 0 ? "" : advancePayment}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              setAdvancePayment("");
                              return;
                            }
                            const value = Number(raw);
                            if (!isNaN(value) && value > 0 && value <= grandTotal) {
                              setAdvancePayment(value);
                            }
                          }}
                          placeholder="0.00"
                          size="sm"
                        />
                      </Col>
                    </Row>

                    <Row className="summary-row">
                      <Col>Remaining Amount</Col>
                      <Col className="text-end fw-bold text-warning">
                        ₹ {remainingAmount.toFixed(2)}
                      </Col>
                    </Row>

                    <Row className="summary-row align-items-center">
                      <Col>Doctor Name</Col>
                      <Col className="text-end">
                        <Form.Control
                          type="text"
                          value={DoctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                          placeholder="Doctor Name"
                          size="sm"
                        />
                      </Col>
                    </Row>

                    <Row className="summary-row align-items-center">
                      <Col>Coupon Code</Col>
                      <Col>
                        <Form.Control
                          type="text"
                          value={Code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Code"
                          size="sm"
                        />
                      </Col>
                    </Row>

                    <Row className="summary-row align-items-center justify-content-end">
                      {orderSummary?.coupon_applied ? (
                        <Col lg={3} className="text-end">
                          <Button
                            size="sm"
                            onClick={() => setCouponError("Coupon Remove First")}
                          >
                            View All Coupon
                          </Button>
                        </Col>
                      ) : (
                        <Col lg={3} className="text-end">
                          <Button size="sm" onClick={() => setModalShowCoupon(true)}>
                            View All Coupon
                          </Button>
                        </Col>
                      )}

                      {orderSummary?.coupon_applied ? (
                        <Col lg={3} className="text-end">
                          <Button
                            size="sm"
                            onClick={() => {
                              setCouponApply(false);
                              setCouponCode("");
                              setCode("");
                            }}
                          >
                            Remove
                          </Button>
                        </Col>
                      ) : (
                        <Col lg={2} className="text-end">
                          <Button size="sm" onClick={() => handleApplyCoupon(Code)}>
                            Apply
                          </Button>
                        </Col>
                      )}

                      {CouponError && <div style={{ color: "red" }}>{CouponError}</div>}
                    </Row>

                    {loader ? (
                      <div className="text-center">
                        <ClipLoader />
                      </div>
                    ) : (
                      <>
                        {!showSuccess ? (
                          <Button className="place-order-btn w-100 mt-3" onClick={createOrder}>
                            <FontAwesomeIcon icon={faCube} className="me-2" />
                            Place Order
                          </Button>
                        ) : (
                          <>
                            <Row className="mt-3 mb-2">
                              <Col xs={6} className="pe-1">
                                <Button
                                  variant="outline-secondary"
                                  className="w-100 shadow-sm"
                                  size="sm"
                                  disabled={grandTotal > 0 && remainingAmount === 0}
                                  onClick={() => downloadInvoice(orderId, true)}
                                >
                                  Print Advance Receipt
                                </Button>
                              </Col>

                              <Col xs={6} className="ps-1">
                                <Button
                                  variant="outline-primary"
                                  className="w-100 shadow-sm"
                                  size="sm"
                                  disabled={Number(advancePayment) > 0 && remainingAmount > 0}
                                  onClick={() => downloadInvoice(orderId, false)}
                                >
                                  Print Tax Invoice
                                </Button>
                              </Col>
                            </Row>

                            <Button
                              variant="success"
                              className="w-100"
                              onClick={() => {
                                setShowSuccess(false);
                                toggleSidebar();
                                navigate("/orders/all-orders");
                              }}
                            >
                              Done! Go to Orders
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      <OrderPlacedModal
        show={showSuccessReward}
        setShowSuccess={setShowSuccessReward}
        message={Message}
      />
      <ErrorModal
        show={showError}
        setShowSuccess={setShowError}
        message={Message}
      />

      <GST_modal
        GSTNumber={GSTNumber}
        setGSTNumber={setGSTNumber}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <View_All_Coupon_Code
        setCouponCode={setCouponCode}
        handleApplyCoupon={handleApplyCoupon}
        // onApply={(code) => {
        //   setCouponCode(code);
        //   // handleSubmit(onSubmit)();
        //   setModalShow(false); // hit apply API
        // }}
        show={modalShowCoupon}
        onHide={() => setModalShowCoupon(false)}
      />
    </>
  );
}

export default Summary;
