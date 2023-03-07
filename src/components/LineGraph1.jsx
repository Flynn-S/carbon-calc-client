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
  console.log(data);
  console.log(data[data.length - 1]);
  console.log(data[data.length - 1].totalOffset);
  const highestOffset = data[data.length - 1].totalOffset;
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
        width={500}
        height={1000}
        // data={data}
        margin={{
          top: 40,
          right: 150,
          left: 20,
          bottom: 100,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month">
          <Label
            value="Date (month)"
            offset={-35}
            position="insideBottom"
          ></Label>
        </XAxis>
        <YAxis
          dataKey="totalOffset"
          interval="preserveStartEnd"
          type="number"
          domain={[0, data[data.length - 1].totalOffset + 150]}
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
        {/* {data.forEach((line) => {
          return (
            <Line
              dataKey="totalOffset"
              // data={line.data}
              // name={line.name}
              // key={line.name}
              type="monotone"
              stroke="red"
            />
          );
        })} */}
        {/* <Line
          type="monotone"
          dataKey="totalOffset"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        /> */}
        {/* {data.data &&
          data.data.map((entry) => {
            console.log(entry.name);
            console.log(entry.data);
            console.log(entry.color);
            return (
              <Line
                dataKey="totalOffset"
                data={entry.data}
                name={entry.name}
                key={entry.name}
                stroke={entry.color}
              />
            );
          })} */}
        <Line type="monotone" dataKey="totalOffset" stroke="red" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph1;
