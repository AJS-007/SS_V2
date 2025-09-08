// Floating icon toggle
    document.getElementById("chatbotIcon").onclick = () => {
      document.getElementById("chatOverlay").style.display = "block";
    };
    document.getElementById("chatOverlay").onclick = (e) => {
      if (e.target.id === "chatOverlay") {
        document.getElementById("chatOverlay").style.display = "none";
      }
    };

    // Translations
    const translations = {
      en: { title: "🦚 CraftSeek Assistant", placeholder: "Ask about an Art & Craft...", send: "Send" },
      hi: { title: "🦚 शिल्प सहायक", placeholder: "कला और शिल्प के बारे में पूछें...", send: "भेजें" },
      es: { title: "🦚 Asistente de Artesanía", placeholder: "Pregunta sobre arte y artesanía...", send: "Enviar" },
      fr: { title: "🦚 Assistant Artisanat", placeholder: "Demander sur l'Art & Artisanat...", send: "Envoyer" },
      ar: { title: "🦚 مساعد الحرف اليدوية", placeholder: "اسأل عن الفن والحرف...", send: "إرسال" },
      bn: { title: "🦚 হস্তশিল্প সহায়ক", placeholder: "শিল্প ও হস্তশিল্প সম্পর্কে জিজ্ঞাসা করুন...", send: "পাঠান" },
      pt: { title: "🦚 Assistente de Artesanato", placeholder: "Pergunte sobre arte e artesanato...", send: "Enviar" },
      ru: { title: "🦚 Помощник по ремеслам", placeholder: "Спросите об искусстве и ремесле...", send: "Отправить" },
      ja: { title: "🦚 クラフトアシスタント", placeholder: "アート＆クラフトについて質問...", send: "送信" },
      de: { title: "🦚 Handwerksassistent", placeholder: "Fragen Sie nach Kunst & Handwerk...", send: "Senden" },
      ur: { title: "🦚 دستکاری معاون", placeholder: "فن اور دستکاری کے بارے میں پوچھیں...", send: "بھیجیں" },
      id: { title: "🦚 Asisten Kerajinan", placeholder: "Tanyakan tentang seni & kerajinan...", send: "Kirim" },
      tr: { title: "🦚 El Sanatları Asistanı", placeholder: "Sanat ve El Sanatları hakkında sor...", send: "Gönder" },
      ta: { title: "🦚 கைவினை உதவியாளர்", placeholder: "கலை & கைவினை பற்றி கேளுங்கள்...", send: "அனுப்பு" }
    };

    function updateLanguage() {
      const lang = document.getElementById("languageSelect").value;
      document.getElementById("title").innerText = translations[lang].title;
      document.getElementById("userInput").placeholder = translations[lang].placeholder;
      document.getElementById("sendBtn").innerText = translations[lang].send;
    }

    // Suggestions
    const suggestions = ["Kondapalli dolls","Madhubani painting","Warli art","Phad painting","Blue pottery","Pattachitra","Channapatna toys","Kalamkari","Block printing","Terracotta craft"];
    const suggestionsBar = document.getElementById("suggestionsBar");
    suggestions.forEach(s => {
      const pill = document.createElement("button");
      pill.className = "suggestion-pill";
      pill.innerText = s;
      pill.onclick = () => {
        document.getElementById("userInput").value = s;
        setTimeout(() => sendMessage(), 120);
      };
      suggestionsBar.appendChild(pill);
    });

    let lastBotReply = "";
  async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const message = inputField.value;

  // ✅ Add this line right here
  const lang = document.getElementById("languageSelect").value;


  if (!message.trim()) return;

  // Show user message
  let userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = message;
  chatbox.appendChild(userMsg);
  chatbox.scrollTop = chatbox.scrollHeight;

  inputField.value = "";

  try {
    // ✅ Fix body: include lang
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang })   // include lang
    });

    const data = await res.json();

    let botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.innerHTML = data.reply;
    chatbox.appendChild(botMsg);
    chatbox.scrollTop = chatbox.scrollHeight;

    lastBotReply = data.reply;

  } catch (err) {
    let errorMsg = document.createElement("div");
    errorMsg.className = "message bot";
    errorMsg.innerText = "⚠️ Error: Could not reach server.";
    chatbox.appendChild(errorMsg);
  }
}


    
let isSpeaking = false;
let isPaused = false;
let currentUtterance = null;

function playVoice() {
  if (!lastBotReply) {
    alert("No message to speak yet!");
    return;
  }

  // If paused → resume
  if (isPaused) {
    window.speechSynthesis.resume();
    isPaused = false;
    return;
  }

  // If already speaking → pause
  if (isSpeaking) {
    window.speechSynthesis.pause();
    isPaused = true;
    return;
  }

  // Fresh start
  window.speechSynthesis.cancel(); // clear old utterances
  const text = stripHtml(lastBotReply);
  currentUtterance = new SpeechSynthesisUtterance(text);

  currentUtterance.onend = () => {
    isSpeaking = false;
    isPaused = false;
    currentUtterance = null;
  };

  window.speechSynthesis.speak(currentUtterance);
  isSpeaking = true;
  isPaused = false;
}

// Utility: remove HTML tags
function stripHtml(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}





    function startListening() 
    { const langCode = document.querySelector("#languageSelect option:checked").dataset.lang;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Speech recognition API not supported in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = langCode;
    recognition.start();

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById("userInput").value = transcript;
      sendMessage();
    };

    recognition.onerror = function(e) {
      console.log("Speech recognition error", e);
    };


  }