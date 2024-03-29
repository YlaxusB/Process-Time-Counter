import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { GraphicsFilters } from "./GraphicsFilters";
import { GraphicsHeader } from "./GraphicsHeader";
import { GraphicsProvider, GraphicsContext } from "../../contexts/graphicsContext";
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
  const { endDate, startDate, timePeriod, timeMultiplier, separateDataBy, chartType, setChartType, setTimePeriod, chartProcessName } = useContext(GraphicsContext);

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
      let processFilters = [chartProcessName];
      const filteredFiles = await FilterFilesToSpecificProcesses(filesNames, processFilters);

      const chartData = HandleChartData(filteredFiles, timePeriod, startDate, endDate, chartProcessName, timeMultiplier, separateDataBy);
      setData(chartData);
    });
  }, [startDate, endDate, timePeriod, timeMultiplier, separateDataBy]);

  return (
    <div className="graphics-content">
      <div className="graphics-main">
        <GraphicsHeader />
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
      (element.date.getMonth() + 1).toString().padStart(2, "0") + "-" + element.date.getDate().toString().padStart(2, "0") + "-" + element.date.getFullYear();
    datesAndValues[datesAndValues.indexOf(element)] = { name: newName, value: parseFloat((element.value / timeMultiplier).toFixed(2)), date: element.date };
  });

  // Separate data by
  let newData = [];
  let currentDate = new Date(datesAndValues[0].date);
  let newSeparatedDataAndValue = null;
  switch (separateDataBy) {
    case "days":
      return datesAndValues;
      break;
    case "weeks":
      let startDateWeekDay = 0;
      let lastStartDateWeekDay = 0;

      // Iterate through every data
      for (let i = 0; i < datesAndValues.length; i++) {
        startDateWeekDay = datesAndValues[i].date.getDay(); // Day of the week, starting from 0 (sunday)
        if (startDateWeekDay === 0 || i === 0) {
          if (newSeparatedDataAndValue != null) {
            newData.push(newSeparatedDataAndValue);
            newSeparatedDataAndValue = {};
          }
          newSeparatedDataAndValue = datesAndValues[i];
        } else if (startDateWeekDay > 0) {
          newSeparatedDataAndValue.value += datesAndValues[i].value;
        }

        // If its the last iteration then add the last unfinished array
        if (i == datesAndValues.length - 1) {
          newData.push(newSeparatedDataAndValue);
          newSeparatedDataAndValue = {};
        }

        lastStartDateWeekDay = startDateWeekDay;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return newData;
    case "months":
      // Iterate through every data
      for (let i = 0; i < datesAndValues.length; i++) {
        if (i === 0) {
          newSeparatedDataAndValue = datesAndValues[i];
        }

        if (
          datesAndValues[i].date.getMonth() === newSeparatedDataAndValue.date.getMonth() &&
          datesAndValues[i].date.getFullYear() === newSeparatedDataAndValue.date.getFullYear()
        ) {
          newSeparatedDataAndValue.value += datesAndValues[i].value;
        } else {
          newData.push(newSeparatedDataAndValue);
          newSeparatedDataAndValue = datesAndValues[i];
        }

        if (i === datesAndValues.length - 1) {
          // If its the last iteration then add the last unfinished array
          newData.push(newSeparatedDataAndValue);
        }

        lastStartDateWeekDay = startDateWeekDay;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return newData;
    case "years":
      // Iterate through every data
      for (let i = 0; i < datesAndValues.length; i++) {
        if (i === 0) {
          newSeparatedDataAndValue = datesAndValues[i];
        }

        if (
          datesAndValues[i].date.getFullYear() === newSeparatedDataAndValue.date.getFullYear()
        ) {
          newSeparatedDataAndValue.value += datesAndValues[i].value;
        } else {
          newData.push(newSeparatedDataAndValue);
          newSeparatedDataAndValue = datesAndValues[i];
        }

        if (i === datesAndValues.length - 1) {
          // If its the last iteration then add the last unfinished array
          newData.push(newSeparatedDataAndValue);
        }

        lastStartDateWeekDay = startDateWeekDay;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return newData;
  }
};

function differenceInMonths(date1, date2) {
  const monthDiff = date1.getMonth() - date2.getMonth();
  const yearDiff = date1.getYear() - date2.getYear();

  return monthDiff + yearDiff * 12;
}

export { GraphicsContent };
