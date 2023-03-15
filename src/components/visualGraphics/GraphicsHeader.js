import React, { useEffect, useState } from "react";
import { GraphicsDataSorters } from "./GraphicsDataSorters";

const GraphicsHeader = (props) => {
  return (
    <div className="graphics-header">
      <div className="graphics-processName-div">
        <h1>{props.chartProcessName}</h1>
      </div>
      <GraphicsDataSorters
        dateFrom={props.dateFrom}
        dateTo={props.dateTo}
      />
    </div>
  );
};

export { GraphicsHeader };
