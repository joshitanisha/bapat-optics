import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { getDownloadDataExcel, postData } from "../../../../utils/api";
import { Link } from "react-router-dom";
import {
  formatDate,
  formatTo12Hour,
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
import DatePicker from "react-datepicker";
import search1 from "../../../assets/icons/search.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  useLoader } from "../../../../utils/common";
function CancelledTable({
  user,
  OrderByOptions,
  activeTab,
  storeCategories,

  productCategories,

  vendorServices,
  resultsPerPageOptions,
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

  const [data, setData] = useState([]);
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);

  const [reset, setReset] = useState();
  const [searchOrderStatus, setSearchOrderSatatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState();
  const [hideFilter, setHideFilter] = useState(false);
  const [storeCategory, setStoreCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");

  const [searchDateTo, setSearchDateTo] = useState();
  const [searchDateFrom, setSearchDateFrom] = useState();

  const [searchStartTime, setSearchStartTime] = useState();
  const [searchEndTime, setSearchEndTime] = useState();
  const [sortOrder, setSortOrder] = useState({
    value: "DESC",
    label: "Sort-by date (Descending)",
  });
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/orders/product-order?page=${onPageChange || 1}&per_page=${perPage?.value || 25
      }&term=${encodeURIComponent(search)}&searchOrderStatus=${OrderStatusIds.Cancelled || ""
      }&storeCategory=${storeCategory}&productCategory=${productCategory.value || ""
      }&sortOrder=${sortOrder?.value || "DESC"}&from=${searchDateFrom || ""
      }&to=${searchDateTo || ""}&start_time=${searchStartTime || ""}&end_time=${searchEndTime || ""
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

  useEffect(() => {
    if (activeTab === "Cancelled") {
      getDataAll();
    }
  }, [activeTab]);

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
          }&term=${encodeURIComponent(search)}&searchOrderStatus=${OrderStatusIds.Cancelled || ""
          }&storeCategory=${storeCategory}&productCategory=${productCategory.value || ""
          }&sortOrder=${sortOrder?.value || "DESC"}&from=${searchDateFrom || ""
          }&to=${searchDateTo || ""}&start_time=${searchStartTime || ""
          }&end_time=${searchEndTime || ""}&name=${search || ""}&customer=${searchCustomer || ""
          }`,
          null,
          "Subscription Order List"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const [product, setProduct] = useState([]);

  const GetAllProduct = async () => {
    const response = await getData("/common/masters/product");
    if (response?.success) {
      setProduct(await Select2Data(response?.data, "product_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
  }, []);
  return (
    <section className="pending-table_holder">
      {/* Quick Filters Section */}
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

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Select Product </Form.Label>
              <Select
                isSearchable
                options={product}
                value={productCategory}
                placeholder="Select Product"
                onChange={(e) => {
                  setProductCategory(e);
                }}
                classNamePrefix="searchProduct"
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
                <Form.Label>Search</Form.Label>
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
                <Form.Label>Reset</Form.Label>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchDateFrom("");
                    setSearchDateTo("");
                    setSearchEndTime("");
                    setSearchStartTime("");
                    setSearchCustomer("");
                    setProductCategory("");
                    setReset(!reset);
                  }}
                  className="btn btn-reset"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className=" col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
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
          </div>
        </div>
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
                  <div className="order-details_info">
                    <div className="order-id text-highlight">
                      {item?.invoice_no}
                    </div>
                  </div>

                  <div className="text-highlight">
                    <div className="order-info">
                      <span>
                        {" "}
                        <b> Buyer Name :</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span className="text-highlight">{item?.User?.name}</span>
                    </div>
                  </div>

                  <div className="text-highlight">
                    <span className="order-info">{item?.User?.contact_no}</span>
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
                        <div className="order-details_info">
                          <span>
                            <b>Product Name :</b>
                          </span>
                          <span>{product?.Product?.name}</span>
                        </div>
                      </div>
                      <div className="order-info">
                        <div className="text-highlight">
                          <span>
                            <b>Category Name :</b>
                          </span>
                          <span>{product?.Product?.p_category?.name} </span>
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
                      <span>
                        <b>Total Addon</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.total_addon_price} /-</span>
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
                  <>
                    <div className="text-highlight">
                      <span>
                        {item?.User_Address?.first_name}{" "}
                        {item?.User_Address?.last_name}
                      </span>
                    </div>
                    <div className="order-info">
                      <div className="text-highlight">
                        <span>{item?.User_Address?.floor} floor ,</span>
                        <span>{item?.User_Address?.building}, </span>
                        <span>{item?.User_Address?.apartment} ,</span>
                        <span>{item?.User_Address?.street}, </span>
                        <span>
                          {
                            item?.User_Address?.Users_Address_Detail?.Country
                              ?.name
                          }{" "}
                          ,
                        </span>
                        <span>
                          {
                            item?.User_Address?.Users_Address_Detail?.State
                              ?.name
                          }
                          ,{" "}
                        </span>
                        <span>
                          {item?.User_Address?.Users_Address_Detail?.City?.name}{" "}
                          ,
                        </span>
                        <span>
                          {item?.User_Address?.Users_Address_Detail?.Area?.name}
                          ,{" "}
                        </span>
                        <span>
                          {
                            item?.User_Address?.Users_Address_Detail?.Pincode
                              ?.name
                          }
                          ,{" "}
                        </span>
                        <span>{item?.User_Address?.address_type}</span>
                        <span>{item?.User_Address?.contact_no} </span>
                      </div>
                    </div>

                    {/* 
                    <div className="order-id">
                      <span>Delivery Date</span>
                    </div>
                    <div className="text-highlight">
                      <span>{formatDate(item?.delivery_date)} </span>
                    </div>
                    <div className="order-id">
                      <span>Time Slot</span>
                    </div>
                    <div className="text-highlight">
                      <span>
                        {formatTo12Hour(item?.Time_Slot?.from)}-{formatTo12Hour(item?.Time_Slot?.to)}{" "}
                      </span>
                    </div> */}
                  </>
                  {/* ) : item?.service_id == ServiceIds.DineIn ? (
                        <>
                          <div className="order-info">
                            {" "}
                            <span> Table No.  :-</span>{" "}
                          </div>
                          <div className="text-highlight">
                            <span>{item?.table_no}</span>
                          </div>
                        </>
                      ) : item?.service_id == ServiceIds.RoomService ? (
                        <>
                          <div className="order-info">
                            {" "}
                            <span> Room No. :-</span>{" "}
                          </div>
                          <div className="text-highlight">
                            <span>{item?.room_no}</span>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}{" "}
                    </>
                  ) : (
                    <>
                      <div className="text-highlight">
                        <span>
                          {item?.User_Address?.first_name}{" "}
                          {item?.User_Address?.last_name}
                        </span>
                      </div>
                      <div className="order-info">
                        <span>{item?.User_Address?.floor} floor ,</span>
                        <span>{item?.User_Address?.building}, </span>
                        <span>{item?.User_Address?.apartment} ,</span>
                        <span>{item?.User_Address?.street}, </span>
                      </div>
                      <div className="order-info">
                        <span>{item?.User_Address?.address_type}</span>
                      </div>
                      <div className="text-highlight">
                        <span>{item?.User_Address?.contact_no} </span>
                      </div>
                    </>
                  )} */}
                </td>
                <td>
                  {item?.order_status_id === 4 ? (
                    <div>
                      <p className="status-holder shipped">
                        {item?.Order_status?.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="status-holder Unshipped">
                        {item?.Order_status?.name}
                      </p>
                    </div>
                  )}

                  {item?.Order_History?.delivery_boy_assigned && (
                    <div className="order-info">
                      Delivery Boy Asigned At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.delivery_boy_assigned)
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
                  )}

                  {item?.Order_History?.out_for_delivery && (
                    <div className="order-info">
                      Out For Delivery At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.out_for_delivery)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(
                            item?.Order_History?.out_for_delivery
                          )}{" "}
                          IST
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.Order_History?.cancelledAt && (
                    <div className="order-info">
                      Cancelled At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.cancelledAt)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(item?.Order_History?.cancelledAt)}{" "}
                          IST
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.Order_History?.returnRequestedAt && (
                    <div className="order-info">
                      Return Requested At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.returnRequestedAt)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(
                            item?.Order_History?.returnRequestedAt
                          )}{" "}
                          IST
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.Order_History?.returnScheduledAt && (
                    <div className="order-info">
                      Return Scheduled At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.returnScheduledAt)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(
                            item?.Order_History?.returnScheduledAt
                          )}{" "}
                          IST
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.Order_History?.itemPickedAt && (
                    <div className="order-info">
                      Item Picked At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.itemPickedAt)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(item?.Order_History?.itemPickedAt)}{" "}
                          IST
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.Order_History?.returnedAt && (
                    <div className="order-info">
                      Returned At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.returnedAt)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(item?.Order_History?.returnedAt)} IST
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.Order_History?.refundedAt && (
                    <div className="order-info">
                      Refunded At
                      <div className="order-info">
                        <span>
                          {
                            new Date(item?.Order_History?.refundedAt)
                              .toISOString()
                              .split("T")[0]
                          }
                          {formatTimeInIST(item?.Order_History?.refundedAt)} IST
                        </span>
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  {/* {!item?.Return_Order ? (
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
                            OrderStatusIds.Processing &&
                            user?.role_id === RoleId.Vendor && (
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
                            OrderStatusIds.Processing &&
                            user?.role_id === RoleId.Vendor && (
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
                            ReturnStatusIds.ReturnRequested &&
                            user?.role_id === RoleId.Vendor && (
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
                            ReturnStatusIds.ReturnRequested &&
                            user?.role_id === RoleId.Vendor && (
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
                               
                                  </div>
                                )}
                              </>
                            )}
                        </>
                      ) : (
                        <>
                          {item?.Return_Order?.return_status_id ===
                            ReturnStatusIds.ReturnRequested &&
                            user?.role_id === RoleId.Vendor && (
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
                  )} */}

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

export default CancelledTable;
