import express from "express";
// import WebSocket from "ws";
import SocketIO from 'socket.io';
import http from "http";
import { parse } from "path";

//---http 서버
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
//---http 서버

//--socketIO 서버
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome", socket.nickname);
        done();
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname)
});

//---webSocket 서버
// const wss = new WebSocket.Server({ httpServer });

// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Cnnected to Browser ✓");
//     socket.on("close", () => { console.log("Disconnected to Browser ✕"); });
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);

//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
// });

httpServer.listen(3000, handleListen);