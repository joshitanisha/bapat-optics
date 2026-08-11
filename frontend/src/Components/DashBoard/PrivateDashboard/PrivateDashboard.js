import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PrivateDashboard.css";
import Header from "../../Header/Header";
import Piechart from "../Piechart/Piechart";
import Barchart from "../Barchart/Barchart";
import LineChart from "../LineChart/LineChart";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas);
const PrivateDashboard = () => {
  // const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="main-privateDashboard">
      <Header />
    </div>
  );
};

export default PrivateDashboard;
