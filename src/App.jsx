import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import axios from "axios";

import { format, parseISO, eachMonthOfInterval, addYears } from "date-fns";

// ui
import CustomSelect from "./components/CustomSelect";

// material ui
import IconButton from "@mui/material/IconButton";

// data ui
import { DataGrid } from "@mui/x-data-grid";
import OffsetGraph from "./components/OffsetGraph";
import CostGraph from "./components/CostGraph";

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
  const [offsetDataPoints, setOffsetDataPoints] = useState([]);
  const [costDataPoints, setCostDataPoints] = useState([]);
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

  function isPurchaseAllowed(data) {
    const purchaseYear = data.date.getFullYear();

    const purchasesThisYear = rows.filter((row) => {
      return parseISO(row.date).getFullYear() == purchaseYear;
    });

    // Calculate the total number of trees purchased so far this year
    const totalPurchasedThisYear = purchasesThisYear.reduce(function (
      total,
      row
    ) {
      return total + Number(row.num_trees);
    },
    0);

    // Check if the new purchase would exceed the limit of 50 trees per year
    if (totalPurchasedThisYear + Number(data.num_trees) > 50) {
      return false;
    }
    return true;
  }

  const addRow = async (data) => {
    setLoading({ isLoading: true });
    try {
      const res = await axios.post(`http://localhost:5000/calculator`, {
        date: data.date,
        num_trees: Number(data.num_trees),
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
      setError,
      formState: { errors },
    } = useForm({ mode: "onChanges", reValidateMode: "onChange" });

    const onSubmit = (data) => {
      if (!isPurchaseAllowed(data)) {
        setError("num_trees", {
          type: "custom",
          message:
            "You can only purchase a maximum of 50 trees per calender year",
        });
      } else {
        addRow(data);
      }
    };
    return (
      <>
        <h3 className="text-xl px-3 text-center font-semibold">
          Schedule trees to plant
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-grey-900 rounded-md p-2 w-full flex"
        >
          <div className="flex flex-col grow mx-2">
            <label htmlFor="date" className="text-xs text-bold">
              Date
            </label>
            <Controller
              control={control}
              name="date"
              required={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  wrapperClassName="datePicker"
                  showYearDropdown
                  yearDropdownItemNumber={20}
                  scrollableYearDropdown
                  className="mb-2 border border-black rounded-md p-2"
                  placeholderText="Select date"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                />
              )}
            />
          </div>
          <div className="flex flex-col grow mx-2">
            <label htmlFor="num_trees" className="text-xs text-bold ">
              Number of Trees
            </label>
            <input
              type="number"
              className="mb-2 border border-black rounded-md p-2 "
              {...register("num_trees", {
                required: true,
              })}
            />

            {errors.num_trees?.type === "required" && (
              <span className="text-red-500">This field is required</span>
            )}
            <span className="text-red-500">
              {errors.num_trees?.type === "custom" && errors.num_trees.message}
            </span>
          </div>
          <button
            type="submit"
            className=" bg-blue-500 text-white rounded-full px-2 my-3"
          >
            <AddCircleIcon />
          </button>
        </form>
      </>
    );
  }

  // populate table on first render
  useEffect(() => {
    fetchData();
  }, []);

  // CALCULATE TOTAL OFFSET TO PLOT ON OFFSET GRAPH
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

          const offsetPerTreePerMonth =
            year < 6 ? (28.5 / 12 / 72) * index : 28.5 / 12;

          const totalOffset = offsetPerTreePerMonth * row.num_trees;

          return { month: month, totalOffset: Number(totalOffset).toFixed(2) };
        });

        return result;
      });

      //  merge 3 arrays into 1
      const mergedArray = offsetArray.reduce(
        (acc, curr) => [...acc, ...curr],
        []
      );

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

      setOffsetDataPoints(formatDates);
    }
  }, [rows]);

  // CALCULATE TOTAL COST TO PLOT ON CUMULATIVE COST GRAPH
  useEffect(() => {
    if (rows.length > 0) {
      const costRows = rows.map((row) => {
        return row;
      });

      costRows.sort((a, b) => parseISO(a.date) - parseISO(b.date));

      // set common end date 6 years after the final date.
      const endDate = addYears(parseISO(costRows[costRows.length - 1].date), 6);

      const costArray = costRows.map((row) => {
        const months = eachMonthOfInterval({
          start: new Date(row.date),
          end: new Date(endDate),
        });
        const result = months.map((month, index) => {
          const costPerTreePerMonth = index === 0 ? 120 : 1;

          const totalCost = costPerTreePerMonth * row.num_trees;

          return { month: month, totalCost: Number(totalCost).toFixed(2) };
        });

        return result;
      });

      //  merge 3 arrays into 1
      const mergedCostArray = costArray.reduce(
        (acc, curr) => [...acc, ...curr],
        []
      );

      // create an object which sums all the costs on the same date
      const result = {};
      mergedCostArray.map((obj) => {
        const { month, totalCost } = obj;
        if (result.hasOwnProperty(month)) {
          result[month] += Number(totalCost);
        } else {
          result[month] = Number(totalCost);
        }
      });

      // convert object back into array of objects
      const costPerMonthArray = Object.keys(result).map((month) => ({
        month,
        totalCost: result[month],
      }));

      // mutate the costPerMonth array to use cumulative cost instead.
      let cumulativeCost = 0;
      for (let i = 0; i < costPerMonthArray.length; i++) {
        cumulativeCost += Number(costPerMonthArray[i].totalCost);
        costPerMonthArray[i].totalCost = Number(cumulativeCost);
      }
      setCostDataPoints(costPerMonthArray);
    }
  }, [rows]);

  const columns = [
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
    <div className="App h-screen">
      <div className="h-screen grid grid-cols-2 justify-center">
        <div>
          <h1 className="title mb-1 px-3 text-center pt-1 text-xl font-bold underline">
            Carbon Offset Simulation Tool
          </h1>
          <p className="px-6 pb-3 text-xs font-semibold">
            Use the tools below to estimate how much carbon your tree purchases
            will offset over time along with the cumulative cost. You can
            purchase a maximum of 50 trees per calender year.
          </p>

          <div className="input-box mb-3">
            <div className="m-3">
              <CustomSelect
                label={"Country"}
                value={country}
                handleChange={handleCountryChange}
                options={countries}
              />
            </div>
            <div className="m-3">
              <CustomSelect
                label={"Simulation Mode"}
                value={mode}
                handleChange={handleModeChange}
                options={modes}
                disabled={true}
              />
            </div>
          </div>
          <div className="h-[50vh] flex px-3">
            <div className="flex flex-col items-center justify-center min-w-full">
              <h2 className="text-xl pb-1 font-semibold">
                Tree Purchase Planner
              </h2>
              <DataGrid
                justify="center"
                sx={{ width: "100%" }}
                rows={rows}
                columns={columns}
                isCellEditable={(params) => false}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                  sorting: {
                    sortModel: [{ field: "date", sort: "asc" }],
                  },
                }}
              />
            </div>
          </div>
          <div className="my-3 px-3">
            <PurchaseForm />
          </div>
        </div>
        <div className="graph-container ">
          <div className="h-[50vh] w-full">
            {offsetDataPoints.length > 0 ? (
              <OffsetGraph data={offsetDataPoints} cO2={cO2} />
            ) : null}
          </div>
          <div className="h-[50vh] w-full">
            {costDataPoints.length > 0 ? (
              <CostGraph data={costDataPoints} cO2={cO2} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
