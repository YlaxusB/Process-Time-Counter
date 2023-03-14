import React from "react";

const Overlay = (props) => {
    const overlayClicked = () => {
        props.setOverlayState(false);
        props.setCalendar(false);
    };

  return (
    <div
      onClick={() => {
        overlayClicked();
      }}
      className="overlay"
      style={{ zIndex: "1", height: "100vh", width: "100vw", position: "fixed" }}
    ></div>
  );
};

export default Overlay;
