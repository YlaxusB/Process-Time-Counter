import React from "react";
import { removeProcessFromFilters } from "./ListButtons";
const fs = window.require("fs");

const os = window.require("os");
const username = os.userInfo().username;
const mainAppFolder = `C:/Users/${username}/AppData/Roaming/Process Time Counter`;

const readFileSync = (path) => {
  return JSON.parse(fs.readFileSync(path, "utf-8", (err, data) => data));
};

const saveFile = async (path, data) => {
  await fs.writeFileSync(path, data, (err, data) => {
    if (err) return console.log(err);
  });
};

const RemoveOverlay = (props) => {
  const overlayClicked = () => {
    props.setIsTryingRemove(false);
  };

  const DeleteButtonClicked = async () => {
    // Delete in each session file
    var files = fs.readdirSync(mainAppFolder + "/Sessions Json");
    files.forEach((fileName) => {
      let fileProcesses = readFileSync(mainAppFolder + "/Sessions Json/" + fileName);
      if (fileProcesses.find((x) => x.MainWindowTitle == props.processName) != undefined) {
        fileProcesses = fileProcesses.filter((x) => x.MainWindowTitle != props.processName);
        saveFile(mainAppFolder + "/Sessions Json/" + fileName, JSON.stringify(fileProcesses));
      }
    });

    // Delete in totalTimeFilteredJson
    let totalTimeJson = readFileSync(mainAppFolder + "/Others/TotalTimeFiltered.json");
    totalTimeJson = totalTimeJson.filter((x) => x.MainWindowTitle != props.processName);
    saveFile(mainAppFolder + "/Others/TotalTimeFiltered.json", JSON.stringify(totalTimeJson));

    // Remove from  filters
    removeProcessFromFilters(props.processName, props.setFilters);
  };

  return (
    <div className="overlay" style={{ zIndex: "1", height: "100vh", width: "100vw", position: "fixed", backgroundColor: "#000000a6", left: 0, top: 0 }}>
      <div>
        <p>Are you sure you want to permanently delete {props.processName} ?</p>
        <button
          onClick={() => {
            DeleteButtonClicked();
          }}
        >
          Delete
        </button>
        <button
          onClick={() => {
            props.setIsTryingRemove(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RemoveOverlay;
