import React, { useContext } from "react";
import { useState, useEffect } from "react";
// import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// *******************toster****************************
import Select from "react-select";
import ModalSave from "../../common/ModelSave";

import { CancelButton, SaveButton } from "../Button";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PasswordChecklist from "react-password-checklist";
import classNames from "classnames";
import "./Passwordchange.css";
library.add(fas);

const PasswordChange = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);

  const id = props.show;

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    if (password !== passwordCurrent) {
      if (password === passwordAgain) {
        const res = await postData(`/common/auth/change-password`, data);
        if (res?.success) {
          // props.handleClose();
          reset();
          await setShowModal({ code: res.code, message: res.data });
          setTimeout(() => {
            setShowModal(0);
            props.onHide();
          }, 3000);
          // hideModalWithDelay();
          // passwordClose()
        } else {
          if (res?.errors) {
            setError("current_password", { message: res?.errors });
          }
          if (res?.message?.errors?.current_password) {
            setError("current_password", {
              message: res?.message?.errors?.current_password?.msg,
            });
          }
        }
      } else {
        setError("current_password", { message: "Password must match" });
      }
    } else {
      setError("current_password", {
        message: "Current Password and New Password Not Same",
      });
    }
  };

  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordOne, setShowPasswordOne] = useState(false);
  const [iconOne, setIconOne] = useState(faEyeSlash);
  const [iconTwo, setIconTwo] = useState(faEyeSlash);
  const [iconCurrent, setIconCurrent] = useState(faEyeSlash);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
      setIconOne(showPassword ? faEyeSlash : faEye);
    } else if (field === "reenterPassword") {
      setShowPasswordOne(!showPasswordOne);
      setIconTwo(showPasswordOne ? faEyeSlash : faEye);
    } else if (field === "current_password") {
      setShowPasswordCurrent(!showPasswordCurrent);
      setIconCurrent(showPasswordCurrent ? faEyeSlash : faEye);
    }
  };
  const [password, setPassword] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  return (
    <>
      <Modal
        {...props}
        onHide={props.onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="change-pass-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
            // className="stateclass"
          >
            <Row className="justify-content-center">
              <Col md={10}>
                <div className="main-form-section my-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Current Password</Form.Label>
                    </div>
                    <InputGroup>
                      <div className="formfieldMain">
                        <Form.Control
                          type={showPasswordCurrent ? "text" : "password"}
                          placeholder="Enter Current Password*"
                          {...register("current_password", {
                            required: "current_password is required",
                          })}
                          onChange={(e) => setPasswordCurrent(e.target.value)}
                          // {...register("current_password")}
                        />
                        <FontAwesomeIcon
                          className="eyeIcon"
                          icon={iconCurrent}
                          onClick={() =>
                            togglePasswordVisibility("current_password")
                          }
                        />
                      </div>
                    </InputGroup>
                    {errors?.current_password && (
                      <sup className="text-danger">
                        {errors?.current_password?.message}
                      </sup>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={10}>
                <div className="main-form-section my-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Password</Form.Label>
                    </div>
                    <InputGroup>
                      <div className="formfieldMain">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Password*"
                          {...register("new_password", {
                            required: "New Password is required",
                            minLength: {
                              value: 8,
                              message:
                                "Password must be at least 8 characters long",
                            },
                            pattern: {
                              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                              message:
                                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                            },
                          })}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <FontAwesomeIcon
                          icon={iconOne}
                          className="eyeIcon"
                          onClick={() => togglePasswordVisibility("password")}
                        />
                      </div>
                    </InputGroup>
                    {/* {errors.password && (
                      <span className="text-danger">
                        {errors.password.message}
                      </span>
                    )} */}
                  </Form.Group>
                </div>
              </Col>
              <Col md={10}>
                <div className="main-form-section my-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Conform Password</Form.Label>
                    </div>
                    <InputGroup>
                      <div className="formfieldMain">
                        <Form.Control
                          type={showPasswordOne ? "text" : "password"}
                          placeholder="Re-Enter Password*"
                          {...register("re_password", {
                            required: "Re-Password is required",
                          })}
                          onChange={(e) => setPasswordAgain(e.target.value)}
                        />
                        <FontAwesomeIcon
                          icon={iconTwo}
                          className="eyeIcon"
                          onClick={() =>
                            togglePasswordVisibility("reenterPassword")
                          }
                        />
                      </div>
                    </InputGroup>
                    {password && (
                      <PasswordChecklist
                        rules={[
                          "minLength",
                          "specialChar",
                          "number",
                          "capital",
                          "match",
                        ]}
                        minLength={8}
                        value={password}
                        valueAgain={passwordAgain}
                        onChange={(isValid) => {}}
                        style={{
                          fontSize: "10px",
                          padding: "4px",
                          margin: "0",
                        }}
                      />
                    )}
                    {errors.re_password && (
                      <span className="text-danger">
                        {errors.re_password.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <Link>
                    <CancelButton
                      name={"cancel"}
                      handleClose={props.onHide}
                    />
                  </Link>

                  <SaveButton
                    name={"save"}
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

export default PasswordChange;
