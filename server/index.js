import app from "./app.js";
import MongoDB from "./db/mongodb.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    const port = process.env.PORT || 3000;
    await MongoDB.instance().connect();
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  } catch (err) {
    console.log("Failed to start: ", err);
  }
};

run();

process.on("SIGINT", async () => {
  await MongoDB.instance().disconnect();
  process.exit(0);
});