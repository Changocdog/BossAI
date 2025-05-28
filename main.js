
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.querySelector("#input");
  const outputField = document.querySelector("#output");
  const playBtn = document.querySelector(".play-btn");

  const responses = {
    "Task AI": "Task AI is analyzing your input...",
    "Script AI": "Script AI is writing your script...",
    "Voiceover AI": "Voiceover AI is generating the audio...",
    "Clipper AI": "Clipper AI is assembling the video...",
    "Upload AI": "Upload AI is preparing content for posting...",
    "Legal AI": "Legal AI is checking compliance and copyright...",
    "Manager AI": "Manager AI is optimizing strategy...",
    "Research AI": "Research AI is collecting trending data..."
  };

  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.innerText.trim().replace("▶️", "").trim();
      const input = inputField.value.trim();
      if (responses[label]) {
        outputField.value = `${responses[label]}\n\nQuery: ${input}`;
      } else if (label === "Play Voiceover") {
        outputField.value = "🔊 Playing generated voiceover audio...";
      }
    });
  });
});
