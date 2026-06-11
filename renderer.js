const { ipcRenderer } = require("electron");

const db = {};

function getElo(name) {
  return db[name] || "unknown";
}

async function scan(names) {

  const result = names.map(n => ({
    name: n,
    elo: getElo(n)
  }));

  const el = document.getElementById("info");

  if (!el) return;

  el.innerHTML = result
    .map(r => `${r.name}: ${r.elo}`)
    .join("<br>");
}