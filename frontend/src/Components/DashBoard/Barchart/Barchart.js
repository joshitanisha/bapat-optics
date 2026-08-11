import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'November',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'December',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'January',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'February',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'March',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'April',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'May',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'June',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'July',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'August',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'September',
    uv: 20,
    pv: 14,
    amt: 20,
  },
  {
    name: 'October',
    uv: 20,
    pv: 14,
    amt: 20,
  },
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/bar-chart-has-no-padding-jphoc';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={50}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 26, right: 10 }} />
          <YAxis tickCount={5} />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
