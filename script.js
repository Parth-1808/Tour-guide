let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let ChatContainer = document.querySelector(".chat-container");
let userMessage = null;
let messageHistory = []; // 🧠 NEW: stores conversation
let Api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD5bp2Ve994hUJOVsi9PqddjEF0mck49wQ';

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

async function getApiResponse(aiChatBox) {
    try {
        let fixedResponses = {
            "hi": "Hi there! How can I help you with Travel?",
            "hello": "Hello! I'm here to help with your Travel-related questions. How can I support you?"
        };

        if (fixedResponses[userMessage.toLowerCase()]) {
            aiChatBox.querySelector(".text").innerText = fixedResponses[userMessage.toLowerCase()];
            aiChatBox.querySelector(".loading").remove();
            return;
        }

        let response = await fetch(Api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "model",
                        parts: [{
                            text: `
You are a highly professional and friendly travel assistant named Vigo (Virtual Go)  for a tour guide. 
if i tell me my name  then you should call me by my name respectfully and friendly. 
Your role is to provide **accurate** travel-related information.  
Always respond in a polite, conversational, and engaging tone, similar to ChatGPT.  
You can assist with:  
- Answering general travel, picnic questions.
- Providing all tips related to tourists.
- Provide travel plans.

### travel Guidance  
- Help users understand possible guidance.  

### distance Tips  
- Provide clear and concise advice.  

### related Information  
- General guidance on extra tips.  

### Conditions  
- Offer advice on managing conditions like time, food, seasons, etc.  

### costs  
- Topics which include costs to explore new places.  

### Child Health  
- Guidance on food, hotels, famous places.    

### Mental Wellness  
- Suggestions for stress management, mindfulness, and emotional well-being.  

### distances  
- Advice on suggesting means of transport.  

### social Awareness  
- General information about environment.  

### Special Recommendations  
- More places to visit nearby.  

### Friendly Greetings  
- Respond with: "Hi there! How can I assist you today?" or "Hello! I'm here to help with your travel-related questions. How can I support you?"  

🚫 If asked non-travel questions:
Respond only with:
"I'm here to assist with travel-related questions. How can I help you today?"

💡 Tone:
- Be empathetic, understanding, and professional. Short and concise.
- Use simple and clear language to ensure users feel supported and valued.
                            `.trim()
                        }]
                    },
                    ...messageHistory // 🧠 NEW: history included
                ]
            })
        });

        let data = await response.json();
        console.log(data);
        let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response, please tell me your query more clearly.";

        aiChatBox.querySelector(".text").innerText = textResponse;
        aiChatBox.querySelector(".loading").remove();

        // 🧠 NEW: Add AI response to history
        messageHistory.push({
            role: "model",
            parts: [{ text: textResponse }]
        });

    } catch (error) {
        console.log(error);
        aiChatBox.querySelector(".text").innerText = "Something went wrong.";
        aiChatBox.querySelector(".loading").remove();
    }
}

function showLoading() {
    let html = `
        <div class="img2">
            <img src="doctor.png" alt="" width="26">
        </div>
        <p class="text"></p>
        <img class="loading" src="logo.gif" alt="loading" width="50px" height="50px" style="border-radius: 50%;">
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    ChatContainer.appendChild(aiChatBox);
    getApiResponse(aiChatBox);
}

btn.addEventListener("click", () => {
    userMessage = prompt.value.trim();
    if (userMessage === "") {
        container.style.display = "flex";
        return;
    } else {
        container.style.display = "none";
    }

    // 🧠 NEW: Add user message to history
    messageHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    let html = `
        <div class="img">
            <img src="user.png" alt="" width="26">
        </div>
        <p class="text"></p>
    `;
    let userChatBox = createChatBox(html, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    ChatContainer.appendChild(userChatBox);
    prompt.value = "";
    setTimeout(showLoading, 500);
});

// ✅ Move enter key handling outside the click event
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});
