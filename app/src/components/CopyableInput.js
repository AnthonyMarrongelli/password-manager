import React, {useState} from "react";

const BaseEntryCell = ({copyText, children, className=""}) => (
  <span className={"entry-input " + className}>
    {children}
    {copyText && <button type="button" onClick={() => { navigator.clipboard.writeText(copyText); }}>[Copy]</button>}
  </span>
);

const CardInput = ({text, disabled, onChange}) => {
  const [masked, setMasked] = useState(true);

  return (
    <BaseEntryCell copyText={text}>
      <input type="text" className={masked ? "masked" : ""} disabled={disabled} readOnly={masked} value={masked && text.length > 4 ? "•".repeat(text.length - 4) + text.slice(-4) : text} inputMode="numeric" onChange={e => onChange(e.currentTarget.value)} required />
      <button type="button" onClick={() => setMasked(!masked)}>[Show/Hide]</button>
    </BaseEntryCell>
  )
}

const CopyableInput = ({text, inputMode="text", maskable=false, disabled=false, onChange, maxLength=-1, minLength=0, required=false}) => {
  const [masked, setMasked] = useState(maskable);

  return (
    <BaseEntryCell copyText={text}>
      <input type={masked ? "password" : "text"} inputMode={inputMode} className={masked ? "masked" : ""} disabled={disabled} value={text} onChange={e => onChange(e.currentTarget.value)} minLength={minLength} maxLength={maxLength} required={required} />
      {maskable && <button type="button" onClick={() => setMasked(!masked)}>[Show/Hide]</button>}
    </BaseEntryCell>
  );
}

export default CopyableInput;
export {CardInput};