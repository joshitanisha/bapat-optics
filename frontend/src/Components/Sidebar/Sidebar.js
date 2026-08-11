import React, { useState, handlelick, active, useContext } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAddressBook,
  faAddressCard,
  faArrowTrendUp,
  faBarsStaggered,
  faBullseye,
  faCalendarCheck,
  fas,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Context } from "../../utils/context";
import { faAffiliatetheme } from "@fortawesome/free-brands-svg-icons";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import { IDS, RoleId } from "../../utils/common";
import { getData } from "../../utils/api";

library.add(fas);

const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen, isAllow, IMG_URL } =
    useContext(Context);
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

  const [show, setShow] = useState(false);

  const [user, setUser] = useState({});
  const [alerts, setAlert] = useState({});

  const GetUser = async () => {
    const response = await getData(`/common/auth/usersingleget`);
    if (response?.success) {
      setUser(response?.data);
    }
  };

  const GetAlerts = async () => {
    const response = await getData(`/admin/alerts/alert-data`);
    if (response?.success) {
      setAlert(response?.data);
    }
  };

  useEffect(() => {
    GetUser();
    GetAlerts();
  }, []);

  const [appSetup, setAppSetup] = useState({});
  const GetAppSetup = async () => {
    const response = await getData(`/common/masters/app-setup`);
    if (response?.success) {
      setAppSetup(response?.data);
    }
  };

  useEffect(() => {
    GetAppSetup();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="desktop-view-sidebar">
        <section className="sidebar">
          <div className="top_section">
            <Link to="/advanceDashboard">
              <img
                className="logo ms-2"
                src={process.env.PUBLIC_URL + "/favicon.png"}
                // src={IMG_URL + appSetup?.logo}
              />
            </Link>
            {/* <h1>Net Purti</h1> */}
          </div>
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
                  <div className="">
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
                    Home
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

                    {user && user?.role_id === RoleId.Vendor && (
                      <Link
                        to="/profile"
                        className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes("/profile")
                                ? "active block"
                                : "none"
                              : "none"
                          }
                        >
                          <p
                            className="insideDropdown_list"
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            My Store
                          </p>
                        </li>
                      </Link>
                    )}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* *********************************************************Dashboard Ends*************************************************************** */}

              {/* ************************************************************  Products ************************************************************* */}

              {user?.role_id === RoleId.Admin ||
              (user?.Store_Detail?.s_category_id !== 1 &&
                (isAllow?.includes(IDS.Product.List) ||
                  // isAllow?.includes(IDS.ProductCategory.List) ||
                  // isAllow?.includes(IDS.ProductSubCategory.List) ||
                  isAllow?.includes(IDS.RatingReview.List) ||
                  isAllow?.includes(IDS.Farmer.List) ||
                  isAllow?.includes(IDS.Shape.List) ||
                  isAllow?.includes(IDS.Material.List) ||
                  isAllow?.includes(IDS.Colour.List) ||
                  isAllow?.includes(IDS.Offer.List) ||
                  isAllow?.includes(IDS.Face_Width.List))) ? (
                // isAllow?.includes(IDS.Farmer_Detail.List)
                <Accordion.Item
                  eventKey="7"
                  className="mb-1"
                  onClick={() => handleClick("7")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon="fa fa-cubes" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Product Management
                      {alerts?.pending_products > 0 && (
                        <span className="">
                          <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className="blinking-alert"
                            style={{ color: "red", marginLeft: "8px" }}
                          />
                        </span>
                      )}
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{ display: isOpen ? "block" : "none" }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.ProductCategory.List) && (
                        <Link
                          to="/product/category"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/category")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Product Category
                            </p>
                          </li>
                        </Link>
                      )}

                      {isAllow?.includes(IDS.ProductCategory.List) && (
                        <Link
                          to="/product/addon"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/addon")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Product Add Ons
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.LensType.List) && (
                        <Link to="/lens/type" className="text-decoration-none">
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/lens/type")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Lens Types
                            </p>
                          </li>
                        </Link>
                      )}

                      {isAllow?.includes(IDS.LensCategory.List) && (
                        <Link
                          to="/lens/category"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/lens/category")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Lens Category
                            </p>
                          </li>
                        </Link>
                      )}
                      {/* {isAllow?.includes(IDS.ProductSubCategory.List) && (
                        <Link
                          to="/product/sub-category"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/sub-category")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Product Sub Category
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.ProductChildCategory.List) && (
                        <Link
                          to="/product/child-category"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/child-category")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Product Child Category
                            </p>
                          </li>
                        </Link>
                      )} */}

                      {isAllow?.includes(IDS.Shape.List) && (
                        <Link
                          to="/product/shapes"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/shapes")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Shape
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.Material.List) && (
                        <Link
                          to="/product/material"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/material")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Material
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.Colour.List) && (
                        <Link
                          to="/product/colour"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/colour")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Colour
                            </p>
                          </li>
                        </Link>
                      )}

                      {isAllow?.includes(IDS.Face_Width.List) && (
                        <Link
                          to="/product/facewidth"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/facewidth")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Face Width
                            </p>
                          </li>
                        </Link>
                      )}

                      {isAllow?.includes(IDS.Face_Width.List) && (
                        <Link
                          to="/product/coating"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/coating")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Coating
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.Product.List) && (
                        <Link to="/products" className="text-decoration-none">
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/products")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Products
                              {alerts?.pending_products > 0 && (
                                <span className="blinking-alert-count">
                                  {alerts?.pending_products}
                                </span>
                              )}
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.RatingReview.List) && (
                        <Link
                          to="/product/rating-reviews"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/rating-reviews")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Rating & Reviews
                            </p>
                          </li>
                        </Link>
                      )}

                      {isAllow?.includes(IDS.OfferedProduct.List) && (
                        <Link
                          to="/product/product-stock"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/product-stock")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Products Stock
                            </p>
                          </li>
                        </Link>
                      )}

                        {isAllow?.includes(IDS.OfferedProduct.List) && (
                        <Link
                          to="/product/barcode"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/barcode")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Barcode Download
                            </p>
                          </li>
                        </Link>
                      )}

                      {/* {isAllow?.includes(IDS.OfferedProduct.List) && (
                        <Link
                          to="/product/search-history"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/search-history")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Search History
                            </p>
                          </li>
                        </Link>
                      )} */}

                      {/* {isAllow?.includes(IDS.Farmer.List) && (
                        <Link
                          to="/masters/farmer"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/masters/farmer")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Farmer
                            </p>
                          </li>
                        </Link>
                      )} */}

                      {/* {isAllow?.includes(IDS.Farmer_Detail.List) && (
                        <Link
                          to="/masters/farmerdetail"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/masters/farmerdetail")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Farmer Details
                            </p>
                          </li>
                        </Link>
                      )} */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : null}

              {/* ************************************************************  Products End ************************************************************* */}

              {/* ************************************************************  Orders ************************************************************* */}

              {isAllow?.includes(IDS.Order.List) ? (
                <Accordion.Item
                  eventKey="6"
                  className="mb-1"
                  onClick={() => handleClick("6")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon="fa fa-shopping-cart" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Order Management
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {/* {isAllow?.includes(IDS.Order.List) ? (
                        <Link
                          to="/orders/all-orders"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/orders/all-orders")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Orders
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )} */}

                      {isAllow?.includes(IDS.Order.List) ? (
                        <Link
                          to="/orders/all-orders"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/orders/all-orders")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              All Orders
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Subscriptions End ************************************************************* */}
              {isAllow?.includes(IDS.Purchase_Order.List) ||
              isAllow?.includes(IDS.RejectReasons.List) ||
              isAllow?.includes(IDS.Supplier.List) ? (
                <Accordion.Item
                  eventKey="20"
                  className="mb-1"
                  onClick={() => handleClick("20")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa-solid fa-calendar-check"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Purchase Product
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
                      {isAllow?.includes(IDS.Supplier.List) ? (
                        <Link
                          to="/purchase-product/supplier"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/purchase-product/supplier",
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
                              Supplier
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.Purchase_Order.List) ? (
                        <Link
                          to="/purchase-product/purchase-product"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/purchase-product/purchase-product",
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
                              Purchase Order
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.Receiving_Order.List) ? (
                        <Link
                          to="/purchase-product/receiving-order"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/purchase-product/receiving-order",
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
                              Receiving Order
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.Receiving_Order.List) ? (
                        <Link
                          to="/purchase-product/supplier-return"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/purchase-product/supplier-return",
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
                              Supplier Return
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************   Masters Start ************************************************************* */}

              {isAllow?.includes(IDS.Brand.List) ||
              isAllow?.includes(IDS.Unit.List) ||
              isAllow?.includes(IDS.PaymentType.List) ||
              isAllow?.includes(IDS.Crop.List) ||
              isAllow?.includes(IDS.Collection_Center.List) ||
              isAllow?.includes(IDS.Review_Reason.List) ? (
                <Accordion.Item
                  eventKey="3"
                  className="mb-1"
                  onClick={() => handleClick("3")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon={faBarsStaggered}
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Masters
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
                      {/* {isAllow?.includes(IDS.CountryCode.List) ? (
                        <Link
                          to="/master/country-code"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/master/country-code")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Country Code
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )} */}
                      {isAllow?.includes(IDS.Brand.List) ? (
                        <Link
                          to="/masters/brands"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/masters/brands")
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
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.Brand.List) ? (
                        <Link
                          to="/master/header-news"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/master/header-news")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Header News
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.GalleryImage.List) ? (
                        <Link
                          to="/master/appointment-reason"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/master/appointment-reason",
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
                              Appointment Reasons
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.GalleryImage.List) ? (
                        <Link
                          to="/masters/gender"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/masters/gender")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Gender
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.GalleryImage.List) ? (
                        <Link
                          to="/master/prescription"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/master/prescription")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Prescription Master
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Masters End ************************************************************* */}

              {/* ************************************************************   Settings Start ************************************************************* */}

              {isAllow?.includes(IDS.HomeBanner.List) ? (
                <Accordion.Item
                  eventKey="4"
                  className="mb-1"
                  onClick={() => handleClick("4")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa-solid fa-gear"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Settings
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
                      {isAllow?.includes(IDS.AppSetup.List) ? (
                        <Link
                          to="/settings/app-setup"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/app-setup")
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
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.SocialLink.List) ? (
                        <Link
                          to="/settings/social-links"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/social-links")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Social Links
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.HomeBanner.List) ? (
                        <Link
                          to="/settings/home-banner"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/home-banner")
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
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.HomeBanner.List) ? (
                        <Link
                          to="/setting/trending-product"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/setting/trending-product",
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
                              Trending Product
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.HomeBanner.List) ? (
                        <Link
                          to="/setting/all-banner"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/setting/all-banner")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              All Banner
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {/* {isAllow?.includes(IDS.HomeBanner.List) ? (
                        <Link
                          to="/settings/store-banner"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/store-banner")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Store Banner
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )} */}

                      {/* {isAllow?.includes(IDS.HomeBanner.List) ? (
                        <Link
                          to="/settings/add-banner"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/add-banner")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Advertisement Banner
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )} */}

                      {/* {isAllow?.includes(IDS.FaqCategory.List) ? (
                        <Link
                          to="/settings/faq-categories"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/faq-categories"
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
                              FAQ Category
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )} */}

                      {isAllow?.includes(IDS.Faq.List) ? (
                        <Link
                          to="/settings/faqs"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/faqs")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              FAQs
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.TermsAndCondition.List) ? (
                        <Link
                          to="/settings/terms-and-condition"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/terms-and-condition",
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
                              Terms And Condition
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.PrivacyPolicy.List) ? (
                        <Link
                          to="/settings/privacy-policy"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/privacy-policy",
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
                              Privacy Policy
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.Refund_Policy.List) ? (
                        <Link
                          to="/settings/refund-policy"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/refund-policy")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Refund Policy
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.PrivacyPolicy.List) ? (
                        <Link
                          to="/settings/shipping-policy"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/shipping-policy",
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
                              Shipping Policy
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Settings End ************************************************************* */}

              {/* *****************************************************   User Managements ********************************************************** */}

              {/* {isAllow?.includes(IDS.Role.List) ||
              isAllow?.includes(IDS.User.List) ? (
                <Accordion.Item
                  eventKey="1"
                  className="mb-1"
                  onClick={() => handleClick("1")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa-solid fa-sliders"
                      // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      User Managements
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
                      {isAllow?.includes(IDS.Role.List) ||
                        isAllow?.includes(IDS.Role.Add) ||
                        isAllow?.includes(IDS.Role.Edit) ||
                        isAllow?.includes(IDS.Role.Delete) ? (
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
                              User Roles
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.User.List) ? (
                        <Link
                          to="/employee/employee-detail"
                          className=" text-decoration-none  "
                        // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                  "/employee/employee-detail"
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
                              Users
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )} */}

              {/* **************************************************   Employee Management Ends   ******************************************************* */}

              {/* ************************************************************  Customers ************************************************************* */}
              {isAllow?.includes(IDS.Customer.List) ||
              isAllow?.includes(IDS?.ContectUs?.List) ? (
                <Accordion.Item
                  eventKey="9"
                  className="mb-1"
                  onClick={() => handleClick("9")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa fa-users"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Customer Management
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
                      {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/customers"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/customers")
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
                      ) : (
                        <></>
                      )}

                      {/* <Link
                        to="/employee/contact-us/:id"
                        className=" text-decoration-none  "
                      // className="text-decoration-none rounded "
                      >
                        <li
                          className={
                            isOpen
                              ? headerText.includes(
                                "/employee/contact-us/:id"
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
                            Contact Us
                          </p>
                        </li>
                      </Link> */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {isAllow?.includes(IDS.Customer.List) ||
              isAllow?.includes(IDS?.ContectUs?.List) ? (
                <Accordion.Item
                  eventKey="201"
                  className="mb-1"
                  onClick={() => handleClick("201")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa fa-users"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Notification
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
                      {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/master/notification"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/master/notification")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Notification
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                        {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/master/admin-notification"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/master/admin-notification")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Admin Notification
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {isAllow?.includes(IDS.Offer.List) ||
              isAllow?.includes(IDS?.Offered_Product?.List) ? (
                <Accordion.Item
                  eventKey="202"
                  className="mb-1"
                  onClick={() => handleClick("202")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon={faArrowTrendUp}
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Bapat Benefits
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
                      {isAllow?.includes(IDS.Offer.List) && (
                        <Link
                          to="/product/offer"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/product/offer")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Offer
                            </p>
                          </li>
                        </Link>
                      )}
                      {isAllow?.includes(IDS.OfferedProduct.List) && (
                        <Link
                          to="/product/offered-products"
                          className="text-decoration-none"
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/product/offered-products",
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
                              Offered Products
                            </p>
                          </li>
                        </Link>
                      )}
                      {/* {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/bapatbenefit/benefits"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/bapatbenefit/benefits")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Benefits
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

              {isAllow?.includes(IDS.Customer.List) ||
              isAllow?.includes(IDS?.Eyeq?.List) ? (
                <Accordion.Item
                  eventKey="203"
                  className="mb-1"
                  onClick={() => handleClick("203")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon={faBullseye}
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Bapat Eyeq
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
                      {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/bapateyeq/eyeq"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/bapateyeq/eyeq")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Eyeq
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Delivery Boy ************************************************************* */}
              {/* {isAllow?.includes(IDS.Customer.List) ||
              isAllow?.includes(IDS?.ContectUs?.List) ? (
                <Accordion.Item
                  eventKey="59"
                  className="mb-1"
                  onClick={() => handleClick("59")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa fa-users"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Delivery Boy Management
                      {alerts?.pending_delivery_boys > 0 && (
                        <span className="">
                          <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className="blinking-alert"
                            style={{ color: "red", marginLeft: "8px" }}
                          />
                        </span>
                      )}
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
                      {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/delivery-boy"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/delivery-boy")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Delivery Boy
                              {alerts?.pending_delivery_boys > 0 && (
                                <span className="blinking-alert-count">
                                  {alerts?.pending_delivery_boys}
                                </span>
                              )}
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.Customer.List) ? (
                        <Link
                          to="/delivery-boy/rating"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/delivery-boy/rating")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Delivery Boy Rating
                            
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )} */}

              {/* ************************************************************  Delivery Boy End ************************************************************* */}

              {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="46"
                  className="mb-1"
                  onClick={() => handleClick("46")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon="fa-solid fa-ticket" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Coupons
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link
                          to="/coupons/coupon"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/coupons/coupon")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Coupon
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}
              {/* 
              {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="47"
                  className="mb-1"
                  onClick={() => handleClick("47")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon="fa-solid fa-ticket" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Miscellaneous Data
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link
                          to="/miscellaneous/reason"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/miscellaneous/reason")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Responsible Person
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link
                          to="/miscellaneous/data"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/miscellaneous/data")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Miscellaneous Data
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )} */}

              {isAllow?.includes(IDS.Wallet.List) ? (
                <Accordion.Item
                  eventKey="16"
                  className="mb-1"
                  onClick={() => handleClick("16")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon
                        icon="fa-solid fa-wallet"
                        // onClick={() => setIsOpen(!isOpen)}
                      />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Wallet
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
                      {isAllow?.includes(IDS.Wallet.List) ? (
                        <Link
                          to="/my-wallet"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/my-wallet")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Wallet
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  my-wallet End ************************************************************* */}

              {/* ************************************************************  Location ************************************************************* */}
              {isAllow?.includes(IDS.Country.List) ||
              isAllow?.includes(IDS.State.List) ||
              isAllow?.includes(IDS.City.List) ||
              isAllow?.includes(IDS.Pincode.List) ||
              isAllow?.includes(IDS.Area.List) ? (
                <Accordion.Item
                  eventKey="10"
                  className="mb-1"
                  onClick={() => handleClick("10")}
                >
                  <Accordion.Header>
                    <div className="">
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
                      {isAllow?.includes(IDS.Country.List) ||
                      isAllow?.includes(IDS.Country.Add) ||
                      isAllow?.includes(IDS.Country.Edit) ||
                      isAllow?.includes(IDS.Country.Delete) ? (
                        <Link
                          to="/settings/location/country"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/location/country",
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
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.State.List) ||
                      isAllow?.includes(IDS.State.Add) ||
                      isAllow?.includes(IDS.State.Edit) ||
                      isAllow?.includes(IDS.State.Delete) ? (
                        <Link
                          to="/settings/location/state"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/location/state",
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
                              State
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.City.List) ||
                      isAllow?.includes(IDS.City.Add) ||
                      isAllow?.includes(IDS.City.Edit) ||
                      isAllow?.includes(IDS.City.Delete) ? (
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
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.Pincode.List) ||
                      isAllow?.includes(IDS.Pincode.Add) ||
                      isAllow?.includes(IDS.Pincode.Edit) ||
                      isAllow?.includes(IDS.Pincode.Delete) ? (
                        <Link
                          to="/settings/location/pincode"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/settings/location/pincode",
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
                      ) : (
                        <></>
                      )}

                      {/* {isAllow?.includes(IDS.Area.List) ||
                      isAllow?.includes(IDS.Area.Add) ||
                      isAllow?.includes(IDS.Area.Edit) ||
                      isAllow?.includes(IDS.Area.Delete) ? (
                        <Link
                          to="/settings/location/area"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/location/area")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Area
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
              {/* ************************************************************  Location End ************************************************************* */}

              {/* ************************************************************  contact_us start ************************************************************* */}

              {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="08"
                  className="mb-1"
                  onClick={() => handleClick("08")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon={faAddressBook} />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Contact Us
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link
                          to="/masters/contact_us"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/masters/contact_us")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Contact Us
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="44"
                  className="mb-1"
                  onClick={() => handleClick("44")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon="fa-solid fa-ticket" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      About As
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.AboutUs.List) ? (
                        <Link
                          to="/settings/about-us"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/settings/about-us")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              About Us
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.AboutUs.List) ? (
                        <Link
                          to="/about-us/our-mission"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/about-us/our-mission")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Our Mission Vision
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}

                      {isAllow?.includes(IDS.AboutUs.List) ? (
                        <Link
                          to="/about-us/our-team"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/about-us/our-team")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Our Team
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )} */}

              {/* ************************************************************  Contact_us End ************************************************************* */}

              {/* ************************************************************  Career start ************************************************************* */}

              {/* {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="80"
                  className="mb-1"
                  onClick={() => handleClick("80")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon="fa-solid fa-ticket" />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Career
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link to="/career" className=" text-decoration-none  ">
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/career")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Career Form
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.City.List) ||
                      isAllow?.includes(IDS.City.Add) ||
                      isAllow?.includes(IDS.City.Edit) ||
                      isAllow?.includes(IDS.City.Delete) ? (
                        <Link
                          to="/career/qualification"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/career/qualification")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Qualification
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                      {isAllow?.includes(IDS.City.List) ||
                      isAllow?.includes(IDS.City.Add) ||
                      isAllow?.includes(IDS.City.Edit) ||
                      isAllow?.includes(IDS.City.Delete) ? (
                        <Link
                          to="/career/career-application"
                          className=" text-decoration-none  "
                          // className="text-decoration-none rounded "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes(
                                    "/career/career-application"
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
                              Career Applications
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )} */}

              {/* ************************************************************  Career end ************************************************************* */}
              {/* ************************************************************  Appointment Form start ************************************************************* */}

              {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="81"
                  className="mb-1"
                  onClick={() => handleClick("81")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon={faCalendarCheck} />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Appointment Form
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link
                          to="/appointment-form"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/appointment-form")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Appointments
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {isAllow?.includes(IDS.Coupon.List) ? (
                <Accordion.Item
                  eventKey="82"
                  className="mb-1"
                  onClick={() => handleClick("81")}
                >
                  <Accordion.Header>
                    <div className="">
                      <FontAwesomeIcon icon={faAddressCard} />
                    </div>
                    <p
                      className="sidebar_txt"
                      style={{ display: isSidebarOpen ? "block" : "none" }}
                    >
                      Subscriber Form{" "}
                    </p>
                  </Accordion.Header>
                  <Accordion.Body
                    className="p-0"
                    style={{
                      display: isOpen ? "block" : "none",
                    }}
                  >
                    <ul className="accordion_list list-unstyled fw-normal pb-0 small">
                      {isAllow?.includes(IDS.Coupon.List) ? (
                        <Link
                          to="/subscriber-form"
                          className=" text-decoration-none  "
                        >
                          <li
                            className={
                              isOpen
                                ? headerText.includes("/subscriber-form")
                                  ? "active block"
                                  : "none"
                                : "none"
                            }
                          >
                            <p
                              className="insideDropdown_list"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Subscribers
                            </p>
                          </li>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ) : (
                <></>
              )}

              {/* ************************************************************  Appointment Form  End ************************************************************* */}
            </Accordion>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Sidebar;
