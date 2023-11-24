import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";
import {authFetch} from "../auth.js";
import {useCookies} from "react-cookie";

const SecureNoteEntry = ({noteInfo, onSave, onDelete, devMode}) => {
  const [title, setTitle] = useState(noteInfo?.title ?? "");
  const [text, setText] = useState(noteInfo?.text ?? "");
  const [unsaved, setUnsaved] = useState(false);
  const [cookies] = useCookies(["token", "userid"]);

  return (
    <BaseEntry className="secure-note"
      title={title}
      isNew={!noteInfo} isEmpty={!(title || text)}
      editing={unsaved} onEdit={() => setUnsaved(true)} onSave={async () => {
        const newNote = await authFetch(cookies, noteInfo?.id ? "/server/note/update/" + noteInfo.id : "/server/note/create", {body: {title, text}},
          devMode, {title, text, id: noteInfo?.id ?? ""+Math.random()}, 1000);
        setUnsaved(false);
        onSave(newNote);
      }}
      onCancel={() => {
        setUnsaved(false);
        setTitle(noteInfo?.title ?? ""); setText(noteInfo?.text ?? "");
      }}
      onDelete={async () => {
        setUnsaved(true);
        if (noteInfo) await authFetch(cookies, "/server/note/delete/" + noteInfo.id, {body: {}},
          devMode, {}, 1000);
        onDelete();
      }}
    >
      <input type="text" required value={title} onChange={e => setTitle(e.currentTarget.value)} disabled={!unsaved} />
      <textarea onChange={e => setText(e.currentTarget.value)} disabled={!unsaved} value={text} />
    </BaseEntry>
  );
};

export default SecureNoteEntry;
