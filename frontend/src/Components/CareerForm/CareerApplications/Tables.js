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
import { faEye, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import ModalDelete from "../../common/ModelDelete";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import { AddButton, EditButton, DeletButton } from "../../common/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Modal, Button } from "react-bootstrap";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import DataTable from "datatables.net";
import { formatDateToIST, IDS } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import Select from "react-select";
import parse from 'html-react-parser';
import { formatDate } from "../../../utils/common";


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
  const [searchCompany, setsearchCompany] = useState("");
  const [searchShiftType, setSearchShiftType] = useState()
  const [searchJobType, setsearchJobType] = useState("");
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

  const getDataAll = async () => {
    const response = await getData(
      `/admin/career/career-applications?page=${onPageChange || 1}&per_page=${perPage || 5
      }&term=${encodeURIComponent(search)}&searchCompany=${searchCompany || ""}&searchJobType=${searchJobType || ""
      }&searchShiftType=${searchShiftType || ""
      }&from=${searchDate || ""}&to=${searchDateTo || ""}`
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
    const response = await editStatusData(`/admin/career/career-applications/${id}`);
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
      const response = await deleteData(`/admin/career/career-applications/${recordToDeleteId}`);
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

  const BulkUpload = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const response = await postData("/admin/career/career-applications/bulk", formData, {});
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
      await getDownloadDataExcel("/admin/career/career-applications/sample", {}, "Category");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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
          `/admin/career/career-applications?term=${search || ""}&searchCompany=${searchCompany || ""}&searchJobType=${searchJobType || ""
          }&from=${searchDate || ""}&to=${searchDateTo || ""}`,
          null,
          "Contact Form List"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
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
        <Header title={"Career Applications"} link={"/admin/career/career-applications"} />
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
                              // to="/admin/career/career-applications/add"
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
                          <div className="col-12 mb-2">
                            <div className="row align-items-start">
                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                <div className="num">
                                  <label className="form-label">Positions</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id=""
                                    value={search}
                                    placeholder="Search Position"
                                    onChange={(e) => {
                                      setSearch(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                <div className="num">
                                  <label className="form-label">Company Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id=""
                                    value={searchCompany}
                                    placeholder="Search comapany"
                                    onChange={(e) => {
                                      setsearchCompany(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                <div className="num">
                                  <label className="form-label">
                                    Job Type
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id=""
                                    value={searchJobType}

                                    onChange={(e) => {
                                      setsearchJobType(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                <div className="num me-2">
                                  <label className="form-label">
                                    Shift Type
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Shift Type"
                                    value={searchShiftType}
                                    onChange={(e) => {
                                      setSearchShiftType(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                                <div className="num me-2">
                                  <label className="form-label">
                                    Deadline
                                  </label>
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
                              </div>

                              <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
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
                                        setsearchCompany("");
                                        setsearchJobType("");
                                        setSearchShiftType("");
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
                                Postion Name{" "}
                              </th>
                            )}
                            {visible.col2 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Resume{" "}
                              </th>
                            )}
                            {visible.col3 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                location{" "}
                              </th>
                            )}
                            {visible.col12 && (
                              <th className="sr" style={{ width: "20%" }}>
                                Company Name
                              </th>
                            )}
                            {visible.col4 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Recruiters Email{" "}
                              </th>
                            )}
                            {visible.col8 && (
                              <th className="tax-name" style={{ width: "15%" }}>
                                Package
                              </th>
                            )}
                            {visible.col9 && (
                              <th className="active" style={{ width: "10%" }}>
                                Action
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
                                {visible.col3 && <td>{d?.Career?.name}</td>}
                                {visible.col2 && (
                                  <td>
                                    <div className="d-flex">
                                      {d.resume && (

                                        <FontAwesomeIcon
                                          onClick={() =>
                                            openPdfInNewTab(d?.resume)
                                          }
                                          icon={faEye}
                                          className="viewEye"
                                        />
                                      )}
                                    </div>
                                    <div
                                      className="role-holder"
                                      onClick={() =>
                                        openPdfInNewTab(d?.resume)
                                      }
                                    >
                                      <object
                                        data={IMG_URL + d?.resume}
                                        type="application/pdf"
                                        width="50"
                                        height="50"
                                      >
                                        <p>
                                          Browser Not Supported{" "}
                                          <a
                                            href={IMG_URL + d?.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download PDF
                                          </a>
                                        </p>
                                      </object>
                                    </div>
                                  </td>
                                )}
                                {visible.col4 && <td>{d?.Career?.job_location}</td>}
                                {visible.col5 && (<td>{d?.Career?.company_name}</td>)}
                                {visible.col4 && <td>{d?.Career?.recruiter_email}</td>}
                                {visible.col4 && <td>{`${d?.Career?.start_annual_package} - ${d?.Career?.end_annual_package} pre annum`}</td>}
                                {visible.col9 && (
                                  <td>

                                    <div className="d-flex">

                                      {isAllow.includes(IDS.Customer.Delete) ? (
                                        <DeletButton
                                          showDeleteRecord={showDeleteRecord}
                                          id={d?.id}
                                          name={d?.Career?.name}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                    </div>

                                  </td>
                                )
                                }
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
          </div >
        </section >
      </div >

      {
        show ? (
          <AddOffCanvance
            handleClose={handleClose}
            setShow={setShowAdd}
            show={show}
          />
        ) : (
          ""
        )
      }

      {
        show1 ? (
          <EditOffCanvance
            handleClose={handleClose1}
            setShow={setShowEdit}
            show={show1}
          />
        ) : (
          ""
        )
      }

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

      <Modal
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
      </Modal>
    </>
  );
};

export default Tables;
