import React from "react";
import "./SidebarOption.css";

function SidebarOption(props) {

  return (
    <div className="sidebarOption">
      <props.Icon />
      <h2>{props.text}</h2>
    </div>
  );
}

export default SidebarOption;