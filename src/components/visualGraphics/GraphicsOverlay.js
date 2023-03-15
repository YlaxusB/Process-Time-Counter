import React, { useEffect, useState } from "react";
import { GraphicsContent } from "./GraphicsContent";

const GraphicsOverlay = (props) => {
  return (
    <div className="graphics-graphicsOverlay">
      <button
        onClick={() => {
          props.setIsGraphicsOverlayOpen(false);
        }}
      >
        Back
      </button>
      <GraphicsContent
        setOverlayState={props.setOverlayState}
        // setCalendar={props.setCalendar}
        // selectedInput={props.selectedInput}
        // setDateFrom={props.setDateFrom}
        // setDateTo={props.setDateTo}
        // calendarState={props.calendarState}
        // dateFrom={props.dateFrom}
        // dateTo={props.dateTo}
        // setSelectedInput={props.setSelectedInput}
        
        chartProcessName={props.chartProcessName}
      ></GraphicsContent>
    </div>
  );
};

export default GraphicsOverlay;
