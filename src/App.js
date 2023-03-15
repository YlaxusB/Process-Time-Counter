import logo from "./logo.svg";
import refreshIcon from "./refreshIcon.png";
import "./App.css";
import "./components/Calendar.css";
import "./components/Header.css";
import "./components/Table.css";
import "./components/visualGraphics/Graphics.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import ProcessList from "./components/ProcessList";
import Calendar from "./components/Calendar";
import Overlay from "./components/Overlay";
import GraphicsOverlay from "./components/visualGraphics/GraphicsOverlay";

const os = window.require("os");
const username = os.userInfo().username;
const mainAppFolder = `C:/Users/${username}/AppData/Roaming/Process Time Counter`;

// const readFile = async (path) => {
//   const rawResponse = await fetch(path);
//   const response = await rawResponse.json();
//   return response;
// };
const fs = window.require("fs");

export const readFileSync = (path) => {
  return JSON.parse(fs.readFileSync(path, "utf-8", (err, data) => data));
};

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

const datesInRange = (from, to) => {
  let currentDate = new Date(from);

  let datesInRange = [];
  while (currentDate < to) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dateToAdd = new Date(currentDate);
    dateToAdd.setMonth(dateToAdd.getMonth() + 1);
    let formattedMonth = ("00" + dateToAdd.getMonth()).slice(-2);
    let formattedDay = ("00" + dateToAdd.getDate()).slice(-2);
    datesInRange = [...datesInRange, `${formattedMonth}-${formattedDay}-${dateToAdd.getFullYear()}`];
  }
  return datesInRange;
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState([]);
  const [totalTimeJSON, setTotalTimeJSON] = useState([]);
  const [mode, setMode] = useState("current");

  const [searchInput, setSearchInput] = useState("");

  const [dateFrom, setDateFrom] = useState(new Date("10-10-2022"));
  const [dateTo, setDateTo] = useState(new Date("11-10-2022"));
  const [isRangeChecked, setRangeChecked] = useState(false);

  const [selectedInput, setSelectedInput] = useState("");

  const [inRangeProcesses, setInRangeProcesses] = useState([]);

  const [isGraphicsOverlayOpen, setIsGraphicsOverlayOpen] = useState(true);
  const [chartProcessName, setChartProcessName] = useState("Microsoft Text Input Application");

  const [sortMode, setSortMode] = useState({
    mode: "alphabetical",
    descendant: true,
  });

  const fromDateRef = useRef();
  const toDateRef = useRef();

  const fetchTotalTime = async () => {
    setTotalTimeJSON(await readFileSync(mainAppFolder + "/Others/TotalTimeFiltered.json"));
  };

  const fetchTasks = async () => {
    setTasks(await readFileSync(mainAppFolder + "/Others/TemporaryProcesses.json"));
  };

  const fetchFilters = async () => {
    setFilters(await readFileSync(mainAppFolder + "/Filters.json").MainWindowTitle);
  };

  // Change to filter
  function clickedFilterMode(changeTo) {
    setMode(changeTo);
    fetchTotalTime();
  }

  // Update the variables that uses JSON
  useEffect(() => {
    fetchTasks();
    fetchFilters();
    fetchTotalTime();

    const interval = window.setInterval(() => {
      if (!isRangeChecked) {
        fetchTasks();
        fetchFilters();
        fetchTotalTime();
      }
    }, 1000 * 60);
    return () => {
      window.clearInterval(interval);
    };
  }, [isRangeChecked]);

  // The function to get all dates between a start and end date
  const GetDatesBetweenTwoDates = async () => {
    // All day after starting date and before end date
    let dates = datesInRange(dateFrom, dateTo);
    // Read the directory with all sessions json
    let files = await fs.readdirSync(mainAppFolder + "/Sessions Json", {
      withFileTypes: true,
    });
    // Remove the .json in end of files, for some reason includes() cant work with them
    await files.forEach((element) => {
      files[files.indexOf(element)] = element.name.split(".json")[0];
    });
    const filesInRange = files.filter((x) => {
      let splitted = x.split("-");
      let fileName = splitted[0] + "-" + splitted[1] + "-" + splitted[2];
      return dates.includes(fileName);
    });
    //return new Promise((resolve, reject) => resolve(filesInRange));
    return await filesInRange;
    // Processes to insert into table
    let processesToSet = [];

    ////// Daqui -------------------------------------------------------------------------------------------
    for (let i = 0; i < filesInRange.length; i++) {
      let json = await readFileSync(mainAppFolder + "/Sessions Json/" + filesInRange[i] + ".json");
      let toConcat = filesInRange.map((element) => {
        if (processesToSet.find((x) => x == element)) {
          processesToSet[processesToSet.find((x) => x == element)].Time += 1;
        }
      });
      processesToSet.push();
      ////// Até aqui só fiz merda, refaz essa porra ---------------------------------------------------------------
    }
    setInRangeProcesses(processesToSet);
  };

  function call(callback) {
    callback();
  }

  const GetProcessesBetweenDates = async () => {
    let dates = await GetDatesBetweenTwoDates();
    let processes = [];
    await dates.forEach(async (date) => {
      const fileProcesses = await readFileSync(mainAppFolder + "/Sessions Json/" + date + ".json");
      const filteredFileProcesses = fileProcesses.map((item, i) => Object.assign({}, item, processes[i]));
      fileProcesses.forEach((element) => {
        if (!processes.find((x) => x.MainWindowTitle == element.MainWindowTitle) || processes.length == 0) {
          processes.push(element);
        } else if (processes.find((x) => x.MainWindowTitle == element.MainWindowTitle)) {
          processes.find((x) => x.MainWindowTitle == element.MainWindowTitle).Time += element.Time;
        }
      });
    });
    //setTasks(processes);
    setTotalTimeJSON(processes);
  };

  // Handle date changes
  useEffect(() => {
    if (isRangeChecked) {
      GetProcessesBetweenDates();
    }
  }, [dateTo, dateFrom, isRangeChecked]);

  // Handle what happens when graphics overlay opens and closes
  useEffect(() => {
    if (isGraphicsOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isGraphicsOverlayOpen]);

  const [calendarState, setCalendar] = useState(false);
  const [overlayState, setOverlayState] = useState(false);

  const CalendarComponent = React.memo(() => {
    return <Calendar setOverlayState={setOverlayState} setCalendar={setCalendar} setDate={selectedInput == "from" ? setDateFrom : setDateTo}></Calendar>;
  }, [setDateFrom, selectedInput]);

  const OverlayComponent = React.memo(() => {
    return <Overlay setCalendar={setCalendar} setOverlayState={setOverlayState}></Overlay>;
  }, [setOverlayState, overlayState]);

  return (
    <div className="App">
      {isGraphicsOverlayOpen && (
        <GraphicsOverlay
          setOverlayState={setOverlayState}
          // setCalendar={setCalendar}
          // selectedInput={selectedInput}
          // setDateFrom={setDateFrom}
          // setDateTo={setDateTo}
          // calendarState={calendarState}
          // dateFrom={dateFrom}
          // dateTo={dateTo}
          // setSelectedInput={setSelectedInput}

          chartProcessName={chartProcessName}
          setIsGraphicsOverlayOpen={setIsGraphicsOverlayOpen}
        ></GraphicsOverlay>
      )}
      {overlayState && <OverlayComponent></OverlayComponent>} {/* overlay for when open calendar */}
      <header className="App-header">
        <h1>Process Time Counter</h1>
      </header>
      <div className="App-body" style={{ width: "95vw", alignSelf: "center" }}>
        <div className="App-body-header" style={{ width: "100%" }}>
          <a onClick={fetchTasks} className="App-body-button-refresh">
            <img className="App-body-image-refresh" src={refreshIcon}></img>
          </a>

          <div className="buttons-div">
            <button
              className="change-list-button"
              onClick={() => {
                clickedFilterMode("current");
                setSortMode({ mode: "alphabetical", descendant: true });
              }}
            >
              Open Processes
            </button>
            <button
              className="change-list-button"
              onClick={() => {
                clickedFilterMode("filtered");
                setSortMode({ mode: "time", descendant: true });
              }}
            >
              Processes Time
            </button>
          </div>

          <input
            type={"text"}
            placeholder="Search for a Process"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          ></input>

          <div className="date-range-div" style={{ marginLeft: "auto" }}>
            <div>
              Filter By Range
              <input
                type={"checkbox"}
                onClick={(e) => {
                  setRangeChecked(!isRangeChecked);
                }}
              ></input>
            </div>

            <div className="div-date-inputs">
              {" "}
              <div style={{ display: "inline", position: "relative" }}>
                {calendarState && selectedInput === "from" && <CalendarComponent />}
                <input
                  className="date-input"
                  type={"text"}
                  value={`${dateFrom.getDate()}/${dateFrom.getMonth() + 1}/${dateFrom.getFullYear()}`}
                  onClick={() => {
                    setSelectedInput("from");
                    setCalendar(!calendarState);
                    setOverlayState(!overlayState);
                  }}
                  onChange={(e) => {
                    const input = e.target.value;
                    var splited = input.split("-");
                    let date = new Date();
                    date.setDate(parseFloat(splited[0]));
                    date.setMonth(parseFloat(splited[1]));
                    date.setFullYear(parseFloat(splited[2]));
                    setDateFrom(date);
                  }}
                ></input>
              </div>
              <div style={{ display: "inline", position: "relative" }}>
                {calendarState && selectedInput === "to" && <CalendarComponent />}
                <input
                  className="date-input"
                  onClick={() => {
                    setSelectedInput("to");
                    setCalendar(!calendarState);
                    setOverlayState(!overlayState);
                  }}
                  type={"text"}
                  value={`${dateTo.getDate()}/${dateTo.getMonth() + 1}/${dateTo.getFullYear()}`}
                  onChange={(e) => {
                    const input = e.target.value;
                    var splited = input.split("-");
                    let date = new Date();
                    date.setDate(parseFloat(splited[0]));
                    date.setMonth(parseFloat(splited[1]) - 1);
                    date.setFullYear(parseFloat(splited[2]));
                    setDateTo(date);
                  }}
                ></input>
              </div>
            </div>

            {/* Button to apply the range search and filter processes based on it */}
            {/* <button
              onClick={async () => {
                GetDatesBetweenTwoDates();
              }}
            >
              Eita
            </button> */}
          </div>
        </div>

        <div className="App-body-container" style={{ width: "100%" }}>
          <div className="App-list-content" style={{ width: "100%" }}>
            <ProcessList
              style={{ width: "100%" }}
              isGraphicsOverlayOpen={isGraphicsOverlayOpen}
              setIsGraphicsOverlayOpen={setIsGraphicsOverlayOpen}
              setChartProcessName={setChartProcessName}
              overlayState={overlayState}
              setOverlayState={setOverlayState}
              useEffect
              processes={tasks}
              filters={filters}
              setFilters={setFilters}
              mode={mode}
              totalTimeJSON={totalTimeJSON}
              searchInput={searchInput}
              date={dateFrom}
              dateFilteredSessions={() => {
                if (isRangeChecked) {
                  return datesInRange(dateFrom, dateTo);
                }
              }}
              sortMode={sortMode}
              setSortMode={setSortMode}
            />
          </div>
        </div>

        <div className="App-body-bottom"></div>
      </div>
    </div>
  );
}

export default App;
