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
import { formatDate, IDS } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import parse from 'html-react-parser';

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
  const getDataAll = async () => {
    const response = await getData(
      `/admin/career/career-form?page=${onPageChange}&per_page=${perPage}&term=${encodeURIComponent(search)}`
    );
    await setData(response);
    setCurrentPage(response?.data?.current_page);
    setperPage(response?.data?.per_page);
    setSearch(response?.data?.search_name);
    settotalPages(response?.data?.total_pages);

    setOption(await Per_Page_Dropdown(response?.data?.total));

    const newData = response?.data?.data;
    if (newData) {
      const newIds = newData?.map((d) => d?.id);
      setAllChecked(newIds);
    }
  };

  console.log("qqqqqqqqqqqqq", data);


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
    const response = await editStatusData(`/admin/career/career-form/${id}`);
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
      const response = await deleteData(`/admin/career/career-form/${recordToDeleteId}`);


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
    col10: true,
    col11: true,
    col12: true,
    col13: true,
    col14: true,
    col15: true,
    col16: true,
    col17: true,
    col18: true,
    col19: true,
    col20: true,
    col21: true,
    col22: true


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
      const response = await postData("/admin/career/career-form/bulk", formData, {});
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
      await getDownloadDataExcel("/admin/career/career-form/sample", {}, "Category");
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



  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Career"} link={"/admin/career/career-form"} />
        <section className="AdvanceDashboard">
          <div className="col-lg-12 p-0">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div className="add me-3">

                        <Link

                          type="button"
                          className="btn btn-add pe-3"
                        >
                          <div onClick={() => handleShow()}>
                            <img
                              src={plus}
                              className="plus me-2 ms-0"
                              alt=""
                            />
                            Add Career
                          </div>
                        </Link>

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
                              onChange={(e) => { setonPageChange(1); setperPage(e.target.value) }}
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
                              <label className="form-label"></label>
                              <input
                                type="text"
                                className="form-control"
                                id=""
                                value={search}
                                placeholder="Search Career"
                                onChange={(e) => {
                                  setSearch(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                            <label className="form-label">Search</label>
                            <div className="Search">
                              <Button
                                type="button"
                                onClick={() => { setonPageChange(1); getDataAll(); }}
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
                             <label className="form-label">Reset</label>
                            <div className="Search-1">
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
                              <th className="tax-name">Name </th>
                            )}{" "}
                            {/* {visible.col3 && (
                              <th className="tax-name">Description</th>
                            )}{" "} */}
                            {visible.col4 && (
                              <th className="tax-name">Skill</th>
                            )}{" "}
                            {visible.col5 && (
                              <th className="tax-name">Job Location</th>
                            )}{" "}
                            {visible.col6 && (
                              <th className="tax-name">Role Permission</th>
                            )}
                            {visible.col7 && (
                              <th className="active">Hr Name</th>
                            )}
                            {visible.col8 && (
                              <th className="active">Recruiter Email</th>
                            )}
                            {visible.col9 && (
                              <th className="active">Job Type</th>
                            )}
                            {visible.col10 && (
                              <th className="active">Shift Type</th>
                            )}
                            {visible.col11 && (
                              <th className="active">Recruiter Contact</th>
                            )}
                            {visible.col12 && (
                              <th className="active">Start Annual Package</th>
                            )}
                            {visible.col13 && (
                              <th className="active">End Annual Package</th>
                            )}
                            {visible.col14 && (
                              <th className="active">Company Name</th>
                            )}
                            {visible.col15 && (
                              <th className="active">Vacancy</th>
                            )}
                            {/* {visible.col16 && (
                              <th className="active">Image</th>
                            )} */}
                            {visible.col17 && (
                              <th className="active">Experience From</th>
                            )}
                            {visible.col18 && (
                              <th className="active">Exaperienc to</th>
                            )}
                            {visible.col19 && (
                              <th className="active">Deadline</th>
                            )}
                            {visible.col20 && (
                              <th className="active">Language</th>
                            )}
                            {visible.col21 && (
                              <th className="active">Qualification</th>
                            )}
                            {visible.col22 && (
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
                                {visible.col2 && <td className="width_dertails_name_div">{d?.name}</td>}{" "}
                                {/* {visible.col3 && <td>{parse(d?.description)}</td>}{" "} */}
                                {visible.col4 && <td>{d?.skill}</td>}{" "}
                                {visible.col5 && <td>{d?.job_location}</td>}{" "}
                                {visible.col6 && <td>{parse(d?.role_permission)}</td>}{" "}
                                {visible.col7 && <td>{d?.hr_name}</td>}{" "}
                                {visible.col8 && <td>{d?.recruiter_email}</td>}{" "}
                                {visible.col9 && <td>{d?.JobType?.name}</td>}{" "}
                                {visible.col10 && <td>{d?.Shift?.name}</td>}{" "}
                                {visible.col11 && <td>{d?.recruiter_contact_number}</td>}{" "}
                                {visible.col12 && <td>{d?.start_annual_package}</td>}{" "}
                                {visible.col13 && <td>{d?.end_annual_package}</td>}{" "}
                                {visible.col14 && <td>{d?.company_name}</td>}{" "}
                                {visible.col15 && <td>{d?.vacancy}</td>}{" "}
                                {/* {visible.col16 && (
                                  <td>
                                    {d?.image && (
                                      <img
                                        src={IMG_URL + d?.image}
                                        alt="Image"
                                        className="product-image"
                                      />
                                    )}
                                  </td>
                                )} */}
                                {visible.col17 && <td>{d?.experience_from}</td>}{" "}
                                {visible.col18 && <td>{d?.experience_to}</td>}{" "}
                                {visible.col19 && <td>{formatDate(d?.deadline)}</td>}{" "}
                                {/* {visible.col6 && (
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        checked={d.status}
                                        disabled={!isAllow?.includes(51)}
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
                                {visible.col20 && <td>{d?.vacancy}</td>}{" "}
                                {visible.col21 && <td>{d?.vacancy}</td>}{" "}
                                {visible.col22 && (
                                  <td>
                                    <div className="d-flex">
                                      {isAllow.includes(IDS.Brand.Edit) ? (
                                        <EditButton
                                          handleShow1={handleShow1}
                                          id={d?.id}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                      {isAllow.includes(IDS.Brand.Delete) ? (
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
                      {data && data?.data?.data?.length > 0 ?
                        <Pagination_Holder
                          onPageChange={currentPage}
                          totalPages={totalPages}
                          handlePageChange={handlePageChange}
                        /> : <p className="no-datashow">Sorry, No Data Found</p>}
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
