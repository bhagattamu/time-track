const app = require("./config/express");
const { port, env, apiVersion } = require("./config/vars");
const routes = require(`./api/v${apiVersion}/routes`);
const mongoose = require("./config/mongo");

app.get("/health", (_req, res) => {
  res.status(200).send("Healthy");
});

app.use(`/api/v${apiVersion}`, routes);

mongoose.connect();

app.listen(port, () => {
  console.log(`Server is running in port: ${port} in ${env} environment`);
});
