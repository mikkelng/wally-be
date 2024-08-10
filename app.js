const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db/index");
const { readdirSync } = require("fs");

require("dotenv").config();

const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

// app.get('/', (req, res )=>{
//     res.send('hello')
// } )

readdirSync("./routes").map((route) =>
  app.use("/api/v1", require("./routes/" + route))
);
const server = () => {
  app.listen(PORT, () => {
    console.log("listening to port:", PORT);
  });
};

server();
