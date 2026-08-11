import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { postData } from "../../../../utils/api";
import { Link } from "react-router-dom";
import {  useLoader } from "../../../../utils/common";
import {
  IDS,
  OrderStatusIds,
  ReplaceStatusIds,
  ReturnStatusIds,
  RoleId,
  ServiceIds,
} from "../../../../utils/common";
import AssignOffCanvance from "../AssignDeliveryBoy";
import ProductModal from "../ProductModal";
import AssignReplaceOffCanvance from "../Expirydate";
import Pagination_Holder from "../../../common/Pagination_Holder/Pagination_Holder";

function ReplaceTable({
  user,
  OrderByOptions,
  resultsPerPageOptions,
  storeCategories,
  productCategories,
  vendorServices,
  replace_order_status_id,
  setReplaceStatusId,
  statusCount,
  activeTab,
  handleTabClick,
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
  const [refund_status_id, setSearchRefundStatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState();
  const [hideFilter, setHideFilter] = useState(false);

  const [storeCategory, setStoreCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/orders/replace-order?page=${onPageChange || 1}&per_page=${
        perPage?.value || 25
      }&term=${encodeURIComponent(search)}&sortOrder=${
        sortOrder?.value || "DESC"
      }&replace_order_status_id=${replace_order_status_id}`
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
    storeCategory,
    productCategory,
    onPageChange,
    replace_order_status_id,
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

  return (
    <section className="pending-table_holder">
      <section className="pending-table_holder">
        <div className="filter-tabs-container">
          <div className="tabs">
            <button
              className={`waiting-tab ${
                activeTab === "ReplaceRequest" ? "active btn" : "btn"
              }`}
              onClick={() => {
                handleTabClick("ReplaceRequest");
                setReplaceStatusId(ReplaceStatusIds.ReplaceRequested);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.ReplaceRequested}</span> Replace Requested
            </button>
            <button
              className={`waiting-tab ${
                activeTab === "CustomerPickupScheduled" ? "active btn" : "btn"
              }`}
              onClick={() => {
                handleTabClick("CustomerPickupScheduled");
                setReplaceStatusId(ReplaceStatusIds.StoreItmePickupScheduled);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.StoreItmePickupScheduled}</span> Store Itme
              Pickup Scheduled
            </button>
            <button
              className={`waiting-tab ${
                activeTab === "CustomerItemPicked" ? "active btn" : "btn"
              }`}
              onClick={() => {
                handleTabClick("CustomerItemPicked");
                setReplaceStatusId(ReplaceStatusIds.StoreItemPicked);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.StoreItemPicked}</span> Store Item Picked
            </button>

            <button
              className={`waiting-tab ${
                activeTab === "ReplaceItemPickup" ? "active btn" : "btn"
              }`}
              onClick={() => {
                handleTabClick("ReplaceItemPickup");
                setReplaceStatusId(ReplaceStatusIds.CustomerItemReplaced);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.CustomerItemReplaced}</span>Customer Item
              Replaced / Store Relace Item Picked
            </button>
            <button
              className={`waiting-tab ${
                activeTab === "ReplaceItemDelivered" ? "active btn" : "btn"
              }`}
              onClick={() => {
                handleTabClick("ReplaceItemDelivered");
                setReplaceStatusId(ReplaceStatusIds.StoreReplaceItemDelivered);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.StoreReplaceItemDelivered}</span> Store
              Replace Item Delivered
            </button>
            <button
              className={`waiting-tab ${
                activeTab === "ReplaceItemRejected" ? "active btn" : "btn"
              }`}
              onClick={() => {
                handleTabClick("ReplaceItemRejected");
                setReplaceStatusId(ReplaceStatusIds.ReplaceItemRejected);
                setonPageChange(1);
              }}
            >
              <span>{statusCount?.ReplaceItemRejected}</span> Replace Item
              Rejected
            </button>
          </div>
        </div>
      </section>
      {/* Quick Filters Section */}
      {/* <div className="quick-filters">
        <span className="quick-filters__label">Quick Filters:</span>
        <div className="quick-filters__tabs mb-3">
          <Button
            className={
              storeCategory === "" && productCategory === ""
                ? "quick-filters__tab quick-filters__tab--active"
                : "quick-filters__tab"
            }
            onClick={() => {
              setStoreCategory("");
              setProductCategory("");
              setonPageChange(1);
            }}
          >
            All Orders
          </Button>

          {user && user?.role_id == RoleId.Admin ? (
            <>
              {storeCategories &&
                storeCategories.map((category) => {
                  return (
                    <Button
                      key={category?.value}
                      className={
                        storeCategory === category?.value
                          ? "quick-filters__tab quick-filters__tab--active"
                          : "quick-filters__tab"
                      }
                      onClick={() => {
                        setStoreCategory(category?.value);
                        setonPageChange(1);
                      }}
                    >
                      {category?.label}
                    </Button>
                  );
                })}
            </>
          ) : (
            <>
              {vendorServices &&
                vendorServices.map((category) => {
                  return (
                    <Button
                      key={category?.value}
                      className={
                        productCategory === category?.value
                          ? "quick-filters__tab quick-filters__tab--active"
                          : "quick-filters__tab"
                      }
                      onClick={() => setProductCategory(category?.value)}
                    >
                      {category?.label}
                    </Button>
                  );
                })}
            </>
          )}
        </div>
      </div> */}

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
            {/* Last 30 Days */}
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
            </div>

            {/* Results per page dropdown */}
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
              <th>Store details</th>
              <th>Products</th>
              <th>Total</th>
              <th>Delivery Details</th>
              {/* <th>Order Status</th> */}
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
                    <span>{item?.Product_Order?.user?.type}</span>
                  </div> */}
                </td>

                {/* Store Details */}
                <td className="order-details">
                  <div className="order-info">
                    <span className="text-highlight">
                      {item?.Product_Order?.Store_Detail?.store_name}
                    </span>
                  </div>
                  <div className="order-info">
                    <span>{item?.Product_Order?.Store_Detail?.legal_name}</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.Product_Order?.Store_Detail?.website}</span>
                  </div>
                </td>

                <td className="order-details">
                  {item?.Product_Order?.Product_Order_Details?.map(
                    (product) => (
                      <>
                        <div className="text-highlight">
                          <span>{product?.Product?.name}</span>
                        </div>
                        <div className="order-info">
                          <span>{product?.Product?.p_category?.name} </span>
                        </div>
                      </>
                    )
                  )}
                  <div></div>
                  <div className=" mt-3">
                    <Button
                      className="action-btn active"
                      onClick={() =>
                        setShowDetails({
                          show: item?.Product_Order?.id,
                          data: item?.Product_Order?.Product_Order_Details,
                        })
                      }
                    >
                      View All Details
                    </Button>
                  </div>
                </td>

                <td>
                  <div className="order-id">
                    <span>Total MRP</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.Product_Order?.total_mrp} /-</span>
                  </div>
                  <div className="order-id">
                    <span>
                      <b>Total Tax</b>{" "}
                    </span>
                  </div>
                  <div className="order-info">
                    <span>{item?.Product_Order?.total_tax} /-</span>
                  </div>
                  <div className="order-id">
                    <span>
                      <b>Grand Total</b>{" "}
                    </span>
                  </div>
                  <div className="text-highlight">
                    <span>{item?.Product_Order?.total_amount} /-</span>
                  </div>
                </td>

                <td>
                  {item?.Product_Order?.Store_Detail?.s_category_id == 1 ? (
                    <>
                      <div className="order-info">
                        <p className="status-holder shipped">
                          {item?.Product_Order?.Restaurant_Service?.name}
                        </p>
                      </div>
                      {item?.Product_Order?.service_id ==
                      ServiceIds.Delivery ? (
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
                      ) : item?.Product_Order?.service_id ==
                        ServiceIds.DineIn ? (
                        <>
                          <div className="order-info">
                            {" "}
                            <span> Table No.  :-</span>{" "}
                          </div>
                          <div className="text-highlight">
                            <span>{item?.Product_Order?.table_no}</span>
                          </div>
                        </>
                      ) : item?.Product_Order?.service_id ==
                        ServiceIds.RoomService ? (
                        <>
                          <div className="order-info">
                            {" "}
                            <span> Room No. :-</span>{" "}
                          </div>
                          <div className="text-highlight">
                            <span>{item?.Product_Order?.room_no}</span>
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
                  )}

                  <div>
                    <p className="status-holder shipped mt-1">
                      Delivery Boy details
                    </p>
                    <div className="text-highlight">
                      <span>{item?.User?.name} </span>
                    </div>
                    <div className="order-info">
                      <span>{item?.User?.email}</span>
                    </div>
                    <div className="order-info">
                      <span>{item?.User?.contact_no}</span>
                    </div>
                  </div>
                </td>

                {/* <td>
                  {item?.Product_Order?.order_status_id === 4 ? (
                    <div>
                      <p className="status-holder shipped">
                        {item?.Product_Order?.Order_status?.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="status-holder Unshipped">
                        {item?.Product_Order?.Order_status?.name}
                      </p>
                    </div>
                  )}

                  {item?.Product_Order?.Order_History?.delivery_boy_assigned &&
                    <div className="order-info">
                      Delivery Boy Asigned At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.delivery_boy_assigned).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.delivery_boy_assigned)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.out_for_delivery &&
                    <div className="order-info">
                      Out For Delivery At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.out_for_delivery).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.out_for_delivery)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.cancelledAt &&
                    <div className="order-info">
                      Cancelled At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.cancelledAt).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.cancelledAt)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.returnRequestedAt &&
                    <div className="order-info">
                      Return Requested At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.returnRequestedAt).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.returnRequestedAt)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.returnScheduledAt &&
                    <div className="order-info">
                      Return Scheduled At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.returnScheduledAt).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.returnScheduledAt)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.itemPickedAt &&
                    <div className="order-info">
                      Item Picked At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.itemPickedAt).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.itemPickedAt)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.returnedAt &&
                    <div className="order-info">
                      Returned At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.returnedAt).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.returnedAt)} IST
                        </span>
                      </div>
                    </div>
                  }

                  {item?.Product_Order?.Order_History?.refundedAt &&
                    <div className="order-info">
                      Refunded At
                      <div className="order-info">
                        <span>
                          {new Date(item?.Product_Order?.Order_History?.refundedAt).toISOString().split("T")[0]}
                          {formatTimeInIST(item?.Product_Order?.Order_History?.refundedAt)} IST
                        </span>
                      </div>
                    </div>
                  }
                </td> */}

                <td>
                  <div className="my-1">
                    <Button
                      className="action-btn"
                      onClick={() =>
                        downloadInvoice(IMG_URL + item?.Product_Order?.invoice)
                      }
                    >
                      Print Tax Invoice
                    </Button>
                  </div>
                  {item?.replace_order_status_id ===
                    ReplaceStatusIds.ReplaceRequested &&
                    user?.role_id === RoleId.Vendor &&
                    (item?.User ? (
                      <div className="my-1">
                        <Button className="action-btn active">
                          {" "}
                          {item?.User?.name}
                        </Button>
                      </div>
                    ) : (
                      <div className="my-1">
                        <Button
                          className="action-btn active"
                          onClick={() =>
                            setShowReturnAssign({
                              show: item?.Product_Order?.id,
                              data: item?.Product_Order?.User_Address,
                            })
                          }
                        >
                          {" "}
                          Assign Delivery Boy{" "}
                        </Button>
                      </div>
                    ))}
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
      <AssignReplaceOffCanvance
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

export default ReplaceTable;
