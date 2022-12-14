const socket = io();

const welcome = document.getElementById("welcome");
const welcomeRoom = welcome.querySelector("#welcomeRoom")
const nameForm = welcome.querySelector("#name");
const roomNameForm = welcome.querySelector("#roomName");
const room = document.getElementById("room");

room.hidden = true;
welcomeRoom.hidden = true;

let roomName;

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function handleMessageSubmit(e) {
    e.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You : ${value}`);
    });
    input.value = "";
}

// function handleNicknameSubmit(e) {
//     e.preventDefault();
//     const input = room.querySelector("#name input");
//     socket.emit("nickname", input.value);
// }

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room - ${roomName}`;
    const msgForm = room.querySelector("#msg");
    // const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    // nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(e) {
    e.preventDefault();
    const input = roomNameForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = ""
}

function handleNameSubmit(e) {
    e.preventDefault();
    const input = nameForm.querySelector("input");
    socket.emit("nickname", input.value);
    nameForm.hidden = true;
    welcomeRoom.hidden = false;
}

nameForm.addEventListener("submit", handleNameSubmit);
roomNameForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room - ${roomName} (${newCount})`;
    addMessage(`${user} Arrived!`);
});

socket.on("new_message", addMessage);

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room - ${roomName} (${newCount})`;
    addMessage(`${left} Left...`);
});

socket.on("room_change", (rooms) => {
    const roomList = welcomeRoom.querySelector("ul");

    roomList.innerHTML = "";

    if (rooms.length === 0) {
        return;
    }

    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});