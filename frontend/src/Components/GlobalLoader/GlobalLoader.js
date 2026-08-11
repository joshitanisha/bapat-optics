import React, { useContext } from "react";
import { Context } from "../../utils/context";

const GlobalLoader = () => {
  const { globalLoader } = useContext(Context);

  if (!globalLoader) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-box">
        <div className="spinner-border text-light" role="status" />
        <p className="loader-text">Please wait...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
