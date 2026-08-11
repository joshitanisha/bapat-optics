import React, { useState, useEffect, useContext } from "react";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { RegxExpression } from "../../../utils/common";
import Cookies from 'js-cookie';
import { Context } from "../../../utils/context";
import DatePicker from 'react-datepicker';
library.add(fas);



function Steptwo(props) {
  const [fieldclick, setFieldclick] = useState(false);
  const handleFields = () => {
    setFieldclick(true);
  }
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
    console.log("Datadatdat", data);
    const formData = new FormData();
    if (data?.id) {
      formData.append("id", data?.id);
    }
    formData.append("user_id", props?.user_id);
    formData.append("name", data?.name);
    formData.append("license", data?.license);
    formData.append("e_date", data?.e_date);
    formData.append("reg_no", data?.reg_no);
    formData.append("license_type", data?.license_type);
    formData.append("license_name", data?.license_name);
    formData.append("add_in_license", data?.add_in_license);

    try {
      const res = await postData("/employee/seller-details/s-cirtification-details", formData);
      if (res?.success) {
        // props.nextStep()
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
    const res = await getData(`/employee/seller-details/s-cirtification-details`);
    if (res?.success) {
      reset(res?.data)
    }
  }
  useEffect(() => {

    getEditData();

  }, [props?.user_id]);

  // console.log("user_id", user_id);


  return (
    <>
      <div className="personal-details-form userForm">
        {/* form-holder */}
        <div className="details-form-holder">
          <div className="row">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="field-bottom">

                      <Form.Group controlId="name">
                        <Form.Label className="required">Name of Certification</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "name is required",
                          })}
                        />
                        {errors?.name && (
                          <span className="text-danger">
                            {errors?.name.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-bottom">
                      <Form.Group controlId="Last_Name">
                        <Form.Label className="required">License</Form.Label>

                        <Form.Control
                          type="text"
                          name="license"
                          placeholder="license"
                          className={classNames("", {
                            "is-invalid": errors?.license,
                          })}
                          {...register("license", {
                            required: "license is required",
                          })}
                        />

                        {errors?.license && (
                          <span className="text-danger">
                            {errors?.license.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>

              {/*   Mobile Number , Date of Birth,  Gender*/}
              <div className="">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-field">
                      <Form.Group controlId="Last_Name">
                        <Form.Label className="required">License Expiry Date</Form.Label>

                        <Controller
                          control={control}
                          name="e_date"
                          rules={{ required: "License expiry date is required" }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}

                              onChange={(date) => field.onChange(date)}
                              dateFormat="yyyy-MM-dd"
                              placeholderText="Select date"
                              minDate={new Date()}
                              className={classNames("form-control", {
                                "is-invalid": errors?.e_date,
                              })}
                            />
                          )}
                        />

                        {errors?.e_date && (
                          <span className="text-danger">
                            {errors?.e_date?.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="field-bottom">
                      <Form.Group controlId="Last_Name">
                        <div className="d-flex justify-content-between">
                          <Form.Label className="required form-field">
                            Enter Registration Number
                          </Form.Label>
                          {/* <p className="mb-0 validate" onClick={handleFields}>Validate</p> */}

                        </div>

                        <div className="get-otp-text">
                          <Form.Control
                            type="text"
                            name="reg_no"
                            placeholder="reg_no"
                            className={classNames("", {
                              "is-invalid": errors?.reg_no,
                            })}
                            {...register("reg_no", {
                              required: "reg_no is required",
                            })}
                          />

                          {errors?.reg_no && (
                            <span className="text-danger">
                              {errors?.reg_no?.message}
                            </span>
                          )}

                        </div>




                      </Form.Group>
                    </div>
                  </div>

                  {/* {fieldclick && ( */}
                  <>
                    <div className="col-md-6">
                      <div className="field-bottom">
                        <Form.Group controlId="Last_Name">
                          <Form.Label className="required form-field">
                            License Type
                          </Form.Label>

                          <div className="get-otp-text">
                            <Form.Control
                              type="text"
                              name="license_type"
                              placeholder="license_type"
                              className={classNames("", {
                                "is-invalid": errors?.license_type,
                              })}
                              {...register("license_type", {
                                required: "license_type is required",
                              })}
                            />

                            {errors?.license_type && (
                              <span className="text-danger">
                                {errors?.license_type?.message}
                              </span>
                            )}

                          </div>




                        </Form.Group>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="field-bottom">
                        <Form.Group controlId="Last_Name">

                          <Form.Label className="required form-field">
                            Name on License*
                          </Form.Label>
                          <div className="get-otp-text">
                            <Form.Control
                              type="text"
                              name="license_name"
                              placeholder="license_name"
                              className={classNames("", {
                                "is-invalid": errors?.license_name,
                              })}
                              {...register("license_name", {
                                required: "license_name is required",
                              })}
                            />

                            {errors?.license_name && (
                              <span className="text-danger">
                                {errors?.license_name?.message}
                              </span>
                            )}

                          </div>




                        </Form.Group>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="field-bottom">
                        <Form.Group controlId="Last_Name">

                          <Form.Label className="required form-field">
                            Address in License
                          </Form.Label>
                          <div className="get-otp-text">
                            <Form.Control
                              type="text"
                              name="add_in_license"
                              placeholder="add_in_license"
                              className={classNames("", {
                                "is-invalid": errors?.add_in_license,
                              })}
                              {...register("add_in_license", {
                                required: "add_in_license is required",
                              })}
                            />

                            {errors?.add_in_license && (
                              <span className="text-danger">
                                {errors?.add_in_license?.message}
                              </span>
                            )}

                          </div>




                        </Form.Group>
                      </div>
                    </div>

                  </>
                  {/* )} */}



                  <div className="col-md-12">
                    <div className=" text-end apply_now_btn">


                      {/* <Button onClick={props.prevStep} className="back-btn me-3">
                        Back
                      </Button> */}


                      <Button
                        type="submit"
                        // onClick={props.nextStep}
                        className="tabs-btn"
                      >
                        Submit
                      </Button>


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
}

export default Steptwo;
