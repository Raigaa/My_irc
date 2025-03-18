const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const SocketConfig = require("./src/socket/SocketConfig.js");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = SocketConfig(server);

app.use(express.json());
app.use(cors());

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
