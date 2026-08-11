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
import { Link } from "react-router-dom";
import Header from "../../Header/Header";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
// *******************toster****************************
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import AddOffCanvance from "./Add";
import EditOffCanvance from "./Edit";
import ModalDelete from "../../common/ModelDelete";
import { AddButton, EditButton, DeletButton } from "../../common/Button";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import ModelBulkUpload from "../../common/ModelBulkUpload";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
import { IDS } from "../../../utils/common";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import parse from "html-react-parser";
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
  } = useContext(Context);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(5);
  const [search, setSearch] = useState("");
  const [reset, setReset] = useState();
  const [show, setShowAdd] = useState(false);
  const [show1, setShowEdit] = useState(0);
  const [option, setOption] = useState();
  const [countries, setCountries] = useState([]);
  const [searchCountry, setSearchCounty] = useState("");
  const [changeStatus, setChangeStatus] = useState();
  const [totalPages, settotalPages] = useState();
  const [onPageChange, setonPageChange] = useState(1);
  const { loading, withLoader } = useLoader();

  const getDataAll = async () => {
    const response = await withLoader(() => getData(
      `/admin/setting/privacy-policy?page=${onPageChange || 1}&per_page=${perPage || 5}&term=${encodeURIComponent(search)}&searchCountry=${searchCountry?.value || ""
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
  }, [changeStatus, perPage, reset, show, show1, search, searchCountry, onPageChange]);

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
    const response = await editStatusData(`/admin/setting/privacy-policy/${id}`);
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

  const DeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(`/admin/setting/privacy-policy/${recordToDeleteId}`);
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

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Privacy Policy"} link={"/admin/setting/privacy-policy"} />
        <div className="row">
          <div className="row MainRowsec me-0 ms-0">
            <section className="AdvanceDashboard">
              <div className="col-xxl-12 col-xl-12 p-0 ">
                <section className="Tabels tab-radio tab-radio">
                  <div className="">
                    {/* container */}

                    {/* <div className="row">
                      <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mt-lg-0 mt-md-2 mt-2">
                        <div className="add me-3">
                          {isAllow.includes(IDS.AboutUs.Add) ? (
                            <Link
                              // to="/admin/setting/privacy-policy/add"
                              type="button"
                              className="btn btn-add pe-3"
                            >
                              <div onClick={() => handleShow()}>
                                <img
                                  src={plus}
                                  className="plus me-2 ms-0"
                                  alt=""
                                />
                                Add
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

                    </div> */}

                    {isAllow.includes(IDS.AboutUs.Edit) ? (
                      <Button
                        onClick={() => handleShow1(1)}
                        type="button"
                        className="btn btn-primary me-1"
                      >
                        {/* <img
                          src={pen}
                          className="pen"
                          alt=""
                        /> */}
                        Edit Privacy Policy
                      </Button>
                    ) : (
                      <></>
                    )}

                    <div className="border-line mt-3"></div>
                    <div className="row mt-3">
                      <div className="data table-responsive">
                        <Table striped bordered hover responsive center>
                          <tbody>
                            {data?.data?.data?.map((d, index) => {
                              return (
                                <tr className="" key={index}>
                                  {visible.col2 && <td style={{ width: "1200px" }}>{parse(d?.content) || ""}
                                  </td>}
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </div >
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
