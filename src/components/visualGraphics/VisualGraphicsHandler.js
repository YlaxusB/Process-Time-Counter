import React, { useEffect, useState } from "react";
import {GraphicsOverlay, openGraphicsOverlay} from "./GraphicsOverlay";

const processNameClicked = (isGraphicsOverlayOpen, setIsGraphicsOverlayOpen, processName, setChartProcessName)=>{
    setIsGraphicsOverlayOpen(!isGraphicsOverlayOpen);
    setChartProcessName(processName)
}

export {processNameClicked};