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
import { Row, Col, Form, InputGroup, Modal, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import JoditEditor from "jodit-react";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { getData, IMG_URL, postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/products/rating/${id}`));
    reset(response?.data);
    setData(response?.data);
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  const [data, setData] = useState({});

  const onSubmit = async (data) => {
    try {
      console.log(data);

      // const sendData = new FormData();
      // sendData.append("response", data?.name);
      const response = await withLoader(() => postData(`/product/ratings/${id}`, data));
      console.log(response);
      if (response?.success) {
        setData(response?.data);
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({
          code: response?.code,
          message: response?.message,
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
          <Modal.Title id="contained-modal-title-vcenter">Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="justify-content-center">
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Review</Form.Label>
                    </div>
                    <div className="border-line mt-3"></div>
                    <div className="d-flex flex-colomn">
                      <Col md={4}>
                        <p>By :-{getValues("User.name")} </p>
                      </Col>
                      <Col md={6}>
                        <p>Email :- {getValues("User.email")} </p>
                      </Col>
                      <Col md={4}>
                        <p>{getValues("User.contact_no")} </p>
                      </Col>
                    </div>
                    <div className="heading-holder mt-3">
                      <h6>Product Details</h6>
                    </div>
                    <div className="package-details-section">
                      <div className="pending-table ">
                        <div className="d-flex  align-items-center">
                          <div className="text-center  ms-5">
                            <Form.Label>Name</Form.Label>
                            <p> {data?.Product?.name}</p>
                          </div>

                          <div className="text-center  ms-5">
                            <Form.Label>Brand</Form.Label>
                            <p>{data?.Product?.Brand?.name}</p>
                          </div>
                          <div></div>

                          {/* <div className="text-center  ms-5">
                            <Form.Label>Store</Form.Label>
                            <p>{data?.Product?.Store_Detail?.store_name}</p>
                          </div> */}
                          <div>

                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="d-flex flex-colomn mt-4">
                      <Col md={8}>
                        <p>
                          <b>{getValues("title")}</b>
                        </p>
                        <p>{getValues("review")}</p>
                      </Col>
                      <Col md={4}>
                        <img
                          src={IMG_URL + getValues("image")}
                          style={{ width: "10%" }}
                        />
                      </Col>
                    </div> */}
                  </Form.Group>
                  {/* <Button style={{ backgroundColor: "white" }}>
                    <Link
                      to={`/order-managements/single-order/${getValues("order_id")}`}
                      className=" text-decoration-none  "
                    >View Order
                    </Link>
                  </Button> */}
                </div>
              </Col>

              {/* <Col lg={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-start">
                    {" "}

                    <Col sm={12}>
                      <Form.Label className="text-center">
                        Reply
                      </Form.Label>
                      <Form.Group>
                        <Controller
                          name="response" // Provide the field name
                          control={control} // Pass the control object from useForm()
                          rules={{
                            required: "Reply is required",
                          }} // Validation rules
                          render={({ field }) => (
                            <JoditEditor
                              value={field.value}
                              onChange={(newContent) =>
                                field.onChange(newContent)
                              }
                              onBlur={field.onBlur}
                              className={classNames("", {
                                "is-invalid": !!errors.description,
                              })}
                              placeholder="reply...."
                            />
                          )}
                        />
                      </Form.Group>
                      {errors.response && (
                        <span className="text-danger">
                          {errors.response.message}
                        </span>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col> */}

              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <Link>
                    <CancelButton
                      name={"Close"}
                      handleClose={props.handleClose}
                    />
                  </Link>
                  {/* <SaveButton
                    name={"Save"}
                    handleSubmit={handleSubmit(onSubmit)}
                  /> */}
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
