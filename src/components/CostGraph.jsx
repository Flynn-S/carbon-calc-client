import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";

const LineGraph1 = ({ data, cO2 }) => {
  const [maxCost, setMaxCost] = useState(1500);
  useEffect(() => {
    setMaxCost(Number(data[data.length - 1].totalCost));
  }, [data]);
  console.log(maxCost);
  console.log(data);

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
      <LineChart
        data={data}
        // data={data}
        margin={{
          top: 30,
          right: 15,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="4 2" />
        <XAxis internal="preserveStartEnd" dataKey="month">
          <Label value="months" offset={-30} position="insideBottom"></Label>
        </XAxis>
        <YAxis
          dataKey={"totalCost"}
          interval="preserveStartEnd"
          type="number"
          domain={[0, maxCost > cO2 ? maxCost : cO2]}
        >
          <Label
            value="Total Cost ($)"
            offset={0}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="totalCost" stroke="blue" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph1;
