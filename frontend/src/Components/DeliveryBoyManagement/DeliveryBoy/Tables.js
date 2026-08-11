import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import Header from "../../Header/Header";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { Row, Col, Button, Nav, Tab, Pagination } from "react-bootstrap";
import { Context } from "../../../utils/context";
import { getDownloadDataExcel, postData } from "../../../utils/api";
import "react-datepicker/dist/react-datepicker.css";
import Successfull_Modal from "../../common/Successfull_Modal/Successfull_Modal";
import My_Table from "./My_Table/My_Table";
import { Link, useParams } from "react-router-dom";
import { ApprovalStatus, IDS, ItemType, RoleId } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";

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
    Select2Data,
    usertype,
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState({
    value: 25,
    label: "Results per page: 25",
  });
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [option, setOption] = useState();
  const [storeCategory, setStoreCategory] = useState("");
  const [sortOrder, setSortOrder] = useState({
    value: "DESC",
    label: "Sort-by date (Descending)",
  });
  const [hideFilter, setHideFilter] = useState(false);

  const [changeStatus, setChangeStatus] = useState();

  const [selectAllChecked, setSelectAllChecked] = useState([]);
  const [allChecked, setAllChecked] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [searchInvoice, setsearchInvoice] = useState("");
  const [searchProduct, setSearchProduct] = useState();
  const [searchOrder, setSearchOder] = useState();

  const [searchPaymentStatus, setSearchPaymentSatatus] = useState("");

  const [approval_status_id, setSearchProductSatatus] = useState(
    ApprovalStatus.Pending
  );
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  //
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const getDataAll = async () => {
    const response = await getData(
      `/admin/delivery-boy?page=${onPageChange || 1}&per_page=${
        perPage?.value || 25
      }&term=${encodeURIComponent(search)}&approval_status_id=${
        approval_status_id || ""
      }&sortOrder=${sortOrder?.value || "DESC"}&from=${startDate || ""}&to=${endDate || ""}`
    );
    await setData(response);
    setCurrentPage(response?.data?.current_page);
    // setperPage(response?.data?.per_page);
    setSearch(response?.data?.search_name);
    settotalPages(response?.data?.total_pages);
    setOption(await Per_Page_Dropdown(response?.data?.totalEntries));
    await GetAllCounts();
  };
  useEffect(() => {
    getDataAll();
  }, [
    reset,
    show,
    show1,
    customerName,
    searchProduct,
    approval_status_id,
    searchPaymentStatus,
    searchInvoice,
    startDate,
    endDate,
    storeCategory,
    searchOrder,
    onPageChange,
    changeStatus,
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

  useEffect(() => {}, [searchPaymentStatus]);

  // Delete module.....................................................
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [recordToDeleteName, setRecordToDeleteName] = useState(null);

  const [searchStatus, setSearchStatus] = useState({});

  const showDeleteRecord = async (id, name) => {
    setShowDeleteModal(true);
    setRecordToDeleteId(id);
    setRecordToDeleteName(name);
  };

  const handleSelectAll = async () => {
    await setSelectAllChecked(allChecked);
  };

  const [showSuccessModel, setShowSuccessModel] = useState(false);

  // Modal function
  const handleClose = () => setShowAdd(false);
  const handleShow = () => setShowAdd(true);

  const handleClose1 = () => setShowEdit(0);
  const handleShow1 = (id) => {
    setShowEdit(id);
  };

  const DeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(`/order/${recordToDeleteId}`);
      await ErrorNotify(recordToDeleteName);
      setChangeStatus(response);
      setRecordToDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDeleteId(null);
  };

  const OrderByOptions = [
    { value: "ASC", label: "Sort-by date (Ascending)" },
    { value: "DESC", label: "Sort-by date (Descending)" },
  ];

  const resultsPerPageOptions = [
    { value: 25, label: "Results per page: 25" },
    { value: 50, label: "Results per page: 50" },
    { value: 100, label: "Results per page: 100" },
  ];

  const [statusCount, setStatusCount] = useState({});

  const GetAllCounts = async (id) => {
    const response = await getData(`/common/masters/count-delivery-boys`);
    setStatusCount(response?.data);
  };

  // const [user, setUser] = useState({});
  // const GetUser = async () => {
  //   const response = await getData(`/common/auth/usersingleget`);
  //   if (response?.success) {
  //     setUser(response?.data);
  //   }
  // };
  // useEffect(() => {
  //   GetUser();
  // }, []);

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Delivery Boys"} link={"/products"} />
        <section className="AdvanceDashboard">
          <div className="col-xxl-12 col-xl-12 p-0 ">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  <div className="order-tab-holder">
                    <Tab.Container
                      id="left-tabs-example"
                      defaultActiveKey={ApprovalStatus.Pending}
                    >
                      <Row>
                        <Col sm={12}>
                          <Nav variant="pills" className="mb-3">
                            <Nav.Item>
                              <Nav.Link
                                eventKey={ApprovalStatus.Pending}
                                onClick={() => {
                                  setSearchProductSatatus(
                                    ApprovalStatus.Pending
                                  );
                                  setonPageChange(1);
                                }}
                              >
                                <span>{statusCount?.Pending}</span> Pending
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                eventKey={ApprovalStatus.Approved}
                                onClick={() => {
                                  setSearchProductSatatus(
                                    ApprovalStatus.Approved
                                  );
                                  setonPageChange(1);
                                }}
                              >
                                <span>{statusCount?.Approved}</span> Approved
                              </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                              <Nav.Link
                                eventKey={ApprovalStatus.Rejected}
                                onClick={() => {
                                  setSearchProductSatatus(
                                    ApprovalStatus.Rejected
                                  );
                                  setonPageChange(1);
                                }}
                              >
                                <span>{statusCount?.Rejected}</span> Rejected
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        
                        <Col sm={12}>
                          <Tab.Content>
                            {/* <Tab.Pane eventKey="Inactive"> */}
                            <My_Table
                              data={data}
                              getDataAll={getDataAll}
                              statusCount={statusCount}
                              storeCategory={storeCategory}
                              OrderByOptions={OrderByOptions}
                              sortOrder={sortOrder}
                              setSortOrder={setSortOrder}
                              resultsPerPageOptions={resultsPerPageOptions}
                              perPage={perPage}
                              setperPage={setperPage}
                              setReset={setReset}
                              hideFilter={hideFilter}
                              setHideFilter={setHideFilter}
                              option={option}
                              reset={reset}
                              setonPageChange={setonPageChange}
                              setChangeStatus={setChangeStatus}
                              endDate={endDate}
                              startDate={startDate}
                              setEndDate={setEndDate}
                              setStartDate={setStartDate}
                              setSearch={setSearch}
                              search={search}
                              approval_status_id={approval_status_id}
                            />
                            {data && data?.data?.data?.length > 0 ? (
                              <Pagination_Holder
                                onPageChange={currentPage}
                                totalPages={totalPages}
                                handlePageChange={handlePageChange}
                              />
                            ) : (
                              <p className="no-datashow">
                                Sorry, No Data Found
                              </p>
                            )}
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </div>

                  <div className=""></div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

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
      <Successfull_Modal
        show={showSuccessModel}
        message={"Status Changed Successfully"}
        onHide={() => setShowSuccessModel(false)}
      />
    </>
  );
};

export default Tables;
