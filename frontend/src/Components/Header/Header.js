import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBan,
  faRotateLeft,
  fas,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../../utils/context";
import { useNavigate } from "react-router";

import Cookies from "js-cookie";
import { Button, InputGroup, Offcanvas } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import MobileSidebar from "../Sidebar/MobileSidebar";
import ViewOffCanvance from "../myProfile/ViewOffCanvance";
import Logoutmodal from "../common/Logoutmodal/Logoutmodal";
import { Link } from "react-router-dom";
import { RoleId } from "../../utils/common";
import RangeModel from "../common/RangeModel";
import Sidebar from "../Sidebar/Sidebar";
import { FaTimes } from "react-icons/fa";
import PasswordChange from "../common/password_change/PasswordChange";
library.add(fas);
// ({ title, link })
function Header({ title, props }) {
  const {
    setUserData,
    setUsertype,
    setSignin,
    usertype,
    isSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    toggleSidebarFalse,
    getData,
    IMG_URL,
  } = useContext(Context);

  const navigate = useNavigate();

  const LogOut = async () => {
    Cookies.remove("bapat_optics_admin_security", { path: "/" });
    await setUserData("");
    await setUsertype("");
    await setSignin(false);
    navigate("/");
  };

  const [user, setUser] = useState({});
  const [store, setStore] = useState({});
  const GetUserData = async () => {
    const response = await getData(`/common/auth/usersingleget`);
    if (response?.success) {
      setUser(response?.data);
      if (response?.data?.role_id === RoleId.Vendor) {
        const res = await getData(`/admin/store/my-store`);
        await setStore(res?.data);
      }
    }
  };
  useEffect(() => {
    GetUserData();
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [view, setView] = useState(false);
  const [viewRangeModel, setViewRangeModel] = useState(false);
  const handleViewClose = () => setView(false);
  const handleViewshow = async () => {
    await setView(true);
  };

  const [modalshow, setmodalshow] = useState(false);

  const handleGoToDashboard = async () => {
    navigate("/advanceDashboard");
  };

  const handleAddOrder = async () => {
    navigate("/orders/order");
  };

  const handleAddCancelOrder = async () => {
    navigate("/orders/cancel-order");
  };

  const handleAddReturnOrder = async () => {
    navigate("/orders/return-order");
  };

  const [password, setPassword] = useState(false);
  const handleshow = async () => {
    await setPassword(true);
  };
  return (
    <>
      <section className="header">
        <Navbar expand="md" className="bg-body-tertiary">
          <Navbar.Brand>
            <div className="header-text">
              <div className="desktop-bar-btnnn">
                <div
                  className="bars d-flex align-items-center"
                  onClick={toggleSidebar}
                >
                  <FaBars />
                  <h1>{title}</h1>
                </div>
              </div>
              {user?.role_id === RoleId.Vendor && (
                <Button
                  variant="success"
                  onClick={() => setViewRangeModel(true)}
                >
                  Delivery Range : - {store?.delivery_range} KM
                </Button>
              )}
              <div className="mobile-view-bar">
                <div className="bars" onClick={handleShow}>
                  <FaBars />
                  <h1>{title}</h1>
                </div>
                <Offcanvas
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  style={{ width: "80%" }}
                  className="mobile_offcanvas_sidebar"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="mobdshhide">
                      DashBoard
                    </Offcanvas.Title>
                    <Link to="/advanceDashboard">
                      <img
                        className="moblogefwfgj"
                        src={process.env.PUBLIC_URL + "/assets/images/logo.png"}
                      />
                    </Link>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    {/* <MobileSidebar /> */}
                    <Sidebar />
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <div className="header-icons">

               <button
                  className="btn btn-dark"
                  onClick={() => handleGoToDashboard()}
                >
                  {/* <FaShoppingCart className="me-2" /> */}
                  Go To Dashboard
                </button>


                <button
                  className="btn btn-dark"
                  onClick={() => handleAddOrder()}
                >
                  <FaShoppingCart className="me-2" />
                  Order
                </button>

                <button
                  className="btn btn-dark"
                  onClick={() => handleAddCancelOrder()}
                >
                  <FontAwesomeIcon icon={faBan} className="me-2 text-danger" />
                  Cancel Order
                </button>

                <button
                  className="btn btn-dark"
                  onClick={() => handleAddReturnOrder()}
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="me-2 " />
                  Return Order
                </button>

                <button className="btn btn-dark" onClick={handleshow}>
                  <FontAwesomeIcon
                    icon="fa-solid fa-shield-halved"
                    className="power-icon icon  me-3"
                  />
                  Password Change
                </button>

                <div className="icon dropdown" data-name="Logout">
                  <div
                    className="text-center dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-power-off"
                      className="power-icon"
                    />
                  </div>

                  <ul className="dropdown-menu">
                    <div className="blue-bg">
                      <div className="text-center">
                        <FontAwesomeIcon className="floguser" icon={faUser} />
                      </div>

                      <div
                        className="icon dropdown"
                        style={{ textAlign: "center" }}
                      >
                        <p className="mb-0 logout_content_sec">
                          {user?.first_name}
                        </p>
                        <p className="logout_content_secccc">{user?.type}</p>
                      </div>
                    </div>

                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => setmodalshow(true)}
                      >
                        <button className="logout-btnnn"> Log out</button>
                      </a>
                    </li>
                  </ul>
                </div>

                <p className="mb-0 logout_content">{user?.name}</p>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Logoutmodal
          show={modalshow}
          onHide={() => setmodalshow(false)}
          LogOut={LogOut}
        />
      </section>
      {view ? (
        <ViewOffCanvance
          handleClose={handleViewClose}
          setShow={setView}
          show={view}
          user_id={user?.id}
        />
      ) : (
        ""
      )}

      {viewRangeModel ? (
        <RangeModel
          handleClose={() => {
            setViewRangeModel(false);
            GetUserData();
          }}
          setShow={setViewRangeModel}
          show={viewRangeModel}
          user_id={user?.id}
          store={store}
        />
      ) : (
        ""
      )}

      {password ? (
        <PasswordChange
          handleClose={handleClose}
          setShow={setPassword}
          show={password}
          user_id={user?.id}
          onHide={() => setPassword(false)}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Header;
