const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db/index");
require("dotenv").config();
require("./config")(app);  // Apply middleware configuration
const PORT = process.env.PORT || 5005;


// Routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);  // Ensure this line is present


// Middleware
app.use(express.json());
app.use(cors());

// Error handling (must be after all routes)
require("./error-handling"  )(app);

module.exports = app;
// Start the server
const server = () => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

server();
