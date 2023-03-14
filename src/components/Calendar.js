import React, { useEffect, useState } from "react";

const Calendar = (props) => {
  const [content, setContent] = useState([]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate(); // getMonth() starts from 0, new date(year, month) starts from 1
  };

  let [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  let [arrayDaysInMonth, setDaysInMonth] = useState([]);

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const startWeekDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    let daysInPreviousMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);

    let toAddArrayDaysInMonth = [];
    for (let i = daysInPreviousMonth + 2 - startWeekDay; i <= daysInPreviousMonth; i++) {
      toAddArrayDaysInMonth.push(i);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      toAddArrayDaysInMonth.push(i);
    }

    const endWeekDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth).getDay();
    for (let i = 1; i <= 7 - endWeekDay; i++) {
      toAddArrayDaysInMonth.push(i);
    }

    setDaysInMonth(toAddArrayDaysInMonth);
  }, [currentDate]);

  const selectDate = (day) => {
    let selectedDate = new Date(currentDate);
    selectedDate.setDate(day);
    props.setDate(selectedDate);

    props.setCalendar(false);
    props.setOverlayState(false)
  };

  const positionKey = props.selectedInput === "from" ? "right" : "left";

  return (
    <div
      // style={{
      //   padding: "15px",
      //   borderRadius: "5px",
      //   width: "320px",
      //   position: "absolute",
      //   top: 0,
      //   marginTop: "35px",
      //   backgroundColor: "#181818",
      //   [positionKey]: "-320px",
      //   zIndex: 2
      // }}
      style={{
        padding: "15px",
        borderRadius: "5px",
        width: "320px",
        position: "absolute",
        backgroundColor: "#181818",
        zIndex: 2,
        top:"5vh",
        right:0
      }}
    >
      <div
        className="header"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}
      >
        <button
          style={{
            color: "#fff",
            background: "none",
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={() => {
            let newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            setCurrentDate(newDate);
          }}
        >{`<`}</button>
        {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        <button
          style={{
            color: "#fff",
            background: "none",
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            marginLeft: "10px",
          }}
          onClick={() => {
            let newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
            setCurrentDate(newDate);
          }}
        >{`>`}</button>
      </div>
      <div
        className="content"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
        }}
      >
        {dayNames.map((dayName, index) => {
          return (
            <div style={{ width: "40px", fontSize: "15px" }} key={index}>
              {dayName.substring(0, 3)}
            </div>
          );
        })}
        {arrayDaysInMonth.map((day, index) => {
          const startWeekDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
          const endWeekDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth).getDay();

          let isDayInCurrentMonth = !(index < startWeekDay - 1 || index >= arrayDaysInMonth.length - (7 - endWeekDay));
          const dayColor = isDayInCurrentMonth ? "" : "gray";
          return (
            <div
              className="day"
              onClick={isDayInCurrentMonth ? () => selectDate(day) : null}
              style={{ width: "40px", ...(dayColor && { color: dayColor }) }}
              key={index}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
