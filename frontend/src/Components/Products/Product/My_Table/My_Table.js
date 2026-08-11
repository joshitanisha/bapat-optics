import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "./My_Table.css";
import Select from "react-select";
import { Table, Button, Form } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import {
  deleteData,
  editStatusData,
  getData,
  getDownloadDataExcel,
  postData,
  putData,
} from "../../../../utils/api";
import { Link } from "react-router-dom";
import {
  ApprovalStatus,
  Category,
  IDS,
  RoleId,
  Select2Data,
} from "../../../../utils/common";
import LinkProductsModel from "../LinkProductsModel";
import { DeletButton } from "../../../common/Button";
import ModalDelete from "../../../common/ModelDelete";
import search1 from "../../../assets/icons/search.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClipLoader } from "react-spinners";
function My_Table({
  data,
  getDataAll,
  user,
  reset,
  setonPageChange,
  setChangeStatus,

  setReset,
  categories,
  setSearchCategory,
  setSearchSubCategory,
  setSearchChildCategory,

  searchCategory,
  getAllSubCategories,

  setSearch,
  search,
  searchDateTo,
  searchDateFrom,
  setSearchDateTo,
  setSearchDateFrom,
  setSubCategories,
  setChildCategories,
  HandleDownload,
  HandleDownloadProductOrder,
  BulkUpload,
  bulkCategoryId,
  setBulkCategoryId,
  Sample,
  ImageZipUpload,
  loader,
  loaderExcel,
  setStoreCategory,
}) {
  const { IMG_URL, ErrorNotify } = useContext(Context);

  const [showModel, setShowModel] = useState(0);

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

  // Delete module
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [recordToDeleteName, setRecordToDeleteName] = useState(null);

  const showDeleteRecord = async (id, name) => {
    setShowDeleteModal(true);
    setRecordToDeleteId(id);
    setRecordToDeleteName(name);
  };

  const handleDeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(`/admin/products/${recordToDeleteId}`);
      if (response?.success) {
        getDataAll();
      }

      ErrorNotify(recordToDeleteName);

      setRecordToDeleteId(null);
      setRecordToDeleteName(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDeleteId(null);
    setRecordToDeleteName(null);
  };

  const ChangeStatus = async (id) => {
    const response = await editStatusData(`/admin/products/${id}`);
    setChangeStatus(response);
  };

  const ChangeStatusAll = async (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }
    const response = await putData(`/admin/products/multi-status-change`, {
      selectedItems,
    });
    setChangeStatus(response);
  };

  const ChangeTop = async (id) => {
    const response = await editStatusData(`/admin/products/top-status/${id}`);
    setChangeStatus(response);
  };

  const ChangeTranding = async (id) => {
    const response = await editStatusData(
      `/admin/products/tranding-status/${id}`,
    );
    setChangeStatus(response);
  };

  const ChangeBarcode = async (id) => {
    const response = await editStatusData(
      `/admin/products/barcode-status/${id}`,
    );
    setChangeStatus(response);
  };

  const ChangeCustomerView = async (id) => {
    const response = await editStatusData(
      `/admin/products/customer-status/${id}`,
    );
    setChangeStatus(response);
  };

  const ChangeVTOEnable = async (id) => {
    const response = await editStatusData(
      `/admin/products/vto-enable/${id}`,
    );
    setChangeStatus(response);
  };

  const [sortBy, setSortBy] = useState("orders"); // "orders" or "price"
  const [sortOrder, setSortOrder] = useState("asc");
  const sortedData = [...(data?.data?.data || [])].sort((a, b) => {
    const totalA = a?.Product_Order_Details?.reduce(
      (sum, detail) => sum + parseFloat(detail?.total_amount || 0),
      0,
    );

    const totalB = b?.Product_Order_Details?.reduce(
      (sum, detail) => sum + parseFloat(detail?.total_amount || 0),
      0,
    );

    if (sortBy === "price") {
      return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
    } else {
      // fallback: sort by order count
      const countA = a?.Product_Order_Details?.length || 0;
      const countB = b?.Product_Order_Details?.length || 0;
      return sortOrder === "asc" ? countA - countB : countB - countA;
    }
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const handleSelectOne = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    setShowButton(!showButton);
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = sortedData.map((item) => item.id);
      setSelectedItems(allIds);
      setShowButton(!showButton);
    } else {
      setSelectedItems([]);
    }
  };
  console.log(selectedItems, "selectedItems selectedItems");

  return (
    <section className="pending-table_holder">
      {/* Quick Filters Section */}
      <div className="quick-filters">
        <span className="quick-filters__label">
          <b>Quick Filters:</b>
        </span>
      </div>

      <div className="row align-items-start">
        <div className="col-12 mb-2">
          <div className="row">
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
              <Form.Label>Select Category </Form.Label>
              <Select
                isSearchable
                options={categories}
                value={searchCategory}
                placeholder="Select Category"
                onChange={(e) => {
                  setSearchCategory(e);
                  getAllSubCategories(e.value);
                  setChildCategories("");
                  setSubCategories("");
                  setSearchSubCategory("");
                  setSearchChildCategory("");
                }}
                classNamePrefix="searchProduct"
              />
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <div className="num me-2">
                <label className="form-label">Start Date</label>

                <input
                  type="date"
                  className="form-control"
                  placeholder="From"
                  value={searchDateFrom}
                  max="2050-12-31"
                  onChange={(e) => {
                    const selectedDate = e.target.value;

                    if (new Date(selectedDate).getFullYear() > 2050) {
                      return;
                    }

                    setSearchDateFrom(selectedDate);
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
                  value={searchDateTo}
                  max="2050-12-31"
                  min={searchDateFrom}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (new Date(selectedDate).getFullYear() > 2050) {
                      return;
                    }

                    setSearchDateTo(selectedDate);
                    setonPageChange(1);
                  }}
                />
              </div>
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Sort According </Form.Label>
              <Select
                options={[
                  { label: "Order Count", value: "orders" },
                  { label: "Total Price", value: "price" },
                ]}
                value={{
                  label: sortBy === "orders" ? "Order Count" : "Total Price",
                  value: sortBy,
                }}
                onChange={(e) => setSortBy(e.value)}
                placeholder="Sort By"
              />
            </div>

            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
              <Form.Label>Order </Form.Label>
              <Select
                options={[
                  { label: "Ascending", value: "asc" },
                  { label: "Descending", value: "desc" },
                ]}
                value={{
                  label: sortOrder === "asc" ? "Ascending" : "Descending",
                  value: sortOrder,
                }}
                onChange={(e) => setSortOrder(e.value)}
                placeholder="Sort Order"
              />
            </div>

            <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <label className="form-label">Search</label>
              <div className="Search">
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
              <label className="form-label">Reset</label>
              <div className="Search-1">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchDateFrom("");
                    setSearchDateTo("");
                    setSearchCategory("");
                    setSearchChildCategory("");
                    setSearchSubCategory("");
                    setReset(!reset);
                  }}
                  className="btn btn-reset"
                >
                  Reset
                </button>
              </div>
            </div>
            {/* {showButton && ( */}
            <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <label className="form-label">Customer View Status</label>
              <div className="Search-1">
                <button
                  type="button"
                  onClick={() => {
                    ChangeStatusAll(selectedItems);
                  }}
                  className="btn btn-reset"
                >
                  Customer View On
                </button>
              </div>
            </div>
            {/* )} */}

            {/* <div className=" col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <div>
                <button
                  className="btn btn-success "
                  type="button"
                  onClick={HandleDownload}
                >
                  Net sell Excel
                  <FontAwesomeIcon
                    icon="fa-solid fa-file-lines"
                    className="ms-2"
                  />
                </button>
              </div>
            </div> */}

            {/* <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
              <div>
                <button
                  className="btn btn-success "
                  type="button"
                  onClick={HandleDownloadProductOrder}
                >
                  Product Order Excel
                  <FontAwesomeIcon
                    icon="fa-solid fa-file-lines"
                    className="ms-2"
                  />
                </button>
              </div>
            </div> */}
            <hr className="mt-3" />
            <div className="quick-filters">
              <span className="quick-filters__label">
                <b>Bulk Upload:</b>
              </span>
            </div>

            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
              <label className="form-label">Select Category</label>
              <div>
                <Select
                  isSearchable
                  options={categories}
                  value={bulkCategoryId}
                  placeholder="Select Category"
                  onChange={(e) => {
                    setBulkCategoryId(e);
                  }}
                  classNamePrefix="searchProduct"
                />
              </div>
            </div>

            {bulkCategoryId && (
              <>
                <div className=" col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                  <label className="form-label">Sample Excel</label>
                  <div>
                    <button
                      className="btn btn-search btn btn-primary "
                      type="button"
                      onClick={Sample}
                    >
                      Download Sample
                      <FontAwesomeIcon
                        icon="fa-solid fa-file-lines"
                        className="ms-2"
                      />
                    </button>
                  </div>
                </div>

                {loader ? (
                  <>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                      <label className="form-label">Upload Bulk Excel</label>
                      <div>
                        <ClipLoader />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                    <label className="form-label">Upload Bulk Excel</label>
                    <div>
                      <label
                        htmlFor="bulk-file"
                        className="btn btn-search btn btn-primary"
                      >
                        Upload
                        <FontAwesomeIcon
                          icon="fa-solid fa-file-lines"
                          className="ms-2"
                        />
                      </label>
                      <input
                        type="file"
                        id="bulk-file"
                        name="bulk-file"
                        accept=".xls,.xlsx"
                        onChange={(e) => {
                          BulkUpload(e);
                        }}
                        hidden
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {loaderExcel ? (
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2">
                <label className="form-label">Upload Bulk Excel</label>
                <div>
                  <ClipLoader />
                </div>
              </div>
            ) : (
              <div className="col-xxl-1 col-xl-2 col-lg-3 col-md-2 col-sm-6 col-12 mb-2">
                <label className="form-label">Upload Bulk Image Folder</label>
                <div>
                  <label
                    htmlFor="image-file"
                    className="btn btn-search btn btn-primary"
                  >
                    Upload
                    <FontAwesomeIcon
                      icon="fa-solid fa-file-lines"
                      className="ms-2"
                    />
                  </label>

                  <input
                    type="file"
                    id="image-file"
                    name="image-file"
                    accept=".zip"
                    onChange={(e) => ImageZipUpload(e)}
                    hidden
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="pending-table ">
        <Table striped bordered hover className="order-table" responsive>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedItems.length === sortedData.length &&
                    sortedData.length > 0
                  }
                />
              </th>
              <th>Creation Date</th>
              <th>Product details</th>
              {/* <th>Store details</th> */}
              <th>Image</th>
              <th>Categories</th>
              {/* <th>Total Order</th> */}
              {/* <th>Sort Order</th> */}
              <th>GST</th>

              {/* {user && user?.role_id === RoleId.Vendor && */}
              <th>Status</th>
              {/* } */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectOne(item.id)}
                  />
                </td>
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
                  <div className="order-id text-highlight  details_text">
                    {item?.item_code}
                  </div>
                  <div className="order-info">
                    <span className="text-highlight product_details_text">
                      {item?.name}
                    </span>
                  </div>
                  {/* <div className="order-info">
                    <span>{item?.price} / {item?.Unit?.name}</span>
                  </div> */}
                  <div className="order-info">
                    <div className="order-id">Brand</div>
                    <span>{item?.Brand?.name}</span>
                  </div>
                  {/* <div className="order-info">
                    <div className="order-id">Manufacturer</div>
                    <span>{item?.manufacturer} </span>
                  </div> */}
                </td>

                <td>
                  <img
                    src={IMG_URL + item?.image}
                    alt="Product"
                    className="product-image"
                  />
                </td>

                <td className="order-details">
                  {/* <div className="order-info">
                    <span className="text-highlight">{item?.Store_Detail?.store_name}</span>
                  </div> */}
                  <div className="order-info">
                    <span>{item?.p_category?.name}</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.p_sub_category?.name} </span>
                  </div>
                  <div className="order-info">
                    <span>{item?.p_child_category?.name} </span>
                  </div>
                  {/* <div className="order-info">
                    <div className="order-id">Manufacturer:</div>
                    <span>{item?.manufacturer} </span>
                  </div> */}
                </td>

                {/* <td>
                  <div className="order-details_info">
                    <div className="order-info">
                      <span>
                        {" "}
                        <b>No. Of order </b>{" "}
                        {item?.Product_Order_Details?.length}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="order-details_info">
                    <div className="order-info">
                      <span>
                        <b> Total Price: ₹</b>
                        {item?.Product_Order_Details?.reduce((sum, detail) => {
                          return sum + parseFloat(detail?.total_amount || 0);
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </td> */}
                {/* <td>{item?.sort_order}</td> */}

                <td>
                  <div className="order-info">
                    {/* <span>{item?.description} </span> */}
                    {item?.tax_percentage && (
                      <>
                        <div className="order-details_info">
                          <div className="order-info">
                            <div className="order-id">
                              {/* <b>Tax</b> <span>{item?.tax_percentage} % </span> */}
                              <span>{item?.tax_percentage} % </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>

                {/* <td>
                  {item?.Often_Ordered_Withs?.map((item) => (
                    <div key={item?.id} className="order-info">
                      <span className="text-highlight"> {item?.linked_product?.name}</span>
                    </div>
                  ))}

                  
                  <Button
                    className="action-btn my-1"
                    onClick={() =>
                      setShowModel(item?.id)
                    }
                    style={{ marginTop: "auto" }}
                  >
                    Edit
                  </Button>
                

                </td> */}

                {/* {user && user?.role_id === RoleId.Vendor && */}
                {/* <td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={item?.status}
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
                    </div> */}

                    {/* 
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={item?.is_replaceble}
                        onChange={() => {
                          ChangeTopPick(item?.id);
                        }}
                        id={`flexSwitchCheckDefault${item?.id}`}
                      />

                      <label
                      className="form-check-label"
                      htmlFor={`flexSwitchCheckDefault${item?.id}`}
                    >
                      Add on ?
                    </label>
                    </div> */}

                    {/* <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={item?.top_status}
                        onChange={() => {
                          ChangeTop(item?.id);
                        }}
                        id={`flexSwitchCheckDefaultTop${item?.id}`}
                      />

                      <label
                        className="form-check-label"
                        htmlFor={`flexSwitchCheckDefaultTop${item?.id}`}
                      >
                        Top Product ?
                      </label>
                    </div>

                    {item?.p_category_id === Category.Eyeglasses && (
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.tranding_status}
                          onChange={() => {
                            ChangeTranding(item?.id);
                          }}
                          id={`flexSwitchCheckDefaultTrading${item?.id}`}
                        />

                        <label
                          className="form-check-label"
                          htmlFor={`flexSwitchCheckDefaultTrading${item?.id}`}
                        >
                          Eyeglasses Status ?
                        </label>
                      </div>
                    )}

                    {(item?.p_category_id === Category.Eyeglasses ||
                      item?.p_category_id === Category.Sunglasses ||
                      item?.p_category_id === Category.Accessories) && (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={item?.barcode_status}
                            onChange={() => {
                              ChangeBarcode(item?.id);
                            }}
                            id={`flexSwitchCheckDefaultBarcode${item?.id}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexSwitchCheckDefaultBarcode${item?.id}`}
                          >
                            Is Barcode ?
                          </label>
                        </div>
                      )}

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={item?.customer_view}
                        onChange={() => {
                          ChangeCustomerView(item?.id);
                        }}
                        id={`flexSwitchCheckDefaultView${item?.id}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexSwitchCheckDefaultView${item?.id}`}
                      >
                        Customer View
                      </label>
                    </div> */}
                    {/* //Amol */}
                    {/* <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={item?.vto_enable}
                        onChange={() => {
                          ChangeVTOEnable(item?.id);
                        }}
                        id={`flexSwitchCheckDefaultView${item?.id}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexSwitchCheckDefaultView${item?.id}`}
                      >
                        VTO
                      </label>
                    </div>

                  </td>
                </td> */}


                <td className="p-1 align-middle">
                  {/* Main Bootstrap row container with a small gutter gap (g-2) */}
                  <div className="row g-1" style={{ minWidth: "280px" }}>

                    {/* --- ROW 1 --- */}
                    {/* Column 1: Status */}
                    <div className="col-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.status}
                          onChange={() => ChangeStatus(item?.id)}
                          id={`switch-status-${item?.id}`}
                        />
                        <label className="form-check-label" htmlFor={`switch-status-${item?.id}`}>
                          {item?.status ? "Active" : "Inactive"}
                        </label>
                      </div>
                    </div>

                    {/* Column 2: Top Product */}
                    <div className="col-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.top_status}
                          onChange={() => ChangeTop(item?.id)}
                          id={`switch-top-${item?.id}`}
                        />
                        <label className="form-check-label" htmlFor={`switch-top-${item?.id}`}>
                          Top Product?
                        </label>
                      </div>
                    </div>

                    {/* --- ROW 2 (Conditional) --- */}
                    {/* Column 1: Eyeglasses Status */}
                    <div className="col-6">
                      {item?.p_category_id === Category.Eyeglasses && (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={item?.tranding_status}
                            onChange={() => ChangeTranding(item?.id)}
                            id={`switch-trending-${item?.id}`}
                          />
                          <label className="form-check-label" htmlFor={`switch-trending-${item?.id}`}>
                            Eyeglasses Status?
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Is Barcode */}
                    <div className="col-6">
                      {(item?.p_category_id === Category.Eyeglasses ||
                        item?.p_category_id === Category.Sunglasses ||
                        item?.p_category_id === Category.Accessories) && (
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={item?.barcode_status}
                              onChange={() => ChangeBarcode(item?.id)}
                              id={`switch-barcode-${item?.id}`}
                            />
                            <label className="form-check-label" htmlFor={`switch-barcode-${item?.id}`}>
                              Is Barcode?
                            </label>
                          </div>
                        )}
                    </div>

                    {/* --- ROW 3 --- */}
                    {/* Column 1: Customer View */}
                    <div className="col-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.customer_view}
                          onChange={() => ChangeCustomerView(item?.id)}
                          id={`switch-view-${item?.id}`}
                        />
                        <label className="form-check-label" htmlFor={`switch-view-${item?.id}`}>
                          Customer View
                        </label>
                      </div>
                    </div>

                    {/* Column 2: VTO */}
                    {/* <div className="col-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.vto_enable}
                          onChange={() => ChangeVTOEnable(item?.id)}
                          id={`switch-vto-${item?.id}`} // Fixed duplicate ID
                        />
                        <label className="form-check-label" htmlFor={`switch-vto-${item?.id}`}>
                          VTO
                        </label>
                      </div>
                    </div> */}

                  </div>
                </td>
                {/* } */}

                <td>
                  {/* {user && user?.role_id === RoleId.Admin &&
                    <select
                      className={item?.approval_status_id === ApprovalStatus.Approved ? "status-holder shipped" : "status-holder Unshipped"}
                      onChange={(e) => ChangeStoreStatus(item?.id, e.target.value)}
                      value={item?.Approval_Status?.id}
                    >
                      <option value={ApprovalStatus.Pending}>Inactive</option>
                      <option value={ApprovalStatus.Approved}>Approved</option>
                      <option value={ApprovalStatus.Rejected}>Rejected</option>
                    </select>
                  } */}

                  {/* {user && user?.role_id === RoleId.Vendor && */}
                  <div className="my-1">
                    <Link to={`/product/edit/${item?.id}`}>
                      <Button className="action-btn active">Edit</Button>
                    </Link>

                    <div className="my-1">
                      <Button
                        className="action-btn "
                        onClick={() => showDeleteRecord(item?.id, item?.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {/* } */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <LinkProductsModel
        user={user}
        show={showModel}
        handleClose={() => {
          setShowModel(0);
          getDataAll();
        }}
      />
      <ModalDelete
        show={showDeleteModal}
        handleDeleteRecord={handleDeleteRecord}
        handleDeleteCancel={handleDeleteCancel}
      />
    </section>
  );
}

export default My_Table;
