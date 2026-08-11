const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const https = require("https");
const fileUpload = require("express-fileupload");
const compression = require("compression");
require("dotenv").config();
const { sequelize } = require("./models");
const app = express();
const cron = require("node-cron");
const {
  validateSubscriptions,
  ProductExpiryDateAlert,
} = require("./helper/cron");

app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
  })
);
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(fileUpload());

// Base Set Public
app.use("/public", express.static(path.join(__dirname, "/public/")));

// Routes
app.use("/", require("./routes/index"));

// crons
// cron.schedule(
//   // "0 0 * * *",
//   "27 14 * * *",
//   async () => {
    
//     await ProductExpiryDateAlert();
//   },
//   {
//     timezone: "Asia/Kolkata",
//   }
// );

// Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(8989, () => {
  console.log("Server is running on http://localhost:8989");
});

// Working

const PORT = process.env.Port; // 8989;
// const certPath = path.resolve(
//   __dirname,
//   "../../ssl/certs/node_bapatoptics_com_990d4_75901_1784371135_2b1ab06e3b95fa2f59e1d1188b545c0e.crt"
// );

// const keyPath = path.resolve(
//   __dirname,
//   "../../ssl/keys/990d4_75901_bbe380625bed513cd38d33c73b90bf42.key"
// );

// const options = {
//   key: fs.readFileSync(keyPath),
//   cert: fs.readFileSync(certPath),
// };

// https.createServer(options, app).listen(PORT, () => {
//   console.log("Server is running on " + `http://localhost:${PORT}`);
// });