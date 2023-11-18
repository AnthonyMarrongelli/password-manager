import React, {useState} from "react";

const BaseEntry = ({children, className="", editing, onEdit, onSave, onCancel, title="", subtitle=""}) => {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <li className={"entry " + className + (isCollapsed ? " collapsed" : "")}>
      <header>
        <div className="entry-heading">
          <h2>{title}</h2>
          {subtitle && <h3>{subtitle}</h3>}
        </div>
        <span className="entry-buttons">
          <button type="button" onClick={() => setCollapsed(!isCollapsed)} disabled={!children || editing}>[Collapse/Expand]</button>
        </span>
      </header>
      <div>
        {children}
        <div className="edit-controls">
          {
            editing
            ? <>
              <button type="button" onClick={() => { onCancel(); }}>[Cancel]</button>
              <button type="button" onClick={() => { onSave(); }}>[Save]</button>
            </>
            : <>
              <button type="button" onClick={() => { setCollapsed(false); onEdit() }}>[Edit]</button>
            </>
          }
        </div>
      </div>
    </li>
  );
};

export default BaseEntry;
