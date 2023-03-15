import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, Pie, PieChart, BarChart, Bar, Brush, AreaChart, Area, CartesianAxis, CartesianGrid, ReferenceLine } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const Chart = (props) => {
  const data = props.data;
  const chartType = props.chartType;
  if (chartType == "lineChart") {
    return <ResponsiveLineChart data={data} />;
  } else if (chartType == "pieChart") {
    return <ResponsivePieChart data={data} />;
  } else if (chartType == "barChart") {
    return <ResponsiveBarChart data={data} />;
  } else {
    return (
      <ResponsiveContainer height={300} width="100%" minWidth={400}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    );
  }
};

export const ResponsiveLineChart = (props) => {
  let data = props.data;
  return (
    <ResponsiveContainer height={300} width="100%" minWidth={400}>
      <LineChart fontSize={15} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <Tooltip content={<CustomTooltip data={props.data} />} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const ResponsivePieChart = (props) => {
  let data = props.data;
  return (
    <ResponsiveContainer height={300} width="100%" minWidth={400}>
      <PieChart fontSize={15}>
        <Pie data={data} cx={200} cy={200} labelLine={false} label={true} outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const ResponsiveBarChart = (props) => {
  let data = props.data;
  let startIndex = data.length > 30 ? data.length - 30 : 0;
  return (
    <ResponsiveContainer height={300} width="100%" minWidth={400}>
      <BarChart data={data} fontSize={15}>
        <Bar dataKey="value" fill="#8884d8" maxBarSize={70} barSize={70} minWidth={50} />
        <XAxis dataKey="name" minWidth={50} />
        <YAxis />

        <Tooltip cursor={{ fill: "#8181814f" }} content={<CustomTooltip data={data} />} />

        <Brush startIndex={startIndex}>
          <BarChart>
            <Bar fill="#8884d8" dataKey="value" isAnimationActive={false} />
          </BarChart>
        </Brush>
        
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ResponsiveBlocksChart = (props) => {
  let data = props.data;
  return (
    <ResponsiveContainer height={300} width="100%" minWidth={400}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Time: ${payload[0].payload.value}`}</p>
        <p className="desc">{`Date: ${payload[0].payload.name}`}</p>
      </div>
    );
  }

  return null;
};
