import React, { useContext, useState, useEffect } from "react";
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
import useRazorpay from "react-razorpay";
library.add(fas);

const EditOffCanvance = (props) => {
  const { postData, getData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const GetEditData = async () => {
    const response = await getData(`/admin/my-wallet`);
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

  const [amount, setAmount] = useState("");
  const [Razorpay, openRazorpay] = useRazorpay();
  const [razorid, setRazorId] = useState();

  const handleRazorpay = async (storedValue) => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true); // Show loading state

    const options = {
      key: "rzp_test_I05KCFb1v5JJRc",
      amount: Math.round(storedValue) * 100, // convert amount to paise
      currency: "INR",
      name: "Hiclousia",
      description: "Test Transaction",
      image:
        "http://localhost:3000/static/media/hippicart-logo.427718645d3015dbf003.png",

      handler: async (res) => {
        await setRazorId(res.razorpay_payment_id);
        onSubmit({ amount: storedValue, razor_id: res.razorpay_payment_id });
        console.log(res, "ttttttttttttttttttttttttttttt");
      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#052c65",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();

    rzpay.on("payment.failed", function (response) {
      console.log("Payment failed:", response);
      setIsLoading(false); // Hide loading on error
      alert("Payment failed. Please try again.");
    });
  };

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("amount", data?.amount);
      finalData.append("transaction_type", "credit");
      finalData.append("transaction_id", data?.razor_id);
      finalData.append("description", "Amount Credited By You");

      const response = await postData(`/admin/wallet/transaction/`, finalData);

      if (response?.success) {
        await setShowModal({ code: response.code, message: "Amount Credited" });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }

      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
        setIsLoading(false); // Hide loading after submission
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Hide loading on error
      alert("An error occurred. Please try again.");
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
            Add Money
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form role="form">
            <Row className="d-flex justify-content-center">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="d-flex justify-content-center">
                      <Form.Label>Amount</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="amount"
                        placeholder="Amount..."
                        className={classNames("", {
                          "is-invalid": errors?.amount,
                        })}
                        {...register("amount", {
                          required: "Amount is required",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Please enter a valid number",
                          },
                        })}
                        onKeyDown={(e) => {
                          const allowedKeys = [
                            "ArrowLeft",
                            "ArrowRight",
                            "Backspace",
                            "Tab",
                            "Delete",
                          ];
                          if (
                            !/[0-9]/.test(e.key) &&
                            !allowedKeys.includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => setAmount(e.target.value)}
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

                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={() => handleRazorpay(amount)}
                  >
                    Pay
                  </button>
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
