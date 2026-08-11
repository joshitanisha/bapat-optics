import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileAlt,
  faEnvelope,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./User.css";
import { useForm } from "react-hook-form";
import { getData } from "../../../../utils/api";
import UserOrderListModal from "../UserOrderListModal";

function CancelOrderUser({
  setUserId,
  user_id,
  setSelectedOrder,
  selectedOrder,
}) {
  const [checkUser, setCheckUser] = useState(false);
  const [searchType, setSearchType] = useState("contact"); // 'contact' or 'email'
  const [userOrders, setUserOrders] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const getUserDetails = async () => {
    const contact_no = watch("contact_no");
    const email = watch("email");

    let res;
    if (searchType === "contact") {
      if (!contact_no || contact_no.length !== 10) {
        setError("contact_no", {
          type: "manual",
          message: "Enter valid 10-digit mobile number",
        });
        return;
      }
      res = await getData(
        `/admin/offline-order/cancel/getUser?contact_no=${contact_no}`,
      );
    } else {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("email", {
          type: "manual",
          message: "Enter valid email address",
        });
        return;
      }
      res = await getData(`/admin/offline-order/cancel/getUser?email=${email}`);
    }

    if (res.success && res?.data) {
      clearErrors();
      setCheckUser(true);
      setUserId(res.data.id);
      setValue("user_id", res.data.id);
      setUserOrders(true);
    } else {
      setCheckUser(false);
      setError(searchType === "contact" ? "contact_no" : "email", {
        type: "manual",
        message: "User not found",
      });
    }
  };

  // Reset state when input changes
  useEffect(() => {
    setCheckUser(false);
    setUserId(null);
    setValue("user_id", "");
  }, [watch("contact_no"), watch("email")]);

  return (
    <section className="user-container">
      <h3 className="user-title">Bapat Optics</h3>

      {/* Select Search Type */}
      <Form.Group className="mb-3">
        <Form.Label>Search User By:</Form.Label>
        <div className="d-flex">
          <Form.Check
            type="radio"
            label="Mobile Number"
            name="searchType"
            value="contact"
            checked={searchType === "contact"}
            onChange={() => setSearchType("contact")}
            className="me-3"
          />
          <Form.Check
            type="radio"
            label="Email"
            name="searchType"
            value="email"
            checked={searchType === "email"}
            onChange={() => setSearchType("email")}
          />
        </div>
      </Form.Group>

      {/* Conditional Input */}
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="user-input-group">
              <div className="input-icon">
                <FontAwesomeIcon
                  icon={searchType === "contact" ? faMobileAlt : faEnvelope}
                  className="icon"
                />
                {searchType === "contact" ? (
                  <Form.Control
                    type="tel"
                    placeholder="Mobile"
                    maxLength={10}
                    className="user-input small-input"
                    {...register("contact_no", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter valid 10-digit mobile number",
                      },
                    })}
                    onKeyDown={(e) => {
                      const invalidKeys = ["e", "E", "+", "-", ".", ","];

                      // Allow Backspace, Arrow keys
                      if (
                        e.key === "Backspace" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowRight" ||
                        e.key === "Tab"
                      ) {
                        return;
                      }

                      // Block ".", letters, symbols, negative, decimal
                      if (invalidKeys.includes(e.key)) {
                        e.preventDefault();
                      }

                      // Block anything that is NOT a number 1–9
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                ) : (
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    className="user-input small-input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                )}
              </div>
              {searchType === "contact" && errors.contact_no && (
                <p className="text-danger">{errors.contact_no.message}</p>
              )}
              {searchType === "email" && errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="user-input-group">
              {!checkUser ? (
                <Button className="user-btn" style={{width:"fit-content"}} onClick={getUserDetails}>
                  Check User
                </Button>
              ) : (
                <>
                  {" "}
                  <div className="d-flex gap-3">

                  <div className="user-checked-msg text-success d-flex align-items-center mt-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    <span  style={{textWrap:"nowrap"}}>User Checked</span>
                  </div>
                  <Button
                    size="sm"
                    className="user-btn"
                    style={{width:"fit-content"}}
                    onClick={() => setUserOrders(true)}
                  >
                    Select Order
                  </Button>
                  </div>
                </>
              )}
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <UserOrderListModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        user_id={user_id}
        show={userOrders}
        handleClose={() => setUserOrders(false)}
      />
    </section>
  );
}

export default CancelOrderUser;
