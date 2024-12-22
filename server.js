import express from "express";
import dotenv from "dotenv";
import dbConnection from "./databases/dbConnection.js";
import morgan from "morgan";
import cors from "cors";
import { init } from "./src/modules/index.routes.js";
import { createOnlineOrder } from "./src/modules/order/orderController.js";

dotenv.config();
const app = express();
const port = 3000;

//middleware
app.use(cors());
app.post('/webhook',express.raw({type:'application/json'}),createOnlineOrder)
app.use(express.json());

app.use(express.static("uploads"));
if (process.env.MODE == "development") {
  app.use(morgan("dev"));
}

app.use(morgan("dev"));

init(app);
dbConnection();
app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${port}!`)
);

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});
