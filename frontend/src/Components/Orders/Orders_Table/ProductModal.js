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
import Lense_prescription_modal_show from "./Lense_prescription_modal_show";
import { getData, postData } from "../../../utils/api";
import { Select2Data } from "../../../utils/common";
library.add(fas);

const ProductModal = (props) => {
  const data = props?.data;
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

  const handleStatusChange = async (value, id) => {
    const data = {
      stock_id: value,
    };
    const response = await postData(`/admin/orders/stoct/assign/${id}`, data);
    props.getDataAll();
    props.handleClose();
    // setChangeStatus(response);
  };

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
                <th className="sr">Sr. No.</th>
                <th className="tax-name">Products </th>
                <th className="tax-name">Category </th>
                <th className="tax-name">Lens Type </th>
                <th className="tax-name">Addon </th>
                <th className="tax-name">Lens </th>

                <th className="tax-name">Quantity </th>
                <th className="tax-name">Sub Total </th>

                <th className="tax-name">Shipping Charges </th>

                <th className="tax-name">Offer Discount </th>
                <th className="tax-name">Coupon Discount </th>
                <th className="tax-name">Total Tax </th>
                <th className="tax-name">Total Amount</th>
                <th className="tax-name">Prescription</th>
                <th className="tax-name">Barcode No.</th>
                <th className="tax-name">Stock Status</th>
                <th className="tax-name">Lens Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.length > 0 &&
                data?.map((item, index) => (
                  <tr className="" key={index}>
                    <td>{++index}</td>
                    <td className="width_dertails_name_div">
                      {item?.Product?.name}
                    </td>
                    <td>{item?.Product?.p_category?.name}</td>
                    <td>{item?.Prescription?.LensType?.name}</td>
                    <td>{item?.Prescription?.Addon?.name}</td>
                    <td>{item?.Prescription?.Lense?.name}</td>

                    <td>{item?.quantity}</td>

                    <td>{item?.total_selling_price}</td>

                    <td>{item?.delivery_charges}</td>

                    <td>{item?.offer_discount}</td>

                    <td>{item?.coupon_discount}</td>
                    <td>
                      {Number(item?.total_tax) +
                        Number(item?.Prescription?.tax_amount || 0)}
                    </td>
                    <td>{item?.total_amount}</td>
                    <td>
                      <button
                        className="action-btn btn-primary"
                        onClick={() => {
                          handelclick(item?.Prescription);
                        }}
                      >
                        View Prescription
                      </button>
                    </td>

                    {item?.Product?.barcode_status ? (
                      <td>
                        <td>
                          {!item?.stock_id ? (
                            <select
                              style={{ width: "200px" }}
                              value={item?.stock_id || ""}
                              onChange={(e) => {
                                console.log("changed:", e.target.value);
                                handleStatusChange(e.target.value, item.id);
                              }}
                              className="form-select form-control"
                            >
                              <option value="">Select Stock</option>

                              {item?.Product?.Stocks?.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.barcode_no} - {s.model}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>
                              {item?.Stock?.barcode_no}-{item?.Stock?.model}
                            </span>
                          )}
                        </td>

                        {/* {item.stock_id === null ? (
                          <select
                            style={{ width: "200px" }}
                            value={item?.status || ""}
                            onChange={(e) =>
                              handleStatusChange(e.target.value, item.id)
                            }
                            className="form-select form-control"
                          >
                            {item?.Product?.Stocks?.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.barcode_no} - {s.model}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>
                            {item?.Stock?.barcode_no}-{item?.Stock?.model}
                          </span>
                        )} */}
                      </td>
                    ) : (
                      <td>NA</td>
                    )}

                    <td>{item?.Stock?.StockStatus?.name}</td>
                    <td>{item?.Lens_Stock?.StockStatus?.name}</td>
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

      <Lense_prescription_modal_show
        id={Id}
        // product={product}
        // variant={variant}
        // product_id={product_id}
        // lensId={lensId}
        // lensOptionId={lensOptionId}
        show={lensemodal}
        onHide={() => setLensemodal(false)}
      />
    </>
  );
};

export default ProductModal;
