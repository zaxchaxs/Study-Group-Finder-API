const socket = io("http://localhost:5000");

const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const room = params.get("room");

document.getElementById("roomTitle").innerText = `Room: ${room}`;
socket.emit("groupChat", room);

// error listen
socket.on("sendGroupChatMessageError", error => {
  console.error(error);
});

// Terima pesan dari server
socket.on("groupChatMessage", (messages) => {
  console.log("Received messages:", messages);

  const chatBox = document.getElementById("chatBox");

  // Clear existing messages before adding new ones,
  // or decide if you want to just append.
  // chatBox.innerHTML = ''; // Uncomment if you want to clear previous messages

  // Ensure messages.data is an array before trying to map
  if (messages && Array.isArray(messages.data)) {
    messages.data.forEach((message) => {
      // Create a div for each message
      const msgElement = document.createElement("div");
      
      // Add a class for styling (optional, but good practice)
      msgElement.classList.add("chat-message"); 

      // Assuming each message object has a 'sender' and 'text' property.
      // Adjust these property names based on your actual message structure.
      msgElement.innerHTML = `<strong>${message.author.name}:</strong> ${message.content}`;
      
      // Append the new message div to the chatBox
      chatBox.appendChild(msgElement);
    });

    // Optional: Scroll to the bottom of the chat box after adding messages
    chatBox.scrollTop = chatBox.scrollHeight;

  } else {
    console.error("Received message data is not an array:", messages);
    // Handle cases where messages.data might be a single message object, 
    // or not an array as expected.
    if (messages && messages.author.name && messages.content) {
        const msgElement = document.createElement("div");
        msgElement.classList.add("chat-message");
        msgElement.innerHTML = `<strong>${messages.author.name}:</strong> ${messages.content}`;
        chatBox.appendChild(msgElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
});

// listen new message
socket.on("receiveGroupChatMessage", message => {
  console.log("New message received:", message);

  const chatBox = document.getElementById("chatBox");

  // Create a div for the new message
  const msgElement = document.createElement("div");
  msgElement.classList.add("chat-message");
  msgElement.innerHTML = `<strong>${message.author.name}:</strong> ${message.content}`;

  // Append the new message div to the chatBox
  chatBox.appendChild(msgElement);

  // Scroll to the bottom of the chat box after adding the new message
  chatBox.scrollTop = chatBox.scrollHeight;
})


// Kirim pesan ke server
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  socket.emit("sendGroupChatMessage", {
    groupId: room,
    authorId: username,
    content: message,
  });
  messageInput.value = "";
});
