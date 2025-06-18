const socket = io("http://localhost:5000");

const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const room = params.get("room");

document.getElementById("roomTitle").innerText = `Room: ${room}`;
socket.emit("groupChat", room);

// Terima pesan dari server

socket.on("groupChatMessage", (data) => {
  console.log(data);
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.textContent = `${data.senderId}: ${data.message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Kirim pesan ke server
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  socket.emit("sendGroupChatMessage", {
    roomId: room,
    message,
    senderId: username,
  });
  messageInput.value = "";
});
