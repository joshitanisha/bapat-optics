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

import ModalDelete from "../../common/ModelDelete";
import { AddButton, EditButton, DeletButton } from "../../common/Button";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import {
  formatDate,
  formatDateTime,
  IDS,
  ItemType,
} from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import StockTrack from "./StockTrack";
import { useLoader } from "../../../utils/common";
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

  const [searchProduct, setSearchProduct] = useState("");
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
      const response = await withLoader(() =>
        getData(
          `/admin/purchase-order/supplier-return?page=${onPageChange}&per_page=${perPage}&term=${
            search || ""
          }&product_name=${searchProduct || ""}&from=${searchDate || ""}&to=${
            searchDateTo || ""
          }`
        )
      );
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
      `/admin/purchase-order/supplier-return/${id}`
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
        `/admin/purchase-order/supplier-return/${recordToDeleteId}`
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
        "/admin/purchase-order/supplier-return/bulk",
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
        "/admin/purchase-order/supplier-return/sample",
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

  const handleStatusChange = async (value, id) => {
    const data = {
      replace_status_id: value,
    };
    const response = await postData(
      `/admin/purchase-order/supplier-return/replace-status/${id}`,
      data
    );
    setChangeStatus(response);
  };

  const [showDetails, setShowDetails] = useState({ show: 0, data: {} });

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
          `/admin/purchase-order/supplier-return/download?per_page=${perPage}&p_category_id=${
            searchCategory?.value || ""
          }&item_type_id=${ItemType.Product}&from=${searchDate || ""}&to=${
            searchDateTo || ""
          }&term=${search || ""}`,
          null,
          "Supplier Return Download"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <>
      <div className="main-advancedashboard">
        <Header
          title={"Supplier Return"}
          link={"/admin/masters/purchase-order/supplier-return"}
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
                              // to="/admin/masters/purchase-order/supplier-return/add"
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
                                  Add Supplier Return
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

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
                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <div className="num">
                                <label className="form-label"></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id=""
                                  value={search}
                                  placeholder="Search Supplier Name"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setSearch(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <div className="num">
                                <label className="form-label"></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id=""
                                  value={searchProduct}
                                  placeholder="Search Product Name"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setSearchProduct(e.target.value);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
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
                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <div className="num me-2">
                                <label className="form-label">End Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  placeholder="To"
                                  value={searchDateTo}
                                  max="2050-12-31"
                                  min={searchDate || undefined}
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
                                <Form.Label>Search</Form.Label>
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
                                <Form.Label>Reset</Form.Label>
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

                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <label className="form-label"></label>
                              <div>
                                <button
                                  className="btn btn-success "
                                  type="button"
                                  onClick={HandleDownload}
                                >
                                  Supplier Return Download
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
                    </div>
                    <div className="border-line mt-3"></div>

                    <div className="row mt-3">
                      <div className="data table-responsive">
                        <Table striped bordered hover responsive center>
                          <thead>
                            <tr>
                              {visible.col1 && <th className="sr">Sr. No.</th>}
                              {visible.col2 && (
                                <th className="tax-name">Model no</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Barcode No.</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">BO Code</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Product Name</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Supplier Name</th>
                              )}
                              {visible.col3 && (
                                <th className="tax-name">Description</th>
                              )}
                              {visible.col6 && (
                                <th className="tax-name">Date</th>
                              )}
                              {visible.col7 && (
                                <th className="tax-name">Replace Status</th>
                              )}

                              {visible.col7 && (
                                <th className="tax-name">Stock Track</th>
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
                                  {visible.col2 && (
                                    <td>{d?.Stock?.model || "-"}</td>
                                  )}
                                  {visible.col2 && (
                                    <td>{d?.Stock?.barcode_no || "-"}</td>
                                  )}
                                   {visible.col2 && (
                                    <td>{d?.Product?.bo_code || "-"}</td>
                                  )}
                                  {visible.col3 && (
                                    <td className="width_dertails_name_div">
                                      {d?.Product?.name}
                                    </td>
                                  )}
                                  {visible.col4 && <td>{d?.Supplier?.name}</td>}
                                  {visible.col4 && <td>{d?.description}</td>}
                                  {visible.col5 && (
                                    <td>{formatDate(d?.createdAt)}</td>
                                  )}
                                  {visible.col6 && (
                                    <td>
                                      {d?.Replace_status?.name}
                                      {d.replace_status_id === 1 && (
                                        <select
                                          value={d?.status || ""}
                                          onChange={(e) =>
                                            handleStatusChange(
                                              e.target.value,
                                              d.id
                                            )
                                          }
                                          className="form-select"
                                        >
                                          <option value={2}>Replaced</option>
                                          <option value={3}>
                                            Not Replaced
                                          </option>
                                           <option value={4}>
                                            CN Issued
                                          </option>
                                        </select>
                                      )}
                                    </td>
                                  )}

                                  {visible.col4 && (
                                    <td>
                                      {" "}
                                      <Button
                                        className="action-btn active"
                                        onClick={() =>
                                          setShowDetails({
                                            show: d?.id,
                                            data: d?.Stock,
                                          })
                                        }
                                      >
                                        Stock Track
                                      </Button>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
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

      <StockTrack
        getDataAll={getDataAll}
        handleClose={() => {
          setShowDetails({ show: 0, data: {} });
        }}
        setShowDetails={setShowDetails}
        setShow={() => setShowDetails({ show: 0, data: {} })}
        show={showDetails?.show}
        data={showDetails?.data}
      />

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
