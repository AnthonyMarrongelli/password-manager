export const debugFetch = (url, {body = {}, ...options}, devMode, debugFallback, debugWait = 0) => {
  console.log("devMode:", devMode);
  if (devMode)
    return debugFallback
      ? new Promise(res => setTimeout(() => res(debugFallback), debugWait))
      : Promise.reject("no debug fallback!");
  return fetch(url, {
    method: "POST",
    ...options,
    body: JSON.stringify(body),
  }).then(res => {if (res.ok) return res.json(); throw res;});
};

export const authFetch = (auth, url, {body = {}, ...options}, devMode, debugFallback, debugWait = 0) =>
  debugFetch(url, {...options, body: { token: auth, ...body }}, devMode, debugFallback, debugWait);
