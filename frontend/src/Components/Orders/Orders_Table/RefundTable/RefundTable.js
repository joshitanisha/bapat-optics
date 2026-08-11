import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { postData } from "../../../../utils/api";
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
import Rejected from "./Rejected";
import ProductRefundModal from "../ProductRefundModal";
import search1 from "../../../assets/icons/search.png";
import {  useLoader } from "../../../../utils/common";
function RefundTable({
  user,
  OrderByOptions,
  resultsPerPageOptions,
  storeCategories,
  productCategories,
  vendorServices,
  payment_status,
  setPayment_status,
  statusCount,
  activeTab,
  handleTabClick,
  GetAllCounts,
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
  const [refund_status_id, setSearchRefundStatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState();
  const [hideFilter, setHideFilter] = useState(false);

  const [storeCategory, setStoreCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const [searchCustomer, setSearchCustomer] = useState("");

  const [searchDateTo, setSearchDateTo] = useState();
  const [searchDateFrom, setSearchDateFrom] = useState();
 const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/orders/refund-order?page=${onPageChange || 1}&per_page=${perPage?.value || 25
      }&term=${encodeURIComponent(search)}&sortOrder=${sortOrder?.value || "DESC"
      }&payment_status=${payment_status}&productCategory=${productCategory.value || ""
      }&customer=${searchCustomer || ""}&from=${searchDateFrom || ""}&to=${searchDateTo || ""
      }`
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
  }, [
    reset,
    searchOrderStatus,
    // storeCategory,
    // productCategory,
    onPageChange,
    payment_status,
  ]);

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

  const ChangePaymentStatus = async (id) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/orders/accept-refund-order/${id}`, {
        type: "accept",
      });

      await getDataAll();
      await GetAllCounts();
    } catch (error) {
      console.error("Error updating store status:", error);
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
      <section className="pending-table_holder">
        <div className="filter-tabs-container">
          <div className="tabs">
            <button
              className={`waiting-tab ${activeTab === "RefundRequest" ? "active btn" : " btn"
                }`}
              onClick={() => {
                handleTabClick("RefundRequest");
                setPayment_status("");
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.RefundRequest}</span> Refund Requested
            </button>
            <button
              className={`waiting-tab ${activeTab === "Refunded" ? "active btn" : " btn"
                }`}
              onClick={() => {
                handleTabClick("Refunded");
                setPayment_status(1);
                setonPageChange(1);
              }}
            >
              <span> {statusCount?.RefundAccepted} </span>
              Refund Accepted
            </button>
            <button
              className={`waiting-tab ${activeTab === "RefundRejected" ? "active btn" : " btn"
                }`}
              onClick={() => {
                handleTabClick("RefundRejected");
                setPayment_status(0);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.RefundRejected}</span> Refund Rejected
            </button>
          </div>
        </div>
      </section>

      <br></br>
      <div className="quick-filters mt-0">
        <span className="quick-filters__label">
          <b>Quick Filters:</b>
        </span>
        <div className="quick-filters__tabs mb-3 ">
          <div className="row align-items-start">
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <div className="Search-1">
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
              <div className="Search-1">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="To"
                  max="2050-12-31"
                   min={searchDateFrom}
                  value={searchDateTo}
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
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
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
            <div className=" col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
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
            <div className=" col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <div className="Search-1">
                <Form.Label>Reset</Form.Label>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchDateFrom("");
                    setSearchDateTo("");
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

            {/* <div className=" col-xl-2 col-lg-4 col-md-6 col-12 mb-2">
                <div>
                  <button
                    className="btn btn-success mt-2"
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
              </div> */}
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
                  <div className="order-id text-highlight">
                    {item?.Product_Order?.invoice_no}
                  </div>
                  <div className="text-highlight">
                    <div className="order-info">
                      <span>
                        {" "}
                        <b> Buyer Name :</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span className="text-highlight">
                        {item?.Product_Order?.User?.name}
                      </span>
                    </div>
                  </div>
                  <div className="order-info">
                    <span>
                      {" "}
                      <b> Buyer Contact No. :</b>
                    </span>
                    <span className="order-info">
                      {item?.Product_Order?.User?.contact_no}
                    </span>
                  </div>

                  <div className="order-info">
                    <span>{item?.Product_Order?.Payment_Type?.name}</span>
                  </div>

                  {/* <div className="order-info">
                    <span>{item?.Product_Order?.user?.type}</span>
                  </div> */}
                </td>

                <td className="order-details">
                  {item?.Refund_Order_Details?.map((product) => (
                    <>
                      <div className="text-highlight">
                        <span>
                          {product?.Product_Order_Detail?.Product?.name}
                        </span>
                      </div>
                      <div className="order-info">
                        <span>
                          {
                            product?.Product_Order_Detail?.Product?.p_category
                              ?.name
                          }{" "}
                        </span>
                      </div>
                    </>
                  ))}
                  <div></div>
                  {/* <div className=" mt-3">
                    <Button
                      className="action-btn active"
                      onClick={() =>
                        setShowDetails({
                          show: item?.Product_Order?.id,
                          data: item?.Refund_Order_Details,
                        })
                      }
                    >
                      View All Details
                    </Button>
                  </div> */}
                </td>

                <td className="order-details">
                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Refund Amount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{Number(item?.refund_amount).toFixed(2)} /-</span>
                    </div>
                  </div>
                </td>

                <td>
                  {item?.Product_Order?.User_Address ? (
                    <>
                      <div className="text-highlight">
                        <span>
                          {item?.Product_Order?.User_Address?.first_name}{" "}
                          {item?.Product_Order?.User_Address?.last_name}
                        </span>
                      </div>
                      <div className="order-info text-highlight">
                        <span>
                          {item?.Product_Order?.User_Address?.floor} floor ,
                        </span>
                        <span>
                          {item?.Product_Order?.User_Address?.building},{" "}
                        </span>
                        <span>
                          {item?.Product_Order?.User_Address?.apartment} ,
                        </span>
                        <span>
                          {item?.Product_Order?.User_Address?.street},{" "}
                        </span>
                        <span>
                          {item?.Product_Order?.User_Address?.address_type}
                        </span>
                        <span>
                          {item?.Product_Order?.User_Address?.contact_no}{" "}
                        </span>
                      </div>
                    </>
                  ) : (
                    "Store Address"
                  )}
                </td>

                <td>
                  <div>
                    <p className="status-holder Unshipped">
                      {item?.Refund_Order_Details[0]?.Product_Order_Detail
                        ?.status
                        ? "Returned"
                        : "Cancelled"}
                    </p>
                  </div>
                </td>
                <td>
                  {item?.payment_status == null ? (
                    <>
                      {" "}
                      <div className="my-1">
                        <Button
                          className="action-btn active"
                          onClick={() => ChangePaymentStatus(item?.id)}
                        >
                          {" "}
                          Accept Payment
                        </Button>
                      </div>
                      <div
                        className="my-1"
                        onClick={() => setShowAssign({ show: item?.id })}
                      >
                        <Button className="action-btn">Rejected Payment</Button>
                      </div>
                    </>
                  ) : item?.payment_status == 1 ? (
                    <div className="my-1">
                      <Button
                        className="action-btn active"
                      // onClick={() => ChangePaymentStatus(item?.id)}
                      >
                        {" "}
                        Accept Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="my-1">
                      <Button
                        className="action-btn active"
                      // onClick={() => ChangePaymentStatus(item?.id)}
                      >
                        {" "}
                        Rejected Payment
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

      <Rejected
        handleClose={() => {
          setShowAssign({ show: 0, data: {} });
          getDataAll();
        }}
        getDataAll={getDataAll}
        GetAllCounts={GetAllCounts}
        setShow={() => setShowAssign({ show: 0, data: {} })}
        show={showAssign?.show}
        data={showAssign?.data}
      />

      <ProductRefundModal
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

export default RefundTable;
