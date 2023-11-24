import React, {useState} from "react";
import {Await, Link, useLoaderData} from "react-router-dom";
import LoginEntry from "../components/LoginEntry.js";
import SecureNoteEntry from "../components/SecureNoteEntry.js";
import CardEntry from "../components/CardEntry.js";
import {useCookies} from "react-cookie";

const updateEntry = (entries, setEntries, i) => newItem => {
  const newEntries = entries.slice();
  newEntries[i] = newItem;
  setEntries(newEntries);
}
const deleteEntry = (entries, setEntries, i) => () => {
  const newEntries = entries.slice(0, i).concat(entries.slice(i+1));
  setEntries(newEntries);
}
const appendEntry = (entries, setEntries) => (newItem) => {
  const newEntries = entries.concat(newItem);
  setEntries(newEntries);
}

const EntriesList = ({items, DefaultEntryKind, devMode}) => {
  const [entries, setEntries] = useState(items);

  return entries.map((item, i) => {
    switch (item.type) {
      case "secureNote": return <SecureNoteEntry noteInfo={item} key={item.id} onSave={updateEntry(entries, setEntries, i)} onDelete={deleteEntry(entries, setEntries, i)} devMode={devMode} />;
      case "card": return <CardEntry cardInfo={item} key={item.id} onSave={updateEntry(entries, setEntries, i)} onDelete={deleteEntry(entries, setEntries, i)} devMode={devMode} />;
      default: return <LoginEntry passInfo={item} key={item.id} onSave={updateEntry(entries, setEntries, i)} onDelete={deleteEntry(entries, setEntries, i)} devMode={devMode} />;
    }
  }).concat(<DefaultEntryKind onSave={appendEntry(entries, setEntries)} devMode={devMode} />);
}

const Entries = ({defaultType, onEnterDevMode, devMode}) => {
  const [cookies] = useCookies(["token"]);
  const loaderData = /** @type {{items: object[]}} */ (useLoaderData());

  if (!cookies.token) return <div className="error-page">
    <p>You need to be logged in to see this page. <Link to="/">Go back home</Link></p>
  </div>

  return <div className="entry-list">
    <React.Suspense fallback={<div className="loader">Loading...</div>}>
      <Await
        resolve={loaderData.items}
        errorElement={<span className="error-message">Couldn't load anything...{onEnterDevMode && <p style={{color: "#400", backgroundColor: "#fdd"}}>Try <button onClick={onEnterDevMode}>dev mode</button>?</p>}</span>}
        children={(items) => items.length
          ? <EntriesList DefaultEntryKind={defaultType === "secureNote" ? SecureNoteEntry : defaultType === "card" ? CardEntry : LoginEntry} items={items.map(({_id, ...item}) => ({id: _id, type: defaultType, ...item}))} devMode={devMode} />
          : <>No entries yet!</>}
      />
    </React.Suspense>
  </div>
}

export default Entries;
