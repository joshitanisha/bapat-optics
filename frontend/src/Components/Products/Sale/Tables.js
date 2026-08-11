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
import { IDS } from "../../../utils/common";

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
    htmlToReactParser,
    isAllow,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [changeStatus, setChangeStatus] = useState();
  const [option, setOption] = useState();
  const [showoff, setShowoff] = useState(false);
  const getDataAll = async () => {
    const response = await getData(
      `/product/sale?page=${currentPage}&per_page=${perPage}&term=${encodeURIComponent(search)`
    );
    await setData(response);
    setCurrentPage(response?.data?.currentPage);
    setperPage(response?.data?.per_page);
    setSearch(response?.data?.search_name);

    setOption(await Per_Page_Dropdown(response?.data?.totalEntries));

    const newData = response?.data?.data;
    if (newData) {
      const newIds = newData.map((d) => d?.id);
      setAllChecked(newIds);
    }
  };

  useEffect(() => {
    getDataAll();
  }, [changeStatus, perPage, reset, show, show1]);

  const ChangeStatus = async (id) => {
    const response = await editStatusData(`/product/sale/${id}`);
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
      const response = await deleteData(`/product/sale/${recordToDeleteId}`);
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

  // const BulkUpload = async (e) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", e.target.files[0]);
  //     const response = await postData(
  //       "/product/sale/bulk",
  //       formData,
  //       {}
  //     );
  //     if (response?.success) {
  //       setShowModal({ code: response.code, message: response.message });
  //     } else {
  //       setShowModal({ code: response.code, message: response.message });
  //     }
  //     setTimeout(() => {
  //       setShowModal(0);
  //       setShowoff(response?.data);
  //     }, 1000);
  //     getDataAll();
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  // const Sample = async (e) => {
  //   try {
  //     await getDownloadDataExcel(
  //       "/product/sale/sample",
  //       {},
  //       "S_Industry Category"
  //     );
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  // const Export = async () => {
  //   try {
  //     await getDownloadDataExcel(
  //       "/product/sale/exports",
  //       { ids: selectAllChecked },
  //       "Industry Category"
  //     );
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Sale"} link={"/product/sale"} />
        <section className="AdvanceDashboard">
          <div className="row">
            <div className="col-lg-12 p-3">
              <section className="Tabels tab-radio tab-radio ">
                <div className="">
                  {/* container */}
                  <div className="row">
                    <div className="d-flex">
                      {isAllow.includes(IDS.Sale.Add) ? (
                        <div className="add me-3">
                          {data?.data?.data?.length >= 1 ? (
                            <div>{/* Your content here */}</div>
                          ) : (
                            <Link
                              // to="/product/sale/add"
                              type="button"
                              className="btn btn-add pe-3"
                            >
                              <div onClick={() => handleShow()}>
                                <img
                                  src={plus}
                                  className="plus me-2 ms-0"
                                  alt=""
                                />
                                Add Sale
                              </div>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}

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
                                onClick={(event) => toggleColumn(event, "col2")}
                                href="#"
                              >
                                Discount Percentage
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
                                onClick={(event) => toggleColumn(event, "col6")}
                                href="#"
                              >
                                Start Date
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
                                onClick={(event) => toggleColumn(event, "col7")}
                                href="#"
                              >
                                End Date
                                {visible?.col7 ? (
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
                      {/* 
                      <div className="add me-3">

                        <button
                          className="btn btn-add pe-3"
                          onClick={() =>
                            document
                              .getElementById("Industry CategoryFile")
                              .click()
                          }
                        >
                          Bulk Upload
                        </button>


                        <input
                          type="file"
                          id="Industry CategoryFile"
                          onChange={(e) => {
                            BulkUpload(e);
                          }}
                          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          style={{ display: "none" }}
                        />
                      </div> */}

                      {/* <div className="add me-3">

                        <Link type="button" className="btn btn-add pe-3">
                          <div onClick={Sample}>Sample</div>
                        </Link>

                      </div> */}
                      {/* 
                      <button
                        className="btn btn-columns ms-2"
                        type="button"
                        onClick={() => {
                          if (selectAllChecked.length === 0) {
                            alert("Please Select At Least One Record");
                          } else {
                            Export();
                          }
                        }}
                      >
                        Export
                      </button> */}
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
                      <div className="   col-12">
                        <div className="row align-items-start">
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                            <label className="form-label"></label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
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
                                onClick={getDataAll}
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
                            {" "}
                            {/* {visible.col0 && (
                              <th className="sr">
                                <input
                                  type="checkbox"
                                  value="selectAll"
                                  checked={
                                    allChecked.length ===
                                    selectAllChecked.length
                                  }
                                  onChange={handleChange}
                                  id="selectAll"
                                  className="me-1"
                                ></input>
                              </th>
                            )} */}
                            {visible.col1 && <th className="sr">Sr. No.</th>}
                            {visible.col3 && <th className="tax-name">Name</th>}
                            {visible.col2 && (
                              <th className="tax-name">Discount Percentage</th>
                            )}
                            {visible.col6 && (
                              <th className="active">Start Date</th>
                            )}
                            {visible.col7 && (
                              <th className="active">End Date</th>
                            )}
                            {visible.col4 && <th className="active">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data?.data?.map((d, index) => {
                            return (
                              <tr className="" key={index}>
                                {" "}
                                {/* {visible.col0 && (
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      value={d?.id}
                                      name="perselected"
                                      checked={selectAllChecked.includes(d?.id)}
                                      onChange={handleChange}
                                      id="flexCheckDefault"
                                    ></input>
                                  </td>
                                )} */}
                                {visible.col1 && <td>{++index}</td>}
                                {visible.col3 && <td className="width_dertails_name_div">{d?.name}</td>}
                                {visible.col2 && (
                                  <td> {d?.discount_percentage}</td>
                                )}
                                {visible.col6 && <td>{d?.start_date}</td>}
                                {visible.col7 && <td>{d?.end_date}</td>}
                                {/* {visible.col3 && (
                                    <td>
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
                                    </td>
                                  )} */}
                                {visible.col4 && (
                                  <td>
                                    <div className="d-flex">
                                      {/* <EditButton
                                        handleShow1={handleShow1}
                                        id={d?.id}
                                      /> */}
                                      {isAllow.includes(IDS.Sale.Delete) ? (
                                        <DeletButton
                                          showDeleteRecord={showDeleteRecord}
                                          id={d?.id}
                                          name={d?.name}
                                        />
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
