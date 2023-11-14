import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";
import EntryCell from "./EntryCell.js";
import {generate} from "generate-password-browser";
import PassGenOptions from "./PassGenOptions.js";

const LoginEntry = ({loginInfo}) => {
  const [application, setApplication] = useState(loginInfo.application);
  const [username, setUsername] = useState(loginInfo.username);
  const [password, setPassword] = useState(loginInfo.password);
  const [editable, setEditable] = useState(false);

  return (
    <BaseEntry key={loginInfo.key} className="login"
      editing={editable} onEdit={() => setEditable(true)} onSave={() => {
        setEditable(false);
        // TODO
      }}
      onCancel={() => {
        setEditable(false);
        setApplication(loginInfo.application); setUsername(loginInfo.username); setPassword(loginInfo.password);
      }}
      heading={<>
        <EntryCell text={application} onChange={setApplication} disabled={!editable} />
        <EntryCell text={username} onChange={setUsername} copyable disabled={!editable} />
        <EntryCell text={password} onChange={setPassword} copyable maskable disabled={!editable} />
      </>}
    >
      {JSON.stringify(loginInfo)}
      <PassGenOptions defaults={{}} onSubmit={options => setPassword(generate(options))} disabled={!editable} />
    </BaseEntry>
  );
};

export default LoginEntry;
