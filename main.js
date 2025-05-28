document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("prompt");
  const generateBtn = document.getElementById("generateBtn");
  const outputArea = document.getElementById("output");

  generateBtn.addEventListener("click", () => {
    const prompt = inputField.value.trim();
    if (!prompt) {
      outputArea.innerText = "⚠️ Please enter a prompt.";
      return;
    }

    outputArea.innerText = "🧠 Manager AI is analyzing...";

    // Simulate flow of AI modules
    setTimeout(() => {
      outputArea.innerText =
        "✅ Script AI has written a video script.\n🎤 Voiceover AI is generating voice.\n✂️ Clipper AI is assembling video...\n\n🎬 Final video output ready for preview!";
    }, 2000);
  });
});
