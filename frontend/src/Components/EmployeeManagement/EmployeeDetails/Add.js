import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";

import Offcanvas from "react-bootstrap/Offcanvas";

import Card from "react-bootstrap/Card";
import Select from "react-select";
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import JoditEditor from "jodit-react";

import { Context } from "../../../utils/context";

const AddOffCanvance = (props) => {
  const id = props.show;

  const [data, setData] = useState({});
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm();

  const imageFile = watch("image");

  // const onSubmit = async (data) => {
  //   try {
  //     const sendData = new FormData();
  //     sendData.append("name", data?.name);
  //     sendData.append("description", data?.description);
  //     sendData.append("long_description", data?.long_description);
  //     sendData.append("image", data?.image[0]);
  //     const response = await postData(`/masters/blogs/${id}`, sendData);
  //     console.log(response);
  //     if (response?.success) {
  //       await setShowModal({ code: response.code, message: response.message });
  //     } else {
  //       await setShowModal({ code: response.code, message: response.message });
  //     }
  //     setTimeout(() => {
  //       setShowModal(0);
  //       props.handleClose();
  //     }, 1000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const GetEditData = async () => {
    const response = await getData(`/employee/employee-details/${id}`);
    reset(response?.data);
    setData(response?.data);
  };
  useEffect(() => {
    GetEditData();
  }, []);

  return (
    <>
      <Offcanvas
        show={props.show}
        style={{ width: "80%" }}
        placement={"end"}
        onHide={props.handleClose}
      >
        <Offcanvas.Header closeButton>
          {/* <Offcanvas.Title>Add Employee</Offcanvas.Title> */}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="shadow-lg p-3 mb-5  rounded">
            <Card.Body>
              <Card.Title>Seller's Details :- {data?.first_name}</Card.Title>
              <hr />
              <Form>
                <Row>
                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Name</Form.Label>

                        <InputGroup>
                          <Form.Control
                            disabled
                            type="text"
                            name="first_name"
                            placeholder="Heading"
                            className={classNames("", {
                              "is-invalid": errors?.first_name,
                            })}
                            {...register("first_name", {
                              required: "Heading is required",
                            })}
                          />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Contact No.</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="contact_no"
                            placeholder="Enter contact number"
                            className={classNames("", {
                              "is-invalid": errors?.contact_no,
                            })}
                            {...register("contact_no", {
                              required: "Contact number is required",
                              pattern: {
                                value: /^[6-9]\d{9}$/,
                                message:
                                  "Enter a valid 10-digit contact number",
                              },
                            })}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault(); // Block non-numeric input
                              }
                            }}
                            maxLength={10}
                          />
                          {errors?.contact_no && (
                            <div className="invalid-feedback">
                              {errors.contact_no.message}
                            </div>
                          )}
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>E-Mail</Form.Label>

                        <InputGroup>
                          <Form.Control
                            disabled
                            type="text"
                            name="email"
                            placeholder="Heading"
                            className={classNames("", {
                              "is-invalid": errors?.email,
                            })}
                            {...register("email", {
                              required: "Heading is required",
                              pattern: {
                                value: /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z0-9_\-\.]+)\.\2)([A-Za-z0-9_\-\.]+\.)+([A-Za-z]{2,4})$/,
                                message: "Enter a valid email address",
                              },
                            })}
                          />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Tax Name</Form.Label>

                        <InputGroup>
                          <Form.Control
                            disabled
                            type="text"
                            name="tax_name"
                            placeholder="Heading"
                            className={classNames("", {
                              "is-invalid": errors?.tax_name,
                            })}
                            {...register("tax_name", {
                              required: "Heading is required",
                            })}
                          />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Tax No.</Form.Label>

                        <InputGroup>
                          <Form.Control
                            disabled
                            type="text"
                            name="tax_no"
                            placeholder="Heading"
                            className={classNames("", {
                              "is-invalid": errors?.tax_no,
                            })}
                            {...register("tax_no", {
                              required: "Heading is required",
                            })}
                          />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>PAN No.</Form.Label>

                        <InputGroup>
                          <Form.Control
                            disabled
                            type="text"
                            name="pan_no"
                            placeholder="Heading"
                            className={classNames("", {
                              "is-invalid": errors?.pan_no,
                            })}
                            {...register("pan_no", {
                              required: "Heading is required",
                            })}
                          />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="main-form-section mt-3">
                      <Form.Group>
                        <Form.Label>Commission</Form.Label>

                        <InputGroup>
                          <Form.Control
                            disabled
                            type="text"
                            name="commission"
                            placeholder="Heading"
                            className={classNames("", {
                              "is-invalid": errors?.commission,
                            })}
                            {...register("commission", {
                              required: "Heading is required",
                            })}
                          />
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>

                  <Row lg={12} style={{ marginTop: "50px" }}>
                    <Col lg={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label className="text-center">LOGO</Form.Label>
                          <Col sm={12} className="text-center">
                            <div className="image-preview-container">
                              <img
                                src={IMG_URL + getValues("logo")}
                                alt="Preview"
                                className="image-preview"
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label className="text-center">
                            Address Proof
                          </Form.Label>
                          <Col sm={12} className="text-center">
                            <div className="image-preview-container">
                              <img
                                src={IMG_URL + getValues("address_proof")}
                                alt="Preview"
                                className="image-preview"
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div className="main-form-section mt-3">
                        <Row className="justify-content-center">
                          <Form.Label className="text-center">
                            ID Card
                          </Form.Label>
                          <Col sm={12} className="text-center">
                            <div className="image-preview-container">
                              <img
                                src={IMG_URL + getValues("n_identity_card")}
                                alt="Preview"
                                className="image-preview"
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mt-5 pb-3">
                    <div className="d-flex justify-content-center">
                      <Link>
                        <CancelButton
                          name={"Back"}
                          handleClose={props.handleClose}
                        />
                      </Link>

                      {/* <SaveButton
                        name={"Save"}
                      // handleSubmit={handleSubmit(onSubmit)}
                      /> */}
                    </div>
                  </Row>
                </Row>
              </Form>
            </Card.Body>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default AddOffCanvance;
