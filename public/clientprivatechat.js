// client.js
const socket = io("http://localhost:5000"); // Sesuaikan dengan URL server Socket.IO Anda

// Ambil ID user dari URL parameter
const params = new URLSearchParams(window.location.search);
const myUserId = params.get("myId"); // ID user yang sedang login
const chatId = params.get("chatId"); // ID user yang ingin di-chat

// Referensi DOM elements
const chatHeader = document.getElementById("chatHeader");
const chatBox = document.getElementById("chatBox");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

let currentChatId = null; // Akan disimpan setelah chat diinisialisasi

// --- Validasi ID User ---
if (!myUserId || !chatId) {
    chatHeader.innerText = "Error: Missing user IDs in URL.";
    alert("Please provide 'myId' and 'chatId' in the URL query parameters. Example: ?myId=1&chatId=2");
    messageForm.style.display = 'none'; // Sembunyikan form pengiriman pesan
} else {
    // --- Langkah 1: Kirim event untuk menginisialisasi atau bergabung ke private chat ---
    // Server akan menemukan atau membuat PrivateChat dan mengembalikan chatId dan riwayat pesan
    chatHeader.innerText = `Establishing chat with user ${chatId}...`;
    socket.emit("private chat", chatId);
}

// --- Event Listeners dari Server ---

// Event untuk menampilkan error dari server (misalnya validasi gagal)
socket.on("privateChatError", (error) => {
    console.error("Private Chat Error:", error);
    chatHeader.innerText = `Error: ${error.message || "Failed to initialize chat"}`;
    alert(`Error: ${error.message || "Failed to initialize chat"}`);
    messageForm.style.display = 'none'; // Sembunyikan form jika ada error fatal
});

socket.on("sendPrivateChatMessageError", (error) => {
    console.error("Private Chat Error:", error);
    chatHeader.innerText = `Error: ${error.message || "Failed to initialize chat"}`;
    alert(`Error: ${error.message || "Failed to initialize chat"}`);
    messageForm.style.display = 'none'; // Sembunyikan form jika ada error fatal
});

// Event yang dipancarkan server setelah PrivateChat ditemukan/dibuat dan user bergabung ke room
// Ini juga akan mengirimkan riwayat pesan awal
socket.on("private chat message", (data) => {
    console.log("Private chat initialized:", data);
    currentChatId = data.id;
    chatHeader.innerText = `Chatting with: ${myUserId === data.userOne.id ? data.userOne.name : data.userTwo.name}`;

    // Render pesan awal/riwayat
    if (data.messages && Array.isArray(data.messages)) {
        data.messages.forEach((message) => {
            appendMessage(message, myUserId);
        });
    } else {
        console.warn("No initial messages or data.messages is not an array:", data);
    }
    scrollToBottom();
});

// Event untuk menerima pesan baru secara realtime
socket.on("receive new private chat message", (message) => {
    console.log("New private message received:", message);
    appendMessage(message, myUserId);
    scrollToBottom();
});

function appendMessage(message, currentUserId) {
    const msgElement = document.createElement("div");
    msgElement.classList.add("chat-message", "p-2", "rounded-lg", "mb-2"); // Tailwind classes for styling

    // Tambahkan class 'self' jika pesan dikirim oleh user yang sedang login
    if (message.author && message.author.id && message.author.id.toString() === currentUserId.toString()) {
        msgElement.classList.add("self", "bg-indigo-100", "text-indigo-800"); // Tailwind: light indigo background, dark indigo text
        msgElement.innerHTML = `<div class="text-xs text-right opacity-75">${message.author.name || 'You'}</div><div class="text-right">${message.content}</div>`;
    } else {
        msgElement.classList.add("bg-white", "text-gray-800"); // Tailwind: white background, gray text
        msgElement.innerHTML = `<div class="text-xs text-blue-600">${message.author.name || 'Unknown User'}</div><div>${message.content}</div>`;
    }

    chatBox.appendChild(msgElement);
}

// Menggulir kotak chat ke bawah
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Mengirim Pesan dari Form ---
messageForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah refresh halaman
    const content = messageInput.value.trim(); // Ambil isi pesan dan hapus spasi di awal/akhir

    if (!content) {
        // Jangan kirim pesan kosong
        return;
    }

    if (!currentChatId) {
        console.error("Chat not initialized yet. Cannot send message.");
        alert("Chat is not ready. Please wait or check for errors.");
        return;
    }

    // Kirim event sendPrivateChatMessage ke server
    socket.emit("send private chat message", {
        chatId: currentChatId,
        authorId: Number(myUserId), // Pastikan authorId adalah number
        content: content,
    });

    messageInput.value = ""; // Bersihkan input setelah pesan terkirim
    messageInput.focus(); // Fokuskan kembali input
});

// Memastikan bahwa ketika halaman dimuat, input pesan siap digunakan
window.onload = () => {
    if (myUserId && chatId && myUserId !== chatId) {
        messageInput.focus();
    }
};
