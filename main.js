document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("promptInput");
  const outputField = document.getElementById("output");
  const generateBtn = document.getElementById("generateBtn");

  generateBtn.addEventListener("click", () => {
    const prompt = inputField.value.trim();

    if (!prompt) {
      outputField.innerText = "⚠️ Please enter a prompt.";
      return;
    }

    outputField.innerText = "⚙️ Running Boss AI sequence...\n";

    setTimeout(() => {
      outputField.innerText += `📥 Manager AI: Received "${prompt}"\n`;
    }, 500);

    setTimeout(() => {
      outputField.innerText += `✍️ Script AI: Writing script...\n`;
    }, 1000);

    setTimeout(() => {
      outputField.innerText += `🎙️ Voiceover AI: Generating narration...\n`;
    }, 1500);

    setTimeout(() => {
      outputField.innerText += `🎞️ Clipper AI: Selecting visuals...\n`;
    }, 2000);

    setTimeout(() => {
      outputField.innerText += `📜 Legal AI: Reviewing for compliance...\n`;
    }, 2500);

    setTimeout(() => {
      outputField.innerText += `⬆️ Upload AI: Preparing for posting...\n`;
    }, 3000);

    setTimeout(() => {
      outputField.innerText += `✅ Success: Final video generated for "${prompt}"`;
    }, 3500);
  });
});
