const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

const { run } = require("./db/connexionDb");
import mongoose from "mongoose";
import router from "./routes/data";
app.use(cors());
app.use(bodyParser.json());

app.use(router);

run()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(
      `An error occurred while connecting to the database: ${error}`
    );
  });
