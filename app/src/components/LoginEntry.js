import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";
import CopyableInput from "./CopyableInput.js";
import {generate} from "generate-password-browser";
import PassGenOptions from "./PassGenOptions.js";

const LoginEntry = ({loginInfo}) => {
  const [application, setApplication] = useState(loginInfo.application);
  const [username, setUsername] = useState(loginInfo.username);
  const [password, setPassword] = useState(loginInfo.password);
  const [editable, setEditable] = useState(false);

  return (
    <BaseEntry key={loginInfo.key} className="login"
      title={application}
      subtitle={username}
      editing={editable} onEdit={() => setEditable(true)} onSave={() => {
        setEditable(false);
        // TODO
      }}
      onCancel={() => {
        setEditable(false);
        setApplication(loginInfo.application); setUsername(loginInfo.username); setPassword(loginInfo.password);
      }}
    >
      <label>
        Application: <input type="text" required value={application} onChange={e => setApplication(e.currentTarget.value)} disabled={!editable} />
      </label>
      <label>
        Username: <CopyableInput text={username} onChange={setUsername} disabled={!editable} />
      </label>
      <label>
        Password: <CopyableInput text={password} onChange={setPassword} maskable disabled={!editable} />
      </label>
      {editable && (
        <details>
          <summary>Password generator</summary>
          <PassGenOptions defaults={{}} onSubmit={options => setPassword(generate(options))} disabled={!editable} />
        </details>
      )}
    </BaseEntry>
  );
};

export default LoginEntry;
