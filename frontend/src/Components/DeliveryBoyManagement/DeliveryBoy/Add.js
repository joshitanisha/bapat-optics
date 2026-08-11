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
import Paymentdone from "./PaymentDone";
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
  const [searchDate, setSearchDate] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  const GetEditData = async () => {
    const response = await getData(
      `/admin/delivery-boy/orders/${id}?store_id=${
        store_id?.value || ""
      }&from=${searchDate || ""}&to=${searchDateTo || ""}`
    );
    if (response?.success) {
      setCategories(response?.data);
    }
  };

  const GetPaymentMethodData = async () => {
    const response = await getData(
      `/admin/delivery-boy/paymen-method-order/${id}?store_id=${
        store_id?.value || ""
      }&from=${searchDate || ""}&to=${searchDateTo || ""}`
    );
    if (response?.success) {
      setPaymentData(response?.data);
    }
  };

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
    GetPaymentMethodData();
  }, [props.show, searchDate, searchDateTo]);

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

  const [showModalPayment, setShowModalPayment] = useState();
  const [paymentInput, setPaymentInput] = useState("");

  const handleOpen = () => {
    setShowModalPayment(id);
  };
  const handleClose = () => setShowModalPayment(false);
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
            Order List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="package-details-section mb-3">
            <Row>
              <div>
                <Row>
                  {/* <Col md={5}>
                    <Select
                      options={vendors}
                      value={store_id}
                      placeholder="Select Store"
                      onChange={(e) => setStoreId(e)}
                      className="filters-section__dropdown"
                      classNamePrefix="react-select"
                    />
                  </Col> */}
                  <Col md={5}>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="From"
                      value={searchDate}
                      onChange={(e) => {
                        setSearchDate(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md={5}>
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="To"
                      value={searchDateTo}
                      onChange={(e) => {
                        setSearchDateTo(e.target.value);
                      }}
                    />
                  </Col>

                  <Col md={2}>
                    <Button
                      className="filters-section__btn "
                      onClick={() => {
                        // setStoreId("");
                        setSearchDate("");
                        setSearchDateTo("");
                      }}
                    >
                      Refresh
                    </Button>
                  </Col>
                </Row>
              </div>
            </Row>

            <div className="row mt-3">
              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>Order Asigned</h6>
                  <p>{data?.length}</p>
                </div>
              </div>

              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>Card</h6>
                  <p>{paymentData?.Card}</p>
                </div>
              </div>

              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>Cash</h6>
                  <p>{paymentData?.Cash}</p>
                </div>
              </div>

              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>QR</h6>
                  <p>{paymentData?.QR}</p>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>Online</h6>
                  <p>{paymentData?.Online}</p>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>Wallet</h6>
                  <p>{paymentData?.Wallet}</p>
                </div>
              </div>

              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6">
                <div className="count_card_holder">
                  <h6>Total Amount</h6>
                  <p>
                    {parseFloat(paymentData?.Online || 0) +
                      parseFloat(paymentData?.QR || 0) +
                      parseFloat(paymentData?.Wallet || 0) +
                      parseFloat(paymentData?.Card || 0) +
                      parseFloat(paymentData?.Cash || 0)}
                  </p>
                  {/* <p>{calculateTotalAmount()}</p> */}
                </div>
              </div>
              {/* {searchDateTo && searchDate && (
                <div
                  className="col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6"
                  onClick={handleOpen}
                  style={{ cursor: "pointer" }}
                >
                  <div className="count_card_holder">
                    <h6>Payment Done</h6>
                  </div>
                </div>
              )} */}
            </div>
            <hr />
            <h4>Order Details</h4>
            <div className="pending-table_holder">
              <Table striped bordered hover responsive center>
                <thead>
                  <tr className="">
                    <th className="sr">Sr. No.</th>
                    <th className="sr">Date/Time</th>
                    <th className="tax-name">Invoice No.  </th>
                    {/* <th className="tax-name">Store</th> */}
                    <th className="tax-name">Status </th>
                    <th className="active">Address</th>
                    <th className="active">Amount </th>
                    <th className="active">Payment Method</th>
                    <th className="active">Shipping Charges</th>
                    <th className="active">Total Kilometer</th>

                    <th className="active">Delivery Boy Charges</th>
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
                            {" "}
                            <div className="order-details_info">
                              <div className="order-id">
                                {calculateTimeAgo(d?.updatedAt)}
                              </div>
                              <div className="order-info">
                                <span>
                                  {
                                    new Date(d?.updatedAt)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="order-details_info">
                              <div className="order-info">
                                <span>{formatTimeInIST(d?.updatedAt)} IST</span>
                              </div>
                            </div>
                          </td>
                          <td>{d?.invoice_no}</td>
                          {/* <td>{d?.Store_Detail?.store_name}</td> */}
                          <td>{d?.Order_status?.name} </td>
                          <td>
                            {d?.User_Address?.first_name}{" "}
                            {d?.User_Address?.last_name}
                            <div className="text-highlight">
                              {d?.User_Address?.floor} floor ,{" "}
                              {d?.User_Address?.building} building ,
                              {d?.User_Address?.apartment} ,{" "}
                              {d?.User_Address?.street},
                              {d?.User_Address?.contact_no}
                            </div>
                          </td>
                          <td>{d?.total_amount}</td>
                          <td>{d?.Payment_Method?.name}</td>
                          <td>{d?.delivery_charges}</td>
                          <td>{d?.total_kilometer}</td>

                          <td>{d?.deliveryboy_payment}</td>
                          <td>
                            {d?.deliveryboy_payment_status
                              ? "Payment Done"
                              : "Not Done"}
                          </td>
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

      {showModalPayment ? (
        <Paymentdone
          searchDate={searchDate}
          searchDateTo={searchDateTo}
          handleClose={handleClose}
          setShow={setShowModalPayment}
          show={showModalPayment}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default AddOffCanvance;
