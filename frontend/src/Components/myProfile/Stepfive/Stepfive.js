import React, { useState, useEffect, useContext } from "react";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Form, InputGroup, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { RegxExpression } from "../../../utils/common";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { Context } from "../../../utils/context";
import Cookies from 'js-cookie';

function Stepfive(props) {
  const [selectedOption, setSelectedOption] = useState(null);

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
  const [user_id, setUserId] = useState("");

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

  const imageFile = watch("pan_image");
  const imageFile1 = watch("gst_image");

  const [panImage, setPanImage] = useState(null);
  const [gstImage, setGstImage] = useState(null);

  const onSubmit = async (data) => {
   
    const formData = new FormData();
    if (data?.id) {
      formData.append("id", data?.id);
    }
    formData.append("user_id", user_id);
    formData.append("pan_no", data?.pan_no);
    formData.append("gst_no", data?.gst_no);
    formData.append("pan_image", data?.pan_image[0]);
    formData.append("gst_image", data?.gst_image[0]);

    try {
      const res = await postData("/employee/seller-details/s-documents", formData);
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
    const res = await getData(`/employee/seller-details/s-documents`);
    if (res?.success) {
      reset(res?.data);
    }
  };

  useEffect(() => {
    getEditData();
  }, [user_id]);

 
  useEffect(() => {
    setUserId(Cookies.get('user_id'));
  }, []);

  return (
    <section className="personal-details-form userForm">
      <div className="details-form-holder">
        <div className="form-container">
          <Form onSubmit={handleSubmit(onSubmit)} >
            <div className="">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="field-bottom">
                    <div className="d-flex justify-content-between">
                      <Form.Label className="required">PAN Number*</Form.Label>
                    </div>
                    <div className="col-md-6">
                      <div className="field-bottom">

                        <Form.Control
                          type="text"
                          name="pan_no"
                          placeholder="PAN No. "
                          {...register("pan_no", {
                            required: "PAN number is required",
                            pattern: {
                              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                              message: "Invalid PAN number",
                            },
                          })}
                          className={classNames("", {
                            "is-invalid": errors?.pan_no,
                            "is-valid": !errors?.pan_no && getValues("pan_no"),
                          })}
                        />

                        {errors.pan_no && (
                          <span className="text-danger">
                            {errors.pan_no.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-field mb-4">
                    <Form.Group controlId="Last_Name">
                      <Form.Label className="required">PAN Image Upload*</Form.Label>
                      <div>
                        <Form.Control
                          className={classNames("", {
                            "is-invalid": errors?.pan_image,
                          })}
                          type="file"
                          {...register("pan_image", {
                            validate: async (value) => {
                              if (typeof value !== "string") {
                                const fileTypes = ["jpg", "png", "jpeg"];
                                const fileType = value[0].name?.split(".")[1];

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
                  <Row className="justify-content-center">
                    <Form.Label>Image Preview </Form.Label>

                    {typeof getValues("pan_image") == "string" ? (
                      <div
                        className="image-preview-container mt-3"
                        style={{ marginLeft: "110px" }}
                      >
                        <img
                          src={IMG_URL + getValues("pan_image")}
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
                  </Row>
                </div>

                {/* <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Group controlId="Last_Name">
                      <Form.Label className="required">PAN Doc. Upload Type*</Form.Label>
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
                  </div>
                </div> */}
              </div>
            </div>

            <div className="">
              <div className="row">


                <div className="col-md-6">
                  <div className="field-bottom">
                    <Form.Group controlId="Last_Name">
                      <Form.Label className="required form-field">
                        GST Number
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="gst_no"
                        placeholder="GST No. "
                        {...register("gst_no", {
                          required: "GST number is required",
                          pattern: {
                            value: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                            message: "Invalid GST number",
                          },
                        })}
                        className={classNames("", {
                          "is-invalid": errors?.gst_no,
                          "is-valid": !errors?.gst_no && getValues("gst_no"),
                        })}
                      />

                      {errors.gst_no && (
                        <span className="text-danger">
                          {errors.gst_no.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <Form className="field-bottom">
                    <Form.Group controlId="Last_Name" >
                      <Form.Label className="required">
                        GST Doc. Upload Type
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
                  <div className="form-field mb-4">
                    <Form.Group controlId="Last_Name">
                      <Form.Label className="required">GST Image Upload*</Form.Label>
                      <div>
                        <Form.Control
                          className={classNames("", {
                            "is-invalid": errors?.gst_image,
                          })}
                          type="file"
                          {...register("gst_image", {
                            validate: async (value) => {
                              if (typeof value !== "string") {
                                const fileTypes = ["jpg", "png", "jpeg"];
                                const fileType = value[0].name?.split(".")[1];

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
                  <Row className="justify-content-center">
                    <Form.Label>Image Preview </Form.Label>

                    {typeof getValues("gst_image") == "string" ? (
                      <div
                        className="image-preview-container mt-3"
                        style={{ marginLeft: "110px" }}
                      >
                        <img
                          src={IMG_URL + getValues("gst_image")}
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
              </div>
              <div className=" text-end apply_now_btn">
                {/* <Button onClick={props.prevStep} className="back-btn me-3">
                  Back
                </Button> */}
                <Button type="submit" className="tabs-btn">
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default Stepfive;
