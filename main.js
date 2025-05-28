document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector("textarea");
  const outputField = document.getElementById("output");
  const generateBtn = document.getElementById("generateBtn");

  generateBtn.addEventListener("click", () => {
    const prompt = inputField.value.trim();

    if (prompt === "") {
      outputField.innerText = "Please enter a prompt.";
      return;
    }

    // Simulate each AI step
    const simulatedWorkflow = `
📥 Manager AI: Received task "${prompt}"
✍️ Script AI: Writing script...
🎙️ Voiceover AI: Converting script to audio...
🎞️ Clipper AI: Selecting dynamic visuals...
📜 Legal AI: Checking for copyright issues...
⬆️ Upload AI: Preparing for post...
✅ Final Output: Video generated on "${prompt}"`;

    outputField.innerText = simulatedWorkflow;
  });
});
