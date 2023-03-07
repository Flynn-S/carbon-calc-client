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

const LineGraph1 = ({ data, cO2 }) => {
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
          bottom: 100,
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
          domain={[0, 1500]}
        >
          <Label
            value="Carbon Offset (kg)"
            offset={0}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <ReferenceLine y={cO2} label="Average Carbon Offset" stroke="red" />
        <Line type="monotone" dataKey="totalOffset" stroke="blue" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph1;
