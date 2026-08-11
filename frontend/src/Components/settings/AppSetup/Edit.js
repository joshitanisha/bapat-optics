import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import { useNavigate } from "react-router";
import Header from "../../Header/Header";
import { useParams } from "react-router-dom";
import { Select2Data } from "../../../utils/common";
import Select from "react-select";
import { useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() =>
      getData(`/admin/setting/app-setup/${id}`),
    );
    reset(response?.data);
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm();

  const imageFile = watch("logo");
  // const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("website_name", data?.website_name);
      finalData.append("contact_no", data?.contact_no);
      finalData.append("alt_contact_no", data?.alt_contact_no);
      finalData.append("email", data?.email);
      finalData.append("address", data?.address);
      // finalData.append("delivery_range", data?.delivery_range);
      finalData.append("delivery_price", data?.delivery_price);
      // finalData.append("packing_price", data?.packing_price);
      // finalData.append(
      //   "free_delivery_order_price",
      //   data?.free_delivery_order_price
      // );

      // finalData.append(
      //   "delivery_price_three_kilometer",
      //   data?.delivery_price_three_kilometer
      // );
      finalData.append("state_id", data?.state_id?.value);
      finalData.append("minimum_order", data?.minimum_order);
      finalData.append("refer_percentage", data?.refer_percentage);
      // finalData.append("refer_by_order", data?.refer_by_order);
      // finalData.append("refer_to_order", data?.refer_to_order);
      finalData.append("reward_discount", data?.reward_discount);

      // finalData.append("subscription_status", data?.subscription_status);

      finalData.append("lat", data?.lat);
      finalData.append("long", data?.long);
      finalData.append("logo", data?.logo[0]);

      // finalData.append("customer_limit", data?.customer_limit);
      // finalData.append("refer_to_percentage", data?.refer_to_percentage);
      finalData.append("low_stock_day", data?.low_stock_day);
      const response = await withLoader(() =>
        putData(`/admin/setting/app-setup/${id}`, finalData),
      );

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/settings/app-setup");
        // props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };
  const [states, setStates] = useState([]);
  const GetAllStates = async (id) => {
    const response = await getData(`/common/masters/all-state`);
    if (response?.success) {
      setStates(await Select2Data(response?.data, "state_id"));
    }
  };

  useEffect(() => {
    GetAllStates();
    // GetAllStates();
    // GetAllCities();
  }, []);

  return (
    <>
      <Header title={"Edit App Setup"} link={"#"} />
      <section className="Create">
        <div className="back_btn_holder">
          <div onClick={() => navigate(`/settings/app-setup`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
        </div>

        <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
          <Row className="">
            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Group>
                    <Form.Label>Website Name</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="website_name"
                        placeholder="Website Name"
                        className={classNames("", {
                          "is-invalid": errors?.website_name,
                        })}
                        {...register("website_name", {
                          required: "Website name Is Required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.website_name && (
                      <span className="text-danger">
                        {errors.website_name.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Group>
                    <Form.Label>Latitude</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="lat"
                        placeholder="Lat"
                        className={classNames("", {
                          "is-invalid": errors?.lat,
                        })}
                        {...register("lat", {
                          required: "lat Is Required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.lat && (
                      <span className="text-danger">{errors.lat.message}</span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Group>
                    <Form.Label>Longitude</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="long"
                        placeholder="Long"
                        className={classNames("", {
                          "is-invalid": errors?.long,
                        })}
                        {...register("long", {
                          required: "long Is Required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.long && (
                      <span className="text-danger">{errors.long.message}</span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Contact No. </Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name={`contact_no`}
                      placeholder="Mobile Number"
                      className={classNames("", {
                        "is-invalid": errors?.contact_no,
                      })}
                      {...register(`contact_no`, {
                        required: "Mobile Number is required",
                        validate: (value) =>
                          value.length === 10 ||
                          " Contact number must be exactly 10 digits",
                      })}
                      onKeyDown={(e) => {
                        const { key } = e;
                        const value = e.target.value;
                        if (key === "ArrowLeft" || key === "ArrowRight") {
                          return;
                        }
                        if (
                          !/[0-9]/.test(key) &&
                          key !== "Backspace" &&
                          key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                        // if (
                        //   value?.length >= 10 &&
                        //   key !== "Backspace" &&
                        //   key !== "Tab"
                        // ) {
                        //   e.preventDefault();
                        // }
                      }}
                    />
                  </InputGroup>
                  {errors.contact_no && (
                    <span className="text-danger">
                      {errors.contact_no.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Alternate Contact No. </Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name={`alt_contact_no`}
                      placeholder="Mobile Number"
                      className={classNames("", {
                        "is-invalid": errors?.alt_contact_no,
                      })}
                      {...register(`alt_contact_no`, {
                        required: "Mobile Number is required",
                        validate: (value) =>
                          value.length === 10 ||
                          " Contact number must be exactly 10 digits",
                      })}
                      onKeyDown={(e) => {
                        const { key } = e;
                        const value = e.target.value;
                        if (key === "ArrowLeft" || key === "ArrowRight") {
                          return;
                        }
                        if (
                          !/[0-9]/.test(key) &&
                          key !== "Backspace" &&
                          key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                        // if (
                        //   value?.length >= 10 &&
                        //   key !== "Backspace" &&
                        //   key !== "Tab"
                        // ) {
                        //   e.preventDefault();
                        // }
                      }}
                    />
                  </InputGroup>
                  {errors.alt_contact_no && (
                    <span className="text-danger">
                      {errors.alt_contact_no.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Email</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Email"
                      className={classNames("", {
                        "is-invalid": errors?.email,
                      })}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z0-9_\-\.]+)\.\2)([A-Za-z0-9_\-\.]+\.)+([A-Za-z]{2,4})$/,
                          message: "Invalid Email address",
                        },
                        validate: (value) => {
                          // Extract the domain and TLD
                          const domainPattern =
                            /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z0-9_\-\.]+)\.\2)([A-Za-z0-9_\-\.]+\.)+([A-Za-z]{2,4})$/;
                          const match = value.match(domainPattern);
                          if (match) {
                            const domainParts = match[1].split(".");
                            const tld = match[2];

                            // Ensure the domain and TLD are not the same
                            if (domainParts[domainParts.length - 1] === tld) {
                              return "Domain and top-level domain must be different";
                            }
                          }
                          return true;
                        },
                      })}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </InputGroup>
                  {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="row justify-content-center mb-2 me-0 sm-0">
                  <Form.Label>State</Form.Label>

                  <Controller
                    name="state_id" // name of the field
                    {...register("state_id", {
                      required: "Select State",
                    })}
                    control={control}
                    render={({ field }) => (
                      <Select
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors.state_id ? "red" : baseStyles,
                          }),
                        }}
                        {...field}
                        options={states}
                      />
                    )}
                  />

                  {errors.state_id && (
                    <span className="text-danger">
                      {errors.state_id.message}
                    </span>
                  )}
                </Row>
              </div>
            </Col>
            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Minimum Order(price)</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`minimum_order`}
                      placeholder="Minimum Order(price)"
                      className={classNames("", {
                        "is-invalid": errors?.minimum_order, // Adjusted error checking
                      })}
                      {...register(`minimum_order`, {
                        required: "Minimum Order(price) are required ",
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.minimum_order && (
                      <span className="text-danger">
                        {errors.minimum_order.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>
            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Shipping Charges</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`delivery_price`}
                      placeholder="Shipping Charges"
                      className={classNames("", {
                        "is-invalid": errors?.delivery_price,
                      })}
                      {...register(`delivery_price`, {
                        required: "Shipping Charges are required ",
                      })}
                      onKeyDown={(e) => {
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.delivery_price && (
                      <span className="text-danger">
                        {errors.delivery_price.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>

            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Group>
                    <Form.Label>Default Delivery Range Days</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="delivery_range"
                        placeholder="Enter Default Delivery Range"
                        className={classNames("", {
                          "is-invalid": errors?.delivery_range,
                        })}
                        {...register("delivery_range", {
                          required: "Delivery Range Is Required",
                        })}
                        onKeyDown={(e) => {
                          // Allow left and right arrows and backspace
                          if (
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            e.key === "Backspace"
                          ) {
                            return;
                          }

                          // Allow only numbers
                          if (!/[\d]/.test(e.key)) {
                            e.preventDefault(); // Prevent non-numeric input
                          }
                        }}
                      />
                    </InputGroup>
                    {errors.delivery_range && (
                      <span className="text-danger">
                        {errors.delivery_range.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>
          
          

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Delivery Price First Three Kilometer</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`delivery_price_three_kilometer`}
                      placeholder="Delivery Price First Three Kilometer"
                      className={classNames("", {
                        "is-invalid": errors?.delivery_price_three_kilometer,
                      })}
                      {...register(`delivery_price_three_kilometer`, {
                        required: {
                          message: "price are required ",
                        },
                      })}
                      onKeyDown={(e) => {
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.delivery_price_three_kilometer && (
                      <span className="text-danger">
                        {errors.delivery_price_three_kilometer.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>
            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Free Delivery Order Price</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`free_delivery_order_price`}
                      placeholder="Free Delivery Order Price"
                      className={classNames("", {
                        "is-invalid": errors?.free_delivery_order_price, // Adjusted error checking
                      })}
                      {...register(`free_delivery_order_price`, {
                        required: {
                          message: "price are required ", // Custom required message
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.free_delivery_order_price && (
                      <span className="text-danger">
                        {errors.free_delivery_order_price.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}
            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Subscription Status</Form.Label>
                  <Form.Group>
                    <Form.Check
                      type="switch"
                      id="subscription_status" // Give it an id for accessibility
                      label=""
                      name="subscription_status"
                      checked={watch("subscription_status")} // Assuming you're using react-hook-form to track state
                      onChange={(e) => {
                        setValue("subscription_status", e.target.checked);
                      }} // Update form state on toggle
                      className={classNames("", {
                        "is-invalid": errors?.subscription_status,
                      })}
                    />
                    {errors.subscription_status && (
                      <span className="text-danger">
                        {errors.subscription_status.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}
            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Packing Price</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`packing_price`}
                      placeholder="Returnable Days"
                      className={classNames("", {
                        "is-invalid": errors?.packing_price, // Adjusted error checking
                      })}
                      {...register(`packing_price`, {
                        required: {
                          message: "Price are required ", // Custom required message
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.packing_price && (
                      <span className="text-danger">
                        {errors.packing_price.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Reward Amount Percentage</Form.Label>

                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Reward Amount Percentage"
                      className={classNames("", {
                        "is-invalid": errors?.reward_discount,
                      })}
                      {...register("reward_discount", {
                        required: {
                          value: true,
                          message: "Reward Amount Percentage is required",
                        },
                      })}
                      onKeyDown={(e) => {
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    {errors?.reward_discount && (
                      <span className="text-danger">
                        {errors.reward_discount.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>
            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Customer Limit</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`customer_limit`}
                      placeholder="Customer Limit"
                      className={classNames("", {
                        "is-invalid": errors?.customer_limit, // Adjusted error checking
                      })}
                      {...register(`customer_limit`, {
                        required: {
                          message: "Customer Limit required ", // Custom required message
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.customer_limit && (
                      <span className="text-danger">
                        {errors.customer_limit.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Low Stock Alert</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`low_stock_day`}
                      placeholder="Low Stock Alert"
                      className={classNames("", {
                        "is-invalid": errors?.low_stock_day, // Adjusted error checking
                      })}
                      {...register(`low_stock_day`, {
                        required: "Low Stock Alert required ",
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.low_stock_day && (
                      <span className="text-danger">
                        {errors.low_stock_day.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Refer Amount</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`refer_percentage`}
                      placeholder="Refer Amount"
                      className={classNames("", {
                        "is-invalid": errors?.refer_percentage, // Adjusted error checking
                      })}
                      {...register(`refer_percentage`, {
                         required: "Refer Amount required ",
                        
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.refer_percentage && (
                      <span className="text-danger">
                        {errors.refer_percentage.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col>
            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Referal Discount Percentage</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`refer_to_percentage`}
                      placeholder="Refer To percentage"
                      className={classNames("", {
                        "is-invalid": errors?.refer_to_percentage, // Adjusted error checking
                      })}
                      {...register(`refer_to_percentage`, {
                        required: {
                          message: "refer percentage required ", // Custom required message
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.refer_to_percentage && (
                      <span className="text-danger">
                        {errors.refer_to_percentage.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}

            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Refer By Order</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`refer_by_order`}
                      placeholder="Refer Percentage"
                      className={classNames("", {
                        "is-invalid": errors?.refer_by_order, // Adjusted error checking
                      })}
                      {...register(`refer_by_order`, {
                        required: {
                          message: "refer By Order required ", // Custom required message
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.refer_by_order && (
                      <span className="text-danger">
                        {errors.refer_by_order.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}

            {/* <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-center">
                  <Form.Label>Refer To Order Count</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name={`refer_to_order`}
                      placeholder="Refer Percentage"
                      className={classNames("", {
                        "is-invalid": errors?.refer_to_order, // Adjusted error checking
                      })}
                      {...register(`refer_to_order`, {
                        required: {
                          message: "refer To Order required ", // Custom required message
                        },
                      })}
                      onKeyDown={(e) => {
                        // Allow backspace, left arrow, right arrow, and digits
                        if (
                          !(
                            e.key === "Backspace" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Tab" ||
                            (e.key >= "0" && e.key <= "9")
                          )
                        ) {
                          e.preventDefault(); // Prevent default action for non-allowed keys
                        }
                      }}
                    />
                    {errors.refer_to_order && (
                      <span className="text-danger">
                        {errors.refer_to_order.message}
                      </span>
                    )}
                  </Form.Group>
                </Row>
              </div>
            </Col> */}

            <Col md={12}>
              <div className="main-form-section mt-3">
                <Form.Group>
                  <div className="">
                    <Form.Label>Address</Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      name="address"
                      placeholder="Address"
                      className={classNames("", {
                        "is-invalid": errors?.address,
                      })}
                      {...register("address", {
                        required: "Address Is Required",
                      })}
                    />
                  </InputGroup>
                  {errors.address && (
                    <span className="text-danger">
                      {errors.address.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </Col>

            <Col md={6}>
              <div className="main-form-section mt-3">
                <Row className="justify-content-start">
                  <Form.Label className="text-left">Logo</Form.Label>

                  <Form.Group>
                    <Form.Control
                      className={classNames("", {
                        "is-invalid": errors?.logo,
                      })}
                      type="file"
                      {...register("logo", {
                        // validate: async (value) => {
                        //   if (typeof value !== "string") {
                        //     const fileTypes = ["jpg", "png", "jpeg"];
                        //     const fileType = value[0].name?.split(".")[1];
                        //     if (!fileTypes.includes(fileType)) {
                        //       return `please upload a valid file format. (${fileTypes})`;
                        //     }
                        //     const sizes = await getDimension(value[0]);
                        //     if (
                        //       sizes.width !== 420 &&
                        //       sizes.height !== 520
                        //     ) {
                        //       return "Image width and height must be 420 px and 520 px";
                        //     }
                        //     const fileSize = Math.round(
                        //       value[0].size / 1024
                        //     );
                        //     if (fileSize > 500) {
                        //       return "file size must be lower than 500kb";
                        //     }
                        //   }
                        // },
                      })}
                      accept=".png"
                    />
                  </Form.Group>
                  {errors.logo && (
                    <span className="text-danger">{errors.logo.message}</span>
                  )}
                </Row>
              </div>

              <div className="main-form-section mt-3">
                <Form.Label>Image Preview</Form.Label>

                {typeof getValues("logo") == "string" ? (
                  <div className="image-preview-container">
                    <img
                      src={IMG_URL + getValues("logo")}
                      alt="Preview"
                      className="image-preview"
                    />
                  </div>
                ) : (
                  imageFile &&
                  imageFile?.length > 0 && (
                    <div className="image-preview-container">
                      <img
                        // src={URL.createObjectURL(getValues("image")[0])}
                        src={URL?.createObjectURL(imageFile[0])}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  )
                )}
              </div>
            </Col>

            <Row className="mt-5 pb-3">
              <div className="d-flex justify-content-center">
                <Link to={"/settings/app-setup"}>
                  <CancelButton
                    name={"Cancel"}
                    handleClose={props.handleClose}
                  />
                </Link>

                <SaveButton
                  name={"Save"}
                  handleSubmit={handleSubmit(onSubmit)}
                />
              </div>
            </Row>
          </Row>
        </Form>
      </section>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default EditOffCanvance;
