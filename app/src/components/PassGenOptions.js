import React, {useState} from "react";


const PassGenOptions = ({onSubmit, defaults, disabled}) => {
  const [length, setLength] = useState(defaults.length ?? 12);
  const [numbers, setNumbers] = useState(defaults.numbers ?? true);
  const [symbols, setSymbols] = useState(defaults.symbols ?? true);
  const [lowercase, setLowercase] = useState(defaults.lowercase ?? true);
  const [uppercase, setUppercase] = useState(defaults.uppercase ?? true);
  const [excludeSimilarCharacters, setExcludeSimilarCharacters] = useState(defaults.excludeSimilarCharacters ?? true);
  const [exclude, setExclude] = useState(defaults.exclude ?? "");
  const [strict, setStrict] = useState(defaults.strict ?? true);

  return (
    <form className="pass-gen" onSubmit={e => {e.preventDefault(); onSubmit({length, numbers, symbols, lowercase, uppercase, excludeSimilarCharacters, exclude, strict});}}>
      <label>
        Length: <input type="number" min="1" max="99" step="1" value={length} onChange={e => setLength(+e.currentTarget.value)} disabled={disabled} />
      </label>
      <label>
        Numbers: <input type="checkbox" checked={numbers} onChange={e => setNumbers(e.currentTarget.checked)} disabled={disabled} />
      </label>
      <label>
        Symbols: <input type="checkbox" checked={symbols} onChange={e => setSymbols(e.currentTarget.checked)} disabled={disabled} />
      </label>
      <label>
        Lowercase: <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.currentTarget.checked)} disabled={disabled} />
      </label>
      <label>
        Uppercase: <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.currentTarget.checked)} disabled={disabled} />
      </label>
      <label>
        Exclude similar: <input type="checkbox" checked={excludeSimilarCharacters} onChange={e => setExcludeSimilarCharacters(e.currentTarget.checked)} disabled={disabled} />
      </label>
      <label>
        Exclude custom: <input type="text" value={exclude} onChange={e => setExclude(e.currentTarget.value)} disabled={disabled} />
      </label>
      <label>
        Include characters from every group: <input type="checkbox" checked={strict} onChange={e => setStrict(e.currentTarget.checked)} disabled={disabled} />
      </label>

      <button type="submit" disabled={disabled}>Generate</button>
    </form>
  )
};

export default PassGenOptions;
