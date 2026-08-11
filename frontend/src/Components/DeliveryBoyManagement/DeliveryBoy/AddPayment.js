import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";

import {
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Table,
  Button,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import classNames from "classnames";
const moment = require("moment");
library.add(fas);

const AddOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL, Select2Data, editStatusData } =
    useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const calculateTimeAgo = (date) => {
    const createdAt = new Date(date);
    const now = new Date();
    const diffInMilliseconds = now - createdAt;

    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays >= 1) {
      return `${diffInDays} Day${diffInDays > 1 ? "s" : ""} Ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} Hour${diffInHours > 1 ? "s" : ""} Ago`;
    } else {
      return `${diffInMinutes} Min Ago`;
    }
  };

  const formatTimeInIST = (date) => {
    const createdAt = new Date(date);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const istTime = createdAt.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      ...options,
    });
    // setFormattedTime(`${istTime} IST`);
    return istTime;
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const [data, setCategories] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [store_id, setStoreId] = useState({});
  const [date, setDate] = useState("");

  const GetEditData = async () => {
    const response = await getData(
      `/admin/delivery-boy/payment/${id}?store_id=${
        store_id?.value || ""
      }&date=${date || ""}`
    );
    if (response?.success) {
      setCategories(response?.data);
    }
  };

  // const GetPaymentMethodData = async () => {
  //   const response = await getData(
  //     `/admin/delivery-boy/paymen-method-order/${id}?store_id=${store_id?.value || ""
  //     }&date=${date || ""}`
  //   );
  //   if (response?.success) {
  //     setPaymentData(response?.data);
  //   }
  // };

  // const GetAllVendors = async () => {
  //   const response = await getData(
  //     `/common/masters/delivery-boys-vendors/${id}`
  //   );
  //   if (response?.success) {
  //     setVendors(await Select2Data(response?.data, "store_id"));
  //   }
  // };

  // useEffect(() => {
  //   GetAllVendors();
  // }, [props.show]);

  useEffect(() => {
    GetEditData();
    // GetPaymentMethodData();
  }, [id, store_id, date]);

  const [today, setToday] = useState("");
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    setToday(formattedDate);
  }, []);

  const calculateTotalAmount = () => {
    if (Array.isArray(data)) {
      return data
        .reduce((total, order) => {
          return total + parseFloat(order.total_amount || 0);
        }, 0)
        .toFixed(2);
    }
    return 0;
  };

  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="AddOffCanvance_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Payment List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="package-details-section mb-3">
        
            <h4>Order Details</h4>
            <div className="pending-table_holder">
              <Table striped bordered hover responsive center>
                <thead>
                  <tr className="">
                    <th className="sr">Sr. No.</th>
                    <th className="tax-name">Order Number </th>
                    <th className="sr">Date</th>
                    <th className="tax-name">Product Name </th>
                    <th className="tax-name">quantity</th>
                    <th className="tax-name">Actual amount </th>

                    <th className="active">Receive Amount</th>
                    <th className="active">Payment Method </th>
                    <th className="active">Payment Status </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data?.map((d, index) => {
                      return (
                        <tr className="" key={index}>
                          <td>{index + 1}.</td>
                          <td>
                            {d?.Payment_Collect?.Product_Order?.invoice_no}{" "}
                          </td>
                          <td>
                            {" "}
                            <div className="order-details_info">
                              <div className="order-id">
                                {calculateTimeAgo(d?.createdAt)}
                              </div>
                              <div className="order-info">
                                <span>
                                  {
                                    new Date(d?.createdAt)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="order-details_info">
                              <div className="order-info">
                                <span>{formatTimeInIST(d?.createdAt)} IST</span>
                              </div>
                            </div>
                          </td>

                          <td className="width_dertails_name_div">{d?.Product?.name} </td>
                          <td>{d?.quantity} </td>

                          <td>{d?.total_amount}</td>

                          <td>{d?.receive_payment}</td>
                          <td>{d?.Payment_Method?.name}</td>
                          <td>{d?.Collect_Status?.name}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {data && data?.length < 1 && (
                <Row className="mt-5 pb-3">
                  <div className="d-flex justify-content-center">
                    <h4> No Data Found </h4>
                  </div>
                </Row>
              )}
            </div>
          </div>
        </Modal.Body>
        <Row className="mt-5 pb-3">
          <div className="d-flex justify-content-center">
            <Link>
              <CancelButton name={"Close"} handleClose={props.handleClose} />
            </Link>
          </div>
        </Row>
      </Modal>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default AddOffCanvance;
