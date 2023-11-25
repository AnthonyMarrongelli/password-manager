import React, {useLayoutEffect, useState} from "react";
import BaseEntry from "./BaseEntry.js";
import CopyableInput from "./CopyableInput.js";
import {generate} from "generate-password-browser";
import PassGenOptions from "./PassGenOptions.js";
import {authFetch} from "../auth.js";
import {useCookies} from "react-cookie";

const LoginEntry = ({passInfo, onSave, onDelete, devMode}) => {
  const [editable, setEditable] = useState(!passInfo);
  const [application, setApplication] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [unsaved, setUnsaved] = useState(!passInfo);
  const [cookies] = useCookies(["token", "userid"]);

  const init = () => {
    setApplication(passInfo?.application ?? "");
    setUsername(passInfo?.username ?? "");
    setPassword(passInfo?.password ?? "");
  }

  // layout effects run before the component's added to DOM
  useLayoutEffect(init, [passInfo]);

  return (
    <BaseEntry key={passInfo?.id} className="login"
      title={application}
      subtitle={username}
      isNew={!passInfo} isEmpty={!(username || password || application)}
      editable={editable} setEditable={setEditable} editing={unsaved} onEdit={() => {setUnsaved(true)}} onSave={async () => {
        const newPass = await authFetch(cookies, passInfo?.id ? "/server/pass/update/" : "/server/pass/create", {body: {username, password, application, _id: passInfo?.id}},
          devMode, {username, password, application, _id: passInfo?.id ?? ""+Math.random()}, 1000);
        setUnsaved(false);
        onSave(newPass);
      }}
      onCancel={() => {
        setUnsaved(false);
        init();
      }}
      onDelete={async () => {
        setUnsaved(true);
        if (passInfo) await authFetch(cookies, "/server/pass/delete", {body: {_id: passInfo.id}},
          devMode, {}, 1000);
        onDelete();
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
      {unsaved && (
        <details>
          <summary>Password generator</summary>
          <PassGenOptions defaults={{}} onSubmit={options => setPassword(generate(options))} disabled={!editable} />
        </details>
      )}
    </BaseEntry>
  );
};

export default LoginEntry;
