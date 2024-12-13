const express = require("express");
const bodyParser = require("body-parser");
const carRoutes = require("./car_routes.js");
const repository=require("./repository/repository.js");

const app = express();

// Middleware
app.use(bodyParser.json());

// API routes
app.use("/api/rental", carRoutes);

// Port

const PORT = 3000; // Możesz zmienić według potrzeb
const startServer=async()=>{
  await repository.init();
  console.log("Odpalił init");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();