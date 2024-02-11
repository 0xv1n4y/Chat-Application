const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");
app.use(cors());

const path = require("path");

connectDB();
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

//---------Deployment----------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "/client/dist/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//---------Deployment----------------

const server = app.listen(PORT, () =>
  console.log(`server is Running in ${PORT}...`.yellow.bold)
);

//Socket.io Connection

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connected to server ");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Join The Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newmessageRecived) => {
    var chat = newmessageRecived.chat;
    if (!chat.users) return console.log("USers is not defined");
    chat.users.forEach((user) => {
      if (user._id == newmessageRecived.sender._id) return;
      socket.in(user._id).emit("message Recived", newmessageRecived);
    });

    socket.off("setup", () => {
      console.log("USer Disconnected");
      socket.leave(userData._id);
    });
  });
});
