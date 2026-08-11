import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });


  const GetEditData = async () => {
    try {
     
      const response = await withLoader(() => getData(`/admin/purchase-order/supplier/${id}`));
      reset(response?.data);
    } catch (error) {
      console.error("getDataAll error:", error);
    } 
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
  } = useForm();

  const imageFile = watch("image");
const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      // const finalData = new FormData();
      // finalData.append("name", data?.name);
      // finalData.append("image", data.image[0]);
      const response = await withLoader(() => putData(
        `/admin/purchase-order/supplier/${id}`,
        data
      ));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
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
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Supplier
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
            <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
              <Row className="">
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Name</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Name"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "Name is required",
                            validate: (value) =>
                              value.length <= 200 ||
                              "Data must be 200 characters or less",
                          })}
                        />
                      </InputGroup>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Contact</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Contact"
                          className={classNames("", {
                            "is-invalid": errors?.contact,
                          })}
                          {...register("contact", {
                            required: "contact is required",
                            pattern: {
                              value: /^[6-9]\d{9}$/,
                              message: "Enter a valid 10-digit contact number",
                            },
                          })}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10}
                        />
                      </InputGroup>
                      {errors.contact && (
                        <span className="text-danger">
                          {errors.contact.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>email</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Email"
                          className={classNames("", {
                            "is-invalid": errors?.email,
                          })}
                          {...register("email", {
                            required: "email is required",
                            pattern: {
                              value:
                                /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z0-9_\-\.]+)\.\2)([A-Za-z0-9_\-\.]+\.)+([A-Za-z]{2,4})$/,
                              message: "Enter a valid email address",
                            },
                          })}
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
                      <div className="">
                        <Form.Label>Shop Name</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Shop Name"
                          className={classNames("", {
                            "is-invalid": errors?.shope_name,
                          })}
                          {...register("shope_name", {
                            required: "Shop Name is required",
                          })}
                        />
                      </InputGroup>
                      {errors.shope_name && (
                        <span className="text-danger">
                          {errors.shope_name.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div>
                        <Form.Label>GST No.</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="gst_no"
                          placeholder="Enter GST No."
                          className={classNames("", {
                            "is-invalid": errors?.gst_no,
                          })}
                          {...register("gst_no", {
                            required: "GST No. is required",
                            pattern: {
                              value:
                                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                              message: "Please enter a valid GST number",
                            },
                          })}
                        />
                      </InputGroup>
                      {errors.gst_no && (
                        <span className="text-danger">
                          {errors.gst_no.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Form.Group>
                      <div className="">
                        <Form.Label>Address</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Address"
                          className={classNames("", {
                            "is-invalid": errors?.address,
                          })}
                          {...register("address", {
                            required: "address is required",
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

export default EditOffCanvance;
