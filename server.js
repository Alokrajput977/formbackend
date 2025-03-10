const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));


const authRoutes = require("./auth");
app.use("/api/auth", authRoutes);

// Enable CORS for localhost:30000
app.use(cors({
  origin: "http://localhost:3000", // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true // Allow cookies if required
}));


app.get("/api/dashboard/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const dashboardData = {
    message: `Dashboard data for card ${id}`,
    details: { visits: Math.floor(Math.random() * 100), sales: Math.floor(Math.random() * 50) }
  };
  res.json(dashboardData);
});

// app.get("/api/table/:id", async (req, res) => {
//   const { id } = req.params;
//   console.log(id)
//   const dashboardData = {
//     message: `Dashboard data for card ${id}`,
//     details: { visits: Math.floor(Math.random() * 100), sales: Math.floor(Math.random() * 50) }
//   };
//   res.json(dashboardData);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
