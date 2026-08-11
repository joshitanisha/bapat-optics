import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import plus from "../../../Components/assets/icons/a1.png";
import colunms from "../../../Components/assets/icons/LINES.png";
import search1 from "../../../Components/assets/icons/search.png";
import top from "../../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Header from "../../Header/Header";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import ModalDelete from "../../common/ModelDelete";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import { AddButton, EditButton, DeletButton } from "../../common/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import DataTable from "datatables.net";
import { formatDateToISTTime, IDS, RoleId } from "../../../utils/common";
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
    IMG_URL,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [showSubscribe, setShowSubscribe] = useState(0);
  const [changeStatus, setChangeStatus] = useState();
  const [option, setOption] = useState();
  const [showoff, setShowoff] = useState(false);
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);

  const today = new Date().toISOString().split("T")[0]; // Format today as YYYY-MM-DD
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    validateDates(e.target.value, endDate);
  };

  // Handle End Date change
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    validateDates(startDate, e.target.value);
  };

  // Validate Dates
  const validateDates = (start, end) => {
    let newErrors = {};
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    // Validate Start Date
    if (start && startDateObj > new Date(today)) {
      newErrors.startDate = "Start date must be today or in the past";
    }

    // Validate End Date
    if (end && endDateObj <= startDateObj) {
      newErrors.endDate = "End date must be greater than start date";
    }

    setErrors(newErrors);
  };
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/wallet?page=${onPageChange}&per_page=${perPage}&term=${search || ""
      }&startDate=${startDate}&endDate=${endDate}`
    ));
    await setData(response);
    setCurrentPage(response?.data?.current_page);
    setperPage(response?.data?.per_page);
    setSearch(response?.data?.search_name);
    settotalPages(response?.data?.total_pages);

    setOption(await Per_Page_Dropdown(response?.data?.total));
  };

  useEffect(() => {
    getDataAll();
  }, [changeStatus, perPage, reset, show, show1, onPageChange]);

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
    const response = await editStatusData(`/admin/wallet/${id}`);
    setChangeStatus(response);
  };

  // Modal function
  const handleClose = () => setShowAdd(false);
  const handleShow = () => setShowAdd(true);

  const handleClose1 = () => setShowEdit(0);
  const handleShow1 = (id) => {
    setShowEdit(id);
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
      const response = await deleteData(`/admin/wallet/${recordToDeleteId}`);
      // notify("error", "Deleted Succefully");

      ErrorNotify(recordToDeleteName);

      setRecordToDeleteId(null);
      setRecordToDeleteName(null);
      setChangeStatus(response);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDeleteId(null);
    setRecordToDeleteName(null);
  };

  //  column hide and show.....
  const [visible, setVisibel] = useState({
    col0: true,
    col1: true,
    col2: true,
    col3: true,
    col4: true,
    col5: true,
    col6: true,
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

  useEffect(() => {
    const table = new DataTable("#example");
    return () => {
      table.destroy();
    };
  }, []);

  const [user, setUser] = useState({});
  const GetUser = async () => {
    const response = await getData(`/common/auth/usersingleget`);
    if (response?.success) {
      setUser(response?.data);
    }
  };
  useEffect(() => {
    GetUser();
  }, []);

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"My Wallet"} link={"/admin/wallet"} />
        <section className="AdvanceDashboard">
          <div className="col-lg-12 p-0">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    {/* <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="border-line mt-3" />
                     

                      <div className="package-details-section-top-heading">
                        <div className="pending-table ">
                          <div className="d-flex  align-items-center">
                           

                            <div className="text-center  ms-5">
                              <Button onClick={() => setShowEdit(1)}>
                                + Add Money
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}


                    <div className="row ">
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
                        {/* </div>
                        <div className="   col-12"> */}
                        <div className="row align-items-start">
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <Form.Label>Search Customer Name</Form.Label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                value={search}
                                placeholder="Search Customer Name"
                                onChange={(e) => {
                                  setSearch(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <Form.Label>From</Form.Label>

                              <Form.Control
                                type="date"
                                placeholder="Start Date"
                                max="2050-12-31"
                                value={startDate}
                                onChange={(e) => {
                                  const selectedDate = e.target.value;


                                  if (new Date(selectedDate).getFullYear() > 2050) {
                                    return;
                                  }

                                  handleStartDateChange(e);
                                }}
                                isInvalid={!!errors.startDate}
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.startDate}
                              </Form.Control.Feedback>
                            </div>
                          </div>


                          {/* End Date */}
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <Form.Label>To</Form.Label>

                              <Form.Control
                                type="date"
                                placeholder="End Date"
                                min={startDate}
                                max="2050-12-31"
                                value={endDate}
                                onChange={(e) => {
                                  const selectedDate = e.target.value;


                                  if (new Date(selectedDate).getFullYear() > 2050) {
                                    return;
                                  }

                                  handleEndDateChange(e);
                                }}
                                isInvalid={!!errors.endDate}
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors.endDate}
                              </Form.Control.Feedback>
                            </div>
                          </div>


                          <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                            <Form.Label></Form.Label>
                            <div className="Search">
                              <Button
                                type="button"
                                onClick={() => {
                                  setonPageChange(1);
                                  getDataAll();
                                }}
                                className="btn btn-search"
                              >
                                <img src={search1} className="search" alt="" />
                              </Button>
                            </div>
                          </div>
                          <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                            <div className="Search-1">
                              <Form.Label></Form.Label>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearch("");
                                  setStartDate("");
                                  setEndDate("");
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
                          <tr className="">
                            {visible.col1 && (
                              <th className="sr" style={{ width: "10%" }}>
                                Sr. No.
                              </th>
                            )}
                            {visible.col2 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Date & Time{" "}
                              </th>
                            )}
                            {visible.col3 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Customer Name
                              </th>
                            )}
                            {visible.col3 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Amount
                              </th>
                            )}
                            {visible.col4 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Type
                              </th>
                            )}
                            {visible.col5 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Transaction ID{" "}
                              </th>
                            )}
                            {visible.col6 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Description
                              </th>
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
                                  <td>
                                    {formatDateToISTTime(d?.createdAt)}
                                  </td>
                                )}{" "}
                                {visible.col3 && (
                                  <td>{d?.Wallet?.User?.name}</td>
                                )}
                                {visible.col3 && (
                                  <td>{Number(d?.amount).toFixed(2)}</td>
                                )}
                                {visible.col4 && (
                                  <td
                                    style={{
                                      color:
                                        d?.Transaction_Type?.id === 2
                                          ? "red"
                                          : "green",
                                    }}
                                  >
                                    {d?.Transaction_Type?.name}
                                  </td>
                                )}
                                {visible.col5 && (
                                  <td>{d?.transaction_id || "_"}</td>
                                )}
                                {visible.col6 && <td>{d?.description}</td>}
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
          </div>
        </section>
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

      <ModalDelete
        show={showDeleteModal}
        handleDeleteRecord={handleDeleteRecord}
        handleDeleteCancel={handleDeleteCancel}
      />

      <ModelBulkUpload
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
      <Toaster position="top-right" />

      <OffcanvasCon show={showoff} handleClose={() => setShowoff(false)} />
    </>
  );
};

export default Tables;
