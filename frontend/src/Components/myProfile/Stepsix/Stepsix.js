import React, { useState, useEffect, useContext } from "react";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import { RegxExpression } from "../../../utils/common";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { Context } from "../../../utils/context";
import Cookies from 'js-cookie';
function Stepsix({ user_id }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [verified, setVerified] = useState(false);
  const verfiedClick = () => {
    setVerified(true)
  }
  const optionsnew = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const uploader = Uploader({
    apiKey: "free"
  });


  const options = { multi: true };

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
    watch,
  } = useForm();

  const imageFile = watch("passbook");
  const imageFile1 = watch("kyc");

  const [panImage, setPanImage] = useState(null);
  const [gstImage, setGstImage] = useState(null);

  const onSubmit = async (data) => {
    
    const formData = new FormData();
    if (data?.id) {
      formData.append("id", data?.id);
    }
    formData.append("user_id", user_id);
    formData.append("bank_name", data?.bank_name);
    formData.append("branch_name", data?.branch_name);
    formData.append("acc_no", data?.acc_no);
    formData.append("ifsc_code", data?.ifsc_code);
    formData.append("beneficiary_name", data?.beneficiary_name);
    formData.append("city", data?.city);
    formData.append("state", data?.state);
    formData.append("passbook", data?.passbook[0]);
    formData.append("kyc", data?.kyc[0]);

    try {
      const res = await postData("/employee/seller-details/s-bank-details", formData);
      if (res?.success) {
        // props.nextStep();
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
    const res = await getData(`/employee/seller-details/s-bank-details`);
    if (res?.success) {
      reset(res?.data);
    }
  };

  useEffect(() => {
    getEditData();
  }, [user_id]);



  return (
    <>

      <section className="personal-details-form userForm">
        <div className="details-form-holder">
          <div className="form-container">
            <Form onSubmit={handleSubmit(onSubmit)}>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="field-bottom">
                    <div className="">
                      <Form.Label className="required">Enter Account Number*</Form.Label>
                      <Form.Control
                        type="text"
                        name="acc_no"
                        placeholder="Account number"
                        {...register("acc_no", {
                          required: "Account number is required",
                          pattern: {
                            value: /^\d{9,18}$/,
                            message: "Invalid Account number",
                          },
                        })}
                        className={classNames("", {
                          "is-invalid": errors?.acc_no,
                          "is-valid": !errors?.acc_no && getValues("acc_no"),
                        })}
                      />

                      {errors.acc_no && (
                        <span className="text-danger">
                          {errors.acc_no.message}
                        </span>
                      )}

                    </div>

                  </div>
                </div>

                <div className="col-md-6">
                  <div className="field-bottom">
                    <div className="d-flex justify-content-between">
                      <Form.Label className="required">IFSC Code*</Form.Label>
                      {/* <p className="required mb-0" style={{ color: "#DF4223" }} onClick={verfiedClick}>Verify</p> */}

                    </div>
                    <Form.Control
                      type="text"
                      name="ifsc_code"
                      placeholder="IFSC Code"
                      {...register("ifsc_code", {
                        required: "IFSC Code is required",
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message: "Invalid IFSC Code",
                        },
                      })}
                      className={classNames("", {
                        "is-invalid": errors?.ifsc_code,
                        "is-valid": !errors?.ifsc_code && getValues("ifsc_code"),
                      })}
                    />

                    {errors.ifsc_code && (
                      <span className="text-danger">
                        {errors.ifsc_code.message}
                      </span>
                    )}
                  </div>
                </div>




                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required">Beneficiary Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="beneficiary_name"
                      placeholder="beneficiary name"
                      className={classNames("", {
                        "is-invalid": errors?.beneficiary_name,
                      })}
                      {...register("beneficiary_name", {
                        required: "beneficiary name is required",
                      })}
                    />

                    {errors.beneficiary_name && (
                      <span className="text-danger">
                        {errors.beneficiary_name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required">Bank City*</Form.Label>

                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="City"
                      className={classNames("", {
                        "is-invalid": errors?.city,
                      })}
                      {...register("city", {
                        required: "City is required",
                      })}
                    />

                    {errors.city && (
                      <span className="text-danger">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required">Bank State*</Form.Label>

                    <Form.Control
                      type="text"
                      name="state"
                      placeholder="state"
                      className={classNames("", {
                        "is-invalid": errors?.state,
                      })}
                      {...register("state", {
                        required: "state is required",
                      })}
                    />

                    {errors.state && (
                      <span className="text-danger">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required">Bank Name*</Form.Label>

                    <Form.Control
                      type="text"
                      name="bank_name"
                      placeholder="bank_name"
                      className={classNames("", {
                        "is-invalid": errors?.bank_name,
                      })}
                      {...register("bank_name", {
                        required: "bank_name is required",
                      })}
                    />

                    {errors.bank_name && (
                      <span className="text-danger">
                        {errors.bank_name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Label className="required">Bank Branch</Form.Label>

                    <Form.Control
                      type="text"
                      name="branch_name"
                      placeholder="branch_name"
                      className={classNames("", {
                        "is-invalid": errors?.branch_name,
                      })}
                      {...register("branch_name", {
                        required: "branch_name is required",
                      })}
                    />

                    {errors.branch_name && (
                      <span className="text-danger">
                        {errors.branch_name.message}
                      </span>
                    )}
                  </div>
                </div>



                {/* <div className="col-md-6">
                  <Form className="field-bottom">
                    <Form.Group controlId="Last_Name" >
                      <Form.Label className="required">
                        Upload Cancelled Cheque/ Bank Passbook 1st Pg/Bank Statment with bank details type
                      </Form.Label>

                      <div className="row">
                        <div className="col-lg-6">
                          <Form.Check
                            type="radio"
                            label="Image"
                            id="Image-1"
                            name="name-1"
                          />

                        </div>
                        <div className="col-lg-6">
                          <Form.Check
                            type="radio"
                            label="Document"
                            id="Image-1"
                            name="name-1"
                          />

                        </div>


                      </div>
                    </Form.Group>
                  </Form>
                </div> */}

                <div className="col-md-6">
                  <div className="form-field mb-3">
                    <Form.Group controlId="Last_Name">
                      <Form.Label className="required">Upload Passbook*</Form.Label>
                      <div>
                        <div>
                          <Form.Control
                            className={classNames("", {
                              "is-invalid": errors?.passbook,
                            })}
                            type="file"
                            {...register("passbook", {
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

                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="main-form-section mt-3">

                  <Form.Label>Image Preview </Form.Label>

                  {typeof getValues("passbook") == "string" ? (
                    <div
                      className="image-preview-container mt-3"
                      style={{ marginLeft: "110px" }}
                    >
                      <img
                        src={IMG_URL + getValues("passbook")}
                        alt="Preview"
                        className="image-preview"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </div>
                  ) : (
                    imageFile &&
                    imageFile?.length > 0 && (
                      <div
                        className="image-preview-container mt-3"
                        style={{ marginLeft: "110px" }}
                      >
                        <img
                          // src={URL.createObjectURL(getValues("image")[0])}
                          src={URL?.createObjectURL(imageFile[0])}
                          alt="Preview"
                          className="image-preview"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </div>
                    )
                  )}

                </div>



                <div className="col-md-6">
                  <div className="form-field">
                    <Form.Group controlId="Last_Name">
                      <Form.Label className="required">Upload KYC Doc (Adhar Card, Driving License, Passport)</Form.Label>
                      <div>
                        <Form.Control
                          className={classNames("", {
                            "is-invalid": errors?.kyc,
                          })}
                          type="file"
                          {...register("kyc", {
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
                <div className="main-form-section mt-3">

                  <Form.Label>Image Preview </Form.Label>

                  {typeof getValues("kyc") == "string" ? (
                    <div
                      className="image-preview-container mt-3"
                      style={{ marginLeft: "110px" }}
                    >
                      <img
                        src={IMG_URL + getValues("kyc")}
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

                </div>
                <div className=" text-end apply_now_btn">


                  {/* <Button onClick={props.prevStep} className="back-btn me-3">
                    Back
                  </Button> */}

                  {/* <div className="registerContinueMain"> */}
                  <Button
                    type="submit"
                    // onClick={props.nextStep}
                    className="tabs-btn"
                  >
                    Submit
                  </Button>

                  {/* </div> */}
                </div>
              </div>

            </Form>
          </div>
        </div>



      </section>
    </>
  );
}

export default Stepsix;
