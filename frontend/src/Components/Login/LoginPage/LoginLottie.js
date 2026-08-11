import React from "react";
import Lottie from "lottie-react";
import * as animationData from "./Animation/LoginLottie.json";
import "../../Login/LoginPage/Animation/LoginLottie.css";

const LoginLottie = ({appSetup,IMG_URL}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <section className="main-lottey">
        <div className="success mx-auto ">
          <div className="">
            <img
              src={IMG_URL + appSetup?.logo}
              className="logoimgg"
            />
          </div>
        </div>
      </section>
      {/* <section className="main-lottey">
        <div className="success mx-auto">
          <Lottie options={defaultOptions} />
        </div>
      </section> */}
    </>
  );
};

export default LoginLottie;
