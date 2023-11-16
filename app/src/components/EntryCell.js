import React, {useState} from "react";

const BaseEntryCell = ({copyText, children}) => (
  <td>
    {children}
    {copyText && <button type="button" onClick={() => { navigator.clipboard.writeText(copyText); }}>[Copy]</button>}
  </td>
);

const CardEntryCell = ({text, disabled, onChange}) => {
  const [masked, setMasked] = useState(true);

  return (
    <BaseEntryCell copyText={text}>
      <input type="text" className={masked ? "masked" : ""} disabled={disabled} readOnly={masked} value={masked && text.length > 4 ? "•".repeat(text.length - 4) + text.slice(-4) : text} inputMode="numeric" onChange={e => onChange(e.currentTarget.value)} required />
      <button type="button" onClick={() => setMasked(!masked)}>[Show/Hide]</button>
    </BaseEntryCell>
  )
}

const EntryCell = ({text, copyable=false, maskable=false, disabled=false, onChange, maxLength=undefined, minLength=0, required=false}) => {
  const [masked, setMasked] = useState(maskable);

  return (
    <BaseEntryCell copyText={copyable && text}>
      <input type={masked ? "password" : "text"} className={masked ? "masked" : ""} disabled={disabled} value={text} onChange={e => onChange(e.currentTarget.value)} minLength={minLength} maxLength={maxLength} required={required} />
      {maskable && <button type="button" onClick={() => setMasked(!masked)}>[Show/Hide]</button>}
    </BaseEntryCell>
  );
}

export default EntryCell;
export {CardEntryCell};
