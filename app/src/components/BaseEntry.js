import React, {useState} from "react";

const BaseEntry = ({key, heading, children, className=""}) => {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    // <details key={key} {...props} open={!isCollapsed} onToggle={e => setCollapsed(!e.currentTarget.open)}>
    //   <summary>{name}</summary>
    //   {children}
    // </details>
    <li key={key} className={"entry " + className + (isCollapsed ? " collapsed" : "")}>
      <header>{heading}</header>
      <div>
        {children}
      </div>
    </li>
  );
};

export default BaseEntry;
