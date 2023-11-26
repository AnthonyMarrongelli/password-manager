import React, {useState} from "react";
import {ExpandedIcon, CollapsedIcon, UpdateIcon, EditIcon, CreateIcon, DeleteIcon, CancelIcon} from "./Icon.js";

const BaseEntry = ({children, className="", editing, editable, setEditable, onEdit, onSave, onCancel, onDelete, title="", subtitle="", isNew=false, isEmpty=false, error=""}) => {
  const [isCollapsed, setCollapsed] = useState(true);
  const [isDeleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isActuallyDeleting, setActuallyDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const cancel = async () => {
    if (isNew) {
      if (isEmpty) setCollapsed(true);
      else setDeleting(true);
    } else {
      setEditable(false);
      onCancel();
    }
    setSaveError("");
  }
  const submit = async () => {
    setEditable(false);
    try {
      await onSave();
    } catch (e) {
      setSaveError(e);
      setEditable(true);
    }
  }
  const del = async () => {
    setActuallyDeleting(true);
    if (isNew) {
      onCancel();
      setCollapsed(true);
    }
    try {
      await onDelete();
    } catch (e) {
      setActuallyDeleting(false);
      setDeleteError(e);
    }
  }

  return (
    <li className={"entry " + className + (isCollapsed ? " collapsed" : "")}>
      <header>
        <div className="entry-heading">
          <h2>{title || (isNew ? <i>New entry</i> : <i>Untitled entry</i>)}</h2>
          {subtitle && <h3>{subtitle}</h3>}
        </div>
        <span className="entry-buttons">
          <button type="button" onClick={() => setCollapsed(!isCollapsed)} disabled={!children || (editing && (!isNew || !isEmpty))} aria-label={isCollapsed ? "Expand" : "Collapse"} className="icon-button">{isCollapsed ? <CollapsedIcon /> : <ExpandedIcon />}</button>
        </span>
      </header>
      <form onSubmit={e => {e.preventDefault(); submit()}}>
        <fieldset disabled={isDeleting}>
          {children}
        </fieldset>
        <fieldset className="edit-controls" disabled={isDeleting || (editing && !editable)}>
          {
            editing
            ? <>
              {error && <span className="error-message">{error}</span>}
              {saveError && <span className="error-message">{saveError}</span>}
              <button type="reset" onClick={e => {e.preventDefault(); cancel()}} aria-label="Cancel" className={"icon-button" + (isNew ? " destructive" : "")}><CancelIcon /></button>
              <button type="submit" aria-label={isNew ? "Create" : "Update"} className="icon-button primary">{isNew ? <CreateIcon /> : <UpdateIcon />}</button>
            </>
            : <>
              <button type="button" onClick={() => { setEditable(true); onEdit() }} aria-label="Edit" className="icon-button"><EditIcon /></button>
              <button type="button" onClick={() => { setDeleting(true); }} aria-label="Delete" className="icon-button destructive"><DeleteIcon /></button>
            </>
          }
        </fieldset>
        { isDeleting && <fieldset className="overlay">
          <p>Really delete {title ? <b>{title}</b> : "this untitled entry"}?</p>
          <fieldset className="edit-controls" disabled={isActuallyDeleting}>
            {deleteError && <span className="error-message">{deleteError}</span>}
            <button type="button" onClick={() => {setDeleting(false); if (editing) setEditable(true); setDeleteError("")}}>Cancel</button>
            <button type="submit" className="destructive" onClick={e => {e.preventDefault(); del()}}>Delete</button>
          </fieldset>
        </fieldset> }
      </form>
    </li>
  );
};

export default BaseEntry;
