import React, { useContext, useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
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
import User from "./UserDetails/User";
import Product from "./ProductLists/Product";
import Summary from "./Summary/Summary";

function Order() {
  const { toggleSidebarFalse } = useContext(Context);
  const location = useLocation();

  const [user_id, setUserId] = useState(null);

  const navigate = useNavigate();
  const handleHome = async () => {
    navigate("/advanceDashboard");
  };

return (
  <>
    <Header title={"Create Order"} link={"/orders/order"} />

    <Button
      variant="primary"
      className="home-button"
      onClick={handleHome}
      style={{ display: "none" }}
    >
      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
      Go To Dashboard
    </Button>

    <section className="Order">
      <Row className="g-3">
        <Col lg={12}>
          <User
            user_id={user_id}
            setUserId={setUserId}
          />
        </Col>

        <Col lg={12}>
          <Product
            user_id={user_id}
          />
        </Col>
      </Row>
    </section>
  </>
);
}

export default Order;