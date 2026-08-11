import React from "react";
import { Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

function ErrorModal({ show, handleClose ,message}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      className="error-modal"
    >
      <Modal.Body className="text-center p-5">
        {/* Animated Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <XCircle size={80} className="text-red-500 mb-3" />
        </motion.div>

        {/* Error Title */}
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fw-bold text-danger"
        >
          {message ||"Something Went Wrong!"}
        </motion.h4>

        {/* Error Description */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted mt-2"
        >
          We couldn’t process your request. Please try again later.
        </motion.p> */}

        {/* Close Button */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="danger"
            className="mt-4 px-4"
            onClick={handleClose}
          >
            Close
          </Button>
        </motion.div> */}
      </Modal.Body>
    </Modal>
  );
}

export default ErrorModal;
