import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link, useNavigate } from "react-router-dom";
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
library.add(fas);

const Paymentdone = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
 const navigate = useNavigate();
  const GetEditData = async () => {
    const response = await getData(`/admin/masters/crop/${id}`);
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
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("payment",props.calculateTotalAmount);
      finalData.append("from", props.searchDate);
       finalData.append("to", props.searchDateTo);
      const response = await putData(`/admin/delivery-boy/deliveryboy-payment/${id}`, finalData);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      navigate("/delivery-boy")
      setTimeout(() => {
         props.GetEditData();
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
          <Modal.Title id="contained-modal-title-vcenter">
           Delivery Boy Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <Form.Label>Save as payment done   </Form.Label>

                      {/* <InputGroup>
                        <Form.Control
                        readOnly
                          type="text"
                          name="name"
                          placeholder="Payment"
                          className={classNames("", {
                            "is-invalid": errors?.payment,
                          })}
                          {...register("payment", {
                            required: "Payment Is Required",
                             validate: (value) => {
                              const words = value.match(/\b\w+\b/g); 
                              return (
                                !words ||
                                words.length <= 50 ||
                                "Crop must be 100 words or less"
                              );
                            },
                          })}
                        />
                      </InputGroup>
                      {errors.payment && (
                        <span className="text-danger">
                          {errors.payment.message}
                        </span>
                      )} */}
                    </Form.Group>
                  </Row>
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

export default Paymentdone;
