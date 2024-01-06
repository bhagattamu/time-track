const app = require("./config/express");
const { port, env } = require("./config/vars");
const mongoose = require("./config/mongo");

mongoose.connect();

app.listen(port, () => {
  console.log(`Server is running in port: ${port} in ${env} environment`);
});
