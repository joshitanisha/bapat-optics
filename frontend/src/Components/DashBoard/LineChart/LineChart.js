import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'November',
        uv: 0,
        pv: 1,
        amt: 20,
      },
      {
        name: 'December',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'January',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'February',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'March',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'April',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'May',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'June',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'July',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'August',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'September',
        uv: 0,
        pv: 0,
        amt: 20,
      },
      {
        name: 'October',
        uv: 0,
        pv: 0,
        amt: 20,
      },
    ];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/vertical-line-chart-lvvp9';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          layout="vertical"
          width={500}
          height={200}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Line dataKey="pv" stroke="#8884d8" />
          <Line dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}