import React from "react";
import LoginPage from "./LoginPage/LoginPage.js";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../utils/context.js";

const Login = () => {
  const { signin, usertype } = useContext(Context);
  const navigate = useNavigate();

  if (signin) {
    if (usertype === "demo") {
      navigate("/demo");
    } else if (usertype?.length) {
      navigate("/advanceDashboard");
    } else {
      return <LoginPage />;
    }
  } else {
    return <LoginPage />;
  }

  // return (
  //   <div>
  //     {signin ? (
  //       usertype === "admin" ? (
  //         navigate("/advanceDashboard")
  //       ) : (
  //         <LoginPage />
  //       )
  //     ) : (
  //       <LoginPage />
  //     )}
  //   </div>
  // );
};

export default Login;
