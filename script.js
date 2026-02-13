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

  // User message
  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.innerText = text;
  messages.appendChild(userDiv);

  input.value = "";

  // Typing indicator
  const typing = document.createElement("div");
  typing.className = "bot-msg";
  typing.innerText = "typing...";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  try {
    let res;

    // 🔥 Retry logic (3 attempts)
    for (let i = 0; i < 3; i++) {
      try {
        res = await fetch("https://machnova-ai-2.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });

        if (!res.ok) {
          throw new Error("Server error");
        }

        break; // success → exit loop

      } catch (error) {
        if (i === 2) throw error; // last attempt failed
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
      }
    }

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
  const html = marked.parse(text);

  // 🔥 All links open in new tab
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const links = tempDiv.querySelectorAll("a");
  links.forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  return tempDiv.innerHTML;
}
