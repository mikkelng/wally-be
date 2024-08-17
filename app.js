const express = require("express");
require("./db");
require("dotenv").config();

const PORT = process.env.PORT || 5005;


const app = express();
require("./config")(app);  // Apply middleware configuration
// Routes
const indexRoutes = require("./routes/index.routes");
app.use("/auth", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);  // Ensure this line is present

const expenseRoutes = require('./routes/expenses.routes');
app.use("api", expenseRoutes);

const incomeRoutes = require('./routes/income.routes');
app.use("/api", incomeRoutes);

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
module.exports = app;