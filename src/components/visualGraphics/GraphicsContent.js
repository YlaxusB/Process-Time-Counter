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
      console.log(startDate)
      console.log(endDate)
      // Open the file by its name, and filters the files that dont have at least one of the specified processes
      let processFilters = [props.chartProcessName];
      const filteredFiles = await FilterFilesToSpecificProcesses(filesNames, processFilters);

      const chartData = HandleChartData(filteredFiles, timePeriod, startDate, endDate, props.chartProcessName, timeMultiplier);
      setData(chartData)
    });
  }, [startDate, endDate, timePeriod, timeMultiplier]);

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
          setCalendar={props.setCalendar}
          selectedInput={props.selectedInput}
          setDateFrom={props.setDateFrom}
          setDateTo={props.setDateTo}
          calendarState={props.calendarState}
          dateFrom={props.dateFrom}
          dateTo={props.dateTo}
          setSelectedInput={props.setSelectedInput}
          
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

const HandleChartData = (filesName, timePeriod, startDate, endDate, chartProcessName, timeMultiplier) => {
  let datesAndValues = [];
  // Read files and assign its name, date and time to datesAndValues
  filesName.forEach((fileName) => {
    const fileDate = new Date(fileName.split("-")[2], fileName.split("-")[0] - 1, fileName.split("-")[1]);
    const fileJson = readFileSync(mainAppFolder + "/Sessions Json/" + fileName);
    let processTime = fileJson.find((x) => x.MainWindowTitle === chartProcessName).Time;
    datesAndValues.push({ name: fileName, date: fileDate, value: processTime });
  });
  console.log(datesAndValues)
  console.log(timePeriod)
  switch (timePeriod) {
    case "day":
        let newData = [];
        datesAndValues.forEach(element => {
          // day - month - year
          const newName = element.date.getDate() + "-" + (element.date.getMonth() + 1) + "-" + element.date.getFullYear(); 
          newData.push({name:newName, value:parseFloat((element.value / timeMultiplier).toFixed(2))})
        });
        return newData;
      break;
    case "week":
      break;
    case "month":
      break;
    case "year":
      break;
  }
};

export { GraphicsContent };
