
// CHAT LOGIC

function toggleChat() {
  const box = document.getElementById("chatBox");
  box.style.display = box.style.display === "flex" ? "none" : "flex";
}

async function send() {
  const input = document.getElementById("msg");
  const messages = document.getElementById("messages");

  const text = input.value.trim();
  if (!text) return;

  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.innerText = text;
  messages.appendChild(userDiv);

  input.value = "";

  const typing = document.createElement("div");
  typing.className = "bot-msg";
  typing.innerText = "typing...";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("https://machnova-ai-2.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typing.remove();

    const botDiv = document.createElement("div");
    botDiv.className = "bot-msg";
    botDiv.innerHTML = formatReply(data.reply);
    messages.appendChild(botDiv);

    messages.scrollTop = messages.scrollHeight;

  } catch (err) {
    typing.remove();
    const errDiv = document.createElement("div");
    errDiv.className = "bot-msg";
    errDiv.innerText = "AI connection error";
    messages.appendChild(errDiv);
  }
}



function handleEnter(e) {
  if (e.key === "Enter") {
    send();
  }
}


function formatReply(text) {
  return marked.parse(text);
}






