import React, {useState} from "react";

const BaseEntry = ({heading, children, className="", editing, onEdit, onSave, onCancel}) => {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <li className={"entry " + className + (isCollapsed ? " collapsed" : "")}>
      <header>
        {heading}
        <span className="entry-buttons">
          {
            editing
            ? <>
              <button type="button" onClick={() => { onCancel(); }}>[Cancel]</button>
              <button type="button" onClick={() => { onSave(); }}>[Save]</button>
            </>
            : <>
              <button type="button" onClick={() => { setCollapsed(false); onEdit() }}>[Edit]</button>
              <button type="button" onClick={() => setCollapsed(!isCollapsed)} disabled={!children}>[Collapse/Expand]</button>
            </>
          }
        </span>
      </header>
      <div>
        {children}
      </div>
    </li>
  );
};

export default BaseEntry;
