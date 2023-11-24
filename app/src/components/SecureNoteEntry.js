import React, {useLayoutEffect, useState} from "react";
import BaseEntry from "./BaseEntry.js";
import {authFetch} from "../auth.js";
import {useCookies} from "react-cookie";

const SecureNoteEntry = ({noteInfo, onSave, onDelete, devMode}) => {
  const [editable, setEditable] = useState(!noteInfo);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [unsaved, setUnsaved] = useState(false);
  const [cookies] = useCookies(["token", "userid"]);

  const init = () => {
    setTitle(noteInfo?.title ?? "");
    setText(noteInfo?.text ?? "");
  }

  useLayoutEffect(init, [noteInfo]);

  return (
    <BaseEntry className="secure-note"
      title={title}
      isNew={!noteInfo} isEmpty={!(title || text)}
      editable={editable} setEditable={setEditable} editing={unsaved} onEdit={() => setUnsaved(true)} onSave={async () => {
        const newNote = await authFetch(cookies, noteInfo?.id ? "/server/note/update/" + noteInfo.id : "/server/note/create", {body: {title, text}},
          devMode, {title, text, id: noteInfo?.id ?? ""+Math.random()}, 1000);
        setUnsaved(false);
        onSave(newNote);
      }}
      onCancel={() => {
        setUnsaved(false);
        init();
      }}
      onDelete={async () => {
        setUnsaved(true);
        if (noteInfo) await authFetch(cookies, "/server/note/delete/" + noteInfo.id, {body: {}},
          devMode, {}, 1000);
        onDelete();
      }}
    >
      <input type="text" required value={title} onChange={e => setTitle(e.currentTarget.value)} disabled={!editable} />
      <textarea onChange={e => setText(e.currentTarget.value)} disabled={!editable} value={text} />
    </BaseEntry>
  );
};

export default SecureNoteEntry;
