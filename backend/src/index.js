const express = require("express");
const cors = require("cors");
const path = require("path");

const { ServerConfig, DBConfig, RabbitMqConfig } = require("./config/index");
const { TranscodingRoute } = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use("/hls-output", express.static(path.join(process.cwd(), "hls-output")));

app.get("/", (req, res) => {
  res.send("server running !!!");
});
app.use("/transcode", TranscodingRoute);

app.listen(ServerConfig.PORT, async () => {
  try {
    await DBConfig.connectDatabse();
    await RabbitMqConfig.connectQueue();
    await RabbitMqConfig.receiveData();
    console.log(
      `Successfully started the user server on : http://localhost:${ServerConfig.PORT}`
    );
  } catch (error) {
    console.log(error);
  }
});
