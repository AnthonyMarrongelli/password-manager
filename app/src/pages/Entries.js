import React from "react";
import {Await, useLoaderData} from "react-router-dom";
import LoginEntry from "../components/LoginEntry.js";
import SecureNoteEntry from "../components/SecureNoteEntry.js";
import CardEntry from "../components/CardEntry.js";

const Entries = ({onEnterDevMode}) => {
  // @ts-ignore
  const {items} = useLoaderData();

  return <div className="entry-list">
    <React.Suspense fallback={<div className="loader">Loading...</div>}>
      <Await
        resolve={items}
        errorElement={<>Couldn't load anything...{onEnterDevMode && <p style={{color: "#400", backgroundColor: "#fdd"}}>Try <button onClick={onEnterDevMode}>dev mode</button>?</p>}</>}
        children={(items) => items.length
          ? items.map(item => {
            switch (item.type) {
              case "secureNote": return <SecureNoteEntry noteInfo={item} />;
              case "card": return <CardEntry cardInfo={item} />;
              default: return <LoginEntry loginInfo={item} />;
            }})
          : <>No entries yet!</>}
      />
    </React.Suspense>
  </div>
}

export default Entries;
