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
import BulkUploadModel from "./BulkUploadModel";
import UploadedModal from "./UploadedModal";
import ModalSave from "../../common/ModelSave";
import {  useLoader } from "../../../utils/common";
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
  const [store_id, setStoreId] = useState(id && !isNaN(id) ? id : null);
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

  const [searchDateTo, setSearchDateTo] = useState();
  const [searchDateFrom, setSearchDateFrom] = useState();

  const [searchPaymentStatus, setSearchPaymentSatatus] = useState("");

  const [approval_status_id, setSearchProductSatatus] = useState(
    ApprovalStatus.Approved
  );

  const [searchCategory, setSearchCategory] = useState("");
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [searchChildCategory, setSearchChildCategory] = useState("");
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  //

const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    try {
      const response = await withLoader(() => getData(
        `/admin/products?page=${onPageChange || 1}&per_page=${perPage?.value || 25
        }&term=${encodeURIComponent(search)}&p_category_id=${searchCategory?.value || ""
        }&p_sub_category_id=${searchSubCategory?.value || ""
        }&p_child_category_id=${searchChildCategory?.value || ""}&from=${searchDateFrom || ""
        }&to=${searchDateTo || ""}`
      ));

      setData(response);
      setCurrentPage(response?.data?.current_page);
      setSearch(response?.data?.search_name);
      settotalPages(response?.data?.total_pages);
      setOption(await Per_Page_Dropdown(response?.data?.totalEntries));

      await GetAllCounts(store_id || "");
    } catch (error) {
      console.error("Error fetching product list", error);
    } 
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
    changeStatus,
    // storeCategory,
    // searchOrder,
    onPageChange,
    // store_id,
    // id,
    // search,
    // changeStatus,
    // searchDateTo,
    // searchDateFrom,
    // searchCategory,
    // searchSubCategory,
    // searchChildCategory,
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
  const [showModel, setShowModel] = useState(false);

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

  const [storeCategories, setStoreCategories] = useState([]);

  const GetAllStoreCategory = async () => {
    const response = await getData("/common/masters/all-s-category");
    if (response?.success) {
      setStoreCategories(
        await Select2Data(response?.data?.allCategories, "s_category_id")
      );
    }
  };

  const [vendors, setVendors] = useState([]);

  const GetAllVendors = async () => {
    const response = await getData(
      `/common/masters/all-vendors-type?type=${ItemType.Product}`
    );

    if (response?.success) {
      setVendors(await Select2Data(response?.data, "store_id"));
    }
  };

  const [statusCount, setStatusCount] = useState({});

  const GetAllCounts = async (id) => {
    const response = await getData(
      `/common/masters/count-products?type=Product&store_id=${!isNaN(id) ? id : ""
      }`
    );
    setStatusCount(response?.data);
  };

  useEffect(() => {
    GetAllStoreCategory();
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

  const [uploadedShow, setUploadedShow] = useState(false);
  const [uploadedData, setUploadedData] = useState();

  const [bulkCategoryId, setBulkCategoryId] = useState();
  const [loader, setLoder] = useState(false);
  const [loaderExcel, setloaderExcel] = useState(false);
  const BulkUpload = async (e) => {
    setLoder(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("p_category_id", bulkCategoryId?.value);

      const response = await postData("/admin/products/bulk", formData);

      console.log(response, "fhkjfshfshfjsfhsjfkl");

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
        await setUploadedData(response);
        await setUploadedShow(true);
        setLoder(false);
      } else {
        await setShowModal({ code: response.code, message: response.message });
        await setUploadedData(response);
        await setUploadedShow(true);
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

  const ImageZipUpload = async (e) => {
    setloaderExcel(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const response = await postData("/admin/products/zip", formData);

      if (response?.success) {
        setloaderExcel(false);
        await setShowModal({
          code: response.code,

          message: "Image Folder Uploaded",
        });
      } else {
        setloaderExcel(false);
        await setShowModal({ code: response.code, message: response.message });
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
      await getDownloadDataExcel(
        "/admin/products/sample",
        { category_id: bulkCategoryId?.value },
        bulkCategoryId?.label
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const getAllCategories = async () => {
    const response = await getData("/common/masters/all-vendor-p-categories");
    if (response?.success) {
      // setCategories(await Select2Data(response?.data, "p_category_id"));
      const data = await Select2Data(response?.data, "p_category_id");
      setCategories(data.filter((item) => Number(item.value) !== 4));
    }
  };
  const getAllSubCategories = async (id) => {
    const response = await getData(
      `/common/masters/all-vendor-p-sub-categories/${id}`
    );
    if (response?.success) {
      setSubCategories(await Select2Data(response?.data, "p_sub_category_id"));
    }
  };



  const getAllChildCategories = async (id) => {
    const response = await getData(
      `/common/masters/all-p-child-category/${id}`
    );
    if (response?.success) {
      setChildCategories(
        await Select2Data(response?.data, "p_child_category_id")
      );
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

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
          `/admin/products/download?&term=${encodeURIComponent(search)}&p_category_id=${searchCategory?.value || ""
          }&p_sub_category_id=${searchSubCategory?.value || ""
          }&p_child_category_id=${searchChildCategory?.value || ""}&from=${searchDateFrom || ""
          }&to=${searchDateTo || ""}`,
          null,
          "Product List"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const HandleDownloadProductOrder = async () => {
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
          `/admin/products/Product-order-download?&term=${encodeURIComponent(search)}&p_category_id=${searchCategory?.value || ""
          }&p_sub_category_id=${searchSubCategory?.value || ""
          }&p_child_category_id=${searchChildCategory?.value || ""}&from=${searchDateFrom || ""
          }&to=${searchDateTo || ""}`,
          null,
          "Product Order List"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Products"} link={"/products"} />
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
                        {/* <Col sm={12}>
                          <Nav variant="pills" className="mb-3">
                          
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
                          
                          </Nav>
                        </Col> */}
                        {/* {user && user?.role_id === RoleId.Vendor && ( */}
                        <>
                          <div className="quick-filters__tabs mb-3" style={{ display: "none" }}>
                            <Row className="mb-3">
                              <Col lg={4} md={4} sm={12} xs={12}>
                                <Link to={"/product/create"}>
                                  <Button
                                    className={
                                      "quick-filters__tab quick-filters__tab--active"
                                    }
                                    onClick={() => setStoreCategory("")}
                                  >
                                    Add New Product-1
                                  </Button>
                                </Link>
                              </Col>
                              {/* <Col
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                                className="text-end"
                              >
                                <Link to={"/lens/create"}>
                                  <Button
                                    className={
                                      "quick-filters__tab quick-filters__tab--active"
                                    }
                                    onClick={() => setStoreCategory("")}
                                  >
                                    Add New Lens
                                  </Button>
                                </Link>
                              </Col> */}
                            </Row>
                          </div>
                        </>
                        {/* )} */}
                        <Col sm={12}>
                        
                            <Tab.Content>
                              {/* <Tab.Pane eventKey="Inactive"> */}
                              <My_Table
                                HandleDownload={HandleDownload}
                                HandleDownloadProductOrder={
                                  HandleDownloadProductOrder
                                }
                                loader={loader}
                                Sample={Sample}
                                BulkUpload={BulkUpload}
                                ImageZipUpload={ImageZipUpload}
                                data={data}
                                user={user}
                                getAllChildCategories={getAllChildCategories}
                                getAllSubCategories={getAllSubCategories}
                                searchChildCategory={searchChildCategory}
                                searchSubCategory={searchSubCategory}
                                searchCategory={searchCategory}
                                search={search}
                                setSearch={setSearch}
                                searchDateTo={searchDateTo}
                                searchDateFrom={searchDateFrom}
                                setSearchDateTo={setSearchDateTo}
                                setSearchDateFrom={setSearchDateFrom}
                                setSearchCategory={setSearchCategory}
                                setSearchSubCategory={setSearchSubCategory}
                                setSearchChildCategory={setSearchChildCategory}
                                childCategories={childCategories}
                                subCategories={subCategories}
                                categories={categories}
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
                                setSubCategories={setSubCategories}
                                setChildCategories={setChildCategories}
                                bulkCategoryId={bulkCategoryId}
                                setBulkCategoryId={setBulkCategoryId}
                                loaderExcel={loaderExcel}
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
      <BulkUploadModel
        getDataAll={getDataAll}
        show={showModel}
        handleClose={() => {
          setShowModel(false);
        }}
      />
      <UploadedModal
        uploadedData={uploadedData}
        show={uploadedShow}
        onHide={() => setUploadedShow(false)}
      />

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default Tables;
