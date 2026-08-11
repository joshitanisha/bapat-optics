import React, { useContext, useEffect, useRef, useState } from "react";
import "./AdvanceDashboard.css";
import Header from "../../Header/Header";
import { Link, useNavigate } from "react-router-dom";
import Dashboard_LineChart from "./Dashboard_LineChart/Dashboard_LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faBell,
  faCalendarCheck,
  faCartFlatbed,
  faChartSimple,
  faCircleUser,
  faComments,
  faExclamationCircle,
  faGlobe,
  faIndustry,
  faLightbulb,
  faMessage,
  faPhone,
  faRepeat,
  faTape,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import Rating from "@mui/material/Rating";
import { Context } from "../../../utils/context";
import { faJediOrder } from "@fortawesome/free-brands-svg-icons";
import { RoleId } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
function AdvanceDashboard() {
  const [value, setValue] = useState(2);
  const navigate = useNavigate();
  const { getData, usertype } = useContext(Context);

  const [result, setResult] = useState({});
  const [pieData, setPieData] = useState();
  const [avgRating, setAvgRating] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [chartData, setChartData] = useState({});
  const { loading, withLoader } = useLoader();
  const [doctor, setDoctor] = useState({});
  const getDataAll = async () => {
    const result = await withLoader(() => getData("/admin/dashboard/dashboard-data"));
    setStatusCounts(result?.data);
  };
  // const getDataDoctor = async () => {
  //   const result = await getData("/admin/dashboard/doctor-wallet");
  //   setDoctor(result?.data);
  // };

  const getChartData = async () => {
    const result = await getData("/admin/dashboard/sales-chart");
    setChartData(result?.data);
  };

  
  useEffect(() => {
    getDataAll();
    getChartData();
  }, []);

  const [user, setUser] = useState({});

  const GetUser = async () => {
    const response = await getData(`/common/auth/usersingleget`);
    if (response?.success) {
      await setUser(response?.data);
    }
  };

  useEffect(() => {
    GetUser();
    // getDataDoctor();
  }, []);

  return (
    <div>
      <div className="main-advancedashboard">
        <section className="AdvanceDashboard">
          <div className="AdvanceDashboardTabs">
            <Header title={"Dashboard"} link={"/masters/social_links"} />
            <div className=""></div>
          </div>
        </section>
        {user.role_id === RoleId.Doctor && (
          <div className="col-xl-12 col-lg-12">
            <div className="Main-Section-Advanced-Dashboard">
              <div className="row">
                <div className="col-xl-3 col-lg-4">
                  <div className="bucket-card-holder">
                    <div className="second_card_holder">
                      <h6 className="title">Wallet Amount</h6>
                      <div className="inner_div">
                        <div className="top_heading">
                          <div className="icon_holder">
                            <FontAwesomeIcon className="icon" icon={faWallet} />
                          </div>
                          <div className="text_holder">
                            <p className="text">Wallet Amount</p>
                          </div>
                        </div>

                        <div className="count_holder">
                          <p className="count"> {doctor?.wallet?.amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-xl-3 col-lg-4">
                  <div className="bucket-card-holder">
                    <div className="second_card_holder">
                      <h6 className="title">Appointment</h6>
                      <div
                        className="inner_div"
                        onClick={() => {
                          navigate("/subscription/appointment");
                        }}
                      >
                        <div className="top_heading">
                          <div className="icon_holder">
                            <FontAwesomeIcon
                              className="icon"
                              icon={faCircleUser}
                            />
                          </div>
                          <div className="text_holder">
                            <p className="text">Appointment</p>
                          </div>
                        </div>

                        <div className="count_holder">
                          <p className="count">
                            {" "}
                            {doctor?.appointment?.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bucket-card-holder">
                    <div className="second_card_holder">
                      <h6 className="title">Doctor Code</h6>
                      <div className="inner_div">
                        <div className="top_heading">
                          <div className="icon_holder">
                            <FontAwesomeIcon
                              className="icon"
                              icon={faCircleUser}
                            />
                          </div>
                          <div className="text_holder">
                            <p className="text">Doctor Code</p>
                          </div>
                        </div>

                        <div className="count_holder">
                          <p className="count">
                            {" "}
                            {doctor?.doctor?.doctor_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}
        {user.role_id === RoleId.Admin && (
          <div className="Main-Section-Advanced-Dashboard">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3">
                    <div
                      className="row"
                      onClick={() => {
                        user?.Store_Detail?.s_category?.is_restaurant_flow
                          ? navigate("/Foods/:id")
                          : navigate("/products");
                      }}
                    >
                      <div className="col-xl-12 col-lg-12">
                        <div className="bucket-card-holder">
                          <div className="second_card_holder">
                            <h6 className="title">Products</h6>

                            <div className="inner_div">
                              <div className="top_heading">
                                <div className="icon_holder">
                                  <FontAwesomeIcon
                                    className="icon"
                                    icon={faChartSimple}
                                  />
                                </div>

                                <div className="text_holder">
                                  <p className="text">Total Products</p>
                                </div>
                              </div>

                              <div className="count_holder">
                                <p className="count">
                                  {" "}
                                  {statusCounts?.total_products}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3">
                    <div
                      className="row"
                      onClick={() => {
                        navigate("/product/product-stock");
                      }}
                    >
                      <div className="col-xl-12 col-lg-12">
                        <div className="bucket-card-holder">
                          <div className="second_card_holder">
                            <h6 className="title">Stock</h6>
                            <div className="inner_div">
                              <div className="top_heading">
                                <div className="icon_holder">
                                  <FontAwesomeIcon
                                    className="icon"
                                    icon={faArrowTrendUp}
                                  />
                                </div>
                                <div className="text_holder">
                                  <p className="text">Product Stock</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3"
                    onClick={() => navigate("/product/ratings/:id")}
                  >
                    <div className="bucket-card-holder">
                      <div className="card-heading-holder">
                        <h6>Customer Feedback</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faUser}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.total_reviews || 0}
                          </h3>
                          <h3 className="title_text">Total Messages</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3">
                    <div className="bucket-card-holder">
                      <div className="card-heading-holder">
                        <h6>Total</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faWallet}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.todays_total}
                          </h3>
                          <h3 className="title_text">Today's Payment</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3">
                    <div
                      className="bucket-card-holder"
                      onClick={() => navigate("/customers")}
                    >
                      <div className="card-heading-holder">
                        <h6>Total Customer</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faUser}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.TotalCustomer}
                          </h3>
                          <h3 className="title_text">Total Customer</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3">
                    <div
                      className="bucket-card-holder"
                      onClick={() => navigate("/master/admin-notification")}
                    >
                      <div className="card-heading-holder">
                        <h6>Notification</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                           icon={faBell}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.TotalNotification}
                          </h3>
                          <h3 className="title_text">Total New Notification</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3">
                    <div
                      className="bucket-card-holder"
                      onClick={() => navigate("/subscriptions")}
                    >
                      <div className="card-heading-holder">
                        <h6>Total Subscription</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faCalendarCheck}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.TotalSubscription}
                          </h3>
                          <h3 className="title_text">Total Subscription</h3>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div
                    className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3"
                    onClick={() => navigate("/subscriptions")}
                  >
                    <div className="bucket-card-holder">
                      <div className="card-heading-holder">
                        <h6>Total Active Subscription</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faWallet}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.TotalActiveSubscription}
                          </h3>
                          <h3 className="title_text">
                            Total Active Subscription
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div
                    className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 mb-3"
                    onClick={() => navigate("/doctor-subscriptions")}
                  >
                    <div className="bucket-card-holder">
                      <div className="card-heading-holder">
                        <h6>Total Doctor Subscription</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faWallet}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.TotaldoctorSubscription}
                          </h3>
                          <h3 className="title_text">
                            Total Doctor Subscription
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                <div className="row">
                  <div className="col-xl-6 col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-xl-12 col-lg-12">
                        <div className="bucket-card-holder">
                          <div className="card-heading-holder">
                            <h6>Sales</h6>
                          </div>
                          <div className="card-number-holder">
                            <h3>{chartData?.total}</h3>
                            <p>This month</p>
                          </div>

                          <div className="card-chart-holder">
                            <Dashboard_LineChart chartData={chartData?.data} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 mb-3">
                    <div
                      className="bucket-card-holder"
                      onClick={() => navigate("/orders/all-orders")}
                    >
                      <div className="card-heading-holder">
                        <h6>Today's Orders</h6>
                      </div>

                      <div className="card-number-holder">
                        <div className="icon_holder">
                          <FontAwesomeIcon
                            className="inner_icon"
                            icon={faCartFlatbed}
                          />
                        </div>

                        <div className="text_holder">
                          <h3 className="count_text">
                            {statusCounts?.total_Orders}
                          </h3>
                          <h3 className="title_text">Today Count</h3>
                        </div>
                      </div>

                      <div className="card-table-holder">
                        <Table className="mb-0">
                          <tbody>
                            <tr>
                              <td>New Orders</td>
                              <td className="num">
                                {statusCounts?.Pending_orders}
                              </td>
                            </tr>
                            <tr>
                              <td>Processing Orders</td>
                              <td className="num">
                                {statusCounts?.Processing_orders}
                              </td>
                            </tr>
                            <tr>
                              <td>Scheduled Orders</td>
                              <td className="num">
                                {statusCounts?.PickupScheduled_orders}
                              </td>
                            </tr>
                            <tr>
                              <td>Shipped Orders</td>
                              <td className="num">
                                {statusCounts?.Shipped_orders}
                              </td>
                            </tr>
                            <tr>
                              <td>Delivered Orders</td>
                              <td className="num">
                                {statusCounts?.Delivered_orders}
                              </td>
                            </tr>
                            <tr>
                              <td>Cancelled Orders</td>
                              <td className="num">
                                {statusCounts?.Cancelled_orders}
                              </td>
                            </tr>
                            <tr>
                              <td>Rejected Orders</td>
                              <td className="num">
                                {statusCounts?.Rejected_orders}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-12 col-lg-12">
                    <div className="row">
                      {/* <div className="col-xl-6 col-lg-6">
                      <div className="bucket-card-holder new_card_holder">
                        <div className="card-heading-holder">
                          <h6>Featured Offers %</h6>
                        </div>
                        


                        <div className="featured-card-number-holder">

                          <h3 className="align-items-center title_h3">
                            <div className="icon_holder">
                              <FontAwesomeIcon className="inner_icon" icon={faArrowTrendDown} />
                            </div>
                            {result?.total_amount}
                          </h3>



                          <div className="text_holder">
                            <h3 className="count_text">

                            </h3>
                            <h3 className="title_text">Two days agot</h3>
                          </div>

                        </div>




                        <div className="card-chart-holder"></div>
                      </div>
                    </div> */}

                      {/* <div className="col-xl-6 col-lg-6">
                        <div
                          className="bucket-card-holder new_card_holder"
                          onClick={() => navigate("/product/ratings/:id")}
                        >
                          <div className="card-heading-holder">
                            <h6>Feedback</h6>
                          </div>

                          <div className="card-rating-holder">
                            <h3 className="align-items-center title_h3">
                              <div className="start-rating-holder ">
                                <Rating
                                  name="simple-controlled"
                                  value={avgRating}
                                  precision={0.5}
                                  disabled
                                />
                              </div>
                              {result?.total_rating}{" "}
                            </h3>
                            <p className="text">This Year</p>
                          </div>

                        

                          <div className="card-chart-holder"></div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvanceDashboard;
