require("dotenv").config();
const cors=require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const carRoutes = require("./car_routes.js");
const repository=require("./repository/repository.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/rental", carRoutes);


const PORT = process.env.PORT;
const startServer=async()=>{
  await repository.init();
  console.log("init complete");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();