const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ================= MEMORY STORAGE =================
const userSessions = {};
const MAX_HISTORY = 12;

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Serve Frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ================= CHAT API =================
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.ip;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message is required." });
  }

  // Create session if not exists
  if (!userSessions[userId]) {
    userSessions[userId] = [];
  }

  // Push user message
  userSessions[userId].push({
    role: "user",
    content: userMessage
  });

  // Trim memory
  if (userSessions[userId].length > MAX_HISTORY) {
    userSessions[userId].shift();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `
You are an intelligent AI assistant for Machnova Machines.
You behave like a real human sales & support executive.

SMART SALES ENGINE RULE:
- If user asks for general farming machine help, first ask clarifying question.
- Understand user's use case (grass cutting, tilling, pumping water, heavy cutting).
- Recommend best suitable Machnova product with short explanation.
- Always explain WHY that product fits their need.
- Guide user toward buying decision politely.
- If multiple options possible, list 2 best options.
- Keep response short and sales focused.

Instructions:
- Understand intent naturally.
- Greet politely.
- Answer product, address, website, contact, catalog queries.
- Share links as plain text only.
- Never use HTML tags or markdown links.

================ COMPANY KNOWLEDGE ================

Website:
https://shop.mechnovamachines.in/

Contact:
Email: info@mechnovamachines.com
Phone: +917428642333

Company Address:
2nd Floor, Plot No. 756, Udyog Vihar Phase V, Gurugram, Haryana 122015

Products:

Petrol Water Pump:
https://www.amazon.in/Mechnova-Heavy-Duty-Petrol-Water/dp/B0GFWTMJC1

Petrol Water Pump 1.5 Inch:
https://www.amazon.in/Mechnova-Self-Priming-Petrol-Water/dp/B0GFWSY886

Petrol Engine 210cc:
https://www.amazon.in/Mechnova-210cc-4-Stroke-Petrol-Engine/dp/B0GG3B1QLT

Petrol Engine 113cc:
https://www.amazon.in/Mechnova-113cc-4-Stroke-Petrol-Engine/dp/B0GG3NTF9W

4 Stroke Brushcutter:
https://www.amazon.in/Mechnova-1-35-4-Stroke-Brushcutter-37-7cc/dp/B0GFWY6B3C

Chainsaw:
https://www.amazon.in/Mechnova-58cc-Petrol-Chainsaw-Inch/dp/B0GG32JK5K

Backpack Brushcutter:
https://www.amazon.in/Mechnova-4-Stroke-Backpack-Brushcutter-37-7cc/dp/B0GFWMQ27N

Power Tiller Drive:
https://www.amazon.in/Mechnova-208cc-Power-Tiller-Drive/dp/B0GFWNN65R

Power Tiller Solid:
https://www.amazon.in/Mechnova-208cc-Power-Tiller-Solid/dp/B0GFX7BWVC

Horsepower:
Brushcutter: 1.35 HP
Water Pump 1.5: 4.8 HP
Water Pump 3x3: 6.5 HP
Chainsaw: 2.2 HP
Power Weeder: 6.5 HP

Catalog:
https://drive.google.com/file/d/1sGIXCYI2RHRZI5o9mJnGdxfkYGtQywhv/view

Price List:
https://drive.google.com/file/d/1JFGpEDyUwaFDl6WYyHltttSZu4hJvttA/view

=================================================
`
        },
        ...userSessions[userId]
      ]
    });

    const aiReply = completion.choices[0].message.content;

    // Save AI reply
    userSessions[userId].push({
      role: "assistant",
      content: aiReply
    });

    if (userSessions[userId].length > MAX_HISTORY) {
      userSessions[userId].shift();
    }

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({
      reply: "Sorry, something went wrong. Please try again."
    });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ AI Server running at http://localhost:${PORT}`);
});
