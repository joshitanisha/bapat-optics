import React, { useEffect, useContext, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import "./Summary.css";
import { Context } from "../../../../utils/context";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../../utils/api";
import OrderPlacedModal from "../OrderPlacedModal";
import ErrorModal from "../ErrorModal";
import { ClipLoader } from "react-spinners";

function Summary({ OrderId, user_id, watch }) {
  const [SelectedOrder, setSelectedOrder] = useState([]);

  const [orderSummary, setOrderSummary] = useState({
    no_of_item: 0,
    total_selling_price: 0,
    total_tax: 0,
    lens_tax: 0,
    total_coupon_discount: 0,
    total_addon_price: 0,
    total_offer_discount: 0,
    reward_discount: 0,
    shipping_charges: 0,
    total_amount: 0,
    total_lense_price: 0,
  });
  const [selectedFields, setSelectedFields] = useState({
    addon: true,
    tax: true,
    lens_tax: true,
    coupon: true,
    offer: true,
    reward: true,
    shipping: true,
    lense: true,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar } = useContext(Context);
  const calculateTotal = () => {
    let total = orderSummary.total_selling_price;
    //  let total = orderSummary.total_selling_price;

    if (selectedFields.addon) total += orderSummary.total_addon_price;
    if (selectedFields.tax) total += orderSummary.total_tax;
    if (selectedFields.lens_tax) total += orderSummary.lens_tax;
    if (selectedFields.coupon) total -= orderSummary.total_coupon_discount;
    if (selectedFields.offer) total -= orderSummary.total_offer_discount;
    if (selectedFields.reward) total -= orderSummary.reward_discount;
    if (selectedFields.shipping) total += orderSummary.shipping_charges;
    if (selectedFields.lense) total += orderSummary.total_lense_price;
    return total;
  };

  useEffect(() => {
    setGrandTotal(calculateTotal());
  }, [selectedFields, orderSummary]);

  const handleCheckboxChange = (field) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const [grandTotal, setGrandTotal] = useState(calculateTotal());

  const [loader, setLoder] = useState(false);
  const cancelOrder = async () => {
    setLoder(true);
    if (!user_id) {
      alert("Please Add User Details...!");
      return;
    }

    if (SelectedOrder.length <= 0) {
      alert("Please Select Order Details...!");
      return;
    }

    const res = await postData(`/admin/offline-order/cancel-order`, {
      user_id,
      order_id: OrderId,
      order_details: SelectedOrder,
      selectedFields: selectedFields,
      refund_amount: grandTotal,
    });

    if (res?.success) {
      setLoder(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        toggleSidebar();
        navigate("/orders/all-orders");
      }, 3000);
    } else {
      setLoder(false);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const subscription = watch((values) => {
      const orderDetails = values?.order_details || {};
      const selectedProducts =
        (orderDetails?.Product_Order_Details || []).filter(
          (p) => p.is_selected,
        ) || [];

      setSelectedOrder(selectedProducts);

      const summary = {
        no_of_item: selectedProducts.length,
        total_selling_price: selectedProducts.reduce(
          (acc, p) => acc + Number(p.total_selling_price || 0),
          0,
        ),
        total_tax: selectedProducts.reduce(
          (acc, p) => acc + Number(p.total_tax || 0),
          0,
        ),
        lens_tax: selectedProducts.reduce(
          (acc, p) => acc + Number(p.Prescription?.tax_amount || 0),
          0,
        ),
        total_addon_price: selectedProducts.reduce(
          (acc, p) => acc + Number(p.total_addon_price || 0),
          0,
        ),
        shipping_charges: selectedProducts.reduce(
          (acc, p) => acc + Number(p.delivery_charges || 0),
          0,
        ),
        total_coupon_discount: selectedProducts.reduce(
          (acc, p) => acc + Number(p.coupon_discount || 0),
          0,
        ),
        total_offer_discount: selectedProducts.reduce(
          (acc, p) => acc + Number(p.offer_discount || 0),
          0,
        ),
        reward_discount: selectedProducts.reduce(
          (acc, p) => acc + Number(p.reward_discount || 0),
          0,
        ),
        total_amount: selectedProducts.reduce(
          (acc, p) => acc + Number(p.total_amount || 0),
          0,
        ),
        total_lense_price: selectedProducts.reduce(
          (acc, p) => acc + Number(p.total_lense_price || 0),
          0,
        ),
      };

      setOrderSummary(summary);
    });

    return () => subscription.unsubscribe();
  }, [watch]);



  return (
    <>
      <section className="summary-container">
        <h4 className="summary-title">Summary</h4>

        <Card className="summary-card shadow-sm p-0">
          <Card.Body>
            <Row className="summary-row">
              <Col>
                {" "}
                <b>No. of Selected Items</b>
              </Col>
              <Col className="text-end fw-bold">{orderSummary.no_of_item}</Col>
            </Row>

            <Row className="summary-row">
              <Col>
                {" "}
                <b>Sub Total</b>
              </Col>
              <Col className="text-end">
                ₹ {orderSummary.total_selling_price.toFixed(2)}
              </Col>
            </Row>

            <Row className="summary-row align-items-center">
              <Col>
                {/* <Form.Check
                  type="checkbox"
                  label="Coupon Discount"
                  checked={selectedFields.coupon}
                  onChange={() => handleCheckboxChange("coupon")}
                /> */}
                <b>Coupon Discount</b>
              </Col>
              <Col className="text-end text-danger">
                - ₹ {Number(orderSummary.total_coupon_discount).toFixed(2)}
              </Col>
            </Row>

            <Row className="summary-row align-items-center">
              <Col>
                {/* <Form.Check
                  type="checkbox"
                  label="Offer Discount"
                  checked={selectedFields.offer}
                  onChange={() => handleCheckboxChange("offer")}
                /> */}
                <b>Offer Discount</b>
              </Col>
              <Col className="text-end text-danger">
                - ₹ {Number(orderSummary.total_offer_discount).toFixed(2)}
              </Col>
            </Row>

            <Row className="summary-row align-items-center">
              <Col>
                {/* <Form.Check
                  type="checkbox"
                  label="Reward Discount"
                  checked={selectedFields.reward}
                  onChange={() => handleCheckboxChange("reward")}
                /> */}
                <b>Reward Discount</b>
              </Col>
              <Col className="text-end text-danger">
                - ₹ {Number(orderSummary.reward_discount).toFixed(2)}
              </Col>
            </Row>

            <Row className="summary-row align-items-center">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Lens total"
                  checked={selectedFields.lense}
                  onChange={() => handleCheckboxChange("lense")}
                />
              </Col>
              <Col className="text-end">
                ₹ {Number(orderSummary.total_lense_price).toFixed(2)}
              </Col>
            </Row>

            <Row className="summary-row align-items-center">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Addon total"
                  checked={selectedFields.addon}
                  onChange={() => handleCheckboxChange("addon")}
                />
              </Col>
              <Col className="text-end">
                ₹ {Number(orderSummary.total_addon_price).toFixed(2)}
              </Col>
            </Row>

            <Row className="summary-row align-items-center">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Product Tax"
                  checked={selectedFields.tax}
                  onChange={() => handleCheckboxChange("tax")}
                />
              </Col>
              <Col className="text-end">
                ₹ {Number(orderSummary.total_tax).toFixed(2)}
              </Col>
            </Row>
            
            <Row className="summary-row align-items-center">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Lens Tax"
                  checked={selectedFields.lens_tax}
                  onChange={() => handleCheckboxChange("lens_tax")}
                />
              </Col>
              <Col className="text-end">
                ₹ {Number(orderSummary.lens_tax).toFixed(2)}
              </Col>
            </Row>


            <Row className="summary-row align-items-center">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Shipping Charges"
                  checked={selectedFields.shipping}
                  onChange={() => handleCheckboxChange("shipping")}
                />
              </Col>
              <Col className="text-end">
                ₹ {orderSummary.shipping_charges.toFixed(2)}
              </Col>
            </Row>

            <hr />

            <Row className="summary-row total-row">
              <Col>Grand Total</Col>
              <Col className="text-end fw-bold fs-6 text-success">
                ₹ {grandTotal.toFixed(2)}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {loader ? (
          <>
            <div className="text-center">
              <ClipLoader />
            </div>
          </>
        ) : (
          <Button className="place-order-btn w-100 mt-3" onClick={cancelOrder}>
            <FontAwesomeIcon icon={faCube} className="me-2" />
            Cancel Order
          </Button>
        )}
      </section>

      <OrderPlacedModal show={showSuccess} setShowSuccess={setShowSuccess} />
      <ErrorModal show={showError} setShowSuccess={setShowError} />
    </>
  );
}

export default Summary;

//  for multiple order same time

// import React, { useEffect, useContext, useState } from "react";
// import { Button, Form, Row, Col, Card } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCube } from "@fortawesome/free-solid-svg-icons";
// import "./Summary.css";
// import { Context } from "../../../../utils/context";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../../../utils/api";
// import OrderPlacedModal from "../OrderPlacedModal";
// import ErrorModal from "../ErrorModal";

// function Summary({ user_id, watch, getValues }) {
//   const [paymentMethod, setPaymentMethod] = useState("1");

//   const [SelectedOrder, setSelectedOrder] = useState([]);
//   const [orderSummary, setOrderSummary] = useState({
//     no_of_item: 0,
//     total_selling_price: 0,
//     total_tax: 0,
//     total_coupon_discount: 0,
//     total_addon_price: 0,
//     total_offer_discount: 0,
//     reward_discount: 0,
//     shipping_charges: 0,
//     total_amount: 0,
//   });

//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const navigate = useNavigate();
//   const { toggleSidebar } = useContext(Context);

//   const cancelOrder = async () => {
//     if (!user_id) {
//       alert("Please Add User Details...!");
//       return;
//     }

//     if (SelectedOrder.length <= 0) {
//       alert("Please Select Order Details...!");
//       return;
//     }

//     const res = await postData(`/admin/orders/cancel-order`, {
//       user_id,
//       order_details: SelectedOrder,
//     });

//     if (res?.success) {
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         toggleSidebar();
//         navigate("/orders/all-orders");
//       }, 3000);
//     } else {
//       setShowError(true);
//       setTimeout(() => {
//         setShowError(false);
//       }, 3000);
//     }
//   };

//   useEffect(() => {
//     const subscription = watch((values) => {
//       const orders = values.orders || [];

//       const selectedProducts = orders.flatMap((order) =>
//         (order?.order_details?.Product_Order_Details || []).filter(
//           (p) => p.is_selected
//         )
//       );
//       setSelectedOrder(selectedProducts);

//       const summary = {
//         no_of_item: selectedProducts.length,
//         total_selling_price: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.total_selling_price || 0),
//           0
//         ),
//         total_tax: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.total_tax || 0),
//           0
//         ),

//         total_addon_price: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.total_addon_price || 0),
//           0
//         ),

//         shipping_charges: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.delivery_charges || 0),
//           0
//         ),
//         total_coupon_discount: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.coupon_discount || 0),
//           0
//         ),
//         total_offer_discount: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.total_offer_discount || 0),
//           0
//         ),
//         reward_discount: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.reward_discount || 0),
//           0
//         ),
//         total_amount: selectedProducts.reduce(
//           (acc, p) => acc + Number(p.total_amount || 0),
//           0
//         ),
//       };

//       setOrderSummary(summary);
//     });

//     return () => subscription.unsubscribe();
//   }, [watch]);

//   return (
//     <>
//       <section className="summary-container">
//         <h4 className="summary-title">Summary</h4>

//         <Card className="summary-card shadow-sm">
//           <Card.Body>
//             <Row className="summary-row">
//               <Col>No. of Selected Items</Col>
//               <Col className="text-end fw-bold">{orderSummary.no_of_item}</Col>
//             </Row>

//             <Row className="summary-row">
//               <Col>Subtotal</Col>
//               <Col className="text-end">
//                 ₹ {orderSummary.total_selling_price.toFixed(2)}
//               </Col>
//             </Row>
//             <Row className="summary-row">
//               <Col>Addon total</Col>
//               <Col className="text-end">
//                 ₹ {orderSummary.total_addon_price.toFixed(2)}
//               </Col>
//             </Row>

//             <Row className="summary-row">
//               <Col>Tax</Col>
//               <Col className="text-end">
//                 ₹ {orderSummary.total_tax.toFixed(2)}
//               </Col>
//             </Row>

//             <Row className="summary-row">
//               <Col>Coupon Discount</Col>
//               <Col className="text-end text-danger">
//                 - ₹ {orderSummary.total_coupon_discount.toFixed(2)}
//               </Col>
//             </Row>

//             <Row className="summary-row">
//               <Col>Offer Discount</Col>
//               <Col className="text-end text-danger">
//                 - ₹ {orderSummary.total_offer_discount.toFixed(2)}
//               </Col>
//             </Row>

//             <Row className="summary-row">
//               <Col>Reward Discount</Col>
//               <Col className="text-end text-danger">
//                 - ₹ {orderSummary.reward_discount.toFixed(2)}
//               </Col>
//             </Row>

//             <Row className="summary-row">
//               <Col>Shipping Charges</Col>
//               <Col className="text-end text-danger">
//                 - ₹ {orderSummary.shipping_charges.toFixed(2)}
//               </Col>
//             </Row>

//             <hr />

//             <Row className="summary-row total-row">
//               <Col>Grand Total</Col>
//               <Col className="text-end fw-bold fs-6 text-success">
//                 ₹ {orderSummary.total_amount.toFixed(2)}
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         <Button className="place-order-btn w-100 mt-3" onClick={cancelOrder}>
//           <FontAwesomeIcon icon={faCube} className="me-2" />
//           Cancel Order
//         </Button>
//       </section>

//       <OrderPlacedModal show={showSuccess} setShowSuccess={setShowSuccess} />
//       <ErrorModal show={showError} setShowSuccess={setShowError} />
//     </>
//   );
// }

// export default Summary;
