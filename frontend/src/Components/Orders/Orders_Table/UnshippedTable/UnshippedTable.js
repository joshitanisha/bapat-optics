import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import {
  Table,
  Button,
  Form,
  Pagination,
  Col,
  Row,
  Badge,
} from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { getData, getDownloadDataExcel, postData } from "../../../../utils/api";
import { Link } from "react-router-dom";
import {
  formatDate,
  formatDateTime,
  formatDateTimeNew,
  formatTo12Hour,
  IDS,
  OrderStatusIds,
  ReturnStatusIds,
  RoleId,
  ServiceIds,
  Stock_Status,
} from "../../../../utils/common";
import AssignOffCanvance from "../AssignDeliveryBoy";
import ProductModal from "../ProductModal";
import AssignReturnOffCanvance from "../AssignReturnDeliveryBoy";
import Pagination_Holder from "../../../common/Pagination_Holder/Pagination_Holder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import search1 from "../../../assets/icons/search.png";
import { Modal } from "react-bootstrap";
import ExpiryDatePacking from "../ExpiryDatePacking";
import PackingTable from "../Packing/Packing";
import { useLoader } from "../../../../utils/common";
import { ClipLoader } from "react-spinners";
function UnshippedTable({
  activeTab,

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
  // const [searchOrderStatus, setSearchOrderSatatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState();

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
    const response = await withLoader(() =>
      getData(
        `/admin/orders/product-order?page=${onPageChange || 1}&per_page=${
          perPage?.value || 25
        }&term=${encodeURIComponent(search)}&searchOrderStatus=${
          OrderStatusIds.Processing || ""
        }&productCategory=${productCategory.value || ""}&sortOrder=${
          sortOrder?.value || "DESC"
        }&from=${searchDateFrom || ""}&to=${searchDateTo || ""}&start_time=${
          searchStartTime || ""
        }&end_time=${searchEndTime || ""}&name=${search || ""}&customer=${
          searchCustomer || ""
        }`,
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
  }, [reset, onPageChange]);

  useEffect(() => {
    if (activeTab === "Unshipped") {
      getDataAll();
    }
  }, [activeTab]);

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

  const [showPaking, setShowPaking] = useState({ show: 0, data: {} });
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

    return istTime;
  };
  const [showModal, setShowModal] = useState(false);
  const ChangeOrderStatus = async (
    id,
    status_id,
    paymentMethod,
    remainingAmount,
  ) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/orders/product-order/update-status/${id}`, {
        order_status_id: status_id,
        payment_method_id: paymentMethod,
        advance_amount: remainingAmount,
      });
      setShowModal(true);

      await getDataAll();
      await GetAllCounts();

      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating store status:", error);
    }
  };

  const HandleDownload = async () => {
    if (data?.data?.data?.length <= 0) {
      alert("No record found");
    } else {
      try {
        await getDownloadDataExcel(
          `/admin/orders/download?page=${onPageChange || 1}&per_page=${
            perPage?.value || 25
          }&term=${encodeURIComponent(search)}&searchOrderStatus=${
            OrderStatusIds.Processing || ""
          }&productCategory=${productCategory.value || ""}&sortOrder=${
            sortOrder?.value || "DESC"
          }&from=${searchDateFrom || ""}&to=${searchDateTo || ""}&start_time=${
            searchStartTime || ""
          }&end_time=${searchEndTime || ""}&name=${search || ""}&customer=${
            searchCustomer || ""
          }`,
          null,
          "Order List",
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

  // const downloadInvoice = (invoiceUrl) => {
  //   // Make a GET request to the backend to trigger the download
  //   const link = document.createElement("a");
  //   link.href = invoiceUrl; // The URL of the invoice file on the server
  //   link.target = "_blank";
  //   link.download = true; // This ensures the browser triggers a download
  //   link.click();
  // };

  const [loader, setLoder] = useState(false);
  const downloadInvoice = async (order_id) => {
    setLoder(order_id);
    try {
      // 1️⃣ Get invoice path
      const response = await postData("/common/masters/invoice-genarate", {
        order_id,
      });

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("1"); // Cash default
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [allPaymentDone, setAllPaymentDone] = useState(false);

  const totalAmount = Number(selectedOrder?.total_amount || 0);

  const totalAdvancePayment = (selectedOrder?.Advance_Payments || []).reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );

  const remainingAmount = Math.max(totalAmount - totalAdvancePayment, 0);
  const isPaymentComplete = totalAdvancePayment >= totalAmount;

  return (
    <section className="pending-table_holder">
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
            <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
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

                <td className="order-details">
                  <div className="order-id text-highlight">
                    {item?.invoice_no}
                  </div>
                  <div className="order-info">
                    <div className="text-highlight">
                      <span>
                        {" "}
                        <b> Buyer Name :</b>
                      </span>
                      <span className="text-highlight">{item?.User?.name}</span>
                    </div>
                  </div>
                  <div className="order-info">
                    <span>
                      {" "}
                      <b> Contact No :</b>
                    </span>
                    <span className="order-info">{item?.User?.contact_no}</span>
                  </div>

                  <div className="order-info">
                    <div className="text-highlight">
                      <span>
                        {" "}
                        <b> Payment Method :</b>
                      </span>{" "}
                      <span>{item?.Payment_Method?.name}</span>
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
                          <b>Product Name : </b>
                          {product?.Product?.name}
                        </span>
                      </div>
                      <div className="order-info">
                        <div className="text-highlight">
                          <span>
                            <b>Category Name : </b>
                            {product?.Product?.p_category?.name}{" "}
                          </span>
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
                      <span>
                        {Number(item?.total_selling_price).toFixed(2)} /-
                      </span>
                    </div>
                  </div>
                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total Lens Price</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        {Number(item?.total_lense_price).toFixed(2)} /-
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
                      <span>
                        {Number(item?.total_offer_discount).toFixed(2)} /-
                      </span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b> Coupon Discount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>
                        {Number(item?.total_coupon_discount).toFixed(2)} /-
                      </span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b> Reward Discount</b>
                      </span>
                    </div>
                    <div className="order-info">
                      <span>{Number(item?.reward_discount).toFixed(2)} /-</span>
                    </div>
                  </div>

                  <div className="order-details_info">
                    <div className="order-id">
                      <span>
                        <b>Total Tax</b>{" "}
                      </span>
                    </div>
                    <div className="order-info">
                      <span> {(
                          Number(item?.total_tax) + Number(item?.lens_tax || 0)
                        ).toFixed(2)}{" "} /-</span>
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
                  <div className="text-highlight">
                    <span>
                      <b>GST Number</b>{" "}
                    </span>
                    : <span>{item?.gst_number || "NA"} </span>
                  </div>
                  {item?.User_Address ? (
                    <>
                      <div className="text-highlight">
                        <span>
                          {item?.User_Address?.first_name}{" "}
                          {item?.User_Address?.last_name}
                        </span>
                      </div>
                      <div className="order-info text-highlight">
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
                    </>
                  ) : (
                    "Store Address"
                  )}
                </td>

                <td>
                  <div>
                    <p className="status-holder Unshipped">
                      {item?.Order_status?.name}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="my-1">
                    <Button
                      className="action-btn active"
                      // onClick={() => {
                      //   setSelectedOrder(item);
                      //   setShowPaymentModal(true);
                      // }}
                      onClick={() => {
                        const hasInvalidStock =
                          item?.Product_Order_Details?.some((detail) => {
                            const stockStatusId = Number(
                              detail?.Stock?.stock_status_id,
                            );

                            const lensStockStatusId = Number(
                              detail?.Lens_Stock?.stock_status_id,
                            );

                            return (
                              stockStatusId === Number(Stock_Status.Dummy) ||
                              lensStockStatusId === Number(Stock_Status.Dummy)
                            );
                          });

                       

                        if (hasInvalidStock) {
                          alert(
                            "⚠️ Order assigned to dummy stock. Please convert to real stock.",
                          );
                          return;
                        }

                        // ✅ proceed to accept order
                        setSelectedOrder(item);
                        setShowPaymentModal(true);
                        // ChangeOrderStatus(item?.id, OrderStatusIds.Processing);
                      }}
                    >
                      {" "}
                      Pickup Scheduled Order{" "}
                    </Button>

                    <div className="my-1">
                     {loader === item?.id ? (
                        <>
                          <div className="text-center">
                            <ClipLoader />
                          </div>
                        </>
                      ) : (
                        <Button
                          className="action-btn"
                          // onClick={() => downloadInvoice(IMG_URL + item?.invoice)}
                          onClick={() => downloadInvoice(item?.id)}
                        >
                          Print Tax Invoice
                        </Button>
                      )}
                    </div>
                  </div>
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

      <AssignOffCanvance
        handleClose={() => {
          setShowAssign({ show: 0, data: {} });
          getDataAll();
        }}
        setShow={() => setShowAssign({ show: 0, data: {} })}
        show={showAssign?.show}
        data={showAssign?.data}
      />

      <ExpiryDatePacking
        handleClose={() => {
          setShowPaking({ show: 0, data: {} });
          getDataAll();
        }}
        setShow={() => setShowPaking({ show: 0, data: {} })}
        show={showPaking?.show}
        data={showPaking?.data}
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Status Updated
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Order status changed successfully ✅</p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* ================= Summary ================= */}
          <Row className="mb-2">
            <Col>
              <b>Total Amount</b>
            </Col>
            <Col className="text-end fw-bold">₹ {totalAmount.toFixed(2)}</Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <b>Advance Paid</b>
            </Col>
            <Col className="text-end text-success">
              ₹ {totalAdvancePayment.toFixed(2)}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <b>Remaining Amount</b>
            </Col>
            <Col className="text-end text-danger fw-bold">
              ₹ {remainingAmount.toFixed(2)}
            </Col>
          </Row>

          <hr />

          {/* ================= Payment History ================= */}
          <h6 className="fw-bold mb-2">Payment History</h6>

          {(selectedOrder?.Advance_Payments || []).length > 0 ? (
            <div className="border rounded p-2 mb-3">
              {selectedOrder.Advance_Payments.map((pay, index) => (
                <Row key={index} className="mb-1">
                  <Col>
                    <small className="text-muted nowrap_text">
                      <b>{new Date(pay.createdAt).toLocaleString("en-IN")}</b>
                    </small>
                  </Col>

                  <Col className="text-center">
                    <Badge bg="secondary">
                      {pay.payment_method_id === 1 ? "Cash" : "Online"}
                    </Badge>
                  </Col>

                  <Col className="text-end fw-bold text-success">
                    ₹ {Number(pay.amount).toFixed(2)}
                  </Col>
                </Row>
              ))}
            </div>
          ) : (
            <p className="text-muted mb-3">No payments done yet</p>
          )}

          {/* ================= New Payment ================= */}
          {!isPaymentComplete && (
            <>
              <h6 className="fw-bold mb-2">Add Payment</h6>

              <div className="d-flex justify-content-between mb-2">
                <Form.Check
                  type="radio"
                  id="cash"
                  label="💵 Cash"
                  value="1"
                  name="paymentMethod"
                  checked={paymentMethod === "1"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <Form.Check
                  type="radio"
                  id="online"
                  label="💳 Online"
                  value="3"
                  name="paymentMethod"
                  checked={paymentMethod === "3"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>

              {/* <Form.Control
                type="number"
                min="1"
                max={remainingAmount}
                placeholder="Enter payment amount"
                value={newPaymentAmount}
                onChange={(e) => setNewPaymentAmount(e.target.value)}
                className="mb-2"
              /> */}
              <Form.Check
                type="checkbox"
                id="allPaymentDone"
                label="All payment done"
                checked={allPaymentDone}
                onChange={(e) => setAllPaymentDone(e.target.checked)}
              />
            </>
          )}

          <div className="text-center mt-2">
            {isPaymentComplete ? (
              <Badge bg="success">All Payment Completed</Badge>
            ) : (
              <>
                {" "}
                <Badge bg="warning">Payment Pending</Badge>{" "}
              </>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </Button>

          {/* {!isPaymentComplete && (
      <Button
        variant="outline-primary"
        disabled={!newPaymentAmount}
        onClick={handleAddPayment}
      >
        Add Payment
      </Button>
    )} */}

          {isPaymentComplete ? (
            <Button
              variant="primary"
              onClick={() => {
                ChangeOrderStatus(
                  selectedOrder?.id,
                  OrderStatusIds.PickupSchedued,
                );
                setShowPaymentModal(false);
              }}
            >
              Confirm Pickup
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={!allPaymentDone}
              onClick={() => {
                ChangeOrderStatus(
                  selectedOrder?.id,
                  OrderStatusIds.PickupSchedued,
                  paymentMethod,
                  remainingAmount,
                );
                setShowPaymentModal(false);
              }}
            >
              Confirm Pickup
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Pickup</Modal.Title>
        </Modal.Header>

        <Modal.Body>
         
          <Row className="mb-2">
            <Col>Total Amount</Col>
            <Col className="text-end fw-bold">₹ {totalAmount.toFixed(2)}</Col>
          </Row>

          <Row className="mb-2">
            <Col>Advance Paid</Col>
            <Col className="text-end text-success">
              ₹ {totalAdvancePayment.toFixed(2)}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>Remaining Amount</Col>
            <Col className="text-end text-danger fw-bold">
              ₹ {remainingAmount.toFixed(2)}
            </Col>
          </Row>

          <hr />

          

       
          <h6 className="fw-bold mb-2">Payment History</h6>

          {(selectedOrder?.Advance_Payments || []).length > 0 ? (
            <div className="border rounded p-2 mb-3">
              {selectedOrder.Advance_Payments.map((pay, index) => (
                <Row key={index} className="mb-1 align-items-center">
                  <Col>
                    <small className="text-muted">
                      {new Date(pay.createdAt).toLocaleString("en-IN")}
                    </small>
                  </Col>

                  <Col className="text-center">
                    <Badge bg="secondary">
                      {pay.payment_method_id === 1 ? "Cash" : "Online"}
                    </Badge>
                  </Col>

                  <Col className="text-end fw-bold text-success">
                    ₹ {Number(pay.amount).toFixed(2)}
                  </Col>
                </Row>
              ))}
            </div>
          ) : (
            <p className="text-muted mb-3">No payments done yet</p>
          )}

          <hr />

        
          <Form.Check
            type="checkbox"
            id="allPaymentDone"
            label="All payment done"
            checked={allPaymentDone}
            onChange={(e) => setAllPaymentDone(e.target.checked)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!allPaymentDone}
            onClick={() => {
              ChangeOrderStatus(
                selectedOrder?.id,
                OrderStatusIds.PickupSchedued
              );
              setShowPaymentModal(false);
            }}
          >
            Confirm Pickup
          </Button>
        </Modal.Footer>
      </Modal> */}
    </section>
  );
}

export default UnshippedTable;
