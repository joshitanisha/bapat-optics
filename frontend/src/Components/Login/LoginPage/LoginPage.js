import React, { useState, useContext, useEffect } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { Context } from "../../../utils/context";
import LoginLottie from "./LoginLottie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getData } from "../../../utils/api";
const LoginPage = () => {
  const { postData, signin, setSignin, usertype, setUsertype, IMG_URL } =
    useContext(Context);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateForm = () => {
    let errors = {};

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await postData("/common/auth/admin-login", formData);

        if (response?.success) {
          setSignin(response?.success);
          setUsertype(response?.data?.role);

          Cookies.set("bapat_optics_admin_security", response.data?.token, {
            expires: 365,
          });

          if (response?.data?.role === "demo") {
            navigate("/demo");
          } else if (response?.data?.role?.length) {
            navigate("/advanceDashboard");
          }

          // else if (response?.data?.role === "Data Entry Head") {
          //   navigate("/data-entry");
          // } else {
          //   navigate(`/generatedbill`);
          // }
        } else {
          setShowErrorModal(response);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const errorStyle = {
    color: "red",
    marginLeft: "5px",
  };

  const successStyle = {
    color: "green",
    marginLeft: "5px",
  };

  const [appSetup, setAppSetup] = useState({});
  const GetAppSetup = async () => {
    const response = await getData(`/common/masters/app-setup`);
    if (response?.success) {
      setAppSetup(response?.data);
    }
  };

  useEffect(() => {
    GetAppSetup();
  }, []);
  return (
    <>
      <section className="Login">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <LoginLottie IMG_URL={IMG_URL} appSetup={appSetup} />
              {/* <img
                className="logo ms-2"
                // src={process.env.PUBLIC_URL + "/netpurtilogo.png"}
                src={IMG_URL + appSetup?.logo}
              /> */}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="card text-center login-card">
                <div className="text-holder-login">
                  <h2 className="text-start">Login</h2>
                  <p className="text-start mt-4">
                    Hey, Enter your details to get sign in to your account
                  </p>

                  {showErrorModal?.success ? (
                    <></>
                  ) : (
                    <>
                      <span style={errorStyle}>{showErrorModal?.errors}</span>
                    </>
                  )}
                  <form onSubmit={handleSubmit} role="form">
                    <div class=" text-start">
                      <label
                        for="exampleInputEmail1"
                        className="email_txt form-label"
                      >
                        Email ID
                      </label>
                    </div>
                    <div className="mb-3 form-control-email">
                      <input
                        type="email"
                        className="form-control inputForm"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter Email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                          handleChange(e);
                          errors.email = "";
                        }}
                      />
                    </div>
                    {errors.email && (
                      <span style={errorStyle}>{errors.email}</span>
                    )}
                    <div class=" text-start">
                      <label
                        for="exampleInputEmail1"
                        class="email_txt form-label"
                      >
                        Password
                      </label>
                    </div>
                    <div className="form-control-email input-group password_section">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control inputForm"
                        placeholder="Password"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                          handleChange(e);
                          errors.password = "";
                        }}
                      />

                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="formPasword"
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                    {errors.password && (
                      <span style={errorStyle}>{errors.password}</span>
                    )}

                    <input
                      className="form-control dummy_input"
                      placeholder="Dummy"
                    />

                    <Link to="/">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn sign-in-button text-center"
                      >
                        Login
                      </button>
                    </Link>
                    {/* <Link to="/forget-password" className="text-dark ">
                      <p className="py-3 mb-0">Forget Password</p>

                    </Link> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
