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
import EditCommission from "./EditCommission";
import ModalDelete from "../../common/ModelDelete";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import { AddButton, EditButton, DeletButton } from "../../common/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import DataTable from "datatables.net";
import parse from "html-react-parser";
import { IDS, RoleId, Select2Data } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import Select from "react-select";
import pen from "../../../Components/assets/icons/pen.png";
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
    IMG_URL,
    isAllow,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  const [email, setemail] = useState("");
  const [contact_no, setcontact_no] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [showCommission, setShowEditCommission] = useState(0);
  const [changeStatus, setChangeStatus] = useState();
  const [option, setOption] = useState();
  const [showoff, setShowoff] = useState(false);
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  const [role_id, setRoleId] = useState("");

  const [doctorCommission, setDoctorCommission] = useState(0);
  const getDataAll = async () => {
    const response = await getData(
      `/admin/employee-management/users?page=${onPageChange || 1}&per_page=${
        perPage || 5
      }&term=${encodeURIComponent(search)}&email=${email || ""}&contact_no=${
        contact_no || ""
      }&from=${searchDate || ""}&to=${searchDateTo || ""}&role_id=${
        role_id?.value || ""
      }`
    );
    await setData(response);
    setCurrentPage(response?.data?.current_page);
    setperPage(response?.data?.per_page);
    setSearch(response?.data?.search_name);
    settotalPages(response?.data?.total_pages);
    setOption(await Per_Page_Dropdown(response?.data?.total));

    const newData = response?.data?.data;
    if (newData) {
      const newIds = newData.map((d) => d?.id);
      setAllChecked(newIds);
    }
  };

  useEffect(() => {
    getDataAll();
  }, [changeStatus, perPage, reset, show, show1, showCommission, onPageChange]);

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
      `/admin/employee-management/users/${id}`
    );
    setChangeStatus(response);
  };

  // Modal function
  const handleClose = () => setShowAdd(false);
  const handleShow = () => setShowAdd(true);

  const handleClose1 = () => setShowEdit(0);
  const handleShow1 = (id) => {
    setShowEdit(id);
  };

  const handleCloseCommission = () => setShowEditCommission(0);
  const handleShowCommission = (id, commission) => {
    setShowEditCommission(id);
    setDoctorCommission(commission);
  };

  // Select All Functionality
  const [selectAllChecked, setSelectAllChecked] = useState([]);
  const [allChecked, setAllChecked] = useState([]);

  const handleSelectAll = async () => {
    await setSelectAllChecked(allChecked);
  };

  const handleChange = async (e) => {
    const { value, checked } = e.target;

    if (value === "selectAll") {
      if (checked) {
        handleSelectAll();
      } else {
        await setSelectAllChecked([]);
      }
    } else {
      if (checked) {
        await setSelectAllChecked([...selectAllChecked, Number(value)]);
      } else {
        await setSelectAllChecked(
          selectAllChecked.filter((e) => e !== Number(value))
        );
      }
    }
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
      const response = await deleteData(
        `/admin/employee-management/users/${recordToDeleteId}`
      );
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
    col7: true,
    col8: true,
    col9: true,
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

  const [roles, setRoles] = useState([]);
  const GetAllRoles = async () => {
    const response = await getData("/common/masters/all-roles");
    if (response?.success) {
      setRoles(await Select2Data(response?.data, "role_id"));
    }
  };

  useEffect(() => {
    GetAllRoles();
  }, []);

  useEffect(() => {
    const table = new DataTable("#example");
    return () => {
      table.destroy();
    };
  }, []);

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
          `/admin/employee-management/download?&term=${encodeURIComponent(search)}&email=${
            email || ""
          }&contact_no=${contact_no || ""}&from=${searchDate || ""}&to=${
            searchDateTo || ""
          }&role_id=${role_id?.value || ""}`,
          null,
          "Customers List"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleOpenModal = (id) => {
    setSelectedRow(id);
    // setInputValue(row.createdAt); // Or any other field you want to edit
    setModalOpen(true);
  };
  console.log(modalOpen, "modalOpen");

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Users"} link={"/admin/employee-management/users"} />
        <section className="AdvanceDashboard">
          <div className="col-lg-12 p-0">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div className="add me-3">
                        {isAllow.includes(IDS.User.Add) ? (
                          <Link
                            // to="/admin/employee-management/users/add"
                            type="button"
                            className="btn btn-add pe-3"
                          >
                            <div onClick={() => handleShow()}>
                              <img
                                src={plus}
                                className="plus me-2 ms-0"
                                alt=""
                              />
                              Add User
                            </div>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 ">
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
                              className="columns me-2"
                              alt=""
                            />
                            Column Selection
                            <img src={top} className="top ms-1" alt="" />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                onClick={(event) => toggleColumn(event, "col1")}
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
                                onClick={(event) => toggleColumn(event, "col2")}
                                href="#"
                              >
                                Role
                                {visible?.col2 ? (
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
                                onClick={(event) => toggleColumn(event, "col3")}
                                href="#"
                              >
                                Name
                                {visible?.col3 ? (
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
                                onClick={(event) => toggleColumn(event, "col4")}
                                href="#"
                              >
                                Email
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
                                onClick={(event) => toggleColumn(event, "col5")}
                                href="#"
                              >
                                Contact
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
                            <li>
                              <Link
                                className="dropdown-item"
                                onClick={(event) => toggleColumn(event, "col6")}
                                href="#"
                              >
                                Status
                                {visible?.col6 ? (
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
                                onClick={(event) => toggleColumn(event, "col7")}
                                href="#"
                              >
                                Action
                                {visible?.col7 ? (
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
                      <div className="   col-12">
                        <div className="row align-items-start">
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <label className="form-label">Role</label>
                              <Select
                                options={roles}
                                value={role_id}
                                onChange={(e) => setRoleId(e)}
                              />
                            </div>
                          </div>
                          {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <label className="form-label">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                value={search}
                                placeholder="Search Employee"
                                onChange={(e) => {
                                  setSearch(e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="num">
                              <label className="form-label">Email</label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                value={email}
                                placeholder="Search Email"
                                onChange={(e) => {
                                  setemail(e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="num">
                              <label className="form-label">
                                Contact Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                value={contact_no}
                                placeholder="Search Contact Number"
                                onChange={(e) => {
                                  setcontact_no(e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-3">
                            <div className="num me-2">
                              <label className="form-label">Start Date</label>
                              <input
                                type="date"
                                className="form-control"
                                placeholder="From"
                                value={searchDate}
                                onChange={(e) => {
                                  setSearchDate(e.target.value);
                                  setonPageChange(1);
                                }}
                              />
                            </div>
                          </div> */}

                          {/* <div className="col-md-3">
                            <div className="num me-2">
                              <label className="form-label">End Date</label>
                              <input
                                type="date"
                                className="form-control"
                                placeholder="To"
                                value={searchDateTo}
                                onChange={(e) => {
                                  setSearchDateTo(e.target.value);
                                  setonPageChange(1);
                                }}
                              />
                            </div>
                          </div> */}
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
                                <img src={search1} className="search" alt="" />
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
                                  setemail("");
                                  setcontact_no("");
                                  setSearchDate("");
                                  setSearchDateTo("");
                                  setRoleId("");
                                  setReset(!reset);
                                }}
                                className="btn btn-reset"
                              >
                                Reset
                              </button>
                            </div>
                          </div>

                          <div className=" col-xl-2 col-lg-4 col-md-6 col-12 mb-2">
                           
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
                            {visible.col1 && <th className="sr">Sr. No.</th>}
                            {visible.col2 && (
                              <th className="tax-name">Role </th>
                            )}
                            {visible.col3 && <th className="tax-name">Name</th>}
                            {visible.col4 && (
                              <th className="tax-name">Email</th>
                            )}
                            {visible.col5 && (
                              <th className="tax-name">Contact</th>
                            )}
                            {visible.col8 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Created On{" "}
                              </th>
                            )}
                            {visible.col9 && (
                              <th className="tax-name">Commission</th>
                            )}
                            {visible.col6 && (
                              <th className="tax-name">Status</th>
                            )}
                            {visible.col7 && <th className="active">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data?.data?.map((d, index) => {
                            const paginatedIndex =
                              (onPageChange - 1) * perPage + index + 1;
                            return (
                              <tr className="" key={index}>
                                {visible.col1 && <td>{paginatedIndex}.</td>}
                                {visible.col2 && <td>{d?.Role?.name}</td>}
                                {visible.col3 && <td className="width_dertails_name_div">{d?.name}</td>}
                                {visible.col4 && <td> {d?.email}</td>}
                                {visible.col5 && <td> {d?.contact_no}</td>}
                                {visible.col8 && (
                                  <td>
                                    <div>{calculateTimeAgo(d?.createdAt)}</div>
                                    <div>{formatTimeInIST(d?.createdAt)}</div>
                                  </td>
                                )}
                                {visible.col9 && (
                                  <td>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span>
                                        {d?.Doctor_Detail?.commission}%
                                      </span>
                                      {d?.role_id === RoleId.Doctor && (
                                        <Button
                                          onClick={() =>
                                            handleShowCommission(
                                              d?.id,
                                              d?.Doctor_Detail?.commission
                                            )
                                          }
                                          type="button"
                                          className="btn btn-primary"
                                        >
                                          <img
                                            src={pen}
                                            className="pen"
                                            alt=""
                                          />
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                )}

                                {visible.col6 && (
                                  <td>
                                    {d?.role_id !== RoleId.Admin ? (
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          checked={d.status}
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
                                    ) : null}
                                  </td>
                                )}

                                {visible.col7 && (
                                  <td>
                                    {/* {d?.id === 1 ? (
                                        <></>
                                      ) : ( */}
                                    <div className="d-flex">
                                      {isAllow.includes(IDS.User.Edit) ? (
                                        <EditButton
                                          handleShow1={handleShow1}
                                          id={d?.id}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                      {isAllow.includes(IDS.User.Delete) ? (
                                        <DeletButton
                                          showDeleteRecord={showDeleteRecord}
                                          id={d?.id}
                                          name={d?.name}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    {/* )} */}
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

      {showCommission ? (
        <EditCommission
          doctorCommission={doctorCommission}
          handleClose={handleCloseCommission}
          setShow={handleShowCommission}
          show={showCommission}
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
