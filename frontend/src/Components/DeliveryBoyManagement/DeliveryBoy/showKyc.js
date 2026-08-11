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

const ShowKYC = (props) => {
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

  const GetEditData = async (id) => {
    const response = await getData(
      `/admin/delivery-boy/${id}?store_id=${store_id?.value || ""}&date=${
        date || ""
      }`
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
    GetEditData(id);
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
           KYC Details
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
                  {/* <Col md={5}>
                    <Form.Control
                      type="date"
                      placeholder="Start Date"
                      max={today}
                      value={date}
                      onChange={(e) => handleDateChange(e)}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      className="filters-section__btn "
                      onClick={() => {
                        setStoreId("");
                        setDate("");
                      }}
                    >
                      Refresh
                    </Button>
                  </Col> */}
                </Row>
              </div>
            </Row>

            <div className="row">
              <h4>KYC Details</h4>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>bank_name</h6>

                  <p>{data?.Bank_Detail?.bank_name}</p>
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>ifsc</h6>

                  <p>{data?.Bank_Detail?.ifsc}</p>
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>account_no</h6>

                  <p>{data?.Bank_Detail?.account_no}</p>
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>Aadhar Image</h6>

                  <img
                    src={IMG_URL + data?.Kyc_Document?.aadhar_image}
                    alt="Order Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      // margin: "10px 0",
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>Pan Image</h6>
                  <img
                    src={IMG_URL + data?.Kyc_Document?.pan_image}
                    alt="Order Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      // margin: "10px 0",
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>Driving License Image</h6>
                  <img
                    src={IMG_URL + data?.Kyc_Document?.driving_license_image}
                    alt="Order Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      // margin: "10px 0",
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>Driving License Back Image</h6>
                  <img
                    src={
                      IMG_URL + data?.Kyc_Document?.driving_license_back_image
                    }
                    alt="Order Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      // margin: "10px 0",
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>Aadhar Back Image</h6>
                  <img
                    src={IMG_URL + data?.Kyc_Document?.aadhar_back_image}
                    alt="Order Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      // margin: "10px 0",
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="box_hodler">
                  <h6>Pan Back Image</h6>
                  <img
                    src={IMG_URL + data?.Kyc_Document?.pan_back_image}
                    alt="Order Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      // margin: "10px 0",
                    }}
                  />
                </div>
              </div>
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

export default ShowKYC;
