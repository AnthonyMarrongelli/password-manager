export const debugFetch = (url, {body = {}, ...options}, devMode, debugFallback, debugWait = 0) => {
  if (devMode)
    return debugFallback
      ? new Promise(res => setTimeout(() => res(debugFallback), debugWait))
      : Promise.reject("no debug fallback!");
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
      throw "Unexpected response. Try again later.";
    }
    console.error(json, "when fetching", url);
    throw json.message;
  }, err => {
    console.error(err, "when fetching", url);
    throw "The server is not responding. Try again later.";
  });
};

export const authFetch = ({token="", userid=""}, url, {body, ...options}, devMode, debugFallback, debugWait = 0) =>
  debugFetch(url, {...options, body: {...body, token, userid}}, devMode, debugFallback, debugWait);
