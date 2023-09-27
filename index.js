const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./db");

//router imports
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

//mongoose db connection
connectDB();

//.env config
dotenv.config();
//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `server connected to ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white
  );
});
