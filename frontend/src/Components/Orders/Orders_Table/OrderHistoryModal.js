import React from "react";
import { Modal, Row, Table, Badge } from "react-bootstrap";
import { CancelButton } from "../../common/Button";

const OrderHistoryModal = (props) => {
  const data = props?.data || {};
  const getOrderHistory = (history) => {
    if (!history) return [];

    return [
      { label: "Order Created", date: history.createdAt },
      { label: "Order Processed", date: history.processedAt },
      { label: "Pickup Scheduled", date: history.itemPickedAt },
      { label: "Shipped", date: history.out_for_delivery },
      { label: "Delivered", date: history.deliveredAt },
      { label: "Cancelled", date: history.cancelledAt },
      { label: "Return Requested", date: history.returnRequestedAt },
      { label: "Return Scheduled", date: history.returnScheduledAt },
      { label: "Returned", date: history.returnedAt },
      { label: "Refunded", date: history.refundedAt },
    ].filter((item) => item.date); // show only completed steps
  };

  return (
    <Modal {...props} onHide={props.handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order & Payment History</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ================= Order History ================= */}
        <h6 className="fw-bold mb-2">Order History</h6>

        {data?.Order_History ? (
          <Table bordered size="sm" className="mb-4">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {getOrderHistory(data.Order_History).map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Badge bg="secondary">{item.label}</Badge>
                  </td>
                  <td>{new Date(item.date).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted">No order history found</p>
        )}

        {/* ================= Payment History ================= */}
        <h6 className="fw-bold mb-2">Payment History</h6>

        {data?.Advance_Payments?.length > 0 ? (
          <Table bordered size="sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {data.Advance_Payments.map((pay, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Badge bg="info">{pay?.Payment_Method?.name}</Badge>
                  </td>
                  <td className="fw-bold text-success">
                    ₹ {Number(pay.amount).toFixed(2)}
                  </td>
                  <td>{new Date(pay.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted">No payment history found</p>
        )}

        {/* ================= Close Button ================= */}
        <Row className="mt-4">
          <div className="d-flex justify-content-center">
            <CancelButton name="Close" handleClose={props.handleClose} />
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OrderHistoryModal;
