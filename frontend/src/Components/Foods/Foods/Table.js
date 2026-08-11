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
import { ApprovalStatus, ItemType, RoleId } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import BulkUploadModel from "./BulkUploadModel";

library.add(fas);

// ********************************************************************************************************************************************************

const Tables = () => {
  const { id } = useParams();

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
  const [store_id, setStoreId] = useState(id && !isNaN(id) ? id : "");
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
    ApprovalStatus.Approved
  );
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const getDataAll = async () => {
    const response = await getData(
      `/admin/products?page=${onPageChange || 1}&per_page=${perPage?.value || 25
      }&term=${encodeURIComponent(search)}&store_id=${typeof store_id === 'number' ? store_id : ""}&approval_status_id=${approval_status_id || ""}&storeCategory=1&restaurantCategory=${storeCategory || ""}&sortOrder=${sortOrder?.value || "DESC"} `
    );
    await setData(response);
    setCurrentPage(response?.data?.current_page);
    // setperPage(response?.data?.per_page);
    settotalPages(response?.data?.total_pages);
    setSearch(response?.data?.search_name);
    setOption(await Per_Page_Dropdown(response?.data?.totalEntries));
    await GetAllCounts(store_id || "");
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
    store_id,
    id,
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

  useEffect(() => { }, [searchPaymentStatus]);

  // Delete module.....................................................
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [recordToDeleteName, setRecordToDeleteName] = useState(null);
  const [showModel, setShowModel] = useState(false)

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
      const response = await deleteData(`/ order / ${recordToDeleteId} `);
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

  const [storeCategories, setStoreCategories] = useState([]);

  const GetAllProducts = async () => {
    const response = await getData("/common/masters/all-restaurant-categories");

    if (response?.success) {
      setStoreCategories(await Select2Data(response?.data, "s_category_id"));
    }
  };

  const [vendors, setVendors] = useState([]);

  const GetAllVendors = async () => {
    const response = await getData(
      `/common/masters/all-vendors-type?type=${ItemType.Food}`
    );

    if (response?.success) {
      setVendors(await Select2Data(response?.data, "store_id"));
    }
  };

  const [statusCount, setStatusCount] = useState({});

  const GetAllCounts = async (id) => {
    const response = await getData(
      `/common/masters/count-products?type=Food&store_id=${!isNaN(id) ? id : ""
      }`
    );
    setStatusCount(response?.data);
  };

  useEffect(() => {
    GetAllProducts();
    GetAllVendors();
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

  useEffect(() => {
    if (id) {
      setStoreId(id);
    } else {
      setStoreId("");
    }
  }, [id]);

  const [showoff, setShowoff] = useState(false);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });


  const BulkUpload = async (e) => {
    try {
      console.log("i am bulk");

      const formData = new FormData();
      formData.append("file", e.target.files[0]);


      const response = await postData("/admin/products/bulk", formData);

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
      await getDownloadDataExcel("/admin/products/sample", {}, "product");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Foods"} link={"/employee/employee_details"} />
        <section className="AdvanceDashboard">
          <div className="col-xxl-12 col-xl-12 p-0 ">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  <div className="order-tab-holder">
                    <Tab.Container
                      id="left-tabs-example"
                      defaultActiveKey={ApprovalStatus.Approved}
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
                        {user && user?.role_id === RoleId.Vendor && (
                          <div className="quick-filters__tabs mb-3">
                            <Link to={"/food/create"}>
                              <Button
                                className={
                                  "quick-filters__tab quick-filters__tab--active"
                                }
                                onClick={() => setStoreCategory("")}
                              >
                                List New Food
                              </Button>

                            </Link>

                            <Button
                              className="quick-filters__tab quick-filters__tab--active ms-3"
                              // onClick={() => document.getElementById("ProductFile").click()}
                              onClick={() => setShowModel(true)}
                            >
                              Bulk Upload
                            </Button>

                            <input
                              type="file"
                              id="ProductFile"
                              onChange={(e) => {
                                BulkUpload(e);
                              }}
                              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              style={{ display: "none" }}
                            />

                            <Button
                              className={
                                "quick-filters__tab ms-3"
                              }
                              onClick={Sample}
                            >
                              Download Sample
                            </Button>
                          </div>
                        )}

                        <Col sm={12}>
                          <Tab.Content>
                            {/* <Tab.Pane eventKey="Inactive"> */}
                            <My_Table
                              data={data}
                              user={user}
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
                              setStoreCategory={setStoreCategory}
                              storeCategories={storeCategories}
                              vendors={vendors}
                              setStoreId={setStoreId}
                              store_id={store_id}
                              paramid={id}
                              setChangeStatus={setChangeStatus}
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
          className={`modal fade ${showDeleteModal ? "show" : ""} `}
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

      <BulkUploadModel
        getDataAll={getDataAll}
        show={showModel}
        handleClose={() => {
          setShowModel(false);
        }}
      />
    </>
  );
};

export default Tables;
