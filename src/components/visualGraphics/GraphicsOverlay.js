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
      <GraphicsContent setOverlayState={props.setOverlayState}></GraphicsContent>
    </div>
  );
};

export default GraphicsOverlay;
