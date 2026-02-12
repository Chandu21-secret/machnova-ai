// ================================
// MACHNOVA Q&A DATABASE (LOCAL)
// ================================

const QA_DATA = [
  {
    q: ["machnova machines website", "website"],
    a: "https://shop.mechnovamachines.in/"
  },
  {
    q: ["buy link of mwp1.5x1.5sa", "mwp1.5x1.5sa"],
    a: "https://amazon.in/xxxxx"
  },
  {
    q: ["company address", "address"],
    a: "2nd Floor, Plot No. 756, Udyog Vihar Phase V, Gurugram, Haryana 122015"
  },
  {
    q: ["petrol water pump"],
    a: "https://www.amazon.in/Mechnova-Heavy-Duty-Petrol-Water/dp/B0GFWTMJC1"
  },
  {
    q: ["petrol water pump 1.5 inch", "1.5 inch water pump"],
    a: "https://www.amazon.in/Mechnova-Self-Priming-Petrol-Water/dp/B0GFWSY886"
  },
  {
    q: ["petrol engine 210cc"],
    a: "https://www.amazon.in/Mechnova-210cc-4-Stroke-Petrol-Engine/dp/B0GG3B1QLT"
  },
  {
    q: ["petrol engine 113cc"],
    a: "https://www.amazon.in/Mechnova-113cc-4-Stroke-Petrol-Engine/dp/B0GG3NTF9W"
  },
  {
    q: ["4 stroke brushcutter", "stroke brushcutter"],
    a: "https://www.amazon.in/Mechnova-1-35-4-Stroke-Brushcutter-37-7cc/dp/B0GFWY6B3C"
  },
  {
    q: ["chainsaw"],
    a: "https://www.amazon.in/Mechnova-58cc-Petrol-Chainsaw-Inch/dp/B0GG32JK5K"
  },
  {
    q: ["brushcutter"],
    a: "https://www.amazon.in/Mechnova-4-Stroke-Backpack-Brushcutter-37-7cc/dp/B0GFWMQ27N"
  },
  {
    q: ["power tiller"],
    a: "https://www.amazon.in/Mechnova-208cc-Power-Tiller-Drive/dp/B0GFWNN65R"
  },
  {
    q: ["mbc37sc image"],
    a: "https://drive.google.com/file/d/1j9moRzxVKdItvl-tHW4UQy_EE54HQKfu/view"
  },
  {
    q: ["catalog", "mechnova catalog"],
    a: "https://drive.google.com/file/d/1sGIXCYI2RHRZI5o9mJnGdxfkYGtQywhv/view"
  },
  {
    q: ["bonhoeffer machines"],
    a: "https://bonhoeffermachines.com/en/"
  },

  {
    q: ["contact details", "contact information", "email and phone"],
    a: "info@mechnovamachines.com, +917428642333"
  }
];

// ================================
// CHAT LOGIC
// ================================

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

  // Remove any unwanted HTML tags
  text = text.replace(/<[^>]*>/g, "");

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, (url) => {

    // Always return clickable link (no image rendering)
    return `<a href="${url}" target="_blank" style="color:#2575fc; font-weight:600; word-break:break-all;">
              ${url}
            </a>`;
  });
}







