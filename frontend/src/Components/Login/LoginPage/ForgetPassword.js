import React, { useState, useContext } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Context } from "../../../utils/context";
import LoginLottie from "./LoginLottie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import classNames from "classnames";
import { getValue } from "@mui/system";

const ForgetPassword = () => {
  const { postData } = useContext(Context);
  const navigate = useNavigate();

  // State variables to handle OTP and password visibility
  const [showModal, setShowModal] = useState({ code: 0, message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Step 1: Send OTP to email
  const onSendOtp = async (data) => {
    try {
      const response = await postData(`/common/auth/check-exist`, { email: data.email });

      if (response?.success) {
        const res = await postData(`/common/verify-otp/send-email-otp`, { email: data.email });
        if (res?.success) {
          setOtpSent(true);  // OTP sent, show OTP input field
        } else {
          setShowModal({ code: res.code, message: res.message });
        }
      } else {
        setError("email", {
          type: "manual",
          message: response.message,
        });
        setShowModal({ code: response.code, message: response.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Step 2: Verify OTP
  const onVerifyOtp = async (data) => {
    try {
      const response = await postData(`/common/verify-otp/verify-email-otp`, { email: data.email, otp: data.otp });
      if (response?.success) {
        setOtpVerified(true);  // OTP verified, show password change input
      } else {
        setError("otp", {
          type: "manual",  // Type of error (manual because we're setting it manually)
          message: response.message,  // Error message from the API response
        });
        setShowModal({ code: response.code, message: response.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Step 3: Change password after OTP verification
  const onSubmit = async (data) => {
    try {
      const response = await postData(`/common/auth/update-password-wl`, { email: data.email, password: data.new_password });
      if (response?.success) {
        navigate("/");  // Navigate to login or home after password change
      } else {
        setShowModal({ code: response.code, message: response.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="Login">
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <LoginLottie />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="card text-center login-card">
              <div className="text-holder-login">
                <h2 className="text-start">Change Password</h2>
                <form onSubmit={handleSubmit(otpSent && !otpVerified ? onVerifyOtp : onSubmit)} role="form">
                  {/* Email Input */}
                  <div className="text-start">
                    <label htmlFor="exampleInputEmail1" className="email_txt form-label">
                      Email ID
                    </label>
                  </div>
                  <div className="mb-3 form-control-email">
                    <InputGroup>
                      <Form.Control
                        disabled={otpSent}
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={classNames("", { "is-invalid": errors?.email })}
                        {...register("email", {
                          required: "Email is required",  // Required validation
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Basic email pattern
                            message: "Please enter a valid email address"
                          },
                          validate: (value) => {
                            // Extract the domain and TLD
                            const domainPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
                            const match = value.match(domainPattern);
                            if (match) {
                              const domainParts = match[1].split('.');
                              const tld = match[2];

                              // Ensure the domain and TLD are not the same
                              if (domainParts[domainParts.length - 1] === tld) {
                                return "Domain and top-level domain must be different";
                              }
                            }
                            return true;
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                  </div>

                  {!otpSent && (
                    <button type="button" onClick={handleSubmit(onSendOtp)} className="btn sign-in-button text-center">
                      Send Otp
                    </button>
                  )}

                  {otpSent && !otpVerified && (
                    <>
                      <div className="text-start">
                        <label htmlFor="otp" className="email_txt form-label">
                          OTP
                        </label>
                      </div>
                      <div className="form-control-email input-group password_section">
                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="otp"
                            maxLength={4}
                            placeholder="Enter OTP"
                            onKeyDown={(e) => {
                              if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                                e.preventDefault();
                              }
                            }}  // Allow only numeric input and backspace
                            {...register("otp", {
                              required: "OTP is required",  // Show error if OTP is missing
                              pattern: {
                                value: /^[0-9]{4}$/,  // Regex to ensure OTP is exactly 4 digits
                                message: "OTP must be 4 digits"
                              }
                            })}
                          />

                        </InputGroup>
                        {errors.otp && <span className="text-danger">{errors.otp.message}</span>}
                      </div>

                      <button type="submit" className="btn sign-in-button text-center">
                        Verify Otp
                      </button>
                    </>
                  )}

                  {otpVerified && (
                    <>
                      <div className="text-start">
                        <label htmlFor="new_password" className="email_txt form-label">
                          New Password
                        </label>
                      </div>
                      <div className="form-control-email input-group password_section">
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="new_password"
                            placeholder="Enter New Password"
                            className={classNames("", { "is-invalid": errors?.new_password })}
                            {...register("new_password", { required: "Password is required" })}
                          />
                        </InputGroup>
                        <FontAwesomeIcon
                          icon={showPassword ? faEye : faEyeSlash}
                          className="formPasword"
                          onClick={togglePasswordVisibility}
                        />
                        {errors.new_password && <span className="text-danger">{errors.new_password.message}</span>}
                      </div>

                      <button type="submit" className="btn sign-in-button text-center">
                        Change Password
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
