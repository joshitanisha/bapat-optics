import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import JoditEditor from "jodit-react";
import { Select2Data } from "../../../utils/common";
import Select from "react-select";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [roles, setRoles] = useState([]);
  const GetAllRoles = async () => {
    const response = await getData("/common/masters/all-roles");
    if (response?.success) {
      setRoles(await Select2Data(response?.data, "role_id"));
    }
  };

  useEffect(() => {
    GetAllRoles();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    trigger,
  } = useForm();

  const imageFile = watch("image");
  const role_id = watch("role_id");
  const onSubmit = async (data) => {
    try {
      const sendData = new FormData();
      sendData.append("role_id", data.role_id.value);
      sendData.append("name", data?.name);
      sendData.append("contact_no", data?.contact_no);
      sendData.append("email", data?.email);
      sendData.append("password", data?.password);
      sendData.append("designation", data?.designation);
      sendData.append("image", data?.image[0]);
      sendData.append("fees", data?.fees);
      sendData.append("time", data?.time);
      sendData.append("address", data?.address);
      sendData.append("expirence", data?.expirence);
      sendData.append("specialization", data?.specialization);
      sendData.append("degree", data?.degree);
      sendData.append("hospital_name", data?.hospital_name);
      if (data?.category_id?.value) {
        sendData.append("category_id", data?.category_id?.value);
      }
      const response = await postData(
        `/admin/employee-management/users`,
        sendData
      );

      if (response?.success) {
        await setShowModal({
          code: response.code,
          message: "User Successfuly Created",
        });
      } else {
        await setShowModal({
          code: response?.code,
          message: response?.errors,
        });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [imagePreview, setImagePreview] = useState(null);

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
const [countries, setCountries] = useState([]);

   const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");

    if (response?.success) {
      setCountries(await Select2Data(response?.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
  }, []);
  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Role</Form.Label>
                    <Controller
                      name="role_id" // name of the field
                      {...register("role_id", {
                        required: "Select Role",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.role_id ? "red" : baseStyles,
                            }),
                          }}
                          {...field}
                          options={roles}
                        />
                      )}
                    />
                    {errors.role_id && (
                      <span className="text-danger">
                        {errors.role_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>
              {/* <Col md={6} /> */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Full name"
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Full Name is required",
                            validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                        onKeyDown={(e) => {
                          // Allow: backspace (8), arrow keys (37-40), delete (46), and space (32)
                          if (
                            (e.keyCode >= 37 && e.keyCode <= 40) || // Arrow keys
                            e.keyCode === 46 || // Delete key
                            e.keyCode === 8 || // Backspace
                            e.keyCode === 32 || // Space key
                            (e.key >= "a" && e.key <= "z") || // Lowercase letters
                            (e.key >= "A" && e.key <= "Z") // Uppercase letters
                          ) {
                            return; // Allow the keypress
                          }
                          e.preventDefault(); // Prevent all other keys
                        }}
                      />
                    </InputGroup>
                    {errors.name && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Contact No. </Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="contact_no"
                        placeholder="Contact No"
                        className={classNames("", {
                          "is-invalid": errors?.contact_no,
                        })}
                        {...register("contact_no", {
                          required: "Contact No. is required",
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
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
                    <Form.Label>Login Email</Form.Label>

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
                      <span className="text-danger">
                        {errors.email.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Login Password</Form.Label>

                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="password"
                        placeholder="Login Password"
                        className={classNames("", {
                          "is-invalid": errors?.password,
                        })}
                        {...register("password", {
                          required: "Login Password is required",
                          pattern: {
                            value:
                              /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                            message:
                              "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one symbol.",
                          },
                        })}
                      />
                    </InputGroup>
                    {errors.password && (
                      <span className="text-danger">
                        {errors.password.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="image"
                        placeholder="Image"
                        className={classNames("", {
                          "is-invalid": errors?.image,
                        })}
                        {...register("image", {
                          // required: "Image is required",
                        })}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.image && (
                      <span className="text-danger">
                        {errors.image.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  )}
                </div>
              </Col>
              {role_id?.value === 2 && (
                <>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Row className="row justify-content-center mb-2 me-0 sm-0">
                        <Form.Label>Category</Form.Label>
                        <Controller
                          name="category_id" // name of the field
                          {...register("category_id", {
                            required: "Select Category",
                          })}
                          control={control}
                          render={({ field }) => (
                            <Select
                              styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  borderColor: errors.category_id
                                    ? "red"
                                    : baseStyles,
                                }),
                              }}
                              {...field}
                              options={countries}
                            />
                          )}
                        />
                        {errors.category_id && (
                          <span className="text-danger">
                            {errors.category_id.message}
                          </span>
                        )}
                      </Row>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Designation</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Designation"
                            className={classNames("", {
                              "is-invalid": errors?.Designation,
                            })}
                            {...register("designation", {
                              required: "designation is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.designation && (
                          <span className="text-danger">
                            {errors.designation.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Degree</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Degree"
                            className={classNames("", {
                              "is-invalid": errors?.degree,
                            })}
                            {...register("degree", {
                              required: "Degree is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.degree && (
                          <span className="text-danger">
                            {errors.degree.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Experience</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Experience"
                            className={classNames("", {
                              "is-invalid": errors?.expirence,
                            })}
                            {...register("expirence", {
                              required: "Experience is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.expirence && (
                          <span className="text-danger">
                            {errors.expirence.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Hospital Name</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Hospital Name"
                            className={classNames("", {
                              "is-invalid": errors?.hospital_name,
                            })}
                            {...register("hospital_name", {
                              required: "Hospital Name is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.hospital_name && (
                          <span className="text-danger">
                            {errors.hospital_name.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Specialization</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Specialization"
                            className={classNames("", {
                              "is-invalid": errors?.specialization,
                            })}
                            {...register("specialization", {
                              required: "Specialization is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.specialization && (
                          <span className="text-danger">
                            {errors.specialization.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Address"
                            className={classNames("", {
                              "is-invalid": errors?.address,
                            })}
                            {...register("address", {
                              required: "Address is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
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
                      <Form.Group>
                        <Form.Label>Time</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Time"
                            className={classNames("", {
                              "is-invalid": errors?.time,
                            })}
                            {...register("time", {
                              required: "Time is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.time && (
                          <span className="text-danger">
                            {errors.time.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Fees</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Fees"
                            className={classNames("", {
                              "is-invalid": errors?.fees,
                            })}
                            {...register("fees", {
                              required: "Fees is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.fees && (
                          <span className="text-danger">
                            {errors.fees.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                </>
              )}

              {/* <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Description</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="description"
                          control={control}
                          rules={{
                            // required: "Content is required.",
                            // maxLength: {
                            //   value: 600,
                            //   message:
                            //     "content must be at most 600 characters long.",
                            // },
                          }} // Correct the maxLength rule
                          render={({ field: { onChange, onBlur, value } }) => (
                            <JoditEditor
                              value={value}
                              onBlur={() => {
                                onBlur();
                                trigger("description");
                              }}
                              onChange={onChange}
                            />
                          )}
                        />
                      </InputGroup>
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col> */}

              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <Link>
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
        </Modal.Body>
      </Modal>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default AddOffCanvance;
