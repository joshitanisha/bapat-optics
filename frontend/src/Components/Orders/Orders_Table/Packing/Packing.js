import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { getData, getDownloadDataExcel, postData } from "../../../../utils/api";
import { Link } from "react-router-dom";
import {
  IDS,
  OrderStatusIds,
  ReturnStatusIds,
  RoleId,
  ServiceIds,
} from "../../../../utils/common";
import AssignOffCanvance from "../AssignDeliveryBoy";
import ProductModal from "../ProductModal";
import AssignReturnOffCanvance from "../AssignReturnDeliveryBoy";
import Pagination_Holder from "../../../common/Pagination_Holder/Pagination_Holder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import search1 from "../../../assets/icons/search.png";
import {  useLoader } from "../../../../utils/common";
function PackingTable({
  user,
  OrderByOptions,

  resultsPerPageOptions,
  storeCategories,
  vendorServices,
}) {
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
  } = useContext(Context);

  const [perPage, setperPage] = useState({
    value: 25,
    label: "Results per page: 25",
  });

  const [sortOrder, setSortOrder] = useState({
    value: "DESC",
    label: "Sort-by date (Descending)",
  });

  const [data, setData] = useState([]);
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [searchOrderStatus, setSearchOrderSatatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState();
  const [hideFilter, setHideFilter] = useState(false);
  const [storeCategory, setStoreCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");
  // const [searchDate, setSearchDate] = useState("");
  // const [searchDateTo, setSearchDateTo] = useState("");

  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchDateTo, setSearchDateTo] = useState();
  const [searchDateFrom, setSearchDateFrom] = useState();

  const [searchStartTime, setSearchStartTime] = useState();
  const [searchEndTime, setSearchEndTime] = useState();
  const { loading, withLoader } = useLoader();
  
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/orders/product-order?page=${onPageChange || 1}&per_page=${perPage?.value || 25
      }&term=${encodeURIComponent(search)}&searchOrderStatus=${OrderStatusIds.Processing || ""
      }&storeCategory=${storeCategory}&productCategory=${productCategory || ""
      }&sortOrder=${sortOrder?.value || "DESC"}&to=${searchDateTo || ""
      }&start_time=${searchStartTime || ""}&end_time=${searchEndTime || ""
      }&name=${search || ""}&customer=${searchCustomer || ""}`
    ));
    await setData(response);
    setCurrentPage(response?.data?.current_page);
    // setperPage(response?.data?.per_page);
    settotalPages(response?.data?.total_pages);
    setSearch(response?.data?.search_name);
    setOption(await Per_Page_Dropdown(response?.data?.totalEntries));
    // await GetAllCounts();
  };
  useEffect(() => {
    getDataAll();
  }, [reset, searchOrderStatus, storeCategory, productCategory, onPageChange]);

  const handlePageChange = (pageNumber) => {
    setonPageChange(pageNumber);
  };

  const paginationItems = [];
  for (let page = 1; page <= totalPages; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === onPageChange}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  const [showAssign, setShowAssign] = useState({ show: 0, data: {} });
  const [showReturnAssign, setShowReturnAssign] = useState({
    show: 0,
    data: {},
  });
  const [showDetails, setShowDetails] = useState({ show: 0, data: {} });

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

  const ChangeOrderStatus = async (id, status_id) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/orders/product-order/update-status/${id}`, {
        order_status_id: status_id,
      });

      // Refresh the data after updating the store's status
      await getDataAll();
    } catch (error) {
      console.error("Error updating store status:", error);
    }
  };

  const downloadInvoice = (invoiceUrl) => {
    // Make a GET request to the backend to trigger the download
    const link = document.createElement("a");
    link.href = invoiceUrl; // The URL of the invoice file on the server
    link.target = "_blank";
    link.download = true; // This ensures the browser triggers a download
    link.click();
  };

  const HandleDownload = async () => {
    if (data?.data?.data?.length <= 0) {
      alert("No record found");
    } else {
      try {
        // await DownloadExcel(
        //   // "/download-excel/download-users",
        //   `/download-excel/download-users?term=${search || ""}&mobile=${mobile || ""}&from=${from || ""}&to=${to || ""}`,
        //   "Users List"
        // );
        await getDownloadDataExcel(
          `/admin/orders/download?page=${onPageChange || 1}&per_page=${perPage?.value || 25
          }&term=${encodeURIComponent(search)}&searchOrderStatus=${OrderStatusIds.Processing || ""
          }&storeCategory=${storeCategory}&productCategory=${productCategory || ""
          }&sortOrder=${sortOrder?.value || "DESC"}&from=${searchDateFrom || ""
          }&to=${searchDateTo || ""}&start_time=${searchStartTime || ""
          }&end_time=${searchEndTime || ""}&name=${search || ""}&customer=${searchCustomer || ""
          }`,
          null,
          "Order List"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <section className="pending-table_holder">
      {/* Quick Filters Section */}
      {/* <div className="quick-filters">
        <span className="quick-filters__label">Quick Filters:</span>
        <div className="quick-filters__tabs mb-3"></div>
      </div>
      <div className="row align-items-start">
        <div className="col-12 mb-2">
          <div className="row">
            <div className="col-md-3">
              <div className="num">
                <Form.Label></Form.Label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  // value={search}
                  placeholder="Search Customer"
                  // onChange={(e) => {
                  //   setSearch(e.target.value);
                  // }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="num me-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="From"
                  // value={searchDate}
                  // onChange={(e) => {
                  //   setSearchDate(e.target.value);
                  //   setonPageChange(1);
                  // }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="num me-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="To"
                  // value={searchDateTo}
                  // onChange={(e) => {
                  //   setSearchDateTo(e.target.value);
                  //   setonPageChange(1);
                  // }}
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="quick-filters mt-0">
        <span className="quick-filters__label">
          <b>Quick Filters:</b>
        </span>
        <div className="quick-filters__tabs mb-3 ">
          <div className="row align-items-start">
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <div className="num me-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="From"
                  max="2050-12-31"
                  value={searchDateFrom}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) {
                      setSearchDateFrom("");
                      setonPageChange(1);
                      return;
                    }

                    const year = Number(value.split("-")[0]);

                    // Allow only up to 2025
                    if (year <= 2050) {
                      setSearchDateFrom(value);
                      setonPageChange(1);
                    }
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
                  max="2050-12-31"
                  value={searchDateTo}
                  min={searchDateFrom}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) {
                      setSearchDateTo("");
                      setonPageChange(1);
                      return;
                    }

                    const year = Number(value.split("-")[0]);

                    // Allow only up to year 2025
                    if (year <= 2050) {
                      setSearchDateTo(value);
                      setonPageChange(1);
                    }
                  }}
                />
              </div>
            </div>
            {/* <div className="col-md-3">
              <label className="form-label">Start Time</label>
              <DatePicker
                selected={searchStartTime}
                onChange={(date) => {
                  setSearchStartTime(date);
                  setonPageChange(1);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Start Time"
                dateFormat="h:mm aa" // 12-hour format
                className="form-control"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">End Time</label>
              <DatePicker
                selected={searchEndTime}
                onChange={(date) => {
                  setSearchEndTime(date);
                  setonPageChange(1);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="End Time"
                dateFormat="h:mm aa"
                className="form-control"
              />
            </div> */}
            <div className=" col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">=
              <div>
                <label className="form-label"></label>
                <button
                  className="btn btn-success Excel_btn"
                  type="button"
                  onClick={HandleDownload}
                >
                  Excel
                  <FontAwesomeIcon
                    icon="fa-solid fa-file-lines"
                    className="ms-2"
                  />
                </button>
              </div>
            </div>

            {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Select Category </Form.Label>
              <Select
                isSearchable
                options={categories}
                value={searchCategory}
                placeholder="Select Category"
                onChange={(e) => {
                  setSearchCategory(e);
                  getAllSubCategories(e.value);
                  setSearchSubCategory("");
                }}
                classNamePrefix="searchProduct"
              />
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Select Sub Category </Form.Label>
              <Select
                isSearchable
                options={subCategories}
                value={searchSubCategory}
                placeholder="Select Sub Category"
                onChange={(e) => {
                  setSearchSubCategory(e);
                  getAllChildCategories(e.value);
                }}
                classNamePrefix="searchProduct"
              />
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Select Child Category </Form.Label>
              <Select
                isSearchable
                options={childCategories}
                value={searchChildCategory}
                placeholder="Select Child Category"
                onChange={(e) => {
                  setSearchChildCategory(e);
                }}
                classNamePrefix="searchProduct"
              />
            </div> */}
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                placeholder="Enter Product Name"
                type="text"
                className="form-control"
                id=""
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                placeholder="Enter Customer Name"
                type="text"
                className="form-control"
                id=""
                value={searchCustomer}
                onChange={(e) => {
                  setSearchCustomer(e.target.value);
                }}
              />
            </div>
            <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <div className="Search">
                <label className="form-label"></label>
                <Button
                  type="button"
                  onClick={getDataAll}
                  className="btn btn-search"
                >
                  <img src={search1} className="search" alt="" />
                </Button>
              </div>
            </div>
            <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <div className="Search-1">
                <label className="form-label"></label>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchDateFrom("");
                    setSearchDateTo("");
                    setSearchEndTime("");
                    setSearchStartTime("");
                    setSearchCustomer("");
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
      </div>
      <br></br>

      <div className="filters-section">
        <div className="filters-section__label">
          <div className="row mb-3">
            <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
              <Button
                className="hide_btn"
                onClick={() => {
                  setHideFilter(!hideFilter);
                  setStoreCategory("");
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
            <span>{data?.data?.total} Orders</span>
          </h6>
        </div>
        {!hideFilter && (
          <div className="filters-section__controls">
            <div className="row">
              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                <label className="form-label"></label>
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
              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                <label className="form-label"></label>
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
              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
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
                    setStoreCategory("");
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
              </div>

              {/* <div className=" col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                <div>
                  <button
                    className="btn btn-success mt-2"
                    type="button"
                    onClick={HandleDownload}
                  >
                    Download Excel
                    <FontAwesomeIcon
                      icon="fa-solid fa-file-lines"
                      className="ms-2"
                    />
                  </button>
                </div>
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
              <th>Order Date</th>
              <th>Order details</th>
              <th>Products</th>
              <th>Total</th>
              <th>Delivery Details</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.data?.map((item, index) => (
              <tr key={index}>
                <td className="order-date">
                  <div className="order-details_info">
                    <div className="order-id">
                      {calculateTimeAgo(item?.createdAt)}
                    </div>
                    <div className="order-info">
                      <span>
                        {new Date(item?.createdAt).toISOString().split("T")[0]}
                      </span>
                    </div>
                  </div>
                  <div className="order-details_info">
                    <div className="order-info">
                      <span>{formatTimeInIST(item?.createdAt)} IST</span>
                    </div>
                  </div>
                </td>

                {/* Owner Details */}
                <td className="order-details">
                  <div className="order-details_info">
                    <div className="order-id text-highlight">
                      {item?.invoice_no}
                    </div>
                  </div>
                  <div className="order-info">
                    <div className="text-highlight">
                      <span>
                        {" "}
                        <b> Buyer Name : </b>
                      </span>

                      <div className="order-info">
                        <span className="text-highlight">
                          {item?.User?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-info">
                      <span className="text-highlight">
                        {" "}
                        <b> Contact No : </b>
                        {item?.User?.contact_no}
                      </span>
                    </div>
                  </div>
                  <div className="order-info">
                    <div className="text-highlight">
                      <span>
                        {" "}
                        <b> Payment Method : </b> {item?.Payment_Method?.name}</span>
                    </div>
                  </div>

                  {/* <div className="order-info">
                    <span>{item?.user?.type}</span>
                  </div> */}
                </td>

                <td className="order-details">
                  {item?.Product_Order_Details?.map((product) => (
                    <>
                      <div className="text-highlight">
                        <span>
                          <b>Product Name : </b> {product?.Product?.name}</span>
                      </div>
                      <div className="order-info">
                        <div className="text-highlight">
                          <span>
                            <b>Category Name : </b> {product?.Product?.p_category?.name} </span>
                        </div>
                      </div>
                    </>
                  ))}
                  <div></div>
                  <div className=" mt-3">
                    <Button
                      className="action-btn active"
                      onClick={() =>
                        setShowDetails({
                          show: item?.id,
                          data: item?.Product_Order_Details,
                        })
                      }
                    >
                      View All Details
                    </Button>
                  </div>
                </td>

                <td className="order-details">
                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total SubTotal</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.total_selling_price} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>Packing Charges</span>
                    </div>
                    <div className="order-info">
                      <span>{item?.packing_charges} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Shipping Charges</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.delivery_charges} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Offer Discount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.total_offer_discount} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b> Coupon Discount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.total_coupon_discount} /-</span>
                    </div>
                  </div>
                  {/* <div className="order-id">
                    <span>Refer Discount</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.total_refer_discount} /-</span>
                  </div> */}
                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total Tax</b>{" "}
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.total_tax} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Grand Total</b>{" "}
                      </span>
                    </div>
                    <div className="text-highlight">
                      <span>{item?.total_amount} /-</span>
                    </div>
                  </div>
                </td>

                <td>
                  {item?.Store_Detail?.s_category_id == 1 ? (
                    <>
                      <div className="order-details_info">
                        <div className="order-info">
                          <p className="status-holder shipped">
                            {item?.Restaurant_Service?.name}
                          </p>
                        </div>
                      </div>
                      {item?.service_id == ServiceIds.Delivery ? (
                        <>
                          <div className="order-details_info">
                            <div className="text-highlight">
                              <span>
                                {item?.User_Address?.first_name}{" "}
                                {item?.User_Address?.last_name}
                              </span>
                            </div>
                          </div>
                          <div className="order-info">
                            <div className="order-details_info">
                              <span>{item?.User_Address?.floor} floor ,</span>
                              <span>{item?.User_Address?.building}, </span>
                              <span>{item?.User_Address?.apartment} ,</span>
                              <span>{item?.User_Address?.street}, </span>
                              <span>{item?.User_Address?.address_type}</span>
                              <span>{item?.User_Address?.contact_no} </span>
                            </div>
                          </div>
                        </>
                      ) : item?.service_id == ServiceIds.DineIn ? (
                        <>
                          <div className="order-details_info">
                            <div className="order-info">
                              {" "}
                              <span> Table No.  :-</span>{" "}
                            </div>
                            <div className="text-highlight">
                              <span>{item?.table_no}</span>
                            </div>
                          </div>
                        </>
                      ) : item?.service_id == ServiceIds.RoomService ? (
                        <>
                          <div className="order-details_info">
                            <div className="order-info">
                              {" "}
                              <span> Room No :-</span>{" "}
                            </div>
                            <div className="text-highlight">
                              <span>{item?.room_no}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}{" "}
                    </>
                  ) : (
                    <>
                      <div className="order-details_info">
                        <div className="text-highlight">
                          <span>
                            {item?.User_Address?.first_name}{" "}
                            {item?.User_Address?.last_name}
                          </span>
                        </div>
                      </div>
                      <div className="order-info">
                        <div className="order-details_info">
                          <span>{item?.User_Address?.floor} floor ,</span>
                          <span>{item?.User_Address?.building}, </span>
                          <span>{item?.User_Address?.apartment} ,</span>
                          <span>{item?.User_Address?.street}, </span>
                          <span>{item?.User_Address?.address_type}</span>
                          <span>{item?.User_Address?.contact_no} </span>
                        </div>
                      </div>
                    </>
                  )}

                  {item?.order_status_id > 2 && (
                    <div>
                      <div className="order-details_info">
                        <p className="status-holder shipped mt-1">
                          Delivery Boy details
                        </p>
                      </div>
                      <div className="order-details_info">
                        <div className="text-highlight">
                          <span>{item?.delivery_boy?.name} </span>
                        </div>
                      </div>
                      <div className="order-details_info">
                        <div className="order-info">
                          <span>{item?.delivery_boy?.email}</span>
                        </div>
                      </div>
                      <div className="order-details_info">
                        <div className="order-info">
                          <span>{item?.delivery_boy?.contact_no}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </td>

                <td>
                  {item?.order_status_id === 4 ? (
                    <div className="order-details_info">
                      <p className="status-holder shipped">
                        {item?.Order_status?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="order-details_info">
                      <p className="status-holder Unshipped">
                        {item?.Order_status?.name}
                      </p>
                    </div>
                  )}

                  {item?.Order_History?.delivery_boy_assigned && (
                    <div className="order-info">
                      Delivery Boy Asigned At
                      <div className="order-details_info">
                        <div className="order-info">
                          <span>
                            {
                              new Date(
                                item?.Order_History?.delivery_boy_assigned
                              )
                                .toISOString()
                                .split("T")[0]
                            }
                            {formatTimeInIST(
                              item?.Order_History?.delivery_boy_assigned
                            )}{" "}
                            IST
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  {!item?.Return_Order ? (
                    <>
                      {item?.delivery_boy ? (
                        <>
                          <div className="my-1">
                            <Button className="action-btn active">
                              {" "}
                              {item?.delivery_boy?.name}
                            </Button>
                          </div>
                        </>
                      ) : item?.Store_Detail?.s_category?.is_restaurant_flow ? (
                        <>
                          {" "}
                          {item?.order_status_id ===
                            OrderStatusIds.Processing && (
                              // user?.role_id === RoleId.Vendor &&
                              <>
                                {item?.service_id == ServiceIds.Delivery ||
                                  item?.service_id == ServiceIds.RoomService ? (
                                  <div className="my-1">
                                    <Button
                                      className="action-btn active"
                                      onClick={() =>
                                        setShowAssign({
                                          show: item?.id,
                                          data: item?.User_Address,
                                        })
                                      }
                                    >
                                      {" "}
                                      Assign Delivery Boy{" "}
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="my-1">
                                    <Button
                                      className="action-btn active"
                                      onClick={() =>
                                        ChangeOrderStatus(
                                          item?.id,
                                          OrderStatusIds.PickupSchedued
                                        )
                                      }
                                    >
                                      {" "}
                                      Cooked{" "}
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                        </>
                      ) : (
                        <>
                          {item?.order_status_id ===
                            OrderStatusIds.Processing && (
                              // user?.role_id === RoleId.Vendor &&
                              <div className="my-1">
                                <Button
                                  className="action-btn active"
                                  onClick={() =>
                                    setShowAssign({
                                      show: item?.id,
                                      data: item?.User_Address,
                                    })
                                  }
                                >
                                  {" "}
                                  Assign Delivery Boy{" "}
                                </Button>
                              </div>
                            )}

                          {item?.Return_Order?.return_reason_id ===
                            ReturnStatusIds.ReturnRequested && (
                              // user?.role_id === RoleId.Vendor &&
                              <div className="my-1">
                                <Button
                                  className="action-btn active"
                                  onClick={() =>
                                    setShowReturnAssign({
                                      show: item?.id,
                                      data: item?.User_Address,
                                    })
                                  }
                                >
                                  {" "}
                                  Assign Delivery Boy{" "}
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {item?.Return_Order?.User ? (
                        <>
                          <div className="my-1">
                            <Button className="action-btn active">
                              {" "}
                              {item?.Return_Order?.User?.name}
                            </Button>
                          </div>
                        </>
                      ) : item?.Store_Detail?.s_category?.is_restaurant_flow ? (
                        <>
                          {" "}
                          {item?.Return_Order?.return_status_id ===
                            ReturnStatusIds.ReturnRequested && (
                              // user?.role_id === RoleId.Vendor &&
                              <>
                                {item?.service_id == ServiceIds.Delivery ||
                                  item?.service_id == ServiceIds.RoomService ? (
                                  <div className="my-1">
                                    <Button
                                      className="action-btn active"
                                      onClick={() =>
                                        setShowAssign({
                                          show: item?.id,
                                          data: item?.User_Address,
                                        })
                                      }
                                    >
                                      {" "}
                                      Assign Delivery Boy{" "}
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="my-1">
                                    {/* <Button
                                      className="action-btn active"
                                      onClick={() =>
                                        ChangeOrderStatus(
                                          item?.id,
                                          OrderStatusIds.PickupSchedued
                                        )
                                      }
                                    >
                                      {" "}
                                      Cooked{" "}
                                    </Button> */}
                                  </div>
                                )}
                              </>
                            )}
                        </>
                      ) : (
                        <>
                          {item?.Return_Order?.return_status_id ===
                            ReturnStatusIds.ReturnRequested && (
                              // user?.role_id === RoleId.Vendor &&
                              <div className="my-1">
                                <Button
                                  className="action-btn active"
                                  onClick={() =>
                                    setShowReturnAssign({
                                      show: item?.id,
                                      data: item?.User_Address,
                                    })
                                  }
                                >
                                  {" "}
                                  Assign Delivery Boy{" "}
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </>
                  )}

                  {item?.order_status_id === OrderStatusIds.Pending && (
                    <>
                      <div className="my-1">
                        <Button
                          className="action-btn active"
                          onClick={() =>
                            ChangeOrderStatus(
                              item?.id,
                              OrderStatusIds.Processing
                            )
                          }
                        >
                          {" "}
                          Accept Order{" "}
                        </Button>
                      </div>

                      <div className="my-1">
                        <Button
                          className="action-btn"
                          onClick={() =>
                            ChangeOrderStatus(
                              item?.id,
                              OrderStatusIds.Cancelled
                            )
                          }
                        >
                          {" "}
                          Reject Order{" "}
                        </Button>
                      </div>
                    </>
                  )}

                  <div className="my-1">
                    <Button
                      className="action-btn"
                      onClick={() => downloadInvoice(IMG_URL + item?.invoice)}
                    >
                      Print Tax Invoice
                    </Button>
                  </div>

                  {item?.order_status_id !== OrderStatusIds.Cancelled && (
                    <div className="my-1">
                      <Button
                        className="action-btn"
                        onClick={() =>
                          ChangeOrderStatus(item?.id, OrderStatusIds.Cancelled)
                        }
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {data && data?.data?.data?.length > 0 ? (
          <Pagination_Holder
            onPageChange={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        ) : (
          <p className="no-datashow">Sorry, No Data Found</p>
        )}
      </div>
      <AssignOffCanvance
        handleClose={() => {
          setShowAssign({ show: 0, data: {} });
          getDataAll();
        }}
        setShow={() => setShowAssign({ show: 0, data: {} })}
        show={showAssign?.show}
        data={showAssign?.data}
      />
      <AssignReturnOffCanvance
        handleClose={() => {
          setShowReturnAssign({ show: 0, data: {} });
          getDataAll();
        }}
        setShow={() => setShowReturnAssign({ show: 0, data: {} })}
        show={showReturnAssign?.show}
        data={showReturnAssign?.data}
      />
      <ProductModal
        handleClose={() => {
          setShowDetails({ show: 0, data: {} });
        }}
        setShow={() => setShowDetails({ show: 0, data: {} })}
        show={showDetails?.show}
        data={showDetails?.data}
      />
    </section>
  );
}

export default PackingTable;
