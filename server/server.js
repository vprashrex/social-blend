require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { default: axios } = require("axios");

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_DB_HOST_NAME);

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("DB CONNECTED"));

const authRouter = require("./routes/auth");
const influencersRouter = require("./routes/influencers");
const listsRouter = require("./routes/lists");
const paymentsRouter = require("./routes/payments");
const ordersRouter = require("./routes/orders");
const walletsRouter = require("./routes/wallets");

app.use(express.json());
app.use("/auth", authRouter);
app.use("/influencers", influencersRouter);
app.use("/lists", listsRouter);
app.use("/payments", paymentsRouter);
app.use("/orders", ordersRouter);
app.use("/wallets", walletsRouter);
app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));

app.use("/public", express.static(__dirname + "/public/"));

const server = app.listen(4000);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_HOST_NAME,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (orderId) => {
    socket.join(orderId);
    socket.emit("connected");
  });

  socket.on("joinChat", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", (newMessage) => {
    socket.in(newMessage.orderId).emit("messageReceived", newMessage);
  });

  socket.on("typing", (roomId) => socket.in(roomId).emit("typing"));
  socket.on("stopTyping", (roomId) => socket.in(roomId).emit("stopTyping"));
});
