import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../Tabels/Tabels.css";
import plus from "../../Components/assets/icons/a1.png";
import colunms from "../../Components/assets/icons/LINES.png";
import eye from "../../Components/assets/icons/eye.png";
import pen from "../../Components/assets/icons/pen.png";
import basket from "../../Components/assets/icons/basket.png";
import search1 from "../../Components/assets/icons/search.png";
import top from "../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import circle from "../assets/icons/circle.png";
import rigth from "../assets/icons/rigth.png";
import save from "../assets/icons/save.png";
import cancel from "../assets/icons/cross.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Offcanvas from "react-bootstrap/Offcanvas";

import toast, { Toaster } from "react-hot-toast";
import Card from "react-bootstrap/Card";
import Select from "react-select";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Context } from "../../utils/context";
import ViewOffCanvance from "./ViewOffCanvance";

library.add(fas);

// ********************************************************************************************************************************************************

const Tables = () => {
  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    isAllow,
    Per_Page_Dropdown,
    IMG_URL,
    postData,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(0);
  const [show1, setShowEdit] = useState(0);
  const [option, setOption] = useState();
  const [searchStore, setSearchStore] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [shortCommission, setShortCommission] = useState("");

  const [changeStatus, setChangeStatus] = useState();

  const getDataAll = async () => {
    const response = await getData(
      `/employee/seller?page=${currentPage}&per_page=${perPage}&term=${search}` +
        `&searchStore=${searchStore}&searchEmail=${searchEmail}&shortCommission=${
          shortCommission?.value || null
        }`
    );

    await setData(response);
    setCurrentPage(response?.data?.currentPage);
    setperPage(response?.data?.per_page);
    // setSearch(response?.data?.search_name);
    setOption(await Per_Page_Dropdown(response?.data?.totalEntries));
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
    searchStore,
    searchEmail,
    shortCommission,
  ]);

  const ChangeStatus = async (id) => {
    const response = await editStatusData(`/employee/seller/${id}`);
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
  const handleClose = () => setShowAdd(0);
  const handleShow = (id) => {
    setShowAdd(id);
  };

  const handleClose1 = () => setShowEdit(0);
  const handleShow1 = (id) => {
    setShowEdit(id);
  };

  const DeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(`/employee/seller/${recordToDeleteId}`);
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
    col8: true,
    col9: true,
    col10: true,
  });

  //toggle columnns.........
  const toggleColumn = (event, columnName) => {
    event.preventDefault();
    setVisibel((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const [view, setview] = useState(0);
  const handleViewClose = () => setview(false);
  const handleViewshow = async (id) => {
    await setview(id);
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header
          title={"Seller's Details"}
          link={"/employee/employee_details"}
        />
        <section className="AdvanceDashboard">
          <div className="col-xxl-12 col-xl-12 p-0 ">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    <div className="d-flex">
                      {/* <div className="add me-3">
                        {isAllow.includes(6) ? (
                          <Link
                            // to="/employee/employee_details/add"
                            type="button"
                            className="btn btn-add pe-3"
                          >
                            <div onClick={() => handleShow()}>
                              <img src={plus} className="plus me-2 ms-0" alt="" />
                              Add Employee
                            </div>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div> */}

                      {/* <div className="add">
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
                                Role
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
                                onClick={(event) => toggleColumn(event, "col3")}
                                href="#"
                              >
                                First Name
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
                            </li>

                            <li>
                              <Link
                                className="dropdown-item"
                                onClick={(event) => toggleColumn(event, "col4")}
                                href="#"
                              >
                                Store Name{" "}
                                {visible?.col4 ? (
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
                                onClick={(event) => toggleColumn(event, "col5")}
                                href="#"
                              >
                                Employee Number
                                {visible?.col5 ? (
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
                                onClick={(event) => toggleColumn(event, "col6")}
                                href="#"
                              >
                                Email
                                {visible?.col5 ? (
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
                                onClick={(event) => toggleColumn(event, "col7")}
                                href="#"
                              >
                                Status
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
                            <li>
                              <Link
                                className="dropdown-item"
                                onClick={(event) => toggleColumn(event, "col8")}
                                href="#"
                              >
                                Action
                                {visible?.col8 ? (
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
                      </div> */}
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
                              data?.data?.totalEntries
                            )} of ${data?.data?.totalEntries} entries`}</p>
                          </div>
                        </div>
                      </div>
                      <div className=" col-12">
                        <div className="row align-items-start">
                          {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num" >
                            <label className="form-label"></label>
                              <Select
                                options={[
                                  { value: "ASC", label: "Low To High" },
                                  { value: "DESC", label: "High To Low" },
                                ]}
                                value={shortCommission}
                                placeholder="Commission"
                                onChange={(e) => {
                                  setShortCommission(e);
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
                                placeholder="Store Name"
                                id=""
                                value={searchStore}
                                onChange={(e) => {
                                  setSearchStore(e.target.value);
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
                                placeholder="Email"
                                id=""
                                value={searchEmail}
                                onChange={(e) => {
                                  setSearchEmail(e.target.value);
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
                                placeholder="Name"
                                id=""
                                value={search}
                                onChange={(e) => {
                                  setSearch(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          {/* <div className="Search">
                            <Button
                              type="button"
                              onClick={getDataAll}
                              className="btn btn-search"
                            >
                              <img src={search1} className="search" alt="" />
                            </Button>
                          </div> */}

                          <div className="Search-1">
                            <label className="form-label"></label>
                            <button
                              type="button"
                              onClick={() => {
                                setSearch("");
                                setSearchStore("");
                                setSearchEmail("");
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
                  <div className="border-line mt-3"></div>
                  <div className="row mt-3">
                    <div className="data table-responsive">
                      <Table striped bordered hover responsive center>
                        <thead>
                          <tr className="">
                            {visible.col1 && <th className="sr">Sr. No.</th>}
                            {visible.col2 && (
                              <th
                                className="tax-name"
                                style={{ width: "300px" }}
                              >
                                Role
                              </th>
                            )}
                            {visible.col3 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Name
                              </th>
                            )}
                            {visible.col4 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Store Name
                              </th>
                            )}
                            {/* {visible.col10 && (
                              <th className="tax-name" style={{ width: "900px" }}>logo</th>
                            )} */}
                            {visible.col5 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Employee Mobile
                              </th>
                            )}
                            {visible.col6 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Employee Email
                              </th>
                            )}
                            {visible.col9 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Commission %
                              </th>
                            )}
                            {/* {visible.col6 && (
                            <th className="tax-name">Password</th>
                          )} */}
                            {visible.col7 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Status
                              </th>
                            )}
                            {visible.col8 && (
                              <th
                                className="tax-name"
                                style={{ width: "900px" }}
                              >
                                Action
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {/* {isAllow.includes(5) ? ( */}
                          {data?.data?.data?.map((d, index) => {
                            return (
                              <tr className="" key={index}>
                                {visible.col1 && <td>{++index}.</td>}
                                {visible.col2 && (
                                  <td>{d?.user_role?.role?.name}</td>
                                )}
                                {visible.col3 && <td>{d?.first_name}</td>}
                                {visible.col4 && (
                                  <td>{d?.store_detail?.store_name}</td>
                                )}
                                {/* {visible.col10 && <td>

                                  <img
                                    src={IMG_URL + d?.seller_detail?.logo}
                                    alt="Image"
                                width="50"
                                          height="50"
                                  />

                                </td>} */}
                                {visible.col5 && <td>{d?.contact_no}</td>}
                                {visible.col6 && <td>{d?.email}</td>}
                                {visible.col9 && (
                                  <td>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span>{d?.commission}%</span>
                                      <Button
                                        onClick={() => handleShow1(d?.id)}
                                        type="button"
                                        className="btn btn-primary"
                                      >
                                        <img src={pen} className="pen" alt="" />
                                      </Button>
                                    </div>
                                  </td>
                                )}

                                {/* {visible.col6 && <td>{d?.password}</td>} */}
                                {/* {visible.col6 && <td>******</td>} */}
                                {visible.col7 && (
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
                                )}
                                {visible.col8 && (
                                  <td>
                                    {d?.id === 1 ? (
                                      <></>
                                    ) : (
                                      <div className="d-flex">
                                        {/* {isAllow.includes(8) ? ( */}
                                        {/* <button
                                          onClick={() => {
                                            showDeleteRecord(
                                              d?.id,
                                              d?.first_name
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
                                        </button> */}

                                        {/* ) : (
                                        <></>
                                      )} */}

                                        {/* <Link to={`/product/${d?.id}`}> Products</Link> */}

                                        <Link
                                          to={`/product/${d?.id}`}
                                          className="me-5"
                                        >
                                          {" "}
                                          {/* Add margin to the right */}
                                          <FontAwesomeIcon
                                            icon={faEye}
                                            className="me-2"
                                          />{" "}
                                          View Products
                                        </Link>

                                        <div className="add me-3">
                                          {" "}
                                          <Link
                                            type="button"
                                            className="btn btn-add pe-3"
                                          >
                                            <div
                                              onClick={() =>
                                                handleViewshow(d.id)
                                              }
                                            >
                                              view
                                            </div>
                                          </Link>
                                        </div>

                                        {/* Edit Button */}
                                        {/* <Button
                                          onClick={() => handleShow(d?.id)}
                                          type="button"
                                          className="btn btn-primary" // Add margin to the right
                                        >
                                          <img src={eye} className="pen" alt="" />
                                        </Button> */}
                                      </div>
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
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

      <Toaster position="top-right" />

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
      {view ? (
        <ViewOffCanvance
          handleClose={handleViewClose}
          setShow={setview}
          show={view}
          id={view}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Tables;
