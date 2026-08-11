import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "./My_Table.css";
import Select from "react-select";
import { Table, Button, Form } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { editStatusData, postData } from "../../../../utils/api";
import { Link } from "react-router-dom";
import { ApprovalStatus, RoleId } from "../../../../utils/common";
import AddOffCanvance from "../Add";
import search1 from "../../../../Components/assets/icons/search.png";
import AddOffCanvancePayment from "../AddPayment";
import AddOffCanvancePaymentDeliveryBoy from "../AddPaymentDeliveryBoy";
import ShowKYC from "../showKyc";

function My_Table({
  data,
  getDataAll,
  OrderByOptions,
  user,
  reset,
  setonPageChange,
  setChangeStatus,
  sortOrder,
  setSortOrder,
  resultsPerPageOptions,
  perPage,
  setperPage,
  setReset,
  hideFilter,
  setHideFilter,
  option,
  setStartDate,
  endDate,
  startDate,
  setEndDate,
  setSearch,
  search,
  approval_status_id,
}) {
  const { IMG_URL } = useContext(Context);

  const [show, setShow] = useState(0);

  const [showPayment, setShowPayment] = useState(0);

  const [showKYC, setShowKYC] = useState(0);

  const [showPaymentDeliveryBoy, setShowPaymentDeliveryBoy] = useState(0);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "20px",
      borderColor: "#ddd",
      boxShadow: "none",
      fontSize: "15px",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#000",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "#fff",
      color: "#000",
      fontSize: "15px",
      "&:hover": {
        backgroundColor: "#eee",
      },
    }),
  };

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

  console.log("option", option);

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

  const PaymentAccept = async (id, amount) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/delivery-boy/payment-accepted/${id}`, {
        amount: amount,
      });

      await getDataAll();
    } catch (error) {
      console.error("Error updating store status:", error);
    }
  };
  const ChangeStoreStatus = async (id, option) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/delivery-boy/approval-status/${id}`, {
        approval_status_id: option,
      });

      // Refresh the data after updating the store's status
      await getDataAll();
    } catch (error) {
      console.error("Error updating store status:", error);
    }
  };
  const ChangeStatus = async (id) => {
    const response = await editStatusData(`/admin/delivery-boy/${id}`);
    setChangeStatus(response);
  };

  return (
    <section className="pending-table_holder">
      {/* Quick Filters Section */}
      {/* <div className="quick-filters">
        <span className="quick-filters__label">Quick Filters:</span>
        <div className="quick-filters__tabs mb-3">
          <Button
            className={storeCategory === '' ? "quick-filters__tab quick-filters__tab--active" : "quick-filters__tab"}
            onClick={() => { setStoreCategory(""); setonPageChange(1); }}
          >
            All Products
          </Button>
          {storeCategories && storeCategories.map((category) => {
            return (
              <Button
                key={category?.value}
                className={storeCategory === category?.value ? "quick-filters__tab quick-filters__tab--active" : "quick-filters__tab"}
                onClick={() => { setStoreCategory(category?.value); setonPageChange(1); }}
              >
                {category?.label}
              </Button>
            );
          })}

        </div>
      </div> */}

      <div className="filters-section">
        <div className="filters-section__label">
          <div className="row mb-3">
            <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
              <Button
                className="hide_btn"
                onClick={() => {
                  setHideFilter(!hideFilter);
                  setSortOrder({
                    value: "DESC",
                    label: "Sort-by date (Descending)",
                  });
                  setperPage({ value: 25, label: "Results per page: 25" });
                  setReset();
                }}
              >
                {" "}
                {!hideFilter ? "Hide Filter" : "Show Filter"}
              </Button>
            </div>
          </div>

          <h6>
            <span>{data?.data?.total} Delivery Boys</span>
            {/* Last 30 Days */}
          </h6>
        </div>
        {!hideFilter && (
          <div className="filters-section__controls">
            <div className="row align-items-start">
              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                <div className="num">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    value={search}
                    placeholder="Search Delivery Boys"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* <div className="col-md-3">
                <div className="num">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    value={searchEmail}
                    placeholder="Search Email"
                    onChange={(e) => {
                      setsearchEmail(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="num">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    value={searchNumber}
                    placeholder="Search Email"
                    onChange={(e) => {
                      setsearchNumber(e.target.value);
                    }}
                  />
                </div>
              </div> */}

              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                <div className="num me-2">
                  <label className="form-label">Start Date</label>
                  {/* <input
                    type="date"
                    className="form-control"
                    placeholder="From"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setonPageChange(1);
                    }}
                  /> */}

                  <input
                    type="date"
                    className="form-control"
                    placeholder="From"
                    value={startDate}
                    max="2050-12-31"
                    onChange={(e) => {
                      const selectedDate = e.target.value;


                      if (new Date(selectedDate).getFullYear() > 2050) {
                        return;
                      }

                      setStartDate(selectedDate);
                      setonPageChange(1);
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                <div className="num me-2">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="To"
                    value={endDate}
                    max="2050-12-31"
                    min={startDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;

                      // Safety check for manual typing
                      if (new Date(selectedDate).getFullYear() > 2050) {
                        return;
                      }

                      setEndDate(selectedDate);
                      setonPageChange(1);
                    }}
                  />
                </div>
              </div>

              <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                <div className="btn_holder">
                  {/* <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2"> */}
                  <div className="Search">
                    <label className="form-label"></label>
                    <Button
                      type="button"
                      onClick={() => {
                        setonPageChange(1);

                        getDataAll();
                      }}
                      className="btn btn-search"
                    >
                      <img src={search1} className="search" alt="" />
                    </Button>
                  </div>
                  {/* </div> */}

                  <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                    <div className="Search-1">
                      <label className="form-label"></label>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setEndDate("");
                          setStartDate("");

                          setReset(!reset);
                        }}
                        className="btn btn-reset"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-lg-4 mb-2">
                <Select
                  options={OrderByOptions}
                  // defaultValue={OrderByOptions[0]}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e)}
                  className="filters-section__dropdown"
                  classNamePrefix="react-select"
                  styles={customSelectStyles}
                />
              </div>
              <div className="col-lg-4 mb-2">
                <Select
                  options={resultsPerPageOptions}
                  // defaultValue={resultsPerPageOptions[0]}
                  value={perPage}
                  onChange={(e) => setperPage(e)}
                  className="filters-section__dropdown"
                  classNamePrefix="react-select"
                  styles={customSelectStyles}
                />
              </div>
              <div className="col-lg-4 mb-2">
                <Button
                  variant="outline-secondary"
                  className="filters-section__btn active me-1"
                  onClick={() => {
                    setonPageChange(1);
                    getDataAll();
                  }}
                >
                  Set Table Preferences
                </Button>

                <Button
                  variant="outline-secondary"
                  className="filters-section__btn"
                  onClick={() => {
                    setSortOrder({
                      value: "DESC",
                      label: "Sort-by date (Descending)",
                    });
                    setperPage({ value: 25, label: "Results per page: 25" });
                    setonPageChange(1);
                    setReset(!reset);
                  }}
                >
                  Refresh
                </Button>
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="pending-table ">
        <Table striped bordered hover className="order-table" responsive>
          <thead>
            <tr>
              <th>Creation Date</th>
              <th>User details</th>
              {/* <th>Address details</th> */}
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
              {approval_status_id === ApprovalStatus.Approved && (
                <th>Payment Receive</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data?.data?.data?.map((item, index) => (
              <tr key={index}>
                <td className="order-date">
                  <div className="order-id">
                    {calculateTimeAgo(item?.createdAt)}
                  </div>
                  <div className="order-info">
                    <span>
                      {new Date(item?.createdAt).toISOString().split("T")[0]}
                    </span>
                  </div>
                  <div className="order-info">
                    <span>{formatTimeInIST(item?.createdAt)} IST</span>
                  </div>
                </td>

                {/* Owner Details */}
                <td className="order-details">
                  <div className="order-info">
                    <span className="text-highlight">{item?.name}</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.email}</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.contact_no}</span>
                  </div>
                  <div className="order-info">
                    <span className="text-highlight">{item?.Gender?.name}</span>
                  </div>
                </td>

                {/* Store Details */}
                {/* <td className="order-details">
                  <div className="order-info">
                    <span className="text-highlight">
                      {item?.Delivery_Boy_Detail?.Country?.name}
                    </span>
                  </div>
                  <div className="order-info">
                    <span>
                      {item?.Delivery_Boy_Detail?.City?.name} ,
                      {item?.Delivery_Boy_Detail?.State?.name} ,{" "}
                      {item?.Delivery_Boy_Detail?.Pincode?.name}
                    </span>
                  </div>
                  <div className="order-id">Coordinates</div>
                  <div className="order-info">
                    <span>
                      {item?.Delivery_Boy_Detail?.lat} ,
                      {item?.Delivery_Boy_Detail?.long}{" "}
                    </span>
                  </div>
                </td> */}

                <td>
                  <img
                    src={IMG_URL + item?.image}
                    alt="Product"
                    className="product-image"
                  />
                </td>

                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={item?.status}
                      // disabled={!isAllow?.includes(51)}
                      onChange={() => {
                        ChangeStatus(item?.id);
                      }}
                      id={`flexSwitchCheckDefault${item?.id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`flexSwitchCheckDefault${item?.id}`}
                    >
                      {item?.status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </td>

                <td>

                  {approval_status_id === ApprovalStatus.Pending && (
                    <div>
                      <select
                        className={
                          item?.Delivery_Boy_Detail?.approval_status_id ===
                            ApprovalStatus.Approved
                            ? "status-holder shipped"
                            : "status-holder Unshipped"
                        }
                        onChange={(e) =>
                          ChangeStoreStatus(item?.id, e.target.value)
                        }
                        value={item?.Delivery_Boy_Detail?.Approval_Status?.id}
                      >
                        <option value={ApprovalStatus.Pending}>Inactive</option>
                        <option value={ApprovalStatus.Approved}>
                          Approved
                        </option>
                        <option value={ApprovalStatus.Rejected}>
                          Rejected
                        </option>
                      </select>
                    </div>
                  )}
                  {approval_status_id === ApprovalStatus.Approved && (
                    <>
                      {" "}
                      <div>
                        <Button
                          className="btn-primary "
                          onClick={() => setShow(item?.id)}
                          style={{ marginTop: "auto" }}
                        >
                          View Orders
                        </Button>
                      </div>

                    </>
                  )}

                  <Button
                    className="btn-primary "
                    onClick={() => setShowKYC(item?.id)}
                    style={{ marginTop: "10px" }}
                  >
                    KYC Details
                  </Button>


                </td>
                {approval_status_id === ApprovalStatus.Approved && (
                  <td>
                    <div>
                      <div>
                        <div>
                          Total Payment: ₹
                          {item?.Payment_Collects
                            ? item.Payment_Collects.reduce(
                              (sum, collect) =>
                                sum +
                                parseFloat(collect.receive_payment || 0),
                              0
                            ).toFixed(2)
                            : "0.00"}
                        </div>
                      </div>
                      <Button
                        className="btn-primary "
                        onClick={() => setShowPayment(item?.id)}
                        style={{ marginTop: "10px" }}
                      >
                        View Payment
                      </Button>
                      <div>
                        <Button
                          className="btn-primary "
                          onClick={() => setShowPaymentDeliveryBoy(item?.id)}
                          style={{ marginTop: "10px" }}
                        >
                          Payment Orders
                        </Button>
                      </div>



                      {item?.Payment_Collects &&
                        item.Payment_Collects.reduce(
                          (sum, collect) =>
                            sum + parseFloat(collect.receive_payment || 0),
                          0
                        ) > 0 && (
                          <Button
                            className="btn-primary"
                            onClick={() => {
                              const totalAmount = item.Payment_Collects.reduce(
                                (sum, collect) =>
                                  sum +
                                  parseFloat(collect.receive_payment || 0),
                                0
                              ).toFixed(2);

                              if (
                                window.confirm(
                                  `Do you want to confirm payment of ₹${totalAmount}?`
                                )
                              ) {
                                PaymentAccept(item?.id, totalAmount);
                              }
                            }}
                            style={{ marginTop: "10px" }}
                          >
                            Payment Receive
                          </Button>
                        )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AddOffCanvance show={show} handleClose={() => setShow(0)} />

      <AddOffCanvancePayment
        show={showPayment}
        handleClose={() => setShowPayment(0)}
      />

      <ShowKYC show={showKYC} handleClose={() => setShowKYC(0)} />

      <AddOffCanvancePaymentDeliveryBoy
        show={showPaymentDeliveryBoy}
        handleClose={() => setShowPaymentDeliveryBoy(0)}
      />
    </section>
  );
}

export default My_Table;
