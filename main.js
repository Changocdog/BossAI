document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector("input");
  const outputField = document.querySelector("textarea");
  const playBtn = document.querySelector(".play-btn");

  const buttons = {
    "Task AI": "✅ Task AI is analyzing your input...",
    "Script AI": "✍️ Script AI is writing your script...",
    "Voiceover AI": "🎙️ Voiceover AI is generating the audio...",
    "Clipper AI": "🎬 Clipper AI is assembling the video...",
    "Upload AI": "📤 Upload AI is preparing your content for posting...",
    "Legal AI": "⚖️ Legal AI is checking compliance and copyright...",
    "Manager AI": "📊 Manager AI is optimizing strategy and scheduling...",
    "Research AI": "🔍 Research AI is collecting trending data..."
  };

  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const inputText = inputField.value.trim();
      const aiName = btn.innerText.trim();

      if (buttons[aiName]) {
        outputField.value = buttons[aiName] + (inputText ? `\nQuery: “${inputText}”` : "");
      } else if (aiName === "Play Voiceover") {
        outputField.value = "🔊 Playing generated voiceover audio...";
      }
    });
  });
});
