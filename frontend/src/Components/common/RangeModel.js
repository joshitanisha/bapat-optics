import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import "./ModelSave.css";
import { postData } from "../../utils/api";
import { use } from "react";

const RangeModel = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const response = await postData(`/admin/store/my-store/delivery-range`, data);

    if (response?.success) {
      props.handleClose(); // close modal after submit (optional)
      reset(); // reset form after submission
      // await setShowModal({ code: response.code, message: "Amount Credited" });
    } else {
      // await setShowModal({ code: response?.code, message: response?.errors });
    }

    setTimeout(() => {
      // setShowModal(0);
      // props.handleClose();
      // setIsLoading(false); // Hide loading after submission
    }, 1000);

  };

  useEffect(() => {
    if (props.store) {
      reset(props.store); // reset form when modal opens
    }
  }
    , [props.store]);

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      centered
      className={`save-modal modal fade ${props.show ? "show" : ""}`}
      style={{ display: props.show ? "block" : "none" }}
    >
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">

            <label htmlFor="rangeInput" className="form-label">Update Delivery Range In KM</label>
            <input
              type="text"
              id="rangeInput"
              name="delivery_range"
              className={`form-control ${errors.delivery_range ? "is-invalid" : ""}`}
              placeholder="Enter something..."
              {...register("delivery_range", { required: "Please Enter The Range" })}
            />
            {errors.delivery_range && (
              <small className="text-danger">{errors.delivery_range.message}</small>
            )}
          </div>

          <div className="d-flex ">
            <Button variant="danger" onClick={props.handleClose} className="me-2">
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RangeModel;
