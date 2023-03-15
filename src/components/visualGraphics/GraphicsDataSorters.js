import { readFileSync } from "fs";
import React, { useEffect, useState } from "react";
import Calendar from "../Calendar";
import { GetFilesNamesBetweenDates } from "./ChartUtilities";

export const GraphicsDataSorters = (props) => {
  const [period, setPeriod] = useState("last");
  const currentDate = new Date();

  const [timePeriod, setTimePeriod] = useState("week");

  const [lastPeriodInput, setLastPeriodInput] = useState(2);

  const [selectedInput, setSelectedInput] = useState("");
  const [calendarState, setCalendar] = useState(false);

  const [startDateDisplay, setStartDateDisplay] = useState("");

  // setOverlayState={props.setOverlayState}
  // setCalendar={props.setCalendar}
  // selectedInput={props.selectedInput}
  // setDateFrom={props.setDateFrom}
  // setDateTo={props.setDateTo}
  // calendarState={props.calendarState}
  // dateFrom={props.dateFrom}
  // dateTo={props.dateTo}
  // period={period}
  // setPeriod={setPeriod}
  // setSelectedInput={props.setSelectedInput}

  // setStartDate={props.dates.setStartDate}
  // setEndDate={props.dates.setEndDate}

  // Handle the date changes
  useEffect(() => {
    if (period == "this") {
      props.dates.setStartDate(GetStartOf(timePeriod, new Date())); // Set the start date to start of week/day/month/year
      props.dates.setEndDate(new Date());
    } else if (period == "last") {
      // The multiplier for options in the last week/day/month/year
      const lastMultiplier = 1;

      // set the multipliers for day/week/month/year
      if (timePeriod == "day") {
        lastMultiplier = 1;
      } else if (timePeriod == "week") {
        lastMultiplier = 7;
      } else if (timePeriod == "month") {
        lastMultiplier = 30;
      } else if (timePeriod == "year") {
        lastMultiplier = 365;
      }

      if (props.isComplete == "true") {
        // Complete

        const firstDayCurrentPeriod = GetStartOf(timePeriod, new Date());

        // This will be the last day of previous completed period
        let previousCompletePeriod = new Date();
        previousCompletePeriod.setDate(firstDayCurrentPeriod.getDate() - 1);

        let startDate = new Date(firstDayCurrentPeriod);
        //startDate.setDate(previousCompletePeriod.getDate() - lastPeriodInput * lastMultiplier);

        if (timePeriod == "day") {
          startDate.setDate(startDate.getDate() - lastPeriodInput);
        } else if (timePeriod == "week") {
          startDate.setDate(startDate.getDate() - lastPeriodInput * 7);
        } else if (timePeriod == "month") {
          startDate.setMonth(startDate.getMonth() - lastPeriodInput);
        } else if (timePeriod == "year") {
          startDate.setFullYear(startDate.getFullYear() - lastPeriodInput);
        }

        let endDate = new Date();
        endDate.setDate(firstDayCurrentPeriod.getDate() - 1);

        props.dates.setStartDate(startDate);
        props.dates.setEndDate(endDate);
      } else {
        // Incomplete

        let finalLastPeriodInput = lastPeriodInput - 1;

        const firstDayCurrentPeriod = GetStartOf(timePeriod, new Date());

        // This will be the last day of previous completed period
        let previousCompletePeriod = new Date();
        previousCompletePeriod.setDate(firstDayCurrentPeriod.getDate() - 1);

        const getMonthStartDate = (finalLastPeriodInput) => {
          let newDate = new Date();
          newDate.setMonth(newDate.getMonth() - lastPeriodInput);
          return newDate;
        };

        let startDate = timePeriod == "month" ? getMonthStartDate(finalLastPeriodInput) : new Date(firstDayCurrentPeriod);
        //startDate.setDate(previousCompletePeriod.getDate() - lastPeriodInput * lastMultiplier);

        if (timePeriod == "day") {
          startDate.setDate(startDate.getDate() - finalLastPeriodInput);
        } else if (timePeriod == "week") {
          startDate.setDate(startDate.getDate() - finalLastPeriodInput * 7);
        } else if (timePeriod == "month") {
          startDate.setDate(1);
        } else if (timePeriod == "year") {
          startDate.setFullYear(startDate.getFullYear() - finalLastPeriodInput);
        }

        let endDate = new Date();

        props.dates.setStartDate(startDate);
        props.dates.setEndDate(endDate);
      }
    }
  }, [timePeriod, period, lastPeriodInput, props.isComplete, props.timeMultiplier, props.dateFrom, props.dateTo]);

  return (
    <div className="graphics-header-bottomButtons">
      Chart Style:
      <select value={props.chartType} onChange={(e) => props.setChartType(e.target.value)}>
        <option value={"barChart"}>Bar Chart</option>
        <option value={"lineChart"}>Line Chart</option>
        {/* <option value={"pieChart"}>Pie Chart</option> */}
      </select>
      {period == "last" && (
        <LastPeriod
          period={period}
          setPeriod={setPeriod}
          setTimePeriod={setTimePeriod}
          timePeriod={timePeriod}
          setLastPeriodInput={setLastPeriodInput}
          setIsComplete={props.setIsComplete}
        />
      )}
      {period == "this" && <ThisPeriod period={period} setPeriod={setPeriod} setTimePeriod={setTimePeriod} timePeriod={timePeriod} />}
      {period == "customPeriod" && (
        <CustomPeriod
          setOverlayState={props.setOverlayState}
          setCalendar={setCalendar}
          selectedInput={selectedInput}
          calendarState={calendarState}
          period={period}
          setPeriod={setPeriod}
          setSelectedInput={setSelectedInput}
          setStartDate={props.dates.setStartDate}
          setEndDate={props.dates.setEndDate}
          startDate={props.dates.startDate}
          endDate={props.dates.endDate}
          startDateDisplay={startDateDisplay}
        />
      )}
      <ShowTimeIn timeMultiplier={props.timeMultiplier} setTimeMultiplier={props.setTimeMultiplier} />
      <SeparetedBy separateDataBy={props.separateDataBy} setSeparateDataBy={props.setSeparateDataBy} />
    </div>
  );
};

const LastPeriod = (props) => {
  return (
    <div className="last-period-div">
      <PeriodSelect setPeriod={props.setPeriod} period={props.period} setTimePeriod={props.setTimePeriod} timePeriod={props.timePeriod} />
      <input
        onChange={(e) => {
          props.setLastPeriodInput(e.target.value);
        }}
        type={"number"}
        defaultValue={2}
      ></input>
      <select value={props.isComplete} onChange={(e) => props.setIsComplete(e.target.value)}>
        <option value="false">Incomplete</option>
        <option value="true">Complete</option>
      </select>
      <select value={props.timePeriod} onChange={(e) => props.setTimePeriod(e.target.value)}>
        <option value="day">Days</option>
        <option value="week">Weeks</option>
        <option value="month">Months</option>
        <option value="year">Years</option>
      </select>
    </div>
  );
};

const ThisPeriod = (props) => {
  return (
    <div className="this-period-div">
      <PeriodSelect setPeriod={props.setPeriod} period={props.period} setTimePeriod={props.setTimePeriod} timePeriod={props.timePeriod} />
      <select value={props.timePeriod} onChange={(e) => props.setTimePeriod(e.target.value)}>
        <option value={"week"}>Week</option>
        <option value={"month"}>Month</option>
        <option value={"year"}>Year</option>
      </select>
    </div>
  );
};

const CustomPeriod = (props) => {
  const CalendarComponent = React.memo(() => {
    return (
      <Calendar
        setOverlayState={props.setOverlayState}
        setCalendar={props.setCalendar}
        setDate={props.selectedInput == "from" ? props.setStartDate : props.setEndDate}
      ></Calendar>
    );
  }, [props.setStartDate, props.selectedInput]);

  return (
    <div className="custom-period-div">
      <PeriodSelect setPeriod={props.setPeriod} period={props.period} />

      <div style={{ display: "inline", position: "relative" }}>
        {props.calendarState && props.selectedInput === "from" && <CalendarComponent />}
        <input
          onChange={(e) => {
            const input = e.target.value;
            var splited = input.split("-");
            let date = new Date();
            date.setDate(parseFloat(splited[0]));
            date.setMonth(parseFloat(splited[1]));
            date.setFullYear(parseFloat(splited[2]));
            props.setDateFrom(date);
          }}
          className="date-input"
          type={"text"}
          value={`${props.startDate.getDate()}/${props.startDate.getMonth() + 1}/${props.startDate.getFullYear()}`}
          onClick={() => {
            props.setSelectedInput("from");
            props.setCalendar(!props.calendarState);
            props.setOverlayState(!props.overlayState);
          }}
        ></input>
      </div>

      <div style={{ display: "inline", position: "relative" }}>
        {props.calendarState && props.selectedInput === "to" && <CalendarComponent />}
        <input
          className="date-input"
          onClick={() => {
            props.setSelectedInput("to");
            props.setCalendar(!props.calendarState);
            props.setOverlayState(!props.overlayState);
          }}
          type={"text"}
          value={`${props.endDate.getDate()}/${props.endDate.getMonth() + 1}/${props.endDate.getFullYear()}`}
          onChange={(e) => {
            const input = e.target.value;
            var splited = input.split("-");
            let date = new Date();
            date.setDate(parseFloat(splited[0]));
            date.setMonth(parseFloat(splited[1]) - 1);
            date.setFullYear(parseFloat(splited[2]));
            props.setDateTo(date);
          }}
        ></input>
      </div>
    </div>
  );
};

const PeriodSelect = (props) => {
  return (
    <div className="periodSelect-div">
      <select
        value={props.period}
        onChange={(e) => {
          props.setPeriod(e.target.value);
          if (e.target.value == "this" && props.timePeriod == "day") {
            props.setTimePeriod("week");
          }
        }}
      >
        <option value="last">Last</option>
        <option value="this">This</option>
        <option value="customPeriod">Custom Period</option>
      </select>
    </div>
  );
};

const ShowTimeIn = (props) => {
  return (
    <div className="showTimeIn-div">
      Show Time In:
      <select defaultValue={1} onChange={(e) => props.setTimeMultiplier(e.target.value)}>
        <option value={1 / 60}>Seconds</option>
        <option value={1}>Minutes</option>
        <option value={1 * 60}>Hours</option>
        <option value={1 * 60 * 24}>Days</option>
        <option value={1 * 60 * 24 * 7}>Weeks</option>
        <option value={1 * 60 * 24 * 30}>Months</option>
        <option value={1 * 60 * 24 * 365}>Years</option>
      </select>
    </div>
  );
};

/* Get Start Of Week, Month, Year*/
const GetStartOf = (timePeriod, date) => {
  const currentDay = date.getDay(); // Sunday = 0, Monday = 1, etc.
  const firstDayOfWeek = new Date(date); // create a new date object
  firstDayOfWeek.setDate(date.getDate() - currentDay); // set the date to the first day of the week (Sunday)

  // First day of current month
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  // First day of current year
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);

  let firstDay;
  if (timePeriod == "day") {
    firstDay = new Date();
  } else if (timePeriod == "week") {
    firstDay = firstDayOfWeek;
  } else if (timePeriod == "month") {
    firstDay = firstDayOfMonth;
  } else if (timePeriod == "year") {
    firstDay = firstDayOfYear;
  }

  return firstDay;

  console.log(firstDayOfWeek); // output: Sun Feb 27 2022 23:47:10 GMT-0500 (Eastern Standard Time)
  console.log(firstDayOfMonth); // output: Mon Feb 01 2022 00:00:00 GMT-0500 (Eastern Standard Time)
  console.log(firstDayOfYear); // output: Sat Jan 01 2022 00:00:00 GMT-0500 (Eastern Standard Time)
};

const SeparetedBy = (props) => {
  return (
    <div className="last-period-div">
      Separate Data By:
      <select onChange={(e)=>props.setSeparateDataBy(e.target.value)} value={props.separateDataBy}>
        <option value={"days"}>Days</option>
        <option value={"weeks"}>Weeks</option>
        <option value={"months"}>Months</option>
        <option value={"years"}>Years</option>
      </select>
    </div>
  );
};

// const GetStartOfMonth = ()=>{

// }

// const GetStartOfYear = ()=>{

// }
