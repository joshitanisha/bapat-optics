import { Form, Modal } from "react-bootstrap";
import "./Success_Modal.css";
import Successfull_Lottie from "../../../animation/Successfull_Lottie/Successfull_Lottie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Success_Modal = (props) => {
  
  // setTimeout(() => {
  //     props?.onHide()

  // }, 5000);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.show) {
      const timer = setTimeout(() => {
        props?.onHide();
        navigate(props.link);
      }, 2000);

      return () => clearTimeout(timer); // cleanup if modal closes earlier
    }
  }, [props.show, props.onHide, props.link, navigate]);

  return (
    <Modal className="Success_Modal" size="md" {...props} centered>
      <div className="absolute_div">
        <div className="animation_holder">
          {/* <Green_Check_Lottie /> */}
          <Successfull_Lottie />
        </div>
      </div>

      <Modal.Body>
        <p className="success_text">{props?.successText}</p>
      </Modal.Body>
    </Modal>
  );
};

export default Success_Modal;
