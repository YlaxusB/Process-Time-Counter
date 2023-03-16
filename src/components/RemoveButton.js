import { userInfo } from "os";
import trashIcon from "../Icons/trash-icon.svg";
import React, { useState } from "react";
import RemoveOverlay from "./RemoveOverlay";

const RemoveButton = (props) => {
  const [isTryingRemove, setIsTryingRemove] = useState(false);

  const RemoveButtonClick = () => {
    setIsTryingRemove(!isTryingRemove);
  };

  return (
    <div className="removeButtonDiv">
      {isTryingRemove && <RemoveOverlay setIsTryingRemove={setIsTryingRemove} processName={props.processName} setFilters={props.setFilters}></RemoveOverlay>}

      <button
        className="trash-button"
        onClick={() => {
          RemoveButtonClick();
        }}
      >
        <img src={trashIcon} />
      </button>
    </div>
  );
};

export default RemoveButton;
