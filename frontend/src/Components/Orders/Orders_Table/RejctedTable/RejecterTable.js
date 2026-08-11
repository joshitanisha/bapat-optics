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
import { useLoader } from "../../../../utils/common";
import { ClipLoader } from "react-spinners";
function CancelledTable({}) {
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
    const response = await withLoader(() =>
      getData(
        `/admin/orders/cancel-order?page=${onPageChange || 1}&per_page=${
          perPage?.value || 25
        }&term=${encodeURIComponent(search)}&searchOrderStatus=${
          OrderStatusIds.Rejected || ""
        }&storeCategory=${storeCategory}&productCategory=${
          productCategory || ""
        }&sortOrder=${sortOrder?.value || "DESC"}&from=${
          searchDateFrom || ""
        }&to=${searchDateTo || ""}&start_time=${searchStartTime || ""}&end_time=${
          searchEndTime || ""
        }&name=${search || ""}&customer=${searchCustomer || ""}`,
      ),
    );
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
      </Pagination.Item>,
    );
  }

  const [showAssign, setShowAssign] = useState({ show: 0, data: {} });
  const [showReturnAssign, setShowReturnAssign] = useState({
    show: 0,
    data: {},
  });
  const [showDetails, setShowDetails] = useState({ show: 0, data: {} });

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
          `/admin/orders/download?page=${onPageChange || 1}&per_page=${
            perPage?.value || 25
          }&term=${encodeURIComponent(search)}&searchOrderStatus=${
            OrderStatusIds.Rejected || ""
          }&storeCategory=${storeCategory}&productCategory=${
            productCategory || ""
          }&sortOrder=${sortOrder?.value || "DESC"}&from=${
            searchDateFrom || ""
          }&to=${searchDateTo || ""}&start_time=${
            searchStartTime || ""
          }&end_time=${searchEndTime || ""}&name=${search || ""}&customer=${
            searchCustomer || ""
          }`,
          null,
          "Subscription Order List",
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const [loader, setLoder] = useState(false);
  const downloadInvoice = async (order_id) => {
    setLoder(true);
    try {
      // 1️⃣ Get invoice path
      const response = await postData(
        "/common/masters/cancel-invoice-genarate",
        {
          order_id,
        },
      );

      if (!response?.data) {
        alert("Invoice not found");
        return;
      }

      if (response?.success) {
        const fileUrl = `${IMG_URL}${response.data}`;

        // 2️⃣ Fetch PDF silently (URL not visible to user)
        const fileResponse = await fetch(fileUrl);
        const blob = await fileResponse.blob();

        if (blob.type !== "application/pdf") {
          alert("Invalid invoice file");
          return;
        }

        // 3️⃣ Download file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice_${order_id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setLoder(false);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download invoice");
    }
  };
  return (
    <section className="pending-table_holder">
      {/* Quick Filters Section */}
      <div className="quick-filters mt-0">
       
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
                    if (year <= 2025) {
                      setSearchDateTo(value);
                      setonPageChange(1);
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
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
                dateFormat="h:mm aa"
                placeholderText="Select time"
                className="form-control"
              />
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
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
                placeholderText="Select time"
                className="form-control"
              />
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
              {/* <th>Action</th> */}
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
                      <b> Contact No :</b>
                    </span>
                    <span className="order-info">
                      {item?.Product_Order?.User?.contact_no}
                    </span>
                  </div>

                  <div className="order-info">
                    <span>{item?.Product_Order?.Payment_Type?.name}</span>
                  </div>

                  {/* <div className="order-info">
                    <span>{item?.user?.type}</span>
                  </div> */}
                </td>

                <td className="order-details">
                  {/* {item?.Product_Order_Details?.map((product) => ( */}
                  <>
                    <div className="text-highlight">
                      <span>
                        <b> Product : </b> {item?.Product?.name}
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        <b>Category : </b>
                        {item?.Product?.p_category?.name}{" "}
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        <b>Lens Type : </b>
                        {item?.Prescription?.LensType?.name || "NA"}{" "}
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        <b>AddOn : </b>
                        {item?.Prescription?.Addon?.name || "NA"}{" "}
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        <b>Lens : </b>
                        {item?.Prescription?.Lense?.name || "NA"}{" "}
                      </span>
                    </div>
                  </>
                  {/* ))} */}
                  <div></div>
                  {/* <div className=" mt-3">
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
                  </div> */}
                </td>

                <td className="order-details">
                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total SubTotal</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        {Number(item?.total_selling_price).toFixed(2)} /-
                      </span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total Addon</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        {Number(item?.total_addon_price).toFixed(2)} /-
                      </span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Shipping Charges</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        {Number(item?.delivery_charges).toFixed(2)} /-
                      </span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Offer Discount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{Number(item?.offer_discount).toFixed(2)} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b> Coupon Discount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{Number(item?.coupon_discount).toFixed(2)} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total Tax</b>{" "}
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{Number(item?.total_tax).toFixed(2)} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Grand Total</b>{" "}
                      </span>
                    </div>
                    <div className="text-highlight">
                      <span>{Number(item?.total_amount).toFixed(2)} /-</span>
                    </div>
                  </div>
                </td>

                <td>
                  <>
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
                        </div>{" "}
                      </>
                    ) : (
                      "Store Address"
                    )}

                    {/* <div className="order-info">
                      <span>
                        <b>Cancel Message :</b>
                      </span>{" "}

                      <span>
                        {item?.Product_Order?.Order_Cancellation?.message}
                      </span>
                    </div>
                    <div className="text-highlight">
                      <span>
                        <b>Cancel Reason :</b>
                      </span>{" "}

                      <span>
                        {
                          item?.Product_Order?.Order_Cancellation?.Cancel_Reason
                            ?.name
                        }{" "}
                      </span>
                    </div> */}
                  </>
                </td>

                <td>
                  <div>
                    <p className="status-holder Unshipped">Rejected</p>
                  </div>
                  <div className="my-1">
                    {loader ? (
                      <>
                        <div className="text-center">
                          <ClipLoader />
                        </div>
                      </>
                    ) : (
                      <Button
                        className="action-btn"
                        // onClick={() => downloadInvoice(IMG_URL + item?.invoice)}
                        onClick={() => downloadInvoice(item?.Product_Order?.id)}
                      >
                        Print Tax Invoice
                      </Button>
                    )}
                  </div>
                  {/* {item?.order_status_id === 4 ? (
                    <div>
                      <p className="status-holder shipped">
                        {item?.Order_status?.name}
                      </p>
                    </div>
                  ) : (
                   
                  )} */}
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
