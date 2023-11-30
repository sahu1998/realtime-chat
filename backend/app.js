const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/dbConnect");
const authRoute = require("./routes/auth.route");
const chatRoute = require("./routes/chat.route");
const mesageRoute = require("./routes/message.route");
require("dotenv").config();
const app = express();
connectDb();
const PORT = process.env.PORT || 8000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("uploads"));
app.use("/user", authRoute);
app.use("/chat", chatRoute);
app.use("/message", mesageRoute);
const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("userdata: ",userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room)=>{
    socket.join(room);
    console.log("User Joined Room: ", room);
  })

  socket.on("typing", (room)=> {
    socket.in(room).emit("typing");
  })

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved)=>{
    let chat = newMessageRecieved.chat;
    if(!chat.users){
      console.log("chat.users not defined")
      return;
    }

    chat.users.forEach((user)=>{
      if(user._id== newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
