import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import "./Schedule_Pickup.css";
import Select from "react-select";
import Header from "../../../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../../../utils/context";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalSave from "../../../common/ModelSave";
import { useNavigate } from "react-router";
import {  useLoader } from "../../../../utils/common";
function Schedule_Pickup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    isAllow,
    Per_Page_Dropdown,
    Select2Data,
    usertype,
    IMG_URL,
    postData,
  } = useContext(Context);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm();

  // State to handle manual input
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const handleDimensionChange = (selectedOption) => {
    const [len, wid, hei] = selectedOption.label.split(" X ");
    setLength(len);
    setWidth(wid);
    setHeight(hei);
  };

  const [data, setData] = useState({});
  const [dimensions, setDimensions] = useState([]);
  const [weight, setWeight] = useState("");
  const [dimension, setDimension] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const onSubmit = async (data) => {
    try {
      const formattedDate = new Date(data?.date).toDateString();
      const formattedTime = new Date(data?.time).toLocaleTimeString("en-GB", {
        hour12: false,
      });

      const DataToSend = new FormData();
      DataToSend.append("order_id", id);
      DataToSend.append("weight", data?.weight);
      DataToSend.append("dimension", data?.dimension?.label);
      DataToSend.append("date", formattedDate);
      DataToSend.append("time", data?.time);
      DataToSend.append("invoice_no", data?.invoice_number);

      const response = await withLoader(() => postData("/order/schedule-pickup", DataToSend));

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
        reset();
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        navigate("/order-managements/orders");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const GetEditData = async () => {
    const response = await getData(`/order/order-details/${id}`);
    reset(response?.data);
    setData(response?.data);
  };
  const GetAllDimensions = async () => {
    const response = await getData(`/all-package-dimansion`);
    setDimensions(SelectDimensionData(response?.data, "dimensions"));
  };
  useEffect(() => {
    GetAllDimensions();
    GetEditData();
  }, []);

  const SelectDimensionData = (data, name, other = false) => {
    return data.map((dataItem) => ({
      value: dataItem?.id,
      label: `${dataItem?.length} X ${dataItem?.width} X ${dataItem?.height}`,
      name: name,
    }));
  };

  console.log("dimensions", dimensions);

  return (
    <>
      <Header title={"Schedule Pickup"} link={"/employee/employee_details"} />
      <section className="Schedule_Pickup">
        {/* back button start */}
        <div className="back_btn_holder">
          <FontAwesomeIcon
            className="back-btn"
            icon={faAngleLeft}
            onClick={() => navigate("/orders/all-orders")}
          />{" "}
          Back
        </div>
        {/* back button end */}

        {/*  Order ID heading start */}
        <div className="order-title">
          <h6>
            Order ID: {data?.invoice_number}
            {/* <span className="text-highlight">
              <span className="text-warning mx-1">
                <b>✓</b>
              </span>
              prime
            </span> */}
          </h6>
        </div>
        {/*  Order ID heading end */}

        {/* Shipping From and Shipping to  start */}
        <div className="from-to-holder">
          <Row className="mb-4">
            <Col>
              <div className="order-details">
                <Table bordered responsive className="shipping-table">
                  <tbody>
                    <tr>
                      <td className="shipping-from">
                        <h6>Shipping From:</h6>
                        <p>
                          CMJ INDUSTRIES, GAT NO 1582, Bhange Industrial
                          Complex, Shop . 13, Near Swami Hotel, Dehu Alandi
                          Road Pune-411062, MAHARASHTRA
                        </p>
                      </td>
                      <td className="shipping-to">
                        <strong>Shipping To:</strong>
                        <p>
                          {data?.user?.first_name} {data?.user?.last_name} ,{" "}
                          {data?.address?.address} , {data?.address?.landmark} ,{" "}
                          {data?.address?.zip_code}
                          {/* Jadhav, Nishigandha Housing Society Rm 41, G Block
                          MIDC, Room No. 08, Sambhajinagar, Chinchwad, PIMPRI
                          CHINCHWAD-411019, MAHARASHTRA */}
                        </p>
                        <p>{data?.address?.contact_no}</p>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </div>
        {/* Shipping From and Shipping to  end */}

        {/* 1. Order Details start */}
        <div className="oder-detail-holder mb-3">
          <div className="heading-holder mt-3">
            <h6>1. Order Details</h6>
          </div>
          <div className="package-details-section">
            <div className="pending-table ">
              <Table
                striped
                bordered
                hover
                className="order-table"
                responsive
              >
                <tbody>
                  {data?.orders_details?.map((item, index) => (
                    <tr>
                      <td>
                        <img
                          src={IMG_URL + item?.product?.image}
                          alt="Product"
                          className="product-image"
                        />
                      </td>
                      <td className="order-details">
                        <div className="order-id text-highlight">
                          {/* CMJ INDUSTRIES Transparent Tape 2 Inch 48mm 50 Meter length 38 Micron Pack Of 06 Rolls */}
                          {item?.product?.name}{" "}
                          {item?.product?.short_description}
                        </div>
                        <div className="order-info">
                          <span className="span-font">
                            HSN: {item?.product?.hsn_code}
                          </span>
                        </div>

                        <div className="order-info">
                          <span className="span-font">
                            SKU: {item?.product?.sku_id}
                          </span>
                        </div>
                      </td>

                      <td className="product-name">
                        <div className="order-info">
                          <p className="mb-0">
                            <b>Price</b>
                          </p>
                          {/* <span className="span-font">(Inclusive Tax)</span> */}
                        </div>

                        <div className="order-info">
                          <span className="brown-text"> Rs. {item?.total}</span>
                        </div>
                      </td>
                      <td>
                        <div className="order-id">
                          <p>
                            <b>Quantity</b>
                          </p>
                        </div>
                        <div className="order-info">
                          <p>{item?.quantity}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              Total Amount (Inclusive Tax) : Rs. {data?.total}
            </div>
          </div>
        </div>
        {/* 1. Order Details end */}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* 2. Package Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>2. Package Details</h6>
            </div>
            <div className="package-details-section">
              {/* Package Weight */}
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Package Weight</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name={`weight`}
                      placeholder="Weight"
                      className={classNames("", {
                        "is-invalid": errors?.weight, // Adjusted error checking
                      })}
                      {...register(`weight`, {
                        required: "Weight is required",
                      })}
                      onKeyDown={(event) => {
                        const { key } = event;
                        const value = event.target.value;

                        // Allow only digits, Backspace, Tab, and one decimal point
                        if (
                          !/[0-9]/.test(key) && // Allow only digits
                          key !== "Backspace" && // Allow Backspace
                          key !== "Tab" && // Allow Tab
                          (key !== "." || value.includes(".")) // Prevent multiple decimal points
                        ) {
                          event.preventDefault();
                        }

                        // Prevent input if length exceeds 10 digits (not counting decimal point)
                        if (
                          value.replace(".", "").length >= 10 &&
                          key !== "Backspace" &&
                          key !== "Tab"
                        ) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <span className="span-font ms-3">g</span>
                  </div>
                  {errors.weight && (
                    <span className="text-danger">{errors.weight.message}</span>
                  )}
                </Col>
              </Row>

              {/* Package Dimensions */}
              <Row className="detail-row ">
                <Col md={4}>
                  <div className="detail-label">Package Dimensions</div>
                </Col>
                <Col md={4}>
                  <div className="d-flex  align-items-center">
                    <Controller
                      className="select-contoller"
                      name={`dimension`} // name of the field
                      control={control}
                      rules={{
                        required: "Select Dimensions",
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.dimension
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={dimensions}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                            handleDimensionChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        />
                      )}
                    />
                    {errors.dimension && (
                      <span className="text-danger">
                        {errors.dimension.message}
                      </span>
                    )}
                  </div>
                  <div className="dimensions-group">
                    <div className="dimension-item me-4">
                      <label className="dimension-label">Length</label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          disabled
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          className="dimension-input"
                        />
                        <Form.Label className="ms-1">cm</Form.Label>
                      </div>
                    </div>
                    <div className="dimension-item me-4">
                      <label className="dimension-label">Width</label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          disabled
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="dimension-input"
                        />
                        <Form.Label className="ms-1">cm</Form.Label>
                      </div>
                    </div>
                    <div className="dimension-item me-4">
                      <label className="dimension-label">Height</label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          disabled
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="dimension-input"
                        />
                        <Form.Label className="ms-1">cm</Form.Label>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Package Identifier */}
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Package Identifier</div>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    value={data?.invoice_number}
                    readOnly
                    className="detail-input"
                  />
                </Col>
              </Row>
            </div>
          </div>
          {/* 2. Package Details end */}

          {/* 3. Pickup Slot Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>3. Pickup Slot</h6>
            </div>
            <div className="package-details-section">
              {/* Pickup Slot */}
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Pickup Slot</div>
                </Col>
                <Col md={8}>
                  <div className="row">
                    {/* Pickup Day Dropdown */}
                    <div className="col-md-6">
                      <Form.Label>Pickup Day</Form.Label>
                      <Form.Control
                        type="date"
                        name={`date`}
                        min={new Date().toISOString().split("T")[0]}
                        placeholder="Date"
                        className={classNames("", {
                          "is-invalid": errors?.date,
                        })}
                        {...register(`date`, {
                          required: "Date Required",
                          validate: {
                            maxDate: (value) => {
                              const selectedDate = new Date(value);
                              const currentDate = new Date();

                              // Set time to 00:00:00 for both dates to ignore time part
                              selectedDate.setHours(0, 0, 0, 0);
                              currentDate.setHours(0, 0, 0, 0);

                              if (selectedDate < currentDate) {
                                return "Only Future Date Allowed";
                              }
                              return true;
                            },
                          },
                        })}
                      />
                      {errors?.date && (
                        <div className="invalid-feedback">
                          {errors.date.message}
                        </div>
                      )}
                    </div>

                    {/* Pickup Time Dropdown */}
                    <div className="col-md-6">
                      <Form.Label>Pickup Time</Form.Label>
                      <Form.Control
                        type="time"
                        name={`time`}
                        placeholder="Time"
                        className={classNames("", {
                          "is-invalid": errors?.time,
                        })}
                        {...register(`time`, {
                          required: "Time is required",
                          validate: {
                            minTime: (value) => {
                              if (new Date(value) < new Date()) {
                                return "Only Future Date Allow";
                              }
                              return true;
                            },
                          },
                        })}
                        min={
                          watch("date") ===
                            new Date().toISOString().split("T")[0]
                            ? new Date().toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "00:00"
                        } // Set min time based on selected date
                      />
                      {errors.time && (
                        <span className="text-danger">
                          {errors.time.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Display selected date and time */}
                </Col>
              </Row>
            </div>
          </div>
          {/* 3. Pickup Slot Details end */}

          {/* Total EasyShip start */}
          <div className="oder-detail-holder mb-3">
            <div className="package-details-section Total_EasyShip">
              <div className="fee-info">
                <div className="row">
                  <div className="col-md-4">
                    <p>Total Shipping Fee:</p>
                    <p className="text-highlight">Learn More</p>
                  </div>

                  <div className="col-md-8">
                    <p>
                      <b>Rs. 53.1</b>
                    </p>
                    <p>Shipping Fee: Rs. 53.1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Total EasyShip end */}

          {/* warning text-start */}
          <p className="warning-text brown-text">
            ⚠️ Please schedule your orders latest by 1:45pm IST on ESD and hand
            over timely to avoid late impact on metrics.
          </p>
          {/* warning text-end */}
          <div className="d-flex justify-content-center">
            <div className="text-center mt-4 mx-2">
              <button
                className="Back-button"
                type="submit"
                onClick={() => navigate("/orders/all-orders")}
              >
                {" "}
                Cancel
              </button>
            </div>

            <div className="text-center mt-4 mx-2">
              <button className="schedule-button" type="submit">
                Schedule Pickup
              </button>
            </div>
          </div>
        </Form>
        <ModalSave
          message={showModal.message}
          showErrorModal={showModal.code ? true : false}
        />
      </section>
    </>
  );
}

export default Schedule_Pickup;
