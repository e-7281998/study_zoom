import express from "express";
import WebSocket from "ws";
import http from "http";

//---http 서버
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
//---http 서버

//---webSocket 서버
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    console.log("Cnnected to Browser ✓");
    socket.on("close", () => { console.log("Disconnected to Browser ✕"); });
    socket.on("message", (msg) => { console.log("New Message: " + msg); });
    socket.send("hello?");
});

server.listen(3000, handleListen);