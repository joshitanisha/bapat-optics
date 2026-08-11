import React, { useState, useEffect, useContext } from "react";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import classNames from "classnames";
import Cookies from 'js-cookie';
import { Context } from "../../../utils/context";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Country, State, City, Pincode } from "../../../utils/apis/master/Master";
import Select from "react-select";
import SuccessModal from "../../common/Successfull_Modal/Successfull_Modal";

function Stepfour({ user_id, showModal, setShowModal }) {
  const [selectedRole, setSelectedRole] = useState('');
  const handleRadioChange = (e) => {
    setSelectedRole(e.target.id);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { getData, IMG_URL, Select2Data, postData } = useContext(Context);
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const onSubmit = async (data) => {
  
    if (data.password === data.c_password) {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("first_name", data?.first_name);
      formData.append("email", data?.email);
      formData.append("contact_no", data?.contact_no);
      formData.append("password", data?.password);
      formData.append("role_in_store", selectedRole);
      formData.append("manager_name", data?.manager_name);
      formData.append("manager_email", data?.manager_email);
      formData.append("manager_contact_no", data?.manager_contact_no);
      formData.append("lat", data?.lat);
      formData.append("long", data?.long);
      formData.append("store_address", data?.store_address);
      formData.append("pincode_id", data?.pincode_id?.value);
      if (data?.manager_id) {
        formData.append("manager_id", data?.manager_id);
      }
      // if (newUserContact && newUserContact !== data?.contact_no) {
      //   formData.append("verified", false);
      // }

      try {
        const res = await postData("/employee/seller-details/s-owner-details", formData);
        if (res?.success) {
          
          setShowModal({ code: res.code, message: res.message });
          // setNewUserContact(res?.data?.contact_no)
          // props.nextStep()
        } else {
          // Handle the case when res.success is false
          await setShowModal({ code: res.code, message: res.message });
          console.error("Failed to submit data");
        }
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("An error occurred while submitting data:", error);
      }
    } else {
      setError("password", {
        message: "Password Must Match",
      });
    }
  };
  const [pincode, setPincode] = useState([]);
  const getEditData = async () => {
    const res = await getData(`/employee/seller-details/s-owner-details`);
    if (res?.success) {
      reset(res?.data)
      getPincode(res?.data);
      if (res?.data?.manager_id) {
        setSelectedRole("Manager")
      } else {
        setSelectedRole("Owener")
      }
    }
  }

  const getPincode = async (data) => {
    const res = await Pincode(data?.city_id);
    if (res?.success) {
      const data = await Select2Data(res?.data, 'pincode_id', false);
      setPincode(data);
    }
  }
  useEffect(() => {
    getEditData();
  }, [user_id]);


  return (
    <section className="personal-details-form userForm">
      <div className="details-form-holder">
        <div className="form-container">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required">Name of Owner*</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="first_name"
                    className={classNames("", {
                      "is-invalid": errors?.first_name,
                    })}
                    {...register("first_name", {
                      required: "first_name is required",
                    })}
                  />

                  {errors.first_name && (
                    <span className="text-danger">
                      {errors.first_name.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required">Owner Email ID*</Form.Label>

                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    className={classNames("", {
                      "is-invalid": errors?.email,
                    })}
                    {...register("email", {
                      required: "email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />

                  {errors.email && (
                    <span className="text-danger">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required">Owner Contact Number*</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_no"
                    placeholder="contact_no"
                    {...register("contact_no", {
                      required: "contact_no is required",
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
              </div>

              {/* <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required">Invoicing Email ID*</Form.Label>
                  <Form.Control
                    type="email"
                    name="invoiceEmail"
                    placeholder="Enter Invoicing Email"
                    {...register("invoiceEmail", {
                      // required: "Invoicing email required",

                    })}
                    className={classNames("", {
                      "is-invalid": errors?.invoiceEmail,
                      "is-valid": getValues("invoiceEmail"),
                    })}
                  />
                </div>
              </div> */}
            </div>

            {/* <div className="row">

              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required">Create Password*</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a Password"
                    {...register("password", {
                      required: "Password required",

                    })}
                    className={classNames("", {
                      "is-invalid": errors?.password,
                      "is-valid": getValues("password"),
                    })}
                  />
                  {errors.password && (
                    <span className="text-danger">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required">Confirm Password*</Form.Label>
                  <Form.Control
                    type="password"
                    name="c_password"
                    placeholder="Confirm Password"
                    {...register("c_password", {
                      required: "Password required",

                    })}
                    className={classNames("", {
                      "is-invalid": errors?.password,
                      "is-valid": getValues("c_password"),
                    })}
                  />
                  {errors.c_password && (
                    <span className="text-danger">
                      {errors.c_password.message}
                    </span>
                  )}
                </div>
              </div>

            </div> */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="field-bottom">
                  <Form.Label className="required form-field">Role*</Form.Label>
                  <div className="row get-otp-text">
                    <div className="col-lg-6">
                      <Form.Check
                        type="radio"
                        label="Owner"
                        id="Owner"
                        checked={selectedRole === "Owner"}
                        name="role"
                        onChange={handleRadioChange}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Form.Check
                        type="radio"
                        label="Manager"
                        id="Manager"
                        name="role"
                        checked={selectedRole === "Manager"}
                        onChange={handleRadioChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedRole === "Owner" && (
              <div className="row">

              </div>
            )}

            {selectedRole === "Manager" && (
              <div className="row">
                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required form-field">Manager Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="manager_name"
                      placeholder="manager_name"
                      className={classNames("", {
                        "is-invalid": errors?.manager_name,
                      })}
                      {...register("manager_name", {
                        required: "manager_name is required",
                      })}
                    />

                    {errors.manager_name && (
                      <span className="text-danger">
                        {errors.manager_name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required form-field">Manager Email ID</Form.Label>

                    <Form.Control
                      type="text"
                      name="manager_email"
                      placeholder="manager_email"
                      className={classNames("", {
                        "is-invalid": errors?.manager_email,
                      })}
                      {...register("manager_email", {
                        required: "manager_email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid manager_email address",
                        },
                      })}
                    />

                    {errors.manager_email && (
                      <span className="text-danger">
                        {errors.manager_email.message}
                      </span>
                    )}
                  </div>
                </div>


                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required form-field">Manager Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="manager_contact_no"
                      placeholder="manager_contact_no"

                      {...register("manager_contact_no", {
                        required: "manager_contact_no is required",
                      })}
                      className={classNames("", {
                        "is-invalid": errors?.manager_contact_no,
                        "is-valid": !errors?.manager_contact_no && getValues("manager_contact_no")?.length === 10,
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

                    {errors.manager_contact_no && (
                      <span className="text-danger">
                        {errors.manager_contact_no.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div style={{ width: '100%' }} className="mb-4">
              <iframe
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=profcyma%20global%20solution+(Wesbite)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              >
                <a href="https://www.gps.ie/">gps trackers</a>
              </iframe>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required form-field">Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="long"
                    placeholder="Long"
                    className={classNames("", {
                      "is-invalid": errors?.long,
                    })}
                    {...register("long", {
                      required: "long is required",
                    })}
                  />

                  {errors.long && (
                    <span className="text-danger">
                      {errors.long.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="field-bottom">
                  <Form.Label className="required form-field">Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="lat"
                    placeholder="Lat"
                    className={classNames("", {
                      "is-invalid": errors?.lat,
                    })}
                    {...register("lat", {
                      required: "lat is required",
                    })}
                  />

                  {errors.lat && (
                    <span className="text-danger">
                      {errors.lat.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="field-bottom">
                <Form.Label className="required form-field">store_address</Form.Label>
                <Form.Control
                  type="text"
                  name="store_address"
                  placeholder="store_address"
                  className={classNames("", {
                    "is-invalid": errors?.store_address,
                  })}
                  {...register("store_address", {
                    required: "store_address is required",
                  })}
                />

                {errors.store_address && (
                  <span className="text-danger">
                    {errors.store_address.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="field-bottom">
                <Form.Label className="required form-field">Postal Code</Form.Label>
                <Controller
                  name="pincode_id" // name of the field
                  {...register("pincode_id", {
                    required: "Select Postal Code",
                  })}
                  control={control}
                  render={({ field }) => (
                    <Select
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors.pincode_id ? "red" : baseStyles,
                        }),
                      }}
                      {...field}
                      options={pincode}
                    />
                  )}
                />

                {errors.pincode_id && (
                  <span className="text-danger">
                    {errors.pincode_id.message}
                  </span>
                )}
              </div>
            </div>


            <div className="col-md-12">
              <div className="text-end apply_now_btn">
                <div className="registerContinueMain">
                  {/* <Button onClick={props.prevStep} className="back-btn me-3">
                    Back
                  </Button> */}
                  <Button
                    className="tabs-btn"
                    type="submit"
                  // onClick={props.nextStep}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div >

    </section >

  );
}

export default Stepfour;
