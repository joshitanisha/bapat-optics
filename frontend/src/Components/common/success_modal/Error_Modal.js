import { Form, Modal } from "react-bootstrap";
import "./Success_Modal.css";
// import Successfull_Lottie from "../../../animation/Successfull_Lottie/Successfull_Lottie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Error_Modal = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.show) {
      const timer = setTimeout(() => {
        props?.onHide();
        // navigate(props.link);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [props.show, props.onHide, props.link, navigate]);

  return (
    <Modal className="Success_Modal want_modal error_modal_popup" size="md" {...props} centered>
      <Modal.Body className="modal_sec ">
        <p className="success_text" style={{ color: "red" }}>
          {props?.successText}
        </p>
        <div className="form-group text-center">
          <button className="continue-btn" type="button" onClick={props?.onHide}>
            Close
          </button>
           
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Error_Modal;
