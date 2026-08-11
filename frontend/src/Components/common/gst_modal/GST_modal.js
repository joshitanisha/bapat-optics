import React, { useState } from "react";
import "./GST_modal.css";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Green_Btn from "../green_btn/Green_Btn";
import Successfull_Modal from "../Successfull_Modal/Successfull_Modal";
import Black_Btn from "../black_btn/Black_Btn";
// import Black_Btn from "../../common_btn/black_btn/Black_Btn";

const GST_modal = ({ GSTNumber, setGSTNumber, ...props }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // onSubmit handler
  const onSubmit = (data) => {
    setGSTNumber(data.gstNumber);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    props.onHide();
    reset();
  };

  return (
    <>
      <Modal
        className="Set_New_Password_Modal Reset_Password_Modal Login_Modal GST_modal"
        size="md"
        {...props}
        centered
      >
        <Modal.Body>
          <div className="reset_pass_main_form">
            <div className="close_img_div">
              <div className="title_div">
                <p className="title">GST</p>
              </div>
              <img
                src="/assets/images/icons/close.png"
                className="close_img"
                onClick={props?.onHide}
              />
            </div>

            <div className="reset_pass_div login_div">
              <div className="login_form_div">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="gray_input_group input_group">
                    <Form.Label className="label_text">
                      Enter GST Number
                    </Form.Label>
                    <div className="password_holder">
                      <Form.Control
                        type="text"
                        placeholder="Enter GST Number"
                        {...register("gstNumber", {
                          required: "GST Number is required",
                          pattern: {
                            value:
                              /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // Optional GST regex
                            message: "Invalid GST Number format",
                          },
                        })}
                      />
                      {errors?.gstNumber && (
                        <sup className="text-danger">
                          {errors.gstNumber.message}
                        </sup>
                      )}
                    </div>
                  </Form.Group>

                  <div className="btns_holder d-flex justify-content-center gap-2 mt-3">
                    <Black_Btn btnText={"Cancel"} onClick={props.onHide} />
                    <Green_Btn btn_name={"Save"} type="submit" />
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Successfull_Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        message="GST Number Saved Successfully!"
      />
    </>
  );
};

export default GST_modal;
