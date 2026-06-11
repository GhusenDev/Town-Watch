const WebSocket = require("ws");

const profileId = "4107783";

const ws = new WebSocket(
  `wss://socket.aoe2companion.com/listen?handler=ongoing-matches&profile_ids=${profileId}`
);

ws.on("open", () => {
  console.log("CONNECTED");
});

ws.on("message", (data) => {
  const text = data.toString();

  try {
    const json = JSON.parse(text);
    console.log("JSON:", JSON.stringify(json));
  } catch (e) {
    console.log("RAW:", text);
  }
});

ws.on("close", () => {
  console.log("DISCONNECTED");
});

ws.on("error", (err) => {
  console.log("ERROR:", err.message);
});