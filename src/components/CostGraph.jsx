import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { useEffect, useState } from "react";

const LineGraph1 = ({ data, cO2 }) => {
  const [maxCost, setMaxCost] = useState(1500);
  useEffect(() => {
    setMaxCost(Number(data[data.length - 1].totalCost));
  }, [data]);

  const data1 = [
    {
      month: "2027-03-02",
      totalOffset: 200,
      uv: 30,
    },
    {
      month: "2035-03-02",
      totalOffset: 200,
      uv: 200,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 20,
          bottom: 10,
        }}
      >
        <defs>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month">
          {" "}
          <Label value="months" offset={-30} position="insideBottom"></Label>
        </XAxis>
        <YAxis
          label={{
            value: "Cumulative Cost ($)",
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="totalCost"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorCost)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LineGraph1;
