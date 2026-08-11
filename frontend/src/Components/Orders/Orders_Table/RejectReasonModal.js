import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import classNames from "classnames";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { CancelButton, SaveButton } from "../../common/Button";
import { useForm } from "react-hook-form";
library.add(fas);

const RejectReasonModal = (props) => {
  const { postData } = useContext(Context);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("type", "reject");
      finalData.append("message", data.message);
      const response = await postData(`/admin/orders/accept-refund-order/${props?.show}`, finalData);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.data });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        reset();
        props?.getRefundDataAll();
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
            Reject Reason
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Reason</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        as="textarea"
                        name="message"
                        placeholder="Message ... "
                        className={classNames("", {
                          "is-invalid": errors?.message,
                        })}
                        {...register("message", {
                          required: "Message is required",
                        })}
                      />
                    </InputGroup>
                    {errors.message && (
                      <span className="text-danger">{errors.message.message}</span>
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
                    name={"Submit"}
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                </div>
              </Row>
            </Row>
          </Form>
        </Modal.Body>
      </Modal >
      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default RejectReasonModal;
