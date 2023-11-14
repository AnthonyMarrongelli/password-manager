import React from "react";
import {Await, useLoaderData} from "react-router-dom";
import LoginEntry from "../components/LoginEntry.js";
import SecureNoteEntry from "../components/SecureNoteEntry.js";
import CreditCardEntry from "../components/CreditCardEntry.js";

const Entries = () => {
  // @ts-ignore
  const {items} = useLoaderData();

  return <div className="entry-list">
    <React.Suspense fallback={<div className="loader">Loading...</div>}>
      <Await
        resolve={items}
        errorElement={<>Couldn't load anything...</>}
        children={(items) => items.length
          ? items.map(item => {
            switch (item.type) {
              case "secureNote": return <SecureNoteEntry noteInfo={item} />;
              case "card": return <CreditCardEntry cardInfo={item} />;
              default: return <LoginEntry loginInfo={item} />;
            }})
          : <>No logins yet!</>}
      />
    </React.Suspense>
  </div>
}

export default Entries;
