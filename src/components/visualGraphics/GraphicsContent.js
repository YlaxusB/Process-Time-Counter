import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { GraphicsFilters } from "./GraphicsFilters";
import { GraphicsHeader } from "./GraphicsHeader";
import { Chart } from "./Chart";
//import Line from 'react-chartjs-2';
import { Graphic } from "./Graphic";

import { GetFilesNamesBetweenDates, FilterFilesToSpecificProcesses, readFileSync } from "./ChartUtilities";

const fs = window.require("fs");
const os = window.require("os");
const username = os.userInfo().username;
const mainAppFolder = `C:/Users/${username}/AppData/Roaming/Process Time Counter`;
// const yesterday = new Date();

// yesterday.setDate(yesterday.getDate() - 7);

// GetFilesNamesBetweenDates(yesterday, new Date());

// const data = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "My First Dataset",
//       data: [65, 59, 80, 81, 56, 55, 40],
//       fill: false,
//       borderColor: "rgb(75, 192, 192)",
//       tension: 0.1,
//     },
//   ],
// };

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const GraphicsContent = (props) => {
  const [chartType, setChartType] = useState("barChart");
  const [lastOrThis, setLastOrThis] = useState("last");
  const [lastPeriod, setLastPeriod] = useState("week");
  const [thisPeriod, setThisPeriod] = useState("month");

  const [timePeriod, setTimePeriod] = useState("day");

  const [referenceTime, setReferenceTime] = useState("days"); // Sort by days, weeks, months, years...

  const [isComplete, setIsComplete] = useState("false");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [timeMultiplier, setTimeMultiplier] = useState(1); // The time used in the files are in minutes

  const [separateDataBy, setSeparateDataBy] = useState("days");

  const [data, setData] = useState([
    { name: "Jan", value: 100 },
    { name: "Feb", value: 357 },
    { name: "Mar", value: 52 },
    { name: "Apr", value: 158 },
    { name: "May", value: 640 },
    { name: "Jun", value: 0 },
    { name: "Jul", value: 230 },
    { name: "Aug", value: 50 },
    { name: "Sep", value: 570 },
    { name: "Oct", value: 0 },
    { name: "Nov", value: 900 },
    { name: "Dez", value: 350 },
  ]);

  useEffect(() => {
    // Get the file names and check if they exists
    GetFilesNamesBetweenDates(startDate, endDate).then(async (filesNames) => {
      // Open the file by its name, and filters the files that dont have at least one of the specified processes
      let processFilters = [props.chartProcessName];
      const filteredFiles = await FilterFilesToSpecificProcesses(filesNames, processFilters);

      const chartData = HandleChartData(filteredFiles, timePeriod, startDate, endDate, props.chartProcessName, timeMultiplier, separateDataBy);
      setData(chartData);
    });
  }, [startDate, endDate, timePeriod, timeMultiplier, separateDataBy]);

  return (
    <div className="graphics-content">
      <div className="graphics-main">
        <GraphicsHeader
          dates={{ startDate, setStartDate, endDate, setEndDate }}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          chartType={chartType}
          chartProcessName={props.chartProcessName}
          setChartType={setChartType}
          isComplete={isComplete}
          setIsComplete={setIsComplete}
          timeMultiplier={timeMultiplier}
          setTimeMultiplier={setTimeMultiplier}
          setOverlayState={props.setOverlayState}
          separateDataBy={separateDataBy}
          setSeparateDataBy={setSeparateDataBy}
          // setCalendar={props.setCalendar}
          // selectedInput={props.selectedInput}
          // setDateFrom={props.setDateFrom}
          // setDateTo={props.setDateTo}
          // calendarState={props.calendarState}
          // dateFrom={props.dateFrom}
          // dateTo={props.dateTo}
          // setSelectedInput={props.setSelectedInput}
        ></GraphicsHeader>

        <Chart chartType={chartType} data={data}></Chart>
        {/* <Graphic></Graphic> */}
      </div>
      <div className="graphics-side-bottom">
        <GraphicsFilters chartType={chartType} setChartType={setChartType}></GraphicsFilters>
      </div>
    </div>
  );
};

const HandleChartData = (filesName, timePeriod, startDate, endDate, chartProcessName, timeMultiplier, separateDataBy) => {
  let datesAndValues = [];
  // Read files and assign its name, date and time to datesAndValues
  for (let i = 0; i < filesName.length; i++) {
    const fileName = filesName[i];
    const fileDate = new Date(fileName.split("-")[2], fileName.split("-")[0] - 1, fileName.split("-")[1]);
    const fileJson = readFileSync(mainAppFolder + "/Sessions Json/" + fileName);
    let processTime = fileJson.find((x) => x.MainWindowTitle === chartProcessName).Time;

    // Check if prior element in array have the same date, if yes then merge them
    let a = "a";
    let b = "b";
    if (i > 0) {
      let c = datesAndValues.length;
      a = datesAndValues[c - 1].name.split("-")[0] + "-" + datesAndValues[c - 1].name.split("-")[1] + "-" + datesAndValues[c - 1].name.split("-")[2];
      b = fileName.split("-")[0] + "-" + fileName.split("-")[1] + "-" + fileName.split("-")[2];
    }

    if (i > 0 && a == b) {
      datesAndValues[datesAndValues.length - 1].value += processTime;
    } else {
      datesAndValues.push({ name: fileName, date: fileDate, value: processTime });
    }
  }
  filesName.forEach((fileName) => {});

  // Create empty data
  const differenceTime = endDate - startDate;
  const differenceDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));

  let currentIterationDate = new Date(startDate);
  for (let i = 0; i < differenceDays; i++) {
    let currentIterationName = `${(currentIterationDate.getMonth() + 1).toString().padStart(2, "0")}-${currentIterationDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${currentIterationDate.getFullYear()}`;

    if (!datesAndValues.some((x) => x.name.includes(currentIterationName))) {
      const fileDate = new Date(currentIterationName.split("-")[2], currentIterationName.split("-")[0] - 1, currentIterationName.split("-")[1]);
      const newData = { name: currentIterationName + "-0.json", date: fileDate, value: 0 };
      datesAndValues.splice(i, 0, newData);
    }
    currentIterationDate.setDate(currentIterationDate.getDate() + 1);
  }

  // Multiply data by show time in
  datesAndValues.forEach((element) => {
    // day - month - year
    const newName =
      element.date.getDate().toString().padStart(2, "0") + "-" + (element.date.getMonth() + 1).toString().padStart(2, "0") + "-" + element.date.getFullYear();
    datesAndValues[datesAndValues.indexOf(element)] = { name: newName, value: parseFloat((element.value / timeMultiplier).toFixed(2)), date: element.date };
  });

  console.log(datesAndValues);

  // Separate data by
  switch (separateDataBy) {
    case "days":
      return datesAndValues;
      break;
    case "weeks":
      break;
    case "months":
      let newData = [];
      console.log(endDate)
      console.log(startDate)
      const differenceMonths = Math.min(differenceInMonths(endDate, startDate), 1);
      console.log(differenceMonths)
      let currentMonth = new Date(startDate);
      console.log(differenceMonths);
      for (let i = 0; i < differenceMonths; i++) {
        currentMonth.setDate(1);
        const currentMonthName = `${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}-${currentMonth.getFullYear()}`;
        const today = new Date();
        
        var lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        let newMonth = datesAndValues.filter((x) => {
          console.log(x.date);
          console.log(startDate);
          console.log(endDate);
          console.log(new Date(x.date) >= startDate)
          console.log(new Date(x.date) <= lastDayOfMonth)
          return x.date >= startDate && x.date <= lastDayOfMonth;
        });
        console.log(datesAndValues);
        console.log(newMonth);
        newData = [...newData, newMonth];
      }
      console.log(newData);
      return newData[0];
    case "years":
      break;
  }
};

function differenceInMonths(date1, date2) {
  const monthDiff = date1.getMonth() - date2.getMonth();
  const yearDiff = date1.getYear() - date2.getYear();

  return monthDiff + yearDiff * 12;
}

export { GraphicsContent };
