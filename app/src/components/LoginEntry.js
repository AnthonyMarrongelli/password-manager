import React, {useState} from "react";
import BaseEntry from "./BaseEntry.js";
import CopyableInput from "./CopyableInput.js";
import {generate} from "generate-password-browser";
import PassGenOptions from "./PassGenOptions.js";
import {authFetch} from "../auth.js";
import {useCookies} from "react-cookie";

const LoginEntry = ({passInfo, onSave, onDelete, devMode}) => {
  const [application, setApplication] = useState(passInfo?.application ?? "");
  const [username, setUsername] = useState(passInfo?.username ?? "");
  const [password, setPassword] = useState(passInfo?.password ?? "");
  const [unsaved, setUnsaved] = useState(!passInfo);
  const [cookies] = useCookies(["token", "userid"]);

  return (
    <BaseEntry key={passInfo?.id} className="login"
      title={application}
      subtitle={username}
      isNew={!passInfo} isEmpty={!(username || password || application)}
      editing={unsaved} onEdit={() => {setUnsaved(true)}} onSave={async () => {
        const newPass = await authFetch(cookies, passInfo?.id ? "/server/pass/update/" + passInfo.id : "/server/pass/create", {body: {username, password, application}},
          devMode, {username, password, application, id: passInfo?.id ?? ""+Math.random()}, 1000);
        setUnsaved(false);
        onSave(newPass);
      }}
      onCancel={() => {
        setApplication(passInfo.application); setUsername(passInfo.username); setPassword(passInfo.password);
        setUnsaved(false);
      }}
      onDelete={async () => {
        setUnsaved(true);
        if (passInfo) await authFetch(cookies, "/server/pass/delete/" + passInfo.id, {body: {}},
          devMode, {}, 1000);
        onDelete();
      }}
    >
      <label>
        Application: <input type="text" required value={application} onChange={e => setApplication(e.currentTarget.value)} />
      </label>
      <label>
        Username: <CopyableInput text={username} onChange={setUsername} />
      </label>
      <label>
        Password: <CopyableInput text={password} onChange={setPassword} maskable />
      </label>
      {unsaved && (
        <details>
          <summary>Password generator</summary>
          <PassGenOptions defaults={{}} onSubmit={options => setPassword(generate(options))} />
        </details>
      )}
    </BaseEntry>
  );
};

export default LoginEntry;
