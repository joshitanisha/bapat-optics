import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard_LineChart = ({ chartData }) => {

  // const btbData = chartData;
  // // const btcData = pieData?.data?.BTC || {};

  // const btbOrders = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
  //   (day) => btbData[day] || 0
  // );
  // // const btcOrders = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
  // //   (day) => btcData[day] || 0
  // // );

  const data = {
    labels: chartData?.map((i) => i?.date),
    datasets: [
      {
        label: 'Orders',
        data: chartData?.map((i) => i?.order_count),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
      // {
      //   label: 'BTC',
      //   data: btcOrders,
      //   borderColor: 'green',
      //   backgroundColor: 'rgba(0, 255, 0, 0.2)',
      //   fill: true,
      //   tension: 0.4,
      // },
    ],
  };


  const maxValue = Math.max(
    // ...btbOrders,
    // ...btcOrders
  );


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates', // X-axis label
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          max: Math.ceil(maxValue), // Adjust Y-axis max value
        },
        title: {
          display: true,
          text: 'Order Count', // Y-axis label
        },
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Dashboard_LineChart;
