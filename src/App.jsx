import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import axios from "axios";

import { format, parseISO, eachMonthOfInterval, addYears } from "date-fns";

// ui
import CustomFooter from "./components/CustomFooter";
import CustomSelect from "./components/CustomSelect";

// material ui
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// data ui
import { DataGrid } from "@mui/x-data-grid";
import LineGraph1 from "./components/LineGraph1";

// date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function App() {
  const [country, setCountry] = useState("United States");
  const [cO2, setCO2] = useState(1293.33);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [mode, setMode] = useState("Monthly");
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

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    getC02ByCountry(e.target.value);
  };

  // DID NOT IMPLEMENT THIS
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

  const addRow = async (data) => {
    setLoading({ isLoading: true });
    try {
      const res = await axios.post(`http://localhost:5000/calculator`, {
        date: data.date,
        num_trees: data.num_trees,
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
    //  DID NOT ADD THIS FUNCTIONALITY INTO FRONTEND - RAN OUT OF TIME
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

  function PurchaseForm() {
    const {
      register,
      handleSubmit,
      control,
      watch,

      formState: { errors },
    } = useForm({ mode: "onChanges", reValidateMode: "onChange" });
    const onSubmit = (data) => addRow(data);

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="date" className="text-xs text-bold">
          Date
        </label>
        <Controller
          control={control}
          name="date"
          required={{ required: true }}
          render={({ field }) => (
            <DatePicker
              className="mb-2 border border-black rounded-md p-2"
              placeholderText="Select date"
              onChange={(date) => field.onChange(date)}
              selected={field.value}
            />
          )}
        />

        {/* include validation with required or other standard HTML validation rules */}
        <label htmlFor="num_trees" className="text-xs text-bold">
          Number of Trees
        </label>
        <input
          className="mb-2 border border-black rounded-md p-2"
          {...register("num_trees", { required: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.num_trees && <span>This field is required</span>}

        <input
          type="submit"
          className="self-center bg-blue-500 text-white p-2 rounded-xl w-1/3"
        />
      </form>
    );
  }

  // populate table on first render
  useEffect(() => {
    fetchData();
  }, []);

  // CALCULATE TOTAL OFFSET TO PLOT ON GRAPH
  useEffect(() => {
    if (rows.length > 0) {
      const newRows = rows.map((row) => {
        return row;
      });

      // sort rows by date
      newRows.sort((a, b) => parseISO(a.date) - parseISO(b.date));

      // set common end date 6 years after the final date.
      const endDate = addYears(parseISO(newRows[newRows.length - 1].date), 6);

      // calculate offset for each month between every purchases start date and common end date
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

      //  merge 3 arrays into 1
      const mergedArray = offsetArray.reduce(
        (acc, curr) => [...acc, ...curr],
        []
      );

      console.log(mergedArray);

      // create an object which sums all the offsets on the same date
      const result = {};
      mergedArray.map((obj) => {
        const { month, totalOffset } = obj;
        if (result.hasOwnProperty(month)) {
          result[month] += Number(totalOffset);
        } else {
          result[month] = Number(totalOffset);
        }
      });

      // convert object back into array of objects
      const finalResult = Object.keys(result).map((month) => ({
        month,
        totalOffset: result[month].toFixed(2),
      }));

      // format the dates
      const formatDates = finalResult.map((entry) => {
        let date = new Date(entry.month);
        return {
          date: format(date, "MMM/yy"),
          totalOffset: entry.totalOffset,
        };
      });

      setGraphDataPoints(formatDates);
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

  return (
    <div className="App">
      <div className="h-screen">
        <div className="h-screen grid grid-cols-2 justify-center">
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
                />
              </div>
            </div>
            <div className="my-3 px-6">
              <PurchaseForm />
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
            <div className="h-[500px] w-full">
              {graphDataPoints.length > 0 ? (
                <LineGraph1 data={graphDataPoints} cO2={cO2} />
              ) : null}
            </div>
            <div className="h-96 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
