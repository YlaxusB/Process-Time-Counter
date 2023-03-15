import React, { useEffect, useState } from "react";

const contextDefaultValue = {
  dates: { startDate: new Date(), endDate: new Date() },
  timePeriod: "week",
  chartType: "barChart",
  isComplete: false,
  timeMultiplier: 1,
  separateDataBy: "days",
};
export const GraphicsContext = React.createContext(contextDefaultValue);

export const GraphicsProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("week");
  const [chartType, setChartType] = useState("barChart");
  const [isComplete, setIsComplete] = useState(false);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [overlayState, setOverlayState] = useState(false);
  const [separateDataBy, setSeparateDataBy] = useState("days");
  const [chartProcessName, setChartProcessName] = useState("Microsoft Text Input Application");

  return (
    <GraphicsContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        timePeriod,
        setTimePeriod,
        chartType,
        setChartType,
        isComplete,
        setIsComplete,
        timeMultiplier,
        setTimeMultiplier,
        overlayState,
        setOverlayState,
        separateDataBy,
        setSeparateDataBy,
        chartProcessName,
        setChartProcessName,
      }}
    >
      {children}
    </GraphicsContext.Provider>
  );
};
