document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector("#input");
  const outputField = document.querySelector("#output");
  const playBtn = document.querySelector(".play-btn");

  const buttons = {
    "🧠 Task AI": "Task AI is analyzing your input...",
    "✍️ Script AI": "Script AI is writing your script...",
    "🎙️ Voiceover AI": "Voiceover AI is generating audio...",
    "🎬 Clipper AI": "Clipper AI is assembling your video...",
    "📤 Upload AI": "Upload AI is preparing your content...",
    "⚖️ Legal AI": "Legal AI is checking compliance...",
    "📊 Manager AI": "Manager AI is optimizing your brand...",
    "🔍 Research AI": "Research AI is finding trends...",
  };

  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const inputText = inputField.value.trim();
      const aiName = btn.innerText.trim();

      if (buttons[aiName]) {
        outputField.value = buttons[aiName] + (inputText ? `

Query: ${inputText}` : "");
      } else if (aiName === "▶️ Play Voiceover") {
        outputField.value = "🔊 Playing generated voiceover audio...";
      }
    });
  });
});
