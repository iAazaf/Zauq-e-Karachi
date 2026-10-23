// 1. Apni saari API keys is array mein daal dein (API Key Rotation)
const API_KEYS = [
                  // "YOUR_API_KEY_HERE"
];

// Active key track karne ke liye pointer index
let currentKeyIndex = 0;

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");

// Memory local data hold karne ke liye
let allFoodData = [];

// 2. Page Load hote hi background mein dono files ka data load aur merge karein
async function loadLocalFoodData() {
    try {
        const [res1, res2] = await Promise.all([
            fetch("restaurants.json").then(r => r.ok ? r.json() : []),
            fetch("hidden-gems.json").then(r => r.ok ? r.json() : [])
        ]);
        
        // Dono arrays ko ek jagah jama (merge) kar dein
        allFoodData = [...res1, ...res2];
        console.log("Local Food Database Loaded! Total Items:", allFoodData.length);
    } catch (err) {
        console.error("Local JSON files load karne mein error:", err);
    }
}
// Automatically trigger data loading
loadLocalFoodData();

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Buttons ko disable karein taake repetitive requests na jayen
    sendBtn.disabled = true;
    input.disabled = true;

    addMessage(message, "user");
    input.value = "";
    
    // Typing indicator inside bubble structure
    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.id = "typing";
    typing.innerHTML = `<div class="bubble">Typing...</div>`;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. JavaScript Smart Filter: User ke text ke mutabiq items match karein
        const keywords = message.toLowerCase().split(" ");
        
        let matchingSpots = allFoodData.filter(spot => {
            const name = (spot.name || "").toLowerCase();
            const area = (spot.area || "").toLowerCase();
            const category = (spot.category || "").toLowerCase();
            const mustOrder = (spot.mustOrder || "").toLowerCase();
            const desc = (spot.desc || "").toLowerCase();

            // Agar user ke keywords mein se koi bhi word match kare
            return keywords.some(keyword => 
                keyword.length > 2 && ( // 2 letters se bade words hi check karein
                    name.includes(keyword) || 
                    area.includes(keyword) || 
                    category.includes(keyword) || 
                    mustOrder.includes(keyword) ||
                    desc.includes(keyword)
                )
            );
        });

        // Sirf top 4 relevance items uthayen taake prompt over-load na ho
        const relevantContext = matchingSpots.slice(0, 4);
        
        // Context string banayein AI ko dene ke liye
        let databaseContextText = "";
        if (relevantContext.length > 0) {
            databaseContextText = "Here are the matching restaurants/hidden gems found in our local database:\n" + 
                JSON.stringify(relevantContext, null, 2);
        } else {
            databaseContextText = "No direct exact match found in local database file for this specific query.";
        }

        // 🛑 LOAD BALANCING MAGIC: Active API key select karein aur index ko aage barha dein
        const ACTIVE_KEY = API_KEYS[currentKeyIndex];
        console.log(`Using Key Index: ${currentKeyIndex} for this request.`);
        
        // Agli request ke liye index update karein (Round-Robin order)
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

        // 4. API Request with contextual Injection & Rotated Key
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${ACTIVE_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are Zauq AI, an expert premium Karachi food guide app assistant. Your tone must be enthusiastic, food-loving, and premium magazine editorial style (using natural Roman Urdu).

CRITICAL INSTRUCTION:
1. First, look closely at the "Local Database Context" provided below. If relevant restaurants or hidden gems exist there, prioritize recommending them and mention their specific details (Name, Area, Must Order).
2. If the user asks for something that is NOT in the database, you can use your general knowledge of Karachi food to give amazing suggestions, but clearly state that these are bonus expert tips from Zauq.

Local Database Context:
${databaseContextText}

User Question: ${message}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 3000
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API Error");
        }

        document.getElementById("typing")?.remove();

        const reply = data.candidates?.[0]?.content?.parts
            .map(part => part.text)
            .join("") || "No response received.";

        addMessage(reply, "bot");

    } catch(err) {
        document.getElementById("typing")?.remove();
        addMessage("Something went wrong.", "bot");
        console.error(err);
    } finally {
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

function addMessage(text, type) {
    const div = document.createElement("div");
    // `.message.user` aur `.message.bot` classes dynamic alignment or filters ke liye
    div.className = `message ${type}`;
    div.innerHTML = `<div class="bubble">${text.replace(/\n/g, "<br>")}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}