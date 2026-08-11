import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import {
  getDownloadDataExcel,
  postData,
  postDataPDF,
} from "../../../../utils/api";
import { Link } from "react-router-dom";
import {
  formatDate,
  formatDateToIST,
  formatTo12Hour,
  IDS,
  OrderStatusIds,
  ReturnStatusIds,
  RoleId,
  ServiceIds,
  Stock_Status,
} from "../../../../utils/common";
import ProductModal from "../ProductModal";
import Pagination_Holder from "../../../common/Pagination_Holder/Pagination_Holder";

import DatePicker from "react-datepicker";
import search1 from "../../../assets/icons/search.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CancelOrderModel from "../CancelOrderModel";
import AddOffCanvance from "./Add";
import plus from "../../../../Components/assets/icons/a1.png";
import { Modal } from "react-bootstrap";
import Lense_prescription_modal_show from "../Lense_prescription_modal_show";
import { useLoader } from "../../../../utils/common";
import { ClipLoader } from "react-spinners";
function PendingOrdersTable({
  user,
  OrderByOptions,
  resultsPerPageOptions,
  storeCategories,
  vendorServices,
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
  const [searchCustomer, setSearchCustomer] = useState("");
  const [reset, setReset] = useState();
  const [searchOrderStatus, setSearchOrderSatatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState();
  const [hideFilter, setHideFilter] = useState(false);
  const [storeCategory, setStoreCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");

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
          OrderStatusIds.Pending || ""
        }&storeCategory=${storeCategory}&productCategory=${
          productCategory.value || ""
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
  }, [reset, searchOrderStatus, onPageChange]);

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

  const [showDetails, setShowDetails] = useState({ show: 0, data: {} });
  const [showModal, setShowModal] = useState(false);
  const ChangeOrderStatus = async (id, status_id) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/orders/product-order/update-status/${id}`, {
        order_status_id: status_id,
      });
      setShowModal(true);
      // Refresh the data after updating the store's status
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
            OrderStatusIds.Pending || ""
          }&storeCategory=${storeCategory}&productCategory=${
            productCategory.value || ""
          }&sortOrder=${sortOrder?.value || "DESC"}&from=${
            searchDateFrom || ""
          }&to=${searchDateTo || ""}&start_time=${
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

  const [showCancelOrder, setShowCancelOrder] = useState({
    show: 0,
    data: {},
  });

  const [show, setShowAdd] = useState(false);
  const handleClose = () => setShowAdd(false);
  const handleShow = () => setShowAdd(true);

  // const downloadInvoice = async (order_id) => {
  //   const response = await postData("/common/masters/invoice-genarate", {
  //     order_id,
  //   });

  //   const invoiceUrl = IMG_URL + response.data;
  //   const link = document.createElement("a");
  //   link.href = invoiceUrl; // The URL of the invoice file on the server
  //   link.target = "_blank";
  //   link.download = true; // This ensures the browser triggers a download
  //   link.click();
  // };
  const [loader, setLoder] = useState();
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

  return (
    <section className="pending-table_holder">
      <div className="quick-filters mt-0">
        <span className="quick-filters__label">
          <b>Quick Filters:</b>
        </span>
        <div className="quick-filters__tabs mb-3 ">
          <div className="row align-items-start">
            {/* {isAllow.includes(IDS.Order.Add) ? (
              <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="add me-3">
                  <Link type="button" className="btn btn-add pe-3">
                    <div onClick={() => handleShow()}>
                      <img src={plus} className="plus me-2 ms-0" alt="" />
                      Add Order
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <></>
            )} */}
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
              <Form.Label>Select Product </Form.Label>
              <Select
                isSearchable
                options={product}
                value={productCategory}
                placeholder="Select Product "
                onChange={(e) => {
                  setProductCategory(e);
                }}
                classNamePrefix="searchProduct"
              />
            </div>
            {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
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
            </div> */}
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
                  className="btn btn-success  Excel_btn"
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

      {/* <div className="my-3">
        <div>
          <strong>Total Amount:</strong> ₹
          {Number(data?.data?.total_selling_value || 0).toFixed(2)}
        </div>
        <div>
          <strong>Average Amount:</strong> ₹
          {Number(data?.data?.average_selling_value || 0).toFixed(2)}
        </div>
      </div> */}

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
                    {formatDateToIST(item?.createdAt)}
                  </div>
                </td>

                {/* Owner Details */}
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
                        <b>Total Lense Price</b>
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
                      <span>
                        {(
                          Number(item?.total_tax) + Number(item?.lens_tax || 0)
                        ).toFixed(2)}{" "}
                        /-
                      </span>
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
                </td>

                <td>
                  <div className="my-1">
                    <div className="my-1">
                      <Button
                        className="action-btn"
                        onClick={() =>
                          setShowDetails({
                            show: item?.id,
                            data: item?.Product_Order_Details,
                          })
                        }
                      >
                        Assign Order
                      </Button>
                    </div>
                    <Button
                      className="action-btn active"
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

                        console.log("hasInvalidStock:", hasInvalidStock);

                        if (hasInvalidStock) {
                          alert(
                            "⚠️ Order assigned to dummy stock. Please convert to real stock.",
                          );
                          return;
                        }

                        // ✅ proceed to accept order
                        ChangeOrderStatus(item?.id, OrderStatusIds.Processing);
                      }}
                    >
                      Accept Order
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

                    {/* <Button
                      className="action-btn active"
                      onClick={() =>
                        ChangeOrderStatus(item?.id, OrderStatusIds.Processing)
                      }
                    >
                      Accept Order
                    </Button> */}
                  </div>

                  {/* {item?.order_status_id !== OrderStatusIds.Cancelled && (
                    <div className="my-1">
                      <Button
                        className="action-btn"
                        onClick={() =>
                          setShowCancelOrder({ show: item?.id, data: item })
                        }
                      >
                        Cancel Order
                      </Button>
                    </div>
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
      <CancelOrderModel
        GetAllCounts={GetAllCounts}
        getDataAll={getDataAll}
        handleClose={() => {
          setShowCancelOrder({ show: 0, data: {} });
        }}
        setShow={() => setShowCancelOrder({ show: 0, data: {} })}
        show={showCancelOrder?.show}
        data={showCancelOrder?.data}
      />
      {show ? (
        <AddOffCanvance
          getDataAll={getDataAll}
          GetAllCounts={GetAllCounts}
          handleClose={handleClose}
          setShow={setShowAdd}
          show={show}
        />
      ) : (
        ""
      )}
      <ProductModal
        getDataAll={getDataAll}
        handleClose={() => {
          setShowDetails({ show: 0, data: {} });
        }}
        setShowDetails={setShowDetails}
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
    </section>
  );
}

export default PendingOrdersTable;
