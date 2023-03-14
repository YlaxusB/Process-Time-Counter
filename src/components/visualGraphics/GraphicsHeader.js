import React, { useEffect, useState } from "react";
import { GraphicsDataSorters } from "./GraphicsDataSorters";

const GraphicsHeader = (props) => {
  return (
    <div className="graphics-header">
      <div className="graphics-processName-div">
        <h1>{props.chartProcessName}</h1>
      </div>
      <GraphicsDataSorters
        dates={{ startDate: props.dates.startDate, setStartDate: props.dates.setStartDate, endDate: props.dates.endDate, setEndDate: props.dates.setEndDate }}
        timePeriod={props.timePeriod}
        setTimePeriod={props.setTimePeriod}
        chartType={props.chartType}
        setChartType={props.setChartType}
        isComplete={props.isComplete}
        setIsComplete={props.setIsComplete}
        timeMultiplier={props.timeMultiplier}
        setTimeMultiplier={props.setTimeMultiplier}

        setOverlayState={props.setOverlayState}
        setCalendar={props.setCalendar}
        selectedInput={props.selectedInput}
        setDateFrom={props.setDateFrom}
        setDateTo={props.setDateTo}
        calendarState={props.calendarState}
        dateFrom={props.dateFrom}
        dateTo={props.dateTo}
        setSelectedInput={props.setSelectedInput}
      />
    </div>
  );
};

export { GraphicsHeader };
