import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import Header from "../../Header/Header";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { Row, Col, Button, Nav, Tab, Pagination } from "react-bootstrap";
import { Context } from "../../../utils/context";
import "react-datepicker/dist/react-datepicker.css";
import PendingOrdersTable from "./PendingOrdersTable/PendingOrdersTable";
import UnshippedTable from "./UnshippedTable/UnshippedTable";
import CancelledTable from "./CancelledTable/CancelledTable";
import RejectedTable from "./RejctedTable/RejecterTable";
import SentTable from "./SentTable/SentTable";
import ReturnSingleTable from "./ReturntSingleTable/ReturnSingleTable";
import RefundTable from "./RefundTable/RefundTable";
import {
  OrderStatusIds,
  ReplaceStatusIds,
  ReturnStatusIds,
} from "../../../utils/common";
import ReplaceTable from "./ReplaceTable/ReplaceTable";
import PackingTable from "./Packing/Packing";
import {  useLoader } from "../../../utils/common";
library.add(fas);

// ********************************************************************************************************************************************************

const Tables = () => {
  const { getData, Select2Data } = useContext(Context);

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
  const [storeCategories, setStoreCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [vendorServices, setVendorServices] = useState([]);

  const GetAllCounts = async () => {
    const response = await getData("/common/masters/all-count-order-status");
    setStatusCount(response?.data);
  };

  const getAllSCategories = async () => {
    const response = await getData("/common/masters/all-s-category");
    if (response?.success) {
      setStoreCategories(
        await Select2Data(response?.data?.allCategories, "s_category_id")
      );
    }
  };

  const [user, setUser] = useState({});
  

  // const GetUser = async () => {
  //   const response = await getData(`/common/auth/usersingleget`);
  //   if (response?.success) {
  //     setUser(response?.data);
  //   }
  //   if (response?.data?.Store_Detail) {
  //     const productCategory = await getData(
  //       `/common/masters/all-store-product-categories/${response?.data?.Store_Detail?.id}`
  //     );
  //     if (productCategory?.success) {
  //       setProductCategories(
  //         await Select2Data(productCategory?.data, "p_category_id")
  //       );
  //     }
  //     const vendorServices = await getData(
  //       `/common/masters/all-vendors-services/${response?.data?.Store_Detail?.id}`
  //     );
  //     if (vendorServices?.success) {
  //       setVendorServices(
  //         await Select2Data(vendorServices?.data, "service_id")
  //       );
  //     }
  //   }
  // };
  const { loading, withLoader } = useLoader();
  const GetUser = async () => {
    try {
    

      const response = await withLoader(() => getData(`/common/auth/usersingleget`));

      if (response?.success) {
        setUser(response?.data);
      }

      if (response?.data?.Store_Detail) {
        const storeId = response?.data?.Store_Detail?.id;

        const productCategory = await getData(
          `/common/masters/all-store-product-categories/${storeId}`
        );

        if (productCategory?.success) {
          setProductCategories(
            await Select2Data(productCategory?.data, "p_category_id")
          );
        }

        const vendorServices = await getData(
          `/common/masters/all-vendors-services/${storeId}`
        );

        if (vendorServices?.success) {
          setVendorServices(
            await Select2Data(vendorServices?.data, "service_id")
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    } 
  };


  useEffect(() => {
    GetUser();
  }, []);

  useEffect(() => {
    GetAllCounts();
    getAllSCategories();
  }, []);

  const [payment_status, setPayment_status] = useState(null);
  const [return_status_id, setReturnStatus] = useState(1);
  const [searchOrderStatus, setSearchOrderSatatus] = useState(
    OrderStatusIds.PickupSchedued
  );
  const [replace_order_status_id, setReplaceStatusId] = useState("");

  const [activeTab, setActiveTab] = useState("RefundRequest");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  console.log(activeTab, "activeTab activeTab");

  return (
    <>
      <div className="main-advancedashboard">
        <Header title={"Orders"} link={"/employee/employee_details"} />
        
          <section className="AdvanceDashboard">
            <div className="col-xxl-12 col-xl-12 p-0 ">
              <div className="row MainRowsec me-0 ms-0">
                <section className="Tabels tab-radio tab-radio">
                  <div className="">

                    <div className="order-tab-holder">
                      <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey="Pending"
                      >

                        <Row>
                          <Col sm={12}>
                            <Nav
                              variant="pills"
                              className="mb-3"
                              onSelect={(k) => setActiveTab(k)}
                            >
                              <Nav.Item>
                                <Nav.Link eventKey="Pending">
                                  <span> {statusCount?.Pending} </span> New Orders
                                </Nav.Link>
                              </Nav.Item>

                              <Nav.Item>
                                <Nav.Link eventKey="Unshipped">
                                  <span> {statusCount?.Processing} </span>
                                  Processing
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item
                                onClick={() => {
                                  setSearchOrderSatatus(
                                    OrderStatusIds.PickupSchedued
                                  );
                                  handleTabClick("Sent");
                                }}
                              >
                                <Nav.Link eventKey="Sent">
                                  <span>
                                     {statusCount?.PickupScheduled +
                                      statusCount?.Shipped +
                                      statusCount?.Delivered} 
                                  </span>{" "}
                                  Sent
                                </Nav.Link>
                              </Nav.Item>

                              {/* <Nav.Item>
                              <Nav.Link eventKey="Cancelled">
                                <span>{statusCount?.Cancelled}</span> Cancelled
                              </Nav.Link>
                            </Nav.Item> */}
                              <Nav.Item>
                                <Nav.Link eventKey="Rejected">
                                  <span> {statusCount?.Rejected} </span> Cancel
                                </Nav.Link>
                              </Nav.Item>

                              <Nav.Item>
                                <Nav.Link eventKey="Returns">
                                  <span> {statusCount?.Returned} </span> Returns
                                </Nav.Link>
                              </Nav.Item>

                              {/* <Nav.Item
                              onClick={() => {
                                setReturnStatus(
                                  ReturnStatusIds.ReturnRequested
                                );
                                handleTabClick("ReturnRequested");
                              }}
                            >
                              <Nav.Link eventKey="Returns">
                                <span>
                                  {statusCount?.ReturnRequested +
                                    statusCount?.ReturnPickupScheduled +
                                    statusCount?.ReturnItemPicked +
                                    statusCount?.ReturnRejected +
                                    statusCount?.Returned}
                                </span>{" "}
                                Return
                              </Nav.Link>
                            </Nav.Item> */}
                              <Nav.Item
                                onClick={() => {
                                  setPayment_status("");
                                  handleTabClick("RefundRequest");
                                }}
                              >
                                <Nav.Link eventKey="Refund">
                                  <span>
                                    {statusCount?.RefundRequest +
                                      statusCount?.RefundAccepted +
                                      statusCount?.RefundRejected}
                                  </span>{" "}
                                  Refund
                                </Nav.Link>
                              </Nav.Item>

                              {/* <Nav.Item
                              onClick={() => {
                                setReplaceStatusId(
                                  ReplaceStatusIds.ReplaceRequested
                                );
                                handleTabClick("ReplaceRequest");
                              }}
                            >
                              <Nav.Link eventKey="replace">
                                <span>
                                  {statusCount?.ReplaceRequested +
                                    statusCount?.StoreItmePickupScheduled +
                                    statusCount?.StoreItemPicked +
                                    statusCount?.CustomerItemReplaced +
                                    statusCount?.StoreReplaceItemDelivered +
                                    statusCount?.ReplaceItemRejected}
                                </span>{" "}
                                Replace
                              </Nav.Link>
                            </Nav.Item>  */}
                            </Nav>
                          </Col>

                          <Col sm={12}>
                            <Tab.Content>
                              <Tab.Pane eventKey="Pending">
                                <PendingOrdersTable
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                  statusCount={statusCount}
                                  user={user}
                                  GetAllCounts={() => GetAllCounts()}
                                />
                              </Tab.Pane>

                              <Tab.Pane eventKey="Unshipped">
                                <UnshippedTable
                                  user={user}
                                  activeTab={activeTab}
                                  statusCount={statusCount}
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  storeCategories={storeCategories}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                  GetAllCounts={() => GetAllCounts()}
                                />
                              </Tab.Pane>

                              {/* <Tab.Pane eventKey="Cancelled">
                              <CancelledTable
                                user={user}
                                activeTab={activeTab}
                                statusCount={statusCount}
                                OrderByOptions={OrderByOptions}
                                resultsPerPageOptions={resultsPerPageOptions}
                                storeCategories={storeCategories}
                                productCategories={productCategories}
                                vendorServices={vendorServices}
                                GetAllCounts={() => GetAllCounts()}
                              />
                            </Tab.Pane> */}

                              <Tab.Pane eventKey="Rejected">
                                <RejectedTable
                                  user={user}
                                  statusCount={statusCount}
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  storeCategories={storeCategories}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                />
                              </Tab.Pane>

                              <Tab.Pane eventKey="Sent">
                                <SentTable
                                  user={user}
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  storeCategories={storeCategories}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                  statusCount={statusCount}
                                  activeTab={activeTab}
                                  handleTabClick={handleTabClick}
                                  searchOrderStatus={searchOrderStatus}
                                  setSearchOrderSatatus={setSearchOrderSatatus}
                                  GetAllCounts={() => GetAllCounts()}
                                />
                              </Tab.Pane>

                              <Tab.Pane eventKey="Returns">
                                <ReturnSingleTable
                                  user={user}
                                  activeTab={activeTab}
                                  statusCount={statusCount}
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  storeCategories={storeCategories}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                  GetAllCounts={() => GetAllCounts()}
                                />
                              </Tab.Pane>

                              {/* <Tab.Pane eventKey="Returns">
                              <ReturnTable
                                user={user}
                                OrderByOptions={OrderByOptions}
                                resultsPerPageOptions={resultsPerPageOptions}
                                storeCategories={storeCategories}
                                productCategories={productCategories}
                                vendorServices={vendorServices}
                                statusCount={statusCount}
                                return_status_id={return_status_id}
                                setReturnStatus={setReturnStatus}
                                activeTab={activeTab}
                                handleTabClick={handleTabClick}
                                GetAllCounts={() => GetAllCounts()}
                              />
                            </Tab.Pane> */}

                              <Tab.Pane eventKey="Refund">
                                <RefundTable
                                  user={user}
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  storeCategories={storeCategories}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                  statusCount={statusCount}
                                  setPayment_status={setPayment_status}
                                  payment_status={payment_status}
                                  activeTab={activeTab}
                                  handleTabClick={handleTabClick}
                                  GetAllCounts={() => GetAllCounts()}
                                />
                              </Tab.Pane>

                              <Tab.Pane eventKey="replace">
                                <ReplaceTable
                                  user={user}
                                  OrderByOptions={OrderByOptions}
                                  resultsPerPageOptions={resultsPerPageOptions}
                                  storeCategories={storeCategories}
                                  productCategories={productCategories}
                                  vendorServices={vendorServices}
                                  statusCount={statusCount}
                                  replace_order_status_id={
                                    replace_order_status_id
                                  }
                                  setReplaceStatusId={setReplaceStatusId}
                                  activeTab={activeTab}
                                  handleTabClick={handleTabClick}
                                />
                              </Tab.Pane>
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
    </>
  );
};

export default Tables;
