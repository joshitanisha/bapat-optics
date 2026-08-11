import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import plus from "../../../Components/assets/icons/a1.png";
import colunms from "../../../Components/assets/icons/LINES.png";
import search1 from "../../../Components/assets/icons/search.png";
import eye from "../../../Components/assets/icons/blackeye.png";
import top from "../../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import { Link, useParams } from "react-router-dom";
import Header from "../../Header/Header";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleChevronLeft, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import ModalDelete from "../../common/ModelDelete";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import { AddButton, EditButton, DeletButton } from "../../common/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Button, Modal } from "react-bootstrap";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import DataTable from "datatables.net";
import { IDS, RoleId } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import StockTrack from "./StockTrack";
import { useLoader } from "../../../utils/common";

library.add(fas);

const Inventory = () => {
  const { id } = useParams();

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
  // const [show1, setShowEdit] = useState(0);
  const [show1, setShowEdit] = useState({ show: null, data: {} });
  const [changeStatus, setChangeStatus] = useState();
  const [option, setOption] = useState();
  const [showoff, setShowoff] = useState(false);
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  const [ProductSearch, setProductSearch] = useState("");
  const [BrandSearch, setBrandSearch] = useState("");
  const [SupplierSearch, setSupplierSearch] = useState("");

  const [BoCodesearch, setBoCodeSearch] = useState("");

  const [BarcodeSearch, setBarcodeSearch] = useState("");
  const [ModelNosearch, setModelNoSearch] = useState("");
  const { loading, withLoader } = useLoader();
  const getDataAll = async () => {
    try {
      const response = await withLoader(() =>
        getData(
          `/admin/products/product-stock/inventory/${id}?page=${
            onPageChange || 1
          }&per_page=${perPage || 5}&term=${encodeURIComponent(
            search,
          )}&product_search=${
            encodeURIComponent(ProductSearch) || ""
          }&brand_search=${
            encodeURIComponent(BrandSearch) || ""
          }&supplier_search=${encodeURIComponent(SupplierSearch) || ""}&bo_code=${
            encodeURIComponent(BoCodesearch) || ""
          }&model_no=${encodeURIComponent(ModelNosearch) || ""}&barcode_no=${
            encodeURIComponent(BarcodeSearch) || ""
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
    } catch (error) {
      console.error("getDataAll error:", error);
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
    const response = await editStatusData(
      `/admin/products/product-stock/${id}`,
    );
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
      const response = await deleteData(
        `/admin/products/product-stock/${recordToDeleteId}`,
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

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  console.log(selectedItem, "selectedItem selectedItem");

  const [appsetup, setAppsetup] = useState([]);
  const GetAllCategory = async () => {
    const response = await getData("/common/masters/app-setup");
    if (response?.success) {
      setAppsetup(response?.data);
    }
  };

  useEffect(() => {
    GetAllCategory();
  }, []);

  const [loader, setLoder] = useState(false);
  const HandleDownload = async () => {
    if (selectAllChecked.length === 0) {
      alert("Please Select Atleast One Record");
      return;
    }
    setLoder(true);
    try {
      const response = await postData(
        `/admin/products/product-stock/barcode-generate`,
        selectAllChecked,
      );

      console.log(response, "response");

      // ✔ Expecting something like "/public/invoices/barcode.pdf"
      const pdfPath = response?.data;

      if (!pdfPath) {
        alert("PDF path not found in response");
        return;
      }

      // Create final file URL
      const fileUrl = `${IMG_URL}${pdfPath}`;

      // Fetch PDF
      const res = await fetch(fileUrl);
      if (!res.ok) {
        alert("Failed to fetch PDF");
        return;
      }

      const blob = await res.blob();

      if (blob.type !== "application/pdf") {
        alert("Server did not return a valid PDF file");
        return;
      }

      // Create download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "barcode.pdf"; // you can make it dynamic
      link.click();
      window.URL.revokeObjectURL(url);
      setLoder(false);
      await getDataAll();
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };
  const [showDetails, setShowDetails] = useState({ show: 0, data: {} });
  return (
    <>
      <div className="main-advancedashboard">
        <Header
          title={"Product Stocks"}
          link={"/admin/products/product-stock"}
        />
        <section className="AdvanceDashboard">
          <div className="col-lg-12 p-0">
            <div className="row MainRowsec me-0 ms-0">
              <section className="Tabels tab-radio tab-radio">
                <div className="">
                  {/* container */}
                  <div className="row">
                    <Link to={"/product/product-stock"}>
                      <p className="Back_btn">
                        <FontAwesomeIcon icon={faCircleChevronLeft} /> Back
                      </p>
                    </Link>
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
                                placeholder="Search product"
                                onChange={(e) => {
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
                                value={BarcodeSearch}
                                placeholder="Search Barcode"
                                onChange={(e) => {
                                  setonPageChange(1);
                                  setBarcodeSearch(e.target.value);
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
                                value={SupplierSearch}
                                placeholder="Search Supplier Name"
                                onChange={(e) => {
                                  setonPageChange(1);
                                  setSupplierSearch(e.target.value);
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
                                  setModelNoSearch("");
                                  setBoCodeSearch("");
                                  setSupplierSearch("");
                                  setBrandSearch("");
                                  setProductSearch("");
                                  setBarcodeSearch("");
                                  setReset(!reset);
                                }}
                                className="btn btn-reset"
                              >
                                Reset
                              </button>
                            </div>
                          </div>

                          <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 mb-2">
                            <label className="form-label"></label>
                            <button
                              type="button"
                              className="btn btn-primary w-100"
                              onClick={HandleDownload}
                              disabled={loader}
                            >
                              {loader ? (
                                <>
                                  <div
                                    className="spinner-border spinner-border-sm text-light me-2"
                                    role="status"
                                  ></div>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  Download Barcode
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-file-lines"
                                    className="pdf-icon ms-3"
                                    variant="success"
                                  />
                                </>
                              )}
                            </button>
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
                            {visible.col0 && (
                              <th className="check round-check">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value="selectAll"
                                    checked={
                                      allChecked.length ===
                                      selectAllChecked.length
                                    }
                                    onChange={handleChange}
                                    id="selectAll"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckChecked"
                                  ></label>
                                </div>
                              </th>
                            )}
                            {visible.col1 && (
                              <th className="sr" style={{ width: "50px" }}>
                                Sr. No.
                              </th>
                            )}
                            {visible.col2 && (
                              <th className="tax-name">Unique ID</th>
                            )}{" "}
                            {visible.col2 && (
                              <th className="tax-name">Product </th>
                            )}{" "}
                            {visible.col3 && (
                              <th className="tax-name">Supplier Name</th>
                            )}{" "}
                            {visible.col4 && (
                              <th className="tax-name">Model No.</th>
                            )}{" "}
                            {visible.col4 && (
                              <th className="tax-name">BoCode.</th>
                            )}{" "}
                            {visible.col5 && (
                              <th className="tax-name">Barcode No.</th>
                            )}{" "}
                            {visible.col8 && (
                              <th className="tax-name">Barcode</th>
                            )}{" "}
                            {visible.col8 && (
                              <th className="tax-name">Stock Status</th>
                            )}{" "}
                            {visible.col8 && (
                              <th className="tax-name">Download Status</th>
                            )}{" "}
                            {visible.col7 && (
                              <th className="tax-name">Stock Track</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {data?.data?.data?.map((product, productIndex) => (
                            <tr key={`product-${productIndex}-variant`}>
                              {visible.col0 && (
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={product?.id}
                                      name="perselected"
                                      checked={selectAllChecked.includes(
                                        product?.id,
                                      )}
                                      onChange={handleChange}
                                      id="flexCheckDefault"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexCheckDefault"
                                    ></label>
                                  </div>
                                </td>
                              )}
                              {/* Serial Number (rowSpan for grouped product rows) */}
                              {visible.col1 && <td>{productIndex + 1}.</td>}

                              {visible.col2 && <td>#{product?.id}</td>}
                              {/* Product Name (rowSpan for grouped product rows) */}
                              {visible.col2 && (
                                <td className="width_dertails_name_div">
                                  {product?.Product?.name}
                                </td>
                              )}
                              {visible.col2 && (
                                <td>{product?.Supplier?.name}</td>
                              )}

                              {/* Purchase Order Quantity */}
                              {/* {visible.col3 && (
                                  <td>
                                    {product?.Product_Variant?.name}
                                  </td>
                                )} */}

                              {/* Receiving Quantity */}
                              {visible.col4 && <td>{product?.model || "-"}</td>}
                              {visible.col4 && (
                                <td>{product?.Product?.bo_code || "-"}</td>
                              )}

                              {/* Order Detail Quantity */}
                              {visible.col5 && (
                                <td>{product?.barcode_no || "-"}</td>
                              )}

                              {/* Variant Name */}
                              {product?.barcode_no ? (
                                <td>
                                  <div
                                    className="batdiv"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "15px",
                                    }}
                                  >
                                    <div
                                      className="leftbd"
                                      style={{
                                        border: "1px solid #000",
                                        width: "40mm",
                                        // height: "12mm",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "1px",
                                      }}
                                    >
                                      <div
                                        className="contdiv"
                                        style={{
                                          width: "60%",
                                        }}
                                      >
                                        <p
                                          style={{
                                            fontSize: "11px",
                                            color: "#000",
                                            margin: "1px",
                                            fontWeight: 700,
                                          }}
                                        >
                                          {product?.Product?.Brand?.name}
                                        </p>

                                        <p
                                          style={{
                                            fontWeight: 800,
                                            fontSize: "12px",
                                            color: "#000",
                                            margin: "1px",
                                          }}
                                        >
                                          Rs. {product?.Product?.mrp}
                                        </p>

                                        <p
                                          style={{
                                            fontSize: "11px",
                                            color: "#000",
                                            margin: "1px",
                                            fontWeight: 700,
                                          }}
                                        >
                                          {product?.Product?.model_no}
                                        </p>
                                      </div>

                                      <div
                                        className="barcodediv"
                                        style={{
                                          width: "40%",
                                          textAlign: "center",
                                        }}
                                      >
                                        <p
                                          style={{
                                            fontSize: "11px",
                                            color: "#000",
                                            margin: "1px",
                                            fontWeight: 700,
                                            textAlign: "left",
                                          }}
                                        >
                                          BAPAT OPTICS
                                        </p>

                                        <img
                                          src={IMG_URL + product?.barcode}
                                          alt="barcode"
                                          style={{
                                            width: "50px",
                                            height: "12px",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "11px",
                                            color: "#000",
                                            margin: "1px",
                                            fontWeight: 700,
                                            textAlign: "left",
                                          }}
                                        >
                                          {product?.barcode_no}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              ) : (
                                <td>-</td>
                              )}

                              <td>{product?.StockStatus?.name}</td>
                              <td>
                                {product?.barcode_status ? (
                                  <span
                                    style={{
                                      color: "green",
                                      fontSize: "18px",
                                    }}
                                  >
                                    ✔
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>

                              {visible.col4 && (
                                <td>
                                  {" "}
                                  {visible.col4 && (
                                    <td>
                                      <div className="d-flex">
                                        <Button
                                          className="action-btn active"
                                          onClick={() =>
                                            setShowDetails({
                                              show: product?.id,
                                              data: product,
                                            })
                                          }
                                        >
                                          Stock Track
                                        </Button>
                                        <Button
                                          className="action-btn active"
                                          onClick={() =>
                                            setShowEdit({
                                              show: product?.id,
                                              data: product,
                                            })
                                          }
                                        >
                                          Stock Update
                                        </Button>
                                      </div>
                                    </td>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}

                          {/* {data?.data?.data?.map((d, index) => {
                            const paginatedIndex =
                              (onPageChange - 1) * perPage + index + 1;
                            return (
                              <tr className="" key={index}>
                                {visible.col1 && <td>{paginatedIndex}.</td>}
                                {visible.col2 && <td className="width_dertails_name_div">{d?.name}</td>}{" "}
                                {visible.col3 && (
                                  <td>
                                    {d?.Purchase_Order_Products?.reduce(
                                      (total, item) =>
                                        total + Number(item.quantity || 0),
                                      0
                                    )}
                                  </td>
                                )}
                                {visible.col4 && (
                                  <td>
                                    {d?.Receiving_Products?.reduce(
                                      (total, item) =>
                                        total + Number(item.quantity || 0),
                                      0
                                    )}
                                  </td>
                                )}
                                {visible.col5 && (
                                  <td>
                                    {d?.Product_Order_Details?.reduce(
                                      (total, item) =>
                                        total + Number(item.quantity || 0),
                                      0
                                    )}
                                  </td>
                                )}{" "}
                                {visible.col6 && (
                                  <td>
                                    {d?.Subscription_Product_Details?.reduce(
                                      (total, item) =>
                                        total + Number(item.quantity || 0),
                                      0
                                    )}
                                  </td>
                                )}{" "}
                               
                                {visible.col8 && (
                                 
                                  <Button
                                    className="btn-primary btn-sm ms-2"
                                    onClick={() => {
                                      setSelectedItem(d);
                                      setShowModal(true);
                                    }}
                                  >
                                    View
                                  </Button>
                                )}
                                
                               
                              </tr>
                            );
                          })} */}
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

      <StockTrack
        getDataAll={getDataAll}
        handleClose={() => {
          setShowDetails({ show: 0, data: {} });
        }}
        setShowDetails={setShowDetails}
        setShow={() => setShowDetails({ show: 0, data: {} })}
        show={showDetails?.show}
        data={showDetails?.data}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Stock Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(selectedItem?.Product_Variants) ? (
            selectedItem.Product_Variants.map((stockItem, index) => (
              <div key={index} className="mb-2">
                <strong>Varient {index + 1}:</strong>
                <div>General Stock: {stockItem.general_stock}</div>
                <div>Subscription Stock: {stockItem.subscription_stock}</div>
                {/* Replace above fields with actual keys from your stock item */}
              </div>
            ))
          ) : (
            <div>No data available.</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* {show1 ? (
        <EditOffCanvance
          handleClose={handleClose1}
          setShow={setShowEdit}
          show={show1}
        />
      ) : (
        ""
      )} */}
      <EditOffCanvance
        handleClose={() => {
          setShowEdit({ show: 0, data: {} });
        }}
        setShow={() => setShowEdit({ show: 0, data: {} })}
        show={show1?.show}
        data={show1?.data}
      />

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

export default Inventory;
