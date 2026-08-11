import React, { useState, useEffect, useContext } from "react";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Form, InputGroup, Modal, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { RegxExpression } from "../../../utils/common";
import Select from "react-select";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../../../utils/context";
import { City } from "../../../utils/apis/master/Master";
import { postData } from "../../../utils/api";
import Cookies from 'js-cookie';

const Stepone = ({ user_id }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { getData, IMG_URL, Select2Data } = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    trigger,
  } = useForm();
  const watchWaUpdates = watch("wa_updates", false);
  const imageFile1 = watch("logo");

  const onSubmit = async (data) => {
   
    const formData = new FormData();
    if (data?.id) {
      formData.append("id", data.id);
    }
    formData.append("store_name", data?.store_name);
    formData.append("area", data?.area);
    formData.append("contact_no", data?.contact_no);
    formData.append("wa_contact_no", data?.wa_contact_no);
    formData.append("city_id", data?.city_id?.value);
    formData.append("logo", data?.logo[0]);

    try {
      const res = await postData("/employee/seller-details/s-store-details", formData);
      if (res?.success) {
        // Cookies.set('user_id', res.data.user_id);

      } else {
        // Handle the case when res.success is false
        console.error("Failed to submit data");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("An error occurred while submitting data:", error);
    }
  };

  const getEditData = async () => {
    const res = await getData(`/employee/seller-details/s-store-details/`);
    if (res?.success) {
      reset(res?.data)
    }
  }
  useEffect(() => {
    getEditData();
  }, [user_id]);


  const [city, setCity] = useState([]);
  const getCity = async () => {
    const res = await City();
    if (res?.success) {
      const data = await Select2Data(res?.data, 'city_id', false);
      setCity(data);
    }
  }


  useEffect(() => {
    getCity();
  }, []);

  return (
    <>
      <div className="personal-details-form ">
        <div className="details-form-holder">
          <div className="form-container">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="">
                <div className="row ">
                  <div className="col-md-6">
                    <div className="field-bottom">
                      <Form.Label className="required">City</Form.Label>

                      <Controller
                        name="city_id" // name of the field
                        control={control}
                        rules={{ required: "Select City" }}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.city_id ? "red" : baseStyles.borderColor,
                              }),
                            }}
                            {...field}
                            options={city}
                          />
                        )}
                      />

                      {errors.city_id && (
                        <span className="text-danger">
                          {errors.city_id.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-bottom">
                      <Form.Group controlId="area">
                        <Form.Label className="required">Area</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="area"
                            placeholder="Area"
                            className={classNames("", {
                              "is-invalid": errors?.area,
                            })}
                            {...register("area", {
                              required: "Area is required",
                            })}
                          />
                        </InputGroup>
                        {errors.area && (
                          <span className="text-danger">
                            {errors.area.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Number , Date of Birth, Gender */}
              <div className="">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-field">
                      <Form.Group controlId="store_name">
                        <Form.Label className="required">
                          Shop / Showroom Name*
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="store_name"
                          placeholder="Enter Shop/Showroom Name"
                          {...register("store_name", {
                            required: "Store name required",
                          })}
                          className={classNames("", {
                            "is-invalid": errors?.store_name,
                            "is-valid": getValues("store_name"),
                          })}
                        />
                        {errors.store_name && (
                          <span className="text-danger">
                            {errors.store_name.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-bottom">
                      <Form.Group controlId="contact_no">
                        <Form.Label className="required form-field">
                          Owner Contact*
                        </Form.Label>
                        <div className="get-otp-text">
                          <Form.Control
                            type="text"
                            name="contact_no"
                            placeholder="Contact No."
                            {...register("contact_no", {
                              required: "Contact number is required",
                              validate: {
                                isTenDigits: (value) =>
                                  value && value.length === 10 || "Contact number must be 10 digits",
                                isNumeric: (value) =>
                                  /^\d+$/.test(value) || "Contact number must be numeric"
                              }
                            })}
                            className={classNames("", {
                              "is-invalid": errors?.contact_no,
                              "is-valid": !errors?.contact_no && getValues("contact_no")?.length === 10,
                            })}
                            onKeyDown={(event) => {
                              const { key } = event;
                              if (!/[0-9]/.test(key) && key !== "Backspace" && key !== "Tab") {
                                event.preventDefault();
                              }
                              if (event.target.value?.length >= 10 && key !== "Backspace" && key !== "Tab") {
                                event.preventDefault();
                              }
                            }}
                          />
                          {errors.contact_no && (
                            <span className="text-danger">
                              {errors.contact_no.message}
                            </span>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Form className="field-bottom">
                      <Form.Group controlId="wa_contact_no">
                        <Form.Label className="required">
                          WhatsApp Number*
                        </Form.Label>
                        <div className="get-otp-text">
                          <Form.Control
                            type="text"
                            name="wa_contact_no"
                            placeholder="WhatsApp No."
                            {...register("wa_contact_no", {
                              required: "Contact number is required",
                              validate: {
                                isTenDigits: (value) =>
                                  value && value.length === 10 || "Contact number must be 10 digits",
                                isNumeric: (value) =>
                                  /^\d+$/.test(value) || "Contact number must be numeric"
                              }
                            })}
                            className={classNames("", {
                              "is-invalid": errors?.wa_contact_no,
                              "is-valid": !errors?.wa_contact_no && getValues("wa_contact_no")?.length === 10,
                            })}
                            onKeyDown={(event) => {
                              const { key } = event;
                              if (!/[0-9]/.test(key) && key !== "Backspace" && key !== "Tab") {
                                event.preventDefault();
                              }
                              if (event.target.value?.length >= 10 && key !== "Backspace" && key !== "Tab") {
                                event.preventDefault();
                              }
                            }}
                          />
                          {errors.wa_contact_no && (
                            <span className="text-danger">
                              {errors.wa_contact_no.message}
                            </span>
                          )}
                        </div>
                      </Form.Group>
                    </Form>
                  </div>

                  <div className="col-md-6">
                    <div className="form-field mb-4">
                      <Form.Group controlId="Last_Name">
                        <Form.Label className="required">Logo*</Form.Label>
                        <div>
                          <Form.Control
                            className={classNames("", {
                              "is-invalid": errors?.logo,
                            })}
                            type="file"
                            {...register("logo", {
                              validate: async (value) => {
                                if (typeof value !== "string") {
                                  const fileTypes = ["jpg", "png", "jpeg"];
                                  const fileType = value[0]?.name?.split(".")[1];

                                  if (!fileTypes.includes(fileType)) {
                                    return `please upload a valid file format. (${fileTypes})`;
                                  }
                                }
                              },
                            })}
                            accept=".jpg, .jpeg, .png"
                            multiple={false}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>


                  <div className="note">
                    <p>
                      Get Latest updates on <FontAwesomeIcon icon={faWhatsapp} className="ms-3" /> WhatsApp
                      <span className="ms-2">
                        <FontAwesomeIcon icon="fa-brands fa-whatsapp" />
                      </span>
                    </p>
                    <div className="on-off">
                      <Controller
                        name="wa_updates"
                        control={control}
                        render={({ field }) => (
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="WhatsApp Updates"
                            {...field}
                            onChange={(e) => setValue("wa_updates", e.target.checked)}
                            checked={field.value}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Label>Image Preview </Form.Label>

                      {typeof getValues("logo") == "string" ? (
                        <div
                          className="image-preview-container mt-3"
                          style={{ marginLeft: "110px" }}
                        >
                          <img
                            src={IMG_URL + getValues("logo")}
                            alt="Preview"
                            className="image-preview"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </div>
                      ) : (
                        imageFile1 &&
                        imageFile1?.length > 0 && (
                          <div
                            className="image-preview-container mt-3"
                            style={{ marginLeft: "110px" }}
                          >
                            <img
                              // src={URL.createObjectURL(getValues("image")[0])}
                              src={URL?.createObjectURL(imageFile1[0])}
                              alt="Preview"
                              className="image-preview"
                              style={{ width: "50px", height: "50px" }}
                            />
                          </div>
                        )
                      )}
                    </Row>
                  </div>

                  <div className="col-md-12">
                    <div className="text-end apply_now_btn">
                      <div className="registerContinueMain">
                        <Button className="tabs-btn" type="submit">
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stepone;
