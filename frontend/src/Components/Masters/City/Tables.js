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
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
// *******************toster****************************
import toast, { Toaster } from "react-hot-toast";
import Card from "react-bootstrap/Card";
import Select from "react-select";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import ModalDelete from "../../common/ModelDelete";
import { AddButton, EditButton, DeletButton } from "../../common/Button";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import { State } from "../../../utils/apis/master/Master";
import { IDS } from "../../../utils/common";
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
  const [option, setOption] = useState();
  const [changeStatus, setChangeStatus] = useState();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [searchCountry, setSearchCounty] = useState("");
  const [searchState, setSearchState] = useState("");
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/masters/city?page=${onPageChange}&per_page=${perPage}&term=${encodeURIComponent(
        search
      )}&searchCountry=${searchCountry?.value || ""}&searchState=${
        searchState?.value || ""
      }`
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
  }, [
    changeStatus,
    perPage,
    reset,
    show,
    show1,
    search,
    searchCountry,
    searchState,
    onPageChange,
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
    const response = await editStatusData(`/admin/masters/city/${id}`);
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

  const handleDeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(
        `/admin/masters/city/${recordToDeleteId}`
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
    col8: true,
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
      const response = await postData("/admin/masters/city/bulk", formData, {});
      if (response?.success) {
        setShowModal({ code: response.code, message: response.message });
      } else {
        setShowModal({ code: response.code, message: response.message });
      }
      setTimeout(() => {
        setShowModal(0);
        setShowoff(response.data);
      }, 1000);
      getDataAll();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const Sample = async (e) => {
    try {
      await getDownloadDataExcel("/admin/masters/city/sample", {}, "city");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const GetAllCountry = async () => {
    const response = await getData("/common/masters/all-country");
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "country_id"));
    }
  };
  const GetAllStates = async (id) => {
    const response = await getData(`/common/masters/all-state/${id}`);
    if (response?.success) {
      setStates(await Select2Data(response?.data, "state_id"));
    }
  };

  useEffect(() => {
    GetAllCountry();
  }, []);

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"City"} link={"/admin/masters/city"} />
        <section className="AdvanceDashboard">
          <div className="col-xxl-12 col-xl-12 p-0 ">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                          <div className="add me-3">
                            {isAllow.includes(IDS.City.Add) ? (
                              <Link
                                // to="/masters/state/add"
                                type="button"
                                className="btn btn-add pe-3"
                              >
                                <div onClick={() => handleShow()}>
                                  <img
                                    src={plus}
                                    className="plus me-2 ms-0"
                                    alt=""
                                  />
                                  Add City
                                </div>
                              </Link>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-line mt-3"></div>
                  <div className="row mt-3">
                    <div className="col-md-12">
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

                        <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
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
                              <label className="form-label"></label>
                              <Select
                                isSearchable
                                options={countries}
                                value={searchCountry}
                                placeholder="Select Country"
                                onChange={(e) => {
                                  setonPageChange(1);
                                  setSearchCounty(e);
                                  GetAllStates(e.value);
                                  setSearchState("");
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                            <div className="num">
                              <label className="form-label"></label>
                              <Select
                                isSearchable
                                options={states}
                                value={searchState}
                                placeholder="Select State"
                                onChange={(e) => {
                                  setonPageChange(1);
                                  setSearchState(e);
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
                                placeholder="Search City"
                                value={search}
                                onChange={(e) => {
                                  setonPageChange(1);
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
                                  setSearchCounty("");
                                  setSearchState("");
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
                              <th className="tax-name">Country</th>
                            )}
                            {visible.col3 && (
                              <th className="tax-name">State</th>
                            )}
                            {visible.col4 && <th className="tax-name">City</th>}
                            {visible.col8 && (
                              <th className="tax-name">Image</th>
                            )}
                            {visible.col5 && (
                              <th className="tax-name">Status</th>
                            )}

                            {visible.col6 && <th className="active">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data?.data?.map((d, index) => {
                            const paginatedIndex =
                              (onPageChange - 1) * perPage + index + 1;
                            return (
                              <tr className="" key={index}>
                                {visible.col1 && <td>{paginatedIndex}.</td>}
                                {visible.col2 && <td>{d?.Country?.name}</td>}
                                {visible.col3 && <td>{d?.State?.name}</td>}
                                {visible.col4 && (
                                  <td className="width_dertails_name_div">
                                    {d?.name}
                                  </td>
                                )}
                                {visible.col8 && (
                                  <td>
                                    {d?.image && (
                                      <img
                                        src={IMG_URL + d?.image}
                                        alt="Image"
                                        className="product-image"
                                      />
                                    )}
                                  </td>
                                )}
                                {visible.col5 && (
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        checked={d.status}
                                        disabled={!isAllow?.includes(19)}
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

                                {visible.col6 && (
                                  <td>
                                    <div className="d-flex">
                                      {isAllow.includes(IDS.City.Edit) ? (
                                        <Button
                                          // to={`/masters/state/edit/${d?.id}`}
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
                                      {isAllow.includes(IDS.City.Delete) ? (
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
