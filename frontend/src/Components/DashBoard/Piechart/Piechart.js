import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Task", "Hours per Day"],
  ["Marketing", 2],
  ["Sales", 4],
  ["Human Resources", 0],
  ["Public relations", 4],
  ["Research", 2],
  ["Finance", 2],
];

export const options = {};

function Piechart() {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}
export default Piechart;
