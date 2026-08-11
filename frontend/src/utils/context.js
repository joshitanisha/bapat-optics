import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  getData,
  postData,
  getEditData,
  editData,
  editStatusData,
  deleteData,
  getDownloadDataExcel,
  getDimension,
} from "./api";

import {
  Per_Page_Dropdown,
  Select2Data,
  Select2DataColor,
  SelectImageData,
  RequiredIs,
} from "./common";

export const Context = createContext();
var HtmlToReactParser = require("html-to-react").Parser;
var htmlToReactParser = new HtmlToReactParser();

const AppContext = ({ children }) => {
  // const IMG_URL = "http://127.0.0.1:8989";
  // const IMG_URL = "http://192.168.16.39:8989";
  // const IMG_URL = "https://bapatoptics.node.profcyma.org:8989";

  const IMG_URL = "https://api-bapatoptics.eforumsystems.com";
  // const IMG_URL = "http://localhost:8989";
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  const navigate = useNavigate();

  const [signin, setSignin] = useState(false);
  // const [language, setLanguage] = useState(1);
  const [usertype, setUsertype] = useState("");
  const [userdata, setUserData] = useState({});
  const [isAllow, setisAllow] = useState([]);
  const minLength = 2;
  const maxLength = 30;

  useEffect(() => {
    isTokenValid();
  }, [signin]);

  const getuserData = async (id) => {
    const response = await getData(`/common/auth/admin-login`);
    await setUserData(response?.data?.data);
    await setisAllow(response?.data?.permissions);
  };

  const [user, setUser] = useState({});
  const GetUser = async () => {
    const response = await getData(`/common/auth/usersingleget`);
    if (response?.success) {
      await setUser(response?.data);
    }
  };
  // useEffect(() => {
  //   GetUser();
  // }, []);

  const isTokenValid = async () => {
    const token = Cookies.get("bapat_optics_admin_security");

    if (token) {
      // Decode the token to get the expiration time
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if the token has expired
      if (decodedToken.exp < currentTime) {
        Cookies.remove("bapat_optics_admin_security", { path: "/" });
        setSignin(false);
        setUsertype("");
        setisAllow([]);
        navigate("/");
      } else {
        setSignin(true);
        setisAllow(decodedToken?.permissions);
       // getuserData(decodedToken.user);
        setUsertype(decodedToken.rolename);
        if (isLoginPage) {
          navigate("/advanceDashboard");
        }
      }
    } else {
      setSignin(false);
      setUsertype("");
      setisAllow([]);
      navigate("/");
    }
  };

  // const isTokenValid = async () => {s
  //   const token = Cookies.get("bapat_optics_admin_security");

  //   if (token) {
  //     const decodedToken = JSON.parse(atob(token.split(".")[1]));
  //     const currentTime = Date.now() / 1000;

  //     if (decodedToken.exp < currentTime) {
  //       Cookies.remove("bapat_optics_admin_security", { path: "/" });
  //       navigate("/Components/DashBoard/DashBoard");
  //     } else {
  //    //   getuserData(decodedToken.user);
  //       setUsertype(decodedToken.role);
  //       setSignin(true);
  //     }
  //   } else {
  //     navigate("/Components/DashBoard/DashBoard");
  //   }
  // };

  const ErrorNotify = (name) => {
    toast.error(`${name} deleted successfully.`, {
      position: "top-right",
      autoClose: 100,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { background: "red", color: "white" },
    });
  };

  // Togle
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarFalse = () => {
    setSidebarOpen(false);
  };
  const [globalLoader, setGlobalLoader] = useState(false);

  return (
    <Context.Provider
      value={{
        IMG_URL,
        getData,
        postData,
        // getEditData,
        // editData,
        editStatusData,
        deleteData,
        minLength,
        maxLength,
        signin,
        setSignin,
        usertype,
        setUsertype,
        userdata,
        setUserData,
        getDownloadDataExcel,
        ErrorNotify,
        // token,
        // setToken,
        toggleSidebar,
        toggleSidebarFalse,
        isSidebarOpen,
        setSidebarOpen,
        Select2Data,
        Select2DataColor,
        SelectImageData,
        Per_Page_Dropdown,
        RequiredIs,
        getDimension,
        isAllow,
        user,
        htmlToReactParser,
        globalLoader,
        setGlobalLoader,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppContext;
