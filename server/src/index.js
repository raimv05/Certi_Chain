require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
