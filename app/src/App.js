import './App.css';
import React from "react";
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements, defer} from "react-router-dom";
import {CookiesProvider, useCookies} from "react-cookie";
import Index from "./pages/Index.js";
import Entries from "./pages/Entries.js";

const getAuth = () => {
  return document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
};
const authFetch = (url, {body={}, ...options}, debugFallback, debugWait=0) => {
  const auth = getAuth();
  if (window.location.hostname === "localhost")
    return debugFallback ? new Promise(res => setTimeout(() => {console.log("waited!"); res(debugFallback)}, debugWait)) : Promise.reject("no debug fallback!")
  return fetch(url, {
      method: "POST",
      ...options,
      body: JSON.stringify({
        token: auth,
        ...body,
      }),
    }).then(res => {if (res.ok) return res.json(); throw res})
}

const debugFetch = (url, options, debug, loadTime=0) => {
  return (window.location.hostname === "localhost")
    ? new Promise(res => setTimeout(() => res(debug), loadTime))
    : fetch(url, options).then(res => res.json());
};

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Index />}>
        {/* <Route index /> */}
        <Route path="/logins"
          loader={async () => defer({items: authFetch("/api/logins", {}, [
            {key: "1", application: "an item!", username: "user1", password: "password1"},
            {key: "2", application: "another item!", username: "user2", password: "pass2"},
          ], 1000)})}
          element={<Entries />}
        />
        <Route path="/notes"
          loader={async () => defer({items: authFetch("/api/secure-notes", {}, [
            {key: "1", type: "secureNote", title: "A secure note! Not really.", text: "Lorem ipsum dolor sit amet, or whatever."},
            {key: "2", type: "secureNote", title: "Another fake secure note!", text: "Lorem ipsum dolor sit amet II, or whatever."},
          ], 1000)})}
          element={<Entries />}
        />
        <Route path="/cards"
          loader={async () => defer({items: authFetch("/api/cards", {}, [
            {key: "1", type: "card", cardNumber: "1234567890123456", firstName: "Cardholder", lastName: "One", cvv: "111", expiration: "2025-01", bank: "Bank of Cardholding"},
            {key: "2", type: "card", cardNumber: "2345678901234561", firstName: "Cardholder", lastName: "Two", cvv: "222", expiration: "2025-02", bank: "Cardholders Inc"},
          ], 1000)})}
          element={<Entries />}
        />
        <Route path="/*" element={<>Whoops! Page not found.</>} />
      </Route>
    )
  );

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  );
};

export default App;
