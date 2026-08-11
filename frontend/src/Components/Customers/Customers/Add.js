import React, { useContext } from "react";
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
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import Select from "react-select";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const id = props.show;
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    control,
    clearErrors,
    setError,
  } = useForm();
 const { loading, withLoader } = useLoader();
  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("amount", data?.amount);
      finalData.append("transaction_type", data?.transaction_type?.value);
      const response = await withLoader(() => postData(
        `/admin/customer/wallet-transaction/${id}`,
        finalData
      ));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
        setTimeout(() => {
          setShowModal(0);
          props.handleClose();
        }, 1000);
      } else {
        setError("amount", {
          type: "manual",
          message: response?.errors || "Invalid amount",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const dropdownList = [
    {
      value: "credit",

      label: "Add amount",
    },
    {
      value: "debit",

      label: "Minus Amount",
    },
  ];
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
            Add Wallet Amount
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Transaction Type</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="transaction_type" 
                        {...register("transaction_type", {
                          required: "Select Transaction Type",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            // defaultValue={dropdownList[0]}
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.transaction_type
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={dropdownList}
                            // onChange={(selectedOption) => {
                            //   field.onChange(selectedOption);
                            //   clearErrors("discount");
                            // }}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.transaction_type && (
                      <span className="text-danger">
                        {errors.transaction_type.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Amount</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Amount"
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("amount", {
                          required: "Amount is required",
                        })}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) && // not a digit
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </InputGroup>
                    {errors.amount && (
                      <span className="text-danger">
                        {errors.amount.message}
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

export default AddOffCanvance;
