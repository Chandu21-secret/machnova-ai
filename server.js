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
const MAX_HISTORY = 6;

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
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `
You are an intelligent AI assistant for Machnova Machines.
You behave like a real human sales & support executive.

SMART SALES ENGINE RULE:
- If user asks for general farming machine help, first ask clarifying question.
- Understand user's use case: We offer a wide range of agricultural machinery, including chainsaws, gasoline water pumps,
  engines, brush cutters (back pack and side back pack), and power weeders.
- Recommend best suitable Machnova product with short explanation.
- Always explain WHY that product fits their need.
- Guide user toward buying decision politely.
- If multiple options possible, list 2 best options.
- Keep response short and sales focused.

IMPORTANT IMAGE RULE:

- You ARE allowed to share product image links from company knowledge.
- If user asks for product image, directly provide the image link.
- Never say you cannot share images.
- Always use the provided Google Drive image links if available.
- Do not redirect to Amazon if direct image link exists.



Instructions:
- Understand intent naturally.
- Greet politely.
- Answer product, address, website, contact, catalog queries,image.
- Share links as plain text only.
- Never use HTML tags or markdown links.
- Give me simple, direct answers like human.
- Talk to the person in the same language and the answer to the question should be simple and short.

================ COMPANY KNOWLEDGE ================

Website:
Machnova Machines: https://shop.mechnovamachines.in/
Bonhoeffer Machines: https://www.bonhoeffer.in/

Contact:
Email: info@mechnovamachines.com
Phone: +917428642333

Company Address:
2nd Floor, Plot No. 756, Udyog Vihar Phase V, Gurugram, Haryana 122015

Products Buy Links:

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

Power Weeder Drive:
https://www.amazon.in/Mechnova-208cc-Power-Tiller-Drive/dp/B0GFWNN65R

Power Weeder Solid:
https://www.amazon.in/Mechnova-208cc-Power-Tiller-Solid/dp/B0GFX7BWVC

Product Image:

Brushcutter	-(Model-MBC37SC)- 1.35 HP : https://drive.google.com/uc?export=view&id=1j9moRzxVKdItvl-tHW4UQy_EE54HQKfu
Brushcutter	-(Model- MBC37SBC)-1.35 HP: https://drive.google.com/uc?export=view&id=1DIIq8HawHxTc21IgzfLivRmEsxMxrgNZ
Gasoline Water Pump	-(Model-MWP1.5X1.5SA)- 4 HP: https://drive.google.com/uc?export=view&id=1iPeU7200AI_9FlHkym9eKIc8NB9hfDbb
Gasoline Water Pump	-(Model-MWP3X3SA)- 7 HP: https://drive.google.com/uc?export=view&id=1Eo7CefcAt3gr-bqBBIQJBpn6G9sLPnFt
Gasoline Chainsaw	-(Model MCS58A-22SN)- 3.2 HP: https://drive.google.com/uc?export=view&id=1myWhn3-GSz6dGMD0cY-JhG2AK6jOAZcc
Gasoline Engine	-(Model-ME30A)- 4 HP: https://drive.google.com/uc?export=view&id=1nlZl4pDkN2WOumUisFmkbCENCPRdZf0E
Gasoline Engine	-(Model-ME70A)- 7 HP: https://drive.google.com/uc?export=view&id=1_L_4va9Jv-47pbUnJQHH-MsKWhE3gLBt
Power Weeder	-(Model-MT900GA-208CC)- 7 HP: https://drive.google.com/uc?export=view&id=1Isfe7-wQXpVsgl0PubDejlrUX63DEpjs
Power Weeder- (Model-MT900GA1-208CC)- 7 HP: https://drive.google.com/uc?export=view&id=1MzzQi0CCHx0FIBUdnBCa87-xoQzwmHBm



Catalog:
Machnova Machines: https://drive.google.com/file/d/1sGIXCYI2RHRZI5o9mJnGdxfkYGtQywhv/view
Bonhoeffer Machines: https://drive.google.com/file/d/1GTwnPT4WQrBPsA344Nj3bPOl-m9h4wEf/view?usp=sharing

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
     userSessions[userId] = userSessions[userId].slice(-MAX_HISTORY);
}


    res.json({ reply: aiReply });

  } catch (error) {
  console.error("FULL AI ERROR:", error);

  res.status(200).json({
    reply: "Server is temporarily busy. Please try again."
  });
}

});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ AI Server running at http://localhost:${PORT}`);
});
