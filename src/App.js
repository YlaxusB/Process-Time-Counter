import logo from "./logo.svg";
import refreshIcon from "./refreshIcon.png";
import "./App.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ProcessList from "./components/ProcessList";

//let processJSONFile = require("../public/Process Time Counter Files/Others/TemporaryProcesses.json");

const readFile = async () => {
  const rawResponse = await fetch(
    "/Process Time Counter Files/Others/TemporaryProcesses.json"
  );
  const response = await rawResponse.json();
  return response;
};

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    readFile().then((response) => {
      setTasks(response);
    });
  };

  useEffect(() => {
    fetchTasks();

    window.setInterval(fetchTasks, 1000 * 60);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Process Time Counter</h1>
      </header>
      <body className="App-body">
        <div className="App-body-header">
          <a onClick={fetchTasks} className="App-body-button-refresh">
            <img className="App-body-image-refresh" src={refreshIcon}></img>
          </a>
        </div>

        <div className="App-body-container">
          <div className="App-list-content">
            <ProcessList processes={tasks} />
          </div>

          <div className="App-list-right-buttons">

          </div>
        </div>

        <div className="App-body-bottom"></div>
      </body>
    </div>
  );
}

export default App;
