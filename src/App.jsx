import { useEffect, useState } from "react";

import axios from "axios";

import {
  format,
  parseISO,
  parse,
  differenceInMonths,
  eachMonthOfInterval,
  addYears,
} from "date-fns";

// ui
import CustomFooter from "./components/CustomFooter";
import CustomSelect from "./components/CustomSelect";

// material ui
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// data ui
import { DataGrid } from "@mui/x-data-grid";
import LineGraph1 from "./components/LineGraph1";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function App() {
  const [count, setCount] = useState(0);
  const [country, setCountry] = useState("United States");
  const [cO2, setCO2] = useState(1293.33);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [rows, setRows] = useState([]);
  const [sortedRows, setSortedRows] = useState([]);
  const [mode, setMode] = useState("Monthly");
  const [totalTime, setTotalTime] = useState(120);

  const [graphDataPoints, setGraphDataPoints] = useState([]);

  const modes = ["Monthly", "Annually"];

  const co2Data = [
    { country: "United States", cO2: 1293.33 },
    { country: "United Kingdom", cO2: 462.5 },
    { country: "Germany", cO2: 786.67 },
    { country: "South Africa", cO2: 579.17 },
    { country: "India", cO2: 159.17 },
    { country: "China", cO2: 615 },
    { country: "Singapore", cO2: 713.13 },
    { country: "Australia", cO2: 1425 },
  ];
  let countries = [];
  co2Data.map((countryData) => countries.push(countryData.country));

  const getC02ByCountry = (country) => {
    const countryObject = co2Data.find((data) => data.country === country);
    setCO2(countryObject ? countryObject.cO2 : null);
  };

  let idCounter = Math.floor(Math.random() * 100);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    getC02ByCountry(e.target.value);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const fetchData = async () => {
    setLoading({ isLoading: true });
    try {
      const res = await axios("http://localhost:5000/calculator");
      setRows(res.data.data);

      setLoading({ isLoading: false });
    } catch (error) {
      console.log(error);
      setLoading({ isLoading: false });
    }
  };

  const addRow = async () => {
    setLoading({ isLoading: true });
    try {
      let date = new Date("2022, 2, 1");
      let num_trees = Math.floor(Math.random() * 20);
      console.log(date);
      idCounter += 1;
      const res = await axios.post(`http://localhost:5000/calculator`, {
        id: idCounter,
        date: date,
        num_trees: num_trees,
      });
      if (res.status === 201) {
        res.data ? console.log(res.data) : console.log(`Entry failed`);
        setLoading({ isLoading: false });
        fetchData();
      }
    } catch (error) {
      console.log(error);
      setLoading({ isLoading: false });
    }
  };

  const editRow = async (row) => {
    setLoading({ isLoading: true });
    try {
      let id = row.id;
      let date = row.date;
      let num_trees = row.num_trees;

      const res = await axios.put(`http://localhost:5000/calculator`, {
        id: id,
        date: date,
        num_trees: num_trees,
      });
      if (res.status === 200) {
        res.data ? console.log(res.data) : console.log(`Entry failed`);
        setLoading({ isLoading: false });
        fetchData();
      }
    } catch (error) {
      console.log(error);
      setLoading({ isLoading: false });
    }
  };

  const deleteRow = async (id) => {
    setLoading({ isLoading: true });
    try {
      const res = await axios.delete(`http://localhost:5000/calculator/${id}`);
      console.log(res);
      if (res.status === 204) {
        console.log("entry deleted successfully");
        fetchData();
        setLoading({ isLoading: false });
      }
    } catch (error) {
      console.log(error);
      setLoading({ isLoading: false });
    }
  };

  const getOffsetPerMonth = (num_trees, purchaseDate, endDate) => {
    console.log(
      "🚀 ~ file: App.jsx:154 ~ getOffsetPerMonth ~ endDate:",
      endDate
    );
    console.log(
      "🚀 ~ file: App.jsx:154 ~ getOffsetPerMonth ~ purchaseDate:",
      purchaseDate
    );

    const months = eachMonthOfInterval({
      start: purchaseDate,
      end: endDate,
    });

    console.log(months);

    const result = months.map((month, index) => {
      const year = index / 12;

      const offsetPerTree = year < 6 ? (28.5 / 72) * index : 28.5;
      console.log(offsetPerTree);
      const totalOffset = offsetPerTree * num_trees;
      return { month: month, totalOffset: totalOffset.toFixed(2) };
    });

    return result;
  };

  // populate table on first render
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      console.log(rows);

      // const dates = rows.map((row) => {
      //   return row.date;
      // });

      // dates.sort((a, b) => new Date(a) - new Date(b));

      // console.log(dates);

      // // console.log(parseISO(dates[dates.length - 1]));
      // // console.log(addYears(parseISO(dates[dates.length - 1]), 6));
      // setEndDate(addYears(parseISO(dates[dates.length - 1]), 6));

      const newRows = rows.map((row) => {
        return row;
      });

      console.log(newRows);

      newRows.sort((a, b) => parseISO(a.date) - parseISO(b.date));
      console.log(newRows);
      console.log(addYears(parseISO(newRows[newRows.length - 1].date), 6));
      const endDate = addYears(parseISO(newRows[newRows.length - 1].date), 6);
      console.log(endDate);

      const offsetArray = newRows.map((row) => {
        const months = eachMonthOfInterval({
          start: new Date(row.date),
          end: new Date(endDate),
        });
        const result = months.map((month, index) => {
          const year = index / 12;

          const offsetPerTree = year < 6 ? (28.5 / 72) * index : 28.5;

          const totalOffset = offsetPerTree * row.num_trees;
          return { month: month, totalOffset: totalOffset.toFixed(2) };
        });

        return result;
      });

      console.log(offsetArray);

      // // // merge the arrays into one long array
      const mergedArray = offsetArray.reduce(
        (acc, curr) => [...acc, ...curr],
        []
      );

      console.log(mergedArray);

      // // map through the array and
      const result = {};
      mergedArray.map((obj) => {
        const { month, totalOffset } = obj;
        if (result.hasOwnProperty(month)) {
          result[month] += Number(totalOffset);
        } else {
          result[month] = Number(totalOffset);
        }
      });

      console.log(result);

      const finalResult = Object.keys(result).map((month) => ({
        month,
        totalOffset: result[month].toFixed(2),
      }));

      console.log(finalResult);

      setGraphDataPoints(finalResult);
    }
  }, [rows]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Month & Year",
      flex: 3,
      type: "date",
      editable: true,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        let date = new Date(params.value);

        return format(date, "MMM-yyyy");
      },
    },

    {
      field: "num_trees",
      headerName: "Number of Trees",
      flex: 3,
      editable: true,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "delete_row",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={(e) => {
                editRow(params.row);
              }}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                deleteRow(params.row.id);
              }}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // const getOffsetPerMonth = (date, num_trees) => {
  //   console.log("getOFFSETDATE:" + date);
  //   console.log("PARSED:" + parseISO("2027-03-02T14:39:57.760Z"));

  //   console.log("ENDDATE:" + endDate);
  //   const months = eachMonthOfInterval({
  //     start: date,
  //     end: endDate ? endDate : parseISO("2027-03-02T14:39:57.760Z"),
  //   });

  //   const result = months.map((month, index) => {
  //     const year = index / 12;
  //     console.log(year);
  //     const offsetPerTree = year < 6 ? (28.5 / 72) * index : 28.5;
  //     console.log(offsetPerTree);
  //     const totalOffset = offsetPerTree * num_trees;
  //     return { month: month, totalOffset: totalOffset };
  //   });

  //   return result;
  // };

  // sortedRows.forEach((row) => {
  //   return {
  //     startDate: row.date

  //   }
  //   let

  //   let monthlyOffset = row.num_trees *
  // });
  // for (let month = 1; month <= totalTime; month++) {
  //   const dataPoint = {
  //     AverageCO2: cO2,
  //   };
  //   // }
  // };

  // const graphData = [
  //   {
  //     date: { startDate },
  //     data: [
  //       {
  //         AverageCO2: cO2,
  //         purchase1: sortedRows[0],
  //         purchase2: 0,
  //       },
  //       {
  //         x: totalTime - 36,
  //         y: cO2,
  //       },
  //       {
  //         x: totalTime,
  //         y: cO2,
  //       },
  //     ],
  //   },
  //   {
  //     date: { endDate },
  //     data: [
  //       {
  //         AverageCO2: cO2,
  //         y: 0,
  //       },
  //       {
  //         x: totalTime - 36,
  //         y: 18,
  //       },
  //       {
  //         x: totalTime,
  //         y: 18,
  //       },
  //     ],
  //   },
  // ];

  return (
    <div className="App">
      <div className="h-screen">
        <div className="h-screen grid grid-cols-2 justify-center border-4 border-black">
          <div>
            <h1 className="title mb-6">Carbon Offset Simulation Tool</h1>

            <div className="input-box mb-6">
              {/* label, variable, handleChange, options */}
              <div className="m-3">
                <CustomSelect
                  label={"Country"}
                  value={country}
                  key="country-select"
                  handleChange={handleCountryChange}
                  options={countries}
                />
              </div>
              <div className="m-3">
                <CustomSelect
                  label={"Simulation Mode"}
                  value={mode}
                  key="mode-select"
                  handleChange={handleModeChange}
                  options={modes}
                />
              </div>
            </div>
            <div className="flex h-[60vh] justify-center">
              <div className="flex justify-center w-full">
                <DataGrid
                  justify="center"
                  sx={{ width: "100%" }}
                  rows={rows}
                  columns={columns}
                  rowsPerPageOptions={[5, 10, 25]}
                  experimentalFeatures={{ newEditingApi: true }}
                  // components={{
                  //   Footer: CustomFooter,
                  // }}
                  // componentsProps={{
                  //   footer: { total: total },
                  // }}
                />
              </div>
            </div>
            <Button
              variant="contained"
              onClick={(e) => addRow()}
              endIcon={<AddCircleIcon />}
            >
              Add Row
            </Button>
          </div>
          <div className="p-8">
            <div>GRAPHS GO HERE</div>
            {/* <div className="h-[600px] w-full">
              <LineGraph1 data={graphDataPoints} cO2={cO2} />
            </div>
            <div className="h-96 w-full"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
