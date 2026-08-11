import React from "react";
import AdvanceDashboard from "./AdvanceDashboard/AdvanceDashboard2";
import PrivateDashboard from "./PrivateDashboard/PrivateDashboard";
import Order from "./Order/Order";
import Piechart from "./Piechart/Piechart";
import Barchart from "./Barchart/Barchart";
import LineChart from "./LineChart/LineChart";

const Dashboard = () => {
  return (
    <>
      <PrivateDashboard />
      <AdvanceDashboard />
      {/* <Order />
      <Piechart />
      <Barchart />
      <LineChart /> */}
    </>
  );
};

export default Dashboard;
