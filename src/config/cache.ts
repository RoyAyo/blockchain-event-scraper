import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
  },
});

(async () => {
  await client.connect();
})();

client.on("ready", async function () {
  client.on("error", function () {
    //still more logging to doc
    console.log("Error connecting to cache");
  });
  console.log("Cache is connected and ready");
});

export default client;
