import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";

const SecureNoteEntry = ({noteInfo}) => {
  const [title, setTitle] = useState(noteInfo.title);
  const [text, setText] = useState(noteInfo.text);
  const [editable, setEditable] = useState(false);

  return (
    <BaseEntry key={noteInfo.key} className="secure-note"
      title={title}
      editing={editable} onEdit={() => setEditable(true)} onSave={() => {
        setEditable(false);
        // TODO
      }}
      onCancel={() => {
        setEditable(false);
        setTitle(noteInfo.title); setText(noteInfo.text);
      }}
    >
      <input type="text" required value={title} onChange={e => setTitle(e.currentTarget.value)} disabled={!editable} />
      <textarea onChange={e => setText(e.currentTarget.value)} disabled={!editable} value={text} />
    </BaseEntry>
  );
};

export default SecureNoteEntry;
