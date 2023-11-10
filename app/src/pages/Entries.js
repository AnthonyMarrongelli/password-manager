import React from "react";
import {Await, useLoaderData} from "react-router-dom";
import LoginEntry from "../components/LoginEntry.js";

const Entries = () => {
  // @ts-ignore
  const {items} = useLoaderData();
  console.log(items);


  return <div className="entry-list">
    <React.Suspense fallback={<div className="loader">Loading...</div>}>
      <Await
        resolve={items}
        errorElement={<>Couldn't load anything...</>}
        children={
          (items) => (console.log("hahah", items), items.length ? items.map(item => <LoginEntry loginInfo={item} />) : <>No logins yet!</>)
        }
      />
    </React.Suspense>
  </div>
}

export default Entries;
