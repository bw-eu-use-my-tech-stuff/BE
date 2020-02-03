const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("../routes/authRouter");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);

server.get("/api", (req, res) => {
  res.status(200).json({ message: `This server is working correctly` });
});

module.exports = server;
