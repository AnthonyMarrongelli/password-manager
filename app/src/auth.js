export const debugFetch = (url, {body = {}, ...options}, devMode, debugFallback, debugWait = 0) => {
  const isDevelopment = window.location.hostname === "localhost" && process.env.NODE_ENV === "development";
  if (devMode)
    return debugFallback
      ? new Promise(res => setTimeout(() => res(debugFallback), debugWait))
      : Promise.reject("no debug fallback!");
  if (isDevelopment) {
    const editedURL = new URL(url);
    editedURL.port = "3005";
    //url = editedURL.toString();
  }
  return fetch(url, {
    method: "POST",
    ...options,
    body: JSON.stringify(body),
  }).then(async res => {
    if (res.ok) return res.json();
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      // we're probably POSTing to the wrong route, then.
      console.error(text, "when fetching", url);
      throw "Unexpected response. Try again later." + (isDevelopment ? `(error "${e.message}" when fetching "${url}")` : "");
    }
    console.error(json, "when fetching", url);
    throw json.message + (isDevelopment ? `(error returned from server when fetching "${url}")` : "");
  }, err => {
    console.error(err, "when fetching", url);
    throw "The server is not responding. Try again later." + (isDevelopment ? `(network error "${err.message}" when fetching "${url}")` : "");
  });
};

export const authFetch = ({token="", userid=""}, url, {body, ...options}, devMode, debugFallback, debugWait = 0) =>
  debugFetch(url, {...options, body: {...body, token, userid}}, devMode, debugFallback, debugWait);
