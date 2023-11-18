import React from "react";
import {Await, Link, useLoaderData} from "react-router-dom";
import LoginEntry from "../components/LoginEntry.js";
import SecureNoteEntry from "../components/SecureNoteEntry.js";
import CardEntry from "../components/CardEntry.js";
import {useCookies} from "react-cookie";

const Entries = ({onEnterDevMode}) => {
  const [cookies] = useCookies(["token"]);
  const loaderData = /** @type {{items: object[]}} */ (useLoaderData());

  if (!cookies.token) return <div className="error-page">
    <p>You need to be logged in to see this page. <Link to="/">Go back home</Link></p>
  </div>

  return <div className="entry-list">
    <React.Suspense fallback={<div className="loader">Loading...</div>}>
      <Await
        resolve={loaderData.items}
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
