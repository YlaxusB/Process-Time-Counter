import { userInfo } from "os";
import React, { useEffect, useState } from "react";
import RemoveButton from "./RemoveButton";

const os = window.require("os");
const username = os.userInfo().username;
const mainAppFolder = `C:/Users/${username}/AppData/Roaming/Process Time Counter`;

const fs = window.require("fs");

const saveFile = async (path, data) => {
  await fs.writeFileSync(path, data, (err, data) => {
    if (err) return console.log(err);
  });
};

const readFile = async (path) => {
  const rawResponse = await fetch(path);
  const response = await rawResponse.json();
  return response;
};

const readFileSync = (path) => {
  return JSON.parse(fs.readFileSync(path, "utf-8", (err, data) => data));
};

function checkboxClicked(e, setFilters) {
  if (e.target.checked) {
    addProcessToFilters(e, setFilters);
  } else {
    removeProcessFromFilters(e.target.id, setFilters);
  }
}
const fetchFilters = async (setFilters) => {
  setFilters(await readFileSync(mainAppFolder + "/Filters.json").MainWindowTitle);
};

async function addProcessToFilters(e, setFilters) {
  const oldFilters = await readFileSync(mainAppFolder + "/Filters.json");
  // Check if this process is not already filtered
  let nameComparator = oldFilters.MainWindowTitle.find((x) => x.MainWindowTitle == e.target.id) == undefined;

  if (nameComparator || oldFilters.MainWindowTitle.length == 0) {
    let newFilterJSON = oldFilters;
    newFilterJSON.MainWindowTitle.push(e.target.id); // e.target.id is the name of process to add into filters json

    await saveFile(mainAppFolder + "/Filters.json", JSON.stringify(newFilterJSON));
    setFilters(fetchFilters(setFilters));
  }
}

// Get the name of the clicked filter, find the index of this name in the filters file, get the filters and remove the process by index then saves
async function removeProcessFromFilters(filterToRemove, setFilters) {
  const oldFilters = await readFileSync(mainAppFolder + "/Filters.json");
  const filterIndex = oldFilters.MainWindowTitle.findIndex((element) => element == filterToRemove);
  let newFilters = oldFilters.MainWindowTitle;
  newFilters.splice(filterIndex, 1);
  const newFiltersJSON = oldFilters;
  newFiltersJSON.MainWindowTitle = newFilters;
  await saveFile(mainAppFolder + "/Filters.json", JSON.stringify(newFiltersJSON));
  setFilters(fetchFilters(setFilters));
}

//(processName, checkboxValue, setFilters, overlayState, setOverlayState, filters)
const ListButtons = (props) => {
  return (
    <div className="buttons-container" style={{ display: "flex" }}>
      <input
        className="filter-checkbox"
        type={"checkbox"}
        onChange={(e) => {
          checkboxClicked(e, props.setFilters);
        }}
        id={props.processName}
        checked={props.checkboxValue}
      />
      <RemoveButton overlayState={props.overlayState} setOverlayState={props.setOverlayState} processName={props.processName} setFilters={props.setFilters} />
    </div>
  );
};

//export default ListButtons;
export { removeProcessFromFilters, ListButtons };
