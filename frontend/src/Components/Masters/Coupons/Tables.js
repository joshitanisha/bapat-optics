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
import { IDS, RoleId } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import pen from "../../../Components/assets/icons/pen.png";
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
  const { loading, withLoader } = useLoader();

  const getDataAll = async () => {
    const response = await withLoader(() =>
      getData(
        `/admin/coupon?page=${onPageChange || 1}&per_page=${perPage || 5}&term=${
          search || ""
        }`,
      ),
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
      </Pagination.Item>,
    );
  }

  const ChangeStatus = async (id) => {
    const response = await editStatusData(`/admin/coupon/${id}`);
    setChangeStatus(response);
  };

  const ChangeCustomerStatus = async (id) => {
    const response = await editStatusData(`/admin/coupon/customer-view/${id}`);
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
          selectAllChecked.filter((e) => e !== Number(value)),
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
      const response = await deleteData(`/admin/coupon/${recordToDeleteId}`);
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
        <Header title={"Coupons"} link={"/admin/coupon"} />
        <section className="AdvanceDashboard">
          <div className="col-lg-12 p-0">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    {/* {user.role_id === RoleId.Vendor && ( */}
                    <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div className="add me-3">
                        {isAllow.includes(IDS.Coupon.Add) ? (
                          <Link
                            // to="/admin/coupon/add"
                            type="button"
                            className="btn btn-add pe-3"
                          >
                            <div onClick={() => handleShow()}>
                              <img
                                src={plus}
                                className="plus me-2 ms-0"
                                alt=""
                              />
                              Add Coupon
                            </div>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* )} */}

                    {/* {isAllow?.includes(210) ? (
                          <div className="add me-3">
                            <button
                              className="btn btn-add pe-3"
                              onClick={() =>
                                document.getElementById("CategoryFile").click()
                              }
                            >
                              Bulk Upload
                            </button>

                            <input
                              type="file"
                              id="CategoryFile"
                              onChange={(e) => {
                                BulkUpload(e);
                              }}
                              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              style={{ display: "none" }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                        {isAllow?.includes(210) ? (
                          <div className="add me-3">
                            <Link type="button" className="btn btn-add pe-3">
                              <div onClick={Sample}>Sample</div>
                            </Link>
                          </div>
                        ) : (
                          <></>
                        )} */}

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
                              (currentPage - 1) * perPage + 1,
                            )} to ${Math.min(
                              currentPage * perPage,
                              data?.data?.total,
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
                                placeholder="Search Coupon"
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
                            {visible.col1 && (
                              <th className="sr" style={{ width: "10%" }}>
                                Sr. No.
                              </th>
                            )}
                            {visible.col2 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Name{" "}
                              </th>
                            )}{" "}
                            {visible.col3 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Code{" "}
                              </th>
                            )}{" "}
                            {visible.col4 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Type{" "}
                              </th>
                            )}{" "}
                            {visible.col5 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Discount{" "}
                              </th>
                            )}{" "}
                            {visible.col9 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Required Amount{" "}
                              </th>
                            )}{" "}
                            {visible.col6 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Image{" "}
                              </th>
                            )}{" "}
                            {visible.col7 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Status
                              </th>
                            )}
                            {visible.col7 && (
                              <th className="tax-name" style={{ width: "10%" }}>
                                Customer View
                              </th>
                            )}
                            {visible.col8 && (
                              <th className="active" style={{ width: "50px" }}>
                                Action
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
                                  <td className="width_dertails_name_div">
                                    {d?.name}
                                  </td>
                                )}{" "}
                                {visible.col3 && <td>{d?.code}</td>}{" "}
                                {visible.col4 && (
                                  <td>{d?.Discount_Type?.name}</td>
                                )}{" "}
                                {visible.col5 && (
                                  <td>
                                    {d?.discount}
                                    {d?.type === "Percentage" ? "%" : "/-"}
                                  </td>
                                )}{" "}
                                {visible.col9 && <td>{d?.required_amount}</td>}{" "}
                                {visible.col6 && (
                                  <td>
                                    {d?.image && (
                                      <img
                                        src={IMG_URL + d?.image}
                                        alt="Image"
                                        width="50"
                                        height="50"
                                      />
                                    )}
                                  </td>
                                )}
                                {visible.col7 && (
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        checked={d.status}
                                        disabled={
                                          !isAllow?.includes(IDS.Coupon.Edit)
                                        }
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
                                {visible.col7 && (
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        checked={d.customer_view}
                                        disabled={
                                          !isAllow?.includes(IDS.Coupon.Edit)
                                        }
                                        onChange={() => {
                                          ChangeCustomerStatus(d.id);
                                        }}
                                        id={`flexSwitchCheckDefault${d?.id}`}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`flexSwitchCheckDefault${d?.id}`}
                                      >
                                        {d.customer_view
                                          ? "Active"
                                          : "Inactive"}
                                      </label>
                                    </div>
                                  </td>
                                )}
                                {visible.col8 && (
                                  <td>
                                    <div className="d-flex">
                                      {isAllow.includes(IDS.Coupon.Edit) ? (
                                        // <EditButton
                                        //   handleShow1={handleShow1}
                                        //   id={d?.id}
                                        // />

                                        <Link to={`/coupons/edit/${d?.id}`}>
                                          <Button className="action-btn active">
                                            <img
                                              src={pen}
                                              className="pen"
                                              alt=""
                                            />
                                          </Button>
                                        </Link>
                                      ) : (
                                        <></>
                                      )}
                                      {isAllow.includes(IDS.Coupon.Delete) ? (
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
