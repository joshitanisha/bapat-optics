import React, { useState, handlelick, active, useContext } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Context } from "../../utils/context";

library.add(fas);

const MobileSidebar = () => {
  const { isSidebarOpen, setSidebarOpen, isAllow } = useContext(Context);
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(true);
  const [showItemNames, setShowItemNames] = useState(true);
  const [headerText, setHeaderText] = useState(location.pathname);

  useEffect(() => {
    setHeaderText(location.pathname);
  });

  const [active, setActive] = useState("0");
  const handleClick = (eventKey) => {
    if (active === eventKey) {
      setActive(null);
    } else {
      setActive(eventKey);
      // setSidebarOpen(true);
    }
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? "active block" : "none";
  };

  return (
    <>
      <section className="sidebar">
        <div className="mobile-view-sidebar">
          <ul className="list-unstyled ps-0">
            {/* ***************************************************Dashboard*************************************************************** */}
            <Accordion
              // defaultActiveKey="0"
              className="mb-1"
              data-bs-toggle="collapse"
              data-bs-target="#home-collapse"
              aria-expanded="false"
            >
              <Accordion.Item
                eventKey="0"
                className="mb-1"
                onClick={() => handleClick("0")}
              >
                <Accordion.Header>
                  <div className=" me-3">
                    <FontAwesomeIcon
                      icon="fa-solid fa-house"
                      onClick={() => setIsOpen(!isOpen)}
                    />
                  </div>
                  <p
                    className="sidebar_txt"
                    style={{ display: isSidebarOpen ? "block" : "none" }}
                    onClick={() => setSidebarOpen(true)}
                  >
                    Dashboard
                  </p>

                  {/* </button> */}
                </Accordion.Header>
                <Accordion.Body className="p-0">
                  <ul
                    className={`accordion_list list-unstyled fw-normal pb-0 small ${
                      isSidebarOpen ? "arrowshow" : "arrowHide"
                    }`}
                    style={{
                      display: isSidebarOpen ? "block" : "none",
                    }}
                  >
                    <Link
                      to="/advanceDashboard"
                      className="text-decoration-none"
                    >
                      <li className={isActive("/advanceDashboard")}>
                        <p key={2} className="insideDropdown_list" id={"2"}>
                          Advance Dashboard
                        </p>
                      </li>
                    </Link>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              {/* *********************************************************Dashboard Ends*************************************************************** */}

              {/* ************************************************************  Orders ************************************************************* */}

              <Accordion.Item
                eventKey="1"
                className="mb-1"
                onClick={() => handleClick("1")}
              >
                <Accordion.Header>
                  <div className="me-3">
                    <FontAwesomeIcon icon="fa fa-shopping-cart" />
                  </div>
                  <p
                    className="sidebar_txt"
                    style={{ display: isSidebarOpen ? "block" : "none" }}
                  >
                    Orders
                  </p>
                </Accordion.Header>
                <Accordion.Body
                  className="p-0"
                  style={{
                    display: isOpen ? "block" : "none",
                  }}
                >
                  <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                    <Link
                      to="/order-managements/orders"
                      className=" text-decoration-none  "
                    >
                      <li
                        className={
                          isOpen
                            ? headerText.includes("/order-managements/orders")
                              ? "active block"
                              : "none"
                            : "none"
                        }
                      >
                        <p
                          className="insideDropdown_list"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          Order
                        </p>
                      </li>
                    </Link>

                    <Link
                      to="/order-managements/order/return"
                      className=" text-decoration-none  "
                    >
                      <li
                        className={
                          isOpen
                            ? headerText.includes(
                                "/order-managements/order/return"
                              )
                              ? "active block"
                              : "none"
                            : "none"
                        }
                      >
                        <p
                          className="insideDropdown_list"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          Returned Order
                        </p>
                      </li>
                    </Link>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* ************************************************************  Orders End ************************************************************* */}

              {/* ************************************************************  Categories ************************************************************* */}
              {isAllow?.includes(29) ||
              isAllow?.includes(33) ||
              isAllow?.includes(37) ? (
                <Accordion.Item
                  eventKey="2"
                  className="mb-1"
                  onClick={() => handleClick("2")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon icon="fa fa-bullseye" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Categories
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      <Link
                        to="/settings/category"
                        className=" text-decoration-none  "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/category")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Category
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/sub-category"
                        className=" text-decoration-none  "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/sub-category")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Sub Category
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/child-sub-category"
                        className=" text-decoration-none  "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/child-sub-category"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Child Sub Category
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************  Categories End ************************************************************* */}

              {/* ************************************************************  Products ************************************************************* */}

              <Accordion.Item
                eventKey="3"
                className="mb-1"
                onClick={() => handleClick("3")}
              >
                <Accordion.Header>
                  <div className="me-3">
                    <FontAwesomeIcon
                      icon="fa fa-cubes"
                      // onClick={() => setIsOpen(!isOpen)}
                    />
                  </div>
                  <p
                    className="sidebar_txt"
                    style={{ display: isSidebarOpen ? "block" : "none" }}
                  >
                    Products
                  </p>
                </Accordion.Header>
                <Accordion.Body
                  className="p-0"
                  style={{
                    display: isOpen ? "block" : "none",
                  }}
                >
                  <ul
                    className="accordion_list list-unstyled fw-normal pb-0 small"
                    // style={{
                    //   display: isSidebarOpen ? "block" : "none",
                    // }}
                  >
                    <Link
                      to="product"
                      className=" text-decoration-none  "
                      // className="text-decoration-none rounded "
                    >
                      <li
                        className={
                          isOpen
                            ? headerText.includes("/product")
                              ? "active block"
                              : "none"
                            : "none"
                        }
                      >
                        <p
                          className="insideDropdown_list"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          Product
                        </p>
                      </li>
                    </Link>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* ************************************************************  Products End ************************************************************* */}

              {/* ************************************************************  Sellers ************************************************************* */}
              {isAllow?.includes(5) ||
              isAllow?.includes(6) ||
              isAllow?.includes(7) ||
              isAllow?.includes(8) ? (
                <Accordion.Item
                  eventKey="4"
                  className="mb-1"
                  onClick={() => handleClick("4")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa fa-store"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Sellers
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/employee/employee-details"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/employee/employee-details"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Seller Details
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Sellers End ************************************************************* */}
              {/* ************************************************************  Sellers ************************************************************* */}
              {isAllow?.includes(5) ||
              isAllow?.includes(6) ||
              isAllow?.includes(7) ||
              isAllow?.includes(8) ? (
                <Accordion.Item
                  eventKey="18"
                  className="mb-1"
                  onClick={() => handleClick("18")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa fa-users"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Customers
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/employee/customer-details"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/employee/customer-details"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Customers Details
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Sellers End ************************************************************* */}

              {/* ************************************************************  Customization ************************************************************* */}
              {isAllow?.includes(73) || isAllow?.includes(75) ? (
                <Accordion.Item
                  eventKey="5"
                  className="mb-1"
                  onClick={() => handleClick("5")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-sliders"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Customization
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      {/* <Link
                      to="/settings/customization/web-header"
                      className=" text-decoration-none  "
                    // className="text-decoration-none rounded "
                    >
                      <li
                        className={
                          isOpen
                            ? headerText.includes("/settings/customization/web-header")
                              ? "active block"
                              : "none"
                            : "none"
                        }
                      >
                        <p
                          className="insideDropdown_list"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          Web Header
                        </p>
                      </li>
                    </Link> */}

                      <Link
                        to="/settings/customization/app-setup"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/customization/app-setup"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            App Setup
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************  Customization End ************************************************************* */}

              {/* ************************************************************  Coupon Codes  ************************************************************* */}
              {isAllow?.includes(61) ? (
                <Accordion.Item
                  eventKey="6"
                  className="mb-1"
                  onClick={() => handleClick("6")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-ticket"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Coupon Codes
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/Coupon-codes"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/Coupon-codes")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Coupon Codes
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   Coupon Codes End ************************************************************* */}

              {/* ************************************************************  Customers ************************************************************* */}

              {/* <Accordion.Item
              eventKey="7"
              className="mb-1"
              onClick={() => handleClick("7")}
            >
              <Accordion.Header>
                <div className="me-3">
                  <FontAwesomeIcon
                    icon="fa fa-male"
                  // onClick={() => setIsOpen(!isOpen)}
                  />
                </div>
                <p
                  className="sidebar_txt"
                  style={{ display: isSidebarOpen ? "block" : "none" }}
                >
                  Customers
                </p>
              </Accordion.Header>
              <Accordion.Body
                className="p-0"
                style={{
                  display: isOpen ? "block" : "none",
                }}
              >
                <ul
                  className="accordion_list list-unstyled fw-normal pb-0 small"
                // style={{
                //   display: isSidebarOpen ? "block" : "none",
                // }}
                >
                  <Link
                    to="product"
                    className=" text-decoration-none  "
                  // className="text-decoration-none rounded "
                  >
                    <li
                      className={
                        isOpen
                          ? headerText.includes("/product")
                            ? "active block"
                            : "none"
                          : "none"
                      }
                    >
                      <p
                        className="insideDropdown_list"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        Product
                      </p>
                    </li>
                  </Link>




                </ul>
              </Accordion.Body>

            </Accordion.Item> */}

              {/* ************************************************************  Customers End ************************************************************* */}

              {/* ************************************************************  Location ************************************************************* */}
              {isAllow?.includes(9) ||
              isAllow?.includes(13) ||
              isAllow?.includes(17) ||
              isAllow?.includes(21) ? (
                <Accordion.Item
                  eventKey="8"
                  className="mb-1"
                  onClick={() => handleClick("8")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-map-location-dot"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Location
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/location/country"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/location/country"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Country
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/location/state"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/location/state")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            State
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/location/city"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/location/city")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            City
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/location/pincode"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/location/pincode"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Pincode
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************  Location End ************************************************************* */}

              {/* ************************************************************  Home Settings  ************************************************************* */}
              {isAllow?.includes(69) ? (
                <Accordion.Item
                  eventKey="9"
                  className="mb-1"
                  onClick={() => handleClick("9")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-house-laptop"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Home Settings
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/customization/home-banner"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/customization/home-banner"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Home Banner
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   Home Settings End ************************************************************* */}

              {/* ************************************************************  Blogs  ************************************************************* */}
              {isAllow?.includes(65) ? (
                <Accordion.Item
                  eventKey="10"
                  className="mb-1"
                  onClick={() => handleClick("10")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-blog"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Blogs
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/customization/blogs"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/customization/blogs"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Blogs
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   Blogs End ************************************************************* */}

              {/* ************************************************************  Brands  ************************************************************* */}
              {isAllow?.includes(49) ? (
                <Accordion.Item
                  eventKey="11"
                  className="mb-1"
                  onClick={() => handleClick("11")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-copyright"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Brands
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/brands"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/brands")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Brands
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   Brands End ************************************************************* */}

              {/* ************************************************************  Tax  ************************************************************* */}
              {isAllow?.includes(53) || isAllow?.includes(57) ? (
                <Accordion.Item
                  eventKey="12"
                  className="mb-1"
                  onClick={() => handleClick("12")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-money-check-dollar"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Tax
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/tax/tax-type"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/settings/tax/tax-type")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Tax Types
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/tax/tax-percentage"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/tax/tax-percentage"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Tax Percentage
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   Tax End ************************************************************* */}

              {/* ************************************************************  Attributes  ************************************************************* */}

              {/* <Accordion.Item
              eventKey="13"
              className="mb-1"
              onClick={() => handleClick("13")}
            >
              <Accordion.Header>
                <div className="me-3">
                  <FontAwesomeIcon
                    icon="fa-solid fa-mattress-pillow"

                  // onClick={() => setIsOpen(!isOpen)}
                  />
                </div>
                <p
                  className="sidebar_txt"
                  style={{ display: isSidebarOpen ? "block" : "none" }}
                >
                  Attributes
                </p>
              </Accordion.Header>
              <Accordion.Body
                className="p-0"
                style={{
                  display: isOpen ? "block" : "none",
                }}
              >
                <ul
                  className="accordion_list list-unstyled fw-normal pb-0 small"
                // style={{
                //   display: isSidebarOpen ? "block" : "none",
                // }}
                >
                  <Link
                    to="/settings/attributes"
                    className=" text-decoration-none  "
                  // className="text-decoration-none rounded "
                  >
                    <li
                      className={
                        isOpen
                          ? headerText.includes("/settings/attributes")
                            ? "active block"
                            : "none"
                          : "none"
                      }
                    >
                      <p
                        className="insideDropdown_list"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        Attribute
                      </p>
                    </li>
                  </Link>

                  <Link
                    to="/settings/sub-attributes"
                    className=" text-decoration-none  "
                  // className="text-decoration-none rounded "
                  >
                    <li
                      className={
                        isOpen
                          ? headerText.includes("/settings/sub-attributes")
                            ? "active block"
                            : "none"
                          : "none"
                      }
                    >
                      <p
                        className="insideDropdown_list"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        Sub Attribute
                      </p>
                    </li>
                  </Link>

                </ul>
              </Accordion.Body>

            </Accordion.Item> */}

              {/* ************************************************************   Attributes End ************************************************************* */}

              {/* ************************************************************  FAQ  ************************************************************* */}
              {isAllow?.includes(41) || isAllow?.includes(45) ? (
                <Accordion.Item
                  eventKey="14"
                  className="mb-1"
                  onClick={() => handleClick("14")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        // icon="fa-regular fa-circle-question"
                        icon="fa-solid fa-circle-question"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      FAQs
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/customization/faq-category"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/customization/faq-category"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Faq Category
                          </p>
                        </li>
                      </Link>

                      <Link
                        to="/settings/customization/faqs"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/customization/faqs"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            FAQ
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   FAQ End ************************************************************* */}

              {/* ************************************************************  Country Codes  ************************************************************* */}
              {isAllow?.includes(25) ? (
                <Accordion.Item
                  eventKey="15"
                  className="mb-1"
                  onClick={() => handleClick("15")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-globe"

                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Country Codes
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/settings/location/country-codes"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                  "/settings/location/country-codes"
                                )
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Country Codes
                          </p>
                        </li>
                      </Link>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* ************************************************************   Country Codes End ************************************************************* */}

              {/* **************************************************************************Setting************************************************************** */}
              {/* <Accordion.Item
              eventKey="1"
              className="mb-1"
              onClick={() => handleClick("1")}
            >
              <Link to={"/settingContent"} className=" text-decoration-none">
                <Accordion.Header>
                  <div className=" me-3">
                    <FontAwesomeIcon icon="fa-solid fa-gear" />
                  </div>

                  <p
                    style={{
                      display: isSidebarOpen ? "block" : "none",
                    }}
                    className="sidebar_txt"
                  >
                    Settings
                  </p>
                </Accordion.Header>
              </Link>

              
            </Accordion.Item> */}
              {/* ************************************************************  Setting Ends ************************************************************* */}
              {isAllow?.includes(1) ||
              isAllow?.includes(2) ||
              isAllow?.includes(3) ||
              isAllow?.includes(4) ||
              isAllow?.includes(5) ||
              isAllow?.includes(6) ||
              isAllow?.includes(7) ||
              isAllow?.includes(8) ? (
                <Accordion.Item
                  eventKey="16"
                  className="mb-1"
                  onClick={() => handleClick("16")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-gear"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Employee Management
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      {isAllow?.includes(1) ||
                      isAllow?.includes(2) ||
                      isAllow?.includes(3) ||
                      isAllow?.includes(4) ? (
                        <Link
                          to="/employee/role"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/employee/role")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Roles
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {/* {isAllow?.includes(5) ||
                      isAllow?.includes(6) ||
                      isAllow?.includes(7) ||
                      isAllow?.includes(8) ? (
                      <Link
                        to="/employee/employee-details"
                        className=" text-decoration-none  "
                      // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/employee/employee-details")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Employee Details
                          </p>
                        </li>
                      </Link>
                    ) : (
                      <></>
                    )} */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Three P End ************************************************************* */}

              {isAllow?.includes(91) ||
              isAllow?.includes(95) ||
              isAllow?.includes(99) ||
              isAllow?.includes(103) ? (
                <Accordion.Item
                  eventKey="17"
                  className="mb-1"
                  onClick={() => handleClick("17")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-gear"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      About Us
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/about-us/why-choose-us"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/about-us/why-choose-us")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Why Choose Us
                          </p>
                        </li>
                      </Link>
                      <Link
                        to="/about-us/happy-customers"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/about-us/happy-customers")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Happy Customers
                          </p>
                        </li>
                      </Link>
                      <Link
                        to="/about-us/our-story"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/about-us/our-story")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Our Story
                          </p>
                        </li>
                      </Link>
                      <Link
                        to="/about-us/about-banner"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/about-us/about-banner")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            About Banner
                          </p>
                        </li>
                      </Link>
                      {/* ) : (
                    <></>
                  )} */}

                      {/* {isAllow?.includes(5) ||
                  isAllow?.includes(6) ||
                  isAllow?.includes(7) ||
                  isAllow?.includes(8) ? ( */}
                      {/* <Link
                    to="/employee/employee-details"
                    className=" text-decoration-none  "
                  // className="text-decoration-none rounded "
                  >
                    <li
                      className={
                        isOpen
                          ? headerText.includes("/employee/employee-details")
                            ? "active block"
                            : "none"
                          : "none"
                      }
                    >
                      <p
                        className="insideDropdown_list"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        Employee Details
                      </p>
                    </li>
                  </Link> */}
                      {/* ) : (
                    <></>
                  )} */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {isAllow?.includes(107) ||
              isAllow?.includes(112) ||
              isAllow?.includes(117) ||
              isAllow?.includes(120) ? (
                <Accordion.Item
                  eventKey="18"
                  className="mb-1"
                  onClick={() => handleClick("18")}
                >
                  <Accordion.Header>
                    <div className="me-3">
                      <FontAwesomeIcon
                        icon="fa-solid fa-gear"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Content
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul
                      className="accordion_list list-unstyled fw-normal pb-0 small"
                      // style={{
                      //   display: isSidebarOpen ? "block" : "none",
                      // }}
                    >
                      <Link
                        to="/content/privacy"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/content/privacy")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Privacy Policy
                          </p>
                        </li>
                      </Link>
                      <Link
                        to="/content/terms"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/content/terms")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            Terms & Conditions
                          </p>
                        </li>
                      </Link>

                      {/* ) : (
                    <></>
                  )} */}

                      {/* {isAllow?.includes(5) ||
                  isAllow?.includes(6) ||
                  isAllow?.includes(7) ||
                  isAllow?.includes(8) ? ( */}
                      {/* <Link
                    to="/employee/employee-details"
                    className=" text-decoration-none  "
                  // className="text-decoration-none rounded "
                  >
                    <li
                      className={
                        isOpen
                          ? headerText.includes("/employee/employee-details")
                            ? "active block"
                            : "none"
                          : "none"
                      }
                    >
                      <p
                        className="insideDropdown_list"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        Employee Details
                      </p>
                    </li>
                  </Link> */}
                      {/* ) : (
                    <></>
                  )} */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Products End ************************************************************* */}
            </Accordion>
          </ul>
        </div>
      </section>
    </>
  );
};

export default MobileSidebar;
