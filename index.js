const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
const rootPath = require("./routes/rootPath");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
// const router = express.Router();
// const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
dotenv.config();
// const fs = require('fs-extra');
// const fileUpload = require('express-fileupload');

// Our Socket
// const http = require("http");
// // const socketIO = require("socket.io");
// // our server instance
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// old
const io = require("socket.io")(8900, {
  cors: {
    // origin: "*",
    origin: true,
    // origin: "https://mbstu-chat-box.web.app",
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // When connect
  console.log("a user connected.");

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // When disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// Our Express
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
// app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware

app.use(express.json());
// app.use('/uploads', express.static('uploads'));
// app.use(helmet());
// app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('uploads'));
// app.use(fileUpload());
app.use(cors({origin: true}));

app.use(rootPath);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(process.env.PORT || port)