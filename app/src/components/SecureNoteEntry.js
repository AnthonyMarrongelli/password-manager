import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";
import EntryCell from "./EntryCell.js";

const SecureNoteEntry = ({noteInfo}) => {
  const [title, setTitle] = useState(noteInfo.title);
  const [text, setText] = useState(noteInfo.text);
  const [editable, setEditable] = useState(false);

  return (
    <BaseEntry key={noteInfo.key} className="secure-note"
      editing={editable} onEdit={() => setEditable(true)} onSave={() => {
        setEditable(false);
        // TODO
      }}
      onCancel={() => {
        setEditable(false);
        setTitle(noteInfo.application); setText(noteInfo.text);
      }}
      heading={<>
        <EntryCell text={title} onChange={setTitle} disabled={!editable} />
      </>}
    >
      <textarea onChange={e => setText(e.currentTarget.value)} disabled={!editable} value={text} />
    </BaseEntry>
  );
};

export default SecureNoteEntry;
