export const formatList = list => list.length > 2 ? list.slice(0, -1).join(", ") + ", and " + list.at(-1) : list.length === 2 ? list.join(" and ") : list.join("");
