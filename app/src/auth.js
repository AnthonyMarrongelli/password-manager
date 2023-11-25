export const debugFetch = (url, {body = {}, ...options}, devMode, debugFallback, debugWait = 0) => {
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

export const authFetch = ({token="", userid=""}, url, {body, ...options}, devMode, debugFallback, debugWait = 0) =>
  debugFetch(url, {...options, body: {...body, token, userid}}, devMode, debugFallback, debugWait);
