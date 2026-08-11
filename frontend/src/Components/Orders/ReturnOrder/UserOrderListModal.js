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

import { Modal, Row, Table } from "react-bootstrap";
import { CancelButton } from "../../common/Button";

import { getData, postData } from "../../../utils/api";
import { Select2Data } from "../../../utils/common";
library.add(fas);

const UserOrderListModal = ({
  user_id,
  setSelectedOrder,
  selectedOrder,
  ...props
}) => {
  const [orders, setOrders] = useState([]);
  const [lensemodal, setLensemodal] = useState(false);
  const [Id, setId] = useState(null);
  // const handelclick = async (prescription) => {
  //   if (prescription?.pdf) {
  //     // Open PDF preview
  //     window.open(prescription.pdf, "_blank");
  // } else {
  //   await setId(prescription?.id);
  //   setLensemodal(true);
  // }
  // };

  const { IMG_URL } = useContext(Context);

  const handelclick = async (prescription) => {
    try {
      if (prescription?.pdf) {
        const fileUrl = `${IMG_URL}${prescription.pdf}`;
        console.log("FILE URL =", fileUrl);

        const response = await fetch(fileUrl);

        if (!response.ok) {
          alert("File not found on server");
          return;
        }

        const blob = await response.blob();
        const fileType = blob.type;

        // PDF download
        if (fileType === "application/pdf") {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "Invoice.pdf";
          link.click();
          window.URL.revokeObjectURL(url);
          return;
        }

        // Image download (jpg, jpeg, png, webp)
        if (fileType.startsWith("image/")) {
          const extension = fileType.split("/")[1]; // jpeg, png, etc.
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Invoice.${extension}`;
          link.click();
          window.URL.revokeObjectURL(url);
          return;
        }

        // Unsupported file
        alert("Unsupported file type");
      } else {
        await setId(prescription?.id);
        setLensemodal(true);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };

  const userOrderGet = async (user_id) => {
    const response = await getData(
      `/admin/offline-order/user-return-order/${user_id}`,
    );
    if (response.success) {
      setOrders(response?.data);
    }
    // props.getDataAll();
  };

  useEffect(() => {
    if (user_id) {
      userOrderGet(user_id);
    }
  }, [user_id]);

  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table
            striped
            bordered
            hover
            responsive
            center
            className="tab-radio "
          >
            <thead>
              <tr className="">
                <th className="sr"></th>
                <th className="sr">Sr. No.</th>
                <th className="tax-name">Invoice Number </th>
                <th className="tax-name">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 &&
                orders.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="radio"
                        name="selectedOrder"
                        checked={selectedOrder?.id === item.id}
                        onChange={() => {
                          setSelectedOrder(item);
                          props.handleClose();
                        }}
                      />
                    </td>
                    <td>{index + 1}</td>

                    <td className="width_dertails_name_div">
                      {item.invoice_no}

                      {/* 🔁 Product loop */}
                      {item?.Product_Order_Details?.map((product, pIndex) => (
                        <div key={pIndex} className="mt-1 text-muted">
                          {pIndex + 1} : {product?.Product?.name} ×{" "}
                          {product.quantity} — ₹{product.total_amount}
                        </div>
                      ))}
                    </td>

                    <td className="width_dertails_name_div">
                      {item.total_amount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Row className="mt-5 pb-3">
            <div className="d-flex justify-content-center">
              <Link>
                <CancelButton name={"Close"} handleClose={props.handleClose} />
              </Link>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserOrderListModal;
