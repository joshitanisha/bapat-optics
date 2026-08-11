import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileAlt,
  faUser,
  faEnvelope,
  faBirthdayCake,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Order.css";
import Header from "../../Header/Header";
import { Context } from "../../../utils/context";
import { useLocation, useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { getData, postData } from "../../../utils/api";
import { FaCheckCircle } from "react-icons/fa";

import Summary from "../Offline/Summary/Summary";
import CancelOrderUser from "./UserDetails/OrderUser";
import CancelOrder from "./ProductLists/productList";

function Order() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user_id, setUserId] = useState(null);

  const navigate = useNavigate();
  const handleHome = async () => {
    navigate("/advanceDashboard");
  };

  return (
    <>
      <Header title={"Return Order"} link={"/orders/order"} />

      <Button style={{ display: 'none' }} variant="primary" className="home-button" onClick={handleHome}>
        <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
        Go to Dashboard
      </Button>

      <section className="Order">
        <CancelOrderUser
          setUserId={setUserId}
          user_id={user_id}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />

        <CancelOrder
          user_id={user_id}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      </section>
    </>
  );
}

export default Order;
