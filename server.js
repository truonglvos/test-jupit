const express = require("express");
const cors = require("cors");
const app = express();
const port = 3300;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/jackpots", async (req, res) => {
  let statusCode;
  fetch("https://stage.whgstage.com/front-end-test/jackpots.php")
    .then((response) => {
      statusCode = response.status;
      return response.json();
    })
    .then((result) => {
      console.log(result);
      return res.status(statusCode).json(result);
    })
    .catch((error) => console.log("Error when calling games", error));
});

app.get("/games", async (req, res) => {
  let statusCode;
  fetch("https://stage.whgstage.com/front-end-test/games.php")
    .then((response) => {
      statusCode = response.status;
      return response.json();
    })
    .then((result) => {
      console.log(result);
      return res.status(statusCode).json(result);
    })
    .catch((error) => console.log("Error when calling games", error));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
