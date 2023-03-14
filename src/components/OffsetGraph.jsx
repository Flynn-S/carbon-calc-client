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
  const [maxOffset, setMaxOffset] = useState(1500);
  useEffect(() => {
    setMaxOffset(Number(data[data.length - 1].totalOffset));
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
      <LineChart
        key={maxOffset}
        data={data}
        // data={data}
        margin={{
          top: 10,
          right: 20,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="4 2" />
        <XAxis internal="preserveStartEnd" dataKey="month">
          <Label value="months" offset={-30} position="insideBottom"></Label>
        </XAxis>
        <YAxis
          dataKey={"totalOffset"}
          interval="preserveStartEnd"
          type="number"
          domain={[0, maxOffset > cO2 ? maxOffset + 100 : cO2 + 100]}
          minTickGap={10}
        >
          <Label
            value="Carbon Offset (kg)"
            offset={-10}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <ReferenceLine
          y={cO2}
          label="Your Average Carbon Offset"
          stroke="#ff1717ab"
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="totalOffset"
          stroke="#3b82f6"
          dot={false}
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph1;
