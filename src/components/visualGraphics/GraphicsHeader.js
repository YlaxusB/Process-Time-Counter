import React, { useCallback, useContext, useEffect, useState } from "react";
import { GraphicsContext } from "../../contexts/graphicsContext";
import { GraphicsDataSorters } from "./GraphicsDataSorters";

const GraphicsHeader = (props) => {
  const {chartProcessName} = useContext(GraphicsContext)
  return (
    <div className="graphics-header">
      <div className="graphics-processName-div">
        <h1>{chartProcessName}</h1>
      </div>
      <GraphicsDataSorters
        dateFrom={props.dateFrom}
        dateTo={props.dateTo}
      />
    </div>
  );
};

export { GraphicsHeader };
