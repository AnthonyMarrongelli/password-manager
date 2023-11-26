import React, {useLayoutEffect, useState} from "react";
import {CopyIcon, ShownIcon, HiddenIcon} from "./Icon.js";

const BaseCopyableInput = ({copyText, children, className=""}) => (
  <span className={"entry-input " + className}>
    {children}
    <button type="button" onClick={() => { navigator.clipboard.writeText(copyText); }} aria-label="Copy" className="icon-button"><CopyIcon /></button>
  </span>
);

const CardInput = ({text, disabled=false, onChange}) => {
  const [masked, setMasked] = useState(text.length > 4);
  const [tempUnmasked, setTempUnmasked] = useState(false);  // necessary to allow input while it's masked

  useLayoutEffect(() => {
    if (disabled && text.length > 4) setMasked(true);
  }, [text, disabled]);

  return (
    <BaseCopyableInput copyText={text}>
      <input type="text" className={masked ? "masked" : ""} disabled={disabled} value={masked && !tempUnmasked && text.length > 4 ? "•".repeat(text.length - 4) + text.slice(-4) : text} inputMode="numeric" onFocus={e => setTempUnmasked(true)} onChange={e => {onChange(e.currentTarget.value)}} onBlur={e => setTempUnmasked(false)} required />
      <button type="button" onClick={() => setMasked(!masked)} aria-label={masked ? "Show" : "Hide"} className="icon-button">{masked ? <HiddenIcon /> : <ShownIcon />}</button>
    </BaseCopyableInput>
  )
}

const CopyableInput = ({text, inputMode="text", maskable=false, disabled=false, onChange, maxLength=-1, minLength=0, required=false}) => {
  const [masked, setMasked] = useState(maskable);

  useLayoutEffect(() => {
    if (disabled && maskable) setMasked(true);
  }, [disabled, maskable]);

  return (
    <BaseCopyableInput copyText={text}>
      <input type={masked ? "password" : "text"} inputMode={inputMode} className={masked ? "masked" : ""} disabled={disabled} value={text} onChange={e => onChange(e.currentTarget.value)} minLength={minLength} maxLength={maxLength} required={required} />
      {maskable && <button type="button" onClick={() => setMasked(!masked)} aria-label={masked ? "Show" : "Hide"} className="icon-button">{masked ? <HiddenIcon /> : <ShownIcon />}</button>}
    </BaseCopyableInput>
  );
}

export default CopyableInput;
export {CardInput};
