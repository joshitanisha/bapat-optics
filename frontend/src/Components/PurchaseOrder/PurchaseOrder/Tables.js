import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import plus from "../../../Components/assets/icons/a1.png";
import colunms from "../../../Components/assets/icons/LINES.png";
import pen from "../../../Components/assets/icons/pen.png";
import swap from "../../../Components/assets/icons/swap.png";
import basket from "../../../Components/assets/icons/basket.png";
import search1 from "../../../Components/assets/icons/search.png";
import top from "../../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Header from "../../Header/Header";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightLeft, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
// *******************toster****************************
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import EditOffCanvanceReceiving from "./EditReceiving";
import ModalDelete from "../../common/ModelDelete";
import { AddButton, EditButton, DeletButton } from "../../common/Button";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import { formatDateTime, IDS, ItemType } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const Tables = () => {
  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    Per_Page_Dropdown,
    postData,
    getDownloadDataExcel,
    isAllow,
    Select2Data,
    IMG_URL,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [show2, setShowEditReceiving] = useState(0);
  const [option, setOption] = useState();
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);

  const [changeStatus, setChangeStatus] = useState();
  const [searchCategory, setSearchCategory] = useState("");

  const [searchDate, setSearchDate] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    try {
     
      const response = await withLoader(() => getData(
        `/admin/purchase-order/purchase-product?page=${onPageChange}&per_page=${perPage}&term=${
          search || ""
        }&p_category_id=${searchCategory?.value || ""}&item_type_id=${
          ItemType.Product
        }&from=${searchDate || ""}&to=${searchDateTo || ""}`
      ));
      await setData(response);
      setCurrentPage(response?.data?.current_page);
      setperPage(response?.data?.per_page);
      setSearch(response?.data?.search_name);
      settotalPages(response?.data?.total_pages);
      setOption(await Per_Page_Dropdown(response?.data?.total));
    } catch (error) {
      console.error("getDataAll error:", error);
    } 
  };
  useEffect(() => {
    getDataAll();
  }, [
    changeStatus,
    perPage,
    reset,
    show,
    show1,
    search,
    searchCategory,
    onPageChange,
    show2,
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

  const ChangeStatus = async (id) => {
    const response = await editStatusData(
      `/admin/purchase-order/purchase-product/${id}`
    );
    setChangeStatus(response);
  };

  // Delete module.....................................................
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [recordToDeleteName, setRecordToDeleteName] = useState(null);

  const showDeleteRecord = async (id, name) => {
    setShowDeleteModal(true);
    setRecordToDeleteId(id);
    setRecordToDeleteName(name);
  };

  // Modal function
  const handleClose = () => setShowAdd(false);
  const handleShow = () => setShowAdd(true);

  const handleClose1 = () => setShowEdit(0);
  const handleShow1 = (id) => {
    setShowEdit(id);
  };
  const handleClose2 = () => setShowEditReceiving(0);
  const handleShow2 = (id) => {
    setShowEditReceiving(id);
  };

  const DeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(
        `/admin/purchase-order/purchase-product/${recordToDeleteId}`
      );
      await ErrorNotify(recordToDeleteName);
      setChangeStatus(response);
      setRecordToDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDeleteId(null);
  };

  //toggle/
  const [visible, setVisibel] = useState({
    col0: true,
    col1: true,
    col2: true,
    col3: true,
    col4: true,
    col5: true,
    col6: true,
    col7: true,
  });

  //toggle columnns.........
  const toggleColumn = (event, columnName) => {
    event.preventDefault();
    setVisibel((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [showoff, setShowoff] = useState(false);

  const BulkUpload = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const response = await postData(
        "/admin/purchase-order/purchase-product/bulk",
        formData,
        {}
      );
      if (response?.success) {
        setShowModal({ code: response.code, message: response.message });
      } else {
        setShowModal({ code: response.code, message: response.message });
      }
      setTimeout(() => {
        setShowModal(0);
        setShowoff(response?.data);
      }, 1000);
      getDataAll();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const Sample = async (e) => {
    try {
      await getDownloadDataExcel(
        "/admin/purchase-order/purchase-product/sample",
        {},
        "state"
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [categories, setCategories] = useState([]);
  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
  }, []);

  return (
    <>
      <div className="main-advancedashboard">
        <Header
          title={"Purchase Order"}
          link={"/admin/masters/purchase-order/purchase-product"}
        />
        <div className="row me-0 ms-0">
          <div className="row MainRowsec me-0 ms-0">
            <section className="AdvanceDashboard">
              <div className="col-xxl-12 col-xl-12 p-0 ">
                <section className="Tabels tab-radio tab-radio">
                  <div className="">
                    {/* container */}
                    <div className="row">
                      <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="add me-3">
                          {isAllow.includes(IDS.Purchase_Order.Add) ? (
                            <Link
                              // to="/admin/masters/purchase-order/purchase-product/add"
                              type="button"
                              className="btn btn-add pe-3"
                            >
                              <div onClick={() => handleShow()}>
                                <p className="add-sub-txttt">
                                  {" "}
                                  <img
                                    src={plus}
                                    className="plus me-2 ms-0"
                                    alt=""
                                  />{" "}
                                  Add Purchase Order
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      {/* <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12">
                        <div className="add me-3">
                          <div className="dropdown">
                            <button
                              className="btn btn-columns dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <img
                                src={colunms}
                                className="columns me-2 "
                                alt=""
                              />
                              Column Selection
                              <img src={top} className="top ms-1" alt="" />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link
                                  className="dropdown-item"
                                  onClick={(event) =>
                                    toggleColumn(event, "col1")
                                  }
                                  href="#"
                                >
                                  Sr. No.
                                  {visible?.col1 ? (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye-slash"
                                    />
                                  )}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  onClick={(event) =>
                                    toggleColumn(event, "col2")
                                  }
                                  href="#"
                                >
                                  Category
                                  {visible?.col2 ? (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye-slash"
                                    />
                                  )}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  onClick={(event) =>
                                    toggleColumn(event, "col3")
                                  }
                                  href="#"
                                >
                                  Sub Category
                                  {visible?.col3 ? (
                                    <FontAwesomeIcon
                                      className="ms-2"
                                      icon="fa-solid fa-eye"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="ms-2"
                                      icon="fa-solid fa-eye-slash"
                                    />
                                  )}
                                </Link>
                              </li>{" "}
                              <li>
                                <Link
                                  className="dropdown-item"
                                  onClick={(event) =>
                                    toggleColumn(event, "col6")
                                  }
                                  href="#"
                                >
                                  Sub Category Image
                                  {visible?.col6 ? (
                                    <FontAwesomeIcon
                                      className="ms-2"
                                      icon="fa-solid fa-eye"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="ms-2"
                                      icon="fa-solid fa-eye-slash"
                                    />
                                  )}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  onClick={(event) =>
                                    toggleColumn(event, "col4")
                                  }
                                  href="#"
                                >
                                  Status
                                  {visible?.col4 ? (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye-slash"
                                    />
                                  )}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  onClick={(event) =>
                                    toggleColumn(event, "col5")
                                  }
                                  href="#"
                                >
                                  Action
                                  {visible?.col5 ? (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="ms-4"
                                      icon="fa-solid fa-eye-slash"
                                    />
                                  )}
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div> */}

                      {/* {isAllow?.includes(207) ? (
                          <div className="add me-3">
                            <button
                              className="btn btn-add pe-3"
                              onClick={() =>
                                document.getElementById("StateFile").click()
                              }
                            >
                              Bulk Upload
                            </button>
                            <input
                              type="file"
                              id="StateFile"
                              onChange={(e) => {
                                BulkUpload(e);
                              }}
                              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              style={{ display: "none" }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                        {isAllow?.includes(207) ? (
                          <div className="add me-3">
                            <Link type="button" className="btn btn-add pe-3">
                              <div onClick={Sample}>Sample</div>
                            </Link>
                          </div>
                        ) : (
                          <></>
                        )} */}

                      <div className="border-line mt-3"></div>
                      <div className="row mt-3">
                        <div className=" col-12">
                          <div className="d-flex align-items-center mb-1">
                            <div className="show me-2">
                              <p className="show m-0">Show</p>
                            </div>
                            <div className="number me-2">
                              <select
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                onChange={(e) => {
                                  setonPageChange(1);
                                  setperPage(e.target.value);
                                }}
                              >
                                {option?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="entries">
                              <p className="show m-0">entries</p>
                            </div>

                            <div className="sowing ms-3 me-2">
                              <p className="show m-0">{`Showing ${Math.min(
                                (currentPage - 1) * perPage + 1
                              )} to ${Math.min(
                                currentPage * perPage,
                                data?.data?.total
                              )} of ${data?.data?.total} entries`}</p>
                            </div>
                          </div>
                        </div>
                        <div className=" col-12">
                          <div className="row align-items-start">
                            {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <div className="num">
                              <label className="form-label"></label>
                                <Select
                                  isSearchable
                                  options={categories}
                                  value={searchCategory}
                                  placeholder="Select Category"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setSearchCategory(e);
                                  }}
                                />
                              </div>
                            </div> */}
                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                              <div className="num">
                                <label className="form-label"></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id=""
                                  value={search}
                                  placeholder="Search Batch No."
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setSearch(e.target.value);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                              <div className="num me-2">
                                <label className="form-label">Start Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  placeholder="From"
                                  value={searchDate}
                                  max="2050-12-31"
                                  onChange={(e) => {
                                    const selectedDate = e.target.value;

                                    if (
                                      new Date(selectedDate).getFullYear() >
                                      2050
                                    ) {
                                      return;
                                    }

                                    setSearchDate(selectedDate);
                                    setonPageChange(1);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2 ">
                              <div className="num me-2">
                                <label className="form-label">End Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  placeholder="To"
                                  value={searchDateTo}
                                  max="2050-12-31"
                                  onChange={(e) => {
                                    const selectedDate = e.target.value;

                                    // Safety check for manual typing
                                    if (
                                      new Date(selectedDate).getFullYear() >
                                      2050
                                    ) {
                                      return;
                                    }
                                    setSearchDateTo(selectedDate);
                                    setonPageChange(1);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
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
                                  <img
                                    src={search1}
                                    className="search"
                                    alt=""
                                  />
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
                                    setSearchCategory("");
                                    setSearchDate("");
                                    setSearchDateTo("");
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
                    </div>
                    <div className="border-line mt-3"></div>
                
                    <div className="row mt-3">
                      <div className="data table-responsive">
                        <Table striped bordered hover responsive center>
                          <thead>
                            <tr>
                              {visible.col1 && <th className="sr">Sr. No.</th>}
                              {visible.col2 && (
                                <th className="tax-name">Batch No</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Product Name</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Product Quantity</th>
                              )}
                              {visible.col3 && (
                                <th className="tax-name">Total Quantity</th>
                              )}
                              {visible.col6 && (
                                <th className="tax-name">Date</th>
                              )}
                              {visible.col7 && (
                                <th className="tax-name">
                                  Purchase Order Status
                                </th>
                              )}
                              {visible.col4 && (
                                <th className="tax-name">Status</th>
                              )}
                              {visible.col5 && (
                                <th className="active">Action</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {data?.data?.data?.map((d, index) => {
                              const paginatedIndex =
                                (onPageChange - 1) * perPage + index + 1;
                              const poProducts =
                                d?.Purchase_Order_Products || [];

                              // Determine how many rows we’ll render per batch (equal to number of products)
                              return poProducts.map(
                                (productItem, productIndex) => {
                                  return (
                                    <tr key={`${d.id}-${productItem.id}`}>
                                      {/* Sr. No. */}
                                      {productIndex === 0 && visible.col1 && (
                                        <td rowSpan={poProducts.length}>
                                          {paginatedIndex}.
                                        </td>
                                      )}

                                      {/* Batch No. */}
                                      {productIndex === 0 && visible.col2 && (
                                        <td rowSpan={poProducts.length}>
                                          {d?.batch_no}
                                        </td>
                                      )}

                                      {/* Product Name */}
                                      {visible.col2 && (
                                        <td className="width_dertails_name_div">
                                          {productItem?.Product?.name || "-"}
                                        </td>
                                      )}

                                      {/* Variant Name (if you have variants array inside productItem or elsewhere) */}
                                      {visible.col2 && (
                                        <td>
                                          {/* Replace this with real variant data if available */}
                                          {productItem?.quantity || "N/A"}
                                        </td>
                                      )}

                                      {/* Total Quantity (only once per batch) */}
                                      {productIndex === 0 && visible.col3 && (
                                        <td rowSpan={poProducts.length}>
                                          {d?.total_quantity}
                                        </td>
                                      )}

                                      {/* Date */}
                                      {productIndex === 0 && visible.col6 && (
                                        <td
                                          rowSpan={poProducts.length}
                                          className="nowrap_text"
                                        >
                                          {formatDateTime(d?.createdAt)}
                                        </td>
                                      )}

                                      {/* Purchase Order Status */}
                                      {productIndex === 0 && visible.col7 && (
                                        <td
                                          rowSpan={poProducts.length}
                                          className="nowrap_text"
                                        >
                                          {d?.Purchase_Order_Status?.name}
                                        </td>
                                      )}
                                      {productIndex === 0 && visible.col4 && (
                                        <td rowSpan={poProducts.length}>
                                          {d.p_o_s_id === 1 ? (
                                            <div className="form-check form-switch">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                checked={d.status}
                                                disabled={
                                                  !isAllow?.includes(35)
                                                }
                                                onChange={() =>
                                                  ChangeStatus(d.id)
                                                }
                                                id={`flexSwitchCheckDefault${d?.id}`}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`flexSwitchCheckDefault${d?.id}`}
                                              >
                                                {d.status
                                                  ? "Active"
                                                  : "Inactive"}
                                              </label>
                                            </div>
                                          ) : (
                                            "-"
                                          )}
                                        </td>
                                      )}

                                      {/* Status */}
                                      {productIndex === 0 && visible.col5 && (
                                        <td rowSpan={poProducts.length}>
                                          {d.p_o_s_id === 1 ? (
                                            <div className="d-flex">
                                              {isAllow.includes(
                                                IDS.Receiving_Order.Add
                                              ) && (
                                                <Link
                                                  to={`/purchase-product/edit/${d?.id}`}
                                                >
                                                  <Button className="action-btn active">
                                                    <img
                                                      src={pen}
                                                      className="pen"
                                                      alt=""
                                                    />
                                                  </Button>
                                                </Link>
                                              )}
                                              {isAllow.includes(
                                                IDS.Purchase_Order.Delete
                                              ) && (
                                                <button
                                                  onClick={() =>
                                                    showDeleteRecord(
                                                      d?.id,
                                                      d?.batch_no
                                                    )
                                                  }
                                                  type="button"
                                                  className="btn btn-danger"
                                                >
                                                  <img
                                                    src={basket}
                                                    className="pen"
                                                    alt=""
                                                  />
                                                </button>
                                              )}
                                              {isAllow.includes(
                                                IDS.Purchase_Order.Edit
                                              ) && (
                                                <Link
                                                  to={`/purchase-product/compare/${d?.id}`}
                                                >
                                                  <Button className="action-btn active">
                                                    <FontAwesomeIcon
                                                      icon={faRightLeft}
                                                    />
                                                  </Button>
                                                </Link>
                                              )}
                                            </div>
                                          ) : (
                                            "-"
                                          )}
                                        </td>
                                      )}
                                    </tr>
                                  );
                                }
                              );
                            })}
                          </tbody>
                        </Table>

                        {/* <Table striped bordered hover responsive center>
                          <thead>
                            <tr className="">
                              {visible.col1 && <th className="sr">Sr. No.</th>}
                              {visible.col2 && (
                                <th className="tax-name">Batch No.</th>
                              )}

                                {visible.col2 && (
                                <th className="tax-name">product name</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">variant name</th>
                              )}
                              {visible.col3 && (
                                <th className="tax-name">Total Quantity</th>
                              )}{" "}
                            
                              {visible.col6 && (
                                <th className="tax-name">Date</th>
                              )}
                              {visible.col7 && (
                                <th className="tax-name">
                                  Purchase Order Status
                                </th>
                              )}
                              {visible.col4 && (
                                <th className="tax-name">Status</th>
                              )}
                              {visible.col5 && (
                                <th className="active">Action</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {data?.data?.data?.map((d, index) => {
                              const paginatedIndex =
                                (onPageChange - 1) * perPage + index + 1;
                              return (
                                <tr className="" key={index}>
                                  {visible.col1 && <td>{paginatedIndex}.</td>}
                                  {visible.col2 && <td>{d?.batch_no}</td>}
                                   {visible.col2 && <td>{d?.batch_no}</td>}

                                  {visible.col3 && <td>{d?.total_quantity}</td>}

                                  


                                  {visible.col6 && <td>{formatDateTime(d?.createdAt)}</td>}
                                  {visible.col7 && (
                                    <td>{d?.Purchase_Order_Status?.name}</td>
                                  )}
                                  {d.p_o_s_id === 1 && visible.col4 && (
                                    <td>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          checked={d.status}
                                          disabled={!isAllow?.includes(35)}
                                          onChange={() => {
                                            ChangeStatus(d.id);
                                          }}
                                          id={`flexSwitchCheckDefault${d?.id}`}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`flexSwitchCheckDefault${d?.id}`}
                                        >
                                          {d.status ? "Active" : "Inactive"}
                                        </label>
                                      </div>
                                    </td>
                                  )}
                                  {d.p_o_s_id === 1 && visible.col5 && (
                                    <td>
                                      <div className="d-flex">
                                        {isAllow.includes(
                                          IDS.Receiving_Order.Add
                                        ) ? (

                                          // <Button
                                          //   // to={`/admin/masters/purchase-order/purchase-product/edit/${d?.id}`}
                                          //   onClick={() => handleShow1(d?.id)}
                                          //   type="button"
                                          //   className="btn btn-primary me-1"
                                          // >
                                          //   <img
                                          //     src={pen}
                                          //     className="pen"
                                          //     alt=""
                                          //   />
                                          // </Button>

                                          <Link to={`/purchase-product/edit/${d?.id}`}>
                                            <Button className="action-btn active"><img src={pen} className="pen" alt="" /></Button>
                                          </Link>


                                        ) : (
                                          <></>
                                        )}

                                        {isAllow.includes(
                                          IDS.Purchase_Order.Delete
                                        ) ? (
                                          <button
                                            onClick={() => {
                                              showDeleteRecord(d?.id, d?.batch_no);
                                            }}
                                            type="button"
                                            className="btn btn-danger"
                                          >
                                            <img
                                              src={basket}
                                              className="pen"
                                              alt=""
                                            />
                                          </button>
                                        ) : (
                                          <></>
                                        )}

                                        {isAllow.includes(
                                          IDS.Purchase_Order.Edit
                                        ) ? (
                                          // <Button
                                          //   // to={`/admin/masters/purchase-order/purchase-product/edit/${d?.id}`}
                                          //   onClick={() => handleShow2(d?.id)}
                                          //   type="button"
                                          //   className="btn btn-swap me-1"
                                          // >
                                          //   <FontAwesomeIcon icon={faRightLeft} />
                                          // </Button>

                                          <Link to={`/purchase-product/compare/${d?.id}`}>
                                            <Button className="action-btn active"> <FontAwesomeIcon icon={faRightLeft} /></Button>
                                          </Link>


                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table> */}
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
                    </div>
                  
                  </div>
                </section>
              </div>
            </section>
          </div>
        </div>
      </div>

      {show ? (
        <AddOffCanvance
          handleClose={handleClose}
          setShow={setShowAdd}
          show={show}
        />
      ) : (
        ""
      )}

      {show1 ? (
        <EditOffCanvance
          handleClose={handleClose1}
          setShow={setShowEdit}
          show={show1}
        />
      ) : (
        ""
      )}

      {show2 ? (
        <EditOffCanvanceReceiving
          handleClose={handleClose2}
          setShow={setShowEditReceiving}
          show={show2}
        />
      ) : (
        ""
      )}

      <ModelBulkUpload
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />

      <Toaster position="top-right" />

      <OffcanvasCon show={showoff} handleClose={() => setShowoff(false)} />

      {/* <!-- Modal Delete --> */}
      <div className="upload-modal">
        <div
          className={`modal fade ${showDeleteModal ? "show" : ""}`}
          style={{ display: showDeleteModal ? "block" : "none" }}
          id="exampleModaldel"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h1 className="add-success text-center  mt-2">
                  Are you sure ?
                </h1>
                <p>
                  Do You Really Want to Delete These Record?
                  <br />
                  Dependent Data Also Be Deleted And
                  <br /> This Process CanNot Be Undone{" "}
                </p>
                <div className="button-holder text-center mt-2">
                  <button className="btn btn-yes me-2" onClick={DeleteRecord}>
                    Yes
                  </button>
                  <button className="btn btn-no" onClick={handleDeleteCancel}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tables;
