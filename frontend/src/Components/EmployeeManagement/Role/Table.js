import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import plus from "../../../Components/assets/icons/a1.png";
import colunms from "../../../Components/assets/icons/LINES.png";
import pen from "../../../Components/assets/icons/pen.png";
import basket from "../../../Components/assets/icons/basket.png";
import search1 from "../../../Components/assets/icons/search.png";
import top from "../../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import circle from "../../assets/icons/circle.png";
import rigth from "../../assets/icons/rigth.png";
import save from "../../assets/icons/save.png";
import cancel from "../../assets/icons/cross.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header/Header";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import Offcanvas from "react-bootstrap/Offcanvas";

import toast, { Toaster } from "react-hot-toast";
import Card from "react-bootstrap/Card";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Context } from "../../../utils/context";

import { IDS, RoleId } from "../../../utils/common";

import "../../Masters/datatable.css";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";

library.add(fas);

const Tables = () => {
  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    isAllow,
    Per_Page_Dropdown,
    RequiredIs,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [option, setOption] = useState();
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);

  const [changeStatus, setChangeStatus] = useState();

  const getDataAll = async () => {
    const response = await getData(
      `/admin/employee-management/role?page=${onPageChange}&per_page=${perPage}&term=${encodeURIComponent(search)}`
    );
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
    const response = await editStatusData(
      `/admin/employee-management/role/${id}`
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
        `/admin/employee-management/role/${recordToDeleteId}`
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
  });

  //toggle columnns.........
  const toggleColumn = (event, columnName) => {
    event.preventDefault();
    setVisibel((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"User Roles"} link={"/admin/employee-management/role"} />
        <section className="AdvanceDashboard">
          <div className="col-xxl-12 col-xl-12 p-0 ">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  <div className="row ">
                    <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div className="add me-3">
                        {isAllow.includes(IDS.Role.Add) ? (
                          <Link type="button" className="btn btn-add pe-3">
                            <div onClick={() => handleShow()}>
                              <img
                                src={plus}
                                className="plus me-2 ms-0"
                                alt=""
                              />
                              Add Role
                            </div>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mt-lg-0 mt-md-2 mt-2">
                      <div className="add">
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
                            Column Selection{" "}
                            <img src={top} className="top ms-1" alt="" />{" "}
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
                                Role Name
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
                                Status
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
                                Action
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
                              onChange={(e) => setperPage(e.target.value)}
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
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <label className="form-label"></label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                placeholder="Search Role"
                                value={search}
                                onChange={(e) => {
                                  setSearch(e.target.value);
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
                            {visible.col1 && <th className="sr">Sr. No.</th>}
                            {visible.col2 && (
                              <th className="tax-name">Role Name</th>
                            )}
                            {/* {visible.col3 && <th className="tax-name">Status</th>} */}
                            {visible.col4 && <th className="active">Action</th>}
                          </tr>
                        </thead>

                        <tbody>
                          {/* {isAllow.includes(1) ? ( */}
                          {data?.data?.data?.map((d, index) => {
                            const paginatedIndex =
                              (onPageChange - 1) * perPage + index + 1;
                            return (
                              <tr className="" key={index}>
                                {visible.col1 && <td>{paginatedIndex}</td>}
                                {visible.col2 && <td className="width_dertails_name_div">{d?.name}</td>}
                                {/* {visible.col3 && (
                                  <td>
                                    {d?.id === 1 ? (
                                      <></>
                                    ) : (
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
                                    )}
                                  </td>
                                )} */}

                                {visible.col4 && (
                                  <td>
                                    <div className="d-flex">
                                      {RequiredIs?.roles?.includes(d?.id) ? (
                                        <></>
                                      ) : (
                                        <>
                                          {isAllow.includes(IDS.Role.Edit) ? (
                                            <Button
                                              // to={`/admin/employee-management/role/edit/${d?.id}`}
                                              onClick={() => handleShow1(d?.id)}
                                              type="button"
                                              className="btn btn-primary me-1"
                                            >
                                              <img
                                                src={pen}
                                                className="pen"
                                                alt=""
                                              />
                                            </Button>
                                          ) : (
                                            <></>
                                          )}
                                         
                                          {d?.id > 6 && isAllow.includes(IDS.Role.Delete) ? (
                                            <button
                                              onClick={() => {
                                                showDeleteRecord(
                                                  d?.id,
                                                  d?.name
                                                );
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

                                          {/* {![
                                            RoleId.Admin,
                                            RoleId.Customer,
                                            RoleId.DeliveryBoy,
                                            RoleId.Employee,
                                            RoleId.Vendor,
                                          ].includes(d?.id) &&
                                          isAllow.includes(IDS.Role.Delete) ? (
                                            <button
                                              onClick={() => {
                                                showDeleteRecord(
                                                  d?.id,
                                                  d?.name
                                                );
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
                                          )} */}
                                        </>
                                      )}
                                    </div>
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
                  <button
                    className="btn btn-yes me-2"
                    onClick={handleDeleteRecord}
                  >
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
      <Toaster position="top-right" />
    </>
  );
};

export default Tables;
