import React from "react";

const ProcessList = (props) => {
    console.log(props)
     const processes = props.processes.map(element => {
         return (
             <div className="process">{element.MainWindowTitle}</div>
         )
    });

    return(
        <div className="processList container">{processes}</div>
    )
}

export default ProcessList;