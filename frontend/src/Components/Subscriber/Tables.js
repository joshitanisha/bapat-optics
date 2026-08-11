import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../Tabels/Tabels.css";
import plus from "../../Components/assets/icons/a1.png";
import colunms from "../../Components/assets/icons/LINES.png";
import search1 from "../../Components/assets/icons/search.png";
import top from "../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { Context } from "../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";

import ModalDelete from "../common/ModelDelete";
import ModelBulkUpload from "../common/ModelBulkUpload";
import { AddButton, EditButton, DeletButton } from "../common/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Modal, Button } from "react-bootstrap";
import OffcanvasCon from "../OffcanvasCon/OffcanvasCon";
import DataTable from "datatables.net";
import { formatDateTime, formatDateToIST, IDS } from "../../utils/common";
import Pagination_Holder from "../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import Select from "react-select";
import parse from "html-react-parser";
import { formatDate } from "../../utils/common";
import {  useLoader } from "../../utils/common";
// import { Modal, Button } from "react-bootstrap";

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
  const [changeStatus, setChangeStatus] = useState();
  const [option, setOption] = useState();
  const [showoff, setShowoff] = useState(false);
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/masters/subscriber?page=${onPageChange || 1}&per_page=${
        perPage || 5
      }&term=${encodeURIComponent(search)}&from=${searchDate || ""}&to=${
        searchDateTo || ""
      }`
    ));
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
    const response = await editStatusData(`/admin/masters/subscriber/${id}`);
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
        `/admin/masters/subscriber/${recordToDeleteId}`
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

  const handleViewAddress = (addresses) => {
    setSelectedAddresses(addresses);
    setShowAddressModal(true);
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
    col10: true,
    col11: true,
    col12: true,
    col13: true,
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

  const [sortBy, setSortBy] = useState("orders"); // "orders" or "price"
  const [sortOrder, setSortOrder] = useState("asc");
  const sortedData = [...(data?.data?.data || [])].sort((a, b) => {
    const totalA = a?.customer_orders?.reduce(
      (sum, detail) => sum + parseFloat(detail?.total_amount || 0),
      0
    );

    const totalB = b?.customer_orders?.reduce(
      (sum, detail) => sum + parseFloat(detail?.total_amount || 0),
      0
    );

    if (sortBy === "price") {
      return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
    } else {
      // fallback: sort by order count
      const countA = a?.customer_orders?.length || 0;
      const countB = b?.customer_orders?.length || 0;
      return sortOrder === "asc" ? countA - countB : countB - countA;
    }
  });

  const openPdfInNewTab = (data) => {
    window.open(IMG_URL + data, "_blank");
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Subscriber Form"} link={"/subscriber-form"} />
        <section className="AdvanceDashboard">
          <div className="col-lg-12 p-0">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    {/* <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="add me-3">
                          {isAllow.includes(IDS.Brand.Add) ? (
                            <Link
                              // to="/admin/masters/subscriber/add"
                              type="button"
                              className="btn btn-add pe-3"
                            >
                              <div onClick={() => handleShow()}>
                                <img
                                  src={plus}
                                  className="plus me-2 ms-0"
                                  alt=""
                                />
                                Add Brand
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                        </div> 
                    </div>*/}

                    <div className="row">
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
                          <div className="col-12 mb-2">
                            <div className="row align-items-start">
                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                <div className="num">
                                  <label className="form-label">Email</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id=""
                                    value={search}
                                    placeholder="Search Email"
                                    onChange={(e) => {
                                      setSearch(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                                <div className="Search">
                                  <label className="form-label">Search</label>
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
                                  <label className="form-label">Reset</label>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearch("");
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
                              <th className="tax-name" style={{ width: "20%" }}>
                                Email{" "}
                              </th>
                            )}
                            {visible.col2 && (
                              <th className="tax-name" style={{ width: "20%" }}>
                                Date{" "}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedData?.map((d, index) => {
                            const paginatedIndex =
                              (onPageChange - 1) * perPage + index + 1;
                            return (
                              <tr className="" key={index}>
                                {visible.col1 && <td>{paginatedIndex}.</td>}
                                {visible.col2 && <td>{d?.email}</td>}
                                {visible.col3 && (
                                  <td>
                                    {d?.createdAt
                                      ? formatDateTime(d.createdAt)
                                      : "—"}
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

      {/* {show ? (
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
      )} */}

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

      {/* <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        size="lg"
        centered
        className="userdeatailspp"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Address Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAddresses.length > 0 ? (
            selectedAddresses.map((address, index) => (
              <div key={index} className="mb-3 border p-2 rounded">
                <h5 className="mb-3">Address {index + 1}</h5>
                <div className="row">
                  <div className="col-lg-6">
                    <p>
                      <strong>Building:</strong> {address.building}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Floor:</strong> {address.floor}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Apartment:</strong> {address.apartment}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Street:</strong> {address.street}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Direction:</strong> {address.direction}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Contact No. :</strong> {address.contact_no}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Latitude:</strong> {address.lat}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Longitude:</strong> {address.long}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Country:</strong>{" "}
                      {address.Users_Address_Detail?.Country?.name}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>State:</strong>{" "}
                      {address.Users_Address_Detail?.State?.name}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>City:</strong>{" "}
                      {address.Users_Address_Detail?.City?.name}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Pincode:</strong>{" "}
                      {address.Users_Address_Detail?.Pincode?.name}
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      <strong>Area:</strong>{" "}
                      {address.Users_Address_Detail?.Area?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No address details available.</p>
          )}
        </Modal.Body>
      </Modal> */}
    </>
  );
};

export default Tables;
