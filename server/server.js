const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const commandRoutes = require("./routes/commands");

dotenv.config();

const app = express();

// ✅ Must be before any routes
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use("/api", commandRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
