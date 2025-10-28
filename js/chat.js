const historyLimit = 50;
let currentChannel = "general";

function loadHistory(channel) {
  const history = JSON.parse(localStorage.getItem(`chat-${channel}`)) || [];
  const chatHistory = document.getElementById("chat-history");
  chatHistory.innerHTML = "";
  history.forEach(msg => appendMessage(msg.text, msg.self, false));
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function saveMessage(channel, text, self = true) {
  let history = JSON.parse(localStorage.getItem(`chat-${channel}`)) || [];
  history.push({ text, self });
  if (history.length > historyLimit) {
    history = history.slice(history.length - historyLimit);
  }
  localStorage.setItem(`chat-${channel}`, JSON.stringify(history));
}

function appendMessage(text, self = true, save = true) {
  const chatHistory = document.getElementById("chat-history");
  const div = document.createElement("div");
  div.classList.add("chat-message");
  if (self) div.classList.add("self");
  div.textContent = text;
  chatHistory.appendChild(div);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  if (save) saveMessage(currentChannel, text, self);
}

// Switch channels
document.querySelectorAll(".channel-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentChannel = btn.dataset.channel;
    loadHistory(currentChannel);
  });
});

// Send message
document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (text) {
    appendMessage(text, true, true);
    input.value = "";
  }
});

// Enter key sends
document.getElementById("message-input").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("send-btn").click();
  }
});

// Initial load
loadHistory(currentChannel);
