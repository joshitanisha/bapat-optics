import React from "react";
import { Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

function OrderPlacedModal({ show, handleClose }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      className="order-placed-modal"
    >
      <Modal.Body className="text-center p-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <CheckCircle size={80} className="text-green-500 mb-3" />
        </motion.div>

        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fw-bold text-success"
        >
          Order Return Successfully!
        </motion.h4>
{/* 
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted mt-2"
        >
          Thank you for your purchase. Your order is being processed.
        </motion.p> */}

        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="success"
            className="mt-4 px-4"
            onClick={handleClose}
          >
            Continue Shopping
          </Button>
        </motion.div> */}
      </Modal.Body>
    </Modal>
  );
}

export default OrderPlacedModal;
