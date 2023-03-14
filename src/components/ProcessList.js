import React, { useEffect, useState } from "react";
const fs = window.require("fs");
import { ListButtons } from "./ListButtons";
import GraphicsOverlay from "./visualGraphics/GraphicsOverlay";
import { processNameClicked } from "./visualGraphics/VisualGraphicsHandler";

const os = window.require("os");
const username = os.userInfo().username;
const mainAppFolder = `C:/Users/${username}/AppData/Roaming/Process Time Counter`;

const ProcessList = (props) => {
  //const [isGraphicsOverlayOpen, setIsGraphicsOverlayOpen] = useState(false);

  // Check if date range is enabled
  if (props.isRangeChecked) {
  }

  let startMode = "alphabetical";
  if (props.mode == "current") {
    startMode = "alphabetical";
  } else if (props.mode == "filtered") {
    startMode = "time";
  }

  let sortMode = props.sortMode;
  let setSortMode = props.setSortMode;

  // Change the sort mode to alphabetical or by time and the order
  const changeSortModeAndOrder = (pressedElement) => {
    if (pressedElement == "process") {
      const newDescendant = sortMode.mode == "alphabetical" ? !sortMode.descendant : true;
      props.setSortMode({ mode: "alphabetical", descendant: newDescendant });
    } else if ((pressedElement = "time")) {
      const newDescendant = sortMode.mode == "time" ? !sortMode.descendant : true;
      setSortMode({ mode: "time", descendant: newDescendant });
    }
  };
  let variableToMap = props.mode === "filtered" ? props.totalTimeJSON : props.processes;

  if (props.mode === "filtered") {
    variableToMap = variableToMap.filter((element) => {
      if (props.filters.find((x) => x == element.MainWindowTitle) != undefined) {
        return element;
      }
    });
  }

  if (sortMode.mode == "alphabetical") {
    variableToMap.sort((a, b) => {
      return a.MainWindowTitle.localeCompare(b.MainWindowTitle);
    });
  } else if (sortMode.mode == "time") {
    variableToMap.sort((a, b) => {
      return b.Time - a.Time;
    });
  }

  if (!sortMode.descendant) {
    variableToMap.reverse();
  }

  const processes = variableToMap.map((element, index) => {
    if (element.MainWindowTitle != null) {
      // Add a limit of 80 characters to the processes
      let abbreviatedProcessName = element.MainWindowTitle;
      if (element.MainWindowTitle.length > 80) {
        abbreviatedProcessName = element.MainWindowTitle.slice(0, 80) + "...";
      }
      const checkboxValue = props.filters.find((x) => x == element.MainWindowTitle) != undefined;

      // Only show process if he have the filter input somewhere in the name
      if (element.MainWindowTitle.toLowerCase().includes(props.searchInput.toLowerCase())) {
        return (
          <tr
            className="process"
            key={index}
            onClick={() => processNameClicked(props.isGraphicsOverlayOpen, props.setIsGraphicsOverlayOpen, element.MainWindowTitle, props.setChartProcessName)}
          >
            <td className="processName" title={element.MainWindowTitle}>
              {abbreviatedProcessName}
              {/* <span>{element.MainWindowTitle}</span> */}
            </td>
            <td>{ListButtons(element.MainWindowTitle, checkboxValue, props.overlayState, props.setOverlayState)}</td>
            {props.mode == "filtered" && <td>{element.Time >= 60 ? Math.round(element.Time / 60) + " hours" : element.Time + " min"}</td>}
          </tr>
        );
      }
    }
  });

  return (
    <table className="processList table" style={{ width: "100%" }}>
      <tbody style={{ width: "100%" }}>
        <tr>
          <th className="th-process">
            <a className="a-process" onClick={() => changeSortModeAndOrder("process")}>
              Process
            </a>
          </th>
          <th>Filters</th>
          {props.mode == "filtered" && (
            <th>
              <a className="a-process" onClick={() => changeSortModeAndOrder("time")}>
                Time
              </a>
            </th>
          )}
        </tr>
        {processes}
      </tbody>
    </table>
  );
};

export default ProcessList;
