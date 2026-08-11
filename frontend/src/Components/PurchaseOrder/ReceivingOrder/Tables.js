import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import plus from "../../../Components/assets/icons/a1.png";
import colunms from "../../../Components/assets/icons/LINES.png";
import pen from "../../../Components/assets/icons/pen.png";
import eye from "../../../Components/assets/icons/blackeye.png";
import swap from "../../../Components/assets/icons/swap.png";
import basket from "../../../Components/assets/icons/basket.png";
import search1 from "../../../Components/assets/icons/search.png";
import top from "../../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Header from "../../Header/Header";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightLeft, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
// *******************toster****************************
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
// import EditOffCanvanceReceiving from "./EditReceiving";
import ModalDelete from "../../common/ModelDelete";
import { AddButton, EditButton, DeletButton } from "../../common/Button";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import { formatDateTime, IDS, ItemType } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
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
  const [show2, setShowEditReceiving] = useState(0);
  const [option, setOption] = useState();
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);

  const [changeStatus, setChangeStatus] = useState();
  const [searchCategory, setSearchCategory] = useState("");

  const [searchDate, setSearchDate] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  const [ProductSearch, setProductSearch] = useState("");
  const [Description, setDescription] = useState("");
  const [BrandSearch, setBrandSearch] = useState("");
  const [SupplierSearch, setSupplierSearch] = useState("");

  const [BoCodesearch, setBoCodeSearch] = useState("");
  const [ModelNosearch, setModelNoSearch] = useState("");
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    try {
      const response = await withLoader(() =>
        getData(
          `/admin/purchase-order/receiving-order?page=${onPageChange}&per_page=${perPage}&term=${
            search || ""
          }&p_category_id=${searchCategory?.value || ""}&item_type_id=${
            ItemType.Product
          }&from=${searchDate || ""}&to=${searchDateTo || ""}&product_search=${
            ProductSearch || ""
          }&brand_search=${BrandSearch || ""}&supplier_search=${
            SupplierSearch || ""
          }&bo_code=${BoCodesearch || ""}&model_no=${ModelNosearch || ""}&description=${Description || ""}`,
        ),
      );
      await setData(response);
      setCurrentPage(response?.data?.current_page);
      setperPage(response?.data?.per_page);
      // setSearch(response?.data?.search_name);
      settotalPages(response?.data?.total_pages);
      setOption(await Per_Page_Dropdown(response?.data?.total));
    } catch (error) {
      console.error("getDataAll error:", error);
    }
  };
  useEffect(() => {
    getDataAll();
  }, [
    changeStatus,
    perPage,
    reset,
    show,
    show1,
    show2,
    // search,
    // searchCategory,
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
      </Pagination.Item>,
    );
  }

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
  const handleClose2 = () => setShowEditReceiving(0);
  const handleShow2 = (id) => {
    setShowEditReceiving(id);
  };

  const DeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(
        `/admin/purchase-order/receiving-order/${recordToDeleteId}`,
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

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [showoff, setShowoff] = useState(false);

  const BulkUpload = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const response = await postData(
        "/admin/purchase-order/receiving-order/bulk",
        formData,
        {},
      );
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
      await getDownloadDataExcel(
        "/admin/purchase-order/receiving-order/sample",
        {},
        "state",
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [categories, setCategories] = useState([]);
  const GetAllCategory = async () => {
    const response = await getData("/common/masters/all-p-category");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };

  useEffect(() => {
    GetAllCategory();
  }, []);

  const HandleDownload = async () => {
    if (data?.data?.data?.length <= 0) {
      alert("No record found");
    } else {
      try {
        await getDownloadDataExcel(
          `/admin/purchase-order/receiving-order/download?per_page=${perPage}&term=${
            search || ""
          }&p_category_id=${searchCategory?.value || ""}&item_type_id=${
            ItemType.Product
          }&from=${searchDate || ""}&to=${searchDateTo || ""}&product_search=${
            ProductSearch || ""
          }&brand_search=${BrandSearch || ""}&supplier_search=${
            SupplierSearch || ""
          }&bo_code=${BoCodesearch || ""}&model_no=${ModelNosearch || ""}`,
          null,
          "Receiving Order",
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <div className="main-advancedashboard">
        <Header
          title={"Receiving Order"}
          link={"/admin/masters/purchase-order/receiving-order"}
        />
        <div className="row me-0 ms-0">
          <div className="row MainRowsec me-0 ms-0">
            <section className="AdvanceDashboard">
              <div className="col-xxl-12 col-xl-12 p-0 ">
                <section className="Tabels tab-radio tab-radio">
                  <div className="">
                    {/* container */}
                    <div className="row">
                      {/* <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="add me-3">
                          {isAllow.includes(IDS.ProductSubCategory.Add) ? (
                            <Link
                              // to="/admin/masters/purchase-order/receiving-order/add"
                              type="button"
                              className="btn btn-add pe-3"
                            >
                              <div onClick={() => handleShow()}>
                                <p className="add-sub-txttt">
                                  {" "}
                                  <img
                                    src={plus}
                                    className="plus me-2 ms-0"
                                    alt=""
                                  />{" "}
                                  Add Purchase Order
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div> */}

                      <div className="row ">
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
                        <div className=" col-12">
                          <div className="row align-items-start">
                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <div className="num">
                                <label className="form-label"></label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id=""
                                  value={search}
                                  placeholder="Search Batch No."
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setSearch(e.target.value);
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
                                  value={ProductSearch}
                                  placeholder="Search Product Name"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setProductSearch(e.target.value);
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
                                  value={BrandSearch}
                                  placeholder="Search Brand Name"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setBrandSearch(e.target.value);
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
                                  value={SupplierSearch}
                                  placeholder="Search Supplier Name"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setSupplierSearch(e.target.value);
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
                                  value={BoCodesearch}
                                  placeholder="Search BoCode"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setBoCodeSearch(e.target.value);
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
                                  value={ModelNosearch}
                                  placeholder="Search Model No."
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setModelNoSearch(e.target.value);
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
                                  value={Description}
                                  placeholder="Search Description"
                                  onChange={(e) => {
                                    setonPageChange(1);
                                    setDescription(e.target.value);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <div className="num me-2">
                                <label className="form-label">Start Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  placeholder="From"
                                  value={searchDate}
                                  max="2050-12-31"
                                  onChange={(e) => {
                                    const selectedDate = e.target.value;

                                    if (
                                      new Date(selectedDate).getFullYear() >
                                      2050
                                    ) {
                                      return;
                                    }

                                    setSearchDate(selectedDate);
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
                                  max="2050-12-31"
                                  onChange={(e) => {
                                    const selectedDate = e.target.value;

                                    // Safety check for manual typing
                                    if (
                                      new Date(selectedDate).getFullYear() >
                                      2050
                                    ) {
                                      return;
                                    }

                                    setSearchDateTo(selectedDate);
                                    setonPageChange(1);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row align-items-start">
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
                                <label className="form-label"></label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearch("");
                                    setSearchCategory("");
                                    setSearchDate("");
                                    setSearchDateTo("");
                                    setModelNoSearch("");
                                    setBoCodeSearch("");
                                    setSupplierSearch("");
                                    setBrandSearch("");
                                    setProductSearch("");
                                    setDescription("");
                                    setReset(!reset);
                                  }}
                                  className="btn btn-reset"
                                >
                                  Reset
                                </button>
                              </div>
                            </div>

                            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                              <label className="form-label"></label>
                              <div>
                                <button
                                  className="btn btn-success "
                                  type="button"
                                  onClick={HandleDownload}
                                >
                                  Receiving Order
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-file-lines"
                                    className="ms-2"
                                  />
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
                                <th className="tax-name">Batch No.</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Supplier Name</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Product Name</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Brand name</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Model No.</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Bo Code</th>
                              )}
                              {visible.col2 && (
                                <th className="tax-name">Description</th>
                              )}
                              {/* {visible.col2 && (
                                <th className="tax-name">Varient Weight </th>
                              )} */}
                              {visible.col2 && (
                                <th className="tax-name"> Stock</th>
                              )}
                              {/* {visible.col2 && (
                                <th className="tax-name">Subscription Stock</th>
                              )} */}
                              {visible.col3 && (
                                <th className="tax-name">Total Quantity</th>
                              )}{" "}
                              {/* {visible.col8 && (
                                <th className="tax-name">Waste Quantity</th>
                              )}{" "} */}
                              {visible.col7 && (
                                <th className="tax-name">Total Price</th>
                              )}
                              {visible.col6 && (
                                <th className="tax-name ">Date</th>
                              )}
                              {/* {visible.col4 && (
                                <th className="tax-name">Status</th>
                              )} */}
                              {visible.col5 && (
                                <th className="active">Action</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {data?.data?.data?.map((batch, batchIndex) => {
                              // Each batch may have multiple Receiving_Products
                              const totalVariants =
                                batch.Receiving_Products?.length || 1;

                              return batch.Receiving_Products?.map(
                                (product, productIndex) => (
                                  <tr
                                    key={`batch-${batchIndex}-product-${productIndex}`}
                                  >
                                    {/* Sr. No. */}
                                    {productIndex === 0 && visible.col1 && (
                                      <td rowSpan={totalVariants}>
                                        {batchIndex + 1}
                                      </td>
                                    )}

                                    {/* Batch No. */}
                                    {productIndex === 0 && visible.col2 && (
                                      <>
                                        {" "}
                                        <td rowSpan={totalVariants}>
                                          {batch.batch_no}
                                        </td>
                                        <td rowSpan={totalVariants}>
                                          {batch.Supplier?.name ?? "-"}
                                        </td>
                                      </>
                                    )}

                                    {visible.col2 && (
                                      <td className="width_dertails_name_div">
                                        {product.Product?.name ?? "-"}
                                      </td>
                                    )}
                                    {visible.col2 && (
                                      <td>
                                        {product.Product?.Brand?.name ?? "-"}
                                      </td>
                                    )}
                                    {visible.col2 && (
                                      <td>
                                        {product.Product?.model_no ?? "-"}
                                      </td>
                                    )}
                                    {visible.col2 && (
                                      <td>{product.Product?.bo_code ?? "-"}</td>
                                    )}

                                    {visible.col2 && (
                                      <td>
                                        {product?.description ?? "-"}
                                      </td>
                                    )}

                                    {/* General Stock */}
                                    {visible.col2 && (
                                      <td>
                                        {product.Product_Stock?.general_stock ??
                                          "-"}
                                      </td>
                                    )}

                                    {/* Total Quantity (batch level) */}
                                    {productIndex === 0 && visible.col3 && (
                                      <td rowSpan={totalVariants}>
                                        {batch.quantity}
                                      </td>
                                    )}

                                    {/* Waste Quantity */}
                                    {/* {productIndex === 0 && visible.col8 && (
                                      <td rowSpan={totalVariants}>
                                        {batch.waste_quantity}
                                      </td>
                                    )} */}

                                    {/* Total Price */}
                                    {productIndex === 0 && visible.col7 && (
                                      <td rowSpan={totalVariants}>
                                        {batch.total_price}
                                      </td>
                                    )}

                                    {/* Date */}
                                    {productIndex === 0 && visible.col6 && (
                                      <td
                                        rowSpan={totalVariants}
                                        className="width_dertails_name_div"
                                      >
                                        {formatDateTime(batch.createdAt)}
                                      </td>
                                    )}

                                    {/* Action */}
                                    {productIndex === 0 && visible.col5 && (
                                      <td rowSpan={totalVariants}>
                                        <div className="d-flex">
                                          {isAllow.includes(
                                            IDS.Receiving_Order.Edit,
                                          ) && (
                                            <Link
                                              to={`/purchase-product/receiving-order/edit/${batch.id}`}
                                            >
                                              <Button className="action-btn active">
                                                <img
                                                  src={eye}
                                                  className="eye_icon_table_btn"
                                                  alt="view"
                                                />
                                              </Button>
                                            </Link>
                                          )}
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                ),
                              );
                            })}
                          </tbody>

                          {/* <tbody>
                            {data?.data?.data?.map((d, index) => {
                              const paginatedIndex =
                                (onPageChange - 1) * perPage + index + 1;
                              return (
                                <tr className="" key={index}>
                                  {visible.col1 && <td>{paginatedIndex}.</td>}
                                  {visible.col2 && <td>{d?.batch_no}</td>}
                                  {visible.col3 && <td>{d?.quantity}</td>}
                                  {visible.col8 && <td>{d?.waste_quantity}</td>}
                                  {visible.col7 && <td>{d?.total_price}</td>}
                                  {visible.col6 && (
                                    <td>{formatDateTime(d?.createdAt)}</td>
                                  )}

                               
                                  <td>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        checked={d.status}
                                        disabled={!isAllow?.includes(35)}
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
                              
                                  <td>
                                    <div className="d-flex">
                                    

                                      {isAllow.includes(
                                        IDS.Receiving_Order.Edit
                                      ) ? (
                                       

                                        <Link to={`/purchase-product/receiving-order/edit/${d?.id}`}>
                                          <Button className="action-btn active"><img src={pen} className="pen" alt="" /></Button>
                                        </Link>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </td>
                              
                                </tr>
                              );
                            })}
                          </tbody> */}
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
            </section>
          </div>
        </div>
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

      {/* {show2 ? (
        <EditOffCanvanceReceiving
          handleClose={handleClose2}
          setShow={setShowEditReceiving}
          show={show2}
        />
      ) : (
        ""
      )} */}

      <ModelBulkUpload
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />

      <Toaster position="top-right" />

      <OffcanvasCon show={showoff} handleClose={() => setShowoff(false)} />

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
                  <br />
                  Dependent Data Also Be Deleted And
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
    </>
  );
};

export default Tables;
